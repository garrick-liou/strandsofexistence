//considering making this a group which contains all its elements so you can resize the group itself in case we want to fit it elsewhere

function LifeBar(parent, x, y){
    this.parent = parent;
    this.x = x;
    this.y = y;

    this.oldHealth = 50;
    
    this.life = game.add.sprite(x, y, 'atlas', 'lifeBar');
    this.damage = game.add.sprite(x, y, 'atlas', 'damageBar');
    this.gain = game.add.sprite(x, y, 'atlas', 'gainBar');
    this.border = game.add.sprite(x, y, 'atlas', 'borderBar');

    this.gain.scale.x = 0;
    this.damage.scale.x = 0;
    this.gain.anchor.setTo(1, 0);
}
LifeBar.prototype.update = function(){
    this.life.scale.x = this.parent.health/50;
    if(this.oldHealth > this.parent.health + 0.1){
          this.oldHealth -= 0.1;
          this.damage.x = this.x + this.parent.health*196/50;
          this.damage.scale.x = (this.oldHealth - this.parent.health)/50;
    } else if(this.oldHealth < this.parent.health - 0.1){
          this.oldHealth += 0.1;
          this.gain.x = this.x + this.parent.health*196/50;
          this.gain.scale.x = (this.parent.health - this.oldHealth)/50;
    } else {
          this.oldHealth = this.parent.health;
          this.gain.scale.x = 0;
          this.damage.scale.x = 0;
    }
}