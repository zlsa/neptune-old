
function canvas_init() {
    prop.canvas={};

    prop.canvas.contexts={};

    prop.canvas.dirty={};

    canvas_add("atmosphere");
    canvas_add("blocks");
    canvas_add("menu");

    prop.canvas.scale=1.0;

    prop.canvas.size={ // all canvases are the same size
	height:0,
	width:0
    };

    canvas_text_init();
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

// MENU

function canvas_draw_item(cc,i,t,font,mw) {
    var m=canvas_text_metrics(t,font);
    canvas_text_print(cc,
		      prop.canvas.size.width/2,(i*(m[1]+20))+15,
                      t,font,"cb");
}

function canvas_draw_menu(cc,menu) {
    var m=canvas_text_metrics("f","large");
    var mw=0;
    for(var i=0;i<menu.items.length;i++) {
	mw=Math.max(canvas_text_metrics(menu.items[i][0],"large")[0],mw);
    }
    for(var i=0;i<menu.items.length;i++) {
	var item=menu.items[i];
	var o=i+2.5;
	m=canvas_text_metrics(item[0],"large");
//	m[0]=mw;
	if(menu.selected == i) {
	    canvas_text_print(cc,(prop.canvas.size.width-m[0]-60)/2,(o*(m[1]+20))+15,
			      ">","large","cb");
	    canvas_text_print(cc,(prop.canvas.size.width+m[0]+60)/2,(o*(m[1]+20))+15,
			      "<","large","cb");
	}
	canvas_draw_item(cc,o,item[0],"large",mw);
    }
    canvas_draw_item(cc,1,menu.title,"large");
}

function canvas_draw_menus(cc) {
    if(prop.menu.stack.length < 1)
	return;
    cc.imageSmoothingEnabled=false;
    cc.fillStyle="rgba(0,0,0,0.8)";
    cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
    canvas_draw_menu(cc,menu_get(0));
    canvas_text_print(cc,10,prop.canvas.size.height-30,
		      "Game copyright Forest Ka","small","lb");
    canvas_text_print(cc,10,prop.canvas.size.height-10,
		      "Music copyright Evan Pattison","small","lb");
    return;
    cc.beginPath();
    cc.moveTo(prop.canvas.size.width/2,0);
    cc.lineTo(prop.canvas.size.width/2,prop.canvas.size.height);
    cc.moveTo(0,prop.canvas.size.height/2);
    cc.lineTo(prop.canvas.size.width,prop.canvas.size.height/2);
    cc.lineWidth=2;
    cc.strokeStyle="#38f";
    cc.stroke();
    cc.beginPath();
    cc.arc(prop.canvas.size.width/2,prop.canvas.size.height/2,prop.canvas.size.height/2.5,0,Math.PI*2);
    cc.stroke();
//    cc.translate(fl(prop.canvas.size.width/2),0);
    // cc.fillStyle="#fff";
    // var f=fonts.large;
    // cc.fillRect(-prop.canvas.size.width/3,10+2.2*(f.metrics.height*prop.canvas.scale),
    //             prop.canvas.size.width/1.5,3);
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
        cc.translate(fl(prop.canvas.size.width/2),fl(prop.canvas.size.height/2));
        canvas_draw_blocks(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.players) {
        prop.canvas.dirty.players=false;
        var cc=canvas_get("players");
        cc.save();
        canvas_clear(cc);
        cc.translate(fl(prop.canvas.size.width/2),fl(prop.canvas.size.height/2));
//        cc.translate(fl(prop.ui.pan[0]),fl(prop.ui.pan[1]));
        canvas_draw_players(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.menu) {
        prop.canvas.dirty.menu=false;
        var cc=canvas_get("menu");
        cc.save();
        canvas_clear(cc);
        canvas_draw_menus(cc);
        cc.restore();
    }
//    canvas_dirty();
}
