function Player(game, grid, spriteKey){
      //should use xcoord and ycoord as arguments instead...
      var yCoord = Math.floor(grid.squares.length / 2);
	if (grid.number == 1){
            var xCoord = 0;
            Phaser.Sprite.call(this, game, 53, 384, 'atlas', spriteKey + '01');

            this.inputEnabled = true;
	} else {
            var xCoord = grid.squares[yCoord].length - 1;
            Phaser.Sprite.call(this, game, 718, 384, 'atlas', spriteKey + '01');
            
            this.inputEnabled = false;
      }
      
      this.grid = grid;
      this.square = grid.squares[yCoord][xCoord];
      this.square.occupant = this;

      this.grid.players.push(this);
      
      game.physics.enable(this);
      game.add.existing(this);
      this.health = 5;
      
      //add characters and add character animations
      //the floating characters are at the center of their squares
      this.animations.add('float', Phaser.Animation.generateFrameNames(spriteKey, 1, 12, '', 2), 20, true);
      this.animations.play('float');

      playerGroup.add(this);

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;