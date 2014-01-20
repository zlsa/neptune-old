
var VERSION=[0,0,1];

var modules=[
    "prop",
    "state",
    "game",
    "menu",
    "assets",
    "player",
    "blocks",
    "audio",
    "ui",
    "canvas",
];
var module_number=0;
var module_start_time;

function loaded(module) {
    if(!(module in modules_finished))
	throw "ModuleError: nonexistent module '"+module+"'";
    if(modules_finished[module] == true)
	throw "ModuleError: module '"+module+"' was loaded multiple times";
    console.log("Loaded "+module);
    module_number+=1;
    modules_finished[module]=true;
    for(var i in modules_finished) {
	if(modules_finished[i] == false)
	    return;
    }
    done();
}

function init() {
    module_start_time=new Date().getTime();
    var m={};
    for(var i=0;i<modules.length;i++)
	m[modules[i]]=false;
    modules_finished=m;
}

function call_all(name) {
    for(var i=0;i<modules.length;i++) {
	if(modules[i]+"_"+name in window) {
	    window[modules[i]+"_"+name]();
	}
    };
}

function start() {
    init();
    call_all("init");
}

$(document).ready(function() {
    start();
});

function done() {
    var time=new Date().getTime()-module_start_time;
    time=(time/1000).toFixed(3);
    console.log("Loaded "+module_number+" module"+s(module_number)+" in "+time+" second"+s(time));
    resize();
    $(window).resize(resize);
    call_all("done");
    update();
}

function resize() {
    call_all("resize");
}

function update() {
    requestAnimationFrame(update);
    prop.time.after=new Date().getTime();
    call_all("update");
    prop.time.frame_time=(prop.time.after-prop.time.before);
    prop.time.frame_time=Math.min(prop.time.frame_time,60);
    var s=prop.time.frame_samples;
    prop.time.frame_time_avg=prop.time.frame_time/prop.game.speedup;//(prop.time.frame_time*6/s)+((prop.time.frame_time_avg/s)*(s-1));
    if(prop.time.frames%20==0)
	prop.time.fps=1000/prop.time.frame_time;
    prop.time.before=prop.time.after;
}

function delta() {
    return(prop.time.frame_time_avg/600);
}
