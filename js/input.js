//show buttons when a player has been selected

function btnReset(player, dx, dy){
	let rx = player.square.xIndex + dx;
	let ry = player.square.yIndex + dy;
	//don't bother if we're looking for something outside of the map
	if(ry < 0 || ry >= player.grid.squares.length) return;
	if(rx < 0 || rx >= player.grid.squares[ry].length) return;

	let sqr = player.grid.squares[ry][rx];

	//ignore if occupied by a different unit
	if(sqr.occupant && sqr.occupant != player) return;

	//The "kill" function just stops phaser from paying attention to the object. It's still around.
	//The "reset" function makes it show up and stuff again.
	sqr.button.reset(sqr.button.x, sqr.button.y);
}
function selectForMove(player){
	//"turn on" buttons within 2 squares of the player, and remember what player is selected for later
	selectedPlayer = player;

	btnReset(player, 0, 0);
	for(let i = -2; i <= 2; i++){ 
		btnReset(player, 0, i);//above/below
		btnReset(player, i, 0);//left/right
	}

	btnReset(player, -1, -1);//diagonals
	btnReset(player, 1, 1);
	btnReset(player, 1, -1);
	btnReset(player, -1, 1);
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
	player.y = square.y - square.tile.height/6
	player.emitter.x = player.x + 12;
	player.emitter.y = player.y + 40;
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
	
	//deal with damage causing deaths
	p1Grid.findDeaths();
	p2Grid.findDeaths();
	
	setPhase(0); //reset the phase to move phase

	//check if anyone's won (done last because that makes sense for a state change-- otherwise setPhase should be last)
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