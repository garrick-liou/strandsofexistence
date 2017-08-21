var game;
var background, p1Grid, p2Grid;
var turnCounter, phaseCounter;
var attacks;
var lastAttack, selectedPlayer;

var JSsources = ['phases', 'input', 'attacks', 'Tile', 'Player'];

var winner;

//functions for linking js libraries (before running them)
function loadScript(url, callback) {
	//this function copied from:
	//https://stackoverflow.com/questions/950087/

    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
//"load other js files, and when done, do [callback]"
//[callback] is used later as "go to the main menu state"
function loadSources(callback){
	var finished = 0;
	for(var i = 0; i < JSsources.length; i++){
		loadScript('js/' + JSsources[i] + '.js', function(){
			finished++;
			if(finished == JSsources.length){
				finished++;//make it increasingly unlikely that two scripts will load at the same time and both run the callback
				callback();
			}
		});
	}
}

var statesObject = {};

statesObject.LoadScreen = {
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
	  //game.state.start('MainMenu'); //after assets are loaded, move to main menu
	  loadSources(function(){game.state.start('MainMenu');});
   }
}

statesObject.MainMenu =  {
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

statesObject.InstructionScreen = {
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

statesObject.GameLoop = {
	create: function (){
		console.log('GameLoop create'); 

		turnCounter = 0;
		phaseCounter = 0;
		winner = 0;
		lastAttack = null;

		//add background; it can be clicked to "undo" temporary decisions in a sense
		background = game.add.sprite(0, 0, 'atlas', 'background');
		background.scale.setTo(0.78125);

		//add grids -- 130/1.1 etc. because I wanted to use the same tiles for the time being, we know 130 is the distance they were apart
		//when it worked, and because tiles are set apart by 10% padding
		p1Grid = new Grid(game,
			5, 305,//grid offset
			3, 3,//w/h in number of tiles
			130/1.1, 95/1.1,//w/h of the tile sprites
			1);//who owns this side?
		
		p2Grid = new Grid(game,
			410, 305,//grid offset
			3, 3,//w/h in number of tiles
			130/1.1, 95/1.1,//w/h of the tile sprites
			2);//who owns this side?

		//add players, assigning each a grid to play on and indicating their sprite atlas names
		new Player(game, p1Grid, 'Player1_');
		new Player(game, p2Grid, 'Player2_');

		setPhase(0);
		background.events.onInputDown.add(bgclick, this);
	},
	update: function(){
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

		let GO = true;
		p1Grid.players.forEach(function(p){
			if(p.health > 0) GO = false;
		});
		if(GO) {
			winner = 2;
			game.state.start("GameOver");
		}
		GO = true;
		p2Grid.players.forEach(function(p){
			if(p.health > 0) GO = false;
		});
		if(GO) {
			winner = 1;
			game.state.start("GameOver");
		}
	}
}

statesObject.GameOver = {
   	create: function(){
		console.log("Game over screen");
		//show victory/loss screen
		switch(winner){
			case 1:
				game.add.sprite(0, 0, 'atlas', 'P1Win');
				break;
			case 2:
				game.add.sprite(0, 0, 'atlas', 'P2Win');
				break;
			default:
				//somehow a draw
				break;
		}
	},
	update: function(){ //return to start
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to start
			game.state.start('GameLoop');
		}
	}
}

//add states to the game by looping through the statesObject as a dictionary
game = new Phaser.Game(800, 600, Phaser.AUTO);
for(var i in statesObject){
	let fn = function(game){};
	fn.prototype = statesObject[i];
	game.state.add(i, fn);
}
game.state.start('LoadScreen');