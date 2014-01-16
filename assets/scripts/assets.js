
var ASSET_TYPE_IMAGE=0;
var ASSET_TYPE_MAP=1;

var ASSET_STATUS_WAITING=0;
var ASSET_STATUS_INPROGRESS=1;
var ASSET_STATUS_READY=2;
var ASSET_STATUS_ERROR=3;

var Asset=function(type,name,url) {
    this.type=type;
    this.name=name;
    this.url=url;
    this.status=ASSET_STATUS_WAITING;
    this.data=null;
};

function assets_init() {
    prop.assets={};

    prop.assets.assets=[];
    prop.assets.cache={};

    prop.assets.queue=[];

    loaded("assets");
}

function asset_get(name,type) {
    var id=name+":"+type;
    if(!(id in prop.assets.cache)) {
	for(var i=0;i<prop.assets.assets.length;i++) {
	    if((prop.assets.assets[i].name == name) &&
	       (prop.assets.assets[i].type == type)) {
		prop.assets.cache[id]=prop.assets.assets[i];
		return prop.assets.cache[id];
	    }
	}
	return null;
    }
    return prop.assets.cache[id];
}

function assets_add(a) {
    prop.assets.assets.push(a);
    if(a.status == ASSET_STATUS_INPROGRESS || a.status == ASSET_STATUS_READY)
	return;
    prop.assets.queue.push(a);
    assets_start_queue();
}

function asset_download(asset) {
    if(asset.type == ASSET_TYPE_IMAGE) {
	asset.data=new Image();
	asset.data.src=asset.url;
	asset.status=ASSET_STATUS_INPROGRESS;
	asset.data.onload=function() {
	    prop.canvas.dirty.menu=true;
	    asset.status=ASSET_STATUS_READY;
	    assets_next();
	    if(asset.onload)
		asset.onload(asset.data);
	};
	asset.data.onerror=function() {
	    asset.status=ASSET_STATUS_ERROR;
	    assets_next();
	    if(asset.onerror)
		asset.onerror(e);
	};
    } else if(asset.type == ASSET_TYPE_MAP) {
	asset.status=ASSET_STATUS_INPROGRESS;
	$.get(asset.url)
    	    .done(function(d) {
		asset.status=ASSET_STATUS_READY;
    		asset.data=d;
		assets_next();
		if(asset.onload)
		    asset.onload(d);
    	    })
    	    .error(function(e) {
		asset.status=ASSET_STATUS_ERROR;
    		console.log("error!",e);
		assets_next();
		if(asset.onerror)
		    asset.onerror(e);
    	    });
    }
}

function assets_next() {
    prop.assets.queue.splice(0,1);
    assets_start_queue();
}

function assets_start_queue() {
    if(prop.assets.queue.length == 0) {
	return;
    }
    var next=prop.assets.queue[0];
    asset_download(next);
}
