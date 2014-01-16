
var GAME_STATE_MENU=0; // welcome
var GAME_STATE_PAUSED=1;
var GAME_STATE_PLAY=2;

function game_init() {
    prop.game={};
    
    prop.game.paused=false;
    prop.game.in_window=true;
    prop.game.gravity=[0,-14];
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
    if(prop.game.paused || menu_is_open() || !prop.game.in_window)
        return(true);
    return(false);
}

function game_restart() {

}

function game_start() {
    console.log("Started game!");
    menu_clear();
    prop.player.human.restart();
}

function game_resume_menu() {
    prop.menu.menus["resume"]=new Menu("Resume saved game",[
	["No saved games"]
    ]);
    prop.menu.stack.push("resume");
}
