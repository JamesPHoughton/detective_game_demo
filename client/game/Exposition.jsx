import React from "react";
import styled from 'styled-components';
import Workspace from "./Workspace";
import { DragDropContext } from 'react-beautiful-dnd';
import { AlertToaster } from "meteor/empirica:core";

const Panels = styled.div`
  margin: 3px;
  display: flex;
  flex-direction: row;
`

const Container = styled.div`
  margin: 3px;
  max-width: 650px;
`

const Paper = styled.div`
  margin: 4px;
  border: 1px solid grey;
  border-radius: 2px;
  padding: 15px;
  max-width: 600px;
  max-height: 776px;
  min-height: 775px;
  text-align: center;
`

const Heading = styled.h1`

  border: 4px solid black;
  padding: 15px;
  max-width: 580px;
  text-align: center;
  margin-left: 25px;

`

const Columns = styled.div`
  margin: 3px;
`



export default class Exposition extends React.Component {

  render() {
    const { player, game, stage } = this.props;
    var nodes = game.get("nodes")
    var crimeScene = nodes['CrimeScene_1']
    var stolenObject = nodes['StolenObject_1']
    var fStolenObject = stolenObject.replace(/the /, "")
    var date = new Date()

    return (
      <Panels>
        <DragDropContext onDragEnd={res => {AlertToaster.show({
          message:
            "Dragging is disabled until the game begins."
        });}}>
          <Workspace game={game} player={player} />
        </DragDropContext>

        <Paper>
          <Heading>POLICE BULLETIN</Heading>
          <h2>
          Theft of {fStolenObject.toUpperCase()} from {crimeScene.toUpperCase()}
          </h2>
          <p>{date.toDateString().toUpperCase()}</p>
          <hr/>
          <p>
            A burglary at <strong>{crimeScene}</strong> includes the loss of
            a priceless <strong>{fStolenObject}</strong>.
          </p>
          <p>
            Detectives with Promising Leads are asked to compare notes with
            three collaborators.
          </p>
          <p>
            Determine which leads are true and useful,
            and which are dead ends: lies, mistakes, or just irrelevant.
          </p>
          <p>
            Don't trust any clue. They could all be true, but then they could
            all be lies.
          </p>
          <p>
            You will have 8 minutes to determine who did the burglary and how.
            Then I'll expect your answer.
          </p>

          <img src="sleuth7.png" height="100px"/>

          <p>
            p.s. This is a high-profile theft, and your bonuses are on the line. Remember,
            you get paid for leads you get right, but I'll dock your pay for mistakes.
          </p>
        </Paper>

      </Panels>

    );
  }
}
