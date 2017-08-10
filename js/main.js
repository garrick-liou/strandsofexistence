var game = new Phaser.Game(800, 600, Phaser.AUTO);
var turnCounter = 0;
var phaseCounter = 0;
var squares, buttons;

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
				//game.add.sprite(tileXs[j], tileYs[i], 'atlas', 'TileColumn'+(j+1));
				squares[i].push(new Tile(game, tileXs[j], tileYs[i], 'TileColumn'+(j+1), tileGroup));

				let currFn = j<4?button1Click:button2Click;
				buttons[i].push(new Button(game, tileXs[j], tileYs[i], j+1, i+1, buttonGroup, currFn));
			}
		}
		player1 = new Player(game, 'atlas', 'Player1_01', 1);
		player2 = new Player(game, 'atlas', 'Player2_01', 2);

		player1Text = game.add.text(25, 25, 'Player1 x: y:', { fontSize: '32px', fill: '#ffffff'});
		player2Text = game.add.text(500, 25, 'Player2 x: y:',  { fontSize: '32px', fill: '#ffffff'});
		text = game.add.text(220, 50, '', { fontSize: '12px', fill: '#ffffff'} )
	},
	update: function(){    
			//which player is moving?
		player1.events.onInputDown.add(p1click, this);   		
		player2.events.onInputDown.add(p2click, this);   		
		player1Text.text = 'Player1 x: ' + player1.xCoord + " y: " + player1.yCoord;
		player2Text.text = 'Player2 x: ' + player2.xCoord + ' y: ' + player2.yCoord;
		text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter;
	}
}
var GameOver = function(game) {};
GameOver.prototype = {
   create: function(){      
   	//unused for now
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
	}
	phaseCounter = 1;
}

function p2click() {
	if (phaseCounter == 0 && turnCounter == 1) {
		showBtns(player2);
	}
	//is this supposed to have "phaseCounter = 1?"
}

function button1Click(x, y) {
	console.log('im here');
	player1.x = -77 + 130*x;
	player1.y = 194 + 95*y;
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	turnCounter = 1;
	phaseCounter = 0;
}
function button2Click(x, y) {
	console.log('im here 2');
	player2.x = -62 + 130*x;
	player2.y = 194 + 95*y;
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	turnCounter = 0;
	phaseCounter = 0;
}

game.state.add('LoadScreen', LoadScreen);
game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');