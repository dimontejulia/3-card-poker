const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const userInput = function () {
  let lines = [];
  rl.on("line", (line) => {
    lines.push(line);
  }).on("close", () => {
    const parsedInput = parseInput(lines);
    if (parsedInput) {
      gameControl(parsedInput);
    }
  });
};

const parseInput = function (input) {
  const numPlayers = input.shift();
  if (numPlayers < 24 && numPlayers > 1) {
    let playerCards = [];
    for (let line of input) {
      const vals = line.split(" ");
      playerCards.push({ id: vals.shift(), cards: vals, score: 0 });
    }
    return playerCards;
  }
  console.log(`${numPlayers} is an invalid number of players.`);
};

const straight = function (cards) {
  const playingCards = "23456789TJQKA";
  const orderedCards = cards.sort();
  const indices = orderedCards.map((card) => playingCards.indexOf(card[0]));
  if (indices[0] + 1 === indices[1] && indices[1] + 1 === indices[2])
    return true;
  return false;
};

//returns number of cards that are the same number
const sameNum = function (cards) {
  cards = cards.map((card) => card[0]);
  let count = {};
  cards.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  return Math.max(...Object.values(count));
};

const flush = function (cards) {
  const suit = cards[0][1];
  for (let card of cards) {
    if (card[1] !== suit) {
      return false;
    }
  }
  return true;
};

const highestCard = function (playerCards) {
  const playingCards = "23456789TJQKA";
  const currentCards = playerCards.cards;
  let indices = currentCards.map((card) => playingCards.indexOf(card[0][0]));
  return indices.sort(function (a, b) {
    return b - a;
  });
};

const compareCards = function (player1, player2) {
  const cards1 = highestCard(player1);
  const cards2 = highestCard(player2);
  for (let i = 0; i < 3; i++) {
    if (cards1[i] > cards2[i]) {
      return player1;
    } else if (cards2[i] > cards1[i]) {
      return player2;
    }
  }
  return "TIE";
};

const gameControl = function (currentRound) {
  let playersRank = {};
  let winningScore = 0,
    winningPlayer;
  for (let player of currentRound) {
    if (straight(player.cards) && flush(player.cards)) {
      currentRound[player.id].score = 100;
    } else if (sameNum(player.cards) === 3) {
      currentRound[player.id].score = 90;
    } else if (straight(player.cards)) {
      currentRound[player.id].score = 80;
    } else if (flush(player.cards)) {
      currentRound[player.id].score = 70;
    } else if (sameNum(player.cards) === 2) {
      currentRound[player.id].score = 60;
    } else {
      const highCard = highestCard(player);
      currentRound[player.id].score = highCard[0];
    }

    if (player.score > winningScore) {
      winningPlayer = player;
      winningScore = player.score;
    } else if (player.score === winningScore) {
      const tieBreak = compareCards(player, winningPlayer);
      if (tieBreak === "TIE") {
        winningPlayer = [winningPlayer, player];
        winningScore = player.score;
      } else {
        winningPlayer = tieBreak;
        winningScore = tieBreak.score;
      }
    }
  }
  if (winningPlayer.id) {
    console.log(winningPlayer.id);
  } else {
    let output = "";
    for (let player of winningPlayer) {
      output += player.id + " ";
    }
    console.log(output);
  }
};

const playerCards = [
  { id: "0", cards: ["Kh", "4d", "3c"] },
  { id: "1", cards: ["Jd", "5c", "7s"] },
  { id: "2", cards: ["9s", "3h", "2d"] },
];

const playerCards2 = [
  { id: "0", cards: ["2c", "As", "4d"] },
  { id: "1", cards: ["Kd", "5d", "6d"] },
  { id: "2", cards: ["Jc", "Jd", "9s"] },
  { id: "3", cards: ["3c", "Jd", "9s"] },
  { id: "4", cards: ["Qc", "Qd", "9s"] },
];

const playerCards3 = [
  { id: "0", cards: ["2c", "As", "4d"] },
  { id: "1", cards: ["Kd", "5d", "6d"] },
  { id: "2", cards: ["Jc", "Jd", "9s"] },
  { id: "3", cards: ["3c", "Jc", "9c"] },
  { id: "4", cards: ["Qc", "Qd", "9s"] },
];

userInput();
