//
// in attack functions, "grid" is the defending grid (i.e. not the one that the attack is coming from)
//

//horizontal across the whole row
function atkA(grid, x, y){
	for(var i = 0; i < grid.squares[y].length; i++){
		makeDamage(grid, i, y);
	}
}

//vertical up one and down one tile in the column
function atkB(grid, x, y){
	for(var i = Math.max(y-1, 0); i < Math.min(y+2, grid.squares.length); i++){
		makeDamage(grid, x, i);
	}
}

//square exactly across
function atkC(grid, x, y){
	makeDamage(grid, x, y);
}

//create tiles for damage, directly on top of each squa-- uh, button... because the squares themselves are aligned to the grid,
//while the buttons are already calculated to line up with their squares from the world x/y
function makeDamage(grid, x, y){
	var sqr = grid.squares[y][x];
	var d = damageGroup.create(sqr.button.x, sqr.button.y, 'atlas', 'DamageTile');
	d.xCoord = x;
	d.yCoord = y;
}

//set up a array/structure to easily access the functions based on what number attack they are
attackInfo = [
	{fn:atkA, dmg:1},
	{fn:atkB, dmg:2},
	{fn:atkC, dmg:3}];

//use the structure above
function doAttack(number){
	setPhase(3);

	lastAttack = attackInfo[number - 1];
	if (turnCounter == 0) {
		lastAttack.fn(p2Grid, selectedPlayer.square.xIndex, selectedPlayer.square.yIndex);
	} else if (turnCounter == 1) {
		lastAttack.fn(p1Grid, selectedPlayer.square.xIndex, selectedPlayer.square.yIndex);
	}
}