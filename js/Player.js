function Player(game, number){
	if (number == 1){		
		Phaser.Sprite.call(this, game, 53, 384, 'atlas', 'Player1_01');
            this.xCoord = 1;
            this.yCoord = 1;
            this.type = 'fire'
	} else if (number == 2){
		Phaser.Sprite.call(this, game, 718, 384, 'atlas', 'Player2_01');
            this.xCoord = 8;
            this.yCoord = 1;
            this.type = 'fire';
	} else if (number == 3) {
            Phaser.Sprite.call(this, game, 53, 289, 'atlas', 'Player3_01');
            this.xCoord = 1;
            this.yCoord = 3;
            this.type = 'grass';
      } else if (number == 4){
            Phaser.Sprite.call(this, game, 718, 289, 'atlas', 'Player4_01');
            this.xCoord = 8;
            this.yCoord = 3;
            this.type = 'grass';
      } else if (number == 5) {
            Phaser.Sprite.call(this, game, 53, 479, 'atlas', 'Player5_01');
            this.xCoord = 1;
            this.yCoord = 5;
            this.type = 'water';       
      } else if (number == 6){
            Phaser.Sprite.call(this, game, 718, 479, 'atlas', 'Player6_01');
            this.xCoord = 8;
            this.yCoord = 5;
            this.type = 'water';
      }
	this.number = number;
      this.health = 50;
      this.memory = [0, 0];
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
      if (this.health == 0) {
            this.kill();
            this.xCoord = 0;
            this.yCoord = 0;
      }    
      if (this.xCoord != 0) {
            this.x = this.xCoord * 90 - 25;  
      } else if (this.xCoord == 0) {
            this.x = 0;
      }
      if (this.yCoord != 0) {            
            this.y = this.yCoord * 75 + 110;
      } else if(this.yCoord == 0) {
            this.y = 0;
      }      
}
