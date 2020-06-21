import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Notebook from './Notebook';
import styled from 'styled-components';

const Container = styled.div`
  margin: 3px;
  border: 1px solid lightgrey;
  padding-left: 22px;
  padding-top: 3px;
  background:
    linear-gradient(
      90deg,
      transparent,
      transparent 15px,
      salmon 15px,
      salmon 16px,
      transparent 16px,
      transparent 19px,
      salmon 19px,
      salmon 20px,
      transparent 20px
    ),
    linear-gradient(
      to bottom,
      lightyellow,
      lightyellow 35px,
      transparent 35px
    ),
    repeating-linear-gradient(
      to bottom,
      lightyellow,
      lightyellow 19px,
      lightblue 19px,
      lightblue 20px
    )
    ;
`

export default class Workspace extends React.Component {


  render() {
    const { player, game } = this.props;
    const notebooks = player.get("notebooks");
    const notebookOrder = player.get("notebookOrder");
    return (
      <Container>
      <h3>Your Notebook</h3>
      {notebookOrder.map(notebookID => {
        const notebook = notebooks[notebookID];
        const clues = notebook.clueIDs.map(clueID => game.get("clues")[clueID]);
        return <Notebook key={notebook.id}
                         notebook={notebook}
                         clues={clues}
                         title={notebook.title}
                         nbDropID={notebook.id}
                         type="personal"
                         fades={[]}/>;
                       })}


      </Container>
    )
  }
}
