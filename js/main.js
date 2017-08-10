var game = new Phaser.Game(800, 600, Phaser.AUTO);
var turnCounter = 0;
var phaseCounter = 0;
var attackCounter = 0;
var button1_1;
var button1_2;
var button1_3;
var button2_1;
var button2_2;
var button2_3;
var button3_1;
var button3_2;
var button3_3;
var button4_1;
var button4_2;
var button4_3;
var button5_1;
var button5_2;
var button5_3;
var button6_1;
var button6_2;
var button6_3Kappa;

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
   			game.state.start('InstructionScreen');
   		}
   }
}
var InstructionScreen = function(game) {};
InstructionScreen.prototype = {
	create: function() {
		game.add.text(40, 250, 'Click on your player to see the squares you can move to.', { fontSize: '26px', fill: '#ffffff' });
		game.add.text(40, 300, 'After moving, press 1, 2, or 3 to see your attack ranges.' , { fontSize: '26px', fill: '#ffffff' });
		game.add.text(40, 350, 'Press ENTER to confirm your attack. Player 1 moves first.', { fontSize: '26px', fill: '#ffffff' });
		game.add.text(300, 500, 'Press ENTER to continue.' , { fontSize: '20px', fill: '#ffffff' })
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
      background.scale.setTo(0.78125);
      //scale background, add tiles
      tileGroup = game.add.group();
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
      tileGroup.add(square1_1);
      tileGroup.add(square1_2);
      tileGroup.add(square1_3);
      tileGroup.add(square2_1);
      tileGroup.add(square2_2);
      tileGroup.add(square2_3);
      tileGroup.add(square3_1);
      tileGroup.add(square3_2);
      tileGroup.add(square3_3);      
      buttonGroup = game.add.group();
      damageGroup = game.add.group();
      damageGroup.enableBody = true;
      player1 = new Player(game, 'atlas', 'Player1_01', 1);
      player2 = new Player(game, 'atlas', 'Player2_01', 2);
      game.add.existing(player1);
      player1.inputEnabled = true;
      game.add.existing(player2);
      player2.inputEnabled = true;
      //add characters and add character animations
      //the floating characters are at the center of their squares
      player1.animations.add('p1_float', Phaser.Animation.generateFrameNames('Player1_', 1, 12, '', 2), 20, true);
      player1.animations.play('p1_float');
      player2.animations.add('p2_float', Phaser.Animation.generateFrameNames('Player2_', 1, 12, '', 2), 20, true);
      player2.animations.play('p2_float');
      player1Text = game.add.text(25, 25, 'Player 1 Health: ', { fontSize: '32px', fill: '#ffffff'});
      player2Text = game.add.text(500, 25, 'Player 2 Health: ',  { fontSize: '32px', fill: '#ffffff'});
      text = game.add.text(320, 50, '', { fontSize: '12px', fill: '#ffffff'} )
   },
   update: function(){    
   		//which player is moving?
    player1.events.onInputDown.add(p1click, this);   		
   	player2.events.onInputDown.add(p2click, this);   		
   	player1Text.text = 'Player 1 Health: ' + player1.health;
   	player2Text.text = 'Player 2 Health: ' + player2.health; // showing the health of each
   	//text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter + ' attack: ' + attackCounter;
   	if (phaseCounter > 1 && phaseCounter < 4) { // if the player has already moved
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) { //wait for attack button input, 1, 2, or 3 and go to appropriate attack function
   			attackCounter = 1;
   			if (turnCounter == 0) {
   				attP1A(player1.xCoord, player1.yCoord); 
   			} else if (turnCounter == 1) {
   				attP2A(player2.xCoord, player2.yCoord);
   			}
   		} else if (game.input.keyboard.justPressed(Phaser.Keyboard.TWO)) {
   			attackCounter = 2;
   			if (turnCounter == 0) {
   				attP1B(player1.xCoord, player1.yCoord); 
   			} else if (turnCounter == 1) {
   				attP2B(player2.xCoord, player2.yCoord);
   			}
   		} else if (game.input.keyboard.justPressed(Phaser.Keyboard.THREE)) {
   			attackCounter = 3;
   			if (turnCounter == 0) {
   				attP1C(player1.xCoord, player1.yCoord); 
   			} else if (turnCounter == 1) {
   				attP2C(player2.xCoord, player2.yCoord);
   			}
   		}     		
   	}
   	if (phaseCounter == 3) { // after an attack has been chosen, wait for confirmation with ENTER
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
   			confirmPressed();
   		}
   	}
   	if (player1.health == 0 || player2.health == 0) {
   		game.state.start('GameOver');
   	}
   }
}
var GameOver = function(game) {};
GameOver.prototype = {
   create: function(){      
   	//show victory/loss screen
   	if (player1.health == 0) {
   		game.add.sprite(0, 0, 'atlas', 'P2Win');
   	} else if (player2.health == 0) {
   		game.add.sprite(0, 0, 'atlas', 'P1Win');
   	}
   },
   update: function(){ //return to start
   	if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to start
   			game.state.start('GameLoop');
   		}
   }
} 

function p1click() { //when the player 1 sprite is clicked
	if (phaseCounter == 0 && turnCounter == 0) {
		phaseCounter = 1;
		if (player1.xCoord == 1) { //make buttons around character when clicked to show possible moves (this can probably be simplified a LOT)
			if (player1.yCoord == 1) {
			button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button1_2);
			buttonGroup.add(button2_1);
			buttonGroup.add(button1_1);
			} else if (player1.yCoord == 2) {
			button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button1_1);
			buttonGroup.add(button1_3);
			buttonGroup.add(button2_2);
			buttonGroup.add(button1_2);
			} else if (player1.yCoord == 3) {
			button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button1_2); // adds the buttons to the relevant group, for easy deleting
			buttonGroup.add(button2_3);
			buttonGroup.add(button1_3);
			} // this all does the same stuff
		} else if (player1.xCoord == 2) {
			if (player1.yCoord == 1) {
			button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button1_1);
			buttonGroup.add(button3_1);
			buttonGroup.add(button2_2);
			buttonGroup.add(button2_1);
			} else if (player1.yCoord == 2) {
			button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button2_1);
			buttonGroup.add(button1_2);
			buttonGroup.add(button3_2);
			buttonGroup.add(button2_3);
			buttonGroup.add(button2_2);
			} else if (player1.yCoord == 3) {
			button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button1_3);
			buttonGroup.add(button3_3);
			buttonGroup.add(button2_2);
			buttonGroup.add(button2_3);
			}
		} else if (player1.xCoord == 3) {
			if (player1.yCoord == 1) {	
			button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button3_2);
			buttonGroup.add(button2_1);
			buttonGroup.add(button3_1);
			} else if (player1.yCoord == 2) {
			button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button3_1);
			buttonGroup.add(button3_3);
			buttonGroup.add(button2_2);
			buttonGroup.add(button3_2);
			} else if (player1.yCoord == 3) {
			button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button3_2);
			buttonGroup.add(button2_3);
			buttonGroup.add(button3_3);
			}
		}	
	}
}

function p2click() { //do the same with when player 2 is clicked
	if (phaseCounter == 0 && turnCounter == 1) {
		phaseCounter = 1;
		if (player2.xCoord == 4) {
			if (player2.yCoord == 1) {
			button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button4_2);
			buttonGroup.add(button5_1);
			buttonGroup.add(button4_1);
			} else if (player2.yCoord == 2) {
			button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button4_1);
			buttonGroup.add(button4_3);
			buttonGroup.add(button5_2);
			buttonGroup.add(button4_2);
			} else if (player2.yCoord == 3) {
			button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_3 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button4_2);
			buttonGroup.add(button5_3);
			buttonGroup.add(button4_3);
			}
		} else if (player2.xCoord == 5) {
			if (player2.yCoord == 1) {
			button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button4_1);
			buttonGroup.add(button6_1);
			buttonGroup.add(button5_2);
			buttonGroup.add(button5_1);
			} else if (player2.yCoord == 2) {
			button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button5_1);
			buttonGroup.add(button4_2);
			buttonGroup.add(button6_2);
			buttonGroup.add(button5_3);
			buttonGroup.add(button5_2);
			} else if (player2.yCoord == 3) {
			button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button4_3);
			buttonGroup.add(button6_3);
			buttonGroup.add(button5_2);
			buttonGroup.add(button5_3);
			}
		} else if (player2.xCoord == 6) {
			if (player2.yCoord == 1) {	
			button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button6_2);
			buttonGroup.add(button5_1);
			buttonGroup.add(button6_1);
			} else if (player2.yCoord == 2) {
			button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button6_1);
			buttonGroup.add(button6_3);
			buttonGroup.add(button5_2);
			buttonGroup.add(button6_2);
			} else if (player2.yCoord == 3) {
			button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
			buttonGroup.add(button6_2);
			buttonGroup.add(button5_3);
			buttonGroup.add(button6_3);
			}
		}
	} 
}

function button1Click(x, y) { //when one of the buttons created by the previous function is created
	//console.log('im here');
	player1.x = -77 + 130*x; //move the player to a certain spot depending on where the button was
	player1.y = 194 + 95*y;
	buttonGroup.forEachAlive(function (c) { c.kill(); }); // delete the existing buttons, waiting for next move phase
	phaseCounter = 2; //increment phase counter to attack phase
}
function button2Click(x, y) { // same with player 2
	//console.log('im here 2');
	player2.x = -62 + 130*x;
	player2.y = 194 + 95*y;
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	phaseCounter = 2;
}

function attP1A(x, y) { //if 1 is pressed, increment phase counter to 3, waiting for attack confirmation
	phaseCounter = 3;
	damageGroup.forEachAlive(function (c) { c.kill(); })
	if (y == 1) { //create images of which squares are damaged by the player's chosen attack, 1 attack the column the player is in
		damage4_1 = game.add.sprite(square4_1.x, square4_1.y, 'atlas', 'DamageTile');
		damage5_1 = game.add.sprite(square5_1.x, square5_1.y, 'atlas', 'DamageTile');
		damage6_1 = game.add.sprite(square6_1.x, square6_1.y, 'atlas', 'DamageTile');
		damageGroup.add(damage4_1); //adds all the damage square images to the damage tile group
		damageGroup.add(damage5_1);
		damageGroup.add(damage6_1);
	} else if (y == 2) {
		damage4_2 = game.add.sprite(square4_2.x, square4_2.y, 'atlas', 'DamageTile');
		damage5_2 = game.add.sprite(square5_2.x, square5_2.y, 'atlas', 'DamageTile');
		damage6_2 = game.add.sprite(square6_2.x, square6_2.y, 'atlas', 'DamageTile');
		damageGroup.add(damage4_2);
		damageGroup.add(damage5_2);
		damageGroup.add(damage6_2);
	} else if (y == 3) {
		damage4_3 = game.add.sprite(square4_3.x, square4_3.y, 'atlas', 'DamageTile');
		damage5_3 = game.add.sprite(square5_3.x, square5_3.y, 'atlas', 'DamageTile');
		damage6_3 = game.add.sprite(square6_3.x, square6_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage4_3);
		damageGroup.add(damage5_3);
		damageGroup.add(damage6_3);
	}
}
function attP2A(x, y) { 
	phaseCounter = 3;
	damageGroup.forEachAlive(function (c) { c.kill(); })
	if (y == 1) {
		damage1_1 = game.add.sprite(square1_1.x, square1_1.y, 'atlas', 'DamageTile');
		damage2_1 = game.add.sprite(square2_1.x, square2_1.y, 'atlas', 'DamageTile');
		damage3_1 = game.add.sprite(square3_1.x, square2_1.y, 'atlas', 'DamageTile');
		damageGroup.add(damage1_1);
		damageGroup.add(damage2_1);
		damageGroup.add(damage3_1);
	} else if (y == 2) {
		damage1_2 = game.add.sprite(square1_2.x, square1_2.y, 'atlas', 'DamageTile');
		damage2_2 = game.add.sprite(square2_2.x, square2_2.y, 'atlas', 'DamageTile');
		damage3_2 = game.add.sprite(square3_2.x, square3_2.y, 'atlas', 'DamageTile');
		damageGroup.add(damage1_2);
		damageGroup.add(damage2_2);
		damageGroup.add(damage3_2);
	} else if (y == 3) {
		damage1_3 = game.add.sprite(square1_3.x, square1_3.y, 'atlas', 'DamageTile');
		damage2_3 = game.add.sprite(square2_3.x, square2_3.y, 'atlas', 'DamageTile');
		damage3_3 = game.add.sprite(square3_3.x, square3_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage1_3);
		damageGroup.add(damage2_3);
		damageGroup.add(damage3_3);
	}
}

function attP1B(x, y) { // 2 attacks the row 3 spaces away, and highlights the tiles to be hit
	phaseCounter = 3;
	damageGroup.forEachAlive(function (c) { c.kill(); })
	if (x == 1) {
		damage4_1 = game.add.sprite(square4_1.x, square4_1.y, 'atlas', 'DamageTile');
		damage4_2 = game.add.sprite(square4_2.x, square4_2.y, 'atlas', 'DamageTile');
		damage4_3 = game.add.sprite(square4_3.x, square4_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage4_1);
		damageGroup.add(damage4_2);
		damageGroup.add(damage4_3);
	} else if (x == 2) {
		damage5_1 = game.add.sprite(square5_1.x, square5_1.y, 'atlas', 'DamageTile');
		damage5_2 = game.add.sprite(square5_2.x, square5_2.y, 'atlas', 'DamageTile');
		damage5_3 = game.add.sprite(square5_3.x, square5_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage5_1);
		damageGroup.add(damage5_2);
		damageGroup.add(damage5_3);
	} else if (x == 3) {
		damage6_1 = game.add.sprite(square6_1.x, square6_1.y, 'atlas', 'DamageTile');
		damage6_2 = game.add.sprite(square6_2.x, square6_2.y, 'atlas', 'DamageTile');
		damage6_3 = game.add.sprite(square6_3.x, square6_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage6_1);
		damageGroup.add(damage6_2);
		damageGroup.add(damage6_3);
	} 
}

function attP2B(x, y) {
	phaseCounter = 3;
	damageGroup.forEachAlive(function (c) { c.kill(); })
	if (x == 4) {
		damage1_1 = game.add.sprite(square1_1.x, square1_1.y, 'atlas', 'DamageTile');
		damage1_2 = game.add.sprite(square1_2.x, square1_2.y, 'atlas', 'DamageTile');
		damage1_3 = game.add.sprite(square1_3.x, square1_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage1_1);
		damageGroup.add(damage1_2);
		damageGroup.add(damage1_3);
	} else if (x == 5) {
		damage2_1 = game.add.sprite(square2_1.x, square2_1.y, 'atlas', 'DamageTile');
		damage2_2 = game.add.sprite(square2_2.x, square2_2.y, 'atlas', 'DamageTile');
		damage2_3 = game.add.sprite(square2_3.x, square2_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage2_1);
		damageGroup.add(damage2_2);
		damageGroup.add(damage2_3);
	} else if (x == 6) {
		damage3_1 = game.add.sprite(square3_1.x, square3_1.y, 'atlas', 'DamageTile');
		damage3_2 = game.add.sprite(square3_2.x, square3_2.y, 'atlas', 'DamageTile');
		damage3_3 = game.add.sprite(square3_3.x, square3_3.y, 'atlas', 'DamageTile');
		damageGroup.add(damage3_1);
		damageGroup.add(damage3_2);
		damageGroup.add(damage3_3);
	} 
}

function attP1C(x, y) { // attack 3 attacks the square directly across from you, 3 tiles away
	phaseCounter = 3;
	damageGroup.forEachAlive(function (c) { c.kill(); })
	damage = game.add.sprite(130*x + 280, 95*y + 210, 'atlas', 'DamageTile');		
	damageGroup.add(damage);	
}

function attP2C(x, y) {
	phaseCounter = 3;
	damageGroup.forEachAlive(function (c) { c.kill(); })
	damage = game.add.sprite(130*x - 515, 95*y + 210, 'atlas', 'DamageTile');		
	damageGroup.add(damage);	
}
function confirmPressed() { //when enter is pressed, check to see which attack button was pressed last, and check to see if the attack hits
	if (attackCounter == 1) { //an attempt was made to make this use sprite overlap checking, but it didn't work well with the irregular player sprite
		if (turnCounter == 0) { //so it simply checks the squares as expected
			if (player1.yCoord == player2.yCoord) {
				player2.health -= 1;
			}
		} else if (turnCounter == 1) {
			if (player1.yCoord == player2.yCoord) {
				player1.health -= 1;
			}
		}
	} else if (attackCounter == 2) {
		if (turnCounter == 0) {
			if (player2.xCoord == player1.xCoord + 3) {
				player2.health -= 1;
			}
		} else if (turnCounter == 1) {
			if (player1.xCoord == player2.xCoord - 3) {
				player1.health -= 1;
			}
		}
	} else if (attackCounter == 3) { //attack 3 requires more precise positioning, and thus deals more damage
		if (turnCounter == 0) {
			if (player2.xCoord == player1.xCoord + 3 || player2.yCoord == player1.yCoord) {
				player2.health -= 2;
			}
		} else if (turnCounter == 1) {
			if (player1.xCoord == player2.xCoord - 3 || player1.yCoord == player1.yCoord) {
				player1.health -= 2;
			}
		}
	}
	
	damageGroup.forEachAlive(function (c) { c.kill(); }) //delete all damage tile sprites
	if (turnCounter == 0) {
		turnCounter = 1; //if it was player 1's turn, make it player 2's turn
	} else {
		turnCounter = 0; //vice versa
	}
	phaseCounter = 0; //and reset the phase to move phase
}

game.state.add('LoadScreen', LoadScreen);
game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('InstructionScreen', InstructionScreen);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');