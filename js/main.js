var game = new Phaser.Game(800, 600, Phaser.AUTO);
var turnCounter = 0;
var phaseCounter = 0;
var attackCounter = 0;
var p1Player = 0;
var p2Player = 0;
var winner = 0;
var animCounter = 0;

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
      lifeBarGroup = game.add.group();  
      damageBarGroup = game.add.group();               
      gainBarGroup = game.add.group(); 
      borderBarGroup = game.add.group();
      team1Group = game.add.group(); 
      team2Group = game.add.group(); 
      player1 = new Player(game, 'atlas', 'Player1_01', 1);
      player2 = new Player(game, 'atlas', 'Player2_01', 2);
      player3 = new Player(game, 'atlas', 'Player3_01', 3);
      player4 = new Player(game, 'atlas', 'Player4_01', 4);
      player5 = new Player(game, 'atlas', 'Player5_01', 5);
      player6 = new Player(game, 'atlas', 'Player6_01', 6);
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
      p3lifeBar = game.add.sprite(25, 25, 'atlas', 'lifeBar');
      p3borderBar = game.add.sprite(25, 25, 'atlas', 'borderBar');
      p3damageBar = game.add.sprite(25, 25, 'atlas', 'damageBar');
      p3gainBar = game.add.sprite(25 + 196, 25, 'atlas', 'gainBar');
      p1lifeBar = game.add.sprite(25, 75, 'atlas', 'lifeBar');
      p1borderBar = game.add.sprite(25, 75, 'atlas', 'borderBar');
      p1damageBar = game.add.sprite(25, 75, 'atlas', 'damageBar');
      p1gainBar = game.add.sprite(25 + 196, 75, 'atlas', 'gainBar');      
      p5lifeBar = game.add.sprite(25, 125, 'atlas', 'lifeBar');
      p5borderBar = game.add.sprite(25, 125, 'atlas', 'borderBar');
      p5damageBar = game.add.sprite(25, 125, 'atlas', 'damageBar');
      p5gainBar = game.add.sprite(25 + 196, 125, 'atlas', 'gainBar');
      p4lifeBar = game.add.sprite(578, 25, 'atlas', 'lifeBar');
      p4borderBar = game.add.sprite(578, 25, 'atlas', 'borderBar');
      p4damageBar = game.add.sprite(578, 25, 'atlas', 'damageBar');
      p4gainBar = game.add.sprite(578 + 196, 25, 'atlas', 'gainBar');
      p2lifeBar = game.add.sprite(578, 75, 'atlas', 'lifeBar');
      p2borderBar = game.add.sprite(578, 75, 'atlas', 'borderBar');
      p2damageBar = game.add.sprite(578, 75, 'atlas', 'damageBar');
      p2gainBar = game.add.sprite(578 + 196, 75, 'atlas', 'gainBar');
      p6lifeBar = game.add.sprite(578, 125, 'atlas', 'lifeBar');
      p6borderBar = game.add.sprite(578, 125, 'atlas', 'borderBar');
      p6damageBar = game.add.sprite(578, 125, 'atlas', 'damageBar');
      p6gainBar = game.add.sprite(578 + 196, 125, 'atlas', 'gainBar');
      borderBarGroup.add(p1borderBar);
      borderBarGroup.add(p2borderBar);
      borderBarGroup.add(p3borderBar);
      borderBarGroup.add(p4borderBar);
      borderBarGroup.add(p5borderBar);
      borderBarGroup.add(p6borderBar);
      damageBarGroup.add(p1damageBar);
      damageBarGroup.add(p2damageBar);
      damageBarGroup.add(p3damageBar);
      damageBarGroup.add(p4damageBar);
      damageBarGroup.add(p5damageBar);
      damageBarGroup.add(p6damageBar);
      gainBarGroup.add(p1gainBar);
      p1gainBar.anchor.setTo(1,0);
      gainBarGroup.add(p2gainBar);
      p2gainBar.anchor.setTo(1,0);
      gainBarGroup.add(p3gainBar);
      p3gainBar.anchor.setTo(1,0);
      gainBarGroup.add(p4gainBar);
      p4gainBar.anchor.setTo(1,0);
      gainBarGroup.add(p5gainBar);
      p5gainBar.anchor.setTo(1,0);
      gainBarGroup.add(p6gainBar);
      p6gainBar.anchor.setTo(1,0);
      gainBarGroup.forEachAlive(function(c) {c.scale.x = 0;});      
      damageBarGroup.forEachAlive(function(c) {c.scale.x = 0;});
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
      /*player1Text = game.add.text(25, 25, 'Player 1 Health: ', { fontSize: '32px', fill: '#ffffff'});
      player2Text = game.add.text(500, 25, 'Player 2 Health: ',  { fontSize: '32px', fill: '#ffffff'});
      player3Text = game.add.text(25, 70, 'Player 3 Health: ', { fontSize: '32px', fill: '#ffffff'});
      player4Text = game.add.text(500, 70, 'Player 4 Health: ',  { fontSize: '32px', fill: '#ffffff'});
      player5Text = game.add.text(25, 115, 'Player 5 Health: ', { fontSize: '32px', fill: '#ffffff'});
      player6Text = game.add.text(500, 115, 'Player 6 Health: ',  { fontSize: '32px', fill: '#ffffff'}); */

      text = game.add.text(320, 50, '', { fontSize: '12px', fill: '#ffffff'} );
      text2 = game.add.text(320, 90, '', { fontSize: '12px', fill: '#ffffff'} );
      text3 = game.add.text(320, 130, '', { fontSize: '12px', fill: '#ffffff'} );      
      game.world.bringToTop(gainBarGroup);
      game.world.bringToTop(borderBarGroup);
   },
   update: function(){
   		//which player is moving?
    player1.events.onInputDown.add(p1click, this);   		
   	player2.events.onInputDown.add(p2click, this);   	
   	player3.events.onInputDown.add(p3click, this);   		
   	player4.events.onInputDown.add(p4click, this);   
   	player5.events.onInputDown.add(p5click, this);   		
   	player6.events.onInputDown.add(p6click, this);   
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
   	/*player1Text.text = 'Player 1 Health: ' + player1.health;
   	player2Text.text = 'Player 2 Health: ' + player2.health; // showing the health of each
   	player3Text.text = 'Player 3 Health: ' + player3.health;
   	player4Text.text = 'Player 4 Health: ' + player4.health;
   	player5Text.text = 'Player 5 Health: ' + player5.health;
   	player6Text.text = 'Player 6 Health: ' + player6.health; */
   	text.text = 'phase: ' + phaseCounter + ' turn: ' + turnCounter + ' attack: ' + attackCounter;
   	text2.text = 'player1: ' + p1Player + ' player2: ' + p2Player + ' animations: ' + animCounter;
   	text3.text = p1death + ' ' + p2death + ' ' + p3death + ' ' + p4death + ' ' + p5death + ' ' + p6death;
   	if (phaseCounter > 1 && phaseCounter < 4) { // if the player has already moved
   		if (game.input.keyboard.justPressed(Phaser.Keyboard.BACKSPACE)){
   			cancelPressed();
   		}
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) { //wait for attack button input, 1, 2, or 3 and go to appropriate attack function
   			attackCounter = 1;
   			if (turnCounter == 0) {
   				if (p1Player == 1) {
   					attP1A(player1.xCoord, player1.yCoord); 
   				} else if (p1Player == 3) {
   					attP1A(player3.xCoord, player3.yCoord); 
   				} else if (p1Player == 5) {
   					attP1A(player5.xCoord, player5.yCoord); 
   				}
   			} else if (turnCounter == 1) {
   				if (p2Player == 2) {
   					attP2A(player2.xCoord, player2.yCoord);
   				} else if (p2Player == 4) {
   					attP2A(player4.xCoord, player4.yCoord);   					
   				} else if (p2Player == 6) {
   					attP2A(player6.xCoord, player6.yCoord);   					
   				}
   			}
   		} else if (game.input.keyboard.justPressed(Phaser.Keyboard.TWO)) {
   			attackCounter = 2;
   			if (turnCounter == 0) {
   				if (p1Player == 1) {
   					attP1B(player1.xCoord, player1.yCoord); 
   				} else if (p1Player == 3) {
   					attP1B(player3.xCoord, player3.yCoord); 
   				} else if (p1Player == 5) {
   					attP1B(player5.xCoord, player5.yCoord); 
   				}
   			} else if (turnCounter == 1) {
   				if (p2Player == 2) {
   					attP2B(player2.xCoord, player2.yCoord);
   				} else if (p2Player == 4) {
   					attP2B(player4.xCoord, player4.yCoord);   					
   				} else if (p2Player == 6) {
   					attP2B(player6.xCoord, player6.yCoord);   					
   				}
   			}
   		} else if (game.input.keyboard.justPressed(Phaser.Keyboard.THREE)) {
   			attackCounter = 3;
   			if (turnCounter == 0) {
   				if (p1Player == 1) {
   					attP1C(player1.xCoord, player1.yCoord); 
   				} else if (p1Player == 3) {
   					attP1C(player3.xCoord, player3.yCoord); 
   				} else if (p1Player == 5) {
   					attP1C(player5.xCoord, player5.yCoord); 
   				}
   			} else if (turnCounter == 1) {
   				if (p2Player == 2) {
   					attP2C(player2.xCoord, player2.yCoord);
   				} else if (p2Player == 4) {
   					attP2C(player4.xCoord, player4.yCoord);   					
   				} else if (p2Player == 6) {
   					attP2C(player6.xCoord, player6.yCoord);   					
   				}
   			}
   		}     		
   	}
   	if (phaseCounter == 3) { // after an attack has been chosen, wait for confirmation with ENTER
   		if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
   			confirmPressed();
   		}
   	}
   	if (p1death == 0) {
   		if (player1.health <= 0) {
	   		player1.x = 0;
	   		player1.y = 0;
	   		player1.xCoord = 0;
	   		player1.yCoord = 0;
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
   	}); 	
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

function p1click() { //when the player 1 sprite is clicked
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	if (phaseCounter < 2 && turnCounter == 0) {
		p1Player = 1;
		phaseCounter = 1;
		if (player1.xCoord == 1) { //make buttons around character when clicked to show possible moves (this can probably be simplified a LOT)
			if (player1.yCoord == 1) {
				player1.memoryX = 1;
				player1.memoryY = 1;
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				buttonGroup.add(button1_2);
				buttonGroup.add(button2_1);
				buttonGroup.add(button1_1);
			} else if (player1.yCoord == 2) {
				player1.memoryX = 1;
				player1.memoryY = 2;
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				buttonGroup.add(button1_1);
				buttonGroup.add(button1_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button1_2);
			} else if (player1.yCoord == 3) {
				player1.memoryX = 1;
				player1.memoryY = 3;
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				buttonGroup.add(button1_2); // adds the buttons to the relevant group, for easy deleting
				buttonGroup.add(button2_3);
				buttonGroup.add(button1_3);
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
			} // this all does the same stuff
		} else if (player1.xCoord == 2) {
			if (player1.yCoord == 1) {
				player1.memoryX = 2;
				player1.memoryY = 1;
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				buttonGroup.add(button1_1);
				buttonGroup.add(button3_1);
				buttonGroup.add(button2_2);
				buttonGroup.add(button2_1);
			} else if (player1.yCoord == 2) {
				player1.memoryX = 2;
				player1.memoryY = 2;
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				buttonGroup.add(button2_1);
				buttonGroup.add(button1_2);
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_3);
				buttonGroup.add(button2_2);
			} else if (player1.yCoord == 3) {
				player1.memoryX = 2;
				player1.memoryY = 3;
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				buttonGroup.add(button1_3);
				buttonGroup.add(button3_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button2_3);
			}
		} else if (player1.xCoord == 3) {
			if (player1.yCoord == 1) {	
				player1.memoryX = 3;
				player1.memoryY = 1;
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_1);
				buttonGroup.add(button3_1);
			} else if (player1.yCoord == 2) {
				player1.memoryX = 3;
				player1.memoryY = 2;
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				buttonGroup.add(button3_1);
				buttonGroup.add(button3_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button3_2);
			} else if (player1.yCoord == 3) {
				player1.memoryX = 3;
				player1.memoryY = 3;
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_3);
				buttonGroup.add(button3_3);
			}
		}	
	}

   buttonGroup.forEachAlive(function (c) { if((c.xCoord == player3.xCoord && c.yCoord == player3.yCoord) || (c.xCoord == player5.xCoord && c.yCoord == player5.yCoord)){ c.kill(); } });
}

function p2click() { //do the same with when player 2 is clicked
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	if (phaseCounter < 2 && turnCounter == 1) {
		p2Player = 2;
		phaseCounter = 1;
		if (player2.xCoord == 4) {
			if (player2.yCoord == 1) {
				player2.memoryX = 4;
				player2.memoryY = 1;
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				buttonGroup.add(button4_2);
				buttonGroup.add(button5_1);
				buttonGroup.add(button4_1);
			} else if (player2.yCoord == 2) {
				player2.memoryX = 4;
				player2.memoryY = 2;
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				buttonGroup.add(button4_1);
				buttonGroup.add(button4_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button4_2);
			} else if (player2.yCoord == 3) {
				player2.memoryX = 4;
				player2.memoryY = 3;
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				buttonGroup.add(button4_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button4_3);
			}
		} else if (player2.xCoord == 5) {
			if (player2.yCoord == 1) {
				player2.memoryX = 5;
				player2.memoryY = 1;
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				buttonGroup.add(button4_1);
				buttonGroup.add(button6_1);
				buttonGroup.add(button5_2);
				buttonGroup.add(button5_1);
			} else if (player2.yCoord == 2) {
				player2.memoryX = 5;
				player2.memoryY = 2;
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				buttonGroup.add(button5_1);
				buttonGroup.add(button4_2);
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button5_2);
			} else if (player2.yCoord == 3) {
				player2.memoryX = 5;
				player2.memoryY = 3;
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				buttonGroup.add(button4_3);
				buttonGroup.add(button6_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button5_3);
			}
		} else if (player2.xCoord == 6) {
			if (player2.yCoord == 1) {	
				player2.memoryX = 6;
				player2.memoryY = 1;
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_1);
				buttonGroup.add(button6_1);
			} else if (player2.yCoord == 2) {
				player2.memoryX = 6;
				player2.memoryY = 2;
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				buttonGroup.add(button6_1);
				buttonGroup.add(button6_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button6_2);
			} else if (player2.yCoord == 3) {
				player2.memoryX = 6;
				player2.memoryY = 3;
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button6_3);
				
			}
		}
	} 
	buttonGroup.forEachAlive(function (c) { if((c.xCoord == player4.xCoord && c.yCoord == player4.yCoord) || (c.xCoord == player6.xCoord && c.yCoord == player6.yCoord)){ c.kill(); } });
}

function p3click() { //when the player 1 sprite is clicked
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	if (phaseCounter < 2 && turnCounter == 0) {
		p1Player = 3;
		phaseCounter = 1;
		if (player3.xCoord == 1) { //make buttons around character when clicked to show possible moves (this can probably be simplified a LOT)
			if (player3.yCoord == 1) {
				player3.memoryX = 1;
				player3.memoryY = 1;
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				buttonGroup.add(button1_2);
				buttonGroup.add(button2_1);
				buttonGroup.add(button1_1);
			} else if (player3.yCoord == 2) {
				player3.memoryX = 1;
				player3.memoryY = 2;
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				buttonGroup.add(button1_1);
				buttonGroup.add(button1_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button1_2);
			} else if (player3.yCoord == 3) {
				player3.memoryX = 1;
				player3.memoryY = 3;
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				buttonGroup.add(button1_2); // adds the buttons to the relevant group, for easy deleting
				buttonGroup.add(button2_3);
				buttonGroup.add(button1_3);
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
			} // this all does the same stuff
		} else if (player3.xCoord == 2) {
			if (player3.yCoord == 1) {
				player3.memoryX = 2;
				player3.memoryY = 1;
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				buttonGroup.add(button1_1);
				buttonGroup.add(button3_1);
				buttonGroup.add(button2_2);
				buttonGroup.add(button2_1);
			} else if (player3.yCoord == 2) {
				player3.memoryX = 2;
				player3.memoryY = 2;
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				buttonGroup.add(button2_1);
				buttonGroup.add(button1_2);
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_3);
				buttonGroup.add(button2_2);
			} else if (player3.yCoord == 3) {
				player3.memoryX = 2;
				player3.memoryY = 3;
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				buttonGroup.add(button1_3);
				buttonGroup.add(button3_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button2_3);
			}
		} else if (player3.xCoord == 3) {
			if (player3.yCoord == 1) {	
				player3.memoryX = 3;
				player3.memoryY = 1;
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_1);
				buttonGroup.add(button3_1);
			} else if (player3.yCoord == 2) {
				player3.memoryX = 3;
				player3.memoryY = 2;
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				buttonGroup.add(button3_1);
				buttonGroup.add(button3_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button3_2);
			} else if (player3.yCoord == 3) {
				player3.memoryX = 3;
				player3.memoryY = 3;
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_3);
				buttonGroup.add(button3_3);
			}
		}	
	}
	buttonGroup.forEachAlive(function (c) { if((c.xCoord == player1.xCoord && c.yCoord == player1.yCoord) || (c.xCoord == player5.xCoord && c.yCoord == player5.yCoord)){ c.kill(); } });
}

function p4click() { //do the same with when player 2 is clicked
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	if (phaseCounter < 2 && turnCounter == 1) {
		p2Player = 4;
		phaseCounter = 1;
		if (player4.xCoord == 4) {
			if (player4.yCoord == 1) {
				player4.memoryX = 4;
				player4.memoryY = 1;
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				buttonGroup.add(button4_2);
				buttonGroup.add(button5_1);
				buttonGroup.add(button4_1);
			} else if (player4.yCoord == 2) {
				player4.memoryX = 4;
				player4.memoryY = 2;
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				buttonGroup.add(button4_1);
				buttonGroup.add(button4_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button4_2);
			} else if (player4.yCoord == 3) {
				player4.memoryX = 4;
				player4.memoryY = 3;
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				buttonGroup.add(button4_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button4_3);
			}
		} else if (player4.xCoord == 5) {
			if (player4.yCoord == 1) {
				player4.memoryX = 5;
				player4.memoryY = 1;
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				buttonGroup.add(button4_1);
				buttonGroup.add(button6_1);
				buttonGroup.add(button5_2);
				buttonGroup.add(button5_1);
			} else if (player4.yCoord == 2) {
				player4.memoryX = 5;
				player4.memoryY = 2;
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				buttonGroup.add(button5_1);
				buttonGroup.add(button4_2);
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button5_2);
			} else if (player4.yCoord == 3) {
				player4.memoryX = 5;
				player4.memoryY = 3;
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				buttonGroup.add(button4_3);
				buttonGroup.add(button6_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button5_3);
			}
		} else if (player4.xCoord == 6) {
			if (player4.yCoord == 1) {	
				player4.memoryX = 6;
				player4.memoryY = 1;
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_1);
				buttonGroup.add(button6_1);
			} else if (player4.yCoord == 2) {
				player4.memoryX = 6;
				player4.memoryY = 2;
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				buttonGroup.add(button6_1);
				buttonGroup.add(button6_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button6_2);
			} else if (player4.yCoord == 3) {
				player4.memoryX = 6;
				player4.memoryY = 3;
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button6_3);
			}
		}
	} 
	buttonGroup.forEachAlive(function (c) { if((c.xCoord == player2.xCoord && c.yCoord == player2.yCoord) || (c.xCoord == player6.xCoord && c.yCoord == player6.yCoord)){ c.kill(); } });
}

function p5click() { //when the player 1 sprite is clicked
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	if (phaseCounter < 2 && turnCounter == 0) {
		p1Player = 5;
		phaseCounter = 1;
		if (player5.xCoord == 1) { //make buttons around character when clicked to show possible moves (this can probably be simplified a LOT)
			if (player5.yCoord == 1) {
				player5.memoryX = 1;
				player5.memoryY = 1;
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				buttonGroup.add(button1_2);
				buttonGroup.add(button2_1);
				buttonGroup.add(button1_1);
			} else if (player5.yCoord == 2) {
				player5.memoryX = 1;
				player5.memoryY = 2;
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				buttonGroup.add(button1_1);
				buttonGroup.add(button1_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button1_2);
			} else if (player5.yCoord == 3) {
				player5.memoryX = 1;
				player5.memoryY = 3;
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				buttonGroup.add(button1_2); // adds the buttons to the relevant group, for easy deleting
				buttonGroup.add(button2_3);
				buttonGroup.add(button1_3);
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
			} // this all does the same stuff
		} else if (player5.xCoord == 2) {
			if (player5.yCoord == 1) {
				player5.memoryX = 2;
				player5.memoryY = 1;
				button1_1 = game.add.button(square1_1.x, square1_1.y, 'atlas', function() {button1Click(1,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_1.xCoord = 1;
				button1_1.yCoord = 1;
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				buttonGroup.add(button1_1);
				buttonGroup.add(button3_1);
				buttonGroup.add(button2_2);
				buttonGroup.add(button2_1);
			} else if (player5.yCoord == 2) {
				player5.memoryX = 2;
				player5.memoryY = 2;
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_2 = game.add.button(square1_2.x, square1_2.y, 'atlas', function() {button1Click(1,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button1_2.xCoord = 1;
				button1_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				buttonGroup.add(button2_1);
				buttonGroup.add(button1_2);
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_3);
				buttonGroup.add(button2_2);
			} else if (player5.yCoord == 3) {
				player5.memoryX = 2;
				player5.memoryY = 3;
				button1_3 = game.add.button(square1_3.x, square1_3.y, 'atlas', function() {button1Click(1,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button1_3.xCoord = 1;
				button1_3.yCoord = 3;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				buttonGroup.add(button1_3);
				buttonGroup.add(button3_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button2_3);
			}
		} else if (player5.xCoord == 3) {
			if (player5.yCoord == 1) {	
				player5.memoryX = 3;
				player5.memoryY = 1;
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_1 = game.add.button(square2_1.x, square2_1.y, 'atlas', function() {button1Click(2,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				button2_1.xCoord = 2;
				button2_1.yCoord = 1;
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_1);
				buttonGroup.add(button3_1);
			} else if (player5.yCoord == 2) {
				player5.memoryX = 3;
				player5.memoryY = 2;
				button3_1 = game.add.button(square3_1.x, square3_1.y, 'atlas', function() {button1Click(3,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_2 = game.add.button(square2_2.x, square2_2.y, 'atlas', function() {button1Click(2,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_1.xCoord = 3;
				button3_1.yCoord = 1;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				button2_2.xCoord = 2;
				button2_2.yCoord = 2;
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				buttonGroup.add(button3_1);
				buttonGroup.add(button3_3);
				buttonGroup.add(button2_2);
				buttonGroup.add(button3_2);
			} else if (player5.yCoord == 3) {
				player5.memoryX = 3;
				player5.memoryY = 3;
				button3_2 = game.add.button(square3_2.x, square3_2.y, 'atlas', function() {button1Click(3,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button2_3 = game.add.button(square2_3.x, square2_3.y, 'atlas', function() {button1Click(2,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_3 = game.add.button(square3_3.x, square3_3.y, 'atlas', function() {button1Click(3,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button3_2.xCoord = 3;
				button3_2.yCoord = 2;
				button2_3.xCoord = 2;
				button2_3.yCoord = 3;
				button3_3.xCoord = 3;
				button3_3.yCoord = 3;
				buttonGroup.add(button3_2);
				buttonGroup.add(button2_3);
				buttonGroup.add(button3_3);
			}
		}	
	}
	buttonGroup.forEachAlive(function (c) { if((c.xCoord == player1.xCoord && c.yCoord == player1.yCoord) || (c.xCoord == player3.xCoord && c.yCoord == player3.yCoord)){ c.kill(); } });
}

function p6click() { //do the same with when player 2 is clicked
	buttonGroup.forEachAlive(function (c) { c.kill(); });
	if (phaseCounter < 2 && turnCounter == 1) {
		p2Player = 6;
		phaseCounter = 1;
		if (player6.xCoord == 4) {
			if (player6.yCoord == 1) {
				player6.memoryX = 4;
				player6.memoryY = 1;
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				buttonGroup.add(button4_2);
				buttonGroup.add(button5_1);
				buttonGroup.add(button4_1);
			} else if (player6.yCoord == 2) {
				player6.memoryX = 4;
				player6.memoryY = 2;
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				buttonGroup.add(button4_1);
				buttonGroup.add(button4_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button4_2);
			} else if (player6.yCoord == 3) {
				player6.memoryX = 4;
				player6.memoryY = 3;
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				buttonGroup.add(button4_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button4_3);
			}
		} else if (player6.xCoord == 5) {
			if (player6.yCoord == 1) {
				player6.memoryX = 5;
				player6.memoryY = 1;
				button4_1 = game.add.button(square4_1.x, square4_1.y, 'atlas', function() {button2Click(4,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_1.xCoord = 4;
				button4_1.yCoord = 1;
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				buttonGroup.add(button4_1);
				buttonGroup.add(button6_1);
				buttonGroup.add(button5_2);
				buttonGroup.add(button5_1);
			} else if (player6.yCoord == 2) {
				player6.memoryX = 5;
				player6.memoryY = 2;
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_2 = game.add.button(square4_2.x, square4_2.y, 'atlas', function() {button2Click(4,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button4_2.xCoord = 4;
				button4_2.yCoord = 2;
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				buttonGroup.add(button5_1);
				buttonGroup.add(button4_2);
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button5_2);
			} else if (player6.yCoord == 3) {
				player6.memoryX = 5;
				player6.memoryY = 3;
				button4_3 = game.add.button(square4_3.x, square4_3.y, 'atlas', function() {button2Click(4,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button4_3.xCoord = 4;
				button4_3.yCoord = 3;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				buttonGroup.add(button4_3);
				buttonGroup.add(button6_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button5_3);
			}
		} else if (player6.xCoord == 6) {
			if (player6.yCoord == 1) {	
				player6.memoryX = 6;
				player6.memoryY = 1;
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_1 = game.add.button(square5_1.x, square5_1.y, 'atlas', function() {button2Click(5,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_1.xCoord = 5;
				button5_1.yCoord = 1;
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_1);
				buttonGroup.add(button6_1);
			} else if (player6.yCoord == 2) {
				player6.memoryX = 6;
				player6.memoryY = 2;
				button6_1 = game.add.button(square6_1.x, square6_1.y, 'atlas', function() {button2Click(6,1)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_2 = game.add.button(square5_2.x, square5_2.y, 'atlas', function() {button2Click(5,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_1.xCoord = 6;
				button6_1.yCoord = 1;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				button5_2.xCoord = 5;
				button5_2.yCoord = 2;
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				buttonGroup.add(button6_1);
				buttonGroup.add(button6_3);
				buttonGroup.add(button5_2);
				buttonGroup.add(button6_2);
			} else if (player6.yCoord == 3) {
				player6.memoryX = 6;
				player6.memoryY = 3;
				button6_2 = game.add.button(square6_2.x, square6_2.y, 'atlas', function() {button2Click(6,2)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button5_3 = game.add.button(square5_3.x, square5_3.y, 'atlas', function() {button2Click(5,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_3 = game.add.button(square6_3.x, square6_3.y, 'atlas', function() {button2Click(6,3)}, this, 'ButtonNorm', 'ButtonHover', 'ButtonHover');
				button6_2.xCoord = 6;
				button6_2.yCoord = 2;
				button5_3.xCoord = 5;
				button5_3.yCoord = 3;
				button6_3.xCoord = 6;
				button6_3.yCoord = 3;
				buttonGroup.add(button6_2);
				buttonGroup.add(button5_3);
				buttonGroup.add(button6_3);
			}
		}
	} 
	buttonGroup.forEachAlive(function (c) { if((c.xCoord == player2.xCoord && c.yCoord == player2.yCoord) || (c.xCoord == player4.xCoord && c.yCoord == player4.yCoord)){ c.kill(); } });
}
function button1Click(x, y) { //when one of the buttons created by the previous function is created
   //console.log('im here');
   if(p1Player == 1) {     
      player1.x = -77 + 130*x; //move the player to a certain spot depending on where the button was
      player1.y = 194 + 95*y;
   } else if(p1Player == 3) {    
      player3.x = -77 + 130*x; //move the player to a certain spot depending on where the button was
      player3.y = 194 + 95*y;
   } else if(p1Player == 5) {    
      player5.x = -77 + 130*x; //move the player to a certain spot depending on where the button was
      player5.y = 194 + 95*y;
   }
   buttonGroup.forEachAlive(function (c) { c.kill(); }); // delete the existing buttons, waiting for next move phase
   phaseCounter = 2; //increment phase counter to attack phase
}
function button2Click(x, y) { // same with player 2
   //console.log('im here 2');
   if(p2Player == 2) {
      player2.x = -62 + 130*x;
      player2.y = 194 + 95*y;
   } else if(p2Player == 4) {
      player4.x = -62 + 130*x;
      player4.y = 194 + 95*y;
   } if(p2Player == 6) {
      player6.x = -62 + 130*x;
      player6.y = 194 + 95*y;
   }  
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
			if (p1Player == 1) {
				if (player1.yCoord == player2.yCoord) {	
					a = player2.health;
					player2.health -= 8;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {	
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.16;	
					}				
				}
				if (player1.yCoord == player4.yCoord) {
					a = player4.health;
					player4.health -= 12;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.24;	
					}					
				}
				if (player1.yCoord == player6.yCoord) {
					a = player6.health;
					player6.health -= 4;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.08;	
					}
				}
			} else if (p1Player == 3) {
				if (player3.yCoord == player2.yCoord) {
					a = player2.health;
					player2.health -= 4;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.08;	
					}					
				}
				if (player3.yCoord == player4.yCoord) {
					a = player4.health;
					player4.health -= 8;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.16;
					}						
				} 
				if (player3.yCoord == player6.yCoord) {
					a = player6.health;
					player6.health -= 12;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.24;
					}						
				}
			} else if (p1Player == 5) {
				if (player5.yCoord == player2.yCoord) {
					a = player2.health;
					player2.health -= 12;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.24;	
					}					
				}
				if (player5.yCoord == player4.yCoord) {
					a = player4.health;
					player4.health -= 4;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.08;	
					}					
				} 
				if (player5.yCoord == player6.yCoord) {
					a = player6.health;
					player6.health -= 8;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.16;	
					}					
				}
			}			
		} else if (turnCounter == 1) {
			if (p2Player == 2) {
				if (player1.yCoord == player2.yCoord) {
					a = player1.health;
					player1.health -= 8;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.16;	
					}
				} 
				if (player3.yCoord == player2.yCoord) {
					a = player3.health;
					player3.health -= 12;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.24;	
					}
				} 
				if (player5.yCoord == player2.yCoord) {
					a = player5.health;
					player5.health -= 4;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.08;	
					}
				}
			} else if (p2Player == 4) {
				if (player1.yCoord == player4.yCoord) {
					a = player1.health;
					player1.health -= 4;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.08;	
					}
				} 
				if (player3.yCoord == player4.yCoord) {
					a = player3.health;
					player3.health -= 8;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.16;	
					}
				} 
				if (player5.yCoord == player4.yCoord) {
					a = player5.health;
					player5.health -= 12;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.24;
					}	
				}
			} else if (p2Player == 6) {
				if (player1.yCoord == player6.yCoord) {
					a = player1.health;
					player1.health -= 12;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.24;	
					}
				} if (player3.yCoord == player6.yCoord) {
					a = player3.health;
					player3.health -= 4;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.08;	
					}
				} if (player5.yCoord == player6.yCoord) {
					a = player5.health;
					player5.health -= 8;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.16;	
					}
				}
			}	
		}
	} else if (attackCounter == 2) {
		if (turnCounter == 0) {
			if (p1Player == 1) {
				if (player2.xCoord == player1.xCoord + 3) {
					a = player2.health;
					player2.health -= 8;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {	
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.16;	
					}	
				} 
				if (player4.xCoord == player1.xCoord + 3) {
					a = player4.health;
					player4.health -= 12;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.24;	
					}
				} 
				if (player6.xCoord == player1.xCoord + 3) {
					a = player6.health;
					player6.health -= 4;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.08;	
					}	
				}
			} else if (p1Player == 3) {
				if (player2.xCoord == player3.xCoord + 3) {
					a = player2.health;
					player2.health -= 4;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.08;	
					}	
				} 
				if (player4.xCoord == player3.xCoord + 3) {
					a = player4.health;
					player4.health -= 8;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.16;
					}	
				} 
				if (player6.xCoord == player3.xCoord + 3) {
					a = player6.health;
					player6.health -= 12;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.24;
					}
				}
			} else if (p1Player == 5) {
				if (player2.xCoord == player5.xCoord + 3) {
					a = player2.health;
					player2.health -= 12;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.24;	
					}
				} 
				if (player4.xCoord == player5.xCoord + 3) {
					a = player4.health;
					player4.health -= 4;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.08;	
					}	
				} 
				if (player6.xCoord == player5.xCoord + 3) {
					a = player6.health;
					player6.health -= 8;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.16;	
					}	
				}
			}			
		} else if (turnCounter == 1) {
			if (p2Player == 2){
				if (player1.xCoord == player2.xCoord - 3) {
					a = player1.health;
					player1.health -= 8;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.16;	
					}
				}
				if (player3.xCoord == player2.xCoord - 3) {
					a = player3.health;
					player3.health -= 12;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.24;	
					}
				}
				if (player5.xCoord == player2.xCoord - 3) {
					a = player5.health;
					player5.health -= 4;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.08;	
					}
				}
			} else if (p2Player == 4){
				if (player1.xCoord == player4.xCoord - 3) {
					a = player1.health;
					player1.health -= 4;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.08;	
					}
				}
				if (player3.xCoord == player4.xCoord - 3) {
					a = player3.health;
					player3.health -= 8;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.16;	
					}
				}
				if (player5.xCoord == player4.xCoord - 3) {
					a = player5.health;
					player5.health -= 12;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.24;
					}	
				}			
			} else if (p2Player == 6){
				if (player1.xCoord == player6.xCoord - 3) {
					a = player1.health;
					player1.health -= 12;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.24;	
					}
				}
				if (player3.xCoord == player6.xCoord - 3) {
					a = player3.health;
					player3.health -= 4;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.08;	
					}
				}
				if (player5.xCoord == player6.xCoord - 3) {
					a = player5.health;
					player5.health -= 8;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.16;	
					}	
				}
			}
		}
	} else if (attackCounter == 3) { //attack 3 requires more precise positioning, and thus deals more damage
		if (turnCounter == 0) {
			if (p1Player == 1) {
				if (player2.xCoord == player1.xCoord + 3 && player2.yCoord == player1.yCoord) {
					a = player2.health;
					player2.health -= 12;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.24;	
					}
				}
				if (player4.xCoord == player1.xCoord + 3 && player4.yCoord == player1.yCoord) {
					a = player4.health;
					player4.health -= 18;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.36;	
					}
				}				
				if (player6.xCoord == player1.xCoord + 3 && player6.yCoord == player1.yCoord) {
					a = player6.health;
					player6.health -= 6;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.12;
					}	
				}
			} else if (p1Player == 3) {
				if (player2.xCoord == player3.xCoord + 3 && player2.yCoord == player3.yCoord) {
					a = player2.health;
					player2.health -= 6;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.12;	
					}
				}
				if (player4.xCoord == player3.xCoord + 3 && player4.yCoord == player3.yCoord) {
					a = player4.health;
					player4.health -= 12;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.24;	
					}
				}				
				if (player6.xCoord == player3.xCoord + 3 && player6.yCoord == player3.yCoord) {
					a = player6.health;
					player6.health -= 18;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.36;
					}	
				}
			} else if (p1Player == 5) {
				if (player2.xCoord == player5.xCoord + 3 && player2.yCoord == player5.yCoord) {
					a = player2.health;
					player2.health -= 18;
					if (player2.health < 0) {
						p2damageBar.x = 578;
						p2damageBar.scale.x = 0.02 * a;	
					} else {
						p2damageBar.x = 578 + (196 * (player2.health * 0.02));
						p2damageBar.scale.x = 0.36;	
					}
				}
				if (player4.xCoord == player5.xCoord + 3 && player4.yCoord == player5.yCoord) {
					a = player4.health;
					player4.health -= 6;
					if (player4.health < 0) {
						p4damageBar.x = 578;
						p4damageBar.scale.x = 0.02 * a;	
					} else {
						p4damageBar.x = 578 + (196 * (player4.health * 0.02));
						p4damageBar.scale.x = 0.12;	
					}
				}				
				if (player6.xCoord == player5.xCoord + 3 && player6.yCoord == player5.yCoord) {
					a = player6.health;
					player6.health -= 12;
					if (player6.health < 0) {
						p6damageBar.x = 578;
						p6damageBar.scale.x = 0.02 * a;	
					} else {
						p6damageBar.x = 578 + (196 * (player6.health * 0.02));
						p6damageBar.scale.x = 0.24;
					}	
				}
			}
		} else if (turnCounter == 1) {
			if (p2Player == 2) {
				if (player1.xCoord == player2.xCoord - 3 && player1.yCoord == player2.yCoord) {
					a = player1.health;
					player1.health -= 12;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.24;
					}
				}
				if (player3.xCoord == player2.xCoord - 3 && player3.yCoord == player2.yCoord) {
					a = player1.health;
					player3.health -= 18;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.36;
					}
				}
				if (player5.xCoord == player2.xCoord - 3 && player5.yCoord == player2.yCoord) {
					a = player5.health;
					player5.health -= 6;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.12;
					}
				}
			} else if (p2Player == 4) {
				if (player1.xCoord == player4.xCoord - 3 && player1.yCoord == player4.yCoord) {
					a = player1.health;
					player1.health -= 6;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.12;
					}
				}
				if (player3.xCoord == player4.xCoord - 3 && player3.yCoord == player4.yCoord) {
					a = player3.health;
					player3.health -= 12;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.24;
					}
				}
				if (player5.xCoord == player4.xCoord - 3 && player5.yCoord == player4.yCoord) {
					a = player5.health;
					player5.health -= 18;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.36;
					}
				}
			} else if (p2Player == 6) {
				if (player1.xCoord == player6.xCoord - 3 && player1.yCoord == player6.yCoord) {
					a = player1.health;
					player1.health -= 18;
					if (player1.health < 0) {
						p1damageBar.x = 25;
						p1damageBar.scale.x = 0.02 * a;	
					} else {
						p1damageBar.x = 25 + (196 * (player1.health * 0.02));
						p1damageBar.scale.x = 0.36;
					}
				}
				if (player3.xCoord == player6.xCoord - 3 && player3.yCoord == player6.yCoord) {
					a = player1.health;
					player3.health -= 6;
					if (player3.health < 0) {
						p3damageBar.x = 25;
						p3damageBar.scale.x = 0.02 * a;	
					} else {
						p3damageBar.x = 25 + (196 * (player3.health * 0.02));
						p3damageBar.scale.x = 0.12;
					}
				}
				if (player5.xCoord == player6.xCoord - 3 && player5.yCoord == player6.yCoord) {
					a = player1.health;
					player5.health -= 12;
					if (player5.health < 0) {
						p5damageBar.x = 25;
						p5damageBar.scale.x = 0.02 * a;	
					} else {
						p5damageBar.x = 25 + (196 * (player5.health * 0.02));
						p5damageBar.scale.x = 0.24;
					}
				}
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
	animCounter = 0;
}

function cancelPressed() {
	if (turnCounter == 0) {
		if(p1Player == 1) {		
			player1.x = -77 + 130*player1.memoryX; //move the player to a certain spot depending on where the button was
			player1.y = 194 + 95*player1.memoryY;
		} else if(p1Player == 3) {		
			player3.x = -77 + 130*player3.memoryX; //move the player to a certain spot depending on where the button was
			player3.y = 194 + 95*player3.memoryY;
		} else if(p1Player == 5) {		
			player5.x = -77 + 130*player5.memoryX; //move the player to a certain spot depending on where the button was
			player5.y = 194 + 95*player5.memoryY;
		}
	} else if (turnCounter == 1) {
		if(p2Player == 2) {
			player2.x = -62 + 130*player2.memoryX;
			player2.y = 194 + 95*player2.memoryY;
		} else if(p2Player == 4) {
			player4.x = -62 + 130*player4.memoryX;
			player4.y = 194 + 95*player4.memoryY;
		} if(p2Player == 6) {
			player6.x = -62 + 130*player6.memoryX;
			player6.y = 194 + 95*player6.memoryY;
		}
	}	
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