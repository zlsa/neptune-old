
function state_init() {
    prop.state={};
    
    prop.state.props=[];
    
    loaded("state");
}

function state_add(p) {
    if(typeof p == typeof []) {
        for(var i=0;i<p.length;i++) {
            state_add(p[i]);
        }
    } else {
        var value=prop_get_value(p);
        prop.state.props.push([p,value]);
    }
}

function state_restore(module) {
    for(var i=0;i<prop.state.props.length;i++) {
        var p=prop.state.props[i];
        var s=p[0].split(".");
        if(s[1] != module)
            continue;
        var value=prop_get_value(p[0]);
        if(p[0] in localStorage) {
            prop_set_value(p[0],JSON.parse(localStorage[p[0]]));
        } else {
            localStorage[p[0]]=JSON.stringify(p[1]);
        }
    }
}

function state_save() {
    for(var i=0;i<prop.state.props.length;i++) {
        var p=prop.state.props[i];
        var value=prop_get_value(p[0]);
        localStorage[p[0]]=JSON.stringify(value);
    }
}

function state_clear() {
    localStorage.clear();
    history.go();
}