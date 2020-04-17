
// Interactive game of life simultation to check the effect of arbitrary
// boundaries of simulation environment

import {js_clock} from "./clocks.js"
//import {create_rect_fn, create_quad_fn, create_parallelogram_fn, area} from "./geoShapes.js"
import {golife} from "./gameOfLife.js"


var n = 30;
var side = n+5;

var gridn = 20;

var canvas = document.getElementById( 'svgCanvas' );
var pW = canvas.clientWidth;
var pH = canvas.clientWidth

    //canvas.clientHeight;

var svgXY = document.getElementById( 'svgCanvas' ).getBoundingClientRect()
var svgX = svgXY.left
var svgY = svgXY.top

// max 5 steps for now.
var backward_computation = []; //stores the state of CA, and state of perturbing environment.

var pWidth = pW- pW%gridn
var pHeight = pH - pH%gridn

// pWidth = pWidth>pHeight?pHeight:pWidth; //smaller of the two
//pWidth = pHeight
pHeight = pWidth

var workspace = [];
var area_string = []
var ar_diagram = null;

var t = 0; //as time

console.log(pWidth + "  " + pHeight);

// 40 * 40 grid
var scale_w = Math.floor(pWidth/gridn);
var scale_h = Math.floor(pHeight/gridn);

var side_w = scale_w;
var side_h = scale_h;

var moveState = 0;
var perturbOn = 0;

var currentFig = null;

//var createRectShape = create_rectangle(scale_w, scale_h, canvas);
//var create_rect = create_rect_fn(scale_w, scale_h, canvas);
//var create_parallelogram = create_parallelogram_fn(scale_w, scale_h, canvas);
//var create_path = create_path_fn(scale_w, scale_h, canvas);
//var create_quad = create_quad_fn(scale_w, scale_h, canvas);

var imageCoords = [];

var gol = golife( gridn )(scale_w, scale_h, side_w, side_h);

var ca= [];

var rafId = null;

// //display after every action
var display = js_clock(50, 1000);
var sense = js_clock(50, 500);
var t = 0;

// //console.log(cells)

//runs simulation of cellular autonmaton
var drawLoop = function(){

    var now = Date.now();

    sense(now, function(){

        if( workspace.length > 0){
            gol.sense(workspace);
        }
    })();

    //displays every 250 ms
    display(now, function(){
        gol.nextState();

    })();

    rafId = requestAnimationFrame(drawLoop);

}


window.addEventListener("keypress", function(c){

    //need to have a state that prevents too quick key presses/holding

	  //console.log("char code" + c.keyCode + "timestamp" + c.timeStamp)

    if( c.keyCode == 115){
        drawLoop();
    }
    else if( c.keyCode == 114){
	      cancelAnimationFrame(rafId);
				rafId = null;
    }
    // else if( c.keyCode == 74){
    //     if( currentFig ){
    //         currentFig.rotate -= 5;
    //         currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + ',' + currentFig.centerx + "," + currentFig.centery + ')');
    //     }
    // }
    // else if( c.keyCode == 75){
    //     if( currentFig ){
    //         currentFig.rotate += 5;
    //         currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + "," + currentFig.centerx + "," + currentFig.centery + ')');
    //     }
    // }
});


document.getElementById("clear").addEventListener("click",function(e){

    gol.clear();
});

document.getElementById("reset").addEventListener("click",function(e){

    // for(var i= 0; i< workspace.length;i++){
    //     var cf = workspace[i]
    //     if( cf ){
    //         var parent = cf.parentNode;
    //         parent.removeChild(cf);
    //     }
    // }
    // workspace = [];
    gol.reset();
});


// document.getElementById("percentCA").addEventListener("change",function(e){
//     percentCA = parseFloat(e.target.value);
// })

// document.getElementById("percentPert").addEventListener("change",function(e){
//     percentPerturb = parseFloat(e.target.value);
// })
