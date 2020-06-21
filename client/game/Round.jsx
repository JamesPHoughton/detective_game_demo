import React from "react";
import PlayerProfile from "./PlayerProfile.jsx";
import SocialExposure from "./SocialExposure.jsx";
import Exposition from "./Exposition.jsx";
import Workspace from "./Workspace";
import {DragDropContext} from "react-beautiful-dnd";
import styled from "styled-components";

import { AlertToaster } from "meteor/empirica:core";

const gameSound = new Audio("doorbell.mp3");
const idleSound = new Audio("horn.mp3");

const Container = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: row;
`;

export default class Round extends React.Component {
  state = { sourceNB: null, sourcePlayer: null, activeClue: null}

  componentDidMount() {
    const {player} = this.props
    player.log("navigation","Pageload")
    gameSound.play();
  }
  componentWillUnmount() {
    // ensure that the timeout horn and message don't
    //play in the exit steps
    clearTimeout(this.timeout);
  }

  onDragStart = start => {
    // have to separate this out from 'onDragEnd' because
    // sometimes a neighbor will change their notebook during one
    // of our drags, in which case, we'll get the wrong element.
    const {player, game} = this.props;
    const {source, draggableId} = start;
    const notebooks = player.get("notebooks");
    const notebookOrder = player.get("notebookOrder");

    // identify the source notebook object
    var sourceNB;
    var sourcePlayer;
    if (notebookOrder.includes(source.droppableId)) { // From own notebook
      sourceNB = notebooks[source.droppableId];
    } else if (game.playerIds.includes(source.droppableId)) { // From a neighbor
      sourcePlayer = _.find(game.players, plr => {
        return plr._id === source.droppableId;
      });
      sourceNB = sourcePlayer.get("notebooks")["promising_leads"];
    }
    // identify the clue
    var activeClue = sourceNB.clueIDs[source.index];
    // this weird syntax is supposed to force a synchronous update.
    // from https://medium.com/@baphemot/understanding-reactjs-setstate-a4640451865b
    this.setState((state) => ({'sourceNB':sourceNB,
                               'sourcePlayer':sourcePlayer,
                               'activeClue':activeClue}))

     // log the pickup
     player.log("pickup", {
       clue: activeClue,
       source: source.droppableId,
     })

  }


  onDragEnd = result => {
    const {player, game} = this.props;
    var {sourceNB, sourcePlayer, activeClue} = this.state
    const notebookOrder = player.get("notebookOrder");
    const {destination, source, draggableId} = result;
    const notebooks = player.get("notebooks");
    if (!destination) {
      return;
    }
    // if source and destination are the same
    // or if destination is not allowed
    if (
      (destination.droppableId === source.droppableId &&
        destination.index === source.index) ||
      notebookOrder.includes(destination.droppableId) == false
    ) {
      // make no changes
      return;
    }
    // identify the destination notebook object
    var destNB;
    if (notebookOrder.includes(destination.droppableId)) {
      destNB = notebooks[destination.droppableId];
    } else if (game.playerIds.includes(dest.droppableId)) {
      return; // can't drag into one of the neighbor notebooks
    }

    // check that the activeClue loaded properly
    // if not, try again.
    if (!(activeClue in game.get('clues'))) {
      var activeClue = sourceNB.clueIDs[source.index];
    }
    if (!(activeClue in game.get('clues'))) {
      // if you fail twice, return 0
        return 0
    }

    // remove clue from all player notebooks
    // (we know at this point that the clue will be added to the workspace,
    // and we'll need to reorder it anyways)
    var numNotebooks = notebookOrder.length;
    for (var i = 0; i < numNotebooks; i++) {
      var nb = notebookOrder[i];
      const clueList = notebooks[nb].clueIDs;
      if (clueList.includes(activeClue)) {
        const newClueList = _.filter(clueList, c => c != activeClue);
        notebooks[nb].clueIDs = newClueList;
      }
    }
    // add clue to the appropriate place in the workspace
    notebooks[destination.droppableId].clueIDs.splice(
      destination.index,
      0,
      activeClue
    );
    // update the player's workspace
    player.set("notebooks", notebooks);

    // log the change using empirica logs
    player.log("drop", {
      clue: activeClue,
      source: source.droppableId,
      dest: destination.droppableId,
      destIndex: destination.index
    })

    // reset state
    // this weird syntax is supposed to force a synchronous update.
    // from https://medium.com/@baphemot/understanding-reactjs-setstate-a4640451865b
    this.setState((state) => ({ 'sourceNB': null,
                                'sourcePlayer': null,
                                'activeClue': null}) )
    // force rerender
    this.forceUpdate();
  };

  goneIdle = () => {
    const {player} = this.props;
    idleSound.play();
    if (player.get("activity") == "active") {
      AlertToaster.show({
        message:`You have been idle for 60 seconds. If you don't play, then your collaborators
         may have a negative experience, or miss their group bonus. If you don't
         return to the game in 60 seconds, or you become idle again, your HIT
         may be rejected.
         `});
      player.append("log", {
        event: "idle",
        data: {},
        at: new Date()
      });
      player.set("active", "idle once");
    } else if (player.get("activity") == "idle once") {
      AlertToaster.show({
        message:`This is the second time you have been idle for more than 60 seconds.
          We are sorry to have to reject your HIT.`
      });
      player.set("active", "idle twice");
    }
  };

  // This checks for mouse movement over the content in the page, but
  // doesn't penalize for switching to another tab. Could do that differently...
  timeout = undefined;
  mouseIsMoved = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.goneIdle, 60000);
  };

  render() {
    const {round, stage, player, game} = this.props;
    // if (player.idle) {
    //   this.goneIdle()
    // }

    return (
      <div className="round">
        <div className="content" onMouseMove={this.mouseIsMoved}>
          {stage.name != "training" && <PlayerProfile player={player} stage={stage} game={game} />}

          <DragDropContext onDragEnd={this.onDragEnd}
                           onDragStart={this.onDragStart}>
            <Container>
              {stage.name != "memo" && <Workspace game={game} player={player} /> }
              {stage.name != "memo" && <SocialExposure stage={stage} player={player} game={game} />}
              {stage.name == "memo" && <Exposition player={player} game={game} />}
            </Container>
          </DragDropContext>
        </div>
      </div>
    );
  }
}
