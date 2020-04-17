define([],
       function(){

           //mapping from position to screen coordinates
           //needs the svg context for height and width
           var svgns = "http://www.w3.org/2000/svg";
           var canvas = document.getElementById( 'svgCanvas' );

           var utils = {}
           var state0 = "#edc9af", state1 = "#87cefa";

           utils.create_rectangle = function (x,y,width,height,fill){
               // Grid is 100 by 100

               var rect = document.createElementNS(svgns, 'rect');
               rect.setAttributeNS(null, 'x', x);
               rect.setAttributeNS(null, 'y', y);
               rect.setAttributeNS(null, 'height', height);
               rect.setAttributeNS(null, 'width', width);
               rect.setAttributeNS(null, 'fill', fill);
               rect.state = 0;
               canvas.appendChild(rect);
               return rect;
           }

           utils.create_rect_path_fn = function (scale_x, scale_y, canvas){

               return function(x,y,width , height, fill){
                   // Grid is 100 by 100

                   var xpos = x*scale_x
                   var ypos = y*scale_y;
                   //rectangle border
                   var pathstring = "M" + xpos + " " + ypos + " L" + (xpos+width) + " " + ypos + " L" + (xpos+width) + " " + (ypos+height) + " L" + xpos + " " + (ypos+height) + " L" + xpos + " " + ypos ;
                   var path = document.createElementNS(svgns, 'path');
                   path.setAttributeNS(null,"d", pathstring);
                   path.setAttributeNS(null, 'stroke', fill);
                   path.setAttributeNS(null, 'fill', "none");
                   canvas.appendChild(path);
                   return path;
               }
           }

           utils.create_path = function(x,y, fill, canvas){
                   // Grid is 100 by 100

                   var pathstring = "M" + x + " " + y;
                   var path = document.createElementNS(svgns, 'path');
                   path.setAttributeNS(null,"d", pathstring);
               path.setAttributeNS(null, 'stroke', fill);
               path.setAttributeNS(null, 'stroke-width', 4);
               path.setAttributeNS(null, 'fill-opacity', 0.4);
                   path.setAttributeNS(null, 'fill', "none");
                   canvas.appendChild(path);
                   return path;
               }

           utils.update_path = function (x, y, path){

               path.pstring = path.pstring + "L" + x + " " + y;
               path.setAttributeNS(null,"d", path.pstring);
           }

           utils.setNewpath = function ( path, xpos, ypos, width, height ){

               var pathstring = "M" + xpos + " " + ypos + " L" + (xpos+width) + " " + ypos + " L" + (xpos+width) + " " + (ypos+height) + " L" + xpos + " " + (ypos+height) + " L" + xpos + " " + ypos ;
               path.setAttributeNS(null,"d", pathstring);



           }

           //checks if cell within boundary
           utils.within_boundary = function(  xind, yind, n ){

               var min = n/2-2;
               var max = n/2+2;

               if( xind > min  && xind < max &&  yind > min && yind < max  ){
                   return 1;
               }
               else{
                   return 0;
               }
           }

           utils.on_boundary = function( x, y , boundary ){

               var on_boundary = 0;
               for(var i = 0; i <boundary.length; i++){
                   var bx = boundary[i].xind
                   var by = boundary[i].yind

                   if( Math.abs( x - bx ) == 0 && Math.abs( y - by ) == 0 ){
                       on_boundary = 1;
                   }
               }
               return on_boundary;
           }


           utils.find_boundary_el = function(x,y, boundary){

               var pos = -1;
               for(var i = 0; i <boundary.length; i++){
                   if( x == boundary[i].xind && y == boundary[i].yind){
                       pos = i;
                       break;
                   }
               }
               return pos;
           }


           utils.setColor = function( cell, args ){

               if( args!= null){
                   cell.rect.setAttributeNS(null,"fill",args)
               }
               else if(cell.state == 0){
                   cell.rect.setAttributeNS(null,"fill",state0)
               }
               else{
                   cell.rect.setAttributeNS(null,"fill",state1)
                   cell.rect.setAttributeNS(null,"fill-opacity",1)
               }
           }

           document.getElementById("state0").addEventListener("change", function(e){
               state0 = e.target.value;
               console.log("State0 color is " + state0)
            });

           document.getElementById("state1").addEventListener("change", function(e){
               state1 = e.target.value;
               console.log("State1 color is " + state1)
            });

           return utils;


       }
      )
