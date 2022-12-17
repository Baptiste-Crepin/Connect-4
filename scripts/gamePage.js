class Game {
  constructor() {
    this.height = this.getHeight();
    this.width = this.getWidth();
    this.board = this.createBoard(this.width, this.height);
    this.player = Math.floor(Math.random() * 2) + 1;
    this.score = this.getScore();
    this.gameOver = false;

    this.time = -1;
    clearInterval(timer);
    this.timer = setInterval(this.displayTime, 1000);
  }

  resetScore = () => (this.score = [0, 0]);

  displayTime = () => {
    this.time++;
    document.getElementById("timer").innerText = this.formatTime(this.time);
  };

  otherPlayer = () => {
    if (this.player == 1) return 2;
    return 1;
  };

  playerIcon = (player) => {
    if (player == 1) return "./assets/redIcon.png";
    return "./assets/yellowIcon.png";
  };

  getScore = () => {
    score = document
      .getElementById("row1")
      .lastElementChild.innerHTML.split(" ");
    return [score[0], score[2]];
  };

  formatTime = (secs) => {
    let minutes = secs > 60 ? parseInt(secs / 60) : 0;
    minutes = minutes > 9 ? minutes : "0" + minutes;
    let seconds = parseInt(secs % 60);
    seconds = seconds > 9 ? seconds : "0" + seconds;
    return `${minutes}:${seconds}`;
  };

  getHeight = () => {
    height = parseInt(document.getElementById("height").value);
    if (height < 4) height = 4;
    if (isNaN(height)) height = 6;
    return (this.height = height);
  };

  getWidth = () => {
    width = parseInt(document.getElementById("width").value);
    if (width < 4) width = 4;
    if (isNaN(width)) width = 7;
    if (this.height * 2 < width) {
      alert(
        "La largeur que vous avez rentré est superieure a 2 fois la hauteur, cette valeur est invalide, nous avons réduit la grille pour vous."
      );
      while (this.height * 2 < width) {
        width = height * 2;
      }
    }
    return (this.width = width);
  };

  createBoard = () => {
    let board = [];
    for (let boardCol = 0; boardCol < this.height; boardCol++) {
      let row = [];
      for (let boardRow = 0; boardRow < this.width; boardRow++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  };

  clickBoard = () => {
    const htmlBoard = document.getElementById("board");
    let cells = Array.from(htmlBoard.children);
    for (let i = 0; i < cells.length; i++) {
      cells[i].onclick = function () {
        play(i % width);
      };
    }
  };

  buttons = () => {
    //creating the buttons
    const htmlButtons = document.getElementById("buttons");
    let numCol = "1fr ".repeat(width);
    htmlButtons.style.gridTemplateColumns = numCol;
    let imgWidth = 100 / (board.length / 3);
    let insertion = "";
    for (let boardCol = 0; boardCol < this.board[0].length; boardCol++) {
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
        play(col);
      };
    }
  };

  insertpiece(x) {
    if (!(x > 0 && x <= this.width)) return false;

    for (let y = 0; y < this.board.length; y++) {
      if (this.board[y][x - 1] != 0) {
        if (y == 0) return false;
        this.board[y - 1][x - 1] = this.player;
        return y - 1;
      } else if (y == this.board.length - 1) {
        this.board[y][x - 1] = this.player;
        return y;
      }
    }
  }

  checkRow = (row) => {
    let playerRow = 0;
    //console.log(row);
    for (let col = 0; col < this.board[row].length; col++) {
      if (
        this.board[row][col] === this.player &&
        this.board[row][col + 1] === this.player
      ) {
        playerRow++;
      } else if (this.board[row][col] !== this.player) playerRow = 0;

      if (playerRow >= 3) return true;
    }
    return false;
  };

  checkCol = (col) => {
    let playerCol = 0;
    for (let row = 0; row < this.board.length - 1; row++) {
      if (
        this.board[row][col] === this.player &&
        this.board[row + 1][col] === this.player
      ) {
        playerCol++;
      } else if (this.board[row][col] !== this.player) playerCol = 0;
      if (playerCol >= 3) return true;
    }
    return false;
  };

  checkDiag = (row, col, direction) => {
    let playerDiag = 0;
    switch (direction) {
      case 0:
        while (col > 0 && row < this.board.length - 1) {
          col--;
          row++;
        }

        while (col <= this.board[row].length && row > 0) {
          if (
            this.board[row][col] === this.player &&
            this.board[row - 1][col + 1] === this.player
          )
            playerDiag++;
          else playerDiag = 0;
          if (playerDiag >= 3) return true;

          col++;
          row--;
        }

      case 1:
        while (col < this.board[row].length && row < this.board.length - 1) {
          col++;
          row++;
        }

        while (row > 0 && col > 0) {
          if (
            this.board[row][col] === this.player &&
            this.board[row - 1][col - 1] === this.player
          )
            playerDiag++;
          else playerDiag = 0;
          if (playerDiag >= 3) return true;

          col--;
          row--;
        }
    }
    return false;
  };

  checkWin = (row, col) => {
    if (
      this.checkRow(row) ||
      this.checkCol(col) ||
      this.checkDiag(row, col, 0) ||
      this.checkDiag(row, col, 1)
    ) {
      return true;
    }
    return false;
  };

  checkDraw = () => {
    for (let element of this.board) {
      for (let cell of element) {
        if (cell == 0) {
          return false;
        }
      }
    }
    return true;
  };

  stopPlay = (draw) => {
    //timer
    this.displayBoard(false);

    //score
    if (draw) this.score[this.otherPlayer() - 1]++;
    this.score[this.player - 1]++;

    //display score
    document.getElementById("row1").lastElementChild.innerHTML =
      this.score[0] + " : " + this.score[1];
    let bestScores = [];
    if (sessionStorage.length > 0)
      bestScores = sessionStorage.getItem("score").split(",");

    bestScores.push([this.score]);
    sessionStorage.setItem("score", bestScores);

    //desactivate the buttons
    const BUTTONS = Array.from(document.getElementById("buttons").children);
    clearInterval(this.timer);
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
      this.playerIcon() +
      "' height='30' draggable='false'><div id='score'>" +
      this.score[0] +
      " : " +
      this.score[1] +
      "</div>";

    this.displayWinner(draw);
  };

  UpdateInfos = () => {
    //resets the row to delete the player that won while still keeping track of the score
    document.getElementById("row1").innerHTML =
      "<img src='" +
      this.playerIcon(this.player) +
      "' height='30' draggable='false'><div id='score'>" +
      this.score[0] +
      " : " +
      this.score[1] +
      "</div>";
  };

  displayWinner = (draw) => {
    const HTML_WIN_BANNER = document.getElementById("win");
    if (draw) {
      HTML_WIN_BANNER.innerHTML =
        "<img src='" +
        playerIcon(this.player) +
        "' height='80' draggable='false'><h2>It's a draw</h2><img src='" +
        playerIcon(this.otherPlayer()) +
        "' height='80' draggable='false'>";
      return;
    }
    if (!this.gameOver) {
      HTML_WIN_BANNER.innerHTML = "";
    } else {
      HTML_WIN_BANNER.innerHTML =
        "<img src='" +
        this.playerIcon(this.otherPlayer()) +
        "' height='80' draggable='false'><h2>Won the game</h2>";
    }
  };

  displayBoard = (clickable) => {
    const htmlBoard = document.getElementById("board");
    let numCol = "1fr ".repeat(width);
    htmlBoard.style.gridTemplateColumns = numCol;
    let insertion = "";
    let imgWidth = 100 / (this.board.length / 3);
    for (let boardRow = 0; boardRow < this.board.length; boardRow++) {
      for (
        let boardCol = 0;
        boardCol < this.board[boardRow].length;
        boardCol++
      ) {
        //console.log(boardCol);
        //console.log(boardCol, boardRow, board[boardCol][boardRow]);
        switch (this.board[boardRow][boardCol]) {
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
              "vw' src='./assets/yellowIcon.png' draggable='false'>";
            break;
          case 2:
            insertion +=
              "<img width='" +
              imgWidth +
              "vw' src='./assets/redIcon.png' draggable='false'>";
            break;
        }
      }
    }
    htmlBoard.innerHTML = insertion;

    if (clickable) this.clickBoard();
  };
}

function initialize(resetScore) {
  G1 = new Game();

  G1.displayTime();

  //displays
  G1.displayBoard(true);
  G1.buttons();
  G1.displayWinner(false);

  //scoring
  if (resetScore) G1.resetScore();
  G1.UpdateInfos();
}

function play(col) {
  let row = G1.insertpiece(col + 1);
  if (row === false) return;
  if (G1.checkWin(row, col)) G1.gameOver = true;
  if (G1.checkDraw()) G1.stopPlay(true);

  G1.UpdateInfos();
  if (G1.gameOver) G1.stopPlay(false);
  else G1.displayBoard(true);
  G1.player = G1.otherPlayer();
}

initialize();
