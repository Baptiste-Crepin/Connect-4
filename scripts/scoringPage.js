function displayScore() {
  if (sessionStorage.length == 0) {
    document.getElementById("scoring").innerHTML =
      "You have not played yet. No scores are available";
    return;
  }
  let localScore = sessionStorage.getItem("score").split(",");
  for (let i = 0; i < localScore.length; i++) {
    //imports the usefull elements of the DOM, resets for each iteration
    const HTMLSCORE = document.getElementById("scoring");
    const PARAGRAPH = document.createElement("H3");

    if (i % 2 == 0) {
      //if it is the first game of the match, then add a separator
      addSeparator(HTMLSCORE, localScore, i);

      //displays the score
      let gameNode = document.createTextNode(
        "Game " +
          (i / 2 + 1) +
          " | " +
          localScore[i] +
          " : " +
          localScore[i + 1]
      );
      PARAGRAPH.appendChild(gameNode);

      setColor(PARAGRAPH, localScore, i);

      //send the paragraph to the DOM
      HTMLSCORE.appendChild(PARAGRAPH);
    }
  }
}

function addSeparator(HTMLSCORE, localScore, i) {
  const SEPARATOR = document.createElement("H4");
  //if I or I+1 = 1 then it is a new game and we add a separator
  if (
    (localScore[i] == 0 && localScore[i + 1] == 1) ||
    (localScore[i] == 1 && localScore[i + 1] == 0)
  ) {
    let node = document.createTextNode("--------------------");
    SEPARATOR.appendChild(node);
    HTMLSCORE.appendChild(SEPARATOR);
  }
}

function setColor(PARAGRAPH, localScore, i) {
  const YELLOW = "#ffaf01";
  const RED = "#fe0100";
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
}

function reset() {
  if (sessionStorage.length == 0) return;
  if (!confirm("You will lose all your history, do you still want to reset ?"))
    return;
  if (!confirm("Are you really sure ? ")) return;

  sessionStorage.removeItem("score");
  displayScore();
}

displayScore();
