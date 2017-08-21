function Player(game, grid, spriteKey){
      //should use xcoord and ycoord as arguments instead...
      Phaser.Sprite.call(this, game, 0, 0, 'atlas', spriteKey + '01');
      this.grid = grid;

      let yCoord = Math.floor(grid.squares.length / 2);
	if (grid.number == 1){
            this.square = grid.squares[yCoord][0];
	} else {
            let xCoord = grid.squares[yCoord].length - 1;
            this.square = grid.squares[yCoord][xCoord];
      }

      this.square.occupant = this;
      this.x = this.square.x + 48;
      this.y = this.square.y - 16;
      
      game.physics.enable(this);
      game.add.existing(this);
      this.grid.players.add(this)
      this.health = 5;
      
      //add characters and add character animations
      //the floating characters are at the center of their squares
      this.animations.add('float', Phaser.Animation.generateFrameNames(spriteKey, 1, 12, '', 2), 20, true);
      this.animations.play('float');

      this.events.onInputDown.add(playerClick, this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;