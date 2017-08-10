function Player(game, number){
      //the information about the y position is consistent between players
      this.maxy = 479;
      this.miny = 289;
      this.yCoord = 2;
	if (number == 1){
            this.keys = {u:Phaser.Keyboard.W, l:Phaser.Keyboard.A, d:Phaser.Keyboard.S, r:Phaser.Keyboard.D};
            this.maxx = 313;
            this.minx = 53;
            this.xCoord = 1;
		Phaser.Sprite.call(this, game, 53, 384, 'atlas', 'Player1_01');
	} else {
            number = 2;
            this.keys = {u:Phaser.Keyboard.UP, l:Phaser.Keyboard.LEFT, d:Phaser.Keyboard.DOWN, r:Phaser.Keyboard.RIGHT};
            this.maxx = 718;
            this.minx = 458;
            this.xCoord = 6;
		Phaser.Sprite.call(this, game, 718, 384, 'atlas', 'Player2_01');
	}
      //store number still in case we find out that we need it stored for something
      this.number = number;
      
      game.physics.enable(this);
      game.add.existing(this);
      this.health = 5;
      
      //add characters and add character animations
      //the floating characters are at the center of their squares
      this.animations.add('float', Phaser.Animation.generateFrameNames('Player'+number+'_', 1, 12, '', 2), 20, true);
      this.animations.play('float');

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() { //set the movement to the right, then when R is pressed flip sprite and move left
      if(game.input.keyboard.justPressed(this.keys.u) && this.y > this.miny){
            this.y -= 95;
            this.yCoord -= 1;
      }
      if(game.input.keyboard.justPressed(this.keys.d) && this.y < this.maxy){
            this.y += 95;
            this.yCoord += 1;
      }
      if(game.input.keyboard.justPressed(this.keys.l) && this.x > this.minx){
            this.x -= 130;
            this.xCoord -= 1;
      }
      if(game.input.keyboard.justPressed(this.keys.r) && this.x < this.maxx){
            this.x += 130;
            this.xCoord += 1;
      }
}