let bishop1 = document.getElementById("blackBishop1");
//bishop1.setAttribute("transform", "translate(500,500)");
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
function grabPositionPiece(piece) {
  let Positions = piece.style.transform.match(/[0-9]{3}/g);
  let posX = Positions[0];
  let posY = Positions[1];
  return `${posX}px,${posY}px`;
}
function grabPositionSquare(square) {
  let posx = square.getAttribute("x");
  let posy = square.getAttribute("y");
  let key = `${posx}px,${posy}px`;
  return key;
}

moveToMap_and_ui = function (piece, x, y) {
  let pieceID = piece.getAttribute("id"); //piece.pieceID;
  let Allpieces = document.querySelectorAll(".black-piece, .white-piece");
  let filledPositions = [];
  let allSquares = document.querySelectorAll("svg rect");
  function getAllFilledPositions() {
    for (let i = 0; i < Allpieces.length; i++) {
      filledPositions.push(grabPositionPiece(Allpieces[i]));
    }
  }
  getAllFilledPositions();

  function detecetTheKing() {
    let kingID;
    if (/white/g.test(pieceID)) {
      kingID = "whiteKing";
    } else {
      kingID = "blackKing";
    }
  }
  let kingID = detecetTheKing();

  function foundInFilled(square) {
    let posx = square.getAttribute("x");
    let posy = square.getAttribute("y");
    let key = `${posx}px,${posy}px`;

    for (let i = 0; i < filledPositions.length; i++) {
      if (key == filledPositions[i]) {
        return true;
      }
    }
    return false;
  }

  function checCHECK() {
    return false;
  }

  function getPieceOnSquare(square) {
    Spos = grabPositionSquare(square);
    for (let i = 0; i < Allpieces.length; i++) {
      if (Spos == grabPositionPiece(Allpieces[i])) {
        return Allpieces[i];
      }
    }
    return 6;
  }

  function onSquareClick(e) {
    if (foundInFilled(e.target)) {
      let eatenPiece = getPieceOnSquare(e.target);
      piece.style.transform = `translate(${grabPositionSquare(e.target)})`;
      eatenPiece.style.transform = "translate(900px,900px)";
    } else {
      let oldPosition = grabPositionPiece(piece);
      piece.style.transform = `translate(${grabPositionSquare(e.target)})`;
      if (checCHECK()) {
        piece.style.transform = `translate(${oldPosition})`;
      }
    }
    for (let i = 0; i < 64; i++) {
      allSquares[i].removeEventListener("click", onSquareClick);
    }
  }

  for (let i = 0; i < 64; i++) {
    allSquares[i].addEventListener("click", onSquareClick);
  }
};

let x = document.getElementById("blackBishop1");
moveToMap_and_ui(x);
