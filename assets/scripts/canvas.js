
function canvas_init() {
    prop.canvas={};

    prop.canvas.contexts={};

    prop.canvas.dirty={};

    canvas_add("atmosphere");
    canvas_add("blocks");
    canvas_add("menu");

    prop.canvas.size={ // all canvases are the same size
	height:0,
	width:0
    };

    loaded("canvas");
}

function canvas_resize() {
    if(false) {
        prop.canvas.size.height=$(window).height();
        prop.canvas.size.width=$(window).width();
    } else {
        prop.canvas.size.height=480;
        prop.canvas.size.width=640;
    }
    for(var i in prop.canvas.contexts) {
        prop.canvas.contexts[i].canvas.height=prop.canvas.size.height;
        prop.canvas.contexts[i].canvas.width=prop.canvas.size.width;
    }
    canvas_dirty();
}

function canvas_dirty() {
    for(var i in prop.canvas.dirty) {
        prop.canvas.dirty[i]=true;
    }
}

function canvas_add(name) {
    $("body").append("<canvas id='"+name+"-canvas'></canvas>");
    prop.canvas.contexts[name]=$("#"+name+"-canvas").get(0).getContext("2d");    
    prop.canvas.dirty[name]=true;
}

function canvas_get(name) {
    return(prop.canvas.contexts[name]);
}

function canvas_clear(cc) {
    cc.clearRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

// ATMOSPHERE

function canvas_draw_atmosphere(cc) {
    cc.fillStyle="#adf";
    cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

// BLOCKS

function canvas_draw_block(cc,id) {
    var b=prop.blocks.blocks[id];
    var s=prop.ui.scale;
    var c="#f0f";
    switch(b.type) {
    case "wall":
        c="#444";
        break;
    case "none":
    case "start":
        return;
    }
    if(b.closest == true) {
        c="#0ff";
        b.closest=false;
    }
    cc.fillStyle=c;
    cc.lineWidth=2;
    cc.fillRect((b.loc[0]*s)-s/2,(b.loc[1]*s)-s/2,s,s);
    cc.strokeRect((b.loc[0]*s)-s/2,(b.loc[1]*s)-s/2,s,s);
}

function canvas_draw_blocks(cc) {
    return;
    for(var i=0;i<prop.blocks.blocks.length;i++) {
        canvas_draw_block(cc,i);
    }
}

// PLAYERS

function canvas_draw_player(cc,p) {
    var s=prop.ui.scale;
    cc.fillStyle="#f0f";
    cc.fillRect(-s/2,-s/2,s,s);
}

function canvas_draw_players(cc) {
    canvas_draw_player(cc,prop.player.human);
}

function canvas_update() {
    if(prop.canvas.dirty.atmosphere) {
        prop.canvas.dirty.atmosphere=false;
        var cc=canvas_get("atmosphere");
        cc.save();
        canvas_draw_atmosphere(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.blocks) {
        prop.canvas.dirty.blocks=false;
        var cc=canvas_get("blocks");
        cc.save();
        canvas_clear(cc);
        cc.translate(f(prop.canvas.size.width/2),f(prop.canvas.size.height/2));
        cc.translate(f(prop.ui.pan[0]),f(prop.ui.pan[1]));
        canvas_draw_blocks(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.players) {
        prop.canvas.dirty.players=false;
        var cc=canvas_get("players");
        cc.save();
        canvas_clear(cc);
        cc.translate(f(prop.canvas.size.width/2),f(prop.canvas.size.height/2));
//        cc.translate(f(prop.ui.pan[0]),f(prop.ui.pan[1]));
        canvas_draw_players(cc);
        cc.restore();
    }
    canvas_dirty();
}
