
var GAME_MODE_SANDBOX=0;
var GAME_MODE_CHALLENGE=1;

function game_init() {
    prop.game={};
    
    prop.game.paused=false;
    prop.game.in_window=true;
    prop.game.gravity=[0,0]; // 1+ unit per second
    prop.game.speedup=1; // good for debugging

    state_add([

    ]);
    state_restore("game");

    game_restart();

    loaded("game");
}

function game_is_paused() {
    if(prop.game.paused || prop.ui.menu.open || !prop.game.in_window)
        return(true);
    return(false);
}

function game_restart() {

}

function game_new(mode,craft,planet,craft_state) {
    prop.game.mode=mode;
    prop.game.craft=craft;
    prop.game.planet=planet;
    planet_set(planet);
    craft_set(craft);
}