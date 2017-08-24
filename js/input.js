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
	if(player.square.xIndex != 0){ //as long as it's not on the left edge of a map
		btnReset(player, -1, 0);
	}
	if(player.square.xIndex != player.grid.squares[0].length - 1){ //'' right edge of a map
		btnReset(player, 1, 0);
	}
	if(player.square.yIndex != 0){ //'' top edge of a map
		btnReset(player, 0, -1);
	}
	if(player.square.yIndex != player.grid.squares.length - 1){ //'' bottom edge of a map
		btnReset(player, 0, 1);
	}

	//temporary thingy thing to make it so you can move 2 squares
	if(player.square.xIndex > 1){
		btnReset(player, -2, 0);
	}
	if(player.square.xIndex < player.grid.squares[0].length - 2){
		btnReset(player, 2, 0);
	}
	if(player.square.yIndex > 1){
		btnReset(player, 0, -2);
	}
	if(player.square.yIndex < player.grid.squares.length - 2){
		btnReset(player, 0, 2);
	}

	if(player.square.xIndex != 0 && player.square.yIndex != 0){
		btnReset(player, -1, -1);
	}
	if(player.square.xIndex != player.grid.squares[0].length - 1 && player.square.yIndex != player.grid.squares.length - 1){
		btnReset(player, 1, 1);
	}
	if(player.square.xIndex != player.grid.squares[0].length - 1 && player.square.yIndex != 0){
		btnReset(player, 1, -1);
	}
	if(player.square.xIndex != 0 && player.square.yIndex != player.grid.squares.length - 1){
		btnReset(player, -1, 1);
	}
}

//deal with phases and such, moving forward upon clicking a player at the right time, backward when clicking the stage after selecting a player
function playerClick(player){
	if(phaseCounter == 0 || phaseCounter == 1){
		setPhase(1);
		selectForMove(player);
	}
}

//movement order given by a button (even though that ended up not always being the case)
function movementButton(square, player){
    player.square.occupant = null;
    square.occupant = player;
    player.square = square;
	player.x = square.x + square.tile.width*3/8;
	player.y = square.y - square.tile.height/6;
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

	//hm... I wonder what this line does...
	doDamage(g.damageG);

	//make sure your character goes back to the right square when you cancel your actions
	selectedPlayer.turnStartSquare = selectedPlayer.square;

	setPhase(0); //reset the phase to move phase
	
	//deal with damage causing deaths
	p1Grid.findDeaths();
	p2Grid.findDeaths();

	//check if anyone's won
	if(p1Grid.players.getFirstAlive() == null){
		winner = 2;
		game.state.start("GameOver");
	}
	if(p2Grid.players.getFirstAlive() == null){
		winner = 1;
		game.state.start("GameOver");
	}
}

//for when you press backspace or click the background
function cancelPressed() {
	if(phaseCounter > 1) movementButton(selectedPlayer.turnStartSquare, selectedPlayer)
	setPhase(0);
}