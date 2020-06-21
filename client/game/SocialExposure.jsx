import React from "react";
import Notebook from "./Notebook"
import styled from 'styled-components';

const Container = styled.div`
  margin: 3px;
  border: 4px solid white;
  background-color: white;
  border-radius: 2px;
`

const Title = styled.h3`
  margin: 0px;
  padding: 8px;
  padding-bottom: 3px;
`;

const NeighborList = styled.div`
  margin: 3px;
  display: flex;
  flex-direction: row;
`;


export default class SocialExposure extends React.Component {

  render() {
    const { game, player } = this.props;
    const alterIDs = player.get("alterIDs");
    var leads = player.get("notebooks")["promising_leads"]["clueIDs"];
    var deads = player.get("notebooks")["dead_ends"]["clueIDs"];

    return (
      <Container>
        {alterIDs.length > 0 && <Title>Information from your collaborators</Title>}
        <NeighborList>
        {alterIDs.map((alterID, index) => {
            const alter = _.find(game.players, p=>p._id == alterID);
            const altTrue = alter.get("notebooks")['promising_leads']
            const clues = altTrue.clueIDs.map(cID => game.get("clues")[cID]);
            return <Notebook key={alter.id}
                             notebook={altTrue}
                             clues={clues}
                             title={"Collaborator " + (index+1) + " Leads"}
                             nbDropID={alter._id}
                             type="social"
                             icon={"sleuth"+(index+1)+".png"}
                             fades={leads+deads}/>;
            })}
        </NeighborList>
      </Container>
    );
  }
}
