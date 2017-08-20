//
// in attack functions, "grid" is the defending grid, of sorts (i.e. not the one that the attack is coming from)
//

function atkA(grid, x, y){
	for(var i = 0; i < grid.squares[y].length; i++){
		makeDamage(grid, i, y);
	}
}

function atkB(grid, x, y){
	for(var i = Math.max(y-1, 0); i < Math.min(y+2, grid.squares.length); i++){
		makeDamage(grid, x, i);
	}
}

function atkC(grid, x, y){
	makeDamage(grid, x, y);
}

function makeDamage(grid, x, y){
	var sqr = grid.squares[y][x];
	var d = damageGroup.create(sqr.button.x, sqr.button.y, 'atlas', 'DamageTile');
	d.xCoord = x;
	d.yCoord = y;
}

attackInfo = [
	{fn:atkA, dmg:1},
	{fn:atkB, dmg:2},
	{fn:atkC, dmg:3}];

function doAttack(number){
	setPhase(3);
	
	lastAttack = attackInfo[number - 1];
	if (turnCounter == 0) {
		lastAttack.fn(player2.grid, player1.square.xIndex, player1.square.yIndex);
	} else if (turnCounter == 1) {
		lastAttack.fn(player1.grid, player2.square.xIndex, player2.square.yIndex);
	}
}