"use strict";
class Game {
    constructor() {
        this.resetScore = () => (this.score = [0, 0]);
        this.displayTime = () => {
            this.time++;
            const DOM_TIMER = document.getElementById("timer");
            if (DOM_TIMER) {
                DOM_TIMER.innerText = this.formatTime(this.time);
            }
        };
        this.otherPlayer = () => {
            if (this.player == 1)
                return 2;
            return 1;
        };
        this.playerIcon = (player) => {
            if (player == 1)
                return "./assets/redIcon.png";
            return "./assets/yellowIcon.png";
        };
        this.getScore = () => {
            const DOM_SCORE = document.getElementById("row1").lastElementChild;
            const SCORES = DOM_SCORE.innerHTML.split(" ");
            return [parseInt(SCORES[0]), parseInt(SCORES[2])];
        };
        this.formatTime = (secs) => {
            let minutes = secs >= 60 ? Math.floor(secs / 60) : 0;
            minutes = minutes > 9 ? minutes : 0 + minutes;
            let seconds = (secs % 60);
            seconds = seconds > 9 ? seconds : 0 + seconds;
            return `${minutes}:${seconds}`;
        };
        this.getHeight = () => {
            let height = parseInt(document.getElementById("height").value);
            if (height < 4)
                height = 4;
            if (isNaN(height))
                height = 6;
            return (this.height = height);
        };
        this.getWidth = () => {
            let width = parseInt(document.getElementById("width").value);
            if (width < 4)
                width = 4;
            if (isNaN(width))
                width = 7;
            if (this.height * 2 < width) {
                alert("La largeur que vous avez rentré est superieure a 2 fois la hauteur, cette valeur est invalide, nous avons réduit la grille pour vous.");
                while (this.height * 2 < width) {
                    width = this.height * 2;
                }
            }
            return (this.width = width);
        };
        this.createBoard = () => {
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
        this.clickBoard = () => {
            const htmlBoard = document.getElementById("board");
            const CELLS = Array.from(htmlBoard.children);
            CELLS.forEach((cell, index) => {
                cell.setAttribute("onclick", "game.play(" + index % this.width + ")");
            });
        };
        this.buttons = () => {
            const htmlButtons = document.getElementById("buttons");
            const COL_NUMBER = "1fr ".repeat(this.width);
            htmlButtons.style.gridTemplateColumns = COL_NUMBER;
            const IMG_WIDTH = 100 / (this.board.length / 3);
            let insertion = "";
            for (let boardCol = 0; boardCol < this.board[0].length; boardCol++) {
                insertion +=
                    "<img width='" +
                        IMG_WIDTH +
                        "vw'src='./assets/arrow_downward.svg' draggable='false'>";
            }
            htmlButtons.innerHTML = insertion;
            const BUTTONS = Array.from(htmlButtons.children);
            BUTTONS.forEach((button, index) => {
                button.setAttribute("onclick", "game.play(" + index + ")");
            });
        };
        this.checkRow = (row) => {
            let playerRow = 0;
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === this.player &&
                    this.board[row][col + 1] === this.player) {
                    playerRow++;
                }
                else if (this.board[row][col] !== this.player)
                    playerRow = 0;
                if (playerRow >= 3)
                    return true;
            }
            return false;
        };
        this.checkCol = (col) => {
            let playerCol = 0;
            for (let row = 0; row < this.board.length - 1; row++) {
                if (this.board[row][col] === this.player &&
                    this.board[row + 1][col] === this.player) {
                    playerCol++;
                }
                else if (this.board[row][col] !== this.player)
                    playerCol = 0;
                if (playerCol >= 3)
                    return true;
            }
            return false;
        };
        this.checkDiag = (row, col, direction) => {
            let playerDiag = 0;
            switch (direction) {
                case 0:
                    while (col > 0 && row < this.board.length - 1) {
                        col--;
                        row++;
                    }
                    while (col <= this.board[row].length && row > 0) {
                        if (this.board[row][col] === this.player &&
                            this.board[row - 1][col + 1] === this.player)
                            playerDiag++;
                        else
                            playerDiag = 0;
                        if (playerDiag >= 3)
                            return true;
                        col++;
                        row--;
                    }
                case 1:
                    while (col < this.board[row].length && row < this.board.length - 1) {
                        col++;
                        row++;
                    }
                    while (row > 0 && col > 0) {
                        if (this.board[row][col] === this.player &&
                            this.board[row - 1][col - 1] === this.player)
                            playerDiag++;
                        else
                            playerDiag = 0;
                        if (playerDiag >= 3)
                            return true;
                        col--;
                        row--;
                    }
            }
            return false;
        };
        this.checkWin = (row, col) => {
            if (this.checkRow(row) ||
                this.checkCol(col) ||
                this.checkDiag(row, col, 0) ||
                this.checkDiag(row, col, 1)) {
                return true;
            }
            return false;
        };
        this.checkDraw = () => {
            for (let element of this.board) {
                for (let cell of element) {
                    if (cell == 0) {
                        return false;
                    }
                }
            }
            return true;
        };
        this.stopPlay = (draw) => {
            this.displayBoard(false);
            if (draw)
                this.score[this.otherPlayer() - 1]++;
            this.score[this.player - 1]++;
            document.getElementById("row1").lastElementChild.innerHTML =
                this.score[0] + " : " + this.score[1];
            let bestScores = [];
            if (sessionStorage.length > 0)
                bestScores = sessionStorage.getItem("score").split(",");
            bestScores.push(this.score[0].toString(), this.score[1].toString());
            sessionStorage.setItem("score", bestScores.toString());
            const BUTTONS = Array.from(document.getElementById("buttons").children);
            BUTTONS.forEach((button) => {
                button.removeAttribute("onclick");
                button.setAttribute("style", "filter: invert(67%) sepia(0%) saturate(477%) brightness(98%) contrast(87%);");
            });
            clearInterval(this.timer);
            const CELLS = Array.from(document.getElementById("board").children);
            CELLS.forEach((cell) => cell.removeAttribute("onclick"));
            document.getElementById("row1").innerHTML =
                "<img src='" +
                    this.playerIcon(this.player) +
                    "' height='30' draggable='false'><div id='score'>" +
                    this.score[0] +
                    " : " +
                    this.score[1] +
                    "</div>";
            this.displayWinner(draw);
        };
        this.UpdateInfos = () => {
            document.getElementById("row1").innerHTML =
                "<img src='" +
                    this.playerIcon(this.player) +
                    "' height='30' draggable='false'><div id='score'>" +
                    this.score[0] +
                    " : " +
                    this.score[1] +
                    "</div>";
        };
        this.displayWinner = (draw) => {
            const HTML_WIN_BANNER = document.getElementById("win");
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
            }
            else {
                HTML_WIN_BANNER.innerHTML =
                    "<img src='" +
                        this.playerIcon(this.otherPlayer()) +
                        "' height='80' draggable='false'><h2>Won the game</h2>";
            }
        };
        this.displayBoard = (clickable) => {
            const htmlBoard = document.getElementById("board");
            const COL_NUMBER = "1fr ".repeat(this.width);
            htmlBoard.style.gridTemplateColumns = COL_NUMBER;
            const IMG_WIDTH = 100 / (this.board.length / 3);
            let insertion = "";
            for (let boardRow = 0; boardRow < this.board.length; boardRow++) {
                for (let boardCol = 0; boardCol < this.board[boardRow].length; boardCol++) {
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
            if (clickable)
                this.clickBoard();
        };
        this.play = (col) => {
            const ROW = this.insertpiece(col + 1);
            if (ROW === -1)
                return;
            if (this.checkWin(ROW, col))
                this.gameOver = true;
            if (this.checkDraw())
                this.stopPlay(true);
            this.UpdateInfos();
            if (this.gameOver)
                this.stopPlay(false);
            else
                this.displayBoard(true);
            this.player = this.otherPlayer();
        };
        this.height = this.getHeight();
        this.width = this.getWidth();
        this.board = this.createBoard();
        this.player = Math.floor(Math.random() * 2) + 1;
        this.score = this.getScore();
        this.gameOver = false;
        this.time = -1;
        this.timer = setInterval(this.displayTime, 1000);
    }
    insertpiece(col) {
        if (!(col > 0 && col <= this.width))
            return -1;
        for (let row = 0; row < this.board.length; row++) {
            if (this.board[row][col - 1] != 0) {
                if (row == 0)
                    return -1;
                this.board[row - 1][col - 1] = this.player;
                return row - 1;
            }
            else if (row == this.board.length - 1) {
                this.board[row][col - 1] = this.player;
                return row;
            }
        }
        return -1;
    }
}
function initialize(resetScore = false) {
    const GAME = new Game();
    clearInterval(GAME.timer - 1);
    GAME.timer;
    GAME.displayTime();
    GAME.displayBoard(true);
    GAME.buttons();
    GAME.displayWinner(false);
    if (resetScore)
        GAME.resetScore();
    GAME.UpdateInfos();
    return GAME;
}
let game = initialize(false);
//# sourceMappingURL=gamePage.js.map