import Empirica from "meteor/empirica:core";
import "./callbacks.js";
import "./bots.js";

var fs = require('fs');

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit(game => {
  const treatment = game.treatment;
  const players = game.players;

  if (treatment.playerCount == 3){  // for testing
     var gameData = require('./games/game_data_3_player_no_control.json');
  } else {
    // https://stackoverflow.com/a/34639037/6361632
    var experimentData = JSON.parse(fs.readFileSync(`assets/app/`+treatment.experimentDataFile))
    var gameData = experimentData.games[treatment.gameSetupId]
    console.log(treatment.gameSetupId)
  }

  game.set("nodes", gameData.nodes)
  game.set("clues", gameData.clues)
  game.set("network", gameData.neighbors)
  game.set("gameSetupId", gameData.gameSetupId)

  const playerIds = _.pluck(players, "_id");
  players.forEach((player, i) => {
    position = gameData.playerPositions[i]
    player.set("index", i)
    player.set("position", position)
    player.set("alterIDs", gameData.neighbors[position].map(
      pos => playerIds[_.indexOf(gameData.playerPositions, pos)])
    );
    player.set("log", [])
    player.set("activity", "active")
    player.set("notebookOrder", ['promising_leads', 'dead_ends']);
    player.set("notebooks", {
      'promising_leads': {
        id: 'promising_leads',
        title: 'Promising Leads',
        clueIDs: gameData.beliefs[position],
      },
      'dead_ends': {
        id: 'dead_ends',
        title: 'Dead Ends',
        clueIDs: [],
      },
    })
    player.set("initialState", player.get("notebooks")) // we will modify notebooks, so keep a spare
  });


  const round = game.addRound();
  round.addStage({
    name: "memo",
    displayName: "Memo",
    durationInSeconds: 60
  })
  round.addStage({
      name: "response",
      displayName: "Response",
      durationInSeconds: treatment.duration*60
  });

});
