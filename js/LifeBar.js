function LifeBar(game, player) {	
	this.player = player;
	if (player % 2 == 1) {
		Phaser.Sprite.call(this, game, 25, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'lifeBar');
	} else if (player % 2 == 0) {
		Phaser.Sprite.call(this, game, 578, 50 * Math.floor((player-1)/2) + 25, 'atlas', 'lifeBar');		
	}
}

LifeBar.prototype = Object.create(Phaser.Sprite.prototype);
LifeBar.prototype.constructor = LifeBar;

LifeBar.prototype.update = function() {
	if (this.player == 1) {
		if(player1.health >= 0) {
	   		this.scale.x = player1.health/50;
	   	} else {
	   		player1.health = 0;
   		}   	  
	}
	if (this.player == 2) {
		if(player2.health >= 0) {
	   		this.scale.x = player2.health/50;
	   	} else {
	   		player2.health = 0;
   		}   	  
	}
	if (this.player == 3) {
		if(player3.health >= 0) {
	   		this.scale.x = player3.health/50;
	   	} else {
	   		player3.health = 0;
   		}   	  
	}
	if (this.player == 4) {
		if(player4.health >= 0) {
	   		this.scale.x = player4.health/50;
	   	} else {
	   		player4.health = 0;
   		}   	  
	}
	if (this.player == 5) {
		if(player5.health >= 0) {
	   		this.scale.x = player5.health/50;
	   	} else {
	   		player5.health = 0;
   		}   	  
	}
	if (this.player == 6) {
		if(player6.health >= 0) {
	   		this.scale.x = player6.health/50;
	   	} else {
	   		player6.health = 0;
   		}   	  
	}
}