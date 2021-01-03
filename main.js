function handleClick(position) {
  console.log(position.id);
  var x = parseInt(position.id.split("-")[0]);
  var y = parseInt(position.id.split("-")[1]);
  var newSelection = helperObj.map[x][y]; //could think of a map(position) as a getter function from map
  const Wpar = document.getElementsByTagName("p")[1];
  const WProgressBar = document.getElementsByClassName("progress")[1];
  const wdiv = document.getElementsByClassName("white")[0];

  if (prevTurn == -1) {
    t2 = setInterval(function () {
      helperObj.changeProgressBar(WProgressBar, 1);
      timer2 -= 1000;
      Wpar.textContent = helperObj.toShow(timer2);
      if (timer2 <= 0) {
        clearInterval(t2);
        alert("time out");
      }
    }, 1000);

    clearInterval(t1);
    prevTurn = 900;
    Wpar.classList.add("running");
    wdiv.classList.add("borderTurn");
  }
  if (isSelected) {
    if (newSelection === selected) {
      Deselect();
    } else if (newSelection == null) {
      if (selected.moves.some((o) => o.x == x && o.y == y)) {
        helperObj.moveToMap_and_ui(selected, x, y);
        moveMap(x, y);
      } else {
        Deselect();
      }
    } else if (newSelection.color == turn) {
      selected = newSelection;
    } else {
      if (
        selected.moves.some(
          (o) =>
            o.x == newSelection.position.x && o.y == newSelection.position.y
        )
      ) {
        //TAKE ////
        helperObj.moveToMap_and_ui(selected, x, y); //deselect
        moveMap(x, y);
      } else {
        Deselect();
      }
    }
  } else {
    if (newSelection)
      if (newSelection.color == turn) {
        selected = newSelection;
        isSelected = true;
      }
  }
  //-------------------------
  if (selected) {
    if (selected.isKing) {
      for (var i = 1; i <= 8; i++) {
        for (var j = 1; j <= 8; j++) {
          if (
            helperObj.map[i][j] != null &&
            helperObj.map[i][j].color != selected.color
          )
            helperObj.map[i][j].getAndFillAvailableMoves();
        }
      }
    }
    selected.getAndFillAvailableMoves();
  }
  //--------------------------
  //remove highlight by default

  if (oldStates[0])
    document.getElementById(oldStates[0]).classList.remove("highlightPiece");

  for (var i = 1; i < oldStates.length; i++) {
    document.getElementById(oldStates[i]).classList.remove("highlight"); //reset highlighted square
  }
  if (isSelected) {
    //highlight the piece and the moves
    var id = selected.position;
    id = id.x + "-" + id.y;
    document.getElementById(id).classList.toggle("highlightPiece");
    oldStates = [];
    oldStates.push(id);
    for (var i = 0; i < selected.moves.length; i++) {
      id = selected.moves[i];
      id = id.x + "-" + id.y; //test
      //console.log("id = " + id);
      oldStates.push(id);
      document.getElementById(id).classList.add("highlight"); //the available square
    }
  }
}
var turn = 0;
var selected = null;
var isSelected = false;
var oldStates = [];
var checked = false;
let timer1 = 300 * 1000;
let timer2 = 300 * 1000;
let t1;
let t2;
let prevTurn = -1;

var W = { RemainingArrayOfPieces: [] };
var B = { RemainingArrayOfPieces: [] };

function moveMap(x, y) {
  var tX = selected.position.x;
  tY = selected.position.y;
  var flag = false;
  helperObj.map[tX][tY] = null;

  if (selected.firstMove) selected.firstMove = false; // for handel first move of pawn
  if (selected.firstMove != undefined && (y == 8 || y == 1)) {
    let anyQueen;
    if (selected.color == 0) {
      anyQueen = document.getElementById("whiteQueen");
    } else {
      anyQueen = document.getElementById("blackQueen");
    }

    let tPawn = helperObj.getPieceByPosition(x, 9 - y);

    tPawn.innerHTML = anyQueen.innerHTML;
    selected = new queen(tX, tY, selected.color);
    flag = true;
  }

  helperObj.map[x][y] = selected;
  helperObj.map[x][y].position = Position(x, y);

  Deselect();
  turn = !turn;
  setTimeout(function () {
    if (flag) alert("Congratulation, Now Pawn become Queen");
  }, 1000);
}
function Deselect() {
  selected = null;
  isSelected = false;
}
//-----------------------------------------------------------

//-------------------------------------------
var helperObj = {
  map: [],
  justHappenedMove: {
    oldX: 0,
    oldY: 0,
    newX: 0,
    newY: 0,
  },
  getSquareByPosition: function (x, y) {
    return document.getElementById(`${x}-${y}`);
  },
  getPieceByPosition: function (posX, posY) {
    let Allpieces = document.querySelectorAll(".black-piece, .white-piece");
    var Spos = `${posX * 100}px,${posY * 100}px`;
    for (let i = 0; i < Allpieces.length; i++) {
      if (Spos == this.grabPositionPiece(Allpieces[i])) {
        return Allpieces[i];
      }
    }
  },
  grabPositionPiece: function (pieceX) {
    let Positions = pieceX.style.transform.match(/[0-9]{3}/g);
    let posX = Positions[0];
    let posY = Positions[1];
    return `${posX}px,${posY}px`;
  },
  Initialize: function () {
    this.map = [];
    for (var i = 0; i < 9; i++) {
      this.map[i] = [];
      for (var j = 0; j < 9; j++) {
        this.map[i][j] = null;
      }
    }
    this.fillInitialize(1, 2, 0);
    this.fillInitialize(8, 7, 1);
    for (var i = 1; i <= 8; i++) {
      for (var j = 1; j <= 8; j++) {
        if (helperObj.map[i][j] != null)
          helperObj.map[i][j].getAndFillAvailableMoves();
      }
    }
  },

  fillInitialize: function (_y1, _y2, c) {
    for (var i = 1; i < 9; i++) this.map[i][_y2] = new pawn(i, _y2, c);

    this.map[1][_y1] = new rook(1, _y1, c);
    this.map[8][_y1] = new rook(8, _y1, c);
    this.map[2][_y1] = new knight(2, _y1, c);
    this.map[7][_y1] = new knight(7, _y1, c);
    this.map[3][_y1] = new bishop(3, _y1, c);
    this.map[6][_y1] = new bishop(6, _y1, c);
    this.map[4][_y1] = new queen(4, _y1, c);
    this.map[5][_y1] = new king(5, _y1, c);
  },

  moveToMap_and_ui: function (piece, x, y) {
    const Bpar = document.getElementsByTagName("p")[0];
    const Wpar = document.getElementsByTagName("p")[1];
    const BProgressBar = document.getElementsByClassName("progress")[0];
    const WProgressBar = document.getElementsByClassName("progress")[1];
    const Bdiv = document.getElementsByClassName("black")[0];
    const wdiv = document.getElementsByClassName("white")[0];

    let pieceUI = this.getPieceByPosition(
      piece.position.x,
      9 - piece.position.y
    );
    let oldSquare = this.getSquareByPosition(
      piece.position.x,
      piece.position.y
    );
    if (helperObj.justHappenedMove.oldX != 0) {
      let oldPos = helperObj.getSquareByPosition(
        helperObj.justHappenedMove.oldX,
        helperObj.justHappenedMove.oldY
      );
      let newPos = helperObj.getSquareByPosition(
        helperObj.justHappenedMove.newX,
        helperObj.justHappenedMove.newY
      );
      oldPos.classList.remove("highlight-move");
      newPos.classList.remove("highlight-move");
    }
    let newSquar = this.getSquareByPosition(x, y);
    this.justHappenedMove.oldX = piece.position.x;
    this.justHappenedMove.oldY = piece.position.y;
    this.justHappenedMove.newX = x;
    this.justHappenedMove.newY = y;
    oldSquare.classList.add("highlight-move");
    newSquar.classList.add("highlight-move");
    console.log(newSquar.classList);
    let translatePosition = `translate(${x * 100}px, ${(9 - y) * 100}px)`;

    if (this.map[x][y] != null) {
      let eatenPieceUI = this.getPieceByPosition(x, 9 - y);
      eatenPieceUI.style.transform = "translate(900px,900px)";
    }
    pieceUI.style.transform = translatePosition;

    if (!turn || prevTurn == 900) {
      t1 = setInterval(function () {
        helperObj.changeProgressBar(BProgressBar, 1);
        timer1 -= 1000;
        Bpar.textContent = helperObj.toShow(timer1);
        if (timer1 <= 0) {
          clearInterval(t1);
          alert("time out");
        }
      }, 1000);

      clearInterval(t2);
      prevTurn = 50;
      Bpar.classList.toggle("running");
      Wpar.classList.toggle("running");
      wdiv.classList.toggle("borderTurn");
      Bdiv.classList.toggle("borderTurn");
    } else {
      t2 = setInterval(function () {
        helperObj.changeProgressBar(WProgressBar, 1);
        timer2 -= 1000;
        Wpar.textContent = helperObj.toShow(timer2);
        if (timer2 <= 0) {
          clearInterval(t2);
          alert("time out");
        }
      }, 1000);
      Wpar.classList.toggle("running");
      Bpar.classList.toggle("running");
      wdiv.classList.toggle("borderTurn");
      Bdiv.classList.toggle("borderTurn");
      clearInterval(t1);
    }
  },

  //three functions prototypes --implement removeFriendIntersection()
  removeFriendIntersection: function (piece) {
    var arr = piece.moves;
    for (var i = 0; i < arr.length; i++) {
      if (this.map[arr[i].x][arr[i].y] != null) {
        if (this.map[arr[i].x][arr[i].y].color == piece.color) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
  },
  intersection: function (arr1, arr2) {
    var arr = arr1.filter((x) => helperObj.includesPosition(arr2, x));
    return arr;
  },
  difference: function (arr1, arr2) {
    var arr = arr1.filter((x) => !helperObj.includesPosition(arr2, x));
    return arr;
  },
  includesPosition: function (
    arr,
    pos //could try to bind these to Array / Position
  ) {
    return arr.some((p) => p.x == pos.x && p.y == pos.y);
  },
  InBound: function (position) {
    return !(
      position.x > 8 ||
      position.x < 1 ||
      position.y > 8 ||
      position.y < 1
    );
  },
  changeProgressBar: function (element, val) {
    let widthVal = parseInt(getComputedStyle(element).width);
    widthVal -= val;
    element.style.width = widthVal + "px";
  },
  toShow: function (millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },
};
helperObj.Initialize();

function Position(_x, _y) {
  var p = { x: _x, y: _y };
  return p;
}
function piece(_x, _y, c) {
  this.position = Position(_x, _y);
  this.color = c;
  this.moves = [];
  this.scope = [];

  this.getAndFillAvailableMoves = function () {};
  this.filterAvailables = function () {
    helperObj.removeFriendIntersection(this);
  };
}

function knight(_x, _y, c) {
  piece.call(this, _x, _y, c);

  this.getAndFillAvailableMoves = function () {
    this.moves = [];
    var t = this.position;
    this.scope = [
      Position(t.x + 2, t.y + 1),
      Position(t.x + 1, t.y + 2),
      Position(t.x - 1, t.y + 2),
      Position(t.x - 2, t.y + 1),
      Position(t.x + 2, t.y - 1),
      Position(t.x + 1, t.y - 2),
      Position(t.x - 1, t.y - 2),
      Position(t.x - 2, t.y - 1),
    ];

    for (var i = 0; i < this.scope.length; i++) {
      if (helperObj.InBound(this.scope[i])) this.moves.push(this.scope[i]);
    }
    this.filterAvailables();
  };
}
knight.prototype = Object.create(piece.prototype);
knight.prototype.constructor = knight;

function queen(_x, _y, c) {
  piece.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves = [];
    this.scope = [];
    this.moves = getLineOfSquaresToFirstElement(this, 1, 1); // /up
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 0, 1)); //up
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 0, -1)); //down
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, 0)); //-->
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 0)); //<--
    this.moves = this.moves.concat(
      getLineOfSquaresToFirstElement(this, -1, -1)
    ); // /down
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 1)); // \up
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, -1)); // \down
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}
queen.prototype = Object.create(piece.prototype);
queen.prototype.constructor = queen;
function rook(_x, _y, c) {
  queen.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.scope = [];
    this.moves = [];
    this.moves = getLineOfSquaresToFirstElement(this, 0, 1);
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 0, -1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, 0));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 0));
    //console.log("Rook PosS" + ' '+this.color)
    //console.log( this.moves);
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}
rook.prototype = Object.create(queen.prototype);
rook.prototype.constructor = rook;
function bishop(_x, _y, c) {
  queen.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves = [];
    this.scope = [];
    this.moves = getLineOfSquaresToFirstElement(this, 1, 1);
    this.moves = this.moves.concat(
      getLineOfSquaresToFirstElement(this, -1, -1)
    );
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, -1));
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}
bishop.prototype = Object.create(queen.prototype);
bishop.prototype.constructor = bishop;

function getLineOfSquaresToFirstElement(Piece, Xdirection, Ydirection) {
  var Tpos = Position(
    Piece.position.x + Xdirection,
    Piece.position.y + Ydirection
  );
  var posS = [];
  while (helperObj.InBound(Tpos) && helperObj.map[Tpos.x][Tpos.y] == null) {
    posS.push(Position(Tpos.x, Tpos.y));
    Tpos.x += Xdirection;
    Tpos.y += Ydirection;
  }
  if (
    helperObj.InBound(Tpos) //&&
    //helperObj.map[Tpos.x][Tpos.y].color != Piece.color
  ) {
    posS.push(Position(Tpos.x, Tpos.y));
  }

  return posS;
}

//could think of a pinner class to implement those 3 pieces ...
//myStepDirection.x,.y

function king(_x, _y, c) {
  piece.call(this, _x, _y, c);
  this.isKing = true;
  this.getAndFillAvailableMoves = function () {
    this.moves = [];
    this.scope = [];
    var candidates = [0, 1, 0, -1, 1, 0, -1, 0, 1, -1, -1, 1, 1, 1, -1, -1];
    for (var i = 0; i < candidates.length; i += 2) {
      var candidatePosition = Position(
        this.position.x + candidates[i],
        this.position.y + candidates[i + 1]
      );
      if (helperObj.InBound(candidatePosition))
        this.moves.push(candidatePosition);
      this.scope.push(candidatePosition);
    }
    console.log(this.moves);
    helperObj.removeFriendIntersection(this);
    this.removeEnemyIntersection();
  };

  this.removeEnemyIntersection = function () {
    for (var i = 1; i <= 8; i++) {
      for (var j = 1; j <= 8; j++) {
        if (helperObj.map[i][j] != null) {
          var piece = helperObj.map[i][j];
          if (piece.color != this.color) {
            //then enemey piece
            this.moves = helperObj.difference(this.moves, piece.scope);
            if (helperObj.includesPosition(piece.scope, this.position))
              checked = true; //Then the king is in CHECK!
          }
        }
      }
    }
  };
}

king.prototype = Object.create(piece.prototype);
king.prototype.constructor = king;

function pawn(_x, _y, c) {
  piece.call(this, _x, _y, c);

  //this.moves
  var increment = c == 0 ? 1 : -1;
  this.firstMove = true;
  this.getAndFillAvailableMoves = function () {
    this.moves = [];
    this.scope = [];
    //normal: y + 1 //handle straight can't take (if x, y+1) not null don't push
    var tempPosition = Position(this.position.x, this.position.y + increment);

    if (
      helperObj.map[this.position.x][this.position.y + increment] == null &&
      helperObj.InBound(tempPosition)
    )
      this.moves.push(tempPosition);

    //if (firstMove) allow y + 2; firstMove = false; //same above incrementondition
    tempPosition = Position(this.position.x, this.position.y + 2 * increment);
    if (helperObj.InBound(tempPosition))
      if (this.firstMove) {
        if (
          helperObj.map[this.position.x][this.position.y + 2 * increment] ==
            null &&
          helperObj.map[this.position.x][this.position.y + increment] == null
        ) {
          this.moves.push(tempPosition);
          //this.firstMove = false;//????????????????????????
        }
      }
    //if (map[x + 1][y + 1] is enemy) allow x + 1, y + 1
    tempPosition = Position(
      this.position.x + increment,
      this.position.y + increment
    );
    if (helperObj.InBound(tempPosition)) {
      this.scope.push(tempPosition);
      if (
        helperObj.map[this.position.x + increment][
          this.position.y + increment
        ] != null
      )
        this.moves.push(tempPosition);
    }
    //if (map[x - 1][y + 1] is enemy) allow x - 1, y + 1
    tempPosition = Position(
      this.position.x - increment,
      this.position.y + increment
    );

    if (helperObj.InBound(tempPosition)) {
      this.scope.push(tempPosition);
      if (
        helperObj.map[this.position.x - increment][
          this.position.y + increment
        ] != null
      )
        this.moves.push(tempPosition);
    }
    //implement promotion in move method ..... (if pawn & y = 8 -> queen) --level 2
    this.filterAvailables();
  };
}
pawn.prototype = Object.create(piece.prototype);
pawn.prototype.constructor = pawn;

//adding event listener on all squares on load
var squares = document.getElementsByTagName("rect");
for (var i = 0; i < squares.length; i++)
  squares[i].setAttribute("onclick", "handleClick(this)");
