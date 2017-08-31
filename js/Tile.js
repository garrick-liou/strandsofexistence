function Grid(x, y, width, height, tileWidth, tileHeight, playerNumber){
    Phaser.Group.call(this, game);

    this.number = playerNumber;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.buttonG = game.add.group();
    this.damageG = game.add.group();
    this.players = game.add.group();

    //includes padding on the final tile -- the width of the whole grid
    this.width = width*tileWidth*1.1;
    this.height = height*tileHeight*1.1;

    //offset of the grid (which is a phaser group as well, so it changes the x/y of its children automatically)
    //children include players (characters?), ground tiles, buttons, and damage tiles
    this.x = x;
    this.y = y;

    this.squares = [];
    for(var i = 0; i < height; i++){
        this.squares.push([]);
        for(var j = 0; j < width; j++){
            this.squares[i].push(new Square(this,
                 j, j*tileWidth*1.1, // padding between tiles equal to 10% of their width/height
                 i, i*tileHeight*1.1));
        }
    }

    //temporary solution to not having properly-sized tile sprites
    let xFactor = tileWidth*1.1/130;
    let yFactor = tileHeight*1.1/95;
    let fn = function(o){
        o.scale.x = xFactor;
        o.scale.y = yFactor;
    }
    for(let i of this.squares){
        for(let j of i){
            fn(j.tile);
            fn(j.button);
        }
    }
    
    this.add(this.buttonG);
    this.add(this.damageG);
    this.add(this.players);
}
Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;
Grid.prototype.relocate = function(x, y){
    this.x = x;
    this.y = y;
}
Grid.prototype.findDeaths = function(){
    var numDeaths = 0;
    this.players.forEachAlive(function(p){
        //find how many players are dead but haven't been killed yet, and deal with that
        if(p.health <= 0) {
            bell1.play('', 0.65, 0.3, false);
            numDeaths++;
            p.square.occupant = null;
            p.emitter.destroy();
            p.icon.tint = 0x666666;
            p.kill();
        }
    });
    if(numDeaths > 0) {
        this.players.forEachAlive(function(p){
            //add up to 10 hp for each allied player that died
            if(!p.lifeGainEmitter) {
                p.lifeGainEmitter = game.add.emitter(p.x + p.width/2, p.y + p.height*0.9, 100)
                p.grid.add(p.lifeGainEmitter);
                p.lifeGainEmitter.makeParticles('atlas', 'particle');
                p.lifeGainEmitter.forEach(function(particle){
                    particle.tint = 0x1ACF30;
                });

                p.lifeGainEmitter.area = new Phaser.Rectangle(p.x, p.y, p.square.tile.width/3, 1);
                p.lifeGainEmitter.gravity = new Phaser.Point(0, 50);
                p.lifeGainEmitter.setXSpeed(0,0);
                p.lifeGainEmitter.setYSpeed(-200,-150);
            } else {
                p.lifeGainEmitter.x = p.x + p.width/2;
                p.lifeGainEmitter.y = p.y + p.height * 0.9;
            }
            
            game.time.events.add(250, function(){p.lifeGainEmitter.flow(400, 100, 3, 20);});
            
            p.alterHealth(10*numDeaths, 0);
        });
    }
}


function Square(grid, xIndex, x, yIndex, y){
    this.parent = grid;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.x = x;
    this.y = y;

    this.occupant = null;

    //var num = (xIndex+1);
    var num = 1 + 2 * ((xIndex + yIndex) % 2)
    if(grid.number == 2) num += 3;
    this.tile = new Tile(this, 'TileColumn'+num);
    this.button = new Button(this);
}
Square.prototype = Object.create(Object.prototype);
Square.prototype.constructor = Square;


function Tile(parent, name){
    Phaser.Sprite.call(this, game, parent.x, parent.y, 'atlas', name);
    game.add.existing(this);
    parent.parent.add(this);
}
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;


function Button(parent){
    Phaser.Button.call(this, game, parent.x, parent.y, 'atlas', function(){buttonClick(parent)}, parent, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
    game.add.existing(this);
    parent.parent.buttonG.add(this);
    this.kill();
}
Button.prototype = Object.create(Phaser.Button.prototype);
Button.prototype.constructor = Button;