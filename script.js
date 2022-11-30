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

function other_player(player) {
  if (player == 1) return 2;
  return 1;
}

function insertpiece(board, x, player) {
  if (!(x > 0 && x <= width)) return false;

  for (let y = 0; y < board.length; y++) {
    if (board[y][x - 1] != 0) {
      console.log(y);
      if (y == 0) return false;
      board[y - 1][x - 1] = player;
      return y - 1;
    } else if (y == board.length - 1) {
      board[y][x - 1] = player;
      return y;
    }
  }
}

function displayBoard(board) {
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

  let child = Array.from(htmlBoard.children);
  child.forEach((element) => {
    element.style.width = (60 / width) * 0.5 + "vw";
  });
}

function buttons(board) {
  //creating the buttons
  const htmlButtons = document.getElementById("buttons");
  let numCol = "1fr ".repeat(width);
  htmlButtons.style.gridTemplateColumns = numCol;
  let insertion = "";
  for (let boardCol = 0; boardCol < board[0].length; boardCol++) {
    insertion +=
      "<button style='white-space:pre-line; border-radius: 1rem;'>|\n|\nV</button>";
  }
  htmlButtons.innerHTML = insertion;

  //buttons logic
  let buttons = Array.from(htmlButtons.children);
  for (let col = 0; col < buttons.length; col++) {
    buttons[col].onclick = function () {
      row = insertpiece(board, col + 1, player);
      if (row === false) return;
      displayBoard(board);
      console.log(checkRow(board, row));
      console.log(checkCol(board, col));
      console.log(checkDiag(board, row, col, 0));
      console.log(checkDiag(board, row, col, 1));

      player = other_player(player);
    };
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
      console.log("before ", row, col);
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

function connectFour() {
  player = 1;
  width = 7;
  height = 6;
  board = createBoard(width, height);
  buttons(board);
  displayBoard(board);
}

connectFour();
