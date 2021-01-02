
function handleClick(position) {
  //console.log(position.id);
  var x = parseInt(position.id.split("-")[0]);
  var y = parseInt(position.id.split("-")[1]);
  var newSelection = helperObj.map[x][y]; //could think of a map(position) as a getter function from map
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
    } 
    else {
      if (selected.moves.some((o) => o.x == newSelection.position.x && o.y == newSelection.position.y)) {
        //TAKE ////
        helperObj.moveToMap_and_ui(selected, x, y); //deselect
        moveMap(x, y);
      } else {
        Deselect();
      }
    }
  } else {
    if(newSelection)
    if (newSelection.color == turn) {
      selected = newSelection;
      isSelected = true;
    }
  }
  
  //remove highlight by default
  if(oldStates[0]) document.getElementById(oldStates[0]).classList.remove("highlightPiece");
  for (var i = 1 ; i< oldStates.length; i++) 
  {
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
var oldStates=[];


var W = { RemainingArrayOfPieces: [] };
var B = { RemainingArrayOfPieces: [] };

function moveMap(x, y) {
  var tX = selected.position.x; tY = selected.position.y;
  var flag = false;
  helperObj.map[tX][tY] = null;

  if(selected.firstMove )
    selected.firstMove =false;// for handel first move of pawn
  if(selected.firstMove != undefined &&(y==8 || y==1)){
    selected =  new queen(tX, tY, selected.color);
    flag = true;
  }

  helperObj.map[x][y] = selected;
  helperObj.map[x][y].position = Position(x, y);

  

  for (var i = 1; i <= 8; i++) {
    for (var j = 1; j <= 8; j++) {
      if (helperObj.map[i][j] != null)
        helperObj.map[i][j].getAndFillAvailableMoves();
    }
  }
  
  Deselect();
  turn = !turn;
  setTimeout(function(){
    if(flag)
    alert("Congratulation, Now Pawn become Queen");
  },1000)
}
function Deselect() {
  selected = null; 
  isSelected = false;
}
//-----------------------------------------------------------

//-------------------------------------------
var helperObj = {
  
  map: [], 
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
    let Allpieces = document.querySelectorAll(".black-piece, .white-piece");

    function grabPositionPiece(pieceX) {
      let Positions = pieceX.style.transform.match(/[0-9]{3}/g);
      let posX = Positions[0];
      let posY = Positions[1];
      return `${posX}px,${posY}px`;
    }

    function getPieceByPosition(posX, posY) {
    var Spos = `${posX * 100}px,${posY * 100}px`;
    for (let i = 0; i < Allpieces.length; i++) {
    if (Spos == grabPositionPiece(Allpieces[i])) {
      return Allpieces[i];
    }
  }
}

    /*function checkCHECK() {
          return false;
        }*/
    //var Spos = `${piece.position.x * 100}px,${piece.position.y * 100}px`;
    //let pieceUI = document.querySelector('[translate="'+Spos+'"]');
    let pieceUI = getPieceByPosition(piece.position.x, 9 - piece.position.y);
    let translatePosition = `translate(${x * 100}px, ${(9-y) * 100}px)`;
    //let oldPosition = grabPositionPiece(piece);
    
    if (this.map[x][y] == null) 
    {
      pieceUI.style.transform = translatePosition;
      console.log(translatePosition);
    } 
    else 
    {
      console.log("some ooooooooooooooo")
      let eatenPieceUI = getPieceByPosition(x, 9 - y);   //let eatenPiece = getPieceByPosition(x, y);
      pieceUI.style.transform = translatePosition;
      eatenPieceUI.style.transform = "translate(900px,900px)";
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
    //console.log(arr);
  },
  //filterAvailables:function(){},
  intersection: function (arr1, arr2) {
    var arr = arr1.filter((x) => arr2.indexOf(x) != -1);
    return arr;
  },
  difference: function (arr1, arr2) {
    var arr = arr1.filter((x) => arr2.indexOf(x) == -1);
    return arr;
  },
  InBound: function (position) {
    return !(
      position.x > 8 ||
      position.x < 1 ||
      position.y > 8 ||
      position.y < 1
    );
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

  this.getAndFillAvailableMoves = function () {};
  this.filterAvailables = function () {
    helperObj.removeFriendIntersection(this); 
  };
}

function knight(_x, _y, c) {
  
  piece.call(this, _x, _y, c);
 

  this.getAndFillAvailableMoves = function () {
    this.moves=[];
    var t = this.position;
    var candidates = [
      Position(t.x + 2, t.y + 1),
      Position(t.x + 1, t.y + 2),
      Position(t.x - 1, t.y + 2),
      Position(t.x - 2, t.y + 1),
      Position(t.x + 2, t.y - 1),
      Position(t.x + 1, t.y - 2),
      Position(t.x - 1, t.y - 2),
      Position(t.x - 2, t.y - 1),
    ];

    for (var i = 0; i < candidates.length; i++) {
      if (helperObj.InBound(candidates[i])) this.moves.push(candidates[i]);
    }
    this.filterAvailables(); 
  };
}
knight.prototype = Object.create(piece.prototype);
knight.prototype.constructor = knight;

function queen(_x, _y, c) {
  piece.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves=[];
    this.moves = getLineOfSquaresToFirstElement(this, 1, 1);// /up
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 0, 1));//up
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 0, -1));//down
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, 0));//-->
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 0));//<--
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, -1));// /down
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 1));// \up
    this. moves = this. moves.concat(getLineOfSquaresToFirstElement(this, 1, -1));// \down
    this.filterAvailables();
  };
}
queen.prototype = Object.create(piece.prototype);
queen.prototype.constructor = queen;
function rook(_x, _y, c) {
  queen.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves = getLineOfSquaresToFirstElement(this, 0, 1);
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 0, -1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, 0));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 0));
    console.log("Rook PosS" + ' '+this.color)
    console.log( this.moves);
  };
}
rook.prototype = Object.create(queen.prototype);
rook.prototype.constructor = rook;
function bishop(_x, _y, c) {
  queen.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves = getLineOfSquaresToFirstElement(this, 1, 1);
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, -1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, -1, 1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this, 1, -1));
    this.filterAvailables();
  };
}
bishop.prototype = Object.create(queen.prototype);
bishop.prototype.constructor = bishop;

function getLineOfSquaresToFirstElement(Piece, Xdirction, Ydriction) {
  var Tpos = Position(Piece.position.x + Xdirction, Piece.position.y + Ydriction);
  var posS = [];
  while (helperObj.InBound(Tpos) && helperObj.map[Tpos.x][Tpos.y] == null) {
    posS.push(Position(Tpos.x, Tpos.y));
    Tpos.x += Xdirction;
    Tpos.y += Ydriction;
  }
  if (helperObj.InBound(Tpos) && helperObj.map[Tpos.x][Tpos.y].color != Piece.color){
    posS.push(Position(Tpos.x, Tpos.y));
    console.log("fuckkkkkkkkkkkk");
  }
 
  return posS;
}

//could think of a pinner class to implement those 3 pieces ...
//myStepDirection.x,.y

function king(_x, _y, c) {
  piece.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves=[];
    for (var i = -1, j = 0; i <= 1 && j <= 1; i += 2) {
      //gets  x- x+ y- y+
      var p = Position(
        this.position.x + (j != 1 ? i : 0),
        this.position.y + (j == 1 ? i : 0)
      );
      if (i == 1 && j == 0) {
        i = -3;
        j = 1;
      }
      if (helperObj.InBound(p)) this.moves.push(p);
    }
    for (var j = 1; j <= 4; j++) {
      //gets  x-y- x+y+  x+y-  x-y+
      var p = Position(
        this.position.x + (j == 1 ? 1 : j == 2 ? -1 : j == 3 ? -1 : 1),
        this.position.y + (j == 1 ? 1 : j == 2 ? -1 : j == 3 ? 1 : -1)
      );
      if (helperObj.InBound(p)) this.moves.push(p);
    }
    //this.filterAvailables();
    helperObj.removeFriendIntersection(this); //essential call
    //this.removeEnemyIntersection(); //awaiting map initialization
  };

  this.removeEnemyIntersection = function () {
    for (var i = 1; i <= 8; i++) {
      for (var j = 1; j <= 8; j++) {
        if (helperObj.map[i][j].color != this.color) {
          //then enemey piece
          var enemy = helperObj.map[i][j];
          this.moves = difference(this.moves, enemy.moves);
          if (enemy.moves.some(o=>o.x == this.position.x && o.y == this.position.y)) checked = true; //Then the king is in CHECK!
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
    this.moves = []
    //normal: y + 1 //handle straight can't take (if x, y+1) not null don't push
    var tempPosition = Position(this.position.x, this.position.y + increment);

    if (
      helperObj.map[this.position.x][this.position.y + increment] == null &&
      helperObj.InBound(tempPosition)
    ) {
      this.moves.push(tempPosition);
    }
    //if (firstMove) allow y + 2; firstMove = false; //same above incrementondition
    tempPosition = Position(this.position.x, this.position.y + 2 * increment);
    if(helperObj.InBound(tempPosition))
    if (this.firstMove) {    
      if (
        helperObj.map[this.position.x][this.position.y + 2 * increment] == null &&
        helperObj.map[this.position.x][this.position.y +  increment] == null
      ) {
        this.moves.push(tempPosition);
        //this.firstMove = false;//????????????????????????
      }
    }
    //if (map[x + 1][y + 1] is enemy) allow x + 1, y + 1
    tempPosition = Position(this.position.x + increment, this.position.y + increment);
    if( helperObj.InBound(tempPosition)){
    if (
      helperObj.map[this.position.x + increment][this.position.y + increment] != null 
     
    ) {
      this.moves.push(tempPosition);
    }}
    //if (map[x - 1][y + 1] is enemy) allow x - 1, y + 1
    tempPosition = Position(this.position.x - increment, this.position.y + increment);
   
   if( helperObj.InBound(tempPosition)){
    if (
      helperObj.map[this.position.x - increment][this.position.y + increment] != null
     
    ) {
      this.moves.push(tempPosition);
    }
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
