function createBoard(width, height) {
  height*2 > width*2 ? (height = width*2-2, alert("vous avez rentré une hauteur trop grande par rapport a la largeur, celle-ci a été diminuée afin de pouvoir rentrer dans la page")): false;
  
  let board = [];
  for (let i = 0; i < height; i++){
    let row = []
    for (let j = 0; j < width; j++){
      row.push(0);
    };
    board.push(row);
  };
  return board;
};

function displayBoard(board){
  const htmlBoard = document.getElementById("board");
  let numCol = "1fr ".repeat(width)
  htmlBoard.style.gridTemplateColumns = numCol
  let insertion = "";
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      switch(board[i][j]){
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

  console.log(htmlBoard.children)
  let child = Array.from(htmlBoard.children)
  child.forEach((element, index) => {
  element.style.width = (60 / width*0.5)+"vw"
  console.log(width)
  console.log(element.style.width)
})
};



width = 7
height = 6
board = createBoard(width, height);
console.log(board);

displayBoard(board)
