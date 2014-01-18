
var GAME_STATE_MENU=0; // welcome
var GAME_STATE_PLAY=1;
var GAME_STATE_END=2;

function game_init() {
    prop.game={};

    prop.game.level=1;
    prop.game.in_window=true;
    prop.game.gravity=[0,-2];
    prop.game.speedup=1; // good for debugging
    prop.game.end=0;

    prop.game.state=GAME_STATE_PLAY;

    game_restart();

    loaded("game");
}

function game_is_paused() {
    if(prop.game.state != GAME_STATE_PLAY || menu_is_open())
        return(true);
    return(false);
}

function game_restart() {

}

function game_next_level() {
    prop.game.state=GAME_STATE_END;
    prop.game.end=new Date().getTime();
    prop.game.level+=1;
    setTimeout(game_start,2000);
}

function game_start() {
    setTimeout(function() {
	prop.game.end=0;
    },1000);
    prop.game.state=GAME_STATE_PLAY;
    menu_clear();
    prop.player.human.restart();
}

function game_resume_menu() {
    prop.menu.menus["resume"]=new Menu("Resume saved game",[
	["No saved games"]
    ]);
    prop.menu.stack.push("resume");
}
