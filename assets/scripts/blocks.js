
var Block=function(loc,type) {
    this.loc=loc;
    this.type=type;
    this.ladder=false;
    this.solid=function() {
	if(this.type == "sand" ||
	   this.type == "dirt")
	    return true;
	return false;
    };
};

function blocks_init() {
    prop.blocks={};

    prop.blocks.blocks={};

    prop.blocks.size=24;

    prop.blocks.data={
	name:"",
	water_level:0
    };

    prop.blocks.bounds=[0,0,0,0];

    var l=new Asset(ASSET_TYPE_MAP,"demo","assets/maps/demo.map");
    l.onload=blocks_load_from_string;
    assets_add(l);
    loaded("blocks");
}

function blocks_get(key) {
    return(prop.blocks.data[key]);
}

function blocks_calculate_bounds() {
    if(game_is_paused())
	return;
    var d=prop.blocks.size//*prop.canvas.scale;
    var lb=Math.floor((prop.ui.pan[0]-prop.canvas.size.width/2)/d)-1;
    var rb=Math.ceil((prop.ui.pan[0]+prop.canvas.size.width/2)/d)+1;
    var tb=-Math.floor((prop.ui.pan[1]-prop.canvas.size.height/2)/d)-1;
    var bb=-Math.ceil((prop.ui.pan[1]+prop.canvas.size.height/2)/d)+1;
    prop.blocks.bounds=[tb,rb,bb,lb];
//    console.log(prop.blocks.bounds);
}

function block_can_clip(b) {
    var l=b.loc;
    var d=prop.blocks.size*prop.canvas.scale;
    if((prop.blocks.bounds[BOTTOM] < b.loc[1]) &&
       (prop.blocks.bounds[TOP] > b.loc[1]) &&
       (prop.blocks.bounds[LEFT] < b.loc[0]) &&
       (prop.blocks.bounds[RIGHT] > b.loc[0]))
	return false;
    return true;
}

function block_get(x,y) {
    var bn=x+":"+y;
    if(bn in prop.blocks.blocks)
	return prop.blocks.blocks[bn];
    return null;
}

function block_above(loc,md,start) {
    if(!start) start=1;
    var x=loc[0];
    var y=loc[1]-start;
    if(!md) md=5;
    for(var i=0;i<md;i++) {
	var bn=x+":"+(y-i);
	if(bn in prop.blocks.blocks)
	    return prop.blocks.blocks[bn];
    }
    return null;
}

function block_below(loc,md,start) {
    if(!start) start=1;
    var x=loc[0];
    var y=loc[1]+start;
    if(!md) md=5;
    for(var i=0;i<md;i++) {
	var bn=x+":"+(y+i);
	if(bn in prop.blocks.blocks)
	    return prop.blocks.blocks[bn];
    }
    return null;
}

function block_left(loc,md,start) {
    if(!start) start=1;
    var x=loc[0]-start;
    var y=loc[1];
    if(!md) md=5;
    for(var i=0;i<md;i++) {
	var bn=(x-i)+":"+y;
	if(bn in prop.blocks.blocks)
	    return prop.blocks.blocks[bn];
    }
    return null;
}

function block_right(loc,md,start) {
    if(!start) start=1;
    var x=loc[0]+start;
    var y=loc[1];
    if(!md)
	md=5;
    for(var i=0;i<md;i++) {
	var bn=(x+i)+":"+y;
	if(bn in prop.blocks.blocks)
	    return prop.blocks.blocks[bn];
    }
    return null;
}

function blocks_load_from_string(string) {
    prop.blocks.blocks={};
    var x=0;
    var y=0;
    var mode="header";
    var headerline="";
    prop.blocks.data={
	water_level:0,
	name:""
    };
    for(var i=0;i<string.length;i++) {
        var type="none";
        var c=string[i];
	if(mode == "header") {
	    if(c == "\n") {
		var header=headerline.split(":");
		prop.blocks.data["name"]=header[0];
		prop.blocks.data["water_level"]=parseFloat(header[1]);
		mode="blocks";
	    } else {
		headerline+=c;
	    }
	    continue;
	}
        if(c == "\n") {
            y+=1;
            x=0;
            continue;
        }
        switch(c) {
        case "*":
            type="sand";
            break;
        case "#":
            type="dirt";
            break;
        case "H":
            type="ladder";
            break;
        case "\"":
            type="grass";
            break;
        case ".":
            type="water";
            break;
        case "@":
            type="start";
            break;
        case "E":
            type="end";
            break;
        }
        if(type == "start") {
            prop.blocks.start=[x+0.5,-y-1];
            x+=1;
            continue;
        } else if(type == "none") {
            x+=1;
	    continue;
	}
	var b=new Block([x,y],type);
	if(type == "ladder")
	    b.ladder=true;
        prop.blocks.blocks[x+":"+y]=b;
        x+=1;
    }
    prop.player.human=new Player(prop.blocks.start);
    prop.canvas.dirty.blocks=true;
}
