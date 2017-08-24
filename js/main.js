var game = new Phaser.Game(800, 600, Phaser.AUTO);
var turnCounter = 0;
var phaseCounter = 0;
var attackCounter = 0;
var playerClick = 0;
var winner = 0;
var animCounter = 0;
var strongDamage;

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
      game.add.button(150, 350, 'atlas', function() {game.state.start('InstructionScreen')}, this, 'ButtonInst', 'ButtonInst', 'ButtonInst');
      game.add.button(150, 475, 'atlas', function() {game.state.start('GameLoop')}, this, 'ButtonPlay', 'ButtonPlay', 'ButtonPlay');
   }/*,
   update: function() {
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to start
   			game.state.start('InstructionScreen');
   		}
   }*/
}
var InstructionScreen = function(game) {};
InstructionScreen.prototype = {
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
var GameLoop = function(game) {};
GameLoop.prototype = {
   create: function (){
      console.log('GameLoop create'); 
      p1death = 0;
      p2death = 0;
      p3death = 0;
      p4death = 0;
      p5death = 0;
      p6death = 0;
      animCounter = 0;
      turnCounter = 0;
      background = game.add.sprite(0, 0, 'atlas', 'background');
      background.scale.setTo(0.78125);
      //scale background, add tiles
      tileGroup = game.add.group();
      buttonGroup = game.add.group();
      damageGroup = game.add.group();
      lifeBarGroup = game.add.group();  
      damageBarGroup = game.add.group();               
      gainBarGroup = game.add.group(); 
      team1Group = game.add.group(); 
      team2Group = game.add.group();
      for (i = 1; i < 9; i++) {
      	for (j = 1; j < 6; j++) {
      		tile = new Tile(game, i, j);
      		tileGroup.add(tile);
      		game.add.existing(tile);
      	}
      }         
      borderBarGroup = game.add.group();  
      for (i = 1; i < 7; i++) {
      	borderBar = new BorderBar(game, i);
      	borderBarGroup.add(borderBar);
      	game.add.existing(borderBar);
      }
       
      player1 = new Player(game, 1);
      player2 = new Player(game, 2);
      player3 = new Player(game, 3);
      player4 = new Player(game, 4);
      player5 = new Player(game, 5);
      player6 = new Player(game, 6);
      team1Group.add(player1);
      team2Group.add(player2);
      team1Group.add(player3);
      team2Group.add(player4);
      team1Group.add(player5);
      team2Group.add(player6);
      game.add.existing(player1);
      player1.inputEnabled = true;
      game.add.existing(player2);
      player2.inputEnabled = true;
      game.add.existing(player3);
      player3.inputEnabled = true;
      game.add.existing(player4);
      player4.inputEnabled = true;
      game.add.existing(player5);
      player5.inputEnabled = true;
      game.add.existing(player6);
      player6.inputEnabled = true;
      for (i = 1; i < 7; i++) {
      	borderBar = new BorderBar(game, i);
      	lifeBar = new LifeBar(game, i);
      	gainBar = new ChangeBar(game, i, 'gain');      	
		gainBar.anchor.setTo(1,0);
      	damageBar = new ChangeBar(game, i, 'damage');
      	borderBarGroup.add(borderBar);
      	lifeBarGroup.add(lifeBar);
      	gainBarGroup.add(gainBar);
      	damageBarGroup.add(damageBar);
      	game.add.existing(lifeBar);
      	game.add.existing(gainBar);
      	game.add.existing(damageBar);      	
      	game.add.existing(borderBar);
      }
            //add characters and add character animations
      //the floating characters are at the center of their squares
      player1.animations.add('p1_float', Phaser.Animation.generateFrameNames('Player1_', 1, 12, '', 2), 20, true);
      player1.animations.add('p1_turn', Phaser.Animation.generateFrameNames('Player1Turn_', 1, 12, '', 2), 20, true);
      player1.animations.play('p1_float');
      player1.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);
      player2.animations.add('p2_float', Phaser.Animation.generateFrameNames('Player2_', 1, 12, '', 2), 20, true);      
      player2.animations.add('p2_turn', Phaser.Animation.generateFrameNames('Player2Turn_', 1, 12, '', 2), 20, true);
      player2.animations.play('p2_float');
      player2.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);
      player3.animations.add('p3_float', Phaser.Animation.generateFrameNames('Player3_', 1, 12, '', 2), 20, true);      
      player3.animations.add('p3_turn', Phaser.Animation.generateFrameNames('Player3Turn_', 1, 12, '', 2), 20, true);
      player3.animations.play('p3_float');
      player3.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);
      player4.animations.add('p4_float', Phaser.Animation.generateFrameNames('Player4_', 1, 12, '', 2), 20, true);
      player4.animations.add('p4_turn', Phaser.Animation.generateFrameNames('Player4Turn_', 1, 12, '', 2), 20, true);
      player4.animations.play('p4_float');
      player4.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);
      player5.animations.add('p5_float', Phaser.Animation.generateFrameNames('Player5_', 1, 12, '', 2), 20, true);
      player5.animations.add('p5_turn', Phaser.Animation.generateFrameNames('Player5Turn_', 1, 12, '', 2), 20, true);
      player5.animations.play('p5_float');
      player5.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);
      player6.animations.add('p6_float', Phaser.Animation.generateFrameNames('Player6_', 1, 12, '', 2), 20, true);
      player6.animations.add('p6_turn', Phaser.Animation.generateFrameNames('Player6Turn_', 1, 12, '', 2), 20, true);
      player6.animations.play('p6_float');
      player6.animations.currentAnim.setFrame(Math.floor(Math.random() * 12) + 1, true);
      text = game.add.text(320, 50, '', { fontSize: '12px', fill: '#ffffff'} );
      text2 = game.add.text(320, 90, '', { fontSize: '12px', fill: '#ffffff'} );
      text3 = game.add.text(320, 130, '', { fontSize: '12px', fill: '#ffffff'} );
   },
   update: function(){
   	player1.events.onInputDown.add(function() {
   		if (turnCounter == 0) {
   			if (phaseCounter < 2) {
   				buttonsSpawn(player1.xCoord, player1.yCoord, 1)
   			}
   		}
   	}, this);  
   	player3.events.onInputDown.add(function() {
   		if (turnCounter == 0) {
   			if (phaseCounter < 2) {
   				buttonsSpawn(player3.xCoord, player3.yCoord, 3)
   			}
   		}
   	}, this);  
   	player5.events.onInputDown.add(function() {
   		if (turnCounter == 0) {
   			if (phaseCounter < 2) {
   				buttonsSpawn(player5.xCoord, player5.yCoord, 5)
   			}
   		}
   	}, this);
   	player2.events.onInputDown.add(function() {
   		if (turnCounter == 1) {
   			if (phaseCounter < 2) {
   				buttonsSpawn(player2.xCoord, player2.yCoord, 2)
   			}
   		}
   	}, this); 
   	player4.events.onInputDown.add(function() {
		if (turnCounter == 1) {
   			if (phaseCounter < 2) {
   				buttonsSpawn(player4.xCoord, player4.yCoord, 4)
   			}
   		}
   	}, this); 
   	player6.events.onInputDown.add(function() {
   		if (turnCounter == 1) {
   			if (phaseCounter < 2) {
   				buttonsSpawn(player6.xCoord, player6.yCoord, 6)
   			}
   		}
   	}, this);    			
		  
	   		//which player is moving?
			
	   		 
	   	if (animCounter == 0) {
	   		if (turnCounter == 0) {   			
	   			frameNum1 = player1.animations.currentAnim.frame;  
	   			player1.animations.stop(); 			
	   			player1.animations.play('p1_turn');
	   			player1.animations.currentAnim.setFrame(frameNum1, true);   			
	   			frameNum3 = player3.animations.currentAnim.frame;
	   			player3.animations.stop();   			
	   			player3.animations.play('p3_turn');
	   			player3.animations.currentAnim.setFrame(frameNum3, true);
	   			frameNum5 = player5.animations.currentAnim.frame;   	
	   			player5.animations.stop();		
	   			player5.animations.play('p5_turn');
	   			player5.animations.currentAnim.setFrame(frameNum5, true); 
	   			frameNum2 = player2.animations.currentAnim.frame;   
	   			player2.animations.stop();  			
	   			player2.animations.play('p2_float');
	   			player2.animations.currentAnim.setFrame(frameNum2, true);
	   			frameNum4 = player4.animations.currentAnim.frame;   	
	   			player4.animations.stop();		
	   			player4.animations.play('p4_float');
	   			player4.animations.currentAnim.setFrame(frameNum4, true);
	   			frameNum6 = player6.animations.currentAnim.frame;   
	   			player6.animations.stop();			
	   			player6.animations.play('p6_float');
	   			player6.animations.currentAnim.setFrame(frameNum6, true);  			
	   		} else if (turnCounter == 1) {   			
	   			frameNum1 = player1.animations.currentAnim.frame; 
	   			player1.animations.stop();  			
	   			player1.animations.play('p1_float');
	   			player1.animations.currentAnim.setFrame(frameNum1, true);
	   			frameNum3 = player3.animations.currentAnim.frame;   	
	   			player3.animations.stop();		
	   			player3.animations.play('p3_float');
	   			player3.animations.currentAnim.setFrame(frameNum3, true);
	   			frameNum5 = player5.animations.currentAnim.frame;
	   			player5.animations.stop();   			
	   			player5.animations.play('p5_float');
	   			player5.animations.currentAnim.setFrame(frameNum5, true); 
	   			frameNum2 = player2.animations.currentAnim.frame;    
	   			player2.animations.stop(); 			
	   			player2.animations.play('p2_turn');
	   			player2.animations.currentAnim.setFrame(frameNum2, true);
	   			frameNum4 = player4.animations.currentAnim.frame;  
	   			player4.animations.stop(); 			
	   			player4.animations.play('p4_turn');
	   			player4.animations.currentAnim.setFrame(frameNum4, true);
	   			frameNum6 = player6.animations.currentAnim.frame;   		
	   			player6.animations.stop();	
	   			player6.animations.play('p6_turn');
	   			player6.animations.currentAnim.setFrame(frameNum6, true);  
	   		}
	   		animCounter = 1;
	   	} 
	   	text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter + ' attack: ' + attackCounter;
	   	text2.text = 'player ' + playerClick + ' animations: ' + animCounter;
	   	if (phaseCounter > 1 && phaseCounter < 4) { // if the player has already moved
	   		if (game.input.keyboard.justPressed(Phaser.Keyboard.BACKSPACE)){
	   			cancelPressed();
	   		}
	   		if (game.input.keyboard.justPressed(Phaser.Keyboard.Q)) {
	   			attackShow(playerClick);
	   		}	
	   	}
	   	if (phaseCounter == 3) {
	   	 // after an attack has been chosen, wait for confirmation with ENTER
	   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
	   			damageCheck();
	   		}
	   	}	
	   	if (player1.health == 0 && player3.health == 0 && player5.health == 0) {
	   		winner = 2;
	   		game.state.start('GameOver');
	   	} else if (player2.health == 0 && player4.health == 0 && player6.health == 0) {
	   		winner = 1;
	   		game.state.start('GameOver');
	   	}	   	
		text3.text = player1.health + ' ' + player2.health + ' ' + player3.health + ' ' + player4.health + ' ' + player5.health + ' ' + player6.health;
	}
}
var GameOver = function(game) {};
GameOver.prototype = {
   create: function(){      
      //show victory/loss screen
      if (winner == 2) {
         game.add.sprite(0, 0, 'atlas', 'P2Win');
      } else if (winner == 1) {
         game.add.sprite(0, 0, 'atlas', 'P1Win');
      }
   },
   update: function(){ //return to start
      if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)){ //press enter to start
            game.state.start('GameLoop');
         }
   }
} 

function buttonsSpawn(x, y, player) {
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	phaseCounter = 1;
	playerClick = player;
	if (playerClick == 1) {
		player1.memory = [x, y];
	} else if (playerClick == 2) {
		player2.memory = [x, y];
	} else if (playerClick == 3) {
		player3.memory = [x, y];
	} else if (playerClick == 4) {
		player4.memory = [x, y];
	} else if (playerClick == 5) {
		player5.memory = [x, y];
	} else if (playerClick == 6) {
		player6.memory = [x, y];
	}
	if (phaseCounter < 2) {		
		buttonCreate(x, y);
		if (y == 1) {

		} else {
			buttonCreate(x, y - 1);
		}
		if (y == 5) {

		} else {
			buttonCreate(x, y + 1);
		}
		if (x == 1 || x == 5) {

		} else {
			buttonCreate(x - 1, y);
		}
		if (x == 4 || x == 8) {

		} else {
			buttonCreate(x + 1, y);
		}
	}
}

function buttonCreate(x, y) {
	if (player1.xCoord == x && player1.y == y) {

	} else if (player2.xCoord == x && player2.y == y) {

	} else if (player3.xCoord == x && player3.y == y) {

	} else if (player4.xCoord == x && player4.y == y) {

	} else if (player5.xCoord == x && player5.y == y) {

	} else if (player6.xCoord == x && player6.y == y) {

	} else {		
		button = game.add.button(90 * x - 55, 120 + 75 * y, 'atlas', function() {buttonClick(x,y)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
		buttonGroup.add(button);
	}
}

function buttonClick(x, y) { //when one of the buttons created by the previous function is created
   //console.log('im here'); 
   	if (playerClick == 1) {
   		player1.xCoord = x;
   		player1.yCoord = y;
  	} else if (playerClick == 2) {
   		player2.xCoord = x;
   		player2.yCoord = y;
  	} else if (playerClick == 3) {
   		player3.xCoord = x;
   		player3.yCoord = y;
   	} else if (playerClick == 4) {
   		player4.xCoord = x;
   		player4.yCoord = y;
   	} else if (playerClick == 5) {
   		player5.xCoord = x;
   		player5.yCoord = y;
   	} else if (playerClick == 6) {
   		player6.xCoord = x;
   		player6.yCoord = y;
   	}   
	buttonGroup.forEachAlive(function (c) { c.kill(); }); // delete the existing buttons, waiting for next move phase
	phaseCounter = 2; //increment phase counter to attack phase
}

function attackShow(atkP) {
	phaseCounter = 3;
	if (atkP % 2 == 1) {
		if (atkP == 1) {
			damage = game.add.sprite((player1.xCoord + 4) * 90 - 55, player1.yCoord * 75 + 120, 'atlas', 'DamageTile');
			damage.xCoord = player1.xCoord + 4;
			damage.yCoord = player1.yCoord;
			damage.type = 'fire';
			damage.base = 12;
			damageGroup.add(damage);
		} else if (atkP == 3) {
			for (i = 1; i < 6; i++) {
				damage = game.add.sprite((player3.xCoord + 4) * 90 - 55, i * 75 + 120, 'atlas', 'DamageTile');
				damage.xCoord = player3.xCoord + 4;
				damage.yCoord = i;
				damage.type = 'grass';
				damage.base = 8;
				damageGroup.add(damage);
			}
		} else if (atkP == 5) {
			for (i = 5; i < 9; i++) {
				damage = game.add.sprite(i * 90 - 55, player5.yCoord * 75 + 120, 'atlas', 'DamageTile');
				damage.xCoord = i;
				damage.yCoord = player5.yCoord;
				damage.type = 'water';
				damage.base = 8;
				damageGroup.add(damage);
			}
		}
	} else if (atkP % 2 == 0) {
		if (atkP == 2) {
			damage = game.add.sprite((player2.xCoord - 4) * 90 - 55, player2.yCoord * 75 + 120, 'atlas', 'DamageTile');
			damage.xCoord = player2.xCoord - 4;
			damage.yCoord = player2.yCoord;
			damage.type = 'fire';
			damage.base = 12;
			damageGroup.add(damage);
		} else if (atkP == 4) {
			for (i = 1; i < 6; i++) {
				damage = game.add.sprite((player4.xCoord - 4) * 90 - 55, i * 75 + 120, 'atlas', 'DamageTile');
				damage.xCoord = player4.xCoord - 4;
				damage.yCoord = i;
				damage.type = 'grass';
				damage.base = 8;
				damageGroup.add(damage);
			}
		} else if (atkP == 6) {
			for (i = 1; i < 5; i++) {
				damage = game.add.sprite(i * 90 - 55, player6.yCoord * 75 + 120, 'atlas', 'DamageTile');
				damage.xCoord = i;
				damage.yCoord = player6.yCoord;
				damage.type = 'water';
				damage.base = 8;
				damageGroup.add(damage);
			}
		}
	}
}

function damageCheck() {
	if (turnCounter == 0) {
		damageGroup.forEachAlive(function(c) {
			if(c.xCoord == player2.xCoord && c.yCoord == player2.yCoord){
				if(c.type == 'fire') {
					updateDamage(2, c.base);
				} else if(c.type == 'water') {
					updateDamage(2, c.base * 1.5);
				} else if(c.type == 'grass') {
					updateDamage(2, c.base * 0.5);
				}
			}  else if(c.xCoord == player4.xCoord && c.yCoord == player4.yCoord){
				if(c.type == 'fire') {
					updateDamage(4, c.base * 1.5);
				} else if(c.type == 'water') {
					updateDamage(4, c.base * 0.5);
				} else if(c.type == 'grass') {
					updateDamage(4, c.base);
				}
			} else if(c.xCoord == player6.xCoord && c.yCoord == player6.yCoord){
				if(c.type == 'fire') {
					updateDamage(6, c.base * 0.5);
				} else if(c.type == 'water') {
					updateDamage(6, c.base);
				} else if(c.type == 'grass') {
					updateDamage(6, c.base * 1.5);
				}
			}
		});
	} else if (turnCounter == 1) {
		damageGroup.forEachAlive(function(c) {
			if(c.xCoord == player1.xCoord && c.yCoord == player1.yCoord){
				if(c.type == 'fire') {
					updateDamage(1, c.base);
				} else if(c.type == 'water') {
					updateDamage(1, c.base * 1.5);
				} else if(c.type == 'grass') {
					updateDamage(1, c.base * 0.5);
				}
			}  else if(c.xCoord == player3.xCoord && c.yCoord == player3.yCoord){
				if(c.type == 'fire') {
					updateDamage(3, c.base * 1.5);
				} else if(c.type == 'water') {
					updateDamage(3, c.base * 0.5);
				} else if(c.type == 'grass') {
					updateDamage(3, c.base);
				}
			} else if(c.xCoord == player5.xCoord && c.yCoord == player5.yCoord){
				if(c.type == 'fire') {
					updateDamage(5, c.base * 0.5);
				} else if(c.type == 'water') {
					updateDamage(5, c.base);
				} else if(c.type == 'grass') {
					updateDamage(5, c.base * 1.5);
				}
			}
		});
	}
	damageGroup.forEachAlive(function(c) { c.kill(); }) //delete all damage tile sprites	
	if (turnCounter == 0) {
		turnCounter = 1; //if it was player 1's turn, make it player 2's turn
	} else {
		turnCounter = 0; //vice versa
	}
	phaseCounter = 0; //and reset the phase to move phase
	animCounter = 0;
}

function updateDamage(player, damage) {
	if (player == 1) {
		a = player1.health;
		player1.health -= damage;
	} else if (player == 2) {
		a = player2.health;
		player2.health -= damage;
	} else if (player == 3) {
		a = player3.health;
		player3.health -= damage;
	} else if (player == 4) {
		a = player4.health;
		player4.health -= damage;
	} else if (player == 5) {
		a = player5.health;
		player5.health -= damage;
	} else if (player == 6) {
		a = player6.health;
		player6.health -= damage;
	}
	damageBarGroup.forEachAlive(function(c) {
		console.log('hello');
		if (c.player != player) {
			console.log(c.player);
		}
	});
}

function cancelPressed() {
	if (playerClick == 1) {
		player1.xCoord = player1.memory[0];
		player1.yCoord = player1.memory[1];
	} else if (playerClick == 2) {
		player2.xCoord = player2.memory[0];
		player2.yCoord = player2.memory[1];
	} else if (playerClick == 3) {
		player3.xCoord = player3.memory[0];
		player3.yCoord = player3.memory[1];
	} else if (playerClick == 4) {
		player4.xCoord = player4.memory[0];
		player4.yCoord = player4.memory[1];
	} else if (playerClick == 5) {
		player5.xCoord = player5.memory[0];
		player5.yCoord = player5.memory[1];
	} else if (playerClick == 6) {
		player6.xCoord = player6.memory[0];
		player6.yCoord = player6.memory[1];
	} else 
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	damageGroup.forEachAlive(function (c) { c.kill(); });
	phaseCounter = 0;
}

game.state.add('LoadScreen', LoadScreen);
game.state.add('MainMenu', MainMenu); //load states
game.state.add('GameLoop', GameLoop);
game.state.add('InstructionScreen', InstructionScreen);
game.state.add('GameOver', GameOver);
game.state.start('LoadScreen');