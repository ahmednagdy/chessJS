function showEndGameBox(winnerName) {
  var winnerSpan = document.querySelectorAll(".message span")[0];
  var symbolSpan = document.querySelectorAll(".message span")[1];
  if (winnerName == "white") {
    winnerSpan.textContent = "white";
    symbolSpan.classList.replace("win-color-black", "win-color-white");
  } else if (winnerName == "black") {
    winnerSpan.textContent = "black";
    symbolSpan.classList.replace("win-color-white", "win-color-black");
  } else {
    var pMessage = document.getElementsByClassName("message")[0];
    pMessage.innerHTML = "Good luck! It's a " + winnerName;
  }
  var popupContainer = document.getElementsByClassName("popup-container")[0];
  var popup = document.getElementsByClassName("pop-up")[0];
  popupContainer.style.display = "flex";
  var playButton = document.querySelectorAll(".btn2")[1];
  var keepButton = document.querySelectorAll(".btn2")[2];
  keepButton.addEventListener("click", hideEndGameBox);
  playButton.addEventListener("click", resetFromPopUp);
  setTimeout(function () {
    popup.style.marginTop = "0px";
  }, 50);
}

function hideEndGameBox() {
  var popupContainer = document.getElementsByClassName("popup-container")[0];
  var popup = document.getElementsByClassName("pop-up")[0];
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
  game.choosenTime = value;
  popup.style.display = "none";
  game.timer1 = game.timer2 = value;
  game.step = (1000 * initialWidth) / value;
}
// var keepButton = document.querySelectorAll(".btn2")[2];
// //var playButton = document.querySelectorAll(".btn2")[1];

// keepButton.addEventListener("click", hideEndGameBox);
//playButton.addEventListener("click", resetFromPopUp);

function resetFromPopUp() {
  hideEndGameBox();
  //console.log(helperObj.ResetGame);
  helperObj.ResetGame();
}

var allAnchors = document.getElementsByTagName("a");
for (var counter = 0; counter < allAnchors.length; counter++) {
  allAnchors[counter].addEventListener("click", function (e) {
    e.preventDefault();
  });
}
