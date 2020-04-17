
// bittorio cells that lies at a certain position in the grid

//import {create_rectangle, utils.setColor} from "./utils.js"

define(["utils"],
       function(utils){

           var population = 0.86;

           return function golife ( n ){

               return function(scale_w, scale_h, side_w, side_h ){

                   var gol = {}; //cells of cellular automaton

                   gol.cells = [];
                   gol.perturbed = 0;
                   gol.perturbCount = 0;

                   for(var row = 0; row < n; row++){
                       gol.cells[row] = []
                       for (var col = 0; col < n; col++) {
                           gol.cells[row][col] = {}
                           gol.cells[row][col].x = row*scale_w
                           gol.cells[row][col].y = col*scale_h
                           gol.cells[row][col].rect = utils.create_rectangle(gol.cells[row][col].x, gol.cells[row][col].y, side_w, side_h, "#000000");
                           //gol.cells[col].path = create_path(col, row, side_w, side_h,  "#000000");
                           //ca.cells[col].path.setAttributeNS(null,"stroke-width",0);

                           if( Math.random() > population){
                               gol.cells[row][col].state = 1;
                           }
                           else{
                               gol.cells[row][col].state = 0;
                           }
                           //gol.cells[row][col].state = 0;
                           utils.setColor(gol.cells[row][col]);
                       }
                   }

                   // senses if there are any perturbations from the top layer. and changes
                   // the state accordingly.

                   gol.sense = function( workspace ){

                       var perturbed = 0;

                       //1. get the next state
                       //var nextState = ca.nextState(ca.cells.map(function(c){return c.state}));
                       //console.log(nextState);

                       var t = 30;//pixel distance threshold

                       for( var figs =0; figs< workspace.length; figs++ ){

                           var coords = workspace[figs].pstringArr;
                           var xy1 = coords[0];
                           var xy2 = coords[1];

                           for(var row = 0; row < n; row++){
                               for (col =0; col<n; col++){

                                   var ns = gol.cells[row][col];
                                   var d1 = lsd(ns.x,ns.y, xy1[0], xy1[1] )
                                   var d2 = lsd(ns.x,ns.y, xy2[0], xy2[1] )
                                   //xy1[0] + (xy2[1]-xy1[1])/(xy2[])
                                   //var d3 =

                                   console.log(ns.x + " " + ns.y + " " + d1 + " " + d2)

                                   // if( d1 < 100){
                                   //     console.log(ns.x + " " + ns.y + " " + coords[0] + " " + coords[1] + "   " + d1)
                                   // }

                                   if( d1 <= t || d2 <= t){

                                       //console.log(ns.x + " " + ns.y + " " + d1 + " " + d2 + " " + d3 + " " + d4)
                                       //inside perturb region
                                       console.log("perturbations");
                                       ns.state = 0;
                                       utils.setColor(ns, "#ffffff"); // for the boundary
                                   }
                               }

                           }

                       }
                   };

                   //sense adjacent and move states
                   gol.nextState = function( ){
                       //original game of life rules

                       var new_state = [];

                       for(var row = 0; row < n; row++){

                           for (var col = 0; col < n; col++) {

                               //populate adjacent cells in the grid
                               // up, right, left, down, up-left, up-right, down-left, down-right
                               var up = (row - 1) < 0? (n-1): row-1;
                               var down = (row + 1)>= n? 0: row+1;
                               var left = (col - 1) < 0? (n-1): col-1;
                               var right = (col + 1) >= n? 0: col+1;


                               var sum = gol.cells[up][left].state + gol.cells[up][col].state + gol.cells[up][right].state + gol.cells[row][left].state + gol.cells[row][right].state + gol.cells[down][left].state + gol.cells[down][col].state + gol.cells[down][right].state;

                               if( gol.cells[row][col].state == 0 && sum == 3){
                                   //alive by nutrition
                                   gol.cells[row][col].state = 1
                                   utils.setColor(gol.cells[row][col])
                               }
                               else if( gol.cells[row][col].state == 0 ){
                                   //dead by overcrowding
                                   gol.cells[row][col].state = 0
                                   utils.setColor(gol.cells[row][col])
                               }
                               else if( gol.cells[row][col].state == 1 && (sum == 2 || sum == 3) ){
                                   gol.cells[row][col].state = 1
                                   utils.setColor(gol.cells[row][col])
                               }
                               else if( gol.cells[row][col].state == 1 ){
                                   //dead by underpopulation
                                   gol.cells[row][col].state = 0
                                   utils.setColor(gol.cells[row][col])
                               }
                               else{
                                   //mnaintain same
                               }


                               // new_state[col] = next_state( arr[prev], arr[col], arr[next], rule );
                               //utils.setColor(ca.cells[col]);
                           }
                       }

                       return gol.cells;
                   }

                   gol.clear = function(){

                       for(var row = 0; row < n; row++){

                           for (var col = 0; col < n; col++) {
                               gol.cells[row][col].state = 0;
                               utils.setColor(gol.cells[row][col]);
                               //gol.cells[row][col].rect.setAttributeNS(null, 'fill', "#ffffff");
                               //gol.cells[col].path.setAttributeNS(null, 'stroke', "#ff0000");
                               //gol.cells[col].path.setAttributeNS(null, 'stroke-width', 1);
                           }
                       }
                   }

                   gol.reset = function(){

                       for(var row = 0; row < n; row++){

                           for (var col = 0; col < n; col++) {
                               if( Math.random() > population){
                                   gol.cells[row][col].state = 1;
                               }
                               else{
                                   gol.cells[row][col].state = 0;
                               }
                           }
                       }
                   }


                   return gol;
               }
           }

           function lsd( x1, y1, x2, y2){

               //least square distance
               return Math.pow(  Math.pow(x2-x1,2) +  Math.pow(y2-y1,2) , 1/2 )

           }


       }
      )

//export
