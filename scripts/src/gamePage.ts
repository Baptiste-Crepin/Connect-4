class Game {
  height: number;
  width: number;
  board: number[][];
  player: number;
  score: number[];
  gameOver: boolean;
  time: number;
  timer: number;
  constructor() {
    this.height = this.getHeight();
    this.width = this.getWidth();
    this.board = this.createBoard();
    this.player = Math.floor(Math.random() * 2) + 1;
    this.score = this.getScore();
    this.gameOver = false;

    this.time = -1;
    this.timer = setInterval(this.displayTime, 1000);

  }

  resetScore = () => (this.score = [0, 0]);

  displayTime = () => {
    this.time++;
    const DOM_TIMER = document.getElementById("timer")
    if (DOM_TIMER) { DOM_TIMER.innerText = this.formatTime(this.time); }
  };

  otherPlayer = () => {
    if (this.player == 1) return 2;
    return 1;
  };

  playerIcon = (player: number) => {
    if (player == 1) return "./assets/redIcon.png";
    return "./assets/yellowIcon.png";
  };

  getScore = () => {
    const DOM_SCORE = document.getElementById("row1")!.lastElementChild!;
    let score = DOM_SCORE.innerHTML.split(" ");
    return [parseInt(score[0]), parseInt(score[2])];
  };

  formatTime = (secs: number) => {
    let minutes = secs > 60 ? (secs / 60) : 0;
    minutes = minutes > 9 ? minutes : 0 + minutes;
    let seconds = (secs % 60);
    seconds = seconds > 9 ? seconds : 0 + seconds;
    return `${minutes}:${seconds}`;
  };

  getHeight = () => {

    let height = parseInt((document.getElementById("height") as HTMLInputElement).value);
    if (height < 4) height = 4;
    if (isNaN(height)) height = 6;
    return (this.height = height);
  };

  getWidth = () => {
    let width = parseInt((document.getElementById("width") as HTMLInputElement).value);
    if (width < 4) width = 4;
    if (isNaN(width)) width = 7;
    if (this.height * 2 < width) {
      alert(
        "La largeur que vous avez rentré est superieure a 2 fois la hauteur, cette valeur est invalide, nous avons réduit la grille pour vous."
      );
      while (this.height * 2 < width) {
        width = this.height * 2;
      }
    }
    return (this.width = width);
  };

  createBoard = () => {
    let board: number[][] = [];
    for (let boardCol = 0; boardCol < this.height; boardCol++) {
      let row: number[] = [];
      for (let boardRow = 0; boardRow < this.width; boardRow++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  };

  clickBoard = () => {
    const htmlBoard = document.getElementById("board")!;
    const CELLS: Element[] = Array.from(htmlBoard.children);
    CELLS.forEach((cell: Element, index: number) => {
      cell.setAttribute("onclick", "game.play(" + index % this.width + ")")
    })
  };


  buttons = () => {
    //creating the buttons
    const htmlButtons = document.getElementById("buttons") as HTMLElement;
    let numCol = "1fr ".repeat(this.width);
    htmlButtons.style.gridTemplateColumns = numCol;
    let imgWidth = 100 / (this.board.length / 3);
    let insertion = "";
    for (let boardCol = 0; boardCol < this.board[0].length; boardCol++) {
      insertion +=
        "<img width='" +
        imgWidth +
        "vw'src='./assets/arrow_downward.svg' draggable='false'>";
    }
    htmlButtons.innerHTML = insertion;

    //buttons logic
    const BUTTONS: Element[] = Array.from(htmlButtons.children);
    BUTTONS.forEach((button: Element, index: number) => {
      button.setAttribute("onclick", "game.play(" + index + ")")
    })
  }

  insertpiece(col: number) {
    if (!(col > 0 && col <= this.width)) return false;

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col - 1] != 0) {
        if (row == 0) return false;
        this.board[row - 1][col - 1] = this.player;
        return row - 1;
      } else if (row == this.board.length - 1) {
        this.board[row][col - 1] = this.player;
        return row;
      }
    }
    return false
  }

  checkRow = (row: number) => {
    let playerRow = 0;
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

  checkCol = (col: number) => {
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

  checkDiag = (row: number, col: number, direction: number) => {
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

  checkWin = (row: number, col: number) => {
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

  stopPlay = (draw: boolean) => {
    //timer
    this.displayBoard(false);

    //score
    if (draw) this.score[this.otherPlayer() - 1]++;
    this.score[this.player - 1]++;

    //display score
    document.getElementById("row1")!.lastElementChild!.innerHTML =
      this.score[0] + " : " + this.score[1];
    let bestScores = Array();
    if (sessionStorage.length > 0)
      bestScores = sessionStorage.getItem("score")!.split(",");

    bestScores.push([this.score]);
    sessionStorage.setItem("score", bestScores.toString());

    //desactivate the buttons
    const BUTTONS: Element[] = Array.from(document.getElementById("buttons")!.children);
    BUTTONS.forEach((button: Element) => {
      button.removeAttribute("onclick")
      button.setAttribute("style", "filter: invert(67%) sepia(0%) saturate(477%) brightness(98%) contrast(87%);")
    })
    clearInterval(this.timer);

    const CELLS: Element[] = Array.from(document.getElementById("board")!.children);
    CELLS.forEach((cell) => cell.removeAttribute("onclick"))

    document.getElementById("row1")!.innerHTML =
      "<img src='" +
      this.playerIcon(this.player) +
      "' height='30' draggable='false'><div id='score'>" +
      this.score[0] +
      " : " +
      this.score[1] +
      "</div>";

    this.displayWinner(draw);
  };

  UpdateInfos = () => {
    //resets the row to delete the player that won while still keeping track of the score
    document.getElementById("row1")!.innerHTML =
      "<img src='" +
      this.playerIcon(this.player) +
      "' height='30' draggable='false'><div id='score'>" +
      this.score[0] +
      " : " +
      this.score[1] +
      "</div>";
  };

  displayWinner = (draw: boolean) => {
    const HTML_WIN_BANNER = document.getElementById("win")!;
    if (draw) {
      HTML_WIN_BANNER.innerHTML =
        "<img src='" +
        this.playerIcon(this.player) +
        "' height='80' draggable='false'><h2>It's a draw</h2><img src='" +
        this.playerIcon(this.otherPlayer()) +
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

  displayBoard = (clickable: boolean) => {
    const htmlBoard = document.getElementById("board") as HTMLElement;
    let numCol = "1fr ".repeat(this.width);
    htmlBoard.style.gridTemplateColumns = numCol;
    let insertion = "";
    let imgWidth = 100 / (this.board.length / 3);
    for (let boardRow = 0; boardRow < this.board.length; boardRow++) {
      for (
        let boardCol = 0;
        boardCol < this.board[boardRow].length;
        boardCol++
      ) {
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


  play = (col: number) => {
    let row = this.insertpiece(col + 1);
    if (row === false) return;
    if (this.checkWin(row, col)) this.gameOver = true;
    if (this.checkDraw()) this.stopPlay(true);

    this.UpdateInfos();
    if (this.gameOver) this.stopPlay(false);
    else this.displayBoard(true);
    this.player = this.otherPlayer();
  }
}

function initialize(resetScore: boolean = false) {
  let game: Game = new Game()

  game.timer
  game.displayTime();

  //displays
  game.displayBoard(true);
  game.buttons();
  game.displayWinner(false);

  //scoring
  if (resetScore) game.resetScore();
  game.UpdateInfos();
  return game
}

let game: Game = initialize(false)

