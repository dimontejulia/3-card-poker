/**
 * 3 Card Poker Game
 * Reads all players hands and returns the ID of the winning players hand.
 */

//create interface - takes 2 arguments for standard input and reading standard output
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

//read input to start the game
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

//parse through input to make sure all values are valid
//add values to an object for gameplay
const parseInput = function (input) {
  const numPlayers = input.shift();
  if (numPlayers < 24 && numPlayers > 1) {
    //valid number of players
    let playerCards = [];
    for (let line of input) {
      const vals = line.split(" ");
      if (vals.length !== 4) {
        //invalid number of cards given
        return console.log("Invalid number of cards given.");
      } else {
        playerCards.push({ id: vals.shift(), cards: vals, score: 0 });
      }
    }
    //ensure number of cards and number of players match
    if (playerCards.length == numPlayers) {
      return playerCards;
    } else {
      console.log(
        "Number of players and number of cards hand given do not match."
      );
    }
    //error handling for invalid input
  } else {
    console.log(`${numPlayers} is an invalid number of players.`);
  }
};

//main game function
//calculates points for different hands
//calulates winner based off of points
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

    //update winning player
    if (player.score > winningScore) {
      winningPlayer = player;
      winningScore = player.score;
    } else if (player.score === winningScore) {
      //handle ties
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
  getWinner(winningPlayer);
};

//returns true if cards are a straight (eg. 4h, 5c, 6s)
const straight = function (cards) {
  const playingCards = "23456789TJQKA";
  const orderedCards = cards.sort();
  const indices = orderedCards.map((card) => playingCards.indexOf(card[0]));
  if (indices[0] + 1 === indices[1] && indices[1] + 1 === indices[2])
    return true;
  return false;
};

//returns the number of cards that are the same number
const sameNum = function (cards) {
  cards = cards.map((card) => card[0]);
  let count = {};
  cards.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  return Math.max(...Object.values(count));
};

//returns true if cards are a flush (same suit)
const flush = function (cards) {
  const suit = cards[0][1];
  for (let card of cards) {
    if (card[1] !== suit) {
      return false;
    }
  }
  return true;
};

//returns highest card (converted into a score to handle face cards)
const highestCard = function (playerCards) {
  const playingCards = "23456789TJQKA";
  const currentCards = playerCards.cards;
  let indices = currentCards.map((card) => playingCards.indexOf(card[0][0]));
  return indices.sort(function (a, b) {
    return b - a;
  });
};

//compare 2 sets of cards to handle ties
//returns either a winning hand or "TIE"
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

//prints out winning id
//prints multiple ids if there are multiple winners
const getWinner = function (winningPlayer) {
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

//program starts with a call to fetch user input
userInput();
