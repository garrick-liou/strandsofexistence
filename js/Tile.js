function Tile(game, x, y, name, group){
    Phaser.Sprite.call(this, game, x, y, 'atlas', name);
    game.add.existing(this);
    group.add(this);
}
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

function Button(game, x, y, xCoord, yCoord, group, func){
    Phaser.Button.call(this, game, x, y, 'atlas', function(){func(xCoord, yCoord)}, window, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
    game.add.existing(this);
    group.add(this);
    this.kill();
    this.xCoord = xCoord;
    this.yCoord = yCoord;
}
Button.prototype = Object.create(Phaser.Button.prototype);
Button.prototype.constructor = Button;