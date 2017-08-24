function resetDamageAndButtons(activeGrid){
    
}

function setPhase(p){
    let nextAnim = 'float';
    let fn = function(p){
        let prevFrame = p.animations.currentAnim.frame;
        p.animations.stop();
        p.animations.play(nextAnim);
        p.animations.currentAnim.setFrame(prevFrame, true);
    }
    
    var g;
    if(turnCounter == 0) {
        g=p1Grid;
        p2Grid.players.forEachAlive(fn);
    }else if(turnCounter == 1) {
        g=p2Grid;
        p1Grid.players.forEachAlive(fn);
    }
    nextAnim = 'turn';
    g.players.forEachAlive(fn);

    g.buttonG.forEachAlive(function (c) { c.kill(); });
    for(let i = p1Grid.damageG.getFirstAlive(); i != null; i = p1Grid.damageG.getFirstAlive()) i.destroy();
    for(let i = p2Grid.damageG.getFirstAlive(); i != null; i = p2Grid.damageG.getFirstAlive()) i.destroy();

    //there was a lot more going on in here a while ago...
    switch(p){
        case 0:
            //so there's no mistakes in this regard
            if(selectedPlayer) {
                selectedPlayer.emitter.setAlpha(0.4, 0.5);
                selectedPlayer.emitter.setYSpeed(-40,-60);                
                selectedPlayer.emitter.flow(800, 100, 1, -1);
            }
            selectedPlayer = null;

            g.players.forEachAlive(function(p){
                p.inputEnabled = true;
                btnReset(p, 0, 0);
            });
            break;
        case 1:
            break;
        case 2:
            //no more selecting a different player by clicking them, have to go back phase with background click or backspace press
            g.players.forEachAlive(function(p){
                p.inputEnabled = false;
            });
            break;
        case 3:
            selectedPlayer.emitter.setAlpha(1);
            selectedPlayer.emitter.setYSpeed(-100,-80);
            selectedPlayer.emitter.flow(500, 100, 2, -1);
            break;
        default:
            console.log("Something's probably going seriously wrong.")
            break;
    }
    phaseCounter = p;
}