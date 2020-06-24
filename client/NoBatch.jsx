import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { Link } from "react-router-dom";

export default class NoBatch extends React.Component {
  render() {
    // Not sure what icon works best:
    // - SMALL_CROSS
    // - BAN_CIRCLE
    // - ERROR
    // - DISABLE
    // - WARNING_SIGN
    return (
      <NonIdealState
        icon={IconNames.ISSUE}
        title="No experiments available"
        description={
          <>
            <p>
              I'm sorry you did not get to play today,
              all experiments have filled too quickly.
              Please enter the code <strong> NB1246 </strong> to receive
              your $0.10 showing up payment.
            </p>
            {Meteor.isDevelopment ? (
              <p>
                Go to <Link to="/admin">Admin</Link> to get started.
              </p>
            ) : (
              ""
            )}
          </>
        }
      />
    );
  }
}
