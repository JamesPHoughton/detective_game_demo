import React from "react";

import { Centered, AlertToaster } from "meteor/empirica:core";
import { Radio, RadioGroup } from "@blueprintjs/core";

import { Button } from "@blueprintjs/core";

import styled from 'styled-components';
import Expand from 'react-expand-animated';

const Container = styled.div`
  margin: 3px;
  max-width: 810px;
`

const Coltainer = styled.div`
display: flex;
flex-direction: row;
`

const ColL = styled.div`
margin: 3px;
`

const ColR = styled.div`
margin: 3px;
max-width: 40rem;
padding-left: 2rem;
`

const Reciept = styled.div`
  margin: 3px;
  border: 1px solid darkgrey;
  min-width: 40rem;
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`
const RecieptHeading = styled.h3`
  padding-left: 1rem;
`
const ReceiptRow = styled.div`
  display: flex;
  flex-direction: row;
`

const ReceiptLeft = styled.p`
  padding-left: 3rem;
  min-width: 25rem;
`
const ReceiptRight = styled.p`
`


export default class InstructionStepTwo extends React.Component {

  state = { bob: "", jane: "" };

  handleRadioChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.bob !== "zero" || this.state.jane !== "ten") {
          AlertToaster.show({
            message:
              "One or more questions has an incorrect or missing answer."
          });
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    const { min_pay, max_pay } = this.state;
    return (
      <Container>
        <h2> Training: Incentives </h2>
        <div className="instructions">
          <form onSubmit={this.handleSubmit}>
            <Coltainer>
              <ColL>
                <p>Your payment is calculated as follows:</p>

                <Reciept>
                  <RecieptHeading>Participation</RecieptHeading>
                  <ReceiptRow>
                    <ReceiptLeft>Completing training:</ReceiptLeft>
                    <ReceiptRight>+$1.00</ReceiptRight>
                  </ReceiptRow>
                  <ReceiptRow>
                    <ReceiptLeft>Playing the Game:</ReceiptLeft>
                    <p>+$1.00</p>
                  </ReceiptRow>
                  <RecieptHeading>Individual Bonus</RecieptHeading>
                  <ReceiptRow>
                    <ReceiptLeft>Correct "Leads":</ReceiptLeft>
                    <ReceiptRight><strong>+$0.10 each</strong></ReceiptRight>
                  </ReceiptRow>
                  <ReceiptRow>
                    <ReceiptLeft>Incorrect "Leads":</ReceiptLeft>
                    <ReceiptRight><strong><font color="red"> -$0.10 each</font></strong></ReceiptRight>
                  </ReceiptRow>
                  <ReceiptRow>
                    <ReceiptLeft>Correct "Dead Ends":</ReceiptLeft>
                    <ReceiptRight><font color="grey"> $0.00 each</font></ReceiptRight>
                  </ReceiptRow>
                  <ReceiptRow>
                    <ReceiptLeft>Incorrect "Dead Ends":</ReceiptLeft>
                    <ReceiptRight><font color="grey"> $0.00 each</font></ReceiptRight>
                  </ReceiptRow>
                  <ReceiptRow>
                    <ReceiptLeft></ReceiptLeft>
                    <ReceiptRight><small>(Up to +$1.00 total)</small></ReceiptRight>
                  </ReceiptRow>
                  <RecieptHeading>Team Bonus</RecieptHeading>
                  <ReceiptRow>
                    <ReceiptLeft>Average of individual bonuses:</ReceiptLeft>
                    <ReceiptRight>Up to +$1.00</ReceiptRight>
                  </ReceiptRow>
                  <hr/>
                  <ReceiptRow>
                    <ReceiptLeft>Total:</ReceiptLeft>
                    <ReceiptRight>Up to +$4.00</ReceiptRight>
                  </ReceiptRow>
                </Reciept>
              </ColL>


              <ColR>
                <Expand open={this.state.jane !== "ten"}>
                  <h2>Comprehension Check (1 of 2)</h2>
                  <p>
                  Jane has 1 correct lead, 1 correct dead end, and 2 incorrect dead ends.
                  </p>
                  <img src="janes_notebook.png" height="300px"/>

                  <h3>What is Jane's Individual Bonus?</h3>
                  <RadioGroup
                    layout="row"
                    onChange={this.handleRadioChange}
                    selectedValue={this.state.jane}
                    name="jane"
                    required
                    inline
                  >
                      <Radio
                        label="$0.00"
                        value="zero"
                      />
                      <Radio
                        label="+$0.10"
                        value="ten"
                      />
                      <Radio
                        label="+$0.20"
                        value="twenty"
                      />
                      <Radio
                        label="+$0.40"
                        value="forty"
                      />
                  </RadioGroup>
                </Expand>

                <Expand open={this.state.jane == "ten"}>
                  <h2>Comprehension Check (2 of 2)</h2>
                  <p>
                  Bob has 2 correct leads and 2 incorrect leads.
                  </p>
                  <img src="bobs_notebook.png" height="300px"/>
                  <h3>What is Bob's Individual Bonus?</h3>
                  <RadioGroup
                    layout="row"
                    onChange={this.handleRadioChange}
                    selectedValue={this.state.bob}
                    name="bob"
                    required
                    inline
                  >
                    <Radio
                      label="$0.00"
                      value="zero"
                    />
                    <Radio
                      label="+$0.10"
                      value="ten"
                    />
                    <Radio
                      label="+$0.20"
                      value="twenty"
                    />
                    <Radio
                      label="+$0.40"
                      value="forty"
                    />
                  </RadioGroup>
                </Expand>
              </ColR>
            </Coltainer>



            <p>
              <Button type="button"
                intent={"default"}
                icon={"arrow-left"}
                onClick={onPrev}
                disabled={!hasPrev}
                >
                Back to Game Play
              </Button>
              <Button type="submit" intent={"primary"} rightIcon={"arrow-right"}>
                Continue to game lobby
              </Button>
            </p>
          </form>
        </div>
      </Container>
    );
  }
}
