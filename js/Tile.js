function Grid(game, x, y, width, height, tileWidth, tileHeight, playerNumber){
    Phaser.Group.call(this, game);

    this.number = playerNumber;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    //includes padding on the final tile
    this.width = width*tileWidth*1.1;
    this.height = height*tileHeight*1.1;
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
    this.button.x = x + this.x;//since button isn't a child of the group
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