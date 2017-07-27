var game = new Phaser.Game(800, 400, Phaser.AUTO);
var score = 0;
var scoring = 0;
var diffCounter = 0;
var difficulty;
var scoreText;
var LoadScreen = function(game) {};
LoadScreen.prototype = {
   preload: function() {
      console.log('LoadScreen preload');
      // assets lead to both audio and texture atlas
      game.load.path = 'assets/';
      game.load.audio('bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);
      game.load.audio('boom', ['audio/boom.mp3', 'audio/boom.ogg']);
      game.load.audio('click', ['audio/click.mp3', 'audio/click.ogg']);      
      //load all the assets of the game
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
      bgm = game.add.audio('bgm');  
      click = game.add.audio('click');
      boom = game.add.audio('boom');
      //play the music
      bgm.loopFull(0.06);  
      // this is a faded background for the title screen
      background = game.add.tileSprite(0, -250, 1600, 1600, 'atlas', 'nebula');
      background.scale.setTo(0.5, 0.5);
      background.alpha = 0.2;
      game.add.sprite(game.world.centerX - 350, 100, 'atlas', 'title');
      startButton = game.add.button(game.world.centerX - 60, 300, 'atlas', startClick, this, 'StartNorm', 'StartNorm', 'StartPress');
   },
   update: function() {

   }
}
var GameLoop = function(game) {};
GameLoop.prototype = {
   create: function (){
      console.log('GameLoop create'); //brighten the main background
      background = game.add.tileSprite(0, -250, 1600, 1600, 'atlas', 'nebula');
      background.scale.setTo(0.5, 0.5);
      background.alpha = 0.6;
      // adds two star backgrounds that give appearance of movement
      game.bg1 = game.add.tileSprite(0, 0, 800, 600, 'atlas', 'stars01');
      game.bg2 = game.add.tileSprite(0, 0, 1600, 1200, 'atlas', 'stars02');
      player = game.add.sprite(10, this.world.centerY, 'atlas', 'PlayerFly1');
      player.scale.setTo(0.8, 0.8);
      game.physics.arcade.enable(player); //adds physics
      player.body.collideWorldBounds = true;
      player.animations.add('fly', Phaser.Animation.generateFrameNames('PlayerFly', 1, 4, '', 1), 30, true);   
      player.animations.play('fly');
      asteroids = game.add.group();         
      asteroids.enableBody = true;
      scoreText = game.add.text(8, 8, 'score: 0', { fontSize: '16px', fill: '#ffffff' }); // display score, time based      
   },
   update: function(){      
      background.tilePosition.x -= .1;
      game.bg1.tilePosition.x -= 2;
      game.bg2.tilePosition.x -= 5; //moves backgrounds
      player.body.velocity.y = 0;
      if(cursors.up.isDown){
         player.body.velocity.y = -500; 
      } else if(cursors.down.isDown){
         player.body.velocity.y = 500;
      } //movement of player
      scoring += 1;
      diffCounter += 1;
      if (scoring == 50) {
         score += 1;
         scoreText.text = 'score: ' + score; //scoring, 1 point per 50 frames
         scoring = 0;
      }
      //these loops are for the increasing difficulty of the game, as the game continues, asteroids spawn faster
      difficulty = (60 / Math.pow((score/10) + 1, 0.5));
      if (diffCounter > difficulty) {
         spawnAsteroid();
         diffCounter = 0;        
      }
      // and move faster
      asteroids.forEach(function(asteroid){
         asteroid.x -= 200/difficulty;
         if (asteroid.x < -70){
            asteroid.kill(); // if the asteroid moves beyond the left border, destroy it
         }
      });
     game.physics.arcade.overlap(player, asteroids, hitAsteroid, null, this);
   }
}

var GameOver = function(game) {};
GameOver.prototype = {
   create: function(){
      game.alpha = 0.6; //dim the screen, and add a button that starts again
      newButton = game.add.button(game.world.centerX - 60, 250, 'atlas', startClick, this, 'StartNorm', 'StartNorm', 'StartPress');
      gameOverText = game.add.text(65, 100, 'Game Over', { fontSize: '120px', fill: '#ffffff' });
   }
}

function startClick() {     //on a button click, reset all relevant variables and start the game again
   click.play('', 0, 0.3);
   score = 0;
   scoring = 0;
   diffCounter = 0; 
   game.state.start('GameLoop');
}

function spawnAsteroid() {
   if (score % 4 == 0) { // randomize look of asteroid, position of asteroid, and spin. 
      var asteroid = game.add.sprite(800, Math.random() * 540, 'atlas', 'asteroid1');
   } else if (score % 4 == 1) {
      var asteroid = game.add.sprite(800, Math.random() * 540, 'atlas', 'asteroid2');
   } else if (score % 4 == 2) {
      var asteroid = game.add.sprite(800, Math.random() * 540, 'atlas', 'asteroid3');
   } else {
      var asteroid = game.add.sprite(800, Math.random() * 540, 'atlas', 'asteroid4');
   }
   asteroids.add(asteroid);
   asteroid.anchor.setTo(0.5);
   asteroid.body.angularVelocity = Math.random() * 60;
}

function hitAsteroid(){ //if you hit an asteroid, go to the game over state
   boom.play('', 1, 0.3);
   game.state.start('GameOver');
}

game.state.add('LoadScreen', LoadScreen);
game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');