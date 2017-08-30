function setPhase(p){
    
    let nextAnim = 'float';
    let fn = function(p){
        if(p.animations.currentAnim.name == nextAnim) return;
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

    switch(p){
        case 0:
            if(selectedPlayer) selectedPlayer.emitterState(0);

            //so there's no mistakes in this regard
            selectedPlayer = null;

            p1Enter.alpha = 0.25;
            p1Back.alpha = 0.25;
            p2Enter.alpha = 0.25;
            p2Back.alpha = 0.25;
            if(turnCounter == 0) {
                phaseText.text = 'Player 1, your turn to move.';
            } else if (turnCounter == 1) {
                phaseText.text = 'Player 2, your turn to move.';
            }

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
            phaseText.text = 'Press ENTER to confirm your attack, or BACKSPACE to cancel it.';
            selectedPlayer.emitterState(1);
            if(turnCounter == 0) {
                p1Enter.alpha = 1;
                p1Back.alpha = 1;                
            }else if(turnCounter == 1) {
                p2Enter.alpha = 1;
                p2Back.alpha = 1;
            }
            doAttack(0);
            break;
        default:
            console.log("Something's probably going seriously wrong.")
            break;
    }
    phaseCounter = p;
}