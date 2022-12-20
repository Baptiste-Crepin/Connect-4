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

  resetScore = (): number[] => (this.score = [0, 0]);

  displayTime = (): void => {
    this.time++;
    const DOM_TIMER: HTMLElement = document.getElementById("timer")!
    if (DOM_TIMER) { DOM_TIMER.innerText = this.formatTime(this.time); }
  };

  otherPlayer = (): number => {
    if (this.player == 1) return 2;
    return 1;
  };

  playerIcon = (player: number): string => {
    if (player == 1) return "./assets/redIcon.png";
    return "./assets/yellowIcon.png";
  };

  getScore = (): number[] => {
    const DOM_SCORE: Element = document.getElementById("row1")!.lastElementChild!;
    const SCORES: string[] = DOM_SCORE.innerHTML.split(" ");
    return [parseInt(SCORES[0]), parseInt(SCORES[2])];
  };

  formatTime = (secs: number): string => {
    let minutes: number = secs >= 60 ? Math.floor(secs / 60) : 0;
    minutes = minutes > 9 ? minutes : 0 + minutes;
    let seconds: number = (secs % 60);
    seconds = seconds > 9 ? seconds : 0 + seconds;
    return `${minutes}:${seconds}`;
  };

  getHeight = (): number => {

    let height: number = parseInt((document.getElementById("height") as HTMLInputElement).value);
    if (height < 4) height = 4;
    if (isNaN(height)) height = 6;
    return (this.height = height);
  };

  getWidth = (): number => {
    let width: number = parseInt((document.getElementById("width") as HTMLInputElement).value);
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

  createBoard = (): number[][] => {
    let board: number[][] = [];
    for (let boardCol: number = 0; boardCol < this.height; boardCol++) {
      let row: number[] = [];
      for (let boardRow: number = 0; boardRow < this.width; boardRow++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  };

  clickBoard = (): void => {
    const htmlBoard: HTMLElement = document.getElementById("board")!;
    const CELLS: Element[] = Array.from(htmlBoard.children);
    CELLS.forEach((cell: Element, index: number) => {
      cell.setAttribute("onclick", "game.play(" + index % this.width + ")")
    })
  };


  buttons = (): void => {
    //creating the buttons
    const htmlButtons: HTMLElement = document.getElementById("buttons") as HTMLElement;
    const COL_NUMBER: string = "1fr ".repeat(this.width);
    htmlButtons.style.gridTemplateColumns = COL_NUMBER;
    const IMG_WIDTH: number = 100 / (this.board.length / 3);
    let insertion: string = "";
    for (let boardCol = 0; boardCol < this.board[0].length; boardCol++) {
      insertion +=
        "<img width='" +
        IMG_WIDTH +
        "vw'src='./assets/arrow_downward.svg' draggable='false'>";
    }
    htmlButtons.innerHTML = insertion;

    //buttons logic
    const BUTTONS: Element[] = Array.from(htmlButtons.children);
    BUTTONS.forEach((button: Element, index: number) => {
      button.setAttribute("onclick", "game.play(" + index + ")")
    })
  }

  insertpiece(col: number): number {
    if (!(col > 0 && col <= this.width)) return -1;

    for (let row: number = 0; row < this.board.length; row++) {
      if (this.board[row][col - 1] != 0) {
        if (row == 0) return -1;
        this.board[row - 1][col - 1] = this.player;
        return row - 1;
      } else if (row == this.board.length - 1) {
        this.board[row][col - 1] = this.player;
        return row;
      }
    }
    return -1
  }

  checkRow = (row: number): boolean => {
    let playerRow: number = 0;
    for (let col: number = 0; col < this.board[row].length; col++) {
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

  checkCol = (col: number): boolean => {
    let playerCol: number = 0;
    for (let row: number = 0; row < this.board.length - 1; row++) {
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

  checkDiag = (row: number, col: number, direction: number): boolean => {
    let playerDiag: number = 0;
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

  checkWin = (row: number, col: number): boolean => {
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

  checkDraw = (): boolean => {
    for (let element of this.board) {
      for (let cell of element) {
        if (cell == 0) {
          return false;
        }
      }
    }
    return true;
  };

  stopPlay = (draw: boolean): void => {
    //timer
    this.displayBoard(false);

    //score
    if (draw) this.score[this.otherPlayer() - 1]++;
    this.score[this.player - 1]++;

    //display score
    document.getElementById("row1")!.lastElementChild!.innerHTML =
      this.score[0] + " : " + this.score[1];
    let bestScores: string[] = []
    if (sessionStorage.length > 0)
      bestScores = sessionStorage.getItem("score")!.split(",");

    bestScores.push(this.score[0].toString(), this.score[1].toString());
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

  UpdateInfos = (): void => {
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

  displayWinner = (draw: boolean): void => {
    const HTML_WIN_BANNER: HTMLElement = document.getElementById("win")!;
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

  displayBoard = (clickable: boolean): void => {
    const htmlBoard: HTMLElement = document.getElementById("board") as HTMLElement;
    const COL_NUMBER: string = "1fr ".repeat(this.width);
    htmlBoard.style.gridTemplateColumns = COL_NUMBER;
    const IMG_WIDTH: number = 100 / (this.board.length / 3);
    let insertion: string = "";
    for (let boardRow: number = 0; boardRow < this.board.length; boardRow++) {
      for (
        let boardCol: number = 0;
        boardCol < this.board[boardRow].length;
        boardCol++
      ) {
        switch (this.board[boardRow][boardCol]) {
          case 0:
            insertion +=
              "<img width='" +
              IMG_WIDTH +
              "vw' src='./assets/blank.png' draggable='false'>";
            break;
          case 1:
            insertion +=
              "<img width='" +
              IMG_WIDTH +
              "vw' src='./assets/yellowIcon.png' draggable='false'>";
            break;
          case 2:
            insertion +=
              "<img width='" +
              IMG_WIDTH +
              "vw' src='./assets/redIcon.png' draggable='false'>";
            break;
        }
      }
    }
    htmlBoard.innerHTML = insertion;

    if (clickable) this.clickBoard();
  };


  play = (col: number): void => {
    const ROW: number = this.insertpiece(col + 1);
    if (ROW === -1) return;
    if (this.checkWin(ROW, col)) this.gameOver = true;
    if (this.checkDraw()) this.stopPlay(true);

    this.UpdateInfos();
    if (this.gameOver) this.stopPlay(false);
    else this.displayBoard(true);
    this.player = this.otherPlayer();
  }
}

function initialize(resetScore: boolean = false): Game {
  const GAME: Game = new Game()

  // clears the last game interval before initializing the new game one
  clearInterval(GAME.timer - 1)
  GAME.timer
  GAME.displayTime();

  //displays
  GAME.displayBoard(true);
  GAME.buttons();
  GAME.displayWinner(false);

  //scoring
  if (resetScore) GAME.resetScore();
  GAME.UpdateInfos();
  return GAME
}

let game: Game = initialize(false)

