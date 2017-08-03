function Player(game, key, frame, number){
	if (number == 1){		
		Phaser.Sprite.call(this, game, 53, 384, key, frame);
		console.log('player1 make');
	} else if (number == 2){
		Phaser.Sprite.call(this, game, 718, 384, key, frame);
		console.log('player2 make');
	}
	
	game.physics.enable(this);

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() { //set the movement to the right, then when R is pressed flip sprite and move left
	if(number == 1) {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W)){
      	if (player1.y > 289) {
      		player1.y -= 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.S)){
      	if (player1.y < 479) {
      		player1.y += 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.A)){
      	if (player1.x > 53) {
      		player1.x -= 130;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.D)){
      	if (player1.x < 313) {
      		player1.x += 130;
      	}
      }
    } else if (number == 2) {
    	if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
      	if (player2.y > 289) {
      		player2.y -= 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
      	if (player2.y < 479) {
      		player2.y += 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
      	if (player2.x > 458) {
      		player2.x -= 130;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
      	if (player2.x < 718) {
      		player2.x += 130;
      	}
      }
    }
      

}