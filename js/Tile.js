function Tile(game, x, y) {
	if (x == 1) {
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn1');
	} else if (x == 2) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn2');
	} else if (x == 3) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn3');
	} else if (x == 4) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn4');
	} else if (x == 5) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn5');
	} else if (x == 6) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn6');
	} else if (x == 7) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn7');
	} else if (x == 8) {		
		Phaser.Sprite.call(this, game, 90 * x - 55, 120 + 75 * y, 'atlas', 'TileColumn8');
	}
} 

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;