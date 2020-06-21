import React from "react";
import {Link} from "react-router-dom";
import {IconNames} from "@blueprintjs/icons";

import {
  Button,
  Classes,
  Dialog,
  Icon,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Intent
} from "@blueprintjs/core";

export default class Header extends React.Component {
  state = { isOpen: false };

  handleToggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    return (
      <Navbar className={["header", Classes.DARK].join(" ")}>
        <NavbarGroup align="left">
          <NavbarHeading>
            <Link
              className={[
                Classes.BUTTON,
                Classes.LARGE,
                Classes.MINIMAL,
                Classes.BUTTON
              ].join(" ")}
              to="/"
            >
              <img src="mit_logo.svg" height="30px"/>
              <span className={Classes.BUTTON_TEXT}>The Detective Game</span>
            </Link>
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align="right">
          <Button
            text="About"
            minimal
            icon={IconNames.info_sign}
            onClick={this.handleToggleDialog}
          />

          <Dialog
            icon={IconNames.INBOX}
            isOpen={this.state.isOpen}
            onClose={this.handleToggleDialog}
            title="About the Detective Game"
          >
            <div className={Classes.DIALOG_BODY}>
            <p>
            Identify which clues are <strong>Promising Leads</strong> by dragging them into the
            appropriate place in your detective's notebook.
            </p>
            <p>
            When you categorize a clue as a promising lead it will be shared
            with your collaborators.
            </p>
            <p>
            You are rewarded both for your individual performance, and the
            performance of your team as a whole.
            </p>
            <p>
            This game is played in real-time, so please give it your full attention.
            If you don't play actively, your collaborators will have a negative
            experience of the game, and may lose part of their bonus.
            If you are inactive for more than 60 seconds during the game, you will
            receive an alert. If you don't return to the game, or you become idle
            again, your HIT may be rejected.
            </p>
            <p>
            If you have any questions regarding this study, email
            detective@mit.edu.
            </p>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  text="Close"
                  intent={Intent.PRIMARY}
                  onClick={this.handleToggleDialog}
                />
              </div>
            </div>
          </Dialog>
        </NavbarGroup>
      </Navbar>
    );
  }
}
