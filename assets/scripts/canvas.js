
function canvas_init() {
    prop.canvas={};

    prop.canvas.contexts={};

    prop.canvas.dirty={};

    canvas_add("atmosphere");
    canvas_add("blocks");
    canvas_add("players");
    canvas_add("water");
    canvas_add("menu");

    prop.canvas.scale=2.0;

    prop.canvas.size={ // all canvases are the same size
	height:0,
	width:0
    };
    loaded("canvas");
}

function canvas_done() {
    var directions=["left","right"];
    assets_add(new Asset(ASSET_TYPE_IMAGE,"neptune-stand",
			 "assets/images/neptune/character/stand.png"));
    assets_add(new Asset(ASSET_TYPE_IMAGE,"neptune-air",
			 "assets/images/neptune/character/stand.png"));
//    assets_add(new Asset(ASSET_TYPE_IMAGE,"bot-walk0",
//			 "assets/images/enemies/bot/walk0.png"));
    for(var i=0;i<2;i++) {
	assets_add(new Asset(ASSET_TYPE_IMAGE,"bot-walk"+i,
			     "assets/images/enemies/bot/walk"+i+".png"));
    }
    for(var i=0;i<4;i++) {
	assets_add(new Asset(ASSET_TYPE_IMAGE,"neptune-walk"+i,
			     "assets/images/neptune/character/walk"+i+".png"));
    }
    for(var i=0;i<1;i++) {
	assets_add(new Asset(ASSET_TYPE_IMAGE,
			     "block-grass"+i,"assets/images/blocks/grass/grass"+i+".png"));
    }
    assets_add(new Asset(ASSET_TYPE_IMAGE,
			 "block-ladder","assets/images/blocks/ladder/ladder.png"));
    var block_types=["sand"]
    var variants=["left","top","right"]
    for(var i=0;i<block_types.length;i++) {
	var t=block_types[i];
	for(var j=0;j<variants.length;j++) {
	    assets_add(new Asset(ASSET_TYPE_IMAGE,
				 "block-"+t+"-"+variants[j],
				 "assets/images/blocks/"+t+"/"+t+"-"+variants[j]+".png"));
	}
	assets_add(new Asset(ASSET_TYPE_IMAGE,"block-"+t,"assets/images/blocks/"+t+"/"+t+".png"));
    }
//    assets_add(new Asset(ASSET_TYPE_IMAGE,"cloud0","assets/images/clouds/cloud0.png"));
    
    canvas_text_init();
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
    cc.imageSmoothingEnabled=false;
    cc.clearRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

// ATMOSPHERE

function canvas_draw_cloud(cc,i,f) {
    return;
    var a=asset_get("cloud0",ASSET_TYPE_IMAGE);
    if(a.status != ASSET_STATUS_READY)
	return;
    fm=f+((4000/4)*i);
    var h=trange(0,i,4,0,300)%10+200;
    var d=15;
    cc.drawImage(a.data,
		 trange(0,fm,4000,
			0,prop.canvas.size.width+a.data.width)%
		 (prop.canvas.size.width+a.data.width)-a.data.width,
		 trange(0,Math.sin(fm/100),1,h-d,h+d));
}

function canvas_draw_horizon(cc) {
    var d=prop.blocks.size*prop.canvas.scale;
    var start=prop.canvas.size.height/2+
        (prop.ui.pan[1]-(blocks_get("water_level")*prop.blocks.size))*prop.canvas.scale;
    cc.fillStyle="rgba(64,32,16,0.2)";
    start=Math.max(0,start);
    cc.fillRect(0,start,prop.canvas.size.width,prop.canvas.size.height);
}

function canvas_draw_atmosphere(cc) {
    cc.fillStyle="#adf";
    cc.fillStyle=cc.createLinearGradient(0,0,0,prop.canvas.size.height);
    // cc.fillStyle.addColorStop(0.2,"#adf");
    // cc.fillStyle.addColorStop(0.7,"#fff");
    cc.fillStyle.addColorStop(0.1,"#888");
    cc.fillStyle.addColorStop(0.8,"#555");
    cc.fillStyle="#adf";
    cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
    for(var i=0;i<4;i++) {
	canvas_draw_cloud(cc,i,prop.frames);
    }
//    canvas_draw_horizon(cc);
}

// BLOCKS

function canvas_draw_block(cc,b) {
    if(block_can_clip(b))
	return;
    cc.save();
    var d=prop.blocks.size*prop.canvas.scale;
    var s=prop.canvas.scale;
    cc.translate(b.loc[0]*d,b.loc[1]*d);
    var top=block_above(b.loc,1);
    var left=block_left(b.loc,1);
    var right=block_right(b.loc,1);
    if(b.type == "sand") {
	cc.drawImage(asset_get("block-sand",ASSET_TYPE_IMAGE).data,
		     0,0,prop.blocks.size,prop.blocks.size,
		     0,0,d,d);
	if(!top || !top.solid()) {
	    cc.drawImage(asset_get("block-sand-top",ASSET_TYPE_IMAGE).data,
			 0,0,prop.blocks.size,prop.blocks.size,
			 0,-4,d,d);
	}
	if(!left || !left.solid()) {
	    cc.drawImage(asset_get("block-sand-left",ASSET_TYPE_IMAGE).data,
			 0,0,prop.blocks.size,prop.blocks.size,
			 -4,0,d,d);
	}
	if(!right || !right.solid()) {
	    cc.drawImage(asset_get("block-sand-right",ASSET_TYPE_IMAGE).data,
			 0,0,prop.blocks.size,prop.blocks.size,
			 d-4,0,d,d);
	}
    } else if(b.type == "grass") {
	if(b.loc[1]%2 == 0) {
	    cc.translate(d,0);
	    cc.scale(-1,1);
	}
	if(b.loc[0]%2 == 0) {
	    cc.translate(d,0);
	    cc.scale(-1,1);
	}
	cc.drawImage(asset_get("block-grass0",ASSET_TYPE_IMAGE).data,
		     0,0,prop.blocks.size,prop.blocks.size,
		     0,0,d,d);
    } else if(b.type == "end") {
	cc.fillStyle="#000";
	cc.fillRect(0,0,d,d);
    } else if(b.type == "ladder") {
	if(b.loc[1]%2 == 0) {
	    cc.translate(d,0);
	    cc.scale(-1,1);
	}
	if(b.loc[1]%4 == 0) {
	    cc.translate(0,d);
	    cc.scale(1,-1);
	}
	cc.drawImage(asset_get("block-ladder",ASSET_TYPE_IMAGE).data,
		     0,0,prop.blocks.size,prop.blocks.size,
		     0,0,d,d);
    }
    cc.restore();
}

function canvas_draw_blocks(cc) {
    for(var i in prop.blocks.blocks) {
        canvas_draw_block(cc,prop.blocks.blocks[i]);
    }
}

// PLAYERS

function canvas_draw_player_neptune(cc,p) {
    var s=prop.canvas.scale;
    var d=prop.blocks.size*prop.canvas.scale;
    var a=null;
    var t=4;
    var f=Math.floor(prop.frames%(t*4)/t);
    if(game_is_paused())
	f=0;
    if(!p.on_ground)
	a=asset_get("neptune-air",ASSET_TYPE_IMAGE);
    else if(Math.abs(p.motion) < tiny)
	a=asset_get("neptune-stand",ASSET_TYPE_IMAGE);
    else
	a=asset_get("neptune-walk"+f,ASSET_TYPE_IMAGE);
    if(a == null || a.status != ASSET_STATUS_READY)
	return;
    cc.translate(fl((p.loc[0]-0.5)*d),fl(-(p.loc[1]+1)*d));
    if(p.dir == "left") {
        cc.translate(d,0);
        cc.scale(-1,1);
    }
    if(prop.game.end != 0) {
	var time=new Date().getTime()-prop.game.end;
	cc.translate(d/2,d);
	if(time < 2000) {
	    cc.scale(crange(0,time,2000,1,0),crange(0,time,2000,1,0));
	} else {
	    cc.scale(crange(2000,time,3000,0,1),crange(2000,time,3000,0,1));
	}
	cc.translate(-d/2,-d);
    }
    cc.drawImage(a.data,0,0,prop.blocks.size,prop.blocks.size,
		 0,0,prop.blocks.size*s,prop.blocks.size*s);
}

function canvas_draw_player_enemy(cc,p) {
    var s=prop.canvas.scale;
    var d=prop.blocks.size*prop.canvas.scale;
    var a=null;
    var t=5;
    var f=Math.floor(prop.frames%(t*2)/t);
    if(game_is_paused())
	f=0;
    var a=asset_get("bot-walk"+f,ASSET_TYPE_IMAGE);
    if(a == null || a.status != ASSET_STATUS_READY)
	return;
    cc.translate(fl((p.loc[0]-0.5)*d),fl(-(p.loc[1]+1)*d));
    if(p.dir == "left") {
        cc.translate(d,0);
        cc.scale(-1,1);
    }
    cc.drawImage(a.data,0,0,prop.blocks.size,prop.blocks.size,
		 0,0,prop.blocks.size*s,prop.blocks.size*s);
}

function canvas_draw_player(cc,p) {
    if(p.dead)
        return;
    if(p.type == "human") {
        canvas_draw_player_neptune(cc,p);
    } else {
        canvas_draw_player_enemy(cc,p);
    }
}

function canvas_draw_players(cc) {
    cc.save();
    canvas_draw_player(cc,prop.player.human);
    cc.restore();
    for(var i=0;i<prop.player.players.length;i++) {
        cc.save();
        canvas_draw_player(cc,prop.player.players[i]);
        cc.restore();
    }
}

// WATER

function canvas_draw_water(cc) {
    var d=prop.blocks.size*prop.canvas.scale;
    var temp=prop.ui.pan[1]*prop.canvas.scale;
    var start=((d*(-blocks_get("water_level")))+prop.canvas.size.height/2)+temp;
    cc.fillStyle="rgba(64,191,255,0.2)";
    cc.fillStyle=cc.createLinearGradient(0,start,0,start+prop.canvas.size.height*2);
    cc.fillStyle.addColorStop(0.0,"rgba(64,200,255,0.4)");
    cc.fillStyle.addColorStop(1.0,"rgba(0,20,50,0.9)");
    start=Math.max(0,start);
    cc.fillRect(0,start,
		prop.canvas.size.width,prop.canvas.size.height);
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
	var o=i+3;
	m=canvas_text_metrics(item[0],"large");
	m[0]=mw;
	if(menu.selected == i) {
	    canvas_text_print(cc,(prop.canvas.size.width-m[0]-60)/2,(o*(m[1]+20))+15,
			      ">","large","cb");
	    canvas_text_print(cc,(prop.canvas.size.width+m[0]+60)/2,(o*(m[1]+20))+15,
			      "<","large","cb");
	}
	canvas_draw_item(cc,o,item[0],"large",mw);
    }
    canvas_draw_item(cc,1.5,menu.title,"large");
}

function canvas_draw_menus(cc) {
    if(false) {
	cc.beginPath();
	cc.moveTo(prop.canvas.size.width/2,0);
	cc.lineTo(prop.canvas.size.width/2,prop.canvas.size.height);
	cc.moveTo(0,prop.canvas.size.height/2);
	cc.lineTo(prop.canvas.size.width,prop.canvas.size.height/2);
	cc.lineWidth=2;
	cc.strokeStyle="#38f";
	cc.stroke();
    }
    canvas_text_print(cc,10,10,
		      "Health "+Math.round(prop.player.human.health),"small-inverse","lt");
    canvas_text_print(cc,prop.canvas.size.width-10,10,
		      "FPS "+Math.round(prop.time.fps),"small-inverse","rt");
    if(prop.game.end != 0) {
	var st=16;
	var time=new Date().getTime()-prop.game.end;
	var fade=Math.round(crange(0,time,2000,0,1)*st)/st;
	if(time > 2000) {
	    st=8;
	    fade=Math.round(crange(2000,time,3000,1,0)*st)/st;
	}
	cc.fillStyle="rgba(0,0,0,"+fade+")";
	cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
    }
    if(prop.menu.stack.length < 1)
	return;
    cc.fillStyle="#000";
    cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
    canvas_draw_menu(cc,menu_get(0));
    canvas_text_print(cc,15,prop.canvas.size.height-15,
		      "Game copyright ZLSA","small","lb");
    canvas_text_print(cc,15,prop.canvas.size.height+5,
		      "Music copyright Evan Pattison","small","lb");
    if(prop.game.state == GAME_STATE_LOADING || prop.game.loaded != 0) {
	var time=new Date().getTime()-prop.game.loaded;
	if(prop.game.loaded == 0)
	    time=0;
	var st=10;
	var fade=Math.round(crange(0,time,1000,1,0)*st)/st;
        if(time < 1000) {
	    cc.globalAlpha=fade;
	    cc.fillStyle="#000";
	    cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
	    canvas_text_print(cc,prop.canvas.size.width/2,prop.canvas.size.height/2,
			      "LOADING...","large","cc");
	    if(time > 1000)
	        prop.game.loaded=0;
	    cc.globalAlpha=1;
        }
    }
    if(menu_is_open())
        canvas_text_print(cc,prop.canvas.size.width-15,prop.canvas.size.height+5,
		          prop.about.version,"small","rb");
    return;
}

function canvas_update() {
    blocks_calculate_bounds();
    var s=prop.canvas.scale;
    if(prop.canvas.dirty.atmosphere || true) {
        prop.canvas.dirty.atmosphere=false;
        var cc=canvas_get("atmosphere");
        cc.save();
        canvas_draw_atmosphere(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.blocks || true) {
        prop.canvas.dirty.blocks=false;
        var cc=canvas_get("blocks");
        cc.save();
        canvas_clear(cc);
        cc.translate(fl(prop.canvas.size.width/2),fl(prop.canvas.size.height/2));
        cc.translate(-fl(prop.ui.pan[0]*s),fl(prop.ui.pan[1]*s));
        canvas_draw_blocks(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.players || true) {
        prop.canvas.dirty.players=false;
        var cc=canvas_get("players");
        cc.save();
        canvas_clear(cc);
        cc.translate(fl(prop.canvas.size.width/2),fl(prop.canvas.size.height/2));
        cc.translate(-fl(prop.ui.pan[0]*s),fl(prop.ui.pan[1]*s));
        canvas_draw_players(cc);
        cc.restore();
    }
    if(prop.canvas.dirty.water) {
        prop.canvas.dirty.water=false;
        var cc=canvas_get("water");
        cc.save();
        canvas_clear(cc);
        canvas_draw_water(cc);
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
    canvas_dirty();
}
