
var GAME_STATE_LOADING=0;
var GAME_STATE_MENU=1;
var GAME_STATE_PLAY=2;
var GAME_STATE_END=3;

var levels=[
    ["demo","grassland"],
    ["level1","grassland"]
];

function game_init() {
    prop.game={};

    prop.game.level=0;
    prop.game.in_window=true;
    prop.game.gravity=[0,-2];
    prop.game.speedup=1; // good for debugging
    prop.game.end=0;
    prop.game.loaded=0;

    prop.game.state=GAME_STATE_LOADING;

    loaded("game");
}

function game_done() {
    for(var i=0;i<levels.length;i++) {
        var l=new Asset(ASSET_TYPE_MAP,levels[i][0],"assets/maps/"+levels[i][0]+".map");
//        l.onload=blocks_load_from_string;
        assets_add(l);
        audio_add(levels[i][1]);
    }
}

function game_is_paused() {
    if(prop.game.state != GAME_STATE_PLAY || menu_is_open() || !prop.game.in_window)
        return(true);
    return(false);
}

function game_next_level() {
    prop.game.state=GAME_STATE_END;
    prop.game.end=new Date().getTime();
    prop.game.level+=1;
    if(prop.game.level >= levels.length) {
        alert("You've completed the game! Do it again!...");
        location.reload();
    } else {
        setTimeout(game_start,2000);
    }
}

function game_restart() {
    prop.game.level=0;
    game_start();
}

function game_start() {
    setTimeout(function() {
	prop.game.end=0;
    },1000);
    var level=asset_get(levels[prop.game.level][0],ASSET_TYPE_MAP);
    if(level) {
        blocks_load_from_string(level.data);
    }
    if(prop.game.state == GAME_STATE_LOADING)
	prop.game.loaded=new Date().getTime();
    prop.game.state=GAME_STATE_END;
    prop.game.end=new Date().getTime()-2000;
    menu_clear();
    prop.player.human.restart();
    var name=levels[prop.game.level][1];
    setTimeout(function() {
        prop.game.state=GAME_STATE_PLAY;
        prop.game.end=0;
    },1000);
//    if(!audio_is_playing(name))
    audio_start(name);
}

function game_resume_menu() {
    prop.menu.menus["resume"]=new Menu("Resume saved game",[
	["No saved games"]
    ]);
    prop.menu.stack.push("resume");
}

function game_update() {
    if(prop.assets.queue.length == 0 && prop.game.state == GAME_STATE_LOADING) {
//        game_restart();
    }
    var name=levels[prop.game.level][1];
    if((prop.game.state == GAME_STATE_END ||
        prop.game.state == GAME_STATE_PLAY) &&
       (!menu_is_open() && prop.game.in_window)) {
        if(!audio_is_playing(name))
            audio_play(name);
    } else {
        if(audio_is_playing(name))
            audio_pause(name);
    }
}
