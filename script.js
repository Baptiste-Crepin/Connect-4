function createBoard(width, height) {
  //height*2 > width*2 ? (height = width*2-2, alert("vous avez rentré une hauteur trop grande par rapport a la largeur, celle-ci a été diminuée afin de pouvoir rentrer dans la page")): false;
  
  let board = [];
  for (let boardCol = 0; boardCol < width; boardCol++){
    let row = []
    for (let boardRow = 0; boardRow < height; boardRow++){
      row.push(0);
    };
    //console.log(row);
    board.push(row);
  };
  return board;
};

function displayBoard(board){
  const htmlBoard = document.getElementById("board");
  let numCol = "1fr ".repeat(width)
  htmlBoard.style.gridTemplateColumns = numCol
  let insertion = "";
  for (let boardCol = 0; boardCol < board[boardCol].length; boardCol++) {
    for (let boardRow = 0; boardRow < board.length; boardRow++) {
      switch(board[boardRow][boardCol]){
      case 0:
        insertion += "<img src='./assets/blank.jpg'>";
        break;
      case 1:
        insertion += "<img src='./assets/yellow.jpg'>";
        break;
      case 2:
        insertion += "<img src='./assets/red.jpg'>";
        break;
      };
    };
  };
  htmlBoard.innerHTML = insertion;

  //console.log(htmlBoard.children)
  let child = Array.from(htmlBoard.children)
  child.forEach((element, index) => {
  element.style.width = (60 / width*0.5)+"vw"
  //console.log(width)
  //console.log(element.style.width)
})
};

function other_player(player) {
  if (player == 1){
    return 2
  }
  return 1
}

function insertpiece(board, x, player){
  if (!(x > 0 && x < width)){
    return false
  }

  for (let y = 0; y <= board[x].length; y++){
    if (board[x-1][y] != 0){
      if (y == 0){
        return false
      }
      board[x-1][y-1] = other_player(player);
      return board
    }
    else if (y == board[x].length-1){
      board[x-1][y] = player
      return board
    }
  }
}








width = 7
height = 6
board = createBoard(width, height);
insertpiece(board, 1, 1)
console.log(board);

displayBoard(board)
