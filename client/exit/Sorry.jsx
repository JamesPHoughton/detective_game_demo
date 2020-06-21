import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button } from "@blueprintjs/core";
import styled from 'styled-components';

const Description = styled.div`
  max-width: 650px;
`

export default class Sorry extends React.Component {
  static stepName = "Sorry";

  render() {
    const { player, hasNext, onSubmit } = this.props;

    return (
      <Centered>
        <div className="score">
          <h1>Sorry!</h1>

          <p>Sorry, you were not able to play today!</p>

          {(player.exitStatus === "gameLobbyTimedOut" ||
            player.exitStatus === "gameCancelled")
            ? (<Description>
               <p>
                 The game was not able to launch.
               </p>
               <p>
                 Please submit <strong>{player._id}</strong> as the survey code in order
                 to receive the $1 training payment.
               </p>
               </Description>
             )
            : player.exitStatus === "playerEndedLobbyWait"
            ? (<p>
                 You decided to stop waiting, we are sorry it was too long a wait.
               </p>)
            : player.exitStatus === "gameFull"
            ? (<Description>
                <p>
                All the games filled up too quickly.
                </p>
                <p>
                Please submit <strong>DGFull_7hl8Gp2</strong> as the survey code in
                order to receive the $1.00 training payment.
                </p>
              </Description>
              )
            : null
          }

        </div>
      </Centered>
    );
  }
}
