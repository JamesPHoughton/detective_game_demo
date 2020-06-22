import {render} from "react-dom";

import Empirica from "meteor/empirica:core";

import Header from "./header.jsx"
import Round from "./game/Round";
import Consent from "./intro/Consent";
import InstructionStepOne from "./intro/InstructionStepOne";
import InstructionStepTwo from "./intro/InstructionStepTwo";
import MakeTheCase from "./exit/MakeTheCase";
import ExitSurvey from "./exit/ExitSurvey";
import Thanks from "./exit/Thanks";
import Sorry from "./exit/Sorry";

import { LobbyChat } from "@empirica/chat";


Empirica.lobby(LobbyChat);


// Set the Consent Component you want to present players (optional).
Empirica.consent(Consent);

// Introduction pages to show before they play the game (optional).
// At this point they have been assigned a treatment. You can return
// different instruction steps depending on the assigned treatment.
Empirica.introSteps((game, treatment) => {
  //return [];
  return [InstructionStepOne, InstructionStepTwo];
});

// The Round component containing the game UI logic.
// This is where you will be doing the most development.
// See client/game/Round.jsx to learn more.
Empirica.round(Round);

// Set the Breadcrumb Component to replace the default Round/Stage progress
// indicator. This is the UI that shows which are the current Round and Stage,
// between the page Header and the Round
Empirica.breadcrumb((round, stage) => {
  return null
});

// Uncomment for production, comment to include new player, reset player, etc.
Empirica.header(Header);

// End of Game pages. These may vary depending on player or game information.
// For example we can show the score of the user, or we can show them a
// different message if they actually could not participate the game (timed
// out), etc.
// The last step will be the last page shown to user and will be shown to the
// user if they come back to the website.
// If you don't return anything, or do not define this function, a default
// exit screen will be shown.
Empirica.exitSteps((game, player) => {
  //return [];
  if (player.exitStatus !== "finished") {
    return [Sorry];
  } else {
    return [MakeTheCase, ExitSurvey, Thanks];
  }
});

// Start the app render tree.
// NB: This must be called after any other Empirica calls (Empirica.round(),
// Empirica.introSteps(), ...).
// It is required and usually does not need changing.
Meteor.startup(() => {
  render(Empirica.routes(), document.getElementById("app"));
});
