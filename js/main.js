var game = new Phaser.Game(800, 600, Phaser.AUTO);
var LoadScreen = function(game) {};
LoadScreen.prototype = {
   preload: function() {
      console.log('LoadScreen preload');      
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
   },
   update: function() {

   }
}
var GameLoop = function(game) {};
GameLoop.prototype = {
   create: function (){
      console.log('GameLoop create'); //brighten the main background
      
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