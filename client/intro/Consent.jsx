import React from "react";

import { Centered, ConsentButton } from "meteor/empirica:core";
import styled from 'styled-components';


const Description = styled.div`
  max-width: 650px;
`

export default class Consent extends React.Component {
  render() {
    return (
      <Description>
        <div className="consent">
          <h2> About this study </h2>
          <p>
           This study takes 20-30 minutes.
          </p>

          <p>
          You may play a collaborative game with other Mechanical Turk workers.
          </p>

          <p>
          The game is over-subscribed to shorten waiting times.
         </p>

         <p>
          You will be paid for training, even if you don't get to play.
        </p>


          <h2> What you need to do </h2>
          <p>
          1. Please use a computer, not a mobile device.
          </p>

          <p>
          2. When the game starts, please give it your full attention.
          </p>

          <p>
          3. <strong>If you don't play actively, your
          team members may lose part of their bonus.</strong>
          </p>

          <h2> Consent to participate </h2>
          <p><i>
          This HIT is part of a MIT scientific research project. Your decision
          to complete this HIT is voluntary. There is no way for us to identify
          you. The only information we will have, in addition to your responses,
          is the time at which you completed the survey. The results of the
          research may be presented at scientific meetings or published in
          scientific journals. Clicking on the 'SUBMIT' button on the bottom
          of this page indicates that you are at least 18 years of age and
          agree to complete this HIT voluntarily.
          </i></p>
          <br />
          <ConsentButton text="I AGREE" />
        </div>
      </Description>
    );
  }
}
