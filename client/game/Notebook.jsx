import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd'
import Clue from './Clue'

const shadow = "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"

const Container = styled.div`
  margin: 3px;
  border: ${props => (props.type == "social" ? "1px solid lightgrey"
                                             : props.isDraggingOver
                                             ? "2px solid darkgrey"
                                             : "2px solid #AAAAAA33")};
  border-radius: ${props => (props.type == "social" ? "8px" : "2px")};
  background-color: ${props => (props.type == "social"
                                ? props.isDraggingOver
                                ? '#FF000022'
                                : 'white'
                                : 'transparent')};

  transition: border-color .2s ease,
              background-color .2s ease;

  ${props => (props.type == "social" ? shadow : "")}


  `;

const Title = styled.h3`
  margin: 0px;
  padding: 8px;
  padding-bottom: 3px;
  display: flex;
  color: ${props => (props.type == "social"
                     ? "blue"
                     : "black")}
  `;

const ClueList = styled.div`
  padding: 8px;
  padding-bottom: 2px;
  min-height: 50px;
  `;

export default class Notebook extends React.Component {

  render() {
    const {notebook, clues, title, nbDropID, type, icon, fades} = this.props
    return (
      <Droppable droppableId={nbDropID} isDropDisabled={type=="social"}>
        {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          innerRef={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
          type={type}
        >
          <Title type={type}>
          <img src={icon} style={{height:"20pt"}}/> {"   "+title}
          </Title>
              <ClueList>
                {clues.map((clue, index) => (
                  <Clue key={clue.id} clue={clue}
                        index={index} notebookTitle={title}
                        fade={fades.includes(clue.id)}/>
                ))}
                {provided.placeholder}
              </ClueList>
            </Container>
            )}

      </Droppable>
    );

  }
}
