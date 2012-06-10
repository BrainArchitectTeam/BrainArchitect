(function(global){


/**
 * @name Joint.arrows
 * @namespace Additional ready-to-use arrows.
<h3>Creating your own arrows</h3>
  <p>New arrows can be easily added. Each arrow is a function of one parameter (size) returning an object 
     which describes the arrow. The object has four properties:</p>
  <ul>
    <li><i>path</i>: SVG path of arrow shape</li>
    <li><i>dx</i>: x-axis offset</li>
    <li><i>dy</i>: y-axis offset</li>
    <li><i>attrs</i>: SVG path attributes</li>
  </ul>
 <p>Let's say you want to create an arrow of a square shape. First of all, you need a SVG path describing 
    the square. Note that the symmetry of the square is along the origin (0, 0). After you have created the path, 
    you need to specify the dx, dy offsets. The offsets tell the Joint library where to start drawing the connection. 
    For our square arrow, they equal to its size. As the last thing, you can set some default path attributes 
    suitable for you arrows. A good practice is to set the fill attribute. Doing so allows you to grab your arrow 
    by mouse wherever inside your arrow shape.</p>
 <pre>
Joint.arrows.square = function(size){
    var minusSize = (-size).toString(); 
    size = size.toString();
    return {
        path: ["M", size, size,
               "L", minusSize, size,
               "L", minusSize, minusSize,
               "L", size, minusSize, "z"],
        dx: size,
        dy: size,
        attrs: {
            stroke: "black",
            fill: "white"
        }
    };
};
Joint({x: 20, y: 20}, {x: 300, y: 30}, {
  startArrow: {
    type: "square",
    size: 10
  }
});
 </pre>
 */
var arrows = global.Joint.arrows;

/**
 * Rectangle arrow.
 * @name Joint.arrows.rect
 * @memberOf Joint.arrows
 */
arrows.rect = function(size){
    if (!size) { size = 5; }
    return {
	path: ["M",(3*size).toString(),size.toString(),
               "L",(-3*size).toString(),size.toString(),
               "L",(-3*size).toString(),(-size).toString(),
               "L", (3*size).toString(), (-size).toString(), "z"],
	dx: 3*size, 
	dy: 3*size,
	attrs: { 
	    stroke: "black",
	    fill: "white",             
	    "stroke-width": 1.0
	}
    };
};

arrows.simplearrow = function(size){
      
      return {
            path: ["M",size.toString(),"0",
                "L",(-size).toString(),(-size).toString(),
                "L",(-size).toString(),size.toString(),"z"],
            dx: size,
            dy: size,
            attrs: {
                stroke: "black",
                "stroke-width": 1.0,
                fill: "black"
            }
        };
      
    };
    
arrows.arrowblack = function(size){
        return {
            path: ["M","10","0","L","0","5","L","-10","0", "L", "0", "-5", "z"],
            dx: 9,
            dy: 9,
            attrs: {
                stroke: "black",
                "stroke-width": 1.0,
                fill: "black"
            }
        };
    }; 
    
    
arrows.arrowwhite = function(size){
        return {
            path: ["M","10","0","L","0","5","L","-10","0", "L", "0", "-5", "z"],
            dx: 9,
            dy: 9,
            attrs: {
                stroke: "black",
                "stroke-width": 1.0,
                fill: "white"
            }
        };
    }; 



})(this);
