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
        //check up here
		dTile.emitter = game.add.emitter(g.x + dTile.x + dTile.width/2, g.y + dTile.y + dTile.height/2);
        dTile.emitter.makeParticles('atlas', 'particle');
        dTile.emitter.start(true, 400, null, 20);        
		dTile.emitter.forEach(function(particle){particle.tint = 0xff0000;});
        game.time.events.add(400, dTile.emitter.destroy, dTile.emitter);        

		let dPlayer = dTile.sqr.occupant;
		if(dPlayer == null) return;
		defPlayer.alterHealth(-lastAttack.dmg * effectiveness[selectedPlayer.element][defPlayer.element]);
	});
}