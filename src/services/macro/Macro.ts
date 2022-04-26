import { genKey, Key } from '../../components/configure/keycodekey/KeyGen';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { KeycodeCompositionFactory } from '../hid/Composition';
import { cloneUint8Array } from '../../utils/ArrayUtils';
import { IKeymap } from '../hid/Hid';

export const MacroTap = 'tap';
export const MacroHold = 'hold';
export type TapHoldType = typeof MacroTap | typeof MacroHold;
export type Tap = {
  key: Key;
  type: typeof MacroTap;
};

export type Hold = {
  keys: Key[];
  type: typeof MacroHold;
};

export type MacroKey = Tap | Hold;

export const isTap = (item: Tap | Hold): item is Tap => {
  return item.type === MacroTap;
};

export const isHold = (item: Tap | Hold): item is Hold => {
  return item.type === MacroHold;
};

export function encodeMacroText(macroKeys: MacroKey[]): string {
  function escape(char: string): string {
    if (char === ',') {
      return '\\,';
    }
    return char;
  }
  const textList: string[] = [];
  macroKeys.forEach((macro) => {
    if (isTap(macro)) {
      textList.push(escape(macro.key.label));
    } else if (isHold(macro)) {
      const holdLabel = `{${macro.keys
        .map((key) => escape(key.label))
        .join(',')}}`;
      textList.push(holdLabel);
    }
  });
  return textList.join(',');
}

export type IGetMacroKeysResult = {
  success: boolean;
  error?: string;
  macroKeys: MacroKey[];
};

export const END_OF_MACRO_BYTES = 0;
export const SS_TAP_CODE = 1;
export const SS_DOWN_CODE = 2;
export const SS_UP_CODE = 3;

export interface IMacro {
  /**
   * The index number of the macro.
   * The first index number is 0.
   * This number never be over the (max macro count - 1).
   */
  readonly index: number;
  getBytes(): Uint8Array;
  // eslint-disable-next-line no-unused-vars
  generateMacroKeys(labelLang: KeyboardLabelLang): IGetMacroKeysResult;
  generateMacroText(): string;
  // eslint-disable-next-line no-unused-vars
  updateMacroKeys(macroKeys: MacroKey[]): void;
}

export function convertQmkLabel(key: Key): Key {
  const codeA = 4; // KC_A
  const codeZ = 29; // KC_Z
  const code = key.keymap.code;
  if (codeA <= code && code <= codeZ) {
    key.label = key.label.toLowerCase();
  }
  return key;
}

function genKeyWithQmkLabel(
  keymap: IKeymap,
  langLabel: KeyboardLabelLang
): Key {
  const key = genKey(keymap, langLabel);
  return convertQmkLabel(key);
}

export class Macro implements IMacro {
  readonly index: number;
  private bytes: Uint8Array;
  private macroBuffer: IMacroBuffer;

  constructor(macroBuffer: IMacroBuffer, index: number, bytes: Uint8Array) {
    this.macroBuffer = macroBuffer;
    this.index = index;
    this.bytes = bytes;
  }

  getBytes(): Uint8Array {
    return this.bytes;
  }

  generateMacroKeys(labelLang: KeyboardLabelLang): IGetMacroKeysResult {
    if (this.bytes.length === 0) {
      return {
        success: false,
        error: 'The bytes length is 0.',
        macroKeys: [],
      };
    }
    const macroKeys: MacroKey[] = [];
    const byteLength = this.bytes.length;
    let pos = 0;
    let existsNullAtEnd = false;
    let holdKeys: Key[] = [];
    const holdStack: Key[] = [];
    while (pos < byteLength) {
      if (this.bytes[pos] === SS_TAP_CODE) {
        const keycodeCompositionFactory = new KeycodeCompositionFactory(
          this.bytes[++pos],
          labelLang
        );
        const basicComposition =
          keycodeCompositionFactory.createBasicComposition();
        const keymap = basicComposition.genKeymap()!;
        const key = genKeyWithQmkLabel(keymap, labelLang);
        macroKeys.push({ key, type: 'tap' });
      } else if (this.bytes[pos] === SS_DOWN_CODE) {
        const keycodeCompositionFactory = new KeycodeCompositionFactory(
          this.bytes[++pos],
          labelLang
        );
        const basicComposition =
          keycodeCompositionFactory.createBasicComposition();
        const keymap = basicComposition.genKeymap()!;
        const key = genKeyWithQmkLabel(keymap, labelLang);
        holdKeys.push(key);
        holdStack.push(key);
      } else if (this.bytes[pos] === SS_UP_CODE) {
        const lastHoldKey = holdStack.pop();
        if (!lastHoldKey) {
          return {
            success: false,
            error: 'Invalid a special code for hold key (down key not exists).',
            macroKeys: [],
          };
        } else if (lastHoldKey.keymap.code !== this.bytes[++pos]) {
          return {
            success: false,
            error: 'Invalid a byte combination for hold key.',
            macroKeys: [],
          };
        }
        if (holdStack.length === 0) {
          macroKeys.push({ keys: holdKeys, type: 'hold' });
          holdKeys = [];
        }
      } else if (this.bytes[pos] === END_OF_MACRO_BYTES) {
        if (holdStack.length > 0) {
          return {
            success: false,
            error: 'Invalid a special code for hold key (up key not exists).',
            macroKeys: [],
          };
        }
        existsNullAtEnd = true;
        break;
      } else {
        if (holdStack.length > 0) {
          return {
            success: false,
            error: 'Invalid a special code for hold key (up key not exists).',
            macroKeys: [],
          };
        }
        const keycodeCompositionFactory = new KeycodeCompositionFactory(
          this.bytes[pos],
          labelLang
        );
        if (keycodeCompositionFactory.isAscii()) {
          const asciiComposition =
            keycodeCompositionFactory.createAsciiKeycodeComposition();
          const keymap = asciiComposition.genKeymap()!;
          const key = genKey(keymap, labelLang);
          macroKeys.push({ key, type: 'tap' });
        } else {
          return {
            success: false,
            error: 'non ascii code detected.',
            macroKeys: [],
          };
        }
      }
      pos++;
    }
    if (!existsNullAtEnd) {
      return {
        success: false,
        error: 'Not end with a null character.',
        macroKeys: [],
      };
    }
    return {
      success: true,
      macroKeys,
    };
  }

  generateMacroText(): string {
    return '';
  }

  updateMacroKeys(macroKeys: MacroKey[]) {
    let bytes: number[] = [];
    for (const macroKey of macroKeys) {
      if (macroKey.type === 'tap') {
        if (!macroKey.key.keymap.isAscii) {
          bytes.push(SS_TAP_CODE);
        }
        bytes.push(macroKey.key.keymap.code);
      } else {
        // hold
        const downBytes: number[] = [];
        let upBytes: number[] = [];
        for (const key of macroKey.keys) {
          downBytes.push(SS_DOWN_CODE);
          downBytes.push(key.keymap.code);
          upBytes = [SS_UP_CODE, key.keymap.code, ...upBytes];
        }
        bytes = [...bytes, ...downBytes, ...upBytes];
      }
    }
    bytes.push(END_OF_MACRO_BYTES);
    this.bytes = new Uint8Array(bytes);
    this.macroBuffer.updateMacro(this);
  }
}

export interface IMacroBuffer {
  /**
   * Generate macro definition list with the byte array which this macro buffer has.
   */
  generateMacros(): IMacro[];

  /**
   * Update bytes with the specified macro definition.
   * The result of `getBytes()` and `generateMacros()` methods will be changed
   * after calling this method.
   */
  // eslint-disable-next-line no-unused-vars
  updateMacro(macro: IMacro): void;

  /**
   * Return the byte array which this macro buffer has.
   */
  getBytes(): Uint8Array;
}

export class MacroBuffer implements IMacroBuffer {
  private bytes: Uint8Array;
  private maxMacroCount: number;
  private maxMacroBufferSize: number;

  /**
   * The specified bytes is cloned and is kept it in this instance.
   */
  constructor(
    bytes: Uint8Array,
    maxMacroCount: number,
    maxMacroBufferSize: number
  ) {
    this.bytes = cloneUint8Array(bytes);
    this.maxMacroCount = maxMacroCount;
    this.maxMacroBufferSize = maxMacroBufferSize;
  }

  getBytes(): Uint8Array {
    return this.bytes;
  }

  getMaxMacroCount(): number {
    return this.maxMacroCount;
  }

  getMaxMacroBufferSize(): number {
    return this.maxMacroBufferSize;
  }

  generateMacros(): IMacro[] {
    if (this.maxMacroBufferSize === 0) {
      return [];
    }
    if (this.maxMacroCount === 0) {
      return [];
    }

    const macros: IMacro[] = [];
    let start = 0;
    let index = 0;
    for (let i = 0; i < this.bytes.length; i++) {
      if (this.bytes[i] === END_OF_MACRO_BYTES) {
        macros.push(new Macro(this, index, this.bytes.slice(start, i + 1)));
        start = i + 1;
        index += 1;
      }
      if (this.maxMacroCount < index + 1) {
        break;
      }
    }
    if (macros.length < this.maxMacroCount) {
      const remaining = this.maxMacroCount - macros.length;
      for (let i = 0; i < remaining; i++) {
        macros.push(
          new Macro(this, index++, new Uint8Array([END_OF_MACRO_BYTES]))
        );
      }
    }
    return macros;
  }

  updateMacro(macro: IMacro): void {
    const macros = this.generateMacros();
    macros[macro.index] = macro;
    const bytesArray: Uint8Array[] = macros.map((macro) => macro.getBytes());
    const resultLength = bytesArray.reduce((sum, array) => {
      sum = sum + array.length;
      return sum;
    }, 0);
    const result = new Uint8Array(resultLength);
    let offset = 0;
    for (let i = 0; i < bytesArray.length; i++) {
      result.set(bytesArray[i], offset);
      offset = offset + bytesArray[i].length;
    }
    this.bytes = result;
  }
}
