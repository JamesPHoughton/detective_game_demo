import React from "react";

import { Centered } from "meteor/empirica:core";

import {
  Button,
  Classes,
  FormGroup,
  RadioGroup,
  TextArea,
  Intent,
  Radio
} from "@blueprintjs/core";

export default class ExitSurvey extends React.Component {
  static stepName = "ExitSurvey";
  state = { age: "", gender: "", education: "",
            strength: "", fair: "", time: "", feedback: "",
            };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { player } = this.props;
    player.set('survey', this.state);
    this.props.onSubmit(this.state);
  };

  average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  formatPrice = num => {
    if (num === undefined) {
      return undefined
    } else {
      return  num.toFixed(2)
    }
  }

  componentDidMount() {
    const { player, game } = this.props;
    const num_clues = player.data.notebooks.promising_leads.clueIDs.length
    player.set("individualBonus", Math.min(1, num_clues*0.1))

    const num_clue_list = game.players.map(
      player => player.data.notebooks.promising_leads.clueIDs.length)
    const mean_clues = this.average(num_clue_list)
    player.set("teamBonus", Math.min(1, mean_clues*.1))
    player.set("totalPay", 2+player.get("teamBonus")+player.get("individualBonus"))
  }

  exitMessage = (player, game) => {
    return (
      <div>
        <h1> Exit Survey </h1>
        <h1>
          Please submit the following code to receive your bonus:{" "}
          <strong>{player._id}</strong>.
        </h1>
        <p>
          The game you played was part of an experimental treatment in which
          none of the clues were false, and any could have been helpful in
          solving the mystery.
        </p>
        <p>
          In addition to your $2.00 payment for training and playing,
          you earned an <strong>individual bonus</strong> of $
          {this.formatPrice(player.get("individualBonus"))},
          and a <strong>team bonus</strong> of $
          {this.formatPrice(player.get("teamBonus"))},
          for a total of ${this.formatPrice(player.get("totalPay"))}.
        </p>
      </div>
    );
  };

  exitForm = () => {
    const { age, gender, strategy, fair, time, feedback, education } = this.state;
    return (
      <div className="exit-survey">
        <p>
          Please answer the following short survey. You do not have to provide
          any information you feel uncomfortable with.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-line">
            <FormGroup
              inline={true}
              label={"Age"}
              labelFor={"age"}
              className={"form-group"}
            >
              <input
                id="age"
                className={Classes.INPUT}
                type="number"
                min="0"
                max="150"
                step="1"
                dir="auto"
                name="age"
                value={age}
                onChange={this.handleChange}
                // required
              />
            </FormGroup>

            <FormGroup
              inline={true}
              label={"Gender"}
              labelFor={"gender"}
              className={"form-group"}
            >
              <input
                id="gender"
                className={Classes.INPUT}
                type="text"
                dir="auto"
                name="gender"
                value={gender}
                onChange={this.handleChange}
                // required
              />
            </FormGroup>
          </div>

          <div className="form-line">
            <RadioGroup
              inline={true}
              name="education"
              label="Highest Education Qualification?"
              onChange={this.handleChange}
              selectedValue={education}
            >
              <Radio
                selected={education}
                name="education"
                value="high-school"
                label="High School"
                onChange={this.handleChange}
              />
              <Radio
                selected={education}
                name="education"
                value="bachelor"
                label="US Bachelor's Degree"
                onChange={this.handleChange}
              />
              <Radio
                selected={education}
                name="education"
                value="master"
                label="Master's or higher"
                onChange={this.handleChange}
              />
              <Radio
                selected={education}
                name="education"
                value="other"
                label="Other"
                onChange={this.handleChange}
              />
            </RadioGroup>
          </div>

          <div>
            <FormGroup
              className={"form-group"}
              inline={false}
              label={"How would you describe your strategy in the game?"}
              labelFor={"strategy"}
              //className={"form-group"}
            >
              <TextArea
                id="strategy"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={strategy}
                fill={true}
                name="strategy"
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Do you feel the pay was fair?"}
              labelFor={"fair"}
              //className={"form-group"}
            >
              <TextArea
                id="fair"
                name="fair"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={fair}
                fill={true}
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Did you have enough time to play?"}
              labelFor={"time"}
              //className={"form-group"}
            >
              <TextArea
                id="time"
                name="time"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={time}
                fill={true}
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Feedback, including problems you encountered."}
              labelFor={"fair"}
              //className={"form-group"}
            >
              <TextArea
                id="feedback"
                name="feedback"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={feedback}
                fill={true}
              />
            </FormGroup>
          </div>

          <Button type="submit" intent={"primary"} rightIcon={"key-enter"}>
            Submit
          </Button>
        </form>{" "}
      </div>
    );
  };

  render() {
    const { player, game } = this.props;
    return (
      <Centered>
        <div className="exit-survey">
          {this.exitMessage(player, game)}
          <hr />
          {this.exitForm()}
        </div>

      </Centered>
    );
  }
}
