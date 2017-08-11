function attP1A(x, y) { // 1 attacks the row that the player is on, on the enemy player's side
	for(var i = 0; i < 3; i++){
		if(y == i + 1){
			for(j = 3; j < 6; j++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}
function attP2A(x, y) {
	for(var i = 0; i < 3; i++){
		if(i + 1 == y){
			for(j = 0; j < 3; j++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}

function attP1B(x, y) { // 2 attacks the column 3 spaces away, and highlights the tiles to be hit
	for(var j = 3; j < 6; j++){
		if(j - 2 == x){
			for(var i = 0; i < 3; i++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}

function attP2B(x, y) {
	for(var j = 0; j < 3; j++){
		if(j + 4 == x){
			for(var i = 0; i < 3; i++){
				var d = damageGroup.create(squares[i][j].x, squares[i][j].y, 'atlas', 'DamageTile');
				d.xCoord = j + 1;
				d.yCoord = i + 1;
			}
		}
	}
}

function attP1C(x, y) { // attack 3 attacks the square directly across from you, 3 tiles away
	var d = damageGroup.create(squares[y-1][x+2].x, squares[y-1][x+2].y, 'atlas', 'DamageTile');
	d.xCoord = x + 3;
	d.yCoord = y;
}

function attP2C(x, y) {	
	var d = damageGroup.create(squares[y-1][x-4].x, squares[y-1][x-4].y, 'atlas', 'DamageTile');
	d.xCoord = x - 3;
	d.yCoord = y;
}

p1attacks = [
	{fn:attP1A, dmg:1},
	{fn:attP1B, dmg:1},
	{fn:attP1C, dmg:2}];
p2attacks = [
	{fn:attP2A, dmg:1},
	{fn:attP2B, dmg:1},
	{fn:attP2C, dmg:2}];

function doAttack(number){
	phaseCounter = 3;

	for(var i = damageGroup.getFirstAlive(); i != null; i = damageGroup.getFirstAlive()) i.destroy(); //delete all damage tile sprites

	if (turnCounter == 0) {
		lastAttack = p1attacks[number - 1];
		lastAttack.fn(player1.xCoord, player1.yCoord);
	} else if (turnCounter == 1) {
		lastAttack = p2attacks[number - 1];
		lastAttack.fn(player2.xCoord, player2.yCoord);
	}
}