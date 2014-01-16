
var TOP=0;
var RIGHT=1;
var BOTTOM=2;
var LEFT=3;

var Player=function(loc,type) {
    if(!type)
        type="human"
    this.startpos=loc;
    this.loc=[loc[0],loc[1]];
    this.width=0.4;
    this.jump=false; // set to true to jump
    this.motion=0; // -1 for left, 1 for right
    this.speed=[0,0]; // in units/second
    this.pain=[0,0,0,0]; // top right bottom left
    this.hit=[false,false,false,false]; // top right bottom left
    this.type=type; // "human" or "ai"
    this.on_ground=false;
    this.swimming=false;
    this.dir="left";

    this.update_ai=function() {
	return;
	this.motion=1;
	this.jump=true;
    };
    this.restart=function() {
	this.on_ground=false;
	this.motion=0;
	this.speed=[0,0];
	this.loc=[loc[0],loc[1]];
    };
    this.update_physics=function() {
        var ts=1/prop.time.frame_time_avg;
	if(this.motion < -tiny)
	    this.dir="left";
	else if(this.motion > tiny)
	    this.dir="right";
        this.speed[0]=this.motion*4;
        this.speed[0]+=prop.game.gravity[0]*ts;
        this.speed[1]+=prop.game.gravity[1]*ts;
        if(this.jump) {
	    if(this.on_ground && !this.hit[TOP]) {
		this.speed[1]+=4.2;
	    }
        }
	if(this.hit[LEFT]) {
	    this.speed[0]=Math.max(0,this.speed[0]);
	}
	if(this.hit[RIGHT]) {
	    this.speed[0]=Math.min(0,this.speed[0]);
	}
    }; 
    this.block_bottom=function() {
	var bottom_left_loc=[fl(this.loc[0]-this.width/4),-fl(this.loc[1])];
	var bottom_right_loc=[fl(this.loc[0]+this.width/4),-fl(this.loc[1])];
	var bottom_left_height=block_below(bottom_left_loc,2,-1);
	var bottom_right_height=block_below(bottom_right_loc,2,-1);
	if(bottom_left_height) bottom_left_height=-bottom_left_height.loc[1];
	else bottom_left_height=-1000000;
	if(bottom_right_height) bottom_right_height=-bottom_right_height.loc[1];
	else bottom_right_height=-1000000;
	var bottom=Math.max(bottom_left_height,bottom_right_height);
	return(bottom);
    };
    this.block_top=function() {
	var top_left_loc=[fl(this.loc[0]-this.width/4),-fl(this.loc[1]+1)];
	var top_right_loc=[fl(this.loc[0]+this.width/4),-fl(this.loc[1]+1)];
	var top_left_height=block_above(top_left_loc,2,0);
	var top_right_height=block_above(top_right_loc,2,0);
	if(top_left_height) top_left_height=-top_left_height.loc[1];
	else top_left_height=1000000;
	if(top_right_height) top_right_height=-top_right_height.loc[1];
	else top_right_height=1000000;
	var top=Math.min(top_left_height,top_right_height);
	return(top-1);
    };
    this.block_left=function() {
	var left_top_loc=[fl(this.loc[0]+this.width),-fl(this.loc[1]+1.9)];
	var left_bottom_loc=[fl(this.loc[0]+this.width),-fl(this.loc[1]+1.1)];
	var left_top_distance=block_left(left_top_loc,2,0);
	var left_bottom_distance=block_left(left_bottom_loc,2,0);
	if(left_top_distance) left_top_distance=-left_top_distance.loc[0];
	else left_top_distance=1000000;
	if(left_bottom_distance) left_bottom_distance=-left_bottom_distance.loc[0];
	else left_bottom_distance=1000000;
	var left_distance=Math.min(left_top_distance,left_bottom_distance);
	return(-(left_distance-1));
    };
    this.block_right=function() {
	var right_top_loc=[fl(this.loc[0]-this.width),-fl(this.loc[1]+1.9)];
	var right_bottom_loc=[fl(this.loc[0]-this.width),-fl(this.loc[1]+1.1)];
	var right_top_distance=block_right(right_top_loc,2,0);
	var right_bottom_distance=block_right(right_bottom_loc,2,0);
	if(right_top_distance) right_top_distance=-right_top_distance.loc[0];
	else right_top_distance=-1000000;
	if(right_bottom_distance) right_bottom_distance=-right_bottom_distance.loc[0];
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
    this.update=function() {
	this.update_ai();
        var ts=1/prop.time.frame_time_avg;
	if(this.loc[1] < blocks_get("water_level"))
	    this.swimming=true;
	else
	    this.swimming=false;
        this.update_physics();
        this.speed[0]=clamp(-10,this.speed[0],10);
        this.speed[1]=clamp(-10,this.speed[1],10);
        this.loc[0]+=this.speed[0]*ts;
        this.loc[1]+=this.speed[1]*ts;
	var left=this.block_left();
	var right=this.block_right();
	if(this.loc[0] < left+this.width/2) {
	    this.loc[0]=left+this.width/2;
	    this.speed[0]=0;
	    this.hit[LEFT]=true;
	} else {
	    this.hit[LEFT]=false;
	}
//	console.log(this.loc[0],right-this.width/2);
	if(this.loc[0] > right-this.width/2) {
	    this.loc[0]=right-this.width/2;
	    this.speed[0]=0;
	    this.hit[RIGHT]=true;
	} else {
	    this.hit[RIGHT]=false;
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
	    this.loc[1]=top-1;
	    this.speed[1]=0;
	    this.hit[TOP]=true;
	} else {
	    this.on_ground=false;
	}
//	console.log(left,this.loc[0]-this.width/2);
//	this.loc[0]=Math.max(this.loc,left);
	// DEBUG!!!
	//	this.loc[1]=Math.max(0,this.loc[1]);
    };
}

function player_update() {
    if(game_is_paused())
	return;
    prop.player.human.update();
}

function player_init() {
    prop.player={};

    prop.player.human=new Player([0,0]);

    loaded("player");
}
