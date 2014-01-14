
var GAME_STATE_MENU=0; // welcome
var GAME_STATE_PAUSED=1;
var GAME_STATE_PLAY=2;

function game_init() {
    prop.game={};
    
    prop.game.paused=false;
    prop.game.in_window=true;
    prop.game.gravity=[0,0]; // 1+ unit per second
    prop.game.speedup=1; // good for debugging

    prop.game.state=GAME_STATE_MENU;

    state_add([
        "prop.game.state"
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

function game_start() {
    console.log("Started game!");
    menu_clear();
}

function game_resume_menu() {
    prop.menu.menus["resume"]=new Menu("Resume saved game",[
	["No saved games"]
    ]);
    prop.menu.stack.push("resume");
}
