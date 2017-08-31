//for the damage effect emitter
function doFlow(x, y, area, xMin, xMax, yMin, yMax, gravity, particleDuration, frequency, count, emitDuration, color){
    var emitter = game.add.emitter(x, y, Math.floor(emitDuration*count/frequency));
    emitter.area = area;
    emitter.setXSpeed(xMin, xMax);
    emitter.setYSpeed(yMin, yMax);
    emitter.gravity = gravity;
    emitter.makeParticles('atlas', 'particle');

    emitter.forEach(function(particle){
        particle.tint = color;
    });

    emitter.flow(particleDuration, frequency, count);
    game.time.events.add(emitDuration, function(){this.on = false;}, emitter);
    game.time.events.add(emitDuration + particleDuration, emitter.destroy, emitter);
    return emitter;
}

var elementStruct ={
    flame:{
        sound:null,
        plant:3,
        flame:2,
        water:1,
        burst:function(x, y, w, h){
            this.area = this.area || new Phaser.Rectangle(0, 0, w, h/5);
            this.gravity = this.gravity || new Phaser.Point(0, -300);
            game.time.events.add(150, doFlow, this, x, y, this.area, -8, 8, -75, -15, this.gravity, 350, 10, 1, 500, 0xC02000);
        }
    },
    water:{
        sound:null,
        flame:3,
        water:2,
        plant:1,
        burst:function(x, y, w, h){
            this.area = this.area || new Phaser.Rectangle(0, 0, w*0.75, h*0.75);
            this.gravity = this.gravity || new Phaser.Point(0, 0);
            let e = doFlow(x, y, this.area, -12, 12, -12, 12, this.gravity, 500, 30, 2, 500, 0x4040E0);
            //specifically for water, it should appear a bit above the middle of the square.
            //I have no idea why the "area" rectangle doesn't care about its position, but the x and y in there do absolutely nothing.
            e.y -= h/4;
        }
    },
    plant:{
        sound:null,
        water:3,
        plant:2,
        flame:1,
        burst:function(x, y, w, h){
            this.area = this.area || new Phaser.Rectangle(0, 0, w, 1);
            this.gravity = this.gravity || new Phaser.Point(0, 120);
            game.time.events.add(750, doFlow, this, x, y, this.area, 2, 5, -125, -115, this.gravity, 2300, 25, 10, 100, 0x108028);
        }
    }
}

function doDamage(grid){
    let elem = elementStruct[selectedPlayer.element];
    //play sound using ~~elem.soundName~~ elem.sound
    elem.sound.play('', 0, 0.3, false);

    grid.damageG.forEachAlive(function(dTile){
        elem.burst.call(elem, grid.x + dTile.x + dTile.width/2, grid.y + dTile.y + dTile.height*0.75, dTile.width, dTile.height);

		let dPlayer = dTile.sqr.occupant;
        if(dPlayer == null) return;
		dPlayer.alterHealth(-lastAttack.dmg, elem[dPlayer.element]);
	});
}