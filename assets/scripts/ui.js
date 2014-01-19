
var keysym={
    esc:27,
    enter:13,
    space:32,
    shift:16,
    ctrl:17,
    alt:18,
    tab:9,
    left:37,
    up:38,
    right:39,
    down:40
};

function ui_init() {
    prop.ui={};

    prop.ui.pan=[0,0];

    prop.ui.keys={};
    
    $(window).keydown(function(e) {
	prop.ui.keys[e.which]=true;
	if(e.which == keysym.esc) {
	    menu_toggle();
	} else if(e.which == keysym.space) {
	    cheat();
	} else if(e.which == keysym.enter) {
	    menu_enter();
	} else if(e.which == keysym.up) {
	    if(menu_is_open())
		menu_move(-1);
	} else if(e.which == keysym.down) {
	    if(menu_is_open())
		menu_move(1);
	}
    });

    $(window).blur(function() {
	prop.game.in_window=false;
    });
    
    $(window).focus(function() {
	prop.game.in_window=true;
    });
    
    $(window).keyup(function(e) {
	prop.ui.keys[e.which]=false;
    });
    
    loaded("ui");
}

function cheat() {
    player_warp(75,-7);
}

function ui_update() {
    if(menu_is_open())
	return;
    if(!prop.player.human.ai.active) {
	if(prop.ui.keys[keysym.left]) {
            prop.player.human.motion=-1;
	} else if(prop.ui.keys[keysym.right]) {
            prop.player.human.motion=1;
	} else {
            prop.player.human.motion=0;
	}
	if(prop.ui.keys[keysym.up]) {
            prop.player.human.jump=true;
	} else if(prop.ui.keys[keysym.down]) {
            prop.player.human.down=true;
	} else {
            prop.player.human.jump=false;
            prop.player.human.down=false;
	}
    }
    prop.ui.pan=[
        prop.player.human.loc[0]*prop.blocks.size,
        prop.player.human.loc[1]*prop.blocks.size
    ];
}
