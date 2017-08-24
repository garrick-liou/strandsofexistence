function BorderBar(game, player) {
	if (player % 2 == 1) {
		Phaser.Sprite.call(this, game, 25, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'borderBar');
	} else if (player % 2 == 0) {
		Phaser.Sprite.call(this, game, 578, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'borderBar');		
	}
} 

BorderBar.prototype = Object.create(Phaser.Sprite.prototype);
BorderBar.prototype.constructor = BorderBar;