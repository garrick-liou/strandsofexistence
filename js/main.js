//game is created lower down just before the function that puts all the states together
var game;
var background, p1Grid, p2Grid;
var turnCounter, phaseCounter;
var attacks;
var lastAttack, selectedPlayer;
var attackCounter = 0;
var p1Player = 0;
var p2Player = 0;

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
      game.add.button(150, 350, 'atlas', function() {game.state.start('InstructionScreen')}, this, 'ButtonInst', 'ButtonInst', 'ButtonInst');
      game.add.button(150, 475, 'atlas', function() {game.state.start('GameLoop')}, this, 'ButtonPlay', 'ButtonPlay', 'ButtonPlay');
   }/*,
   update: function() {
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to start
   			game.state.start('InstructionScreen');
   		}
   }*/
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
		background.events.onInputDown.add(bgclick, this);
	},
	update: function(){
		text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter + ' attack: ' + attackCounter;

		p1Grid.players.forEach(function(p){
			p.bar.update();
		});
		p2Grid.players.forEach(function(p){
			p.bar.update();
		});

		if (phaseCounter > 1 && phaseCounter < 4) { // if the player has already moved
			if (game.input.keyboard.justPressed(Phaser.Keyboard.BACKSPACE)){
				cancelPressed();
			}
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

		//we should probably move these and the win check to the function that deals damage, because it's doing a bunch of unnecessary checks each loop
		p1Grid.findDeaths();
		p2Grid.findDeaths();

		//check if anyone's won (important because the next part will be real silly if the game is over)
		if(p1Grid.players.getFirstAlive() == null){
			winner = 2;
			game.state.start("GameOver");
		}
		if(p2Grid.players.getFirstAlive() == null){
			winner = 1;
			game.state.start("GameOver");
		}

		/*if (p1death == 0) {
			if (player1.health <= 0) {
				player1.kill();
				if(player3.alive) {
					if(player3.health <= 40) {
						p3gainBar.x = 25 + (196 * ((player3.health + 10) * 0.02));	   				
						p3gainBar.scale.x = 0.2;
						player3.health += 10;	
					} else {
						p3gainBar.x = 25 + 196;	   				
						p3gainBar.scale.x = (50 - player3.health) * 0.02;
						player3.health = 50;
					}
				}
				if(player5.alive) {
					if(player5.health <= 40) {
						p5gainBar.x = 25 + (196 * ((player5.health + 10) * 0.02));	   				
						p5gainBar.scale.x = 0.2;
						player5.health += 10;
					} else {
						p5gainBar.x = 25 + 196 ;	   				
						p5gainBar.scale.x = (50 - player5.health) * 0.02;
						player5.health = 50;
					}
				}
				p1death = 1;
			}
		}
		if (p2death == 0) {
			if (player2.health <= 0) {
				player2.x = 0;
				player2.y = 0;
				player2.xCoord = 0;
				player2.yCoord = 0;
				player2.kill();
				if(player4.alive) {
					if(player4.health <= 40) {
						p4gainBar.x = 578 + (196 * ((player4.health + 10) * 0.02));
						p4gainBar.scale.x = 0.2;
						player4.health += 10;
					} else {
						p4gainBar.x = 578 + 196;
						p4gainBar.scale.x =(50 - player4.health) * 0.02;
						player4.health = 50;	   				
					}
				}
				if(player6.alive) {
					if(player6.health <= 40) {
						p6gainBar.x = 578 + (196 * ((player6.health + 10) * 0.02));
						p6gainBar.scale.x = 0.2;
						player6.health += 10;
					} else {
						p6gainBar.x = 578 + 196;
						p6gainBar.scale.x =(50 - player6.health) * 0.02;
						player6.health = 50;
					}
				}
				p2death = 1;
			}
		}
		if (p3death == 0) {
			if (player3.health <= 0) {
				player3.x = 0;
				player3.y = 0;
				player3.xCoord = 0;
				player3.yCoord = 0;
				player3.kill();
				if(player1.alive) {
					if(player1.health <= 40) {
						p1gainBar.x = 25 + (196 * ((player1.health + 10) * 0.02));	   				
						p1gainBar.scale.x = 0.2;
						player1.health += 10;
					} else {
						p1gainBar.x = 25 + 196;	   				
						p1gainBar.scale.x = (50 - player1.health) * 0.02;
						player1.health = 50;
					}
				}
				if(player5.alive) {
					if(player5.health <= 40) {
						p5gainBar.x = 25 + (196 * ((player5.health + 10) * 0.02));	   				
						p5gainBar.scale.x = 0.2;
						player5.health += 10;
					} else {
						p5gainBar.x = 25 + 196;	   				
						p5gainBar.scale.x = (50 - player5.health) * 0.02;
						player5.health = 50;
					}
				}
				p3death = 1;
			}
		}
		if (p4death == 0) {
			if (player4.health <= 0) {
				player4.x = 0;
				player4.y = 0;
				player4.xCoord = 0;
				player4.yCoord = 0;
				player4.kill();
				if(player2.alive) {
					if(player2.health <= 40) {
						p2gainBar.x = 578 + (196 * ((player2.health + 15) * 0.02));
						p2gainBar.scale.x = 0.2;
						player2.health += 10;
					} else {
						p2gainBar.x = 578 + 196;
						p2gainBar.scale.x =(50 - player2.health) * 0.02;
						player2.health = 50;
					}
				}
				if(player6.alive) {
					if(player6.health <= 40) {
						p6gainBar.x = 578 + (196 * ((player6.health + 15) * 0.02));
						p6gainBar.scale.x = 0.2;
						player6.health += 10;
					} else {
						p6gainBar.x = 578 + 196;
						p6gainBar.scale.x =(50 - player6.health) * 0.02;
						player6.health = 50;
					}
				} 			
				p4death = 1;
			}
		}
		if (p5death == 0) {
			if (player5.health <= 0) {
				player5.x = 0;
				player5.y = 0;
				player5.xCoord = 0;
				player5.yCoord = 0;
				player5.kill();
				if(player1.alive) {
					if(player1.health <= 40) {
						p1gainBar.x = 25 + (196 * ((player1.health + 15) * 0.02));	   				
						p1gainBar.scale.x = 0.2;
						player1.health += 10;
					} else {
						p1gainBar.x = 25 + 196;	   				
						p1gainBar.scale.x = (50 - player1.health) * 0.02;
						player1.health = 50;
					}
				}
				if(player3.alive) {
					if(player3.health <= 40) {
						p3gainBar.x = 25 + (196 * ((player3.health + 15) * 0.02));	   				
						p3gainBar.scale.x = 0.2;
						player3.health += 10;
					} else {
						p3gainBar.x = 25 + 196;	   				
						p3gainBar.scale.x = (50 - player3.health) * 0.02;
						player3.health = 50;
					}
				}
				p5death = 1;
			}
		}
		if(p6death == 0) {
			gainBarGroup.forEachAlive(function(c){ c.bringToTop(); });
			if (player6.health <= 0) {
				player6.x = 0;
				player6.y = 0;
				player6.xCoord = 0;
				player6.yCoord = 0;
				player6.kill();
				if(player2.alive) {
					if(player2.health <= 40) {
						p2gainBar.x = 578 + (196 * ((player2.health + 10) * 0.02));
						p2gainBar.scale.x = 0.2;
						player2.health += 10;
					} else {
						p2gainBar.x = 578 + 196;
						p2gainBar.scale.x =(50 - player2.health) * 0.02;
						player2.health = 50;
					}
				}
				if(player4.alive) {
					if(player4.health <= 40) {
						p4gainBar.x = 578 + (196 * ((player4.health + 10) * 0.02));
						p4gainBar.scale.x = 0.2;
						player4.health += 10;
					} else {
						p4gainBar.x = 578 + 196;
						p4gainBar.scale.x =(50 - player4.health) * 0.02;
						player4.health = 50;
					}
				}
				p6death = 1;
			}
		}	
			
		if (player1.health == 0 && player3.health == 0 && player5.health == 0) {
			winner = 2;
			game.state.start('GameOver');
		} else if (player2.health == 0 && player4.health == 0 && player6.health == 0) {
			winner = 1;
			game.state.start('GameOver');
		}
		if(player1.health >= 0) {
			p1lifeBar.scale.x = player1.health/50;
		} else {
			player1.health = 0;
		}   	  
		if(player2.health >= 0) {
			p2lifeBar.scale.x = player2.health/50;
		} else {
			player2.health = 0;
		}   	 
		if(player3.health >= 0) {
			p3lifeBar.scale.x = player3.health/50;
		} else {
			player3.health = 0;
		}   
		if(player4.health >= 0) {
			p4lifeBar.scale.x = player4.health/50;
		} else {
			player4.health = 0;
		}    
		if(player5.health >= 0) {
			p5lifeBar.scale.x = player5.health/50;
		} else {
			player5.health = 0;
		}    
		if(player6.health >= 0) {
			p6lifeBar.scale.x = player6.health/50;
		} else {
			player6.health = 0;
		}   
		damageBarGroup.forEachAlive(function(c) {   		
			if (c.scale.x > 0) {
				c.scale.x -= .003;
			} else {
				c.scale.x = 0;
			}
		}); 
		gainBarGroup.forEachAlive(function(c) {   		
			if (c.scale.x > 0) {
				c.scale.x -= .003;
			} else {
				c.scale.x = 0;
			}
		}); */	
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




function cancelPressed() {
	movementButton(selectedPlayer.turnStartSquare, selectedPlayer)
	setPhase(0);
}

//add states to the game by looping through the statesObject as a dictionary
game = new Phaser.Game(800, 600, Phaser.AUTO);
for(var i in statesObject){
	let fn = function(game){};
	fn.prototype = statesObject[i];
	game.state.add(i, fn);
}
game.state.start('LoadScreen');