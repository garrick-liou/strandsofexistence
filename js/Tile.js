function Grid(game, x, y, width, height, tileWidth, tileHeight, playerNumber){
    Phaser.Group.call(this, game);

    this.number = playerNumber;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    //includes padding on the final tile -- the width of the whole grid
    this.width = width*tileWidth*1.1;
    this.height = height*tileHeight*1.1;

    //offset of the grid (which is a phaser group as well, so it changes the x/y of its children, the tiles, automatically)
    this.x = x;
    this.y = y;

    this.players = [];

    this.squares = [];
    for(var i = 0; i < height; i++){
        this.squares.push([]);
        for(var j = 0; j < width; j++){
            this.squares[i].push(new Square(this, game,
                 j, j*tileWidth*1.1, // padding between tiles equal to 10% of their width/height
                 i, i*tileHeight*1.1));
        }
    }
}
Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;
Grid.prototype.relocate = function(x, y){
    this.x = x;
    this.y = y;
    for(var i in this.squares){
        for(var j in this.squares[i]){
            this.squares[i][j].relocate(x,  y);
        }
    }
}

function Square(grid, game, xIndex, x, yIndex, y){
    this.parent = grid;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.x = x;
    this.y = y;

    this.occupant = null;

    var num = (xIndex+1);
    if(grid.number == 2) num += 3;
    this.tile = new Tile(this, game, grid, 'TileColumn'+num);
    this.button = new Button(this, game);
}
Square.prototype = Object.create(Object.prototype);
Square.prototype.constructor = Square;
Square.prototype.relocate = function(x, y){
    //since button isn't a child of the group... sucks, but can't do anything about it, cuz you can't add something to two groups
    //and we need the buttons in a group in order to kill them.
    //... unless... unless we can add a group to a group. Do'oh. Well, can't do it super easily because somewhere in the damage tile
    //thing I made them align themselves to buttons... so we'll have to also add the damage tile group to the grid group and stuff...........
    this.button.x = x + this.x;
    this.button.y = y + this.y;
}


function Tile(parent, game, group, name){
    Phaser.Sprite.call(this, game, parent.x, parent.y, 'atlas', name);
    game.add.existing(this);
    group.add(this);
}
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;


function Button(parent, game){
    Phaser.Button.call(this, game, parent.x + parent.parent.x, parent.y + parent.parent.y, 'atlas', function(){buttonClick(parent)}, parent, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
    game.add.existing(this);
    buttonGroup.add(this);
    this.kill();
}
Button.prototype = Object.create(Phaser.Button.prototype);
Button.prototype.constructor = Button;