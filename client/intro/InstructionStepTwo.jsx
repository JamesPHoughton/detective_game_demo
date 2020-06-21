import React from "react";

import { Centered, AlertToaster } from "meteor/empirica:core";
import { Radio, RadioGroup } from "@blueprintjs/core";
import styled from 'styled-components';

const Container = styled.div`
  margin: 3px;
  max-width: 650px;
`

const Reciept = styled.div`
  margin: 3px;
  border: 1px solid darkgrey;
  min-width:60px;
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
    console.log("el", el);
    console.log("ev", event);
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.bob !== "zero" || this.state.jane !== "ten") {
          AlertToaster.show({
            message:
              "Sorry, you have one or more mistakes. Please re-read the instructions, and ensure that you have answered the questions correctly."
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
        <div className="instructions">
          <form onSubmit={this.handleSubmit}>
            <h2> Training: Incentives </h2>

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



          <h3>Comprehension Check 1</h3>
          <p>
          Jane has 1 correct lead, 1 correct dead end, and 2 incorrect dead ends.
          </p>
          <img src="janes_notebook.png" height="300px"/>

          <RadioGroup
            layout="row"
            label="What is Jane's Individual Bonus?"
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

          <h3>Comprehension Check 2</h3>
          <p>
          Bob has 2 correct leads and 2 incorrect leads.
          </p>
          <img src="bobs_notebook.png" height="300px"/>

          <RadioGroup
            layout="row"
            label="What is Bob's Individual Bonus?"
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

          <p>
          Before you can go to the game, you must <strong>correctly answer all
          of the above questions.</strong>
          </p>
            <p>
              <button type="button" onClick={onPrev} disabled={!hasPrev}>
                Back to Game Play
              </button>
              <button type="submit">Submit</button>
            </p>
          </form>
        </div>
      </Container>
    );
  }
}
