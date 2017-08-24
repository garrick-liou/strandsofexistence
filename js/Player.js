var coords = [
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
      [0, 4],
      [2, 4]
]

function LifeBarContainer(parent, x, y){
      this.parent = parent;
      this.x = x;
      this.y = y;

      this.oldHealth = 50;
      
      this.life = game.add.sprite(x, y, 'atlas', 'lifeBar');
      this.damage = game.add.sprite(x, y, 'atlas', 'damageBar');
      this.gain = game.add.sprite(x, y, 'atlas', 'gainBar');
      this.border = game.add.sprite(x, y, 'atlas', 'borderBar');

      /*damageBarGroup.add(this.damage);
      gainBarGroup.add(this.gain);
      borderBarGroup.add(this.border);*/

      this.gain.scale.x = 0;
      this.damage.scale.x = 0;
      this.gain.anchor.setTo(1, 0);
}
LifeBarContainer.prototype.update = function(){
      this.life.scale.x = this.parent.health/50;
      if(this.oldHealth > this.parent.health + 0.1){
            this.oldHealth -= 0.1;
            this.damage.x = this.x + this.parent.health*196/50;
            this.damage.scale.x = (this.oldHealth - this.parent.health)/50;
      } else if(this.oldHealth < this.parent.health - 0.1){
            this.oldHealth += 0.1;
            this.gain.x = this.x + this.parent.health*196/50;
            this.gain.scale.x = (this.parent.health - this.oldHealth)/50;
      } else {
            this.oldHealth = this.parent.health;
            this.gain.scale.x = 0;
            this.damage.scale.x = 0;
      }
}

function Player(grid, pNum){
      //should use xcoord and ycoord as arguments instead...
      Phaser.Sprite.call(this, game, 0, 0, 'atlas', 'Player' + pNum + '_01');
      this.grid = grid;

      /*let yCoord = Math.floor(grid.squares.length / 2);
	if (grid.number == 1){
            this.square = grid.squares[yCoord][0];
	} else {
            let xCoord = grid.squares[yCoord].length - 1;
            this.square = grid.squares[yCoord][xCoord];
      }*/
      let myC = coords[pNum-1];
      this.square = grid.squares[myC[1]][myC[0]];

      this.square.occupant = this;
      this.turnStartSquare = this.square;
      this.scale.x = this.square.tile.scale.x;
      this.scale.y = this.square.tile.scale.y;
      this.x = this.square.x + this.square.tile.width*3/8;
      this.y = this.square.y - this.square.tile.height/6;
      
      game.physics.enable(this);
      game.add.existing(this);
      this.grid.players.add(this)
      this.health = 50;
      //jank math in there, not 100% sure how to organize that but I can probably find a way. Low priority tho.
      this.bar = new LifeBarContainer(this, pNum%2==0?25:578, Math.floor((pNum-1)/2)*50 + 25);
      this.element = pNum; //temporarily...
      
      //add characters and add character animations
      //the floating characters are at the center of their squares
      this.animations.add('float', Phaser.Animation.generateFrameNames('Player' + pNum + '_', 1, 12, '', 2), 20, true);
      this.animations.add('turn', Phaser.Animation.generateFrameNames('Player' + pNum + 'Turn_', 1, 12, '', 2), 20, true);
      this.animations.play('float');
      this.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);//I dunno why this is really necessary but OK

      this.events.onInputDown.add(playerClick, this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.alterHealth = function(amount){
      this.health = Math.max(0, Math.min(50, this.health + amount));
}
