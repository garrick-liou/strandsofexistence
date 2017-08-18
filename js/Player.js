function Player(game, key, frame, number){
	if (number == 1){		
		Phaser.Sprite.call(this, game, 53, 384, key, frame);
	} else if (number == 2){
		Phaser.Sprite.call(this, game, 718, 384, key, frame);
	} else if (number == 3) {
            Phaser.Sprite.call(this, game, 53, 289, key, frame);
      } else if (number == 4){
            Phaser.Sprite.call(this, game, 718, 289, key, frame);
      } else if (number == 5) {
            Phaser.Sprite.call(this, game, 53, 479, key, frame);       
      } else if (number == 6){
            Phaser.Sprite.call(this, game, 718, 479, key, frame);
      }
	this.number = number;
      this.health = 50;
      this.memoryX = 0;
      this.memoryY = 0;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() { //set the movement to the right, then when R is pressed flip sprite and move left
      if (this.x == 53) {
            this.xCoord = 1;
      } else if (this.x == 183) {
            this.xCoord = 2;
      } else if (this.x == 313) {
            this.xCoord = 3;
      } else if (this.x == 458) {
            this.xCoord = 4;
      } else if (this.x == 588) {
            this.xCoord = 5;
       } else if (this.x == 718) {
       this.xCoord = 6;
         }
      if (this.y == 289) {
            this.yCoord = 1;
      } else if (this.y == 384) {
            this.yCoord = 2;
      } else if (this.y == 479) {
            this.yCoord = 3;
      }
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
}