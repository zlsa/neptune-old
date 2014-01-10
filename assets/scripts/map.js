
var Tile=function(pos) {
    this.pos={
	x:pos[0],
	y:pos[1]
    };
    this.type=choose(["snow","grass"]);
    if(this.pos.x < 0) {
	this.type="water";
	this.depth=-this.pos.x*prop.map.tile.radius;
    }
    if(this.pos.x == 0) {
	this.type="sand";
    }
    if(this.pos.x == 1) {
	if(Math.random() >= 0.5)
	    this.type="sand";
    }
};

function map_init() {
    prop.map={};

    prop.map.tile={};
    prop.map.tile.radius=200; // radius of single tile in meters
    prop.map.tile.gap=10; // gap between tiles (display only, actual size is the same);

    prop.map.tiles={};

    map_generate();

    loaded("map");
    map_tile_meters(0,0);
}

function map_generate() {
    var size=50;
    for(var x=-size;x<size;x++) {
	for(var y=-size;y<size;y++) {
	    prop.map.tiles[map_tile_name(x,y)]=new Tile([x,y]);
	}
    }
}

function map_tile_name(x,y) {
    return x+","+y;
}

function map_resize() {
    prop.map.tile.height=Math.sin(Math.PI/3)*prop.map.tile.radius;
    prop.map.tile.width=2*(Math.cos(Math.PI/3)*prop.map.tile.radius)
};

function map_tile_meters(x,y) {
    // returns the meter location of tile (x,y)
    if(x%2 == 0) {
	y+=0.5;
    }
    x*=prop.map.tile.width/(1+(1/3));
    y*=prop.map.tile.height;
    return {x:x,y:y};
}
