import React from "react";
import Round from "../game/Round.jsx"
import styled from 'styled-components';
import {GameDummy, solution, clues} from './teaching_game.js'
import Expand from 'react-expand-animated';

const Description = styled.div`
  max-width: 650px;
`

const Container = styled.div`
  margin: 3px;
`
const Boxed = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin: 3px;
  max-width: 700px;
`

const DisplayText = styled.div`
  color: ${props => (props.active ? "black" : "grey")}
  transition: color 1s ease,
`



export default class InstructionStepOne extends React.Component {


  renderStep0(progress) {
    return (
      <DisplayText active={progress == 0}>
        <h3> Step 1: </h3>
        <p> Below is a "Detectives Notebook" containing a number of clues.</p>
        <ul>
          <li>Drag true and useful clues into the <strong> "Promising Leads" </strong> section of the notebook</li>
          <li>Drag false or irrelevant clues into the <strong> "Dead Ends" </strong> section</li>
        </ul>
      </DisplayText>
    )
  }

  renderStep1(progress) {
    return (
      <DisplayText active={progress == 1}>
        <h3> Step 2: </h3>
        <p> You will work with a few close collaborators, who share their "Promising Leads" with you.
          When your collaborator has a clue that is already in your notebook, it
            will be shaded grey.
        </p>
        <ul>
          <li>Drag clues from your collaborators notebooks into your own, categorizing them correctly.</li>
        </ul>
      </DisplayText>
    )
  }


  render() {
    const { hasPrev, hasNext, onNext, onPrev} = this.props;
    const game = new GameDummy();
    const player = game.players[0]
    const nbs = player.get("notebooks")
    var progress = 0
    var allow_continue = false
    if (
      // all categories have something in them
      nbs['promising_leads'].clueIDs.length > 0 &&
      nbs['dead_ends'].clueIDs.length > 0 &&
      // all the clues in true are correctly categorized
      // the player starts with no true clues, so true clues in the solution
      // imply that they successfully dragged from the neighbor
      nbs['promising_leads'].clueIDs.every(cl => solution['promising_leads'].includes(cl)) &&
      nbs['dead_ends'].clueIDs.every(cl => solution['dead_ends'].includes(cl))
    ) {
      progress = 1
    }
    if (
      // all categories have something in them
      nbs['promising_leads'].clueIDs.length > 1 &&
      nbs['dead_ends'].clueIDs.length > 1 &&
      // all the clues in true are correctly categorized
      // the player starts with no true clues, so true clues in the solution
      // imply that they successfully dragged from the neighbor
      nbs['promising_leads'].clueIDs.every(cl => solution['promising_leads'].includes(cl)) &&
      nbs['dead_ends'].clueIDs.every(cl => solution['dead_ends'].includes(cl))
    ) {
      progress = 2
      allow_continue = true
    }

    if (progress == 0){
      player.set("alterIDs", [])
    }

    


    return (
        <Container>
            <Description>
                <h2> Training: Game Play </h2>
                <p>In this game, you will join a team of detectives in solving a mystery.</p>

                <DisplayText active={progress == 0}>
                  <h3> Step 1: </h3>
                  <p> Below is a "Detectives Notebook" containing a number of clues.</p>
                  <ul>
                    <li>Drag true and useful clues into the <strong> "Promising Leads" </strong> section of the notebook</li>
                    <li>Drag false or irrelevant clues into the <strong> "Dead Ends" </strong> section</li>
                  </ul>
                </DisplayText>

                <Expand open={progress >= 1}>
                  <DisplayText active={progress == 1}>
                    <h3> Step 2: </h3>
                    <p> You will work with a few close collaborators, who share their "Promising Leads" with you.
                      When your collaborator has a clue that is already in your notebook, it
                        will be shaded grey.
                    </p>
                    <ul>
                      <li>Drag clues from your collaborators notebooks into your own, categorizing them correctly.</li>
                    </ul>
                  </DisplayText>
                </Expand>


                <DisplayText active={!allow_continue}>
                  <h4>Practice this below to continue</h4>
                </DisplayText>
            </Description>

            <Boxed>
              <Round game={game}
                     //round={game.rounds[0]}
                     round="training"
                     stage={game.rounds[0].stages[0]}
                     player={player} />
            </Boxed>

            <Description>
               {!allow_continue && <p> Before you can go to the next
                 page, <strong>correctly categorize the practice clues
                 as "Promising Leads" or "Dead Ends" </strong>. </p>}
               {allow_continue && <h3> You are ready to proceed! </h3>}

             <p>
               <button type="button" onClick={onNext}
                       disabled={!allow_continue}>
                 Continue to Incentives
               </button>
             </p>
          </Description>
        </Container>

    );
  }
}
