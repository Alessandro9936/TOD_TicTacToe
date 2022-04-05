"use script";

const Player = (username, s) => {
  const name = username;
  const sign = s ? s : "o";
  let setActive = s ? true : false;

  const getName = () => {
    return name;
  };

  const getSign = () => {
    return sign;
  };

  const getActive = () => {
    return setActive;
  };

  const toggleActive = () => {
    setActive === true ? (setActive = false) : (setActive = true);
  };

  return {
    getSign,
    getActive,
    getName,
    toggleActive,
  };
};

//////////////////////////////////////////////

const gameLogic = (() => {
  let player1, player2;
  let arrPlays;

  init = (username1, username2) => {
    arrPlays = ["", "", "", "", "", "", "", "", ""];

    player1 = Player(username1, "x");
    player2 = Player(username2);

    displayController.displayTurn(player1.getName());
  };

  const handleEvent = (e) => {
    if (e.target.textContent === "") {
      const clickedCell = e.target.dataset.cell;

      const getSign = player1.getActive()
        ? player1.getSign()
        : player2.getSign();
      displayController.displaySign(getSign, e.target);

      const nextPlayer = player1.getActive()
        ? player2.getName()
        : player1.getName();
      displayController.displayTurn(nextPlayer);

      player1.toggleActive();

      arrPlays.splice(clickedCell, 1, getSign);
      _checkArray();
    }
  };

  _checkArray = () => {
    //Check Rows
    if (arrPlays[0] && arrPlays[1] && arrPlays[2]) {
      _checkWinner(arrPlays[0], arrPlays[1], arrPlays[2]);
    }

    if (arrPlays[3] && arrPlays[4] && arrPlays[5]) {
      _checkWinner(arrPlays[3], arrPlays[4], arrPlays[5]);
    }

    if (arrPlays[6] && arrPlays[7] && arrPlays[8]) {
      _checkWinner(arrPlays[6], arrPlays[7], arrPlays[8]);
    }

    //Check Columns
    if (arrPlays[0] && arrPlays[3] && arrPlays[6]) {
      _checkWinner(arrPlays[0], arrPlays[3], arrPlays[6]);
    }

    if (arrPlays[1] && arrPlays[4] && arrPlays[7]) {
      _checkWinner(arrPlays[1], arrPlays[4], arrPlays[7]);
    }

    if (arrPlays[2] && arrPlays[5] && arrPlays[8]) {
      _checkWinner(arrPlays[2], arrPlays[5], arrPlays[8]);
    }

    //Check Diagonals
    if (arrPlays[0] && arrPlays[4] && arrPlays[8]) {
      _checkWinner(arrPlays[0], arrPlays[4], arrPlays[8]);
    }

    if (arrPlays[2] && arrPlays[4] && arrPlays[6]) {
      _checkWinner(arrPlays[2], arrPlays[4], arrPlays[6]);
    }

    //Check Draw
    if (arrPlays.every((play) => play !== "")) {
      displayController.displayDraw();
    }
  };

  _checkWinner = (...args) => {
    args.every((arg) => arg === "x")
      ? displayController.displayWinner(player1.getName())
      : args.every((arg) => arg === "o")
      ? displayController.displayWinner(player2.getName())
      : "";
  };

  const resetGame = () => {
    player1 = "";
    player2 = "";
    arrPlays = "";

    displayController.resetUI();
  };

  return { handleEvent, init, resetGame };
})();
///////////////////////////////////////////7

const displayController = (() => {
  const content = document.querySelector(".content");
  const gridBoard = document.querySelector(".board-grid");
  const modal = document.querySelector(".modal");
  const startBtn = document.querySelector(".start-game");
  const winnerText = document.querySelector(".winner");
  const restartBtn = document.querySelector(".restart-btn");

  const displaySign = (sign, cell) => {
    cell.textContent = sign;
  };

  const displayTurn = (player) => {
    const h2 = document.querySelector(".aaa");
    player ? (h2.textContent = `${player}'s Turn`) : (h2.textContent = "");
  };

  const toggleContainers = () => {
    gridBoard.classList.toggle("hidden");
    winnerText.classList.toggle("hidden");
  };

  const displayWinner = (player) => {
    displayTurn();
    toggleContainers();
    winnerText.textContent = `${player}, You Are The Winner`;
  };

  const displayDraw = () => {
    toggleContainers();
    winnerText.textContent = "It's a draw, no winner!";
  };

  const resetUI = () => {
    const inputs = modal.querySelectorAll(".input-name");
    inputs.forEach((input) => (input.value = ""));

    const cells = gridBoard.querySelectorAll(".cell");
    cells.forEach((cell) => (cell.textContent = ""));
  };

  const manageStatus = (e) => {
    const username1 = document.querySelector(".player-1").value;
    const username2 = document.querySelector(".player-2").value;

    modal.classList.toggle("hidden");
    content.classList.toggle("hidden");

    if (e.target.classList.contains("start-game")) {
      gameLogic.init(username1, username2);
    } else if (e.target.classList.contains("restart-btn")) {
      toggleContainers();
      gameLogic.resetGame();
    }
  };

  gridBoard.addEventListener("click", gameLogic.handleEvent);

  startBtn.addEventListener("click", manageStatus);

  restartBtn.addEventListener("click", manageStatus);

  return { displaySign, displayWinner, displayDraw, displayTurn, resetUI };
})();
