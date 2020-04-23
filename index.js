
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const Resources = {
  BRICK: 'brick',
  GRAIN: 'grain',
  LUMBER: 'lumber',
  ORE: 'ore',
  WOOL: 'wool',
  DESERT: 'desert',
};
const ANY = 'ANY';

// roadIndex: [settlement1, settlement2]
const RoadToSettlementMap = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],

  [0, 8],
  [2, 10],
  [4, 12],
  [6, 14],

  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [14, 15],

  [7, 17],
  [9, 19],
  [11, 21],
  [13, 23],
  [15, 25],

  [16, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [20, 21],
  [21, 22],
  [22, 23],
  [23, 24],
  [24, 25],
  [25, 26],

  [16, 27],
  [18, 29],
  [20, 31],
  [22, 33],
  [24, 35],
  [26, 37],

  [27, 28],
  [28, 29],
  [29, 30],
  [30, 31],
  [31, 32],
  [32, 33],
  [33, 34],
  [34, 35],
  [35, 36],
  [36, 37],

  [28, 38],
  [30, 40],
  [32, 42],
  [34, 44],
  [36, 46],

  [38, 39],
  [39, 40],
  [40, 41],
  [41, 42],
  [42, 43],
  [43, 44],
  [44, 45],
  [45, 46],

  [39, 47],
  [41, 49],
  [43, 51],
  [45, 53],

  [47, 48],
  [48, 49],
  [49, 50],
  [50, 51],
  [51, 52],
  [52, 53],
];

// resourceIndex: [settlement1, settlement2, ...]
const ResourceToSettlementMap = [
  [0, 1, 2, 8, 9, 10],
  [2, 3, 4, 10, 11, 12],
  [4, 5, 6, 12, 13, 14],

  [7, 8, 9, 17, 18, 19],
  [9, 10, 11, 19, 20, 21],
  [11, 12, 13, 21, 22, 23],
  [13, 14, 15, 23, 24, 25],

  [16, 17, 18, 27, 28, 29],
  [18, 19, 20, 29, 30, 31],
  [20, 21, 22, 31, 32, 33],
  [22, 23, 24, 33, 34, 35],
  [24, 25, 26, 35, 36, 37],

  [28, 29, 30, 38, 39, 40],
  [30, 31, 32, 40, 41, 42],
  [32, 33, 34, 42, 43, 44],
  [34, 35, 36, 44, 45, 46],

  [39, 40, 41, 47, 48, 49],
  [41, 42, 43, 49, 50, 51],
  [43, 44, 45, 51, 52, 53],
];


const SettlementToPortMap = {
  0: ANY,
  1: ANY,
  3: Resources.GRAIN,
  4: Resources.GRAIN,
  14: Resources.ORE,
  15: Resources.ORE,
  7: Resources.LUMBER,
  17: Resources.LUMBER,
  26: ANY,
  37: ANY,
  28: Resources.BRICK,
  38: Resources.BRICK,
  45: Resources.WOOL,
  46: Resources.WOOL,
  47: ANY,
  48: ANY,
  50: ANY,
  51: ANY,
}

const Cards = {
  KNIGHT: 'Knight',
  VICTORY_POINT: 'Victory Point',
  MONOPOLY: 'Monopoly',
  ROAD_BUILDER: 'Road Builder',
  YEAR_OF_PLENTY: 'Year of Plenty',
};

const playerColor = ['deeppink', 'cyan', 'green', 'darkorange'];

class Settlement {
  constructor() {
    this.owner_ = null;
    this.city_ = false;
  }

  setOwner(player) {
    this.owner_ = player;
  }

  getOwner() {
    return this.owner_;
  }

  isCity() {
    return this.city_;
  }

  makeCity() {
    this.city_ = true;
  }
}

class Road {
  constructor() {
    this.owner_ = null;
  }

  setOwner(player) {
    this.owner_ = player;
  }

  getOwner() {
    return this.owner_;
  }
}

class Board {
  constructor() {
    let baseResources = [Resources.BRICK, Resources.BRICK, Resources.BRICK, Resources.LUMBER, Resources.LUMBER, Resources.LUMBER, Resources.LUMBER, Resources.WOOL, Resources.WOOL, Resources.WOOL, Resources.WOOL, Resources.GRAIN, Resources.GRAIN, Resources.GRAIN, Resources.GRAIN, Resources.ORE, Resources.ORE, Resources.ORE, Resources.DESERT, ];
    shuffleArray(baseResources);
    this.resources_ = baseResources;
    let chits = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
    const resourceOrder = [0, 1, 2, 6, 11, 15, 18, 17, 16, 12, 7, 3, 4, 5, 10, 14, 13, 8, 9];
    const chitFinal = [];
    let chitIndex = 0;
    resourceOrder.forEach((resourceIndex) => {
      if (this.resources_[resourceIndex] != Resources.DESERT) {
        chitFinal[resourceIndex] = chits[chitIndex];
        chitIndex++;
      } else {
        chitFinal[resourceIndex] = 'X';
      }
    });
    this.chits_ = chitFinal;
    this.robberIndex_ = this.resources_.indexOf(Resources.DESERT);

    const cards = [ Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.KNIGHT, Cards.VICTORY_POINT, Cards.VICTORY_POINT, Cards.VICTORY_POINT, Cards.VICTORY_POINT, Cards.VICTORY_POINT, Cards.YEAR_OF_PLENTY, Cards.YEAR_OF_PLENTY, Cards.MONOPOLY, Cards.MONOPOLY, Cards.ROAD_BUILDER, Cards.ROAD_BUILDER ];
    shuffleArray(cards);
    this.cards_ = cards;

    this.settlements_ = [];
    for (let i = 0; i < 54; i++) {
      this.settlements_.push(new Settlement());
    }
    this.roads_ = [];
    for (let i = 0; i < 72; i++) {
      this.roads_.push(new Road());
    }
  }

  dfs_(roadIndex, player, visited = new Set(), length = 0, lastSettlement = null) {
    visited.add(roadIndex);
    const settlements = RoadToSettlementMap[roadIndex];
    const amts = settlements.map((settlement) => {
      if (settlement == lastSettlement) {
        return length;
      }
      const adjRoads = RoadToSettlementMap.map(([s1, s2], index) => {
        if (settlement == s1 || settlement == s2) {
          return index;
        }
        return -1;
      }).filter((a) => a >= 0);
      const ownedAdjRoads = adjRoads.filter((r) => this.roads_[r].getOwner() == player);
      const unseen = ownedAdjRoads.filter((r) => !visited.has(r));
      if (unseen.length == 0) {
        return length + 1;
      }
      const innerAmts = unseen.map((r) => {
        return this.dfs_(r, player, visited, length + 1, settlement);
      });
      return Math.max(...innerAmts);
    });
    return Math.max(...amts);
  }

  getRoadLength(player) {
    const ownedRoadIndexes = this.roads_.map((r, index) => {
      if (r.getOwner() == player) {
        return index;
      }
      return -1;
    }).filter((a) => a >= 0);
    const amts = ownedRoadIndexes.map((roadIndex) => {
      return this.dfs_(roadIndex, player);
    });
    const max =  Math.max(...amts);
    return max;
  }

  placeRobber(index) {
    this.robberIndex_ = index;
  }

  getRobberLocation() {
    return this.robberIndex_;
  }

  playersToRob(robberLocation, playerRobbing) {
    const settlementIndexes = ResourceToSettlementMap[robberLocation];
    const settlements = settlementIndexes.map((index) => this.settlements_[index]);
    const players = settlements.map((settlement) => settlement.getOwner()).filter((player) => {
      return player && player != playerRobbing && player.totalResources() > 0;
    });
    return [...(new Set(players))];
  }

  pickCard() {
    return this.cards_.shift();
  }

  canPlaceRoad(player) {
    return this.availableRoads(player).length > 0;
  }

  canPlaceSettlement(player) {
    return this.getAvailableSettlements(player).length > 0;
  }

  canPlaceCity(player) {
    return this.getAvailableCities(player).length > 0;
  }

  canBuyCard() {
    return this.cards_.length > 0;
  }

  canTradeBank(player) {
    return this.getAvailableBankTrades(player).length > 0;
  }

  getAvailableBankTrades(player) {
    const settlementIndexes = this.settlements_.map((settlement, index) => {
      if (settlement.getOwner() == player) {
        return index;
      }
      return -1;
    }).filter((a) => a >= 0);
    const ports = settlementIndexes.map((index) => {
      return SettlementToPortMap[index];
    });
    const hasAny = ports.find((p) => p == ANY);
    return Object.values(Resources).map((resource) => {
      if (ports.find((r) => r == resource) && player.resources_[resource] >= 2) {
        return [resource, 2];
      } else if (hasAny && player.resources_[resource] >= 3) {
        return [resource, 3];
      } else  if (player.resources_[resource] >= 4) {
        return [resource, 4];
      }
      return null;
    }).filter((a) => !!a);
  }

  availableRoads(player) {
    const ownedRoads = this.roads_.map((road, index) => {
      return road.getOwner() == player ? index : -1;
    }).filter((a) => a >= 0);
    const settlements = ownedRoads.map((index) => RoadToSettlementMap[index]).flat();
    const roads = settlements.map((settlement) => this.getRoadsForSettlement(settlement)).flat();
    return roads.filter((road) => !this.roads_[road].getOwner());
  }

  getResource(index) {
    return this.resources_[index];
  }

  collectResources(roll) {
    const indicies = this.chits_.map((chit, index) => {
      if (chit == roll) {
        return index;
      }
      return -1;
    }).filter((a) => a >= 0);
    indicies.forEach((index) => {
      if (index == this.robberIndex_) {
        return;
      }
      const settlementIndicies = ResourceToSettlementMap[index];
      const resource = this.resources_[index];
      settlementIndicies.forEach((settlementIndex) => {
        const settlement = this.settlements_[settlementIndex];
        const owner = settlement.getOwner();
        if (!owner) {
          return;
        }
        const amt = settlement.isCity() ? 2 : 1;
        owner.addResource(resource, amt);
        log(owner.getName() + " picked up " + amt + " " + resource);
      });
    });
    sendGameState();
  }

  getAvailableCities(player) {
    return this.settlements_.map((settlement, index) => {
      if (settlement.getOwner() == player && !settlement.isCity()) {
        return index;
      }
      return -1;
    }).filter((a) => a >= 0);
  }

  getAvailableSettlements(player) {
    const availableSettlements = this.settlements_.map((settlement, index) => {
      if (settlement.getOwner()) {
        return -1;
      }
      const adjSettlements = RoadToSettlementMap.map(([settlement1, settlement2]) => {
        if (settlement1 === index) {
          return settlement2;
        } else if (settlement2 === index) {
          return settlement1;
        }
        return -1;
      }).filter((a) => a >= 0);
      const hasOwner = adjSettlements.filter((i) => !!this.settlements_[i].getOwner());
      if (hasOwner.length == 0) {
        return index;
      }
      return -1;
    }).filter((x) => x >= 0);
    if (!player) {
      return availableSettlements;
    }
    // filter to just those connected to a road owned by player
    return availableSettlements.filter((settlement) => {
      const roads = RoadToSettlementMap.map((settlements, index) => {
        return settlement == settlements[0] || settlement == settlements[1] ? index : -1;
      }).filter((index) => index >= 0);
      return !!roads.find((road) => this.roads_[road].getOwner() == player);
    });
  }

  buySettlement(index, player) {
    this.settlements_[index].setOwner(player);
  }

  buyCity(index, player) {
    this.settlements_[index].makeCity();
  }

  buyRoad(index, player) {
    this.roads_[index].setOwner(player);
  }

  getRoadsForSettlement(settlementIndex) {
    const roadIndicies = []
    RoadToSettlementMap.forEach((settlements, roadIndex) => {
      if (settlements.indexOf(settlementIndex) >= 0) {
        roadIndicies.push(roadIndex);
      }
    });
    return roadIndicies;
  }

  serialize() {
    return {
      resources: this.resources_,
      chits: this.chits_,
      settlements: this.settlements_.map((settlement) => {
        return {
          color: settlement.getOwner() ? settlement.getOwner().getColor() : '',
          city: settlement.isCity(),
        };
      }),
      roads: this.roads_.map((road) => {
        return road.getOwner() ? road.getOwner().getColor() : '';
      }),
      robber: this.robberIndex_,
    }
  }
}

class Player {
  constructor(name, color, socket) {
    this.name_ = name;
    this.socket_ = socket;
    this.color_ = color;
    this.cards_ = [];
    this.boughtCards_ = [];
    this.settlementsLeft_ = 5;
    this.citiesLeft_ = 4;
    this.roadsLeft_ = 15;
    this.resources_ = {
      [Resources.BRICK]: 0,
      [Resources.GRAIN]: 0,
      [Resources.WOOL]: 0,
      [Resources.LUMBER]: 0,
      [Resources.ORE]: 0,
    }
    this.points_ = 0;
    this.knightsPlayed_ = 0;
    this.largestArmy_ = false;
    this.longestRoad_ = false;
  }

  alert(text) {
    this.socket_.emit('alert', {text});
  }

  playKnight() {
    this.knightsPlayed_++;
  }

  getKnightsPlayed() {
    return this.knightsPlayed_;
  }

  setLargestArmy(hasLargest) {
    this.largestArmy_ = hasLargest;
  }

  setLongestRoad(hasLongest) {
    this.longestRoad_ = hasLongest;
  }

  takeResource(resource) {
    const amt = this.resources_[resource];
    this.resources_[resource] = 0;
    this.sendState();
    return amt;
  }

  makeOffer(player, offer, asking) {
    let offerString = "";
    for (const resource in offer) {
      if (offer[resource]) {
        offerString += offer[resource] + " " + resource + " ";
      }
    }
    let askingString = "";
    let canAfford = true;
    for (const resource in asking) {
      if (asking[resource]) {
        askingString += asking[resource] + " " + resource + " ";
      }
      if (asking[resource] > this.resources_[resource]) {
        canAfford = false;
      }
    }
    log(player.getName() + " offered " + offerString + "to " + this.getName() + " for " + askingString);
    const buttons = [];
    if (canAfford) {
      buttons.push('Accept');
    }
    buttons.push('Reject');
    this.alert("Trade offered to you.");
    return this.doAction_('buttons', {
      'buttons': buttons,
      'text': player.getName() + ' is offering ' + offerString + 'for ' + askingString,
    });
  }

  doAuction(offer, asking) {
    let offerString = "";
    for (const resource in offer) {
      if (offer[resource]) {
        offerString += offer[resource] + " " + resource + " ";
      }
    }
    let askingString = "";
    let canAfford = true;
    for (const resource in asking) {
      if (asking[resource]) {
        askingString += asking[resource] + " " + resource + " ";
      }
      if (asking[resource] > this.resources_[resource]) {
        canAfford = false;
      }
    }
    const buttons = [];
    if (canAfford) {
      buttons.push('Accept');
    }
    buttons.push('Reject');
    this.alert("Auction! First to accept gets it!.");
    return this.doAction_('buttons', {
      'buttons': buttons,
      'text': 'Offering ' + offerString + 'for ' + askingString,
    }).then((ans) => {
      return ans == 'Accept' ? Promise.resolve(this) : Promise.reject();
    });
  }

  pickResource() {
    return this.doAction_('buttons', {
      'buttons': Object.values(Resources), 'text': 'Pick a Resource'
    });
  }

  pickCard() {
    return this.doAction_('buttons', {
      'buttons': [...new Set(this.getPlayableCards_())],
      'text': 'Select a card to play.',
      'cancellable': true,
    }).then((card) => {
      if (card != 'cancel') {
        this.cards_.splice(this.cards_.indexOf(card), 1);
      }
      return card;
    });
  }

  getRandomResource() {
    const resources = [];
    for (const resource in this.resources_) {
      for (let i = 0; i < this.resources_[resource]; i++) {
        resources.push(resource);
      }
    }
    shuffleArray(resources);
    return resources.pop();
  }

  endTurn() {
    this.cards_ = [...this.cards_, ...this.boughtCards_]
    this.boughtCards_ = [];
  }

  canAffordRoad() {
    return this.resources_[Resources.BRICK] >= 1
        && this.resources_[Resources.LUMBER] >= 1;
  }

  canAffordSettlement() {
    return this.resources_[Resources.BRICK] >= 1
        && this.resources_[Resources.LUMBER] >= 1
        && this.resources_[Resources.GRAIN] >= 1
        && this.resources_[Resources.WOOL] >= 1;
  }

  canAffordCity() {
    return this.resources_[Resources.ORE] >= 3
        && this.resources_[Resources.GRAIN] >= 2;
  }

  canAffordCard() {
    return this.resources_[Resources.ORE] >= 1
        && this.resources_[Resources.GRAIN] >= 1
        && this.resources_[Resources.WOOL] >= 1;
  }

  getScore() {
    const secretPoints = [...this.cards_, ...this.boughtCards_].filter((card) => {
      return card == Cards.VICTORY_POINT;
    }).length;
    let score  = this.points_ + secretPoints;
    if (this.largestArmy_) {
      score += 2;
    }
    if (this.longestRoad_) {
      score += 2;
    }
    return score;
  }

  getColor() {
    return this.color_;
  }

  loseHalfResources() {
    const amt = this.totalResources();
    if (amt <= 7) {
      return Promise.resolve();
    }
    log("Waiting for " + this.getName() + " to drop half their resources.");
    const toDrop = Math.floor(amt / 2);
    this.alert('Drop half your resources!');
    return this.doAction_('drop-resources', {
      amt: toDrop, resources: this.resources_
    }).then((amts) => {
      for (const resource in amts) {
        this.addResource(resource, -1 * amts[resource]);
        log(this.getName() + " dropped " + amts[resource] + " " + resource);
      }
      this.sendState();
    });
  }

  moveRobber(current) {
    return this.doAction_('move-robber', {current});
  }

  pickCity(available) {
    return this.doAction_('city', {available, cancellable: 'true'}).then((city) => {
      if (city != 'cancel') {
        this.points_++;
        this.citiesLeft_--;
        this.settlementsLeft_++;
        this.sendState();
      }
      return city;
    });
  }

  pickSettlement(available, cancellable) {
    return this.doAction_('settlement', {available, cancellable}).then((settlement) => {
      if (settlement != 'cancel') {
        this.points_++;
        this.settlementsLeft_--;
        this.sendState();
      }
      return settlement;
    });
  }

  pickRoad(available, cancellable) {
    return this.doAction_('road', {available, cancellable}).then((road) => {
      if (road != 'cancel') {
        this.roadsLeft_--;
        this.sendState();
      }
      return road;
    });
  }

  buyCard(card) {
    this.boughtCards_.push(card);
    this.sendState();
  }

  canPlayCard() {
    return this.getPlayableCards_().length > 0;
  }

  getPlayableCards_() {
    return this.cards_.filter((card) => card != Cards.VICTORY_POINT);
  }

  roll() {
    return this.doAction_('buttons', {'buttons':['Roll']});
  }

  pickAction(actions) {
    return this.doAction_('buttons', {'buttons': actions});
  }

  pickTradeAmounts(text) {
    return this.doAction_('trade', {
      'owned': this.resources_,
      'cancellable': true,
      'text': text,
    });
  }

  exchange(trades) {
    return this.doAction_('buttons', {
      'buttons': trades.map((trade) => {
        return trade[1] + " " + trade[0];
      }),
      'text': 'Select resources to give up.',
      'cancellable': true,
    }).then(async (selected) => {
      if (selected == 'cancel') {
        return ['cancel', 'cancel', 'cancel'];
      }
      const [amt, resource] = selected.split(' ');
      const pickup = await this.doAction_('buttons', {
        'buttons': Object.values(Resources).filter((r) => r != resource && r != Resources.DESERT),
        'text': 'Select resource to pick up.',
        'cancellable': true,
      });
      if (pickup == 'cancel') {
        return ['cancel', 'cancel', 'cancel'];
      }
      return [amt, resource, pickup];
    });
  }

  pickTradePartner(players) {
    return this.pickPlayer_(players, 'Pick a player to trade with:', true);
  }

  pickPlayerToRob(players) {
    return this.pickPlayer_(players, 'Pick a player to rob:', false);
  }

  pickPlayer_(players, text, cancellable) {
    return this.doAction_('player', {
      'players': players.map((player) => player.getName()),
      'text': text,
      'cancellable': cancellable,
    }).then((index) => {
      if (index == 'cancel') {
        return null;
      }
      return players[index];
    });
  }

  doAction_(type, data) {
    return new Promise((resolve) => {
      this.socket_.emit('action', {type, data}, (ans) => {
        resolve(ans);
      });
    });
  }

  addResource(resource, amt = 1) {
    this.resources_[resource] += amt;
    this.sendState();
  }

  getName() {
    return this.name_;
  }

  totalResources() {
    return Object.values(this.resources_).reduce((a, b) => a + b, 0);
  }

  sendState() {
    this.socket_.emit('self-state', this.secretSerialize());
  }

  serialize() {
    let points = this.points_;
    if (this.largestArmy_) {
      points += 2;
    }
    if (this.longestRoad_) {
      points += 2;
    }
    return {
      'name': this.name_,
      'color': this.color_,
      'cards': this.cards_.length + this.boughtCards_.length,
      'points': points,
      'resources': this.totalResources(),
      'knights': this.knightsPlayed_,
    }
  }

  secretSerialize() {
    return {
      'roads': this.roadsLeft_,
      'cities': this.citiesLeft_,
      'settlements': this.settlementsLeft_,
      'cards': [...this.cards_, ...this.boughtCards_],
      'resources': this.resources_,
    }
  }
}


class Game {
  constructor(players) {
    this.lastRoll_ = [];
    this.players_ = players;
    this.board_ = new Board();
    this.playerTurn_ = Math.floor(Math.random() * this.players_.length);
  }

  async play() {
    return this.pickSettlements().then(async () => {
      let turns = 0;
      while (!this.isGameOver()) {
        this.playerTurn_ = (this.playerTurn_ + 1) % this.players_.length;
        sendGameState();
        const player = this.players_[this.playerTurn_];
        player.alert('Your Turn');
        await player.roll();
        let roll = -1;
        while (roll < 0 || (roll == 7 && turns < this.players_.length)) {
          const die1 = Math.floor(Math.random() * 6) + 1;
          const die2 = Math.floor(Math.random() * 6) + 1;
          this.lastRoll_ = [die1, die2];
          roll = die1 + die2;
        }
        log(player.getName() + " rolled " + roll);
        sendGameState();
        if (roll != 7) {
          this.board_.collectResources(roll);
          sendGameState();
        } else {
          await Promise.all(this.players_.map((player) => player.loseHalfResources()));
          sendGameState();
          await this.moveRobber_(player);
          sendGameState();
        }
        await this.doTurn_(player);
        turns++;
      }
      return this.getWinner();
    });
  }

  async moveRobber_(player) {
    const newRobber = await player.moveRobber(this.board_.getRobberLocation());
    log(player.getName() + " moved the robber to spot " + newRobber);
    this.board_.placeRobber(newRobber);
    sendGameState();
    const playersToRob = this.board_.playersToRob(newRobber, player);
    if (playersToRob.length > 0) {
      const robbing = await player.pickPlayerToRob(playersToRob);
      const resource = robbing.getRandomResource();
      log(player.getName() + ' stole a card from ' + robbing.getName());
      robbing.addResource(resource, -1);
      player.addResource(resource);
      player.sendState();
      robbing.sendState();
      sendGameState();
    }
  }

  getTradePartners_(player) {
    if (player.totalResources() <= 0) {
      return [];
    }
    const otherPlayers = this.players_.filter((p) => p != player);
    return otherPlayers.filter((p) => p.totalResources() > 0);
  }

  canTrade_(player) {
    return this.getTradePartners_(player).length > 0;
  }

  setLongestRoad_() {
    const amts = this.players_.map((p) => this.board_.getRoadLength(p));
    const max = Math.max(...amts);
    if (max < 5) {
      return;
    }
    let hasMax = 0;
    for (let i = 0; i < amts.length; i++) {
      if (amts[i] == max) {
        hasMax++;
      }
      if (hasMax > 1) {
        return;
      }
    }
    amts.forEach((amt, index) => {
      this.players_[index].setLongestRoad(amt == max);
    });
  }

  setLargestArmy_() {
    const amts = this.players_.map((p) => p.getKnightsPlayed());
    const max = Math.max(...amts);
    if (max < 3) {
      return;
    }
    let hasMax = 0;
    for (let i = 0; i < amts.length; i++) {
      if (amts[i] == max) {
        hasMax++;
      }
      if (hasMax > 1) {
        return;
      }
    }
    this.players_.forEach((player) => {
      player.setLargestArmy(player.getKnightsPlayed() == max);
    });
  }

  createAuction_(tradeAmts, player) {
    log(player.getName() + " created an auction");
    const players = this.players_.filter((p) => p != player);
    return [...players.map((p) => {
      return p.doAuction(tradeAmts.offer, tradeAmts.asking);
    }), new Promise((resolve) => {
      setTimeout(resolve, 10000);
    })];
  }

  async doTurn_(player) {
    let hasPlayedDCard = false;
    //todo: top level enum
    const END_TURN = 'End Turn';
    const ROAD = 'Buy Road';
    const SETTLEMENT = 'Buy Settlement';
    const CITY = 'Buy City';
    const BUY_CARD = 'Buy Development Card';
    const PLAY_CARD = 'Play Development Card';
    const TRADE = 'Trade with Player';
    const EXCHANGE = 'Trade with Bank';
    const AUCTION = 'Auction';
    while (true) {
      const actions = [END_TURN];
      if (player.canAffordRoad() && this.board_.canPlaceRoad(player)) {
        actions.push(ROAD);
      }
      if (player.canAffordSettlement() && this.board_.canPlaceSettlement(player)) {
        actions.push(SETTLEMENT);
      }
      if (player.canAffordCity() && this.board_.canPlaceCity(player)) {
        actions.push(CITY);
      }
      if (player.canAffordCard() && this.board_.canBuyCard()) {
        actions.push(BUY_CARD);
      }
      if (player.canPlayCard() && !hasPlayedDCard) {
        actions.push(PLAY_CARD);
      }
      if (this.canTrade_(player)) {
        actions.push(TRADE);
      }
      if (this.board_.canTradeBank(player)) {
        actions.push(EXCHANGE);
      }
      if (this.canTrade_(player)) {
        actions.push(AUCTION);
      }
      const action = await player.pickAction(actions)
      switch (action) {
        case AUCTION:
          const auctionAmts = await player.pickTradeAmounts('Offer to anyone');
          if (auctionAmts == 'cancel') {
            break;
          }
          const winner = await Promise.any(this.createAuction_(auctionAmts, player));
          io.emit('clear');
          if (winner) {
            log(winner.getName() + " won the auction!");
            for (const resource in auctionAmts.offer) {
              const amt = auctionAmts.offer[resource];
              if (amt) {
                player.addResource(resource, -1 * amt);
                winner.addResource(resource, amt);
              }
            }
            for (const resource in auctionAmts.asking) {
              const amt = auctionAmts.asking[resource];
              if (amt) {
                player.addResource(resource, amt);
                winner.addResource(resource, -1 * amt);
              }
            }
            sendGameState();
          } else {
            log("No takers!");
          }
          break;
        case EXCHANGE:
          const [amt, drop, pickup] = await player.exchange(this.board_.getAvailableBankTrades(player));
          if (amt == 'cancel') {
            break;
          }
          log(player.getName() + " traded " + amt + " " + drop + " for a " + pickup);
          player.addResource(drop, amt * -1);
          player.addResource(pickup, 1);
          sendGameState();
          break;
        case TRADE:
          const partner = await player.pickTradePartner(this.getTradePartners_(player));
          if (!partner) {
            break;
          }
          const tradeAmts = await player.pickTradeAmounts('Offer a trade to ' + partner.getName())
          if (tradeAmts == 'cancel') {
            break;
          }
          const accept = await partner.makeOffer(player, tradeAmts.offer, tradeAmts.asking);
          const accepted = accept == 'Accept';
          if (accepted) {
            log(partner.getName() + " accepted the offer.");
            for (const resource in tradeAmts.offer) {
              const amt = tradeAmts.offer[resource];
              if (amt) {
                player.addResource(resource, -1 * amt);
                partner.addResource(resource, amt);
              }
            }
            for (const resource in tradeAmts.asking) {
              const amt = tradeAmts.asking[resource];
              if (amt) {
                player.addResource(resource, amt);
                partner.addResource(resource, -1 * amt);
              }
            }
            sendGameState();
          } else {
            log(partner.getName() + " rejected the offer.");
          }
          break;
        case PLAY_CARD:
          const card = await player.pickCard();
          if (card == 'cancel') {
            break;
          }
          hasPlayedDCard = true;
          log(player.getName() + ' played a ' + card);
          let resource;
          switch (card) {
            case Cards.KNIGHT:
              player.playKnight();
              await this.moveRobber_(player);
              this.setLargestArmy_();
              break;
            case Cards.ROAD_BUILDER:
              const road = await player.pickRoad(this.board_.availableRoads(player), false);
              log(player.getName() + " bought road " + road);
              this.board_.buyRoad(road, player);
              sendGameState();
              const roadIndex = await player.pickRoad(this.board_.availableRoads(player), false);
              log(player.getName() + " bought road " + roadIndex);
              this.board_.buyRoad(roadIndex, player);
              this.setLongestRoad_();
              sendGameState();
              break;
            case Cards.MONOPOLY:
              resource = await player.pickResource();
              const total = this.players_.reduce((total, p) => {
                if (p == player) {
                  return total;
                }
                const amt = p.takeResource(resource);
                log(`${player.getName()} took ${amt} ${resource} from ${p.getName()}`);
                return total + amt;
              }, 0);
              player.addResource(resource, total);
              break;
            case Cards.YEAR_OF_PLENTY:
              resource = await player.pickResource();
              log(player.getName() + " picked up a " + resource);
              player.addResource(resource);
              resource = await player.pickResource();
              log(player.getName() + " picked up a " + resource);
              player.addResource(resource);
              break;
          }
          break;
        case BUY_CARD:
          player.buyCard(this.board_.pickCard());
          log(player.getName() + " bought a development card.");
          player.addResource(Resources.ORE, -1);
          player.addResource(Resources.WOOL, -1);
          player.addResource(Resources.GRAIN, -1);
          sendGameState();
          break;
        case ROAD:
          const road = await player.pickRoad(this.board_.availableRoads(player), true);
          if (road == 'cancel') {
            break;
          }
          log(player.getName() + " bought road " + road);
          this.board_.buyRoad(road, player);
          player.addResource(Resources.LUMBER, -1);
          player.addResource(Resources.BRICK, -1);
          this.setLongestRoad_();
          sendGameState();
          break;
        case SETTLEMENT:
          const settlement = await player.pickSettlement(this.board_.getAvailableSettlements(player), true);
          if (settlement == 'cancel') {
            break;
          }
          this.board_.buySettlement(settlement, player);
          log(player.getName() + " bought settlement " + settlement);
          player.addResource(Resources.BRICK, -1);
          player.addResource(Resources.LUMBER, -1);
          player.addResource(Resources.WOOL, -1);
          player.addResource(Resources.GRAIN, -1);
          sendGameState();
          break;
        case CITY:
          const city = await player.pickCity(this.board_.getAvailableCities(player));
          if (city == 'cancel') {
            break;
          }
          this.board_.buyCity(city, player);
          log(player.getName() + " bought city " + city);
          player.addResource(Resources.ORE, -3);
          player.addResource(Resources.GRAIN, -2);
          sendGameState();
          break;
        case END_TURN:
          player.endTurn();
          return;
        default:
          console.log("Uhhhhhh......");
          break;
      }
    }
  }

  isGameOver() {
    return !!this.getWinner();
  }

  getWinner() {
    return this.players_.find((player) => player.getScore() >= 10);
  }

  async pickSettlements() {
    const togo = [];
    for (let i = 0; i < this.players_.length; i++) {
      togo.push(this.players_[(this.playerTurn_ + i) % this.players_.length]);
    }
    for (let i = this.players_.length - 1; i >= 0; i--) {
      togo.push(this.players_[(this.playerTurn_ + i) % this.players_.length]);
    }
    for (let i = 0; i < togo.length; i++) {
      const player = togo[i];
      this.playerTurn_ = this.players_.indexOf(player);
      sendGameState();
      player.alert('Your Turn');
      const settlement = await player.pickSettlement(this.board_.getAvailableSettlements(), false);
      this.board_.buySettlement(settlement, player);
      log(player.getName() + " picked settlement " + settlement);
      if (i >= togo.length / 2) {
        ResourceToSettlementMap.forEach((settlements, resourceIndex) => {
          if (settlements.indexOf(settlement) >= 0) {
            const resource = this.board_.getResource(resourceIndex);
            if (resource != Resources.DESERT) {
              player.addResource(resource);
              log(player.getName() + " picked up " + resource);
            }
          }
        });
      }
      sendGameState();
      const road = await player.pickRoad(this.board_.getRoadsForSettlement(settlement), false);
      this.board_.buyRoad(road, player);
      log(player.getName() + " picked road " + road);
      sendGameState();
    }
    return Promise.resolve();
  }

  serialize() {
    return {
      'roll': this.lastRoll_,
      'board': this.board_.serialize(),
      'players': this.players_.map((player) => player.serialize()),
      'playerTurn': this.players_[this.playerTurn_].getName(),
    }
  }
}

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  pingTimeout: 60000,
});
const any = require('promise.any');
Promise.any = any;

let players = [];
let game;

app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/welcome.html');
});

const MAX_PLAYERS = 4;

io.on('connection', (socket) => {
  socket.on('disconnect', (socket) => {
    console.log('disconnected');
  });
  console.log('A user connected');
  console.log('id: ' + socket.id);
  socket.on('join', (name) => {
    if (players.length >= MAX_PLAYERS) {
      return;
    }
    const color = playerColor[players.length];
    let player = new Player(name, color, socket);
    players.push(player);
    console.log(name + " has joined");
    io.emit('user-join', {
      players: players.map(player => player.serialize()),
    });
    if (players.length == MAX_PLAYERS) {
      game = new Game(players);
      sendGameState();
      log('Game Started');
      game.play().then((winner) => {
        log('Game Over!');
        io.emit('over', winner.getName());
        players = [];
      });
    }
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});

function sendGameState() {
  io.emit('game-state', game.serialize());
}

function log(msg) {
  io.emit('log', msg);
}
