export const clues = {
  'cl1': {id: 'cl1', content: 'A false clue'},
  'cl2': {id: 'cl2', content: 'An irrelevant clue'},
  'cl3': {id: 'cl3', content: 'A true and useful clue'},
  'cl7': {id: 'cl7', content: 'A very helpful clue'}
}

export const solution = {
  'promising_leads':['cl3', 'cl7'],
  'dead_ends':['cl1', 'cl2'],
}

const player_notebooks = {
    'promising_leads': {
      id: 'promising_leads',
      title: 'Promising Leads',
      clueIDs: ['cl1'],
    },
    'dead_ends': {
      id: 'dead_ends',
      title: 'Dead Ends',
      clueIDs: ['cl3'],
    },
}

const network = {
  0: [1,2]
}

const alter_notebooks = {
  1:{'promising_leads': {
      id: 'promising_leads',
      title: 'Promising Leads',
      clueIDs: ['cl7', 'cl2', 'cl1'],
    }},
  2:{'promising_leads': {
      id: 'promising_leads',
      title: 'Promising Leads',
      clueIDs: ['cl3', 'cl2'],
    }},
}

class PlayerDummy {
  constructor(id, _id, alterIDs, notebooks) {
    this.data = {
      "alterIDs": alterIDs,
      "avatar": "/avatars/jdenticon/" + _id,
      "notebooks": notebooks,
      "notebookOrder": ['promising_leads', 'dead_ends'],
      "progress": 0,
    }
    this.loglist = [];
    this.id = id;
    this._id = _id;
  };

  get = key => this.data[key];
  set = (key, value) => this.data[key] = value;
  append = key => {};
  log = (key, value) => this.loglist.push({key: value});

}

export class GameDummy {
  constructor() {
    this.data = {
      "clues": clues,
      "network": network,
      "nodes": {"CrimeScene_1": "<Crime Scene>",
                "StolenObject_1": "<Stolen Object>"}
    }
    this.playerIds = ["player1", "top_alt", "bottom_alt"]
    this.players = [
      new PlayerDummy(0, "player1", ["top_alt", "bottom_alt"], player_notebooks),
      new PlayerDummy(1, "top_alt", [], alter_notebooks[1]),
      new PlayerDummy(2, "bottom_alt", [], alter_notebooks[2]),
    ]
    this.rounds = [{index:0, stages:[{name:"training"}]}]
  }

  get = key => this.data[key]
}
