function setPhase(p){
    let g;
    if(turnCounter == 0) g=p1Grid;
    else if(turnCounter == 1) g=p2Grid;

    switch(p){
        case 0:
            //so there's no mistakes in this regard
            selectedPlayer = null;

            //in case it comes from phase 1
            background.inputEnabled = false;
            g.buttonG.forEachAlive(function (c) { c.kill(); });

            //in case it comes from phase 3 (delete damage tiles)
            for(let i = g.damageG.getFirstAlive(); i != null; i = g.damageG.getFirstAlive()) i.destroy();

            g.players.forEachAlive(function(p){
                p.inputEnabled = true;
                btnReset(p, 0, 0);
            });
            break;
        case 1:
            //remove any old buttons (under non-selected players, or if you're selecting a different player by clicking directly on them)
            g.buttonG.forEachAlive(function (c) { c.kill(); });

            //allow player to "click off" to go back a phase (and select players normally again)
            background.inputEnabled = true;
            break;
        case 2:
            //no more selecting a different player, or going back to phase 0 by "clicking off"
            g.players.forEachAlive(function(p){
                i.inputEnabled = false;
            });
            background.inputEnabled = false;

            //get rid of those pesky movement buttons
            g.buttonG.forEachAlive(function (c) { c.kill(); });
            break;
        case 3:
            //delete all damage tile sprites, in preparation for new ones
            for(let i = p1Grid.damageG.getFirstAlive(); i != null; i = p1Grid.damageG.getFirstAlive()) i.destroy();
            for(let i = p2Grid.damageG.getFirstAlive(); i != null; i = p2Grid.damageG.getFirstAlive()) i.destroy();
            break;
        default:
            console.log("Something's probably going seriously wrong.")
            break;
    }
    phaseCounter = p;
}