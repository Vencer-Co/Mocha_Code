import { connect } from 'react-redux';
import {
  IFirmwareCodePlace,
  KeyboardsPhase,
  RootState,
} from '../../../store/state';
import CreateDefinition from './CreateDefinition';
import {
  KeyboardsAppActions,
  KeyboardsCreateDefinitionActions,
} from '../../../actions/keyboards.actions';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { storageActionsThunk } from '../../../actions/storage.action';
import { IKeyboardDefinitionAuthorType } from '../../../services/storage/Storage';

const mapStateToProps = (state: RootState) => {
  return {
    jsonFilename: state.keyboards.createdefinition.jsonFilename,
    keyboardDefinition: state.keyboards.createdefinition.keyboardDefinition,
    productName: state.keyboards.createdefinition.productName,
    agreement: state.keyboards.createdefinition.agreement,
    firmwareCodePlace: state.keyboards.createdefinition.firmwareCodePlace,
    forkedRepositoryUrl: state.keyboards.createdefinition.forkedRepositoryUrl,
    forkedRepositoryEvidence:
      state.keyboards.createdefinition.forkedRepositoryEvidence,
    otherPlaceHowToGet: state.keyboards.createdefinition.otherPlaceHowToGet,
    otherPlaceSourceCodeEvidence:
      state.keyboards.createdefinition.otherPlaceSourceCodeEvidence,
    otherPlacePublisherEvidence:
      state.keyboards.createdefinition.otherPlacePublisherEvidence,
    qmkRepositoryFirstPullRequestUrl:
      state.keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl,
    contactInformation: state.keyboards.createdefinition.contactInformation,
    organizations: Object.values(state.entities.organizationMap),
    authorType: state.keyboards.createdefinition.authorType,
    organizationId: state.keyboards.createdefinition.organizationId,
    organizationEvidence: state.keyboards.createdefinition.organizationEvidence,
  };
};
export type CreateKeyboardStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateJsonFilename: (jsonFilename: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateJsonFilename(jsonFilename)
      );
    },
    updateJsonString: (jsonStr: string) => {
      _dispatch(KeyboardsCreateDefinitionActions.updateJsonString(jsonStr));
    },
    updateKeyboardDefinition: (
      keyboardDefinition: KeyboardDefinitionSchema
    ) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateKeyboardDefinition(
          keyboardDefinition
        )
      );
    },
    updateProductName: (productName: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateProductName(productName)
      );
    },
    saveAsDraft: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.createKeyboardDefinitionAsDraft());
    },
    submitForReview: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.createAndSubmitKeyboardDefinition());
    },
    backToList: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    },
    updateAgreement: (agreement: boolean) => {
      _dispatch(KeyboardsCreateDefinitionActions.updateAgreement(agreement));
    },
    updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateFirmwareCodePlace(
          firmwareCodePlace
        )
      );
    },
    updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateForkedRepositoryUrl(
          forkedRepositoryUrl
        )
      );
    },
    updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateForkedRepositoryEvidence(
          forkedRepositoryEvidence
        )
      );
    },
    updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateOtherPlaceHowToGet(
          otherPlaceHowToGet
        )
      );
    },
    updateOtherPlaceSourceCodeEvidence: (
      otherPlaceSourceCodeEvidence: string
    ) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateOtherPlaceSourceCodeEvidence(
          otherPlaceSourceCodeEvidence
        )
      );
    },
    updateOtherPlacePublisherEvidence: (
      otherPlacePublisherEvidence: string
    ) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateOtherPlacePublisherEvidence(
          otherPlacePublisherEvidence
        )
      );
    },
    updateQmkRepositoryFirstPullRequestUrl: (
      qmkRepositoryFirstPullRequest: string
    ) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateQmkRepositoryFirstPullRequestUrl(
          qmkRepositoryFirstPullRequest
        )
      );
    },
    updateContactInformation: (contactInformation: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateContactInformation(
          contactInformation
        )
      );
    },
    updateAuthorType: (authorType: IKeyboardDefinitionAuthorType) => {
      _dispatch(KeyboardsCreateDefinitionActions.updateAuthorType(authorType));
    },
    updateOrganizationId: (organizationId: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateOrganizationId(organizationId)
      );
    },
    updateOrganizationEvidence: (organizationEvidence: string) => {
      _dispatch(
        KeyboardsCreateDefinitionActions.updateOrganizationEvidence(
          organizationEvidence
        )
      );
    },
  };
};
export type CreateKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CreateDefinition);
