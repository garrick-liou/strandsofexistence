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
	let g;
	if(turnCounter == 0) {
		g = p2Grid;
		turnCounter = 1; //if it was player 1's turn, make it player 2's turn
	}else if(turnCounter == 1){
		g = p1Grid;
		turnCounter = 0; //vice versa
	}

	g.damageG.forEachAlive(function(dTile){
		let dPlayer = dTile.sqr.occupant;
		if(dPlayer == null) return;
		//kinda want to make mult a negative number but it feels wrong, so I negate the whole result later as you'd expect
		let mult = 1;
		if((dPlayer.element + 2)%6 == selectedPlayer.element - 1) mult = 1.5;
		if((dPlayer.element - 2)%6 == selectedPlayer.element - 1) mult = 0.5;
		dPlayer.alterHealth(-lastAttack.dmg * mult);
	});

	selectedPlayer.turnStartSquare = selectedPlayer.square;

	setPhase(0); //reset the phase to move phase
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
    player.square.occupant = null;
    square.occupant = player;
    player.square = square;
	player.x = square.x + 48;
	player.y = square.y - 16;
}