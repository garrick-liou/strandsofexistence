function Player(game, key, frame, number){
	if (number == 1){		
		Phaser.Sprite.call(this, game, 53, 384, key, frame);
		console.log('this make');
	} else if (number == 2){
		Phaser.Sprite.call(this, game, 718, 384, key, frame);
		console.log('this make');
	}
	this.number = number;
	game.physics.enable(this);

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() { //set the movement to the right, then when R is pressed flip sprite and move left
	if(this.number == 1) {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W)){
      	if (this.y > 289) {
      		this.y -= 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.S)){
      	if (this.y < 479) {
      		this.y += 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.A)){
      	if (this.x > 53) {
      		this.x -= 130;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.D)){
      	if (this.x < 313) {
      		this.x += 130;
      	}
      }
    } else if (this.number == 2) {
    	if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
      	if (this.y > 289) {
      		this.y -= 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
      	if (this.y < 479) {
      		this.y += 95;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
      	if (this.x > 458) {
      		this.x -= 130;
      	}
      }
      if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
      	if (this.x < 718) {
      		this.x += 130;
      	}
      }
    }
    //coordinate tracker here
}