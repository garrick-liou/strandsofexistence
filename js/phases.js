function setPhase(p){
    var g;
    if(turnCounter == 0) g=p1Grid;
    else if(turnCounter == 1) g=p2Grid;

    g.buttonG.forEachAlive(function (c) { c.kill(); });
    for(let i = p1Grid.damageG.getFirstAlive(); i != null; i = p1Grid.damageG.getFirstAlive()) i.destroy();
    for(let i = p2Grid.damageG.getFirstAlive(); i != null; i = p2Grid.damageG.getFirstAlive()) i.destroy();

    switch(p){
        case 0:
            p1Grid.players.forEachAlive(function(player){player.idleAnim();});
            p2Grid.players.forEachAlive(function(player){player.idleAnim();});
            if(selectedPlayer) selectedPlayer.emitterState(0);

            //so there's no mistakes in this regard
            selectedPlayer = null;

            p1Enter.alpha = 0.25;
            p1Back.alpha = 0.25;
            p2Enter.alpha = 0.25;
            p2Back.alpha = 0.25;  
            p1Enter.inputEnabled = false;
            p2Enter.inputEnabled = false;
            if(turnCounter == 0) {
                phaseText.text = 'Player 1\'s turn to move.';
            } else if (turnCounter == 1) {
                phaseText.text = 'Player 2\'s turn to move.';
            }
            if(turnsPlayed < 2) {
                phaseText2.text = 'Click on a character or the square they\'re on.';
            } else {
                phaseText2.text = '';
            }

            g.players.forEachAlive(function(p){
                p.inputEnabled = true;
                btnReset(p, 0, 0);
            });
            break;
        case 1:
            phaseText.text = 'Click on a highlighted square to move to it.';
            if(turnsPlayed < 4) {
                phaseText2.text = 'Click elsewhere to pick a new character to move.';
            } else {
                phaseText2.text = '';
            }
            if(turnCounter == 0) {
                p1Back.alpha = 1;
            }else if(turnCounter == 1) {
                p2Back.alpha = 1;
            }
            break;
        case 2:
            //no more selecting a different player by clicking them, have to go back phase with background click or backspace press
            g.players.forEachAlive(function(p){
                p.inputEnabled = false;
            });
            phaseText.text = 'Press ENTER to confirm your attack, or BACKSPACE to cancel.';
            if(turnsPlayed < 4) {
                phaseText2.text = 'Each character\'s attack is different, and based on where they\'re standing.';
            } else {
                phaseText2.text = '';
            }
            selectedPlayer.emitterState(1);
            if(turnCounter == 0) {
                p1Enter.alpha = 1;
                p1Back.alpha = 1;
                p1Enter.inputEnabled = true;
            }else if(turnCounter == 1) {
                p2Enter.alpha = 1;
                p2Back.alpha = 1;
                p2Enter.inputEnabled = true;
            }
            doAttack(0);
            break;
        default:
            console.log("Something's probably going seriously wrong.")
            break;
    }
    phaseCounter = p;
}