//show buttons when a player has been selected

function btnReset(player, dx, dy){
	let sqr = player.grid.squares[player.yCoord + dy][player.xCoord + dx];
	//ignore if occupied by a different unit
	if(sqr.occupant && sqr.occupant != player) return;

	//The "kill" function just stops phaser from paying attention to the object. It's still around.
	//The "reset" function makes it show up and stuff again.
	sqr.button.reset(sqr.button.x, sqr.button.y);
}
function showBtns(player){
	btnReset(player, 0, 0);
	if(player.xCoord != 0){
		//as long as it's not on the left edge of a map
		btnReset(player, -1, 0);
	}
	if(player.xCoord != player.grid.squares[0].length-1){
		//as long as it's not on the right edge of a map
		btnReset(player, 1, 0);
	}
	if(player.yCoord != 0){
		//as long as it's not on the top edge of a map
		btnReset(player, 0, -1);
	}
	if(player.yCoord != player.grid.squares.length - 1){
		//as long as it's not on the bottom edge of a map
		btnReset(player, 0, 1);
	}
}

//deal with phases and such, moving forward upon clicking a player at the right time, backward when clicking the stage after selecting a player

function p1click() {
	if (phaseCounter == 0 && turnCounter == 0) {
		showBtns(player1);
		background.inputEnabled = true;
		player1.inputEnabled = false;
		phaseCounter = 1;
	}
}

function p2click() {
	if (phaseCounter == 0 && turnCounter == 1) {
		showBtns(player2);
		background.inputEnabled = true;
		player2.inputEnabled = false;
		phaseCounter = 1;
	}
}

function bgclick(){
	//back up a state if you click on the background when you're supposed to click a button/square (I think a lot of games do this kind of thing?)
	if(phaseCounter == 1){
		buttonGroup.forEachAlive(function (c) { c.kill(); });
		phaseCounter = 0;
		background.inputEnabled = false;
		if(turnCounter == 0) player1.inputEnabled = true;
		else player2.inputEnabled = true;
	}
}

//when enter is pressed, check to see which attack button was pressed last, check to see if the attack hits,
//apply appropriate damage, and go to the next turn
function confirmPressed() { 
	var hit = false;
	if(turnCounter == 0){
		//check if the x/y coordinates set earlier match for any damage squares
		damageGroup.forEachAlive(function(sqr){
			if(player2.xCoord == sqr.xCoord && player2.yCoord == sqr.yCoord) hit = true;
		});

		if(hit) player2.health -= lastAttack.dmg;

		turnCounter = 1; //if it was player 1's turn, make it player 2's turn
		player2.inputEnabled = true; //let player 2 click on their character
	} else if(turnCounter == 1){
		damageGroup.forEachAlive(function(sqr){
			if(player1.xCoord == sqr.xCoord && player1.yCoord == sqr.yCoord) hit = true;
		});
		if(hit){
			player1.health -= lastAttack.dmg;
		}
		turnCounter = 0;
		player1.inputEnabled = true;
	}

	for(var i = damageGroup.getFirstAlive(); i != null; i = damageGroup.getFirstAlive()) i.destroy(); //delete all damage tile sprites

	phaseCounter = 0; //and reset the phase to move phase
}

//if player 1 clicks a button (generic underneath, going to figure out how to put it in later)
function button1Click(square) {
	square.occupant = player1;
	player1.square.occupant = null;
	player1.square = square;
	player1.x = 53 + 130*square.xIndex; //move the player to a certain spot depending on where the button was
	player1.y = 289 + 95*square.yIndex;
	player1.xCoord = square.xIndex;
	player1.yCoord = square.yIndex;
	
	buttonGroup.forEachAlive(function (c) { c.kill(); });

	phaseCounter = 2;
}
function button2Click(square) { // same with player 2
	square.occupant = player2;
	player2.square.occupant = null;
	player2.square = square;
	player2.x = 68 + 130*(square.xIndex + 3);
	player2.y = 289 + 95*square.yIndex;
	player2.xCoord = square.xIndex;
	player2.yCoord = square.yIndex;

    buttonGroup.forEachAlive(function (c) { c.kill(); });
    
	phaseCounter = 2;
}

function movementButton(square, player){
    square.occupant = player;
    player.square.occupant = null;
    player.square = square;
    player.x = 48 + player.grid.x;
}