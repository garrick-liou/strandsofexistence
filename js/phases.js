function setPhase(p){
    if(turnCounter == 0) let g=p1Grid;
    else if(turnCounter == 1) let g=p2Grid;

    switch(p){
        case 0:
            //so there's no mistakes in this regard
            selectedPlayer = null;

            //in case it comes from phase 1
            background.inputEnabled = false;
            buttonGroup.forEachAlive(function (c) { c.kill(); });

            //in case it comes from phase 3 (delete damage tiles)
            for(var i = damageGroup.getFirstAlive(); i != null; i = damageGroup.getFirstAlive()) i.destroy();

            for(var i of g.players) {
                i.inputEnabled = true;
                btnReset(i, 0, 0);
            }
            break;
        case 1:
            //remove any old buttons (under non-selected players, or if you're selecting a different player by clicking directly on them)
            buttonGroup.forEachAlive(function (c) { c.kill(); });

            //allow player to "click off" to go back a phase (and select players normally again)
            background.inputEnabled = true;
            break;
        case 2:
            //no more selecting a different player, or going back to phase 0 by "clicking off"
            for(var i of g.players) i.inputEnabled = false;
            background.inputEnabled = false;

            //get rid of those pesky movement buttons
            buttonGroup.forEachAlive(function (c) { c.kill(); });
            break;
        case 3:
            //delete all damage tile sprites, in preparation for new ones
            for(var i = damageGroup.getFirstAlive(); i != null; i = damageGroup.getFirstAlive()) i.destroy();
            break;
        default:
            console.log("Something's probably going seriously wrong.")
            break;
    }
    phaseCounter = p;
}