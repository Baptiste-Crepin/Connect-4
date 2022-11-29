function createBoard(width, height) {
  //height*2 > width*2 ? (height = width*2-2, alert("vous avez rentré une hauteur trop grande par rapport a la largeur, celle-ci a été diminuée afin de pouvoir rentrer dans la page")): false;

  let board = [];
  for (let boardCol = 0; boardCol < height; boardCol++) {
    let row = [];
    for (let boardRow = 0; boardRow < width; boardRow++) {
      row.push(0);
    }
    //console.log(row);
    board.push(row);
  }
  return board;
}

function other_player(player) {
  if (player == 1) {
    return 2;
  }
  return 1;
}

function insertpiece(board, x, player) {
  //console.log("b", board, x, player);
  if (!(x > 0 && x <= width)) {
    return false;
  }

  for (let y = 0; y < board[x - 1].length; y++) {
    if (board[y][x - 1] != 0) {
      if (y == 0) {
        return false;
      }
      board[y - 1][x - 1] = player;
      return board;
    } else if (y == board[x - 1].length - 1) {
      board[y][x - 1] = player;
      return board;
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
  for (let boardCol = 0; boardCol < board.length; boardCol++) {
    insertion +=
      "<button style='white-space:pre-line; border-radius: 1rem;'>|\n|\nV</button>";
  }
  htmlButtons.innerHTML = insertion;

  //buttons logic
  let buttons = Array.from(htmlButtons.children);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      if (!insertpiece(board, i + 1, player)) return;
      displayBoard(board);
      //console.log(checkRow(board));
      console.log(checkCol(board));
      player = other_player(player);
    };
  }
}

function checkRow(board) {
  for (row of board) {
    playerRow = 0;
    for (let i = 0; i < board.length; i++) {
      if (row[i] === player && row[i + 1] === player) {
        //console.log(col, row[i + 1], player);
        playerRow++;
      }
      if (playerRow >= 3) {
        console.log("WIN");
        return true;
      }
    }
  }
  console.log("notwin", player);
  return false;
}

function checkCol(board) {
  for (let j = 0; j < board[board.length - 1].length; j++) {
    playerCol = 0;
    for (let i = 0; i < board.length - 1; i++) {
      if (board[i][j] === player && board[i + 1][j] === player) {
        console.log("INSIDE");
        playerCol++;
      }
      //console.log("test", 1 == 1, playerCol >= 3);
      if (playerCol >= 3) {
        console.log("WIN");
        return true;
      }
    }
  }
  console.log("notwin", playerCol);
  return false;
}

player = 2;
width = 7;
height = 7;
board = createBoard(width, height);
//insertpiece(board, 1, 1);
console.log(board);

buttons(board);
displayBoard(board);
