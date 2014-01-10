
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function fl(n) {
    return Math.floor(n);
}

function s(i) {
    if(i == 1)
	return "";
    else
	return "s";
}

function trange(il,i,ih,ol,oh) {
    i=(i/(ih-il))-il;
    return (i*(oh-ol))+ol;
}

function distance(a,b) {
    var x=Math.abs(a[0]-b[0]);
    var y=Math.abs(a[1]-b[1]);
    return Math.sqrt((x*x)+(y*y));
}

function degrees(radians) {
    return (radians/(Math.PI*2))*360;
}

function radians(degrees) {
    return (degrees/360)*(Math.PI*2);
}

function choose(l) {
    return l[Math.floor(Math.random()*l.length)];
}