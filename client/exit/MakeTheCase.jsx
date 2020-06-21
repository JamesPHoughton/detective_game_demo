import React from "react";

import Slider from "meteor/empirica:slider";
import styled from 'styled-components';
import Workspace from "../game/Workspace";
import { DragDropContext } from 'react-beautiful-dnd';
import { HTMLSelect } from "@blueprintjs/core";

const Container = styled.div`
  margin: 4px;
  border: 2px solid lightgrey;
  border-radius: 2px;
  padding: 15px;
  max-width: 600px;
`

const Panels = styled.div`
  margin: 3px;
  display: flex;
  flex-direction: row;
`

const SliderBox = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 1px;
`

const Question = styled.div`
  margin-top: 30px;
  margin-bottom: 50px;
`

const SliderLabel = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1px;
  font-weight: lighter;
`
const LLabel = styled.p`
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 1px;
  display: flex;
  flex-direction: column;
  padding: 0px
`

const CLabel = styled(LLabel)`
  text-align: center;
`;

const RLabel = styled(LLabel)`
  text-align: right;
`;


export default class MakeTheCase extends React.Component {
  static stepName = "MakeTheCase";
  state = { suspect_1: "",
            suspect_2: "",
            suspect_3: "",
            appearance_1: "",
            appearance_2: "",
            clothing_1: "",
            clothing_2: "",
            tool_1: "",
            tool_2: "",
            vehicle_1: "",
            vehicle_2: "",
            confidence: "",
            consensus: ""};

  handleSubmit = event => {
    event.preventDefault();
    const { player } = this.props;
    player.set('caseMade', this.state);
    this.props.onSubmit(this.state);
  };


  handleSelectChange = event => {
    this.setState({[event.currentTarget.id]: event.currentTarget.value});
  }

  getSliderHandler = key => {
        return value => {
          this.setState({[key]: Math.round(value * 100) / 100 });
          this.forceUpdate();
        }
  }

  renderSlider(element, name){
    return (
      <SliderBox>
        <LLabel> {name} </LLabel>
        <Slider
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={25}
            onChange={this.getSliderHandler(element)}
            value={this.state[element] == "" ? undefined : this.state[element] || 50}
            labelRenderer={val => ""}
            disabled={false}
            hideHandleOnEmpty
          />
        </SliderBox>
    )
  }

  renderSliderLabels(){
    return (
      <SliderLabel>
      <table cellpadding="0" cellspacing="0px" width="100%" border="0">
         <tr>
            <td width="12.5%" align="left">Extremely unlikely</td>
            <td width="25%" align="center">Somewhat unlikely</td>
            <td width="25%" align="center">Neither likely nor unlikely</td>
            <td width="25%" align="center">Somewhat likely</td>
            <td width="12.5%" align="right">Extremely likely</td>
         </tr>
      </table>
      </SliderLabel>
    )
  }


  render() {
    const { player, game } = this.props;
    const nodes = game.get("nodes")


    const submit_enabled = (this.state["suspect_1"]!="" &&
                            this.state["suspect_2"]!="" &&
                            this.state["suspect_3"]!="" &&
                            this.state["appearance_1"]!="" &&
                            this.state["appearance_2"]!="" &&
                            this.state["clothing_1"]!="" &&
                            this.state["clothing_2"]!="" &&
                            this.state["tool_1"]!="" &&
                            this.state["tool_2"]!="" &&
                            this.state["vehicle_1"]!="" &&
                            this.state["vehicle_2"]!="" &&
                            this.state["consensus"]!="" &&
                            this.state["confidence"]!="")

    return (
        <Panels>
          <DragDropContext onDragEnd={res => {}}>
            <Workspace game={game} player={player} />
          </DragDropContext>
          <Container>
            <h1> Make the case </h1>
            <p>
              Your team has narrowed down the clues to just a few
              suspects and burglary methods.
            </p>
            <p>
              Please click a position on the slider bars below to
              indicate your response to each question.
            </p>

            <form onSubmit={this.handleSubmit}>
            <Question>
              <h3>How likely do you think it is that the burglar had the following last names?</h3>
              {this.renderSliderLabels()}
              {this.renderSlider("suspect_1", nodes['Suspect_1'])}
              {this.renderSlider("suspect_2", nodes['Suspect_2'])}
              {this.renderSlider("suspect_3", nodes['Suspect_3'])}
            </Question>
            <Question>
              <h3>How likely do you think it is that the burglar fits the following descriptions?</h3>
              {this.renderSliderLabels()}
              {this.renderSlider("appearance_1", nodes['Appearance_1'])}
              {this.renderSlider("appearance_2", nodes['Appearance_2'])}
            </Question>
            <Question>
              <h3>How likely do you think it is that the burglar wore the following clothes?</h3>
              {this.renderSliderLabels()}
              {this.renderSlider("clothing_1", nodes['Clothing_1'])}
              {this.renderSlider("clothing_2", nodes['Clothing_2'])}
            </Question>
            <Question>
              <h3>How likely do you think it is that each of the following tools was used in the burglary?</h3>
              {this.renderSliderLabels()}
              {this.renderSlider("tool_1", nodes['Tool_1'])}
              {this.renderSlider("tool_2", nodes['Tool_2'])}
            </Question>
            <Question>
              <h3>How likely do you think it is that each of the following vehicles was used as the getaway car?</h3>
              {this.renderSliderLabels()}
              {this.renderSlider("vehicle_1", nodes['Vehicle_1'])}
              {this.renderSlider("vehicle_2", nodes['Vehicle_2'])}
            </Question>

            <h2> Your experience </h2>
            <p> How confident are you in your solution to the mystery as a whole?
            (Click the slider below to enter a value. 0% implies no confidence,
            100% implies complete confidence.) </p>

            <SliderBox>
              <Slider
                  min={0}
                  max={100}
                  stepSize={1}
                  labelStepSize={25}
                  onChange={this.getSliderHandler("confidence")}
                  value={this.state['confidence'] == "" ? undefined : this.state['confidence'] || 0}
                  labelRenderer={val => val+"%"}
                  disabled={false}
                  hideHandleOnEmpty
                />
              </SliderBox>

              <p> What fraction of your team do you think shares your solution?
              (Click the slider below to enter a value. 0% implies that no other
                members of your team agree, 100% implies that all other members
                of your team agree with you.) </p>

              <SliderBox>
                <Slider
                    min={0}
                    max={100}
                    stepSize={1}
                    labelStepSize={25}
                    onChange={this.getSliderHandler("consensus")}
                    value={this.state['consensus'] == "" ? undefined : this.state['consensus'] || 0}
                    labelRenderer={val => val+"%"}
                    disabled={false}
                    hideHandleOnEmpty
                  />
                </SliderBox>

              <button
                type="submit"
                disabled={!submit_enabled}>
              Submit
              </button>
            </form>

          </Container>
      </Panels>
    );
  }
}
