var helperObj =
{
  map: ([] = [[], [], [], [], [], [], [], [], []]),
  justHappenedMove: {oldX: 0,oldY: 0,newX: 0,newY: 0,},
  getSquareByPosition: function (x, y)
  {
    return document.getElementById(x+"-"+y);
  },
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
    for (var i = 0; i <= 8; i++) 
      for (var j = 0; j <= 8; j++) 
        this.map[i][j] = null;

    this.fillInitialize(1, 2, 0);
    this.fillInitialize(8, 7, 1);
    for (var i = 1; i <= 8; i++) 
      for (var j = 1; j <= 8; j++) 
        if (helperObj.map[i][j])
          helperObj.map[i][j].getAndFillAvailableMoves();  
    
  },
  ResetGame: function () {
    this.Initialize();
    document.getElementsByTagName("svg")[0].innerHTML=game.originalUI;
    var squares = document.getElementsByTagName("rect");
    for (var i = 0; i < squares.length; i++)
         squares[i].setAttribute("onclick", "handleClick(this)");
    game.turn = 0;

    var timers = document.getElementsByClassName("timer");
    clearInterval(game.t1);
    clearInterval(game.t2)
    timers[0].textContent = timers[1].textContent = this.toShow(game.choosenTime);
    var blackOverBar = document.getElementsByClassName("timeout")[0];
    var whiteOverBar = document.getElementsByClassName("timeout")[1];
    blackOverBar.style.width = whiteOverBar.style.width = "0px";
    game.prevTurn = -1;
    game.timer1 = game.choosenTime;
    game.timer2 = game.choosenTime;

    var wdiv = document.getElementsByClassName("white")[0];
    var Wpar = document.getElementsByClassName("timer")[1];
    var Bdiv = document.getElementsByClassName("black")[0];
    var Bpar = document.getElementsByClassName("timer")[0];
    Wpar.classList.remove("running");
    wdiv.classList.remove("borderTurn");
    Bpar.classList.remove("running");
    Bdiv.classList.remove("borderTurn");

    game.gameOver = false;

  },

  fillInitialize: function (_y1, _y2, c)
   {
    for (var i = 1; i <= 8; i++) this.map[i][_y2] = new pawn(i, _y2, c);

    this.map[1][_y1] = new rook(1, _y1, c);    this.map[8][_y1] = new rook(8, _y1, c);
    this.map[2][_y1] = new knight(2, _y1, c);  this.map[7][_y1] = new knight(7, _y1, c);
    this.map[3][_y1] = new bishop(3, _y1, c);  this.map[6][_y1] = new bishop(6, _y1, c);
    this.map[4][_y1] = new queen(4, _y1, c);
    this.map[5][_y1] = new king(5, _y1, c);
  },
  moveTo: function(piece,x,y)
  {
    helperObj.moveUI(piece,x,y);
    helperObj.moveMap(x,y);
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
    if(game.castling==0)
    {if (!game.turn || game.prevTurn == 900)
      {
        game.t1 = setInterval(function () {
          helperObj.changeProgressBar(blackOverBar, game.step);
          game.timer1 -= 1000;
          Bpar.textContent = helperObj.toShow(game.timer1);
          if (game.timer1 <= 0) {
            clearInterval(game.t1);
            if (isNotEnoughPieces(0)) {
              //checks for black pieces if white time's up
              EndTheGame("Draw");
            } else {
              EndTheGame("white");
            }
          }
        }, 1000);
  
        clearInterval(game.t2);
        game.prevTurn = 50;
        Bpar.classList.toggle("running");
        Wpar.classList.toggle("running");
        wdiv.classList.toggle("borderTurn");
        Bdiv.classList.toggle("borderTurn");
      } else {
        
        game.t2 = setInterval(function () {
          helperObj.changeProgressBar(whiteOverBar, game.step);
          game.timer2 -= 1000;
          Wpar.textContent = helperObj.toShow(game.timer2);
          if (game.timer2 <= 0) {
            clearInterval(game.t2);
            if (isNotEnoughPieces(0)) {
              //checks for black pieces if white time's up
              EndTheGame("Draw");
            } else {
              EndTheGame("black");
            }
          }
        }, 1000);
        Wpar.classList.toggle("running");
        Bpar.classList.toggle("running");
        wdiv.classList.toggle("borderTurn");
        Bdiv.classList.toggle("borderTurn");
        clearInterval(game.t1);
      }

    }
    
  },
  handleTimers :function(intrvl1,intrvl2,timer)
  {

  },
  moveMap: function(x, y) {
    var tX = game.selected.position.x;
    tY = game.selected.position.y;
    helperObj.map[tX][tY] = null;
  
    if (game.selected instanceof pawn)
    {
      if (game.selected.firstMove)
      {
        game.selected.firstMove = false;
        game.selected.passPositionForEnPassant(x,y);
      }
    } // for handling the first move of pawns
  
    if (game.selected instanceof pawn && (y == 8 || y == 1)) {
      var anyQueen;
      if (game.selected.color == 0)
        anyQueen = document.getElementById("whiteQueen");
      else
        anyQueen = document.getElementById("blackQueen");
  
  
      var tPawn = helperObj.getPieceByPosition(x, 9 - y);
  
      tPawn.innerHTML = anyQueen.innerHTML;
      game.selected = new queen(tX, tY, game.selected.color);
    }
    //Updating first move for king and rook
    if (game.selected.hasMoved == false) game.selected.hasMoved = true;
  
    helperObj.map[x][y] = game.selected;
    helperObj.map[x][y].position = Position(x, y);
  
    //updating availables turn's pieces to check for !turn king safety
    //not only the moved piece because it could be a discovered check
    for (var i = 1; i <= 8; i++) {
      for (var j = 1; j <= 8; j++) {
        if (helperObj.map[i][j] && helperObj.map[i][j].color==game.turn)
          helperObj.map[i][j].getAndFillAvailableMoves();
      }
    }
    helperObj.GetKing(!game.turn).getAndFillAvailableMoves();
  
    Deselect();
    game.turnCount++;
    game.turn = !game.turn;
    whichCannotMove();
    isNotEnoughPieces();
  },

  removeFriendIntersection: function (piece) {
    var arr = piece.moves;
    for (var i = 0; i < arr.length; i++) {
      if (this.map[arr[i].x][arr[i].y]) {
        if (this.map[arr[i].x][arr[i].y].color == piece.color) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
  },
  isKingInCheck: function (piece) {
    if (game.checked) {
      //if the king in check => filter my available moves
      for (var i = 1; i <= 8; i++)
        for (var j = 1; j <= 8; j++)
          if (helperObj.map[i][j])
            if (helperObj.map[i][j].color != piece.color) {
              //enemy
              var enemy = helperObj.map[i][j];
              var king = this.GetKing(piece.color);
              if (helperObj.includesPosition(enemy.scope, king.position)) {
                //then enemy is a checker
                if (enemy instanceof pinner) {
                  //if pinner then could block or take
                  var directionToTheKing = helperObj.GetDirections(king,enemy);
                  var line = getLineOfSquaresToFirstElement(enemy, directionToTheKing[0],directionToTheKing[1]);
                  var oldmoves = piece.moves;
                  piece.moves = helperObj.intersection(piece.moves, [enemy.position]);
                  piece.moves = piece.moves.concat(helperObj.intersection(oldmoves, line));
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
        if (helperObj.map[i][j]) {
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
  includesPosition: function (arr,pos)
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
  checkPinning: function(piece)
  {
    for (var i = 1; i <= 8; i++)
      for (var j = 1; j <= 8; j++)
      {
        var enemy = helperObj.map[i][j];
        if(enemy && enemy instanceof pinner && enemy.color != piece.color) //then enemy pinner
          if(this.includesPosition(enemy.scope, piece.position))
          {
            //then the first condition is fulfilled => check the line with the king
            var myking = this.GetKing(piece.color);
            var directions = this.GetDirections(piece, enemy); //direction from pinner to me
            var lineToKing = getLineOfSquaresToFirstElement(piece, directions[0], directions[1]);
            if(lineToKing[lineToKing.length-1]?.x == myking.position.x && lineToKing[lineToKing.length-1].y == myking.position.y) //if the last item it got is my king then I am pinned
            {
              var linePieceToEnemy = getLineOfSquaresToFirstElement(piece, directions[0]*-1, directions[1]*-1);
              piece.moves = this.intersection(piece.moves, lineToKing.concat(linePieceToEnemy));
            }
          }
      }
  }
};