var pInfo = [
      {x:0, y:0, element:"flame", activeTurn:0},
      {x:3, y:0, element:"flame", activeTurn:1},
      {x:0, y:2, element:"plant", activeTurn:0},
      {x:3, y:2, element:"plant", activeTurn:1},
      {x:0, y:4, element:"water", activeTurn:0},
      {x:3, y:4, element:"water", activeTurn:1}
];

function Player(grid, pNum){
      //should use xcoord and ycoord as arguments instead...
      Phaser.Sprite.call(this, game, 0, 0, 'atlas', 'Player' + pNum + '_01');
      this.grid = grid;

      let myInfo = pInfo[pNum-1];
      this.activeTurn = myInfo.activeTurn;
      this.square = grid.squares[myInfo.y][myInfo.x];

      this.square.occupant = this;
      this.turnStartSquare = this.square;
      this.scale.x = 0.5 + this.square.tile.scale.x/2;
      this.scale.y = 0.5 + this.square.tile.scale.y/2;
      this.x = this.square.x + this.square.tile.width*3/8;
      this.y = this.square.y - this.square.tile.height/6;
      
      game.physics.enable(this);
      game.add.existing(this);
      this.grid.players.add(this);
      this.health = 50;
      //jank math in there, not 100% sure how to organize that but I can probably find a way. Low priority tho.
      this.bar = new LifeBar(this, this.activeTurn==0 ? 25 : 578, myInfo.y*25 + 25);
      this.icon = game.add.sprite(this.activeTurn == 0 ? 230 : 540, myInfo.y*25 + 25, 'atlas', 'P' + pNum + 'Icon');
      this.element = myInfo.element;
      
      this.events.onInputDown.add(playerClick, this);
      
      //add characters and add character animations
      //the floating characters are at the center of their squares
      this.animations.add('float', Phaser.Animation.generateFrameNames('Player' + pNum + '_', 1, 12, '', 2), 20, true);
      this.animations.add('turn', Phaser.Animation.generateFrameNames('Player' + pNum + 'Turn_', 1, 12, '', 2), 20, true);
      this.animations.add('damage', Phaser.Animation.generateFrameNames('Player' + pNum + 'Damage_', 1, 5, '', 2), 8, false);
      this.animations.add('strongDamage', Phaser.Animation.generateFrameNames('Player' + pNum + 'Strong_', 1, 5, '', 2), 4, false);

      let idleAfterDamage = function(){
            var target = "";
            if(turnCounter == this.activeTurn) target = 'turn';
            if(turnCounter != this.activeTurn) target = 'float';
            if(target == "" || this.animations.currentAnim.name == target) return;
            this.animations.stop();
            this.animations.play(target);
            this.animations.currentAnim.setFrame(this.oldFrame, true);
            this.tint = 0xFFFFFF;
            this.icon.tint = 0xFFFFFF;
      }
      this.animations.getAnimation("damage").onComplete.add(idleAfterDamage, this);
      this.animations.getAnimation("strongDamage").onComplete.add(idleAfterDamage, this);

      if(turnCounter == this.activeTurn) this.animations.play('turn');
      else this.animations.play('float');

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
Player.prototype.idleAnim = function(){
      var target = "";
      if(turnCounter == this.activeTurn && this.animations.name == 'float') target = 'turn';
      if(turnCounter != this.activeTurn && this.animations.name == 'turn') target = 'float';
      if(target == "" || this.animations.currentAnim.name == target) return;
      this.animations.stop();
      this.animations.play(target);
      this.animations.currentAnim.setFrame(this.oldFrame, true);
}
Player.prototype.alterHealth = function(amount, multiplier){
      this.oldFrame = this.animations.currentAnim.frame;
      switch(multiplier){
            case 1:
                  this.tint = 0xEEDDDD;
                  this.icon.tint = 0xEEDDDD;
                  this.animations.play('damage');
                  break;
            case 2:
                  this.tint = 0xCCAAAA;
                  this.icon.tint = 0xCCAAAA;
                  this.animations.play('damage');
                  break;
            case 3:
                  this.tint = 0xAA4444;
                  this.icon.tint = 0xAA4444;
                  this.animations.play('strongDamage');
                  break;
            default:
                  multiplier = 2;
                  break;
      }
      multiplier /= 2;
      this.health = Math.max(0, Math.min(50, this.health + amount * multiplier));

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
