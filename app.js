let bishop1 = document.getElementById("blackBishop1");
//bishop1.setAttribute("transform", "translate(500,500)");
bishop1.style.transform = "translate(300px, 500px)";

moveToMap_and_ui = function (piece, x, y) {
  let Allpieces = document.querySelectorAll(".black-piece, .white-piece");

  function grabPositionPiece(pieceX) {
    let Positions = pieceX.style.transform.match(/[0-9]{3}/g);
    let posX = Positions[0];
    let posY = Positions[1];
    return `${posX}px,${posY}px`;
  }

  function getPieceByPosition(posX, posY) {
    Spos = `${posX * 100}px,${posY * 100}px`;
    for (let i = 0; i < Allpieces.length; i++) {
      if (Spos == grabPositionPiece(Allpieces[i])) {
        return Allpieces[i];
      }
    }
  }

  y = 9 - y;

  function checkCHECK() {
    return false;
  }

  let translatePosition = `translate(${x * 100}px, ${y * 100}px)`;
  let oldPosition = grabPositionPiece(piece);
  if (helperObj.map[x][y] == null) {
    piece.style.transform = translatePosition;
    console.log(translatePosition);
    if (checkCHECK()) {
      piece.style.transform = `translate(${oldPosition})`;
    }
  } else {
    let eatenPiece = getPieceByPosition(x, y);
    piece.style.transform = translatePosition;
    eatenPiece.style.transform = "translate(900px,900px)";
    if (checkCHECK()) {
      piece.style.transform = `translate(${oldPosition})`;
    }
  }
};

let xs = document.getElementById("blackBishop1");
moveToMap_and_ui(xs);
