function getHeight() {
  height = parseInt(document.getElementById("height").value);
  if (height < 4) height = 4;
  if (typeof height !== "number") height = 6;
  return height;
}

function getWidth() {
  width = parseInt(document.getElementById("width").value);
  if (width < 4) width = 4;
  if (typeof width !== "number") width = 7;
  return width;
}

function other_player(player) {
  if (player == 1) return 2;
  return 1;
}

function createBoard(width, height) {
  //height*2 > width*2 ? (height = width*2-2, alert("vous avez rentré une hauteur trop grande par rapport a la largeur, celle-ci a été diminuée afin de pouvoir rentrer dans la page")): false;

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
  for (let col = 0; col < board.length; col++) {
    if (board[row][col] === player && board[row][col + 1] === player)
      playerRow++;
    else if (board[row][col] !== player) playerRow = 0;

    if (playerRow >= 3) return true;
  }
  return false;
}

function checkCol(board, col) {
  playerCol = 0;
  for (let row = 0; row < board.length - 1; row++) {
    if (board[row][col] === player && board[row + 1][col] === player)
      playerCol++;
    else if (board[row][col] !== player) playerCol = 0;
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

      while (col <= board.length && row > 0) {
        if (board[row][col] === player && board[row - 1][col + 1] === player)
          playerDiag++;
        if (playerDiag >= 3) return true;

        col++;
        row--;
      }

    case 1:
      while (col < board.length && row < board.length - 1) {
        col++;
        row++;
      }

      while (row > 0 && row > 0) {
        if (board[row][col] === player && board[row - 1][col - 1] === player)
          playerDiag++;
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

function displayBoard(board, clickable) {
  const htmlBoard = document.getElementById("board");
  let numCol = "1fr ".repeat(width);
  htmlBoard.style.gridTemplateColumns = numCol;
  let insertion = "";

  for (let boardRow = 0; boardRow < board.length; boardRow++) {
    for (let boardCol = 0; boardCol < board[boardRow].length; boardCol++) {
      //console.log(boardCol);
      //console.log(boardCol, boardRow, board[boardCol][boardRow]);
      switch (board[boardRow][boardCol]) {
        case 0:
          insertion += "<img src='./assets/blank.jpg'>";
          break;
        case 1:
          insertion += "<img src='./assets/yellow.jpg'>";
          break;
        case 2:
          insertion += "<img src='./assets/red.jpg'>";
          break;
      }
    }
  }
  htmlBoard.innerHTML = insertion;

  if (clickable) clickBoard(board);
}

function clickBoard(board) {
  const htmlBoard = document.getElementById("board");
  let cells = Array.from(htmlBoard.children);
  for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = function () {
      play(board, i % 4);
    };
  }
}

function buttons(board) {
  //creating the buttons
  const htmlButtons = document.getElementById("buttons");
  let numCol = "1fr ".repeat(width);
  htmlButtons.style.gridTemplateColumns = numCol;
  let insertion = "";
  for (let boardCol = 0; boardCol < board[0].length; boardCol++) {
    insertion +=
      "<img src='./assets/arrow_downward_FILL0_wght400_GRAD0_opsz48.svg'>";
  }
  htmlButtons.innerHTML = insertion;

  //buttons logic
  let buttons = Array.from(htmlButtons.children);
  for (let col = 0; col < buttons.length; col++) {
    buttons[col].onclick = function () {
      play(board, col);
      console.log("butt", col);
    };
  }
}

function stopPlay() {
  displayBoard(board, false);

  const BUTTONS = Array.from(document.getElementById("buttons").children);
  for (let button of BUTTONS) {
    button.onclick = "";
    button.style.filter =
      "invert(67%) sepia(0%) saturate(477%) hue-rotate(180deg) brightness(98%) contrast(87%)";
  }

  const CELLS = Array.from(document.getElementById("board").children);
  for (let cell of CELLS) cell.onclick = "";
}

function initialize() {
  gameOver = false;
  player = 1;
  width = getWidth();
  height = getHeight();
  board = createBoard(width, height);
  displayBoard(board, true);
  buttons(board);
}

function play(board, col) {
  row = insertpiece(board, col + 1, player);
  if (row === false) return;

  if (checkWin(board, row, col)) gameOver = true;
  if (gameOver) stopPlay();
  else displayBoard(board, true);
  player = other_player(player);
}

initialize();

//put svg in red  | filter: invert(31%) sepia(82%) saturate(7295%) hue-rotate(354deg) brightness(106%) contrast(128%)
