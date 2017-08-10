var game = new Phaser.Game(800, 600, Phaser.AUTO);
var turnCounter = 0;
var phaseCounter = 0;
var attackCounter = 0;
var squares, buttons;
var player1, player2, background;

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
		buttonGroup = game.add.group();
		tileXs = [5, 135, 265, 410, 540, 670];
		tileYs = [305, 400, 495];
		squares = [];
		buttons = [];
		for(var i = 0; i < tileYs.length; i++){
			squares.push([]);
			buttons.push([]);
			for(var j = 0; j < tileXs.length; j++){
				squares[i].push(new Tile(game, tileXs[j], tileYs[i], 'TileColumn'+(j+1), tileGroup));

				let currFn = j<3?button1Click:button2Click;
				buttons[i].push(new Button(game, tileXs[j], tileYs[i], j+1, i+1, buttonGroup, currFn));
			}
		}
		player1 = new Player(game, 1);
      	player1.inputEnabled = true;
		player2 = new Player(game, 2);

		damageGroup = game.add.group();
		damageGroup.enableBody = true;

		player1Text = game.add.text(25, 25, 'Player 1 Health: ', { fontSize: '32px', fill: '#ffffff'});
		player2Text = game.add.text(500, 25, 'Player 2 Health: ',  { fontSize: '32px', fill: '#ffffff'});
		text = game.add.text(320, 50, '', { fontSize: '12px', fill: '#ffffff'} )
	},
	update: function(){
		player1.events.onInputDown.add(p1click, this);
		player2.events.onInputDown.add(p2click, this);
		background.events.onInputDown.add(bgclick, this);

		player1Text.text = 'Player 1 Health: ' + player1.health;
		player2Text.text = 'Player 2 Health: ' + player2.health; // showing the health of each
		text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter;

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

function btnReset(xIndex, yIndex){
	let btn = buttons[yIndex][xIndex];
	//The "kill" function just stops phaser from paying attention to the object. It's still around.
	//The "reset" function makes it show up and stuff again.
	btn.reset(btn.x, btn.y);
}

function showBtns(player){
	if(player.xCoord != 1 && player.xCoord != 4){
		//as long as it's not on the left edge of a map
		btnReset(player.xCoord-2, player.yCoord-1);
	}
	if(player.xCoord != 3 && player.xCoord != 6){
		//as long as it's not on the right edge of a map
		btnReset(player.xCoord, player.yCoord-1);
	}
	if(player.yCoord != 1){
		//as long as it's not on the top edge of a map
		btnReset(player.xCoord-1, player.yCoord-2);
	}
	if(player.yCoord != 3){
		//as long as it's not on the bottom edge of a map
		btnReset(player.xCoord-1, player.yCoord);
	}
}

function p1click() {
	if (phaseCounter == 0 && turnCounter == 0) {
		showBtns(player1);
		background.inputEnabled = true;
		player1.inputEnabled = false;
		phaseCounter = 1;
	}
}

function p2click() { //do the same with when player 2 is clicked
	if (phaseCounter == 0 && turnCounter == 1) {
		showBtns(player2);
		background.inputEnabled = true;
		player2.inputEnabled = false;
		phaseCounter = 1;
	}
}

function bgclick(){
	//back up a state if you click on the background when you're supposed to click a button/square (I think a lot of games do this kind of thing?)
	if(phaseCounter == 1){
		buttonGroup.forEachAlive(function (c) { c.kill(); });
		phaseCounter = 0;
		background.inputEnabled = false;
		if(turnCounter == 0) player1.inputEnabled = true;
		else player2.inputEnabled = true;
	}
}

function button1Click(x, y) { //when one of the buttons created by the previous function is created
	//console.log('im here');
	player1.x = -77 + 130*x; //move the player to a certain spot depending on where the button was
	player1.y = 194 + 95*y;
	player1.xCoord = x;
	player1.yCoord = y;
	
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	//player2.inputEnabled = true;

	//turnCounter = 1;
	phaseCounter = 2;
}
function button2Click(x, y) { // same with player 2
	//console.log('im here 2');
	player2.x = -62 + 130*x;
	player2.y = 194 + 95*y;
	player2.yCoord = y;
	player2.xCoord = x;

	buttonGroup.forEachAlive(function (c) { c.kill(); });
	//player1.inputEnabled = true;
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