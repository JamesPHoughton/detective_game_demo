import React from "react";

import { StageTimeWrapper } from "meteor/empirica:core";
import Timer from "./Timer.jsx";

class timer extends React.Component {
  render() {
    const { remainingSeconds, stage } = this.props;

    const classes = ["timer"];
    if (remainingSeconds <= 20) {
      classes.push("lessThan5");
    } else if (remainingSeconds <= 60) {
      classes.push("lessThan10");
    }

    return (
      <div className={classes.join(" ")}>
        {stage.name != "memo" && <h4>Time Remaining:</h4>}
        {stage.name == "memo" && <h4>The game will begin in:</h4>}
        <span className="seconds">{Math.floor(remainingSeconds/60)}:{("0" + remainingSeconds%60).slice(-2)}</span>
      </div>
    );
  }
}

export default (Timer = StageTimeWrapper(timer));
