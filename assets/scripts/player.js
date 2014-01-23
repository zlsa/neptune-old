
var MAX_HEALTH=5;
var TOP=0;
var RIGHT=1;
var BOTTOM=2;
var LEFT=3;

var Player=function(loc,type) {
    if(!type)
        type="human"
    this.dead=false;
    this.dead_amount=0;
    this.startpos=loc;
    this.loc=[loc[0],loc[1]];
    this.width=0.4;
    this.jump=false; // set to true to jump
    this.down=false;
    this.climbing=false;
    this.motion=0; // -1 for left, 1 for right
    this.speed=[0,0]; // in units/second
    this.hit=[false,false,false,false]; // top right bottom left
    this.type=type; // "human" or "ai"
    this.jump_force=1;
    this.climb_speed=1;
    this.on_ground=false;
    this.swimming=false;
    this.dir="right";
    this.walk_speed=1;
    this.health=MAX_HEALTH;
    this.ai={
	active:false,
	jumping:false,
	direction:1
    };
    if(this.type == "enemy") {
        this.ai.active=true;
        this.walk_speed=0.5;
        this.width=0.5;
    }
    this.update_ai=function() {
        var left_bottom=block_get(fl(this.loc[0]-0.5),-fl(this.loc[1]));
        var right_bottom=block_get(fl(this.loc[0]+0.5),-fl(this.loc[1]));
        if(left_bottom && left_bottom.solid())
            left_bottom=true;
        else
            left_bottom=false;
        if(right_bottom && right_bottom.solid())
            right_bottom=true;
        else
            right_bottom=false;
	if(this.hit[RIGHT] || this.hit[LEFT])
	    this.ai.direction*=-1;
        if(!left_bottom)
            this.ai.direction=1;
        else if(!right_bottom)
            this.ai.direction=-1;
	this.motion=this.ai.direction;
    };
    this.restart=function() {
        this.loc=[this.startpos[0],this.startpos[1]];
        this.jump=false;
        this.down=false;
        this.climbing=false;
        this.motion=0;
        this.speed=[0,0];
        this.hit=[false,false,false,false];
        this.type=type;
        this.on_ground=false;
        this.swimming=false;
        this.dir="right";
        this.health=MAX_HEALTH;
        this.ai={
	    active:false,
	    jumping:false,
	    direction:1
        };
    };
    this.update_physics=function(ts) {
	if(this.motion < -tiny)
	    this.dir="left";
	else if(this.motion > tiny)
	    this.dir="right";
        this.speed[0]=this.motion*1.5*this.walk_speed;
        this.speed[0]+=prop.game.gravity[0]*ts;
	var under=block_get(fl(this.loc[0]),-fl(this.loc[1]+1));
	var under_player=block_get(fl(this.loc[0]),-fl(this.loc[1]+1.5)); // undr plyr not ft
	var above=block_get(fl(this.loc[0]),-fl(this.loc[1]+2));
        if(under_player && under_player.type == "health" && !under_player.used &&
           this.health < MAX_HEALTH-1 && this.type == "human") {
            this.health+=1;
            under_player.used=new Date().getTime();
        }
	if(under && under.type == "end" && this.type == "human") {
            if(prop.game.state == GAME_STATE_PLAY)
	        game_next_level();
	}
	if(above && !above.solid()) {
	    above=null;
	}
	if(under && under.ladder) {
	    this.climbing=true;
	} else {
	    this.climbing=false;
	}
	if(!this.climbing)
            this.speed[1]+=prop.game.gravity[1]*ts;
	else
	    this.speed[1]=0;
        if(this.jump) {
	    if(under && under.ladder) {
		if(!above || !above.solid()) {
		    this.speed[1]+=2.2*this.jump_force;
		    this.climbing=false;
		} else {
		    this.speed[1]=1.5*this.climb_speed;
		}
	    } else if(this.on_ground && !this.hit[TOP]) {
		this.speed[1]+=2.2*this.jump_force;
		this.climbing=false;
	    }
        } else if(this.down && under && under.ladder && (!above || !above.solid())) {
	    this.speed[1]=-1.5*this.climb_speed;
	}
    }; 
    this.block_bottom=function() {
	var bottom_left_loc=[fl(this.loc[0]-this.width/4),-fl(this.loc[1])];
	var bottom_right_loc=[fl(this.loc[0]+this.width/4),-fl(this.loc[1])];
	var bottom_left_height=block_below(bottom_left_loc,2,-1,true);
	var bottom_right_height=block_below(bottom_right_loc,2,-1,true);
	if(bottom_left_height && bottom_left_height.solid())
	    bottom_left_height=-bottom_left_height.loc[1];
	else
	    bottom_left_height=-1000000;
	if(bottom_right_height && bottom_right_height.solid())
	    bottom_right_height=-bottom_right_height.loc[1];
	else
	    bottom_right_height=-1000000;
	var bottom=Math.max(bottom_left_height,bottom_right_height);
	return(bottom);
    };
    this.block_top=function() {
	var top_left_loc=[fl(this.loc[0]-this.width/4),-fl(this.loc[1]+0.2)];
	var top_right_loc=[fl(this.loc[0]+this.width/4),-fl(this.loc[1]+0.2)];
	var top_left_height=block_above(top_left_loc,2,0,true);
	var top_right_height=block_above(top_right_loc,2,0,true);
	if(top_left_height && top_left_height.solid())
	    top_left_height=-top_left_height.loc[1];
	else
	    top_left_height=1000000;
	if(top_right_height && top_right_height.solid())
	    top_right_height=-top_right_height.loc[1];
	else
	    top_right_height=1000000;
	var top=Math.min(top_left_height,top_right_height);
	return(top-1);
    };
    this.block_left=function() {
	var left_top_loc=[fl(this.loc[0]+this.width),-fl(this.loc[1]+1.8)];
	var left_bottom_loc=[fl(this.loc[0]+this.width),-fl(this.loc[1]+1.2)];
	var left_top_distance=block_left(left_top_loc,2,0,true);
	var left_bottom_distance=block_left(left_bottom_loc,2,0,true);
	if(left_top_distance && left_top_distance.solid())
	    left_top_distance=-left_top_distance.loc[0];
	else
	    left_top_distance=1000000;
	if(left_bottom_distance && left_bottom_distance.solid())
	    left_bottom_distance=-left_bottom_distance.loc[0];
	else
	    left_bottom_distance=1000000;
	var left_distance=Math.min(left_top_distance,left_bottom_distance);
	return(-(left_distance-1));
    };
    this.block_right=function() {
	var right_top_loc=[fl(this.loc[0]-this.width),-fl(this.loc[1]+1.8)];
	var right_bottom_loc=[fl(this.loc[0]-this.width),-fl(this.loc[1]+1.2)];
	var right_top_distance=block_right(right_top_loc,2,0,true);
	var right_bottom_distance=block_right(right_bottom_loc,2,0,true);
	if(right_top_distance && right_top_distance.solid())
	    right_top_distance=-right_top_distance.loc[0];
	else
	    right_top_distance=-1000000;
	if(right_bottom_distance && right_bottom_distance.solid())
	    right_bottom_distance=-right_bottom_distance.loc[0];
	else right_bottom_distance=-1000000;
	var right_distance=Math.max(right_top_distance,right_bottom_distance);
	return(-(right_distance));
    };
    // this.block_right=function() {
    // 	var right_loc=[fl(this.loc[0]-this.width),-fl(this.loc[1]+1.1)];
    // 	var right_distance=block_right(right_loc,2,0);
    // 	if(right_distance) right_distance=-right_distance.loc[0];
    // 	else right_distance=-1000000;
    // 	return(-(right_distance));
    // };
    this.update_health=function(ts) {
        if(this.type != "human")
            return;
        for(var i=0;i<prop.player.players.length;i++) {
            var player=prop.player.players[i];
            if(player.dead)
                continue;
            if((this.loc[0]-this.width < player.loc[0]) &&
               (this.loc[0]+this.width > player.loc[0])) {
                if((this.loc[1] < player.loc[1]+0.6) &&
                   (this.loc[1] > player.loc[1]+0.3) &&
                   (this.speed[1] < 0)) {
                    player.dead=true;
                    this.speed[1]=1.8*this.jump_force;
                } else if((this.loc[1] < player.loc[1]+0.6) &&
                          (this.loc[1] > player.loc[1]-0.1)) {
                    this.health-=1*ts;
                    if(this.loc[1] < player.loc[1])
                        this.speed[0]=player.speed[0];
                    else
                        this.speed[0]=player.speed[0];
                }
            }
        }
        if(this.health < 0) {
            prop.menu.stack=["dead"];
            prop.game.lives-=1;
        }
    };
    this.real_update=function(ts) {
        if(this.dead) {
            this.dead_amount+=1*ts;
            return;
        }
	if(this.loc[1] < blocks_get("water_level"))
	    this.swimming=true;
	else
	    this.swimming=false;
        this.update_physics(ts);
	this.update_health(ts);
//        this.speed[0]=clamp(-3,this.speed[0],3);
//        this.speed[1]=clamp(-10,this.speed[1],10);
        this.loc[0]+=this.speed[0]*ts;
        this.loc[1]+=this.speed[1]*ts;
	var left=this.block_left();
	var right=this.block_right();
	this.hit[LEFT]=false;
	this.hit[RIGHT]=false;
	if(this.loc[0] < left+this.width/2) {
	    this.loc[0]=left+this.width/2+tiny;
	    this.speed[0]=0;
	    this.hit[LEFT]=true;
	}
	if(this.loc[0] > right-this.width/2) {
	    this.loc[0]=right-this.width/2-tiny;
	    this.speed[0]=0;
	    this.hit[RIGHT]=true;
	}
	var bottom=this.block_bottom();
	var top=this.block_top();
	this.hit[TOP]=false;
	this.hit[BOTTOM]=false;
	if(bottom > this.loc[1]) {
	    this.on_ground=true;
	    this.loc[1]=bottom+tiny;
	    this.speed[1]=0;
	    this.hit[BOTTOM]=true;
	} else if(top < this.loc[1]+1) {
	    this.loc[1]=top-1-tiny;
	    this.speed[1]=0;
	    this.hit[TOP]=true;
	} else {
	    this.hit[BOTTOM]=true;
	    this.hit[TOP]=true;
	    this.on_ground=false;
	}
	var left=this.block_left();
	var right=this.block_right();
	if(this.loc[0] < left+this.width/2) {
	    this.loc[0]=left+this.width/2+tiny;
	    this.speed[0]=0;
	}
	if(this.loc[0] > right-this.width/2) {
	    this.loc[0]=right-this.width/2-tiny;
	    this.speed[0]=0;
	}
	if(this.ai.active)
	    this.update_ai();
	if(this.climbing)
	    this.on_ground=true;
    };
    this.update=function() {
        var substeps=prop.game.speedup;
	var ts=delta()/substeps;
        for(var i=0;i<substeps;i++) {
            this.real_update(ts);
            if(this.type != "human")
                break;
        }
    }
}

function player_update() {
    if(game_is_paused())
	return;
    prop.player.human.update();
    for(var i=0;i<prop.player.players.length;i++) {
        prop.player.players[i].update();
    }
}

function player_init() {
    prop.player={};

    prop.player.players=[];
    prop.player.human=new Player([0,0]);

    loaded("player");
}

function player_add(p) {
    prop.player.players.push(p);
}

function player_warp(x,y) {
    prop.player.human.loc=[x,y];
}
