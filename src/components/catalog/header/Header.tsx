/* eslint-disable no-undef */
import React, { SyntheticEvent } from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import { IconButton } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { ICatalogPhase } from '../../../store/state';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';

type HeaderState = {};
type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
  }

  // eslint-disable-next-line no-unused-vars
  onClickBackButton(event: SyntheticEvent) {
    sendEventToGoogleAnalytics('catalog/back_to_search');
    this.props.goToSearch!();
  }

  render() {
    return (
      <header className="catalog-header">
        <div className="catalog-header-logo-nav">
          {(['introduction', 'keymap', 'firmware'] as ICatalogPhase[]).includes(
            this.props.phase!
          ) ? (
            <div>
              <IconButton
                aria-label="back"
                onClick={this.onClickBackButton.bind(this)}
              >
                <ArrowBackIos />
              </IconButton>
            </div>
          ) : null}
        </div>
        <div className="catalog-header-logo">
          <a href="/">
            <Logo width={100} />
          </a>
        </div>
        <div className="catalog-header-menu-button">
          <ProfileIcon
            logout={() => {
              this.props.logout!();
            }}
          />
        </div>
      </header>
    );
  }
}

export default Header;
