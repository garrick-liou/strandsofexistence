var game = new Phaser.Game(800, 600, Phaser.AUTO);
var LoadScreen = function(game) {};
LoadScreen.prototype = {
   preload: function() {
      console.log('LoadScreen preload');      
      game.load.path = 'assets/';
      game.load.atlas('atlas', 'img/atlas.png', 'img/atlas.json');
      // creates the cursors object that allows the program to read keyboard input
      cursors = game.input.keyboard.createCursorKeys();
      // this starts the physics used in the game
      game.physics.startSystem(Phaser.Physics.ARCADE);      
   },
   create: function() {
      console.log('LoadScreen create');
      game.state.start('MainMenu'); //after assets are loaded, move to main menu
   }
}
var MainMenu = function(game) {};
MainMenu.prototype = {
   create: function() {        
      console.log('MainMenu create');
      game.add.sprite(230, 200, 'atlas', 'logo'); //placeholder logo and maybe button text, who knows
      game.add.text(60, 440, 'Press ENTER to Start!', { fontSize: '60px', fill: '#ffffff' });
   },
   update: function() {
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to start
   			game.state.start('GameLoop');
   		}
   }
}
var GameLoop = function(game) {};
GameLoop.prototype = {
   create: function (){
      console.log('GameLoop create'); 
      background = game.add.sprite(0, 0, 'atlas', 'background');
      background.scale.setTo(0.78125);
      //scale background, add tiles
      square1_1 = game.add.sprite(5, 305, 'atlas', 'TileColumn1');
      square1_2 = game.add.sprite(5, 400, 'atlas', 'TileColumn1');
      square1_3 = game.add.sprite(5, 495, 'atlas', 'TileColumn1');
      square2_1 = game.add.sprite(135, 305, 'atlas', 'TileColumn2');
      square2_2 = game.add.sprite(135, 400, 'atlas', 'TileColumn2');
      square2_3 = game.add.sprite(135, 495, 'atlas', 'TileColumn2');
      square3_1 = game.add.sprite(265, 305, 'atlas', 'TileColumn3');
      square3_2 = game.add.sprite(265, 400, 'atlas', 'TileColumn3');
      square3_3 = game.add.sprite(265, 495, 'atlas', 'TileColumn3');
      square4_1 = game.add.sprite(410, 305, 'atlas', 'TileColumn4');
      square4_2 = game.add.sprite(410, 400, 'atlas', 'TileColumn4');
      square4_3 = game.add.sprite(410, 495, 'atlas', 'TileColumn4');
      square5_1 = game.add.sprite(540, 305, 'atlas', 'TileColumn5');
      square5_2 = game.add.sprite(540, 400, 'atlas', 'TileColumn5');
      square5_3 = game.add.sprite(540, 495, 'atlas', 'TileColumn5');
      square6_1 = game.add.sprite(670, 305, 'atlas', 'TileColumn6');
      square6_2 = game.add.sprite(670, 400, 'atlas', 'TileColumn6');
      square6_3 = game.add.sprite(670, 495, 'atlas', 'TileColumn6');
      player1 = game.add.sprite(53, 384, 'atlas', 'Player1_01');
      player2 = game.add.sprite(718, 384, 'atlas', 'Player2_01');
      //add characters and add character animations
      //the floating characters are at the center of their squares
      player1.animations.add('p1_float', Phaser.Animation.generateFrameNames('Player1_', 1, 12, '', 2), 20, true);
      player1.animations.play('p1_float');
      player2.animations.add('p2_float', Phaser.Animation.generateFrameNames('Player2_', 1, 12, '', 2), 20, true);
      player2.animations.play('p2_float');
   },
   update: function(){      
   	//if each player is not at their edge when a directional button is pressed, move them to the next square
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

var GameOver = function(game) {};
GameOver.prototype = {
   create: function(){      
   	//unused for now
   }
} 

game.state.add('LoadScreen', LoadScreen);
game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');