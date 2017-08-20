//show buttons when a player has been selected

function btnReset(player, dx, dy){
	let sqr = player.grid.squares[player.square.yIndex + dy][player.square.xIndex + dx];

	//ignore if occupied by a different unit
	if(sqr.occupant && sqr.occupant != player) return;

	//The "kill" function just stops phaser from paying attention to the object. It's still around.
	//The "reset" function makes it show up and stuff again.
	sqr.button.reset(sqr.button.x, sqr.button.y);
}
function selectForMove(player){
	//"turn on" buttons on each side of the player, and under them, and remember what player is selected for later
	selectedPlayer = player;
	btnReset(player, 0, 0);
	if(player.square.xIndex != 0){
		//as long as it's not on the left edge of a map
		btnReset(player, -1, 0);
	}
	if(player.square.xIndex != player.grid.squares[0].length-1){
		//as long as it's not on the right edge of a map
		btnReset(player, 1, 0);
	}
	if(player.square.yIndex != 0){
		//as long as it's not on the top edge of a map
		btnReset(player, 0, -1);
	}
	if(player.square.yIndex != player.grid.squares.length - 1){
		//as long as it's not on the bottom edge of a map
		btnReset(player, 0, 1);
	}
}

//deal with phases and such, moving forward upon clicking a player at the right time, backward when clicking the stage after selecting a player
function playerClick(player){
	if(phaseCounter == 0 || phaseCounter == 1){
		setPhase(1);
		selectForMove(player);
	}
}

function bgclick(){
	if(phaseCounter == 1){
		setPhase(0);
	}
}

//when enter is pressed, check to see which attack button was pressed last, check to see if the attack hits,
//apply appropriate damage, and go to the next turn
function confirmPressed() {
	if(turnCounter == 0) {
		let g = p2Grid;
		turnCounter = 1; //if it was player 1's turn, make it player 2's turn
	}else if(turnCounter == 1){
		let g = p1Grid;
		turnCounter = 0; //vice versa
	}

	damageGroup.forEachAlive(function(square){
		for(var p of g.players){
			if(p.square == square) p.health -= lastAttack.dmg;
		}
	});

	for(var dt = damageGroup.getFirstAlive(); dt != null; dt = damageGroup.getFirstAlive()) dt.destroy(); //delete all damage tile sprites

	setPhase(0); //and reset the phase to move phase
}

function buttonClick(square){
	switch(phaseCounter){
		case 0:
			playerClick(square.occupant);
			break;
		case 1:
			movementButton(square, selectedPlayer);
			setPhase(2);
			break;

	}
}

function movementButton(square, player){
    square.occupant = player;
    player.square.occupant = null;
    player.square = square;
	player.x = player.grid.x + player.grid.tileWidth*1.1*square.xIndex + 48;
	player.y = player.grid.y + player.grid.tileHeight*1.1*square.yIndex - 16;
}