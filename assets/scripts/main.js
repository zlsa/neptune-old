
var VERSION=[0,0,1];

var modules=[
    "prop",
    "state",
    "game",
    "assets",
    "menu",
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
    call_all("update");
}
