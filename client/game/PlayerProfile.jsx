import React from "react";
import styled from "styled-components";
import Timer from "./Timer.jsx";

export default class PlayerProfile extends React.Component {

  renderGameSidebar(fStolenObject, crimeScene) {
    return (
      <>
        <h3>Your Assignment:</h3>
        <p>
        A priceless <strong> {fStolenObject} </strong> has been stolen
        from <strong>{crimeScene}</strong>.
        </p>
        <p> To solve the mystery, drag clues you think are true into
        the "Promising Leads" section of your notebook, and clues you
        think are false into the "Dead Ends" section.
        </p>
        <p>
        You are <strong>rewarded for each correct "lead", and penalized for each
        incorrect "lead"</strong>, so pay close attention!
        </p>
        <p>
        There is no reward or penalty for "dead ends".
        </p>
      </>
  )}

  renderMemoSidebar() {
    return (
      <>
        Please read the attached police bulletin prior to the game.
      </>
    )
  }

  render() {
    const { player, game, stage } = this.props;
    var nodes = game.get("nodes")
    var crimeScene = nodes['CrimeScene_1']
    var stolenObject = nodes['StolenObject_1']
    var fStolenObject = stolenObject.replace(/the /, "")


    return (
      <aside className="player-profile">
        <img src="player_icon.png" height="100px"/>
        {stage.name != "memo" && this.renderGameSidebar(fStolenObject, crimeScene)}
        {stage.name != "memo" && this.renderMemoSidebar(fStolenObject, crimeScene)}
        <Timer stage={stage} />
      </aside>
    );
  }
}
