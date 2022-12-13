function getHeight() {
  height = parseInt(document.getElementById("height").value);
  if (height < 4) height = 4;
  if (isNaN(height)) height = 6;
  return height;
}

function getWidth() {
  width = parseInt(document.getElementById("width").value);
  if (width < 4) width = 4;
  if (isNaN(width)) width = 7;
  return width;
}

function isValidDimentions(width, height) {
  if (height * 2 < width) {
    alert(
      "La largeur que vous avez rentré est superieure a 2 fois la hauteur, cette valeur est invalide, nous avons réduit la grille pour vous."
    );
  }
  while (height * 2 < width) {
    width = height * 2;
    createBoard(width, height);
  }
  return width;
}

function otherPlayer(player) {
  if (player == 1) return 2;
  return 1;
}

function playerIcon(player) {
  if (player == 1) return "./assets/redIcon.png";
  return "./assets/yellowIcon.png";
}

function createBoard(width, height) {
  let board = [];
  for (let boardCol = 0; boardCol < height; boardCol++) {
    let row = [];
    for (let boardRow = 0; boardRow < width; boardRow++) {
      row.push(0);
    }
    board.push(row);
  }
  return board;
}

function insertpiece(board, x, player) {
  if (!(x > 0 && x <= width)) return false;

  for (let y = 0; y < board.length; y++) {
    if (board[y][x - 1] != 0) {
      if (y == 0) return false;
      board[y - 1][x - 1] = player;
      return y - 1;
    } else if (y == board.length - 1) {
      board[y][x - 1] = player;
      return y;
    }
  }
}

function checkRow(board, row) {
  playerRow = 0;
  for (let col = 0; col < board[row].length; col++) {
    if (board[row][col] === player && board[row][col + 1] === player) {
      playerRow++;
    } else if (board[row][col] !== player) playerRow = 0;

    if (playerRow >= 3) return true;
  }
  return false;
}

function checkCol(board, col) {
  playerCol = 0;
  for (let row = 0; row < board.length - 1; row++) {
    if (board[row][col] === player && board[row + 1][col] === player) {
      playerCol++;
    } else if (board[row][col] !== player) playerCol = 0;
    if (playerCol >= 3) return true;
  }
  return false;
}

function checkDiag(board, row, col, direction) {
  playerDiag = 0;
  switch (direction) {
    case 0:
      while (col > 0 && row < board.length - 1) {
        col--;
        row++;
      }

      while (col <= board[row].length && row > 0) {
        if (board[row][col] === player && board[row - 1][col + 1] === player)
          playerDiag++;
        else playerDiag = 0;
        if (playerDiag >= 3) return true;

        col++;
        row--;
      }

    case 1:
      while (col < board[row].length && row < board.length - 1) {
        col++;
        row++;
      }

      while (row > 0 && col > 0) {
        if (board[row][col] === player && board[row - 1][col - 1] === player)
          playerDiag++;
        else playerDiag = 0;
        if (playerDiag >= 3) return true;

        col--;
        row--;
      }
  }
  return false;
}

function checkWin(board, row, col) {
  if (
    checkRow(board, row) ||
    checkCol(board, col) ||
    checkDiag(board, row, col, 0) ||
    checkDiag(board, row, col, 1)
  ) {
    return true;
  }
  return false;
}

function checkDraw(board) {
  for (element of board) {
    for (cell of element) {
      if (cell == 0) {
        return false;
      }
    }
  }
  return true;
}

function clickBoard(board) {
  const htmlBoard = document.getElementById("board");
  let cells = Array.from(htmlBoard.children);
  for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = function () {
      play(board, i % width);
    };
  }
}

function displayBoard(board, clickable) {
  const htmlBoard = document.getElementById("board");
  let numCol = "1fr ".repeat(width);
  htmlBoard.style.gridTemplateColumns = numCol;
  let insertion = "";
  let imgWidth = 100 / (board.length / 3);
  for (let boardRow = 0; boardRow < board.length; boardRow++) {
    for (let boardCol = 0; boardCol < board[boardRow].length; boardCol++) {
      //console.log(boardCol);
      //console.log(boardCol, boardRow, board[boardCol][boardRow]);
      switch (board[boardRow][boardCol]) {
        case 0:
          insertion +=
            "<img width='" +
            imgWidth +
            "vw' src='./assets/blank.png' draggable='false'>";
          break;
        case 1:
          insertion +=
            "<img width='" +
            imgWidth +
            "vw' src='./assets/yellow.png' draggable='false'>";
          break;
        case 2:
          insertion +=
            "<img width='" +
            imgWidth +
            "vw' src='./assets/red.png' draggable='false'>";
          break;
      }
    }
  }
  htmlBoard.innerHTML = insertion;

  if (clickable) clickBoard(board);
}

function buttons(board) {
  //creating the buttons
  const htmlButtons = document.getElementById("buttons");
  let numCol = "1fr ".repeat(width);
  htmlButtons.style.gridTemplateColumns = numCol;
  let imgWidth = 100 / (board.length / 3);
  let insertion = "";
  for (let boardCol = 0; boardCol < board[0].length; boardCol++) {
    insertion +=
      "<img width='" +
      imgWidth +
      "vw'src='./assets/arrow_downward.svg' draggable='false'>";
  }
  htmlButtons.innerHTML = insertion;

  //buttons logic
  let buttons = Array.from(htmlButtons.children);
  for (let col = 0; col < buttons.length; col++) {
    buttons[col].onclick = function () {
      play(board, col);
    };
  }
}

function displayTime() {
  time++;
  document.getElementById("timer").innerText = formatTime(time);
}

function formatTime(secs) {
  minutes = secs > 60 ? parseInt(secs / 60) : 0;
  minutes = minutes > 9 ? minutes : "0" + minutes;
  let seconds = parseInt(secs % 60);
  seconds = seconds > 9 ? seconds : "0" + seconds;
  return `${minutes}:${seconds}`;
}

function UpdateInfos(player, score) {
  //resets the row to delete the player that won while still keeping track of the score
  document.getElementById("row1").innerHTML =
    "<img src='" +
    playerIcon(player) +
    "' height='30' draggable='false'><div id='score'>" +
    score[0] +
    " : " +
    score[1] +
    "</div>";
}

function getScore() {
  score = document.getElementById("row1").lastElementChild.innerHTML.split(" ");
  score = [score[0], score[2]];
  return score;
}

function displayWinner(player, gameOver) {
  const HTML_WIN_BANNER = document.getElementById("win");
  if (!gameOver) {
    HTML_WIN_BANNER.innerHTML = "";
  } else {
    HTML_WIN_BANNER.innerHTML =
      "<img src='" +
      playerIcon(player) +
      "' height='80' draggable='false'>Won the game";
  }
}

function stopPlay(player) {
  //timer
  displayBoard(board, false);

  //score
  score[player - 1]++;
  document.getElementById("row1").lastElementChild.innerHTML =
    score[0] + " : " + score[1];
  if (sessionStorage.length > 0) {
    bestScores = sessionStorage.getItem("score").split(",");
  } else bestScores = [];
  bestScores.push([score]);
  sessionStorage.setItem("score", bestScores);

  const BUTTONS = Array.from(document.getElementById("buttons").children);
  clearInterval(timer);
  for (let button of BUTTONS) {
    button.onclick = "";
    button.style.filter =
      "invert(67%) sepia(0%) saturate(477%) hue-rotate(180deg) brightness(98%) contrast(87%)";
  }

  const CELLS = Array.from(document.getElementById("board").children);
  for (let cell of CELLS) cell.onclick = "";
  //console.log(player);
  document.getElementById("row1").innerHTML =
    "<img src='" +
    playerIcon(player) +
    "' height='30' draggable='false'><div id='score'>" +
    score[0] +
    " : " +
    score[1] +
    "</div>";

  displayWinner(otherPlayer(player), true);
}

function initialize(resetScore) {
  gameOver = false;
  player = Math.floor(Math.random() * 2) + 1;
  height = getHeight();
  width = isValidDimentions(getWidth(), height);
  board = createBoard(width, height);
  score = 0;
  time = -1;
  clearInterval(timer);
  displayTime();
  timer = setInterval(displayTime, 1000);
  displayBoard(board, true);
  buttons(board);
  displayWinner(player, false);

  if (resetScore) {
    score = [0, 0];
    UpdateInfos(player, score);
  } else score = getScore();
}

function play(board, col) {
  row = insertpiece(board, col + 1, player);
  if (row === false) return;
  if (checkWin(board, row, col)) gameOver = true;
  if (checkDraw(board)) {
    score[otherPlayer(player) - 1]++;
    gameOver = true;
  }

  UpdateInfos(player, score);
  if (gameOver) stopPlay(player);
  else displayBoard(board, true);
  player = otherPlayer(player);
}

initialize();
