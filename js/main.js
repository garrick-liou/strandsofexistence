//game is created lower down just before the function that puts all the states together
var game;
var background, p1Grid, p2Grid;
var turnCounter, phaseCounter, phaseText, phaseText2;
var attacks;
var lastAttack, selectedPlayer;
var turnsPlayed = 0;

var TILE_SCALE_X = 0.7;
var TILE_SCALE_Y = 0.55;

//temporary solution, I'm not entirely sure we'll need these groups
var damageBarGroup, gainBarGroup, borderBarGroup;

var winner;

var JSsources = ['phases', 'input', 'elements', 'attacks', 'Tile', 'Player', 'LifeBar'];

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
		//load audio
		game.load.audio('fire', 'audio/fire-spell-01.wav');
		game.load.audio('Silverbgm', 'audio/Silver Flame.mp3');
		game.load.audio('Truthbgm', 'audio/Truth in the Stones.mp3');
	},
	create: function() {	
		logoimage = game.add.sprite(game.width/2, game.height/2, 'atlas', 'logoIMG');	
		logoimage.anchor.setTo(0.5);
		logoimage.scale.setTo(0.75);	
		game.add.sprite(game.width/2, game.height/2, 'atlas', 'logo').anchor.setTo(0.5, 0.5);
		console.log('LoadScreen create');//play menu music
		truthbgm = game.add.audio('Truthbgm');
		truthbgm.onDecoded.add(start, this);

		//play music
		function start(){
			truthbgm.play('', 0, 0.5, true);
			game.state.start('MainMenu');
		}
		//after js assets are loaded, move to main menu
		loadSources(function(){
		});
	}
}
//make sure song plays only once
var flag = 0;

statesObject.MainMenu =  {
	create: function() {
		console.log('MainMenu create');
		menubg = game.add.sprite(0, 0, 'atlas', 'menubg');
		menubg.alpha = 0.5;
		game.add.sprite(game.width/2, 40, 'atlas', 'Strands').anchor.setTo(0.5, 0); //placeholder logo and maybe button text, who knows
		game.add.sprite(game.width/2, 125, 'atlas', 'Of').anchor.setTo(0.5, 0);
		game.add.sprite(game.width/2, 230, 'atlas', 'Existence').anchor.setTo(0.5, 0);
		game.add.button(150, 350, 'atlas', function() {game.state.start('InstructionScreen')}, this, 'ButtonInst', 'ButtonInst', 'ButtonInst');
		game.add.button(150, 475, 'atlas', function() {game.state.start('GameLoop')}, this, 'ButtonPlay', 'ButtonPlay', 'ButtonPlay');
	}
}

statesObject.InstructionScreen = {
	create: function() {
		menubg = game.add.sprite(0, 0, 'atlas', 'menubg');
      	menubg.alpha = 0.5;
		box = game.add.sprite(0, 0, 'atlas', 'textBox');
		box.alpha = 0.75;
		game.add.text(game.width/2, 90, 'Click on your players to see the squares you can move to.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' }).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 135, 'After moving, you\'ll see the area your attack will hit.' , { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' }).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 180, 'Pressing ENTER confirms that attack, BACKSPACE resets the turn.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' }).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 245, 'Flame burns Plant - Plant absorbs Water - Water douses Flame.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' } ).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 290, 'However, any attack you pull off will hurt its targets.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' } ).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 335, 'Also, characters with smaller attacks pack a bigger punch.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' } ).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 380, 'Finally, losing an ally regains health to those that remain alive.', { font: 'Garamond', fontSize: '22px', fill: '#d6dbdf' } ).anchor.setTo(0.5, 0);
		game.add.button(80, 425, 'atlas', function() {game.state.start('MainMenu')}, this, 'ButtonReturn', 'ButtonReturn', 'ButtonReturn');
		game.add.button(620, 425, 'atlas', function() {game.state.start('CreditsScreen')}, this, 'CreditsButton', 'CreditsButton', 'CreditsButton');
	},
	update: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){
			game.state.start('GameLoop');
		}
	}
}

statesObject.CreditsScreen = {
	create: function() {

		game.add.text(game.width/2, 40, 'Head Developer', { font: 'Garamond', fontSize: '32px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 80, 'Garrick Liou', { font: 'Garamond', fontSize: '24px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 120, 'Head Programmer', { font: 'Garamond', fontSize: '32px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 160, 'Elias Klein', { font: 'Garamond', fontSize: '24px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 200, 'Head Artist/Sound Guy', { font: 'Garamond', fontSize: '32px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 240, 'David Sherbinin', { font: 'Garamond', fontSize: '24px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 300, 'Menu BGM: "Truth in the Stones"', { font: 'Garamond', fontSize: '18px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 320, 'Game BGM: "Silver Flame"', { font: 'Garamond', fontSize: '18px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 360, 'BGM by Kevin MacLeod ', { font: 'Garamond', fontSize: '18px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 380, 'under Creative Commons by Attribution License 3.0 ', { font: 'Garamond', fontSize: '18px', fill: '#ffffff'}).anchor.setTo(0.5, 0);
		game.add.text(game.width/2, 410, 'SFX found on freesound.com', { font: 'Garamond', fontSize: '18px', fill: '#ffffff'}).anchor.setTo(0.5, 0);

		game.add.button(150, 450, 'atlas', function() {game.state.start('InstructionScreen')}, this, 'ButtonReturn', 'ButtonReturn', 'ButtonReturn');
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
		p1Grid = new Grid(25, 250,//grid offset (position of upper left)
			4, 5,//w/h in number of tiles
			TILE_SCALE_X * 130/1.1, TILE_SCALE_Y * 95/1.1,//w/h of the tile sprites
			1);//who owns this side?
		
		p2Grid = new Grid(415, 250,//grid offset
			4, 5,//w/h in number of tiles
			TILE_SCALE_X * 130/1.1, TILE_SCALE_Y * 95/1.1,//w/h of the tile sprites
			2);//who owns this side?

		p1Enter = game.add.sprite(50, 525, 'atlas', 'enter');
		p1Enter.events.onInputDown.add(confirmPressed);
		p2Enter = game.add.sprite(680, 525, 'atlas', 'enter');
		p2Enter.events.onInputDown.add(confirmPressed);
		p1Back = game.add.sprite(150, 525, 'atlas', 'backspace');
		p2Back = game.add.sprite(580, 525, 'atlas', 'backspace');

		phaseText = game.add.text(game.width/2, 170, 'Player 1, your turn to move.', { font: 'Garamond', fontSize: '26px', fill: '#eeeeee', stroke: '#000000', strokeThickness: 4 });
		phaseText.anchor.setTo(0.5, 0);
		phaseText2 = game.add.text(game.width/2, 200, 'Click on a character or the square they\'re on.', { font: 'Garamond', fontSize: '20px', fill: '#eeeeee', stroke: '#000000', strokeThickness: 4 });
		phaseText2.anchor.setTo(0.5, 0);
		damageBarGroup = game.add.group();
		gainBarGroup = game.add.group(); 
		borderBarGroup = game.add.group();
		new Player(p1Grid, 1);
		new Player(p2Grid, 2);
		new Player(p1Grid, 3);
		new Player(p2Grid, 4);
		new Player(p1Grid, 5);
		new Player(p2Grid, 6);

		setPhase(0);
		//allow player to "click off" to go back to the start of the turn
		background.events.onInputDown.add(cancelPressed, this);
		background.inputEnabled = true;
	},
	update: function(){
		//fadout menu music
        truthbgm.fadeOut(700);
		
		//play game music
		if (flag == 0){
			console.log('GameLoop flag in'); 
			silverbgm = game.add.audio('Silverbgm');
			silverbgm.play('', 0, 0.75, true);
			flag = flag + 1;
		}
		p1Grid.players.forEach(function(p){
			p.bar.update();
		});
		p2Grid.players.forEach(function(p){
			p.bar.update();
		});

		if(game.input.keyboard.justPressed(Phaser.Keyboard.BACKSPACE)){
			cancelPressed();
		}
		if(phaseCounter == 2 && game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) confirmPressed();
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
			game.state.start('MainMenu');
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