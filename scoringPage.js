function displayScore() {
  let localScore = sessionStorage.getItem("score").split(",");
  for (let i = 0; i < localScore.length; i++) {
    const HTMLSCORE = document.getElementById("scoring");
    const PARAGRAPH = document.createElement("H3");

    if (i % 2 == 0) {
      let node = document.createTextNode(
        "Game " +
          (i / 2 + 1) +
          " | " +
          localScore[i] +
          " : " +
          localScore[i + 1]
      );
      PARAGRAPH.appendChild(node);
      HTMLSCORE.appendChild(PARAGRAPH);
    }
  }
}

displayScore();
