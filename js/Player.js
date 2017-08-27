var pInfo = [
      {x:0, y:0, element:"flame"},
      {x:3, y:0, element:"flame"},
      {x:0, y:2, element:"plant"},
      {x:3, y:2, element:"plant"},
      {x:0, y:4, element:"water"},
      {x:3, y:4, element:"water"},
];

function Player(grid, pNum){
      //should use xcoord and ycoord as arguments instead...
      Phaser.Sprite.call(this, game, 0, 0, 'atlas', 'Player' + pNum + '_01');
      this.grid = grid;

      let myInfo = pInfo[pNum-1];
      this.square = grid.squares[myInfo.y][myInfo.x];

      this.square.occupant = this;
      this.turnStartSquare = this.square;
      this.scale.x = 0.5 + this.square.tile.scale.x/2;
      this.scale.y = 0.5 + this.square.tile.scale.y/2;
      this.x = this.square.x + this.square.tile.width*3/8;
      this.y = this.square.y - this.square.tile.height/6;
      
      game.physics.enable(this);
      game.add.existing(this);
      this.grid.players.add(this)
      this.health = 50;
      //jank math in there, not 100% sure how to organize that but I can probably find a way. Low priority tho.
      this.bar = new LifeBar(this, pNum%2==1?25:578, Math.floor((pNum-1)/2)*50 + 25);
      this.element = myInfo.element;
      
      this.events.onInputDown.add(playerClick, this);
      
      //add characters and add character animations
      //the floating characters are at the center of their squares
      this.animations.add('float', Phaser.Animation.generateFrameNames('Player' + pNum + '_', 1, 12, '', 2), 20, true);
      this.animations.add('turn', Phaser.Animation.generateFrameNames('Player' + pNum + 'Turn_', 1, 12, '', 2), 20, true);
      this.animations.play('float');
      this.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);

      this.emitter = game.add.emitter(this.x + this.width/2, this.y + this.height*0.9, 100)
      this.grid.add(this.emitter);
      this.emitter.makeParticles('atlas', 'particle');

      this.emitter.area = new Phaser.Rectangle(this.x, this.y, this.square.tile.width/3, 1);
      this.emitter.gravity = new Phaser.Point(0, 20);
      
      this.emitter.minParticleScale = 0.4;
      this.emitter.maxParticleScale = 0.6;

      this.emitter.setRotation(-20, 20);
      this.emitter.setXSpeed(0,0);

      this.emitterState(0);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.alterHealth = function(amount){
      this.health = Math.max(0, Math.min(50, this.health + amount));
}
Player.prototype.emitterState = function(state){
      switch(state){
            case 0:
                  this.emitter.setAlpha(0.4, 0.5);
                  this.emitter.setYSpeed(-60,-40);
                  this.emitter.flow(800, 100, 1);
                  break;
            case 1:
                  this.emitter.setAlpha(1);
                  this.emitter.setYSpeed(-100,-80);
                  this.emitter.flow(500, 100, 2);
                  break;
            default:
                  break;
      }
}
