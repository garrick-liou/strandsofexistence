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
      game.add.sprite(220, 200, 'atlas', 'logo');
      game.add.text(20, 300, 'Press ENTER to Start!', { fontSize: '60px', fill: '#ffffff' });
   },
   update: function() {
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){
   			game.state.start('GameLoop');
   		}
   }
}
var GameLoop = function(game) {};
GameLoop.prototype = {
   create: function (){
      console.log('GameLoop create'); 
      background = game.add.sprite(0, 0, 'atlas', 'background');
      background.scale(0.78125);
      square1_1 = game.add.sprite(5, 250, 'atlas', 'TileColumn1');
      square1_2 = game.add.sprite(5, 365, 'atlas', 'TileColumn1');
      square1_3 = game.add.sprite(5, 480, 'atlas', 'TileColumn1');
      square2_1 = game.add.sprite(140, 250, 'atlas', 'TileColumn1');
      square2_2 = game.add.sprite(140, 365, 'atlas', 'TileColumn1');
      square2_3 = game.add.sprite(140, 480, 'atlas', 'TileColumn1');
      square3_1 = game.add.sprite(275, 250, 'atlas', 'TileColumn1');
      square3_2 = game.add.sprite(275, 365, 'atlas', 'TileColumn1');
      square3_3 = game.add.sprite(275, 480, 'atlas', 'TileColumn1');
      square4_1 = game.add.sprite(330, 250, 'atlas', 'TileColumn1');
      square4_2 = game.add.sprite(330, 365, 'atlas', 'TileColumn1');
      square4_3 = game.add.sprite(330, 480, 'atlas', 'TileColumn1');
      square5_1 = game.add.sprite(465, 250, 'atlas', 'TileColumn1');
      square5_2 = game.add.sprite(465, 365, 'atlas', 'TileColumn1');
      square5_3 = game.add.sprite(465, 480, 'atlas', 'TileColumn1');
      square6_1 = game.add.sprite(600, 250, 'atlas', 'TileColumn1');
      square6_2 = game.add.sprite(600, 365, 'atlas', 'TileColumn1');
      square6_3 = game.add.sprite(600, 480, 'atlas', 'TileColumn1');
   },
   update: function(){      
      
   }
}

var GameOver = function(game) {};
GameOver.prototype = {
   create: function(){      
   }
} 


game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');