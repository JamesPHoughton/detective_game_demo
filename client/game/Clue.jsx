import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
  max-width: 200px;
  background-color: ${props => (props.fade
                                ? '#DDDDDD'
                                : 'white'
                                )};
`

export default class Clue extends React.Component {
  render() {
    const { clue, notebookTitle, index, fade } = this.props;
    const clueDragID = clue.id + '_' + notebookTitle; // string concat

    return (
      <Draggable draggableId={clueDragID}
                 index={index} clueID={clue.id}>
        {provided => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            innerRef={provided.innerRef}
            fade={fade}
          >
            {clue.content}
          </Container>
        )}
      </Draggable>
    );
  }
}
