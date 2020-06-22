import Empirica from "meteor/empirica:core";
import { HTTP } from 'meteor/http'


Empirica.bot("bob", {
  // Bob is a random player.
  // every once in a while, he arbitrarily selects a clue he is exposed to
  // and randomly moves it to one of his notebooks at random.

  // Called during each stage at tick interval (~1s at the moment)
  onStageTick(bot, game, round, stage, secondsRemaining) {
    period = 5  // ticks (seconds) btw actions on average
    if ((stage.name == "response") && (Math.random() < 1/period)) {

      // collect exposed clues
      const alterIDs = bot.get("alterIDs");
      var exposed = alterIDs.map((alterID, index) => {
        const alter = _.find(game.players, p=>p._id == alterID);
        const altTrue = alter.get("notebooks")['promising_leads']
        //const clues = altTrue.clueIDs.map(cID => game.get("clues")[cID]);
        return altTrue.clueIDs
        })

      exposed = exposed.reduce((acc, val) => acc.concat(val), [])

      // choose a clue to move
      var activeClue = exposed[Math.floor(Math.random()*exposed.length)];

      // remove clue from all player notebooks
      // (we know at this point that the clue will be added to the workspace,
      // and we'll need to reorder it anyways)
      const notebookOrder = bot.get("notebookOrder");
      const notebooks = bot.get("notebooks");
      var numNotebooks = notebookOrder.length;
      for (var i = 0; i < numNotebooks; i++) {
        var nb = notebookOrder[i];
        const clueList = notebooks[nb].clueIDs;
        if (clueList.includes(activeClue)) {
          const newClueList = _.filter(clueList, c => c != activeClue);
          notebooks[nb].clueIDs = newClueList;
        }
      }

      // choose a destination notebook and place in that notebook
      var destination = notebookOrder[Math.floor(Math.random()*numNotebooks)];
      var index = Math.floor(Math.random()*notebooks[destination]['clueIDs'].length)
      //console.log(bot['id'] +'_'+ activeClue +'_'+ destination +'_'+ index)

      // add clue to the appropriate place
      notebooks[destination].clueIDs.splice(
        index,
        0,
        activeClue
      );
      bot.set("notebooks", notebooks);
    }

  }

//   // // NOT SUPPORTED A player has changed a value
//   // // This might happen a lot!
//   // onStagePlayerChange(bot, game, round, stage, players, player) {}

//   // // NOT SUPPORTED Called at the end of the stage (after it finished, before onStageEnd/onRoundEnd is called)
//   // onStageEnd(bot, game, round, stage, players) {}
})

// Empirica.bot("pythonServer", {
//   // Called during each stage at tick interval (~1s at the moment)
//   onStageTick(bot, game, round, stage, secondsRemaining) {
//
//     if (stage.name == "response") {
//
//       // flask server is too slow to handle 40 requests/second, lets only do a quarter
//       // of bots each second.
//       interval = 1;
//       if (bot.index%interval == secondsRemaining%interval){  // distribute bots across seconds
//         var state = {
//           't': stage.durationInSeconds - secondsRemaining,
//           'pId': bot._id,
//           'leads': bot.get("notebooks")['promising_leads']['clueIDs'],
//           'deads': bot.get("notebooks")['dead_ends']['clueIDs']
//         }
//
//
//         const alterIDs = bot.get("alterIDs");
//         state.exposed = alterIDs.map((alterID, index) => {
//           const alter = _.find(game.players, p=>p._id == alterID);
//           const altLeads = alter.get("notebooks")['promising_leads']
//           return altLeads.clueIDs
//           })
//
//         try {
//           const result = HTTP.call(
//             'POST',
//             'http://127.0.0.1:5000/',
//             { data: state }
//           );
//           //console.log(result.data)
//
//           if (result.data['drag']){
//             // remove clue from all player notebooks
//             // (we know at this point that the clue will be added to the workspace,
//             // and we'll need to reorder it anyways)
//             const notebookOrder = bot.get("notebookOrder");
//             const notebooks = bot.get("notebooks");
//             var numNotebooks = notebookOrder.length;
//             for (var i = 0; i < numNotebooks; i++) {
//               var nb = notebookOrder[i];
//               const clueList = notebooks[nb].clueIDs;
//               if (clueList.includes(result.data['clueId'])) {
//                 const newClueList = _.filter(clueList, c => c != result.data['clueId']);
//                 notebooks[nb].clueIDs = newClueList;
//               }
//             }
//
//
//             // add clue to the appropriate place in the workspace
//             notebooks[result.data['dest']].clueIDs.splice(
//               result.data['index'],
//               0,
//               result.data['clueId']
//             );
//             // update the player's workspace
//             bot.set("notebooks", notebooks);
//
//             // log the change using empirica logs
//             bot.log("drop", {
//               clue: result.data['clueId'],
//               source: "",  // todo
//               dest: result.data['dest'],
//               destIndex: result.data['index']
//             })
//           }
//
//         } catch (e) {
//           console.log(e)
//         }
//       }
//     }
//   }
// })
