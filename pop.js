function showEndGameBox(winnerName) {
  const winnerSpan = document.querySelectorAll(".message span")[0];
  const symbolSpan = document.querySelectorAll(".message span")[1];
  if (winnerName == "white") {
    winnerSpan.textContent = "white";
    symbolSpan.classList.replace("win-color-black", "win-color-white");
  } else {
    winnerSpan.textContent = "black";
    symbolSpan.classList.replace("win-color-white", "win-color-black");
  }
  const popupContainer = document.getElementsByClassName("popup-container")[0];
  const popup = document.getElementsByClassName("pop-up")[0];
  popupContainer.style.display = "flex";
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
const keepButton = document.querySelectorAll(".btn2")[0];
const playButton = document.querySelectorAll(".btn2")[1];

keepButton.addEventListener("click", hideEndGameBox);
playButton.addEventListener("click", hideEndGameBox);
