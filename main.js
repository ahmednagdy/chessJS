function handleClick(position) {
  if (game.gameOver) return;
  console.log(position.id);
  var x = parseInt(position.id.split("-")[0]);
  var y = parseInt(position.id.split("-")[1]);
  var newSelection = helperObj.map[x][y]; 
  var Wpar = document.getElementsByClassName("timer")[1];
  var whiteOverBar = document.getElementsByClassName("timeout")[1];
  var wdiv = document.getElementsByClassName("white")[0];
  if (game.prevTurn == -1) {
    game.t2 = setInterval(function () {
      helperObj.changeProgressBar(whiteOverBar, game.step);
      game.timer2 -= 1000;
      Wpar.textContent = helperObj.toShow(game.timer2);
      if (game.timer2 <= 0) {
        clearInterval(game.t2);
        if (isNotEnoughPieces(1)) {
          //checks for black pieces if white time's up
          EndTheGame("Draw");
        } else {
          EndTheGame("black");
        }
      }
    }, 1000);

    clearInterval(game.t1);
    game.prevTurn = 900;
    Wpar.classList.add("running");
    wdiv.classList.add("borderTurn");
  }
  if (game.isSelected) {
    if (newSelection === game.selected) Deselect();
    else if (newSelection == null) {
      if (game.selected instanceof king && helperObj.includesPosition(game.selected.moves,Position(game.selected.position.x + 2, game.selected.position.y)) && x == game.selected.position.x + 2)
      {
        //the boss  wants to castle king side
        var color = game.selected.color;
        helperObj.moveTo(game.selected, x, y);
        game.castling =-1;
        //move the rook next to it
        game.selected = helperObj.map[8][color ? 8 : 1];
        helperObj.moveTo(helperObj.map[8][color ? 8 : 1], 6, color ? 8 : 1);
        game.castling=0;
        game.turn = !game.turn;
      }
      else if (game.selected instanceof king && helperObj.includesPosition(game.selected.moves,Position(game.selected.position.x - 2, game.selected.position.y)) &&
        x == game.selected.position.x - 2)
        {
        //the boss  wants to castle queen side
        var color = game.selected.color;
        helperObj.moveTo(game.selected, x, y);
        game.castling =-1;
        //move the rook next to it
        game.selected = helperObj.map[8][color ? 8 : 1];
        helperObj.moveTo(helperObj.map[1][color ? 8 : 1], 4, color ? 8 : 1);
        game.castling=0;
        game.turn = !game.turn;
      }
      else if (game.selected instanceof pawn && game.selected.canTakeEnPassant && (x==game.selected.position.x+1 ||x==game.selected.position.x-1)) //en passant case
      {
          helperObj.moveUI(game.selected.canTakeEnPassant,x,y); game.castling =-1;
          helperObj.map[x][y] = game.selected.canTakeEnPassant;
          helperObj.map[game.selected.canTakeEnPassant.position.x][game.selected.canTakeEnPassant.position.y] = null;

          helperObj.moveTo(game.selected,x,y); game.castling=0;
      }
      else if (helperObj.includesPosition(game.selected.moves, Position(x, y)))
      {
        helperObj.moveTo(game.selected,x,y);
      } 
      else Deselect();
    } else if (newSelection.color == game.turn) game.selected = newSelection;
    else {
      if (helperObj.includesPosition(game.selected.moves,Position(newSelection.position.x, newSelection.position.y))) 
      {
        //TAKE 
        helperObj.moveTo(game.selected, x, y);
      } 
      else Deselect();
    }
  } else {
    if (newSelection)
      if (newSelection.color == game.turn) {
        game.selected = newSelection;
        game.isSelected = true;
      }
  }

  if (game.selected) {
    if (game.selected instanceof king) {
      for (var i = 1; i <= 8; i++) {
        for (var j = 1; j <= 8; j++) {
          if (
            helperObj.map[i][j] != null &&
            helperObj.map[i][j].color != game.selected.color
          )
            helperObj.map[i][j].getAndFillAvailableMoves();
        }
      }
    }
    game.selected.getAndFillAvailableMoves();
  }

  //remove highlight by default
  if (game.oldStates[0])
    document.getElementById(game.oldStates[0]).classList.remove("highlightPiece");

  for (var i = 1; i < game.oldStates.length; i++) {
    document.getElementById(game.oldStates[i]).classList.remove("highlight"); //reset highlighted square
  }
  if (game.isSelected) {
    //highlight the piece and the moves
    var id = game.selected.position;
    id = id.x + "-" + id.y;
    document.getElementById(id).classList.toggle("highlightPiece");
    game.oldStates = [];
    game.oldStates.push(id);
    for (var i = 0; i < game.selected.moves.length; i++) {
      id = game.selected.moves[i];
      id = id.x + "-" + id.y;
      game.oldStates.push(id);
      document.getElementById(id).classList.add("highlight"); //the available square
    }
  }
}

var game =
{
checkedPosition:null,
turn:0,
selected:null,
isSelected:false,
oldStates:[],
checked:false,
gameOver:false,
timer1:300 * 1000,
timer2:300 * 1000,
step:1,
t1:null,
t2:null,
choosenTime:null,
prevTurn : -1,
turnCount : 0,
castling :0,
originalUI : document.getElementsByTagName("svg")[0].innerHTML
}

function Deselect() {
  game.selected = null;
  game.isSelected = false;
}

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
        if (helperObj.map[i][j].color == game.turn && helperObj.map[i][j].moves.length != 0) flag = true;
      }
  if (!flag) isCheckmate(game.turn ? "white" : "black");
  return null;
}
function isCheckmate(winner)
{
  game.gameOver = true;
  if (game.checked)
  {
    setTimeout(function () {
      EndTheGame(winner);
    }, 500); //declare win;
    return true;
  }
  else stalemate();
}

function EndTheGame(message)
{
  showEndGameBox(message);
  game.gameOver = true;
  clearInterval(game.t1);
  clearInterval(game.t2);
}

function stalemate() {
  //if all my pieces (including the king) availables = []
  EndTheGame("Draw by Stalemate");
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
    EndTheGame("Draw by Insufficient Material");
    return true;
  }
  var pieceCheck = allPieces[0] == 1 ? tmpBlackPiece : tmpWhitePiece;
  if (pieceCheck instanceof bishop || pieceCheck instanceof knight)
  {
    EndTheGame("Draw by Insufficient Material");
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
    this.moves = []; this.scope = [];
    var candidates = [[2,   1],[1,   2],[- 1,   2],[- 2,   1],[2,  - 1],[1,  - 2],[- 1,  - 2],[- 2,  - 1]];
    for (var i = 0; i < candidates.length; i++)
      if (helperObj.InBound(Position(this.position.x + candidates[i][0],this.position.y + candidates[i][1])))
      this.moves.push(Position(this.position.x + candidates[i][0], this.position.y + candidates[i][1]));
    this.scope = this.scope.concat(this.moves);
    this.filterAvailables();
  };
}
knight.prototype = Object.create(piece.prototype);
knight.prototype.constructor = knight;

function pinner(_x,_y,c)
{
  piece.call(this, _x, _y, c);
}
pinner.prototype = Object.create(piece.prototype);
pinner.prototype.constructor = pinner;
function queen(_x, _y, c)
{
  pinner.call(this, _x, _y, c);
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
queen.prototype = Object.create(pinner.prototype);
queen.prototype.constructor = queen;
function rook(_x, _y, c)
{
  this.hasMoved = false;
  pinner.call(this, _x, _y, c);
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

rook.prototype = Object.create(pinner.prototype);
rook.prototype.constructor = rook;
function bishop(_x, _y, c)
{
  pinner.call(this, _x, _y, c);
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
bishop.prototype = Object.create(pinner.prototype);
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
    //adding castling capabililty
    if (!game.checked)
    {
      if (!this.hasMoved && helperObj.map[8][game.turn ? 8 : 1] && !helperObj.map[8][game.turn ? 8 : 1].hasMoved)
        if (getLineOfSquaresToFirstElement(this, 1, 0).length == 3)
          if (helperObj.includesPosition(this.moves,Position(this.position.x + 1, this.position.y)))
            this.moves.push(Position(this.position.x + 2, this.position.y));

      if (!this.hasMoved && helperObj.map[1][game.turn ? 8 : 1] && !helperObj.map[1][game.turn ? 8 : 1].hasMoved)
        if (getLineOfSquaresToFirstElement(this, -1, 0).length == 4)
          if (helperObj.includesPosition(this.moves,Position(this.position.x - 1, this.position.y)))
            this.moves.push(Position(this.position.x - 2, this.position.y));
      this.removeEnemyIntersection();
    }
  };

  this.removeEnemyIntersection = function ()
  {
    game.checked = false;
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
              game.checked = true; //Then the king is in CHECK!
              helperObj.getSquareByPosition(this.position.x,this.position.y).classList.add("check");
              game.checkedPosition = this.position;
              if (piece instanceof pinner) 
              {
                //remove its long scope beyond the king
                var directions = helperObj.GetDirections(this,piece); //to the king
                this.moves = helperObj.difference(this.moves,[Position(this.position.x+directions[0], this.position.y+directions[1])]);
              }
            }
          }
        }
      }
    if (!game.checked && game.checkedPosition)
      document.getElementById(game.checkedPosition.x + "-" + game.checkedPosition.y).classList.remove("check");
  };
}

king.prototype = Object.create(piece.prototype);
king.prototype.constructor = king;

function pawn(_x, _y, c)
{
  piece.call(this, _x, _y, c);
  this.canTakeEnPassant = null;
  var increment = c == 0 ? 1 : -1;
  this.firstMove = true;
  this.EnPassantIsAvailable = function () { return game.turnCount == canBeTakenEnPassant; };
  var canBeTakenEnPassant = -1;
  this.passPositionForEnPassant = function (x, y)
  {
    if (x == _x && y == _y + 2 * increment) { canBeTakenEnPassant = game.turnCount+1; }
  };
  this.getAndFillAvailableMoves = function ()
  {
    this.moves = [];
    this.scope = []; 
    this.canTakeEnPassant = null;
  
    //normal: y + 1 //handle straight can't take (if x, y+1) not null don't push
    var tempPosition = Position(this.position.x, this.position.y + increment);

    if (helperObj.map[this.position.x][this.position.y + increment] == null &&
      helperObj.InBound(tempPosition))
      this.moves.push(tempPosition);

    //if (firstMove) allow y + 2; instanceof pawn //same above increment condition
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
      if (helperObj.map[this.position.x + increment][this.position.y + increment])
        this.moves.push(tempPosition);
    }
    //if (map[x - 1][y + 1] is enemy) allow x - 1, y + 1
    tempPosition = Position(this.position.x - increment,this.position.y + increment);

    if (helperObj.InBound(tempPosition))
    {
      this.scope.push(tempPosition);
      if (helperObj.map[this.position.x - increment][this.position.y + increment])
        this.moves.push(tempPosition);
    }

    tempPosition = Position(this.position.x-increment,this.position.y);
    if (helperObj.InBound(tempPosition)
        && helperObj.map[this.position.x-increment][this.position.y] instanceof pawn)
    if( helperObj.map[this.position.x-increment][this.position.y]?.EnPassantIsAvailable() ) // for en passant
    {
      this.moves.push(Position(this.position.x - increment, this.position.y +increment));
      this.canTakeEnPassant = helperObj.map[this.position.x-increment][this.position.y];
    }

    tempPosition = Position(this.position.x+increment,this.position.y);
    if (helperObj.InBound(tempPosition)
      && helperObj.map[this.position.x+increment][this.position.y] instanceof pawn)
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
resetBtn.addEventListener("click", function ()
{
  helperObj.ResetGame();
});
var newGame = document.getElementById("newGame");
newGame.addEventListener("click",function()
{
  location.reload();
});
var Resignbtn = document.getElementById("Resign");
Resignbtn.addEventListener("click",function()
{
  if(!game.turn) 
      EndTheGame("black");
  else
      EndTheGame("white");
})

helperObj.Initialize();
