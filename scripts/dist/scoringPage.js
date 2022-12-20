"use strict";
function displayScore() {
    if (sessionStorage.length == 0) {
        document.getElementById("scoring").innerHTML =
            "You have not played yet. No scores are available";
        return;
    }
    const LOCAL_SCORE = sessionStorage.getItem("score").split(",");
    for (let i = 0; i < LOCAL_SCORE.length; i++) {
        const HTMLSCORE = document.getElementById("scoring");
        const PARAGRAPH = document.createElement("H3");
        if (i % 2 == 0) {
            addSeparator(HTMLSCORE, LOCAL_SCORE, i);
            const GAME_NODE = document.createTextNode("Game " +
                (i / 2 + 1) +
                " | " +
                LOCAL_SCORE[i] +
                " : " +
                LOCAL_SCORE[i + 1]);
            PARAGRAPH.appendChild(GAME_NODE);
            setColor(PARAGRAPH, LOCAL_SCORE, i);
            HTMLSCORE.appendChild(PARAGRAPH);
        }
    }
}
function addSeparator(HTMLSCORE, LOCAL_SCORE, i) {
    const SEPARATOR = document.createElement("H4");
    if ((LOCAL_SCORE[i] == "0" && LOCAL_SCORE[i + 1] == "1") ||
        (LOCAL_SCORE[i] == "1" && LOCAL_SCORE[i + 1] == "0")) {
        const NODE = document.createTextNode("--------------------");
        SEPARATOR.appendChild(NODE);
        HTMLSCORE.appendChild(SEPARATOR);
    }
}
function setColor(PARAGRAPH, LOCAL_SCORE, i) {
    const YELLOW = "#ffaf01";
    const RED = "#fe0100";
    const GREY = "#5F5F5F";
    if (LOCAL_SCORE[i] == "0" || LOCAL_SCORE[i + 1] == "0") {
        if (LOCAL_SCORE[i] > LOCAL_SCORE[i + 1]) {
            PARAGRAPH.style.color = YELLOW;
        }
        else {
            PARAGRAPH.style.color = RED;
        }
    }
    else if (LOCAL_SCORE.length > 2) {
        if (LOCAL_SCORE[i] > LOCAL_SCORE[i - 2] &&
            LOCAL_SCORE[i + 1] > LOCAL_SCORE[i - 1])
            PARAGRAPH.style.color = GREY;
        else if (LOCAL_SCORE[i] > LOCAL_SCORE[i - 2])
            PARAGRAPH.style.color = YELLOW;
        else
            PARAGRAPH.style.color = RED;
    }
}
function reset() {
    if (sessionStorage.length == 0)
        return;
    if (!confirm("You will lose all your history, do you still want to reset ?"))
        return;
    if (!confirm("Are you really sure ? "))
        return;
    sessionStorage.removeItem("score");
    displayScore();
}
displayScore();
//# sourceMappingURL=scoringPage.js.map