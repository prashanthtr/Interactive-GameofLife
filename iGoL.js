
// the ends of the affect adjacent 9 cells in the region.

// Interactive game of life simultation to check the effect of arbitrary
// boundaries of simulation environment

define( ["clocks", "gameOfLife", "utils" ],
        function( js_clock, golife, utils ){

            var n = 30;
            var side = n+5;

            var gridn = 100;
            var started = false

            var userColor = "#9ACD32"
            //var sunset_orange = "#f3b05a";

            var canvas = document.getElementById( 'svgCanvas' );
            var pW = canvas.clientWidth;
            var pH = canvas.clientHeight;

            console.log(pW + " " + pH)

            //canvas.clientHeight;

            var svgXY = document.getElementById( 'svgCanvas' ).getBoundingClientRect()
            var svgX1 = svgXY.left
            var svgY1 = svgXY.top
            var svgX2 = svgXY.right
            var svgY2 = svgXY.bottom

            console.log(svgXY.width)

            console.log(svgX1 + ' ' + svgY1 + ' ' + svgX2 + ' ' + svgY2)


            // max 5 steps for now.
            var backward_computation = []; //stores the state of CA, and state of perturbing environment.

            var pWidth = pW- pW%gridn
            var pHeight = pH - pH%gridn

            //pWidth = pWidth>pHeight?pHeight:pWidth; //smaller of the two
            //pWidth = pHeight
            //pHeight = pWidth


            var workspace = [];
            var area_string = []
            var ar_diagram = null;

            var t = 0; //as time

            console.log(pWidth + "  " + pHeight);
            // 40 * 40 grid
            var scale_w = Math.floor(pWidth/gridn);
            var scale_h = Math.floor(pHeight/gridn);

            var newN = pWidth/scale_w;
            console.log(newN)

            var side_w = scale_w;
            var side_h = scale_h;

            var moveState = 0;
            var perturbOn = 0;

            var currentFig = null;

            //var createRectShape = create_rectangle(scale_w, scale_h, canvas);
            //var create_rect = create_rect_fn(scale_w, scale_h, canvas);
            //var create_parallelogram = create_parallelogram_fn(scale_w, scale_h, canvas);
            //var create_path = utils.create_path_fn(scale_w, scale_h, canvas);
            //var create_quad = create_quad_fn(scale_w, scale_h, canvas);

            var imageCoords = [];

            var gol = golife( newN )(scale_w, scale_h, side_w, side_h);

            var ca= [];

            var rafId = null;

            // //display after every action
            var display = js_clock(50, 300);
            var sense = js_clock(20, 150);
            var t = 0;

            // //console.log(cells)

            //runs simulation of cellular autonmaton
            var drawLoop = function(){

                var now = Date.now();

                sense(now, function(){

                    if( workspace.length > 0){
                        gol.sense(newN, workspace);
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
                    started = true
                    drawLoop();
                }
                else if( c.keyCode == 114){
	                  cancelAnimationFrame(rafId);
				            rafId = null;
                    started = false
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

                //gol.clear();
                for(var i= 0; i< workspace.length;i++){
                    var cf = workspace[i]
                    if( cf ){
                        var parent = cf.parentNode;
                        parent.removeChild(cf);
                    }
                }
                workspace = [];

            });

            document.getElementById("reset").addEventListener("click",function(e){

                gol.reset();
            });



            //mousemove to start boundary

            window.addEventListener("mousedown", function(e){

                //console.log(e.pageX + " " +  e.pageY)
                if( moveState == 0 && started == true && withinSVG(e.pageX, e.pageY)){
                    moveState = 1;
                    currentFig = utils.create_path(e.offsetX, e.offsetY, userColor, canvas )
                    currentFig.pstring = "M " + e.offsetX + " " + e.offsetY;
                    currentFig.pstringArr = [];
                    currentFig.pstringArr.push([e.offsetX, e.offsetY]);
                }
                else{

                }
            });

            window.addEventListener("mousemove", function(e){

                if( moveState == 1 && withinSVG(e.pageX, e.pageY)){
                    currentFig.pstring += "L " + e.offsetX + " " + e.offsetY;
                    utils.update_path(e.offsetX, e.offsetY, currentFig) // could be a response call
                    //currentFig.pstringArr.push([e.offsetX, e.offsetY]);
                }
                else{
                }
            });

            window.addEventListener("mouseup", function(e){

                if( moveState == 1 && withinSVG(e.pageX, e.pageY)){

                    console.log("wiohtin svg")
                    //currentFig.pstring += " z";
                    //utils.update_path(e.offsetX, e.offsetY, currentFig) // could be a response call
                    currentFig.pstringArr.push([e.offsetX, e.offsetY]);
                    workspace.push(currentFig)
                    currentFig = null;
                    moveState = 0;
                    //console.log(workspace);
                }
                else if( moveState == 1 && !withinSVG(e.pageX, e.pageY) ){
                    //remove the current
                    alert("Please draw insidee canvas only");

                    var parent = currentFig.parentNode;
                    parent.removeChild(currentFig);
                    currentFig = null;
                    moveState = 0;
                }
                else{
                    //nothing
                    currentFig = null;
                    moveState = 0;
                }
            });


            function withinSVG(x,y){

                console.log(x + " " + y);
                if( x > svgX1+25 && x < svgX2-25 && y > svgY1+15 && y < svgY2-15){
                    return 1;
                }
                else{
                    return 0
                }
            }

            document.getElementById("stop").addEventListener("click",function(e){

                cancelAnimationFrame(rafId);
		            rafId = null;
                started = false
            });

            document.getElementById("start").addEventListener("click",function(e){
                started = true
                drawLoop();
            });

            document.getElementById("colorPalette").addEventListener("change", function(e){
                userColor = e.target.value;
            });


        }
      )

// import {js_clock} from "./clocks.js"
// //import {create_rect_fn, create_quad_fn, create_parallelogram_fn, area} from "./geoShapes.js"
// import {golife} from "./gameOfLife.js"



// document.getElementById("percentCA").addEventListener("change",function(e){
//     percentCA = parseFloat(e.target.value);
// })

// document.getElementById("percentPert").addEventListener("change",function(e){
//     percentPerturb = parseFloat(e.target.value);
// })
