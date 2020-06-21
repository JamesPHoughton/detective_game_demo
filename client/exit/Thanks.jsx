import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";
  render() {
    const { player, game } = this.props;
    return (

        <div>
          <h1>Finished!</h1>
          <p>Thank you for participating!</p>
          <h3>Please submit the following code to
          receive your bonus: {player._id}.
          </h3>
        </div>
    );
  }
}
