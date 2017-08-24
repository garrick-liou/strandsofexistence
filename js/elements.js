var effectiveness ={
    flame:{
        plant:1.5,
        flame:1,
        water:0.5
    },
    water:{
        flame:1.5,
        water:1,
        plant:0.5
    },
    plant:{
        water:1.5,
        plant:1,
        flame:0.5
    }
}

function doDamage(damageG){
    damageG.forEachAlive(function(dTile){
		let defPlayer = dTile.sqr.occupant;
		if(defPlayer == null) return;
		defPlayer.alterHealth(-lastAttack.dmg * effectiveness[selectedPlayer.element][defPlayer.element]);
	});
}