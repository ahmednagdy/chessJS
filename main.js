//Link with UI --> each square will have 
//id = 1,1 -> 8,8 and onclick=handleClick(this.id)
function handleClick(position) 
{
    //fill += king?
    //check position in map to get its state
    /////flag selected
    //select or deselect
}

//To be initialized with piece ids from both sides (e.g. int from 0 to 5) 0 1 2
//Will only get updated when there is a TAKE action
//Will be used to check the draw case of insufficient material
var W = { RemainingArrayOfPieces:[] } //timer later
var B = { RemainingArrayOfPieces:[] } //---note : reference (one obj to be updated one time)

var helperObj =
{
    //map[1][3] = 
    //map:[[obj1,obj2,null,new new],[],[],[],[],[],[],[]], //to be initialized with piece objs with initial positions
    moveToMap_and_ui: function(piece, x, y) 
    {
        //Will only get called in the handleClick method if selection is active (a piece selected in my turn)
        //Will actually MOVE the piece in the map 
        //Will check target square (in the map) for two cases
        //-- if empty then just move else TAKE! (move and remove the piece on that square (map & UI))
        //update the piece's position attribute
        //Then call all map's pieces fillAvailableMoves() to update them ...... xxxx
        //Then checkCHECK() after movement! then toggle turn.
        ///at last moveUI() and the UI
        /////////// or update on click
    },
    //three functions prototypes --implement removeFriendIntersection()
    intersection:function(arr1,arr2) { var arr = arr1.filter((x) => (arr2.indexOf(x) != -1)); return arr; },
    difference  :function(arr1,arr2) { var arr = arr1.filter((x) => arr2.indexOf(x) == -1); return arr; },
    InBound: function (position) { return !((position.x > 8 || position.x < 1) || (position.y > 8 || position.y < 1)) }
}

function Position(_x,_y) //factory for position
{
    var p = {x:_x, y:_y};
    return p;
}

function piece(_x,_y,c) //We will pass the initial position here
{
    this.position = Position(_x,_y);
    this.color = c;
    this.moves = []; //array of position objs

    this.getAndFillAvailableMoves = function() {}; //abstract
    this.filterAvailables = function()
    {
        helperObj.removeFriendIntersection(this); //to be implemented -- will be called in all pieces
        //helperObj.checkPinning(this); //Am I pinned?
        //helperObj.checkCHECK(this); //Is "MY" king in danger?
    }
}

//All coming pieces will inherit (those two lines of code) the above structure
//only the king will not call the filter function inside him because he can't be pinned
//and apply constructor chaining

function knight(_x, _y, c)
{
    //Constructor chain using call to initialize my vars and the same for the rest

    //two initial positions for white and two for black ...
    //you can get all pieces available positions from the board
    //--by counting from 1-8 from the bottom left corner as 1,1

    this.getAndFillAvailableMoves()
    {
        /* 
        push these exact values into moves array as position objs starting from x,y of mine
        x + 2 y + 1
        x + 1 y + 2
        x - 1 y + 2
        x - 2 y + 1

        x + 2 y - 1
        x + 1 y - 2
        x - 1 y - 2
        x - 2 y - 1
        */

        //if (x or y > 8) don't push (obviously)

        this.filterAvailables(); //this will be called as it is (no overriding here)
    }

    //Calling the fill function
    this.getAndFillAvailableMoves();
}

function queen(_x, _y, c)
{
    this.getAndFillAvailableMoves() = function()
    {
        //8 directions
        //(++x)(--x)(++y)(--y)(+x + y)(-x - y)(+x - y)(-x + y) at every step

        //Will get done using "getLineOfSquaresToFirstElement()" method
        //to be implemented ...
        moves = getLineOfSquaresToFirstElement(this.position,111); // 1,2,3,4,5,6,7,8 

        this.filterAvailables();
    }
}
function rook(_x, _y, c)
{
    this.getAndFillAvailableMoves() = function()
    {
        //SAME as Q but only 4 ++x --x ++y --y
        //using the method in a different way or multiple times .. we will see 
    }
}
function bishop(_x, _y, c)
{
    this.getAndFillAvailableMoves() = function()
    {
        //SAME but only 4 +x+y  +x-y  -x+y  -x-y
    }
}
//could think of a pinner class to implement those 3 pieces ...

function king(_x, _y, c)
{
    piece.call(this,_x,_y,c);
    this.getAndFillAvailableMoves = function()
    {
        for (var i = -1, j = 0; i <= 1 && j <= 1; i+=2)
        {
            //gets  x- x+ y- y+
            var p = Position(this.position.x + (j != 1 ? i : 0), this.position.y + (j == 1 ? i : 0));
            if (i == 1 && j == 0)  { i = -3; j = 1; }
            if (helperObj.InBound(p)) this.moves.push(p); 
        }
        for (var j = 1; j <= 4; j++) 
        {
            //gets  x-y- x+y+  x+y-  x-y+
            var p = Position(this.position.x + (j == 1 ? 1 : (j == 2 ? -1 : (j == 3 ? -1 : 1))), this.position.y + (j == 1 ? 1 : (j == 2 ? -1 : (j == 3 ? 1 : -1))));
            if (helperObj.InBound(p)) this.moves.push(p);
        }
        
       //this.removeFriendIntersection(); //essential call
       //this.removeEnemyIntersection(); //awaiting map initialization
    }
    this.removeEnemyIntersection = function()
    {
        for (var i = 1; i<= 8; i++)
        {
            for (var j = 1; j<= 8; j++)
            {
                if(helperObj.map[i][j].color != this.color) //then enemey piece
                {
                    var enemy = helperObj.map[i][j];
                    this.moves = difference(this.moves,enemy.moves);
                    if(enemy.moves.includes(this.position)) checked = true; //Then the king is in CHECK!
                }
            }
        }
    }
}

king.prototype = Object.create(piece.prototype);
king.prototype.constructor = king;

function pawn(_x, _y, c)
{
    this.firstMove = true;
    this.getAndFillAvailableMoves = function()
    {
        //normal: y + 1 //handle straight can't take (if x, y+1) not null don't push
        //if (firstMove) allow y + 2; firstMove = false; //same above condition
        //if (map[x + 1][y + 1] is enemy) allow x + 1, y + 1
        //if (map[x - 1][y + 1] is enemy) allow x - 1, y + 1

        //implement promotion in move method ..... (if pawn & y = 8 -> queen) --level 2
        this.filterAvailables();
    }
}

//adding event listener on all squares on load
 var squares = document.getElementsByTagName("rect");
 for (var i = 0; i < squares.length; i++)
    squares[i].setAttribute("onclick","handleClick(this)");
