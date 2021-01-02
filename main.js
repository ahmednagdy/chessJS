//Link with UI --> each square will have
//id = 1,1 -> 8,8 and onclick=handleClick(this.id)

function handleClick(position) {
  //fill += king?
  //check position in map to get its state
  /////flag selected
  //select or deselect
  console.log(position.id);
  var x = parseInt(position.id.split("-")[0]);
  var y = parseInt(position.id.split("-")[1]);
  var newSelection = helperObj.map[x][y]; //could think of a map(position) as a getter function from map
  if (isSelected) {
    if (newSelection === selected) {
      //user clicked twice -> Deselect
      Deselect();
    } else if (newSelection == null) {
      //Empty Square => if available call move else deselect
      if (selected.moves.some((o) => o.x == x && o.y == y)) {
        helperObj.moveToMap_and_ui(selected, x, y);
        moveMap(x, y);
      } else {
        Deselect();
      }
    } else if (newSelection.color == turn) {
      //clicked a friend piece
      //change selection to the new piece
      selected = newSelection;
    } //(newSelection.color != turn) then it is an enemy piece
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
      isSelected = true; //ignore if first click and not your turn;
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
      console.log("id = " + id);
      oldStates.push(id);
      document.getElementById(id).classList.add("highlight"); //the available square
    }

  }
  //////////NEED TO implement the three classed in css
  //including their hover style
  //the board could be smaller

  //highlight / dehighlight
  //game end scenarios to be handled in move!
  /////////IMPLEMENT Value OF/To string for piece.position to return ready id
}
var turn = 0; //white to start
var selected = null; //no pieces selected initially
var isSelected = false;
var oldStates=[];

//To be initialized with piece ids from both sides (e.g. int from 0 to 5) 0 1 2
//Will only get updated when there is a TAKE action
//Will be used to check the draw case of insufficient material
var W = { RemainingArrayOfPieces: [] }; //timer later
var B = { RemainingArrayOfPieces: [] };
//---note : reference (one obj to be updated one time)

function moveMap(x, y) {
  //will move in the backend
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
  //CheckCHECK()
  //CheckGameEnd()
  Deselect();
  turn = !turn;
  setTimeout(function(){
    if(flag)
    alert("Congratulation, Now Pawn become Queen");
  },1000)
  
}
function Deselect() {
  selected = null; //no pieces selected initially
  isSelected = false;
}
//-----------------------------------------------------------

//-------------------------------------------
var helperObj = {
  //map[x][y]
  // 0 for white
  // 1 for black
  map: [], //to be initialized with piece objs with initial positions
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
    //this.map[2][7]=null;
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
  //map[1][3] =
  //map:[[obj1,obj2,null,new new],[],[],[],[],[],[],[]], //to be initialized with piece objs with initial positions

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
    console.log(arr);
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
  //factory for position
  var p = { x: _x, y: _y };
  return p;
}
//could think of it as a class to implement its toString to get the id from position
//this.getPos = function () { return this.position.x + "-" + this.position.y; }
function piece(_x, _y, c) {
  //We will pass the initial position here
  this.position = Position(_x, _y);
  this.color = c;
  this.moves = []; //array of position objs

  this.getAndFillAvailableMoves = function () {}; //abstract
  this.filterAvailables = function () {
    helperObj.removeFriendIntersection(this); //to be implemented -- will be called in all pieces
    //helperObj.checkPinning(this); //Am I pinned?
    //helperObj.checkCHECK(this); //Is "MY" king in danger?
  };
}
//All coming pieces will inherit (those two lines of code) the above structure
//only the king will not call the filter function inside him because he can't be pinned
//and apply constructor chaining
function knight(_x, _y, c) {
  //Constructor chain using call to initialize my vars and the same for the rest
  piece.call(this, _x, _y, c);
  //two initial positions for white and two for black ...
  //you can get all pieces available positions from the board
  //--by counting from 1-8 from the bottom left corner as 1,1

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
    this.filterAvailables(); //this will be called as it is (no overriding here)
  };

  //Calling the fill function
  this.getAndFillAvailableMoves();
}
knight.prototype = Object.create(piece.prototype);
knight.prototype.constructor = knight;
function queen(_x, _y, c) {
  piece.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    //8 directions
    //(++x)(--x)(++y)(--y)(+x + y)(-x - y)(+x - y)(-x + y) at every step

    //Will get done using "getLineOfSquaresToFirstElement()" method
    //to be implemented ...
    this.moves=[];
    this.moves = getLineOfSquaresToFirstElement(this.position, 1, 1);
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, 0, 1));
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, 0, -1));
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, 1, 0));
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, -1, 0));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, -1, -1));
    this. moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, -1, 1));
    this. moves = this. moves.concat(getLineOfSquaresToFirstElement(this.position, 1, -1));

    this.filterAvailables();
  };
  this.getAndFillAvailableMoves();
}
queen.prototype = Object.create(piece.prototype);
queen.prototype.constructor = queen;
function rook(_x, _y, c) {
  queen.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    moves = getLineOfSquaresToFirstElement(this.position, 0, 1);
    moves = moves.concat(getLineOfSquaresToFirstElement(this.position, 0, -1));
    moves = moves.concat(getLineOfSquaresToFirstElement(this.position, 1, 0));
    moves = moves.concat(getLineOfSquaresToFirstElement(this.position, -1, 0));
  };
  this.getAndFillAvailableMoves();
}
rook.prototype = Object.create(queen.prototype);
rook.prototype.constructor = rook;
function bishop(_x, _y, c) {
  queen.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function () {
    this.moves = getLineOfSquaresToFirstElement(this.position, 1, 1);
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, -1, -1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, -1, 1));
    this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this.position, 1, -1));
    this.filterAvailables();
  };
  this.getAndFillAvailableMoves();
}
bishop.prototype = Object.create(queen.prototype);
bishop.prototype.constructor = bishop;
function getLineOfSquaresToFirstElement(pos, Xdirction, Ydriction) {
  var Tpos = new Position(pos.x + Xdirction, pos.y + Ydriction);
  var posS = [];
  while (helperObj.InBound(Tpos) && helperObj.map[Tpos.x][Tpos.y] == null) {
    posS.push(new Position(Tpos.x, Tpos.y));
    Tpos.x += Xdirction;
    Tpos.y += Ydriction;
  }
  if (helperObj.InBound(Tpos) && helperObj.map[Tpos.x][Tpos.y].color != turn)
    posS.push(new Position(Tpos.x, Tpos.y));
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
  this.getAndFillAvailableMoves();
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
  this.getAndFillAvailableMoves();
}
pawn.prototype = Object.create(piece.prototype);
pawn.prototype.constructor = pawn;

//adding event listener on all squares on load
var squares = document.getElementsByTagName("rect");
for (var i = 0; i < squares.length; i++)
  squares[i].setAttribute("onclick", "handleClick(this)");
