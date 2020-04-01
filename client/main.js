
let socket = io();
let joined = false;
function onSubmit() {
  const name = document.getElementById('name').value;
  if (name.length <= 0) {
    return;
  }
  const welcome = document.getElementById('welcome');
  welcome.remove();
  joined = true;
  socket.emit('join', name);
}
socket.on('user-join', (data) => {
  const playerDivs = document.getElementsByClassName('player');
  for (let i = 0; i < playerDivs.length; i++) {
    const playerDiv = playerDivs[i];
    const nameDiv = playerDiv.getElementsByClassName('name')[0];
    const player = data.players[i];
    nameDiv.textContent = player ? player.name : '';
  }
});
socket.on('log', (text) => {
  const logDiv = document.getElementById('log');
  const textDiv = document.createElement('div');
  textDiv.textContent = text;
  logDiv.insertBefore(textDiv, logDiv.firstChild);
});

socket.on('over', (winner) => {
  alert(winner + " has won!  Refresh the page to play again.");
});

socket.on('game-state', (data) => {
  const playerDivs = document.getElementsByClassName('player');
  data.players.forEach((player, i) => {
    const playerDiv = playerDivs[i];
    playerDiv.style.color = player.color;
    const nameDiv = playerDiv.getElementsByClassName('name')[0];
    nameDiv.textContent = player.name;
    const cardDiv = playerDiv.getElementsByClassName('cards')[0];
    cardDiv.textContent = 'Cards: ' + player.cards;
    const pointDiv = playerDiv.getElementsByClassName('points')[0];
    pointDiv.textContent = 'Points: ' + player.points;
    const resourceDiv = playerDiv.getElementsByClassName('resources-held')[0];
    resourceDiv.textContent = 'Resources: ' + player.resources;
    const knightsDiv = playerDiv.getElementsByClassName('knights')[0];
    knightsDiv.textContent = 'Knights: ' + player.knights;
  });
  const resourceCell = document.getElementsByClassName('cell');
  data.board.resources.forEach((resource, i) => {
    resourceCell[i].classList.add(resource);
  });
  const chitNodes = document.getElementsByClassName('chit');
  data.board.chits.forEach((chit, i) => {
    const chitNode = chitNodes[i];
    chitNode.textContent = chit;
    if (i == data.board.robber) {
      chitNode.style.color = 'darkgrey';
    } else {
      chitNode.style.color = 'black';
    }
  });
  const playerTurnNode = document.getElementById('player-turn');
  playerTurnNode.textContent = data.playerTurn + '\'s Turn';
  const settlementButtons = document.getElementsByClassName('settlement');
  data.board.settlements.forEach((settlement, i) => {
    if (settlement.color != '') {
      settlementButtons[i].style.backgroundColor = settlement.color;
      settlementButtons[i].style.visibility = 'visible';
      if (settlement.city) {
        settlementButtons[i].classList.add('city');
      }
    }
  });
  const roadDivs = document.getElementsByClassName('road');
  data.board.roads.forEach((road, i) => {
    if (road != '') {
      roadDivs[i].style.backgroundColor = road;
    }
  });
});
socket.on('self-state', (data) => {
  const roadsLeftDiv = document.getElementById('roads-left');
  roadsLeftDiv.textContent = data.roads;
  const settlementsLeftDiv = document.getElementById('settlements-left');
  settlementsLeftDiv.textContent = data.settlements;
  const citiesLeftDiv = document.getElementById('cities-left');
  citiesLeftDiv.textContent = data.cities;
  const bricksDiv = document.getElementById('brick');
  bricksDiv.textContent = data.resources.brick;
  const grainDiv = document.getElementById('grain');
  grainDiv.textContent = data.resources.grain;
  const lumberDiv = document.getElementById('lumber');
  lumberDiv.textContent = data.resources.lumber;
  const oreDiv = document.getElementById('ore');
  oreDiv.textContent = data.resources.ore;
  const woolDiv = document.getElementById('wool');
  woolDiv.textContent = data.resources.wool;
  const cardHolderDiv = document.getElementById('cards-held');
  cardHolderDiv.innerHTML = '';
  data.cards.forEach((card) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.textContent = card;
    cardHolderDiv.appendChild(cardDiv);
  });
});

function clearActions() {
  const actionTextNode = document.getElementById('action-info');
  const buttonsNode = document.getElementById('buttons');
  actionTextNode.textContent = '';
  buttonsNode.innerHTML = '';
  const settlementButtons = [...document.getElementsByClassName('settlement')];
  settlementButtons.forEach((button) => {
    button.classList.remove('available');
    button.onclick = null;
  });
  const roadDivs = [...document.getElementsByClassName('road')];
  roadDivs.forEach((road) => {
    road.classList.remove('available');
    road.onclick = null;
  });
}

socket.on('clear', () => {
  clearActions();
});

socket.on('alert', (msg) => {
  const audio = document.getElementById('notification');
  audio.src = "./resources/notification.mp3";
  audio.play();
  alert(msg.text);
});

socket.on('action', (msg, resolve) => {
  const actionTextNode = document.getElementById('action-info');
  const buttonsNode = document.getElementById('buttons');
  switch (msg.type) {
    case 'trade':
      actionTextNode.textContent = 'Create a trade offer';
      const ownedDiv = document.createElement('div');
      ownedDiv.textContent = 'Offering: ';
      for (const resource in msg.data.owned) {
        const amt = msg.data.owned[resource];
        if (amt > 0) {
          const container = document.createElement('span');
          const label = document.createElement('label');
          label.textContent = resource;
          const input = document.createElement('input');
          input.type = 'number';
          input.min = 0;
          input.max = amt;
          input.step = 1;
          input.resource = resource;
          container.appendChild(label);
          container.appendChild(input);
          ownedDiv.appendChild(container);
        }
      }
      buttonsNode.appendChild(ownedDiv);
      const partnerDiv = document.createElement('div');
      partnerDiv.textContent = 'For: ';
      for (const resource in msg.data.owned) {
        const container = document.createElement('span');
        const label = document.createElement('label');
        label.textContent = resource;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 99;
        input.step = 1;
        input.resource = resource;
        container.appendChild(label);
        container.appendChild(input);
        partnerDiv.appendChild(container);
      }
      buttonsNode.appendChild(partnerDiv);
      const offerButton = document.createElement('button');
      offerButton.textContent = 'Make Offer';
      offerButton.onclick = () => {
        const offering = {};
        const asking = {};
        const ownedInputs = [...ownedDiv.getElementsByTagName('input')];
        let total = 0;
        for (let i = 0; i < ownedInputs.length; i++) {
          const value = parseInt(ownedInputs[i].value, 10);
          const resource = ownedInputs[i].resource;
          if (value < 0 || value > msg.data.owned[resource]) {
            return;
          }
          offering[resource] = value;
          total += value;
        }
        if (total <= 0) {
          return;
        }
        total = 0;
        const askingInputs = [...partnerDiv.getElementsByTagName('input')];
        for (let i = 0; i < askingInputs.length; i++) {
          const value = parseInt(askingInputs[i].value, 10);
          const resource = askingInputs[i].resource;
          asking[resource] = value;
          total += value;
        }
        if (total <= 0) {
          return;
        }
        clearActions();
        resolve({'offer': offering, 'asking': asking});
      };
      buttonsNode.append(offerButton);
      break;
    case 'player':
      actionTextNode.textContent = msg.data.text
      msg.data.players.forEach((player, index) => {
        const playerButton = document.createElement('button');
        playerButton.textContent = player;
        playerButton.onclick = () => {
          clearActions();
          resolve(index);
        };
        buttonsNode.appendChild(playerButton);
      });
      break;
    case 'move-robber':
      actionTextNode.textContent = 'Pick a place to put the robber';
      const chitNodes = [...document.getElementsByClassName('chit')];
      chitNodes.forEach((chit, index) => {
        if (index != msg.data.current) {
          chit.classList.add('available');
          chit.onclick = () => {
            console.log('resolving');
            resolve(index);
          };
        }
      });
      break;
    case 'drop-resources':
      actionTextNode.textContent = 'Pick ' + msg.data.amt + ' resources to drop.';
      for (const resource in msg.data.resources) {
        const amt = msg.data.resources[resource];
        if (amt > 0) {
          const container = document.createElement('span');
          const label = document.createElement('label');
          label.textContent = resource;
          const input = document.createElement('input');
          input.type = 'number';
          input.classList.add('resource-dropper');
          input.min = 0;
          input.max = amt;
          input.step = 1;
          input.id = resource;
          container.appendChild(label);
          container.appendChild(input);
          buttonsNode.appendChild(container);
        }
      }
      const submit = document.createElement('button');
      submit.textContent = 'Submit';
      buttonsNode.append(submit);
      submit.onclick = () => {
        console.log('submit clicked');
        const ans = {};
        const inputs = [...document.getElementsByClassName('resource-dropper')];
        let total = 0;
        inputs.forEach((input) => {
          const amt = parseInt(input.value, 10);
          if (amt >= 0 && amt <= msg.data.resources[input.id]) {
            total += parseInt(input.value, 10);
            ans[input.id] = input.value;
          }
        });
        if (total == msg.data.amt) {
          clearActions();
          resolve(ans);
        }
      };
      break;
    case 'city':
      actionTextNode.textContent = 'Pick a settlement to city';
      console.log('available: ' + msg.data.available);
      const settlementButtons = document.getElementsByClassName('settlement');
      msg.data.available.forEach((index) => {
        const settlementButton = settlementButtons[index];
        settlementButton.classList.add('available');
        settlementButton.onclick = () => {
          clearActions();
          resolve(index);
        };
      });
      break;
    case 'settlement':
      actionTextNode.textContent = 'Pick a place to settle';
      const buttons = document.getElementsByClassName('settlement');
      msg.data.available.forEach((index) => {
        const settlementButton = buttons[index];
        settlementButton.classList.add('available');
        settlementButton.onclick = () => {
          clearActions();
          resolve(index);
        };
      });
      break;
    case 'road':
      actionTextNode.textContent = 'Pick a road';
      const roadDivs = document.getElementsByClassName('road');
      msg.data.available.forEach((index) => {
        const roadDiv = roadDivs[index];
        roadDiv.classList.add('available');
        roadDiv.onclick = () => {
          clearActions();
          resolve(index);
        };
      });
      break;
    case 'buttons':
      actionTextNode.textContent = msg.data.text || 'Select:';
      msg.data.buttons.forEach((text) => {
        const rollButton = document.createElement('button');
        rollButton.textContent = text;
        rollButton.onclick = () => {
          clearActions();
          resolve(text);
        };
        buttonsNode.appendChild(rollButton);
      });
      break;
    default:
      console.log("Unknown message type: " + data.type);
      break;
  }
  if (msg.data.cancellable) {
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => {
      clearActions();
      resolve('cancel');
    }
    buttonsNode.appendChild(cancelButton);
  }
});
