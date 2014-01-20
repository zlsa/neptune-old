
var Menu=function(title,items) {
    this.title=title;
    this.items=items;
    this.selected=0;
};

function menu_init() {
    prop.menu={};
    
    prop.menu.menus={};

    prop.menu.menus["main"]=new Menu("Neptune",[
	["Start game","start"],
	["Options","options"],
	["Help","help"]
    ]);

    prop.menu.menus["dead"]=new Menu("You died",[
	["Restart level",game_start],
	["Main menu","main"],
    ]);

    prop.menu.menus["paused"]=new Menu("Paused",[
	["Resume game",menu_clear],
	["Start new game","start"],
	["Options","options"],
	["Help","help"]
    ]);

    prop.menu.menus["start"]=new Menu("Start game",[
	["New game","lose_progress"],
	["Resume saved",game_resume_menu]
    ]);

    prop.menu.menus["lose_progress"]=new Menu("Restart game?",[
	["Yes",game_restart],
	["Cancel!",menu_up]
    ]);

    prop.menu.menus["options"]=new Menu("Options",[
	["No options"]
    ]);

    prop.menu.menus["help"]=new Menu("Help",[
	["No help"]
    ]);

    prop.menu.stack=["main"];
    
    loaded("menu");
}

function menu_selected() {
    return(prop.menu.menus[prop.menu.stack[prop.menu.stack.length-1]]);
}

function menu_selected_item(m) {
    return(m.items[m.selected]);
}

function menu_is_open() {
    if(prop.menu.stack.length == 0)
	return false;
    return true;
}

function menu_toggle() {
    if(menu_is_open()) {
	menu_up();
    } else {
	menu_open();
    }
}

function menu_open() {
    prop.menu.stack=["paused"];
    prop.canvas.dirty.menu=true;
}

function menu_up() {
    var last=false;
    if(prop.menu.stack.length == 0) {
	last=true;
    } else {
	var m=prop.menu.stack.pop();
	prop.menu.menus[m].selected=0;
    }
    if(prop.game.state == GAME_STATE_LOADING && prop.menu.stack.length == 0) {
        prop.menu.stack=["main"];
    }
    prop.canvas.dirty.menu=true;
    return last;
}

function menu_clear() {
    while(menu_up() == false)
	;
}

function menu_enter() {
    if(prop.menu.stack.length == 0) {
	return;
    } else {
	var s=menu_selected_item(menu_selected());
	if(typeof s[1] == typeof "") {
	    prop.menu.stack.push(s[1]);
	} else if(typeof s[1] == typeof function(){}) {
	    s[1]();
	}
    }
    prop.canvas.dirty.menu=true;
}

function menu_move(offset) {
    var n=menu_get(0).selected;
    n+=offset;
    n=clamp(0,n,prop.menu.menus[prop.menu.stack[prop.menu.stack.length-1]].items.length-1);
    menu_get(0).selected=n;
    prop.canvas.dirty.menu=true;
}

function menu_get(offset) {
    var i=prop.menu.stack.length-offset-1;
    i=clamp(0,i,prop.menu.stack.length);
    return(prop.menu.menus[prop.menu.stack[i]]);
}

function menu_update() {
    if(menu_is_open()) {
        if(!audio_is_playing("title") && prop.menu.stack[0] == "main") {
            var time=new Date().getTime()-prop.assets.last;
            if(prop.assets.last != 0 && prop.assets.queue.length == 0) {
                audio_start("title");
            }
        }
    } else {
        if(audio_is_playing("title"))
            audio_stop("title");
    }
}
