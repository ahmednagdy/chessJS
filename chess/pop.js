function showEndGameBox(winnerName) {
  const winnerSpan = document.querySelectorAll(".message span")[0];
  const symbolSpan = document.querySelectorAll(".message span")[1];
  if (winnerName == "white") {
    winnerSpan.textContent = "white";
    symbolSpan.classList.replace("win-color-black", "win-color-white");
  } else if (winnerName == "black") {
    winnerSpan.textContent = "black";
    symbolSpan.classList.replace("win-color-white", "win-color-black");
  } else {
    const pMessage = document.getElementsByClassName("message")[0];
    pMessage.innerHTML = "Good luck! It's a " + winnerName;
  }
  const popupContainer = document.getElementsByClassName("popup-container")[0];
  const popup = document.getElementsByClassName("pop-up")[0];
  popupContainer.style.display = "flex";
  const playButton = document.querySelectorAll(".btn2")[1];
  const keepButton = document.querySelectorAll(".btn2")[2];
  keepButton.addEventListener("click", hideEndGameBox);
  playButton.addEventListener("click", resetFromPopUp);
  setTimeout(function () {
    popup.style.marginTop = "0px";
  }, 50);
}

function hideEndGameBox() {
  const popupContainer = document.getElementsByClassName("popup-container")[0];
  const popup = document.getElementsByClassName("pop-up")[0];
  popupContainer.style.display = "none";
  popup.style.marginTop = "-750px";
}

function setTimeToStartGame() {
  var timers = document.getElementsByClassName("timer");
  var value = Number(document.getElementsByClassName("time-select")[0].value);
  var popup = document.getElementsByClassName("popup-container-ng")[0];
  var WProgressBar = document.getElementsByClassName("progress")[1];
  var initialWidth = parseInt(getComputedStyle(WProgressBar).width);
  timers[0].textContent = timers[1].textContent = helperObj.toShow(value);
  choosenTime = value;
  popup.style.display = "none";
  timer1 = timer2 = value;
  step = (1000 * initialWidth) / value;
}
// const keepButton = document.querySelectorAll(".btn2")[2];
// //const playButton = document.querySelectorAll(".btn2")[1];

// keepButton.addEventListener("click", hideEndGameBox);
//playButton.addEventListener("click", resetFromPopUp);

function resetFromPopUp() {
  hideEndGameBox();
  console.log(helperObj.ResetGame);
  helperObj.ResetGame();
}

var allAnchors = document.getElementsByTagName("a");
for (var counter = 0; counter < allAnchors.length; counter++) {
  allAnchors[counter].addEventListener("click", function (e) {
    e.preventDefault();
  });
}
