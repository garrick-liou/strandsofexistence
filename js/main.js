//game is created lower down just before the function that puts all the states together
var game;
var background, p1Grid, p2Grid;
var turnCounter, phaseCounter;
var attacks;
var lastAttack, selectedPlayer;

var TILE_SCALE_X = 0.7;
var TILE_SCALE_Y = 0.55;

//temporary solution, I'm not entirely sure we'll need these groups
var damageBarGroup, gainBarGroup, borderBarGroup;

var winner;

var JSsources = ['phases', 'input', 'attacks', 'Tile', 'Player'];

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
				finished++;//as unlikely as it already is that two scripts will load at the same time and both run the callback... might as well.
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
	  //after js assets are loaded, move to main menu
	  loadSources(function(){game.state.start('MainMenu');});
   }
}

statesObject.MainMenu =  {
   create: function() {
      console.log('MainMenu create');
      game.add.sprite(230, 200, 'atlas', 'logo'); //placeholder logo and maybe button text, who knows
      game.add.button(150, 350, 'atlas', function() {game.state.start('InstructionScreen')}, this, 'ButtonInst', 'ButtonInst', 'ButtonInst');
      game.add.button(150, 475, 'atlas', function() {game.state.start('GameLoop')}, this, 'ButtonPlay', 'ButtonPlay', 'ButtonPlay');
   }
}

statesObject.InstructionScreen = {
	create: function() {
		game.add.text(140, 120, 'Click on your players to see the squares you can move to.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' });
		game.add.text(30, 170, 'After moving, press 1 to see your attack range. Press ENTER to confirm your attack.' , { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' });
		game.add.text(90, 220, 'Or press BACKSPACE to move another character. Player 1 moves first.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' });
		game.add.text(100, 270, 'Fire beats Plant, beats Water, beats Fire. Use this to your advantage.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' } )
		game.add.button(150, 425, 'atlas', function() {game.state.start('MainMenu')}, this, 'ButtonReturn', 'ButtonReturn', 'ButtonReturn');
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

		//add grids -- 130/1.1 etc. because I wanted to use the same tiles for the time being, and we know 130 is the distance they were apart
		//when it worked, and because tiles are set apart by 10% padding
		p1Grid = new Grid(5, 305,//grid offset (position of upper left)
			4, 5,//w/h in number of tiles
			TILE_SCALE_X * 130/1.1, TILE_SCALE_Y * 95/1.1,//w/h of the tile sprites
			1);//who owns this side?
		
		p2Grid = new Grid(410, 305,//grid offset
			4, 5,//w/h in number of tiles
			TILE_SCALE_X * 130/1.1, TILE_SCALE_Y * 95/1.1,//w/h of the tile sprites
			2);//who owns this side?

		damageBarGroup = game.add.group();               
		gainBarGroup = game.add.group(); 
		borderBarGroup = game.add.group();
		new Player(p1Grid, 1);
		new Player(p2Grid, 2);
		new Player(p1Grid, 3);
		new Player(p2Grid, 4);
		new Player(p1Grid, 5);
		new Player(p2Grid, 6);

		text = game.add.text(320, 50, '', { fontSize: '12px', fill: '#ffffff'} );
		text2 = game.add.text(320, 90, '', { fontSize: '12px', fill: '#ffffff'} );
		text3 = game.add.text(320, 130, '', { fontSize: '12px', fill: '#ffffff'} );
		//I don't think this is necessary, but I'll keep it written here for now
		//game.world.bringToTop(gainBarGroup);
		//game.world.bringToTop(borderBarGroup);

		setPhase(0);
		//allow player to "click off" to go back to the start of the turn
		background.events.onInputDown.add(cancelPressed, this);
		background.inputEnabled = true;
	},
	update: function(){
		text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter

		p1Grid.players.forEach(function(p){
			p.bar.update();
		});
		p2Grid.players.forEach(function(p){
			p.bar.update();
		});

		if(game.input.keyboard.justPressed(Phaser.Keyboard.BACKSPACE)){
			cancelPressed();
		}

		if (phaseCounter > 1 && phaseCounter < 4) { // if the player has already moved
			
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
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to restart
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