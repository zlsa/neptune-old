
function audio_init() {
    prop.audio={};
    
    prop.audio.names=[];
    prop.audio.volume=1;

    prop.audio.playing="";

    loaded("audio");
}

function audio_done() {
    audio_add("title");
}

function audio_add(name) {
    for(var i=0;i<prop.audio.names.length;i++)
        if(prop.audio.names[i] == name)
            return;
    var a=new Asset(ASSET_TYPE_AUDIO,name+"-start",
                    "assets/audio/music/"+name+"/start.ogg",function(a) {
                        a.volume=0.2;
                        a.data.volume=a.volume;
                        a.mode="start";
                    });
    assets_add(a);
    a=new Asset(ASSET_TYPE_AUDIO,name+"-loop",
                "assets/audio/music/"+name+"/loop.ogg",function(a) {
                    a.volume=0.2;
                    a.data.volume=a.volume;
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
    prop.audio.playing=name;
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        start.mode="start";
        loop.mode="start";
        start.data.currentTime=0;
        loop.data.currentTime=0;
        start.data.volume=start.volume;
        loop.data.volume=loop.volume;
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
    prop.audio.playing=name;
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        start.data.volume=start.volume;
        loop.data.volume=loop.volume;
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
    prop.audio.playing="";
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
    prop.audio.playing="";
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
    var name=prop.audio.playing;
    if(audio_is_playing(name)) {
        if(prop.game.state == GAME_STATE_END || prop.game.end != 0) {
	    var time=new Date().getTime()-prop.game.end;
	    if(prop.game.end == 0)
	        time=0;
            if(time <= 2000)
	        prop.audio.volume=crange(0,time,2000,1,0);
            else
	        prop.audio.volume=crange(2000,time,3000,0,1);
        }
    }
    var start=asset_get(name+"-start",ASSET_TYPE_AUDIO);
    var loop=asset_get(name+"-loop",ASSET_TYPE_AUDIO);
    if(start && start.status == ASSET_STATUS_READY &&
       loop && loop.status == ASSET_STATUS_READY) {
        start.data.volume=prop.audio.volume*start.volume;
        loop.data.volume=prop.audio.volume*loop.volume;
    }
}
