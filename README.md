# Remap

The product named "Remap" is a keyboard customization app to utilize keyboards more for people who are interested in self-made keyboard kits.

The people can find favorite keyboards and can customize the key mapping and others of the keyboard easily, and their features are available from Web browsers directly.

[Remap Production Site](https://remap-keys.app)

![Screenshot from 2021-03-14 10-28-30](https://user-images.githubusercontent.com/261787/111054447-1bc5f200-84b0-11eb-8bc6-3df9e198d0dd.png)

## Mission

Remap provides information and features to help people who want to leverage a self-made keyboard kit.

## Target Users

People who want to find, buy, build and leverage a self-made keyboard kit.

## Goal

The target users become to be able to find a favorite keyboard, be able to success to build bought keyboard, be able to customize it more easily and freely.

## For Developers

Developers can start a development of Remap locally by the following step:

1. Install NodeJS version 12 or higher.
2. Install `yarn` command with `npm install -g yarn`.
3. Run `yarn install`.
4. Run `yarn start`.
5. Open the `http://localhost:3000` in the Chrome or Edge Stable 89 or higher.

As a limitation, the launched Remap locally cannot access to Firebase backend server. Therefore, the developer needs to import a keyboard definition JSON file from local every times at opening a keyboard.

We're using Prettier to format codes. Execute the `yarn format` before committing and pushing your code. Or, you can use auto-formatting feature with the Prettier for your IDE.

Before contributing, read the [How to become a contributor and submit your own code](https://github.com/remap-keys/remap/blob/main/CONTRIBUTING.md) document.

## References

### WebHID

This software communicates with a keyboard with the WebHID API provided by a Web browser. The specification document of the WebHID API is: [WebHID API - Draft Community Group Report 23 October 2020](https://wicg.github.io/webhid/)

The WebHID has already been available from Google Chrome and Microsoft Edge version 89 stable or higher.

### QMK Firmware

The target of this software is a keyboard with the QMK Firmware. The QMK Firmware provides some features for a VIA client application via the RawHID feature.

- [Raw HID](https://docs.qmk.fm/#/feature_rawhid)

Also, you can find the entry points of the features in the following code:

- [qmk_firmware/via.c at master · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/blob/master/quantum/via.c#L202)
