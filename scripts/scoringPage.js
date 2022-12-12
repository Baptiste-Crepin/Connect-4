function displayScore() {
  const YELLOW = "#ffaf01";
  const RED = "#fe0100";
  let localScore = sessionStorage.getItem("score").split(",");
  for (let i = 0; i < localScore.length; i++) {
    //resets for each iteration
    const HTMLSCORE = document.getElementById("scoring");
    const PARAGRAPH = document.createElement("H3");
    const SEPARATOR = document.createElement("H4");

    if (i % 2 == 0) {
      //if it is the first game of the match, then add a separator
      if (
        (localScore[i] == 0 && localScore[i + 1] == 1) ||
        (localScore[i] == 1 && localScore[i + 1] == 0)
      ) {
        let node = document.createTextNode("--------------------");
        SEPARATOR.appendChild(node);
        HTMLSCORE.appendChild(SEPARATOR);
      }

      //displays the score
      let node = document.createTextNode(
        "Game " +
          (i / 2 + 1) +
          " | " +
          localScore[i] +
          " : " +
          localScore[i + 1]
      );
      PARAGRAPH.appendChild(node);

      //adds the color of the winning player to the text
      if (
        (localScore[i] == 0 && localScore[i + 1] == 1) ||
        (localScore[i] == 1 && localScore[i + 1] == 0)
      ) {
        if (localScore[i] > localScore[i + 1]) {
          PARAGRAPH.style.color = YELLOW;
        } else {
          PARAGRAPH.style.color = RED;
        }
      } else if (localScore.length > 2) {
        if (localScore[i] == localScore[i - 2]) {
          PARAGRAPH.style.color = RED;
        } else {
          PARAGRAPH.style.color = YELLOW;
        }
      }
      //send the paragraph to the DOM
      HTMLSCORE.appendChild(PARAGRAPH);
    }
  }
}

displayScore();
