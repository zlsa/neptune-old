
function audio_init() {
    prop.audio={};
    
    prop.audio.names=[];

    loaded("audio");
}

function audio_done() {
    audio_add("title");
}

function audio_add(name) {
    var a=new Asset(ASSET_TYPE_AUDIO,name+"-start",
                    "assets/audio/music/"+name+"/start.ogg",function(a) {
                        a.data.volume=0.2;
                        a.mode="start";
                    });
    assets_add(a);
    a=new Asset(ASSET_TYPE_AUDIO,name+"-loop",
                "assets/audio/music/"+name+"/loop.ogg",function(a) {
                    a.data.volume=0.2;
                    a.data.loop=true;
                })
    assets_add(a);
    if(!prop.audio)
        prop.audio={};
    if(!prop.audio.names)
        prop.audio.names=[];
    prop.audio.names.push(name);
}

function audio_pause_all() {
    for(var i=0;i<prop.audio.names.length;i++) {
        audio_pause(prop.audio.names[i]);
    }
}

function audio_start(name) {
    audio_pause_all();
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        start.mode="start";
        loop.mode="start";
        start.data.currentTime=0;
        loop.data.currentTime=0;
        start.data.play();
        loop.data.pause();
        start.data.onended=function() {
            var start=asset_get(name.split("-")[0]+"-start",ASSET_TYPE_AUDIO);
            var loop=asset_get(name.split("-")[0]+"-loop",ASSET_TYPE_AUDIO);
            start.mode="loop";
            loop.mode="loop";
            start.data.pause();
            start.data.currentTime=0;
            loop.data.currentTime=0;
            loop.data.play();
        };
    }
}

function audio_play(name) {
    audio_pause_all();
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        if(start.mode == "start") {
            start.mode="start";
            loop.mode="start";
            start.data.play();
        } else {
            start.mode="loop";
            loop.mode="loop";
            loop.data.play();
        }
    }
}

function audio_pause(name) {
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        start.data.pause();
        loop.data.pause();
    }
}

function audio_is_playing(name) {
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        if(!start.data.paused || !loop.data.paused)
            return true;
    }
    return false;
}

function audio_stop(name) {
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        if(!start.data.paused || !loop.data.paused) {
            start.data.currentTime=0;
            loop.data.currentTime=0;
            start.data.pause();
            loop.data.pause();
            start.mode="start";
            loop.mode="start";
        }
    }
}

function audio_update() {

}
