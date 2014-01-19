
var prop={};

function prop_init() {
    prop.about={};
    prop.about.version="0.1.5";
    prop.time={};
    prop.time.start=new Date().getTime();
    prop.time.before=0;
    prop.time.after=0;
    prop.time.frame_time;
    prop.time.frame_samples=3;
    prop.time.frame_time_avg=0;
    prop.time.fps=0;
    prop.frames=0;

    prop.debug=true;

    loaded("prop");
}

function prop_update() {
    prop.frames+=1;
}

function prop_get_value(p) {
    p=p.split(".");
    var value=prop;
    for(var i=1;i<p.length;i++) {
        value=value[p[i]];
    }
    return(value);
}

function prop_set_value(p,v) {
    var fc="\n"+p+"="+JSON.stringify(v)+";\n";
    var f=new Function(fc);
    f();
}

