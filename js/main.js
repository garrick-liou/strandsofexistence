var game = new Phaser.Game(800, 600, Phaser.AUTO);
var turnCounter = 0;
var phaseCounter = 0;
var lastAttack = null;
var squares, buttons;
var p1attacks, p2attacks;
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

		if (phaseCounter == 2 || phaseCounter == 3) { // if the player has already moved, and hasn't chosen an attack
			if(game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) { //wait for attack button input, 1, 2, or 3 and go to appropriate attack function
				doAttack(1);
			} else if (game.input.keyboard.justPressed(Phaser.Keyboard.TWO)) {
				doAttack(2);
			} else if (game.input.keyboard.justPressed(Phaser.Keyboard.THREE)) {
				doAttack(3);
			}     		
		}
		if (phaseCounter == 3) { // after an attack has been chosen, wait for confirmation with ENTER
			if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
				confirmPressed();
			}
		}
		if (player1.health <= 0 || player2.health <= 0) {
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
	player1.x = -77 + 130*x; //move the player to a certain spot depending on where the button was
	player1.y = 194 + 95*y;
	player1.xCoord = x;
	player1.yCoord = y;
	
	buttonGroup.forEachAlive(function (c) { c.kill(); });

	phaseCounter = 2;
}
function button2Click(x, y) { // same with player 2
	player2.x = -62 + 130*x;
	player2.y = 194 + 95*y;
	player2.yCoord = y;
	player2.xCoord = x;

	buttonGroup.forEachAlive(function (c) { c.kill(); });
	phaseCounter = 2;
}

function attP1A(x, y) { // 1 attacks the row that the player is on, on the enemy player's side
	for(var i = 0; i < 3; i++){
		if(y == i + 1){
			for(j = 3; j < 6; j++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}
function attP2A(x, y) {
	for(var i = 0; i < 3; i++){
		if(i + 1 == y){
			for(j = 0; j < 3; j++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}

function attP1B(x, y) { // 2 attacks the column 3 spaces away, and highlights the tiles to be hit
	for(var j = 3; j < 6; j++){
		if(j - 2 == x){
			for(var i = 0; i < 3; i++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}

function attP2B(x, y) {
	for(var j = 0; j < 3; j++){
		if(j + 4 == x){
			for(var i = 0; i < 3; i++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}

function attP1C(x, y) { // attack 3 attacks the square directly across from you, 3 tiles away
	var d = damageGroup.create(squares[y-1][x+2].x, squares[y-1][x+2].y, 'atlas', 'DamageTile');
	d.xCoord = x + 3;
	d.yCoord = y;
}

function attP2C(x, y) {	
	var d = damageGroup.create(squares[y-1][x-4].x, squares[y-1][x-4].y, 'atlas', 'DamageTile');
	d.xCoord = x - 3;
	d.yCoord = y;
}

p1attacks = [
	{fn:attP1A, dmg:1},
	{fn:attP1B, dmg:1},
	{fn:attP1C, dmg:2}];
p2attacks = [
	{fn:attP2A, dmg:1},
	{fn:attP2B, dmg:1},
	{fn:attP2C, dmg:2}];

function doAttack(number){
	phaseCounter = 3;

	for(var i = damageGroup.getFirstAlive(); i != null; i = damageGroup.getFirstAlive()) i.destroy(); //delete all damage tile sprites

	if (turnCounter == 0) {
		lastAttack = p1attacks[number - 1];
		lastAttack.fn(player1.xCoord, player1.yCoord);
	} else if (turnCounter == 1) {
		lastAttack = p2attacks[number - 1];
		lastAttack.fn(player2.xCoord, player2.yCoord);
	}
}

function confirmPressed() { //when enter is pressed, check to see which attack button was pressed last, check to see if the attack hits, and apply appropriate damage
	var hit = false;
	if(turnCounter == 0){
		//check if the x/y coordinates set earlier match for any damage squares
		damageGroup.forEachAlive(function(sqr){
			if(player2.xCoord == sqr.xCoord && player2.yCoord == sqr.yCoord) hit = true;
		});

		if(hit) player2.health -= lastAttack.dmg;

		turnCounter = 1; //if it was player 1's turn, make it player 2's turn
		player2.inputEnabled = true; //let player 2 click on their character
	} else if(turnCounter == 1){
		damageGroup.forEachAlive(function(sqr){
			if(player1.xCoord == sqr.xCoord && player1.yCoord == sqr.yCoord) hit = true;
		});
		if(hit){
			player1.health -= lastAttack.dmg;
		}
		turnCounter = 0;
		player1.inputEnabled = true;
	}

	for(var i = damageGroup.getFirstAlive(); i != null; i = damageGroup.getFirstAlive()) i.destroy(); //delete all damage tile sprites

	phaseCounter = 0; //and reset the phase to move phase
}

game.state.add('LoadScreen', LoadScreen);
game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('InstructionScreen', InstructionScreen);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');