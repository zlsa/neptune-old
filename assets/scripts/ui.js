
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

    prop.ui.keys={};
    
    $(window).keydown(function(e) {
	prop.ui.keys[e.which]=true;
	if(e.which == keysym.esc)
	    menu_toggle();
	else if(e.which == keysym.enter)
	    menu_enter();
	else if(e.which == keysym.up)
	    menu_move(-1);
	else if(e.which == keysym.down)
	    menu_move(1);
    });
    
    $(window).keyup(function(e) {
	prop.ui.keys[e.which]=false;
    });
    
    loaded("ui");
}

