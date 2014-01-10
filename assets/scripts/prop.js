
var prop={};

function prop_init() {
    prop.about={};
    prop.time={};
    prop.time.start=new Date().getTime();
    prop.time.before=0;
    prop.time.after=0;
    prop.time.frame_time;
    prop.time.fps=0;

    prop.debug=true;

    loaded("prop");
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

