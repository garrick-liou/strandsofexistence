function ChangeBar(game, player, type) {
	this.player = player;
	if (type == 'gain') {
		if (player % 2 == 1) {
			Phaser.Sprite.call(this, game, 25 + 196, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'gainBar');
		} else if (player % 2 == 0) {
			Phaser.Sprite.call(this, game, 578 + 196, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'gainBar');		
		}		
		this.scale.x = 0;
	} else if (type == 'damage') {
		if (player % 2 == 1) {
			Phaser.Sprite.call(this, game, 25, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'damageBar');
		} else if (player % 2 == 0) {
			Phaser.Sprite.call(this, game, 578, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'damageBar');		
		}
		this.scale.x = 0;
	}
}

ChangeBar.prototype = Object.create(Phaser.Sprite.prototype);
ChangeBar.prototype.constructor = ChangeBar;

ChangeBar.prototype.update = function() {
	if (this.scale.x > 0) {
   		this.scale.x -= .003;
   	} else {
   		this.scale.x = 0;
   	}
}