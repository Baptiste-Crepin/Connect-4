function displayScore(): void {
  if (sessionStorage.length == 0) {
    document.getElementById("scoring")!.innerHTML =
      "You have not played yet. No scores are available";
    return;
  }
  const LOCAL_SCORE: string[] = sessionStorage.getItem("score")!.split(",");
  for (let i: number = 0; i < LOCAL_SCORE.length; i++) {
    //imports the usefull elements of the DOM, resets for each iteration
    const HTMLSCORE: HTMLElement = document.getElementById("scoring") as HTMLElement;
    const PARAGRAPH: HTMLElement = document.createElement("H3");

    if (i % 2 == 0) {
      //if it is the first game of the match, then add a separator
      addSeparator(HTMLSCORE, LOCAL_SCORE, i);

      //displays the score
      const GAME_NODE: Text = document.createTextNode(
        "Game " +
        (i / 2 + 1) +
        " | " +
        LOCAL_SCORE[i] +
        " : " +
        LOCAL_SCORE[i + 1]
      );
      PARAGRAPH.appendChild(GAME_NODE);

      setColor(PARAGRAPH, LOCAL_SCORE, i);

      //send the paragraph to the DOM
      HTMLSCORE.appendChild(PARAGRAPH);
    }
  }
}

function addSeparator(HTMLSCORE: HTMLElement, LOCAL_SCORE: string[], i: number): void {
  const SEPARATOR: HTMLElement = document.createElement("H4");
  //if I or I+1 = 1 then it is a new game and we add a separator
  if (
    (LOCAL_SCORE[i] == "0" && LOCAL_SCORE[i + 1] == "1") ||
    (LOCAL_SCORE[i] == "1" && LOCAL_SCORE[i + 1] == "0")
  ) {
    const NODE: Text = document.createTextNode("--------------------");
    SEPARATOR.appendChild(NODE);
    HTMLSCORE.appendChild(SEPARATOR);
  }
}

function setColor(PARAGRAPH: HTMLElement, LOCAL_SCORE: string[], i: number): void {
  const YELLOW: string = "#ffaf01";
  const RED: string = "#fe0100";
  const GREY: string = "#5F5F5F";
  if (LOCAL_SCORE[i] == "0" || LOCAL_SCORE[i + 1] == "0") {
    if (LOCAL_SCORE[i] > LOCAL_SCORE[i + 1]) {
      PARAGRAPH.style.color = YELLOW;
    } else {
      PARAGRAPH.style.color = RED;
    }
  } else if (LOCAL_SCORE.length > 2) {
    if (
      // in case of a draw
      LOCAL_SCORE[i] > LOCAL_SCORE[i - 2] &&
      LOCAL_SCORE[i + 1] > LOCAL_SCORE[i - 1]
    )
      PARAGRAPH.style.color = GREY;
    else if (LOCAL_SCORE[i] > LOCAL_SCORE[i - 2]) PARAGRAPH.style.color = YELLOW;
    else PARAGRAPH.style.color = RED;
  }
}

function reset(): void {
  if (sessionStorage.length == 0) return;
  if (!confirm("You will lose all your history, do you still want to reset ?"))
    return;
  if (!confirm("Are you really sure ? ")) return;

  sessionStorage.removeItem("score");
  displayScore();
}


displayScore();
