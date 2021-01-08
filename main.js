function handleClick(position) {
  if (gameOver) return;
  console.log(position.id);
  var x = parseInt(position.id.split("-")[0]);
  var y = parseInt(position.id.split("-")[1]);
  var newSelection = helperObj.map[x][y]; //could think of a map(position) as a getter function from map
  var Wpar = document.getElementsByClassName("timer")[1];
  var whiteOverBar = document.getElementsByClassName("timeout")[1];
  var wdiv = document.getElementsByClassName("white")[0];
  if (prevTurn == -1) {
    t2 = setInterval(function () {
      helperObj.changeProgressBar(whiteOverBar, step);
      timer2 -= 1000;
      Wpar.textContent = helperObj.toShow(timer2);
      if (timer2 <= 0) {
        clearInterval(t2);
        if (isNotEnoughPieces(0)) {
          //!turn //checks for black pieces if white time's up
          alert("Draw");
          gameOver = true;
        } else {
          showEndGameBox("black");
          gameOver = true;
        }
      }
    }, 1000);

    clearInterval(t1);
    prevTurn = 900;
    Wpar.classList.add("running");
    wdiv.classList.add("borderTurn");
  }
  if (isSelected) {
    if (newSelection === selected) Deselect();
    else if (newSelection == null) {
      if (selected instanceof king && helperObj.includesPosition(selected.moves,Position(selected.position.x + 2, selected.position.y)) && x == selected.position.x + 2)
      {
        //the boss  wants to castle king side
        helperObj.moveUI(selected, x, y);
        var color = selected.color;
        moveMap(x, y);
        //move the rook next to it
        helperObj.moveUI(helperObj.map[8][color ? 8 : 1], 6, color ? 8 : 1);
        selected = helperObj.map[8][color ? 8 : 1];
        turn = !turn;
        moveMap(6, color ? 8 : 1);
      }
      else if (selected instanceof king && helperObj.includesPosition(selected.moves,Position(selected.position.x - 2, selected.position.y)) &&
        x == selected.position.x - 2)
        {
        //the boss  wants to castle queen side
        helperObj.moveUI(selected, x, y);
        var color = selected.color;
        moveMap(x, y);
        //move the rook next to it
        helperObj.moveUI(helperObj.map[1][color ? 8 : 1], 4, color ? 8 : 1);
        selected = helperObj.map[8][color ? 8 : 1];
        turn = !turn;
        moveMap(4, color ? 8 : 1);
      }
      else if (selected instanceof pawn && selected.canTakeEnPassant && (x==selected.position.x+1 ||x==selected.position.x-1)) //en passant case
      {
          helperObj.moveUI(selected.canTakeEnPassant,x,y);
          helperObj.map[x][y] = selected.canTakeEnPassant;
          helperObj.map[selected.canTakeEnPassant.position.x][selected.canTakeEnPassant.position.y] = null;

          helperObj.moveUI(selected,x,y);
          moveMap(x,y);
      }
      else if (helperObj.includesPosition(selected.moves, Position(x, y)))
      {
        helperObj.moveUI(selected, x, y);
        moveMap(x, y);
      } else Deselect();
    } else if (newSelection.color == turn) selected = newSelection;
    else {
      if (
        helperObj.includesPosition(
          selected.moves,
          Position(newSelection.position.x, newSelection.position.y)
        )
      ) {
        //TAKE ////
        helperObj.moveUI(selected, x, y); //deselect
        moveMap(x, y);
      } else Deselect();
    }
  } else {
    if (newSelection)
      if (newSelection.color == turn) {
        selected = newSelection;
        isSelected = true;
      }
  }

  if (selected) {
    if (selected instanceof king) {
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
      id = id.x + "-" + id.y;
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
var gameOver = false;
var timer1 = 300 * 1000;
var timer2 = 300 * 1000;
var step = 1;
var t1;
var t2;
var choosenTime;
var prevTurn = -1;
var turnCount = 0;
var originalUI = document.getElementsByTagName("svg")[0].innerHTML;
var W = { RemainingArrayOfPieces: [] };
var B = { RemainingArrayOfPieces: [] };

function moveMap(x, y) {
  var tX = selected.position.x;
  tY = selected.position.y;
  helperObj.map[tX][tY] = null;

  if (selected instanceof pawn)
  {
    if (selected.firstMove)
    {
      selected.firstMove = false;
      selected.passPositionForEnPassant(x,y);
    }
  } // for handling the first move of pawns

  if (selected.firstMove != undefined && (y == 8 || y == 1)) {
    var anyQueen;
    if (selected.color == 0)
      anyQueen = document.getElementById("whiteQueen");
    else
      anyQueen = document.getElementById("blackQueen");


    var tPawn = helperObj.getPieceByPosition(x, 9 - y);

    tPawn.innerHTML = anyQueen.innerHTML;
    selected = new queen(tX, tY, selected.color);
  }
  //Updating first move for king and rook
  if (selected.hasMoved == false) selected.hasMoved = true;

  helperObj.map[x][y] = selected;
  helperObj.map[x][y].position = Position(x, y);

  //-------------------updating availables turn's pieces to check for !turn king safety
  //------not only the moved piece because it could be a discovered check
  //now checking everything ==> to be optimized
  for (var i = 1; i <= 8; i++) {
    for (var j = 1; j <= 8; j++) {
      if (helperObj.map[i][j])
        // && helperObj.map[i][j].color==turn)
        helperObj.map[i][j].getAndFillAvailableMoves();
    }
  }
  helperObj.GetKing(!turn).getAndFillAvailableMoves();

  Deselect();
  turnCount++;
  turn = !turn;
  whichCannotMove();
  isNotEnoughPieces();
}
function Deselect() {
  selected = null;
  isSelected = false;
}

var helperObj =
{
  map: ([] = [[], [], [], [], [], [], [], [], []]),
  justHappenedMove: {oldX: 0,oldY: 0,newX: 0,newY: 0,},
  getSquareByPosition: function (x, y)
  {
    return document.getElementById(x+"-"+y);
  },
  /*getPieceByPosition: function (x, y)
  {
    return document.getElementById(x+","+y);
  },*/
  getPieceByPosition: function (posX, posY) {
    var Allpieces = document.querySelectorAll(".black-piece, .white-piece");
    var Spos = `${posX * 100}px,${posY * 100}px`;
    for (var i = 0; i < Allpieces.length; i++) {
      if (Spos == this.grabPositionPiece(Allpieces[i])) {
        return Allpieces[i];
      }
    }
  },
  grabPositionPiece: function (pieceX) {
    var Positions = pieceX.style.transform.match(/[0-9]{3}/g);
    var posX = Positions[0];
    var posY = Positions[1];
    return `${posX}px,${posY}px`;
  },
  Initialize: function () {
    //this.map = [];
    for (var i = 0; i <= 8; i++) {
      //this.map[i] = [];
      for (var j = 0; j <= 8; j++) {
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
  ResetGame: function () {
    this.Initialize();
    document.getElementsByTagName("svg")[0].innerHTML=originalUI;
    var squares = document.getElementsByTagName("rect");
    for (var i = 0; i < squares.length; i++)
         squares[i].setAttribute("onclick", "handleClick(this)");
    turn = 0;

    var timers = document.getElementsByClassName("timer");
    clearInterval(t1);
    clearInterval(t2)
    timers[0].textContent = timers[1].textContent = this.toShow(choosenTime);
    var blackOverBar = document.getElementsByClassName("timeout")[0];
    var whiteOverBar = document.getElementsByClassName("timeout")[1];
    blackOverBar.style.width = whiteOverBar.style.width = "0px";
    prevTurn = -1;
    timer1 = choosenTime;
    timer2 = choosenTime;

    var wdiv = document.getElementsByClassName("white")[0];
    var Wpar = document.getElementsByClassName("timer")[1];
    var Bdiv = document.getElementsByClassName("black")[0];
    var Bpar = document.getElementsByClassName("timer")[0];
    Wpar.classList.remove("running");
    wdiv.classList.remove("borderTurn");
    Bpar.classList.remove("running");
    Bdiv.classList.remove("borderTurn");

    gameOver = false;

  },

  fillInitialize: function (_y1, _y2, c)
   {
    //for (var i = 1; i <= 8; i++) this.map[i][_y2] = new pawn(i, _y2, c);

    //this.map[1][_y1] = new rook(1, _y1, c);    this.map[8][_y1] = new rook(8, _y1, c);
    //this.map[2][_y1] = new knight(2, _y1, c);  this.map[7][_y1] = new knight(7, _y1, c);
    //this.map[3][_y1] = new bishop(3, _y1, c);  this.map[6][_y1] = new bishop(6, _y1, c);
    this.map[4][_y1] = new queen(4, _y1, c);
    this.map[5][_y1] = new king(5, _y1, c);
    var x = 0;
    for (var i = 0; i <= 8; i++)
      for (var j = 0; j <= 8; j++) {
        if (this.map[i][j]) x++;
      }
  },

  moveUI: function (piece, x, y) {
    var Bpar = document.getElementsByClassName("timer")[0];
    var Wpar = document.getElementsByClassName("timer")[1];
    var blackOverBar = document.getElementsByClassName("timeout")[0];
    var whiteOverBar = document.getElementsByClassName("timeout")[1];
    var Bdiv = document.getElementsByClassName("black")[0];
    var wdiv = document.getElementsByClassName("white")[0];

    var pieceUI = this.getPieceByPosition(piece.position.x, 9 - piece.position.y);
    var oldSquare = this.getSquareByPosition(piece.position.x,piece.position.y);
    if (helperObj.justHappenedMove.oldX != 0)
    {
      var oldPos = helperObj.getSquareByPosition(helperObj.justHappenedMove.oldX,helperObj.justHappenedMove.oldY);
      var newPos = helperObj.getSquareByPosition(helperObj.justHappenedMove.newX,helperObj.justHappenedMove.newY);
      oldPos.classList.remove("highlight-move");
      newPos.classList.remove("highlight-move");
    }
    var newSquar = this.getSquareByPosition(x, y);
    this.justHappenedMove.oldX = piece.position.x;
    this.justHappenedMove.oldY = piece.position.y;
    this.justHappenedMove.newX = x;
    this.justHappenedMove.newY = y;
    oldSquare.classList.add("highlight-move");
    newSquar.classList.add("highlight-move");
    var translatePosition = `translate(${x * 100}px, ${(9 - y) * 100}px)`;

    if (this.map[x][y] != null)
    {
      var eatenPieceUI = this.getPieceByPosition(x, 9 - y);
      eatenPieceUI.style.transform = "translate(900px,900px)";
    }
    pieceUI.style.transform = translatePosition;

    if (!turn || prevTurn == 900)
    {
      t1 = setInterval(function () {
        helperObj.changeProgressBar(blackOverBar, step);
        timer1 -= 1000;
        Bpar.textContent = helperObj.toShow(timer1);
        if (timer1 <= 0) {
          clearInterval(t1);
          if (isNotEnoughPieces(1)) {
            //!turn //checks for black pieces if white time's up
            alert("Draw");
            gameOver = true;
          } else {
            showEndGameBox("white");
            gameOver = true;
          }
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
        helperObj.changeProgressBar(whiteOverBar, step);
        timer2 -= 1000;
        Wpar.textContent = helperObj.toShow(timer2);
        if (timer2 <= 0) {
          clearInterval(t2);
          if (isNotEnoughPieces(0)) {
            //!turn //checks for black pieces if white time's up
            alert("Draw");
            gameOver = true;
          } else {
            showEndGameBox("black");
            gameOver = true;
          }
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
  isKingInCheck: function (piece) {
    if (checked) {
      //if the king in check => filter my available moves
      //var MultiCheck = 0;
      for (var i = 1; i <= 8; i++)
        for (var j = 1; j <= 8; j++)
          if (helperObj.map[i][j] != null)
            if (helperObj.map[i][j].color != piece.color) {
              //enemy
              var enemy = helperObj.map[i][j];
              var king = this.GetKing(piece.color);
              if (helperObj.includesPosition(enemy.scope, king.position)) {
                //then enemy is a checker
                if (enemy.pinner) {
                  //if pinner then could block or take
                  var directionToTheKing = helperObj.GetDirections(king,enemy);
                  var line = getLineOfSquaresToFirstElement(enemy, directionToTheKing[0],directionToTheKing[1]);
                  var oldmoves = piece.moves;
                  piece.moves = helperObj.intersection(piece.moves, [enemy.position]);
                  piece.moves = piece.moves.concat(helperObj.intersection(oldmoves, line));
                  //multi check condition to be made at the king's removeEnemyIntersectionFunction
                }
                else
                  piece.moves = helperObj.intersection(piece.moves, [enemy.position]);
              }
            }
    }
  },
  GetKing: function (color)
  {
    for (var i = 1; i <= 8; i++)
      for (var j = 1; j <= 8; j++)
        if (helperObj.map[i][j] != null) {
          if (helperObj.map[i][j] instanceof king && helperObj.map[i][j].color == color)
            return helperObj.map[i][j];
        }
  },
  GetDirections: function (piece1, piece2)
  {
    var Xdirection = 0;
    if (piece1.position.x > piece2.position.x) Xdirection = 1;
    else if (piece1.position.x < piece2.position.x) Xdirection = -1;
    var Ydirection = 0;
    if (piece1.position.y > piece2.position.y) Ydirection = 1;
    else if (piece1.position.y < piece2.position.y) Ydirection = -1;
    return [Xdirection,Ydirection];
  },
  intersection: function (arr1, arr2)
  {
    var arr = arr1.filter((x) => helperObj.includesPosition(arr2, x));
    return arr;
  },
  difference: function (arr1, arr2)
  {
    var arr = arr1.filter((x) => !helperObj.includesPosition(arr2, x));
    return arr;
  },
  includesPosition: function (arr,pos) //could try to bind these to Array / Position
  {
    return arr.some((p) => p.x == pos.x && p.y == pos.y);
  },
  InBound: function (position)
  {
    return !(position.x > 8 || position.x < 1 ||  position.y > 8 || position.y < 1);
  },
  changeProgressBar: function (element, val)
  {
    var widthVal = parseFloat(getComputedStyle(element).width);
    widthVal += val;
    element.style.width = widthVal + "px";
  },
  toShow: function (millis)
  {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },
  findEnemyPinners: function (color)
  {
    var Tpinners = [];
    for (var i = 1; i <= 8; i++)
    {
      for (var j = 1; j <= 8; j++)
      {
        if (helperObj.map[j][i] != null && helperObj.map[j][i].pinner && helperObj.map[j][i].color != color)
          Tpinners.push(helperObj.map[j][i]);
      }
    }
    return Tpinners;
  },
  checkPinning: function (piece) {
    //we could use W or B arrays but for now i 'll use map
    var pinners = [];
    pinners = this.findEnemyPinners(piece.color);
    var king = this.GetKing(piece.color);
    var P_to_K_Direction = [];
    for (var i = 0; i < pinners.length; i++)
    {
      var DeffX = king.position.x - pinners[i].position.x;
      var DeffY = king.position.y - pinners[i].position.y;
      P_to_K_Direction[0] = DeffX;
      P_to_K_Direction[1] = DeffY;
      if (DeffX != 0) P_to_K_Direction[0] = DeffX / Math.abs(DeffX);
      if (DeffY != 0) P_to_K_Direction[1] = DeffY / Math.abs(DeffY);
      if (
        pinners[i].directions.some(
          (d) => d[0] == P_to_K_Direction[0] && d[1] == P_to_K_Direction[1]
        ) &&
        (Math.abs(DeffX) == Math.abs(DeffY) ||
          Math.abs(P_to_K_Direction[1] + P_to_K_Direction[0]) == 1)
      ) {
        // the pinner could move to the king direction
        if (this.includesPosition(pinners[i].scope, piece.position)) {
          var Tpos = Position(
            piece.position.x + P_to_K_Direction[0],
            piece.position.y + P_to_K_Direction[1]
          );
          var exit = false;
          while (this.InBound(Tpos) && !exit) {
            if (Tpos.x == king.position.x && Tpos.y == king.position.y) {
              var pinnedMoves = [];
              var temp_pos = Position(
                piece.position.x + P_to_K_Direction[0] * -1,
                piece.position.y + P_to_K_Direction[1] * -1
              );

              while (
                temp_pos.x != pinners[i].position.x ||
                temp_pos.y != pinners[i].position.y
              ) {
                pinnedMoves.push(temp_pos);
                temp_pos = Position(
                  temp_pos.x + P_to_K_Direction[0] * -1,
                  temp_pos.y + P_to_K_Direction[1] * -1
                );
              }
              pinnedMoves.push(temp_pos);
              piece.moves = this.intersection(pinnedMoves, piece.moves);
              //piece.moves=[];
              exit = true;
            } else if (this.map[Tpos.x][Tpos.y] != null) {
              exit = true;
            }
            Tpos.x += P_to_K_Direction[0];
            Tpos.y += P_to_K_Direction[1];
          }
        }
      }
    }
  },
};

function Position(_x, _y)
{
  var p = { x: _x, y: _y };
  return p;
}
function whichCannotMove()
{
  var flag = false;
  for (var i = 1; i <= 8; i++)
    for (var j = 1; j <= 8; j++)
      if (helperObj.map[i][j])
      {
        if (!(helperObj.map[i][j] instanceof king)) helperObj.map[i][j].filterAvailables();
        if (helperObj.map[i][j].color == turn && helperObj.map[i][j].moves.length != 0) flag = true;
      }
  if (!flag) isCheckmate(turn ? "White" : "Black");
  return null;
}
function isCheckmate(win)
{
  gameOver = true;
  if (checked)
  {
    setTimeout(function () {
      alert("Checkmate! " + win + " wins :)");
    }, 500); //declare win;
    //return true;
  }
  else stalemate();
}

function stalemate() {
  //to be called in the beginning of each players turn
  //if all my pieces (including the king) availables = []
  alert("Draw by Stalemate"); ////declare draw;
  return true;
}
function isNotEnoughPieces(color)
{
  var allPieces = [0, 0];
  var tmpWhitePiece = null;
  var tmpBlackPiece = null;

  for (var i = 1; i <= 8; i++) {
    for (var j = 1; j <= 8; j++) {
      if (helperObj.map[i][j]) {
        allPieces[helperObj.map[i][j].color]++;
        if (!(helperObj.map[i][j] instanceof king))
          if (helperObj.map[i][j].color == 0)
            tmpWhitePiece = helperObj.map[i][j];
          else tmpBlackPiece = helperObj.map[i][j];
      }
    }
  }
  if (color != undefined) return allPieces[color] == 1;

  if (allPieces[0] + allPieces[1] > 3) return false;

  if (allPieces[0] == 1 && allPieces[1] == 1)
  {
    alert("Draw by Insufficient Material");
    gameOver = true;
    return true;
  }
  var pieceCheck = allPieces[0] == 1 ? tmpBlackPiece : tmpWhitePiece;
  if (pieceCheck instanceof bishop || pieceCheck instanceof knight)
  {
    alert("Draw by Insufficient Material");
    gameOver = true;
    return true;
  }
  return false;
}
function piece(_x, _y, c)
{
  this.position = Position(_x, _y);
  this.color = c;
  this.moves = [];
  this.scope = [];

  this.getAndFillAvailableMoves = function () {};
  this.filterAvailables = function ()
  {
    helperObj.removeFriendIntersection(this);
    helperObj.checkPinning(this);
    helperObj.isKingInCheck(this);
  };
}

function knight(_x, _y, c)
{
  piece.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function ()
  {
    this.moves = [];
    this.scope = [[2,   1],[1,   2],[- 1,   2],[- 2,   1],[2,  - 1],[1,  - 2],[- 1,  - 2],[- 2,  - 1]];
    for (var i = 0; i < this.scope.length; i++)
      if (helperObj.InBound(Position(this.position.x + this.scope[i][0],this.position.y + this.scope[i][1])))
      this.moves.push(Position(this.position.x + this.scope[i][0], this.position.y + this.scope[i][1]));
    this.filterAvailables();
  };
}
knight.prototype = Object.create(piece.prototype);
knight.prototype.constructor = knight;

function queen(_x, _y, c)
{
  piece.call(this, _x, _y, c);
  this.pinner = true;
  this.directions = [[1, 1],[0, 1],[0, -1],[1, 0],[-1, 0],[-1, -1],[-1, 1],[1, -1]];
  this.getAndFillAvailableMoves = function ()
  {
    this.moves = [];
    this.scope = [];
    this.moves = getLineOfSquaresToFirstElement(this, 1, 1);
    for (var i = 1; i < 8; i++)
      this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this,this.directions[i][0],this.directions[i][1]));
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}
queen.prototype = Object.create(piece.prototype);
queen.prototype.constructor = queen;
function rook(_x, _y, c)
{
  this.hasMoved = false;
  queen.call(this, _x, _y, c);
  this.directions = [[0, 1],[0, -1],[1, 0],[-1, 0]];
  this.getAndFillAvailableMoves = function ()
  {
    this.scope = [];
    this.moves = [];
    this.moves = getLineOfSquaresToFirstElement(this, 0, 1);
    for (var i = 1; i < 4; i++)
      this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this,this.directions[i][0],this.directions[i][1]));
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}

rook.prototype = Object.create(queen.prototype);
rook.prototype.constructor = rook;
function bishop(_x, _y, c)
{
  queen.call(this, _x, _y, c);
  this.directions = [[1, 1],[-1, -1],[-1, 1],[1, -1]];
  this.getAndFillAvailableMoves = function ()
  {
    this.moves = []; this.scope = [];
    this.moves = getLineOfSquaresToFirstElement(this, 1, 1);
    for (var i = 1; i < 4; i++)
      this.moves = this.moves.concat(getLineOfSquaresToFirstElement(this,this.directions[i][0],this.directions[i][1]));
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}
bishop.prototype = Object.create(queen.prototype);
bishop.prototype.constructor = bishop;
function getLineOfSquaresToFirstElement(Piece, Xdirection, Ydirection)
{
  var tmpPosition = Position(Piece.position.x + Xdirection,Piece.position.y + Ydirection);
  var positions = [];
  while (helperObj.InBound(tmpPosition) && helperObj.map[tmpPosition.x][tmpPosition.y] == null)
  {
    positions.push(Position(tmpPosition.x, tmpPosition.y));
    tmpPosition.x += Xdirection;
    tmpPosition.y += Ydirection;
  }
  if (helperObj.InBound(tmpPosition)) positions.push(Position(tmpPosition.x, tmpPosition.y));
  return positions;
}
function king(_x, _y, c)
{
  this.hasMoved = false;
  this.castled = false;
  piece.call(this, _x, _y, c);
  this.getAndFillAvailableMoves = function ()
  {
    this.moves = [];
    this.scope = [];
    var candidates = [0, 1, 0, -1, 1, 0, -1, 0, 1, -1, -1, 1, 1, 1, -1, -1];
    for (var i = 0; i < candidates.length; i += 2)
    {
      var candidatePosition = Position(this.position.x + candidates[i], this.position.y + candidates[i + 1]);
      if (helperObj.InBound(candidatePosition)) this.moves.push(candidatePosition);
      this.scope.push(candidatePosition);
    }
    helperObj.removeFriendIntersection(this);
    this.removeEnemyIntersection();
    /////adding castling capabililty
    if (!checked)
    {
      if (!this.hasMoved && helperObj.map[8][turn ? 8 : 1] && !helperObj.map[8][turn ? 8 : 1].hasMoved)
        if (getLineOfSquaresToFirstElement(this, 1, 0).length == 3)
          if (helperObj.includesPosition(this.moves,Position(this.position.x + 1, this.position.y)))
            this.moves.push(Position(this.position.x + 2, this.position.y));

      if (!this.hasMoved && helperObj.map[1][turn ? 8 : 1] && !helperObj.map[1][turn ? 8 : 1].hasMoved)
        if (getLineOfSquaresToFirstElement(this, -1, 0).length == 4)
          if (helperObj.includesPosition(this.moves,Position(this.position.x - 1, this.position.y)))
            this.moves.push(Position(this.position.x - 2, this.position.y));
      this.removeEnemyIntersection();
    }
  };

  this.removeEnemyIntersection = function ()
  {
    checked = false;
    for (var i = 1; i <= 8; i++)
      for (var j = 1; j <= 8; j++)
      {
        if (helperObj.map[i][j] != null)
        {
          var piece = helperObj.map[i][j];
          if (piece.color != this.color)
          {
            //then enemey piece
            this.moves = helperObj.difference(this.moves, piece.scope);
            if (helperObj.includesPosition(piece.scope, this.position))
            {
              checked = true; //Then the king is in CHECK!
              helperObj.getSquareByPosition(this.position.x,this.position.y).classList.add("check");
              checkedPosition = this.position;
              if (piece.pinner) //to be implemented as (piece instanceof pinner)
              {
                //remove its long scope beyond the king
                var Xdirection = 0;
                if (this.position.x > piece.position.x) Xdirection = 1;
                else if (this.position.x < piece.position.x) Xdirection = -1;
                var Ydirection = 0;
                if (this.position.y > piece.position.y) Ydirection = 1;
                else if (this.position.y < piece.position.y) Ydirection = -1;
                this.moves = helperObj.difference(this.moves,[Position(this.position.x+Xdirection, this.position.y+Ydirection)]);
              }
            }
          }
        }
      }
    if (!checked && checkedPosition)
      document.getElementById(checkedPosition.x + "-" + checkedPosition.y).classList.remove("check");
  };
}
var checkedPosition;
king.prototype = Object.create(piece.prototype);
king.prototype.constructor = king;

function pawn(_x, _y, c)
{
  piece.call(this, _x, _y, c);
  this.canTakeEnPassant = null;
  var increment = c == 0 ? 1 : -1;
  this.firstMove = true;
  this.EnPassantIsAvailable = function () { return turnCount == canBeTakenEnPassant; };
  var canBeTakenEnPassant = -1;
  this.passPositionForEnPassant = function (x, y)
  {
    if (x == _x && y == _y + 2 * increment) { canBeTakenEnPassant = turnCount+1; }
  };
  this.getAndFillAvailableMoves = function ()
  {
    this.moves = [];
    this.scope = []; this.canTakeEnPassant = null;
    //var candidates = [[0,increment],[0,2*increment],[increment,increment],[-increment, increment]];
    //normal: y + 1 //handle straight can't take (if x, y+1) not null don't push
    var tempPosition = Position(this.position.x, this.position.y + increment);

    if (helperObj.map[this.position.x][this.position.y + increment] == null &&
      helperObj.InBound(tempPosition))
      this.moves.push(tempPosition);

    //if (firstMove) allow y + 2; firstMove = false; //same above increment condition
    tempPosition = Position(this.position.x, this.position.y + 2 * increment);
    if (helperObj.InBound(tempPosition))
      if (this.firstMove)
      {
        if (helperObj.map[this.position.x][this.position.y + 2 * increment] == null &&
  helperObj.map[this.position.x][this.position.y + increment] == null)
          this.moves.push(tempPosition);
      }
    //if (map[x + 1][y + 1] is enemy) allow x + 1, y + 1
    tempPosition = Position(this.position.x + increment,this.position.y + increment);
    if (helperObj.InBound(tempPosition))
    {
      this.scope.push(tempPosition);
      if (helperObj.map[this.position.x + increment][this.position.y + increment] != null)
        this.moves.push(tempPosition);
    }
    //if (map[x - 1][y + 1] is enemy) allow x - 1, y + 1
    tempPosition = Position(this.position.x - increment,this.position.y + increment);

    if (helperObj.InBound(tempPosition))
    {
      this.scope.push(tempPosition);
      if (helperObj.map[this.position.x - increment][this.position.y + increment] != null)
        this.moves.push(tempPosition);
    }

    tempPosition = Position(this.position.x-increment,this.position.y);
    if (helperObj.InBound(tempPosition)
        && helperObj.map[this.position.x-increment][this.position.y]?.firstMove !=undefined)
    if( helperObj.map[this.position.x-increment][this.position.y]?.EnPassantIsAvailable() ) // for en passant
    {
      this.moves.push(Position(this.position.x - increment, this.position.y +increment));
      this.canTakeEnPassant = helperObj.map[this.position.x-increment][this.position.y];
    }

    tempPosition = Position(this.position.x+increment,this.position.y);
    if (helperObj.InBound(tempPosition)
      && helperObj.map[this.position.x+increment][this.position.y]?.firstMove !=undefined)
    if( helperObj.map[this.position.x+increment][this.position.y]?.EnPassantIsAvailable()) // for en passant
    {
      this.moves.push(Position(this.position.x + increment, this.position.y +increment));
      this.canTakeEnPassant = helperObj.map[this.position.x+increment][this.position.y];
    }
    this.filterAvailables();
  };
}
pawn.prototype = Object.create(piece.prototype);
pawn.prototype.constructor = pawn;

//adding event listener on all squares on load
var squares = document.getElementsByTagName("rect");
for (var i = 0; i < squares.length; i++)
  squares[i].setAttribute("onclick", "handleClick(this)");

var startGame = document.getElementById("start-game");
startGame.addEventListener("click", setTimeToStartGame);

var resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", function (){
  helperObj.ResetGame();
});
var newGame = document.getElementById("newGame"); 
newGame.addEventListener("click",function(){
  location.reload();
});
var Resignbtn = document.getElementById("Resign"); 
Resignbtn.addEventListener("click",function(){
  if(!turn){
    showEndGameBox("black");
   
  }else 
    {
      showEndGameBox("white");
    }
gameOver = true;
})
helperObj.Initialize();
