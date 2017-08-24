// in attack functions, "grid" is the defending grid (i.e. not the one that the attack is coming from)

function atkA(grid, x, y){//horizontal across the whole row
	for(let i = 0; i < grid.squares[y].length; i++){
		makeDamage(grid, i, y);
	}
}
function atkB(grid, x, y){//vertical up one and down one tile in the column
	for(let i = Math.max(y-1, 0); i < Math.min(y+2, grid.squares.length); i++){
		makeDamage(grid, x, i);
	}
}
function atkC(grid, x, y){//square exactly across
	makeDamage(grid, x, y);
}

//create tiles for damage, directly on top of each square (automatically offset to them in a sense, because they belong to the grid group)
function makeDamage(grid, x, y){
	let sqr = grid.squares[y][x];
	let d = grid.damageG.create(sqr.x, sqr.y, 'atlas', 'DamageTile');
	d.xCoord = x;
	d.yCoord = y;
	d.sqr = sqr;
	d.scale.x = sqr.tile.scale.x;
	d.scale.y = sqr.tile.scale.y;
}

//set up a array/structure to easily access the functions based on what number attack they are
attackInfo = [
	{fn:atkA, dmg:8},
	{fn:atkB, dmg:10},
	{fn:atkC, dmg:12}];

//use the structure above
function doAttack(number){
	setPhase(3);
	selectedPlayer.emitter.setAlpha(1);
	lastAttack = attackInfo[number - 1];
	if (turnCounter == 0) {
		lastAttack.fn(p2Grid, selectedPlayer.square.xIndex, selectedPlayer.square.yIndex);
	} else if (turnCounter == 1) {
		lastAttack.fn(p1Grid, selectedPlayer.square.xIndex, selectedPlayer.square.yIndex);
	}
}