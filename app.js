let bishop1 = document.getElementById("blackBishop1");
bishop1.style.transform = "translate(300px, 500px)";

function translatePiece(id, posX, posY) {
  let piece = document.getElementById(id);
  let valueOfTranslate = "translate(" + posX + "px," + posY + "px)";
  piece.style.transform = valueOfTranslate;
}

function movePiece(id, amountOfX, amountOfY) {
  let piece = document.getElementById(id);
  let Positions = piece.style.transform.match(/[0-9]{3}/g);
  let posX = Positions[0];
  let posY = Positions[1];

  let valueOfTranslate =
    "translate(" +
    (Number(amountOfX * 100) + Number(posX)) +
    "px," +
    (Number(amountOfY * 100) + Number(posY)) +
    "px)";
  piece.style.transform = valueOfTranslate;
}
