var game;
var turnCounter;
var phaseCounter;
var lastAttack, selectedPlayer;
var squares, buttons;
var p1attacks, p2attacks, attacks;
var player1, player2, background, p1Grid, p2Grid;
var damageGroup, playerGroup, buttonGroup;

var JSsources = ['phases', 'input', 'attacks', 'Tile', 'Player'];

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
		lastAttack = null;

		//add background; it can be clicked to "undo" temporary decisions in a sense
		background = game.add.sprite(0, 0, 'atlas', 'background');
		background.scale.setTo(0.78125);

		//add grids and buttons-- buttons get killed immediately after creation, and are reset later as needed
		buttonGroup = game.add.group();

		//130/1.1 etc. because I wanted to use the same tiles for the time being, we know 130 is the distance they were apart
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
		playerGroup = game.add.group();
		player1 = new Player(game, p1Grid, 'Player1_');
		player2 = new Player(game, p2Grid, 'Player2_');

		damageGroup = game.add.group();
		damageGroup.enableBody = true;

		player1Text = game.add.text(25, 25, 'Player 1 Health: ', { fontSize: '32px', fill: '#ffffff'});
		player2Text = game.add.text(500, 25, 'Player 2 Health: ',  { fontSize: '32px', fill: '#ffffff'});
		text = game.add.text(320, 50, '', { fontSize: '12px', fill: '#ffffff'} );

		setPhase(0);
	},
	update: function(){
		player1.events.onInputDown.add(playerClick, this);
		player2.events.onInputDown.add(playerClick, this);
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
statesObject.GameOver = {
   create: function(){
   	//show victory/loss screen
   	if (player1.health <= 0) {
   		game.add.sprite(0, 0, 'atlas', 'P2Win');
   	} else if (player2.health <= 0) {
   		game.add.sprite(0, 0, 'atlas', 'P1Win');
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