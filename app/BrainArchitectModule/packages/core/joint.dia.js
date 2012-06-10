(function(global){	// BEGIN CLOSURE

    var Joint = global.Joint;

    var point = Joint.point;
    var rect = Joint.rect;

    /**
 * @name Joint.dia
 * @namespace Holds functionality related to all diagrams and their elements.
 */
    var dia = Joint.dia = {
    
    
    
    /**
     * Current dragged object.
     * @private
     */
        _currentDrag: false,
        /**
     * Current zoomed object.
     * @private
     */
        _currentZoom: false,
    
        /**
     * Current resized object
     * @private
     */
        _currentResize: false,
    
        /**
     *  Current selected object
     */
        _currentSelected: false,    
    
        _currentModule: "uml",
    
        _activeTool: false,
    
        _doubleclick: false,
    
        /**
     * Current resized object directions
     * @
     */
        _currentResizeDirection: -1,
    
        /**
     * Table with all registered objects.
     *  - registered objects can embed and can be embedded
     *  - the table is of the form: {RaphaelPaper1: [shape1, shape2, ...]}
     * @private
     */
        _registeredObjects: {},
        /**
     * Table whith all registered joints.
     *  - the table is of the form: {RaphaelPaper1: [joint1, joint2, ...]}
     * @private
     */
        _registeredJoints: {},
        /**
     * Create new joint and register it. All joints appearing in a diagram should
     * be created using this function. Otherwise they won't be registered and
     * therefore not serialized when needed.
     * @param {Object} args Joint parameters.
     * @see Joint
     * @return {Joint}
     */
        Joint: function(args){
            var j = Joint.apply(null, arguments);
            this.registerJoint(j);
            return j;
        },
        
        /**
     * Returns registered elements of the current paper.
     * @return {array} Array of registered elements.
     */
        registeredElements: function(){
            return (this._registeredObjects[Joint.paper().euid()] || (this._registeredObjects[Joint.paper().euid()] = []));
        },
        /**
     * Returns registered joints of the current paper.
     * @return {array} Array of registered joints.
     */
        registeredJoints: function(){
            return (this._registeredJoints[Joint.paper().euid()] || (this._registeredJoints[Joint.paper().euid()] = []));
        },
        /**
     * Register object to the current paper.
     * You don't have to use this method unless you really know what you're doing.
     * @param {Element|Joint} obj Object to be registered.
     * @return {Element|Joint} Registered object.
     */
        register: function(obj){
            (this._registeredObjects[Joint.paper().euid()] || (this._registeredObjects[Joint.paper().euid()] = [])).push(obj);
        },
        /**
     * Cancel registration of an element in the current paper.
     * @param {Element} obj Object to be unregistered.
     */
        unregister: function(obj){
            var register = (this._registeredObjects[Joint.paper().euid()] || (this._registeredObjects[Joint.paper().euid()] = [])),
            idx = register.length;
            while (idx--)
                if (register[idx] === obj)
                    register.splice(idx, 1);
        },
        /**
     * Register joint to the current paper. Avoid registering the the same joint twice.
     * You don't have to use this method unless you really know what you're doing.
     * @param {Joint} j Joint object to be registered.
     */
        registerJoint: function(j){
            (this._registeredJoints[Joint.paper().euid()] || (this._registeredJoints[Joint.paper().euid()] = [])).push(j);            
            
        },
        
        /**
     * Cancel registration of a joint in the current paper.
     * @param {Joint} j Joint to be unregistered.
     */
        unregisterJoint: function(j){
            var register = (this._registeredJoints[Joint.paper().euid()] || (this._registeredJoints[Joint.paper().euid()] = [])),
            idx = register.length;
            while (idx--)
                
                if (register[idx] === j)
                    register.splice(idx, 1);
        },
        
        setActiveTool: function(tool){
            this._activeTool = tool;
            console.log(tool);
        },
        
        unselect:function(){
            if( this._currentSelected  ){
                this._currentSelected.deselect();
                this._currentSelected = false;
            }
        }
        
    };

    /**
 * Abstract object of all diagram elements.
 * This object is never used directly, instead, specific diagram elements inherits from it.
 * Allows easy creation of new specific diagram elements preserving all features that Joint library and Joint.dia plugin offer.
 * <h3>Wrapper</h3>
 *  All custom elements must have a wrapper set. Wrapper is the key object that Joint library counts with.
 *  There cannot be any element without a wrapper. Usually it is an object which wraps all the subelements
 *  that a specific diagram element contains. The wrapper must be set in init method.
 *  To set a wrapper, use setWrapper(aWrapper) method. The single parameter to the method is a Raphaël vector object.
 *  Later on, you can access this object using wrapper property.
 * <h3>Inner</h3>
 *  Inner objects are subelements of an element. Although they are optional, they are commonly used. To add a subelement
 *  to the element, use addInner(anInner) method. It takes a Raphaël vector object as an argument. All inner objects are
 *  placed to an array that you can access using inner property.
 * <h3><i>init</i> method</h3>
 *  The <i>init</i> method has to be part of every element you create. It takes all element options as an argument,
 *  sets wrapper and adds inners.
 * <h3><i>joint</i> method</h3>
 *  If you have specific elements, in which connections are not controlled by wrapper, you can implement your own joint method.
 * <h3><i>zoom</i> method</h3>
 *  As Joint.dia library does not know how your specific element should behave after scaling, you can use zoom method to implement
 *  the desired behaviour.
 * @name Element
 * @memberOf Joint.dia
 * @constructor
 * @example
var mydia = Joint.dia.mydia = {};
var Element = Joint.dia.Element;

mydia.MyElement = Element.extend({
  // init method must be always presented
  init: function(properties){
    var p = this.properties;
    // parameters processing
    p.position = properties.position;
    p.radius = properties.radius || 30;
    // every element must have a wrapper
    this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius));
    // optional inner elements
    this.addInner(this.paper.text(p.position.x, p.position.y, "my element"));
  }
});

// ...













var e = mydia.MyElement.create({
  position: {x: 50, y: 50},
  radius: 20
});
 */
    var Element = dia.Element = function(){};

    /**
 * Resize directions
 * @author: frantatoman
 * @date 15.11.2011
 * @public
 */
    dia.Element._resizeDirections = {
        TL: 0,       // top left
        TC: 1,       // top center
        TR: 2,       // top right
        CL: 3,       // center left
        CR: 4,       // center right
        BL: 5,       // bottom left
        BC: 6,       // bottom center
        BR: 7        // bottom right
    };

    /**
 * Use this to instantiate particular elements.
 * @private
 */
    Element.create = function(properties){
        var instance = new this(properties);
        if (instance.init) instance.init(properties);
        instance.defaults(instance.properties);
        instance.paper.safari();        // fix webkit bug
        instance.select(); //(brabec)
        return instance;
    };

    /**
 * @private
 */
    Element.extend = function(prototype){
        var C = prototype.constructor = function(properties){
            this.construct(properties);
        };
        C.base = this;
        var proto = C.prototype = new this();
        Joint.Mixin(proto, prototype);
        Joint.Supplement(C, this);
        return C;
    };

    Element.prototype = {
        
        parentElement: null,
        toolbox: null,
        boundingBox: null,                          // added by frantatoman, 14.11.2011
        _isElement: true,
        // auxiliaries for scaling and translating
        lastScaleX: 1.0,
        lastScaleY: 1.0,
        dx: undefined,
        dy: undefined,
        // original bounding box (before scaling a translating)
        // set in setWrapper()
        origBBox: undefined,

        ////////////////////////////////////////////////////////////////////////////
        // added by frantatoman, 17. november, 2011
    
        dblClickCallback: null,
        locked: false,                                                              // if is element locked, events is ignored

        depth: 0,


        ////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////

        construct: function(properties){           
            
            
            
            
            this.properties = {
                dx: 0, 
                dy: 0,		// translation
                rot: 0,			// rotation
                sx: 1.0, 
                sy: 1.0,		// scale
                module: this.module,
                object: this.object,
                parent: properties.parent,                
                //depth: this.depth,                                               // depth of element - used for choose
                data: {
                    name: '',
                    stereotype: ''
                }
            };
            
            this.wrapper = null;
            this.shadow = null;
            this.shadowAttrs = {
                stroke: 'none', 
                fill: '#999', 
                translation: '7,7',
                opacity: 0.5
            };
            this.inner = [];
            // ghost attributes
            this.ghostAttrs = {
                opacity: 0.5,
                "stroke-dasharray": "-",
                stroke: "black"
            };
            this._opt = {
                draggable: true,	// enable dragging?
                ghosting: false,		// enable ghosting?
                toolbox: true,		// enable toolbox?
                boundingBox: true          // enable bounding box? resize
            };

            this.paper = Joint.paper();
            dia.register(this); // register me in the global table
        },
        
        defaults: function(properties) {
            if (properties.shadow) {
                Joint.Mixin(this.shadowAttrs, properties.shadow);
                this.createShadow();
            }
            
        },
        
        /**
         *  Data methods
         */
        
        getName: function(){
            return this.properties.data.name;
        },
        
        setName: function(name){
            this.properties.data.name = name;
        },
        
        getStereotype: function(){
            return this.properties.data.stereotype;
        },
        
        setStereotype: function(stereotype){
            this.properties.data.stereotype = stereotype;
        },
        
        getDepth: function(){
            //return this.properties.depth;
            console.log(this.depth);
            return this.depth;
        },
        
        getData: function(){
            return this.properties.data;
        },
        
        /**
     * @methodOf Joint.dia.Element#
     * @return Element unique id.
     */
        euid: function(){
            return Joint.generateEuid.call(this);
        },
        // this is needed in joint library when
        // manipulating with a raphael object joints array
        // - just delegate joints array methods to the wrapper
        joints: function(){
            return this.wrapper.joints();
        },

        /**
     * Used in joint.js for unified access to the wrapper.
     * For all RaphaelObjects returns just this.
     * @private
     * @return {RaphaelObject} Return wrapper.
     */
        yourself: function(){
            return this.wrapper;
        },

        updateJoints: function(){
            var joints = this.wrapper.joints();
            if (joints){
                for (var i = 0, l = joints.length; i < l; i++){
                    joints[i].update();
                }
            }
        },

        /**
     * Toggle ghosting of the element.
     * Dragging a diagram object causes moving of the wrapper and all inners, and update
     * of all correspondent connections. It can be sometimes expensive. If your elements
     * are complex and you want to prevent all this rendering and computations,
     * you can enable ghosting. It means that only a ghost of your wrapper will be dragged.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
        toggleGhosting: function(){
            this._opt.ghosting = !this._opt.ghosting;
            return this;
        },

        /**
     * Create a ghost shape which is used when dragging.
     * (in the case _opt.ghosting is enabled)
     * @private
     */
        createGhost: function(){
            this.ghost = this.cloneWrapper(this.ghostAttrs);
        },

        /**
     * Create a shadow.
     * @private
     */
        createShadow: function(){
            this.shadowAttrs.rotation = this.wrapper.attrs.rotation;
            this.shadow = this.cloneWrapper(this.shadowAttrs);
            this.shadow.toBack();
        },

        /**
     * Creates the same object as the wrapper is.
     * Used for ghosting and shadows.
     * @private
     * @return {RaphaelObject} created clone
     */
        cloneWrapper: function(attrs) {
            var wa = this.wrapper.attrs,
            paper = this.wrapper.paper,
            clone;

            switch (this.wrapper.type) {
                case "rect":
                    clone = paper.rect(wa.x, wa.y, wa.width, wa.height, wa.r);
                    break;
                case "circle":
                    clone = paper.circle(wa.cx, wa.cy, wa.r);
                    break;
                case "ellipse":
                    clone = paper.ellipse(wa.cx, wa.cy, wa.rx, wa.ry);
                    break;
                default:
                    break;
            }
            clone.attr(attrs);
            return clone;
        },

        /**
     * Get object position.
     * @private
     * @return point
     */
        objPos: function(objname){
            switch (this[objname].type){
                case "rect":
                    return point(this[objname].attr("x"), this[objname].attr("y"));
                case "circle":
                case "ellipse":
                    return point(this[objname].attr("cx"), this[objname].attr("cy"));
                default:
                    break;
            }
        },

        wrapperPos: function(){
            return this.objPos("wrapper");
        },
        ghostPos: function(){
            return this.objPos("ghost");
        },

        /**
     * Sends the wrapper and all inners to the front.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
        toFront: function(){
            this.shadow && this.shadow.toFront();
            this.wrapper && this.wrapper.toFront();
            for (var i = 0, len = this.inner.length; i < len; i++)
                this.inner[i].toFront();
            return this;
        },

        /**
     * Sends the wrapper and all inners to the back.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
        toBack: function(){
            for (var i = this.inner.length - 1; i >= 0; --i)
                this.inner[i].toBack();
            this.wrapper && this.wrapper.toBack();
            this.shadow && this.shadow.toBack();
            return this;
        },

        /**
     * dia.Element mousedown event.
     * @private
     */
        dragger: function(e){        
        
            ////////////////////////////////////////////////////////////////////////
            // set current selected
            var self = this.wholeShape;
            //console.log("element mousedown");
            self.select();//(brabec)
        
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////
        
            if (!this.wholeShape._opt.draggable) return;
            dia._currentDrag = this.wholeShape;
        
            if (dia._currentDrag._opt.ghosting){
                dia._currentDrag.createGhost();
                //dia._currentDrag.ghost.toFront();
            } else {
                //dia._currentDrag.toFront();
            }

            dia._currentDrag.removeToolbox();
            dia._currentDrag.removeBoundingBox();
            // small hack to get the connections to front
            dia._currentDrag.translate(1,1);
            dia._currentDrag.translate(-1,-1);

            dia._currentDrag.dx = e.clientX;
            dia._currentDrag.dy = e.clientY;
        
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
        
        },

        /**
     * dia.Element zoom tool mousedown event.
     * @private
     */
        zoomer: function(e){
            dia._currentZoom = this;
            dia._currentZoom.toFront();
            dia._currentZoom.removeToolbox();

            var bb = rect(dia._currentZoom.origBBox);
            dia._currentZoom.dx = e.clientX;
            dia._currentZoom.dy = e.clientY;
            dia._currentZoom.dWidth = bb.width * dia._currentZoom.lastScaleX;
            dia._currentZoom.dHeight = bb.height * dia._currentZoom.lastScaleY;

            e.preventDefault && e.preventDefault();
        },
    
        /**
     * dia.Element resizer tool mousedown event
     * @private
     * @author: Franta Toman (frantatoman)
     * @date 15.11.2011
     */
        resizer: function(e, currentDirection){
       
            dia._currentResize = this;        
            dia._currentResize.toFront();
            dia._currentResize.removeToolbox();
            dia._currentResize.removeBoundingBox();
        
            dia._currentResizeDirection = currentDirection;

            var bb = rect(dia._currentResize.origBBox);
            dia._currentResize.dx = e.clientX;
            dia._currentResize.dy = e.clientY;
            dia._currentResize.dWidth = bb.width * dia._currentResize.lastScaleX;
            dia._currentResize.dHeight = bb.height * dia._currentResize.lastScaleY;
             
            e.preventDefault && e.preventDefault();
        },
    
        /**
     * Move the element by offsets.
     * @methodOf Joint.dia.Element#
     * @param {Number} dx Offset in x-axis.
     * @param {Number} dy Offset in y-axis.
     */
        translate: function(dx, dy){

            var bb = this.getBBox();

            // elements can be moved only in paper size
            if( dx > 0 ){
                if( (bb.x + bb.width - 8) > this.paper.width ){
                    dx = 0;
                }
            }else{
                if( bb.x - dx - 8 <= 0 ){
                    dx = 0;
                }
            }
            
            if( dy > 0 ){
                if( (bb.y + bb.height - 8) > this.paper.height ){
                    dy = 0;
                }
            }else{
                if( bb.y - dy - 8 <= 0 ){
                    dy = 0;
                }
            }

            // save translation
        
            
            this.properties.dx += dx;
            this.properties.dy += dy;
            
            
            // translate wrapper, all inner and toolbox
            this.wrapper.translate(dx, dy);
            this.shadow && this.shadow.translate(dx, dy);
            for (var i = this.inner.length - 1; i >= 0; --i){
                this.inner[i].translate(dx, dy);
            }
            
            
            this.translateToolbox(dx, dy);
            this.translateBoundingBox(dx,dy);   // added by frantatoman, 14.11.2011
            this.paper.safari();
        
            
        },
        /**
     *Move the element to position (brabec)
     *@methodOf Joint.dia.Element#
     *@param {Point} p Desired absolute position of center of element.
     *
     */
        moveTo: function(p){
            var translateBy = p.relativeTo(this.wrapper.getBBox().center());
            this.translate(translateBy.x, translateBy.y);
        },

        /**
     * Add wrapper.
     * @methodOf Joint.dia.Element#
     * @param {RaphaelObject} s Vector object specifying a wrapper.
     */
        setWrapper: function(s){
            this.wrapper = s;			// set wrapper
            this.wrapper.wholeShape = this;		// set wrapper's reference to me            
            this.type = this.wrapper.type;		// set my type
            this.origBBox = this.wrapper.getBBox();	// save original bounding box
            
            // if dragging enabled, register mouse down event handler
            if (this._opt && this._opt.draggable){
                this.wrapper.mousedown(this.dragger);
                this.wrapper.node.style.cursor = "move";
            }
            // make sure wrapper has the joints method
            if (!this.wrapper.joints){
                this.wrapper._joints = [];
                this.wrapper.joints = function(){
                    return this._joints;
                };
            }
            // add toolbox if enabled
        
            //this.addToolbox();
            //this.addBoundingBox();              // added by frantatoman, 14.11.2011
        
            //this.wrapper.mouseup(this.dropper);
        
            return this;
        },

        /**
     * Add a subelement.
     * @methodOf Joint.dia.Element#
     * @param {Element} s The subelement to be added.
     * @return {Element} this
     */
        addInner: function(s){
            this.inner.push(s);
            // @remove one of them?
            s.wholeShape = this;
            s.parentElement = this;
            if (s._isElement) s.properties.parent = this.euid();
            // if dragging enabled, register mouse down event handler
            if (!s._isElement && this._opt && this._opt.draggable){
                s.mousedown(this.dragger);
                s.node.style.cursor = "move";
            }
            s.toFront();	// always push new inner to the front
            return this;
        },

        /**
     * Remove a subelement.
     * @methodOf Joint.dia.Element#
     * @param {Element} s The subelement to be removed.
     * @return {Element} this
     */
        delInner: function(s){
            var
            i = 0,
            len = this.inner.length;
            for (; i < len; i++)
                if (this.inner[i] == s)
                    break;
            if (i < len){
                this.inner.splice(i, 1);
                s.parentElement = null;
                if (s._isElement) s.properties.parent = undefined;
            }
            return this;
        },

        /**
     * Show toolbox.
     * @private
     */
        addToolbox: function(){
            // do not show toolbox if it is not enabled
            if (!this._opt.toolbox){
                return this;
            }

            var
            self = this,
            bb = this.wrapper.getBBox(),	// wrapper bounding box
            tx = bb.x + bb.width ,	// toolbox x position
            ty = bb.y;	// toolbox y position

            this.toolbox = [];
            this.toolbox.push(this.paper.rect(tx, ty, 33, 42, 5).attr({
                'stroke-width' : '0',
                'stroke-opacity' : '0'
                
            }));
        
            // zoom in/out (mint icon: search.png)
            /*
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE5SURBVHjaYvz//z8DsQAggFhARGRkpBETE1M/kGkOxIz//v078+HDh4odO3acBPJ//4eaCBBADCA6Kirq4JlzJ978/vPrNwifOHX4fUhIyFmgvDQQs4HUgDBAALFAbTDX1zNiZmFmBfONDM14WFlZdYFMCSD+AsS/QOIAAcQEVcyIw5m8IJNhHIAAAisGufHMuZNfgE74A8Knzx7/LiLO91tfXx9kOgsjEIDUAQQQ2FqQZ3q7Jk6AWs2gqCbOkZDn8l9AiLuNi4vrxfHjx7cC1X8HCCCwYqiv/aBu5NXQ0FD9+/dfr4uf/te7N1/Mu337ttmbN2/uAwQQzIO/gfg11DNsN4BA/LD4n8f33swF8v8DFQoAaS6AAGLEFilQN3JCbQLhH0B8HyCAGHHFIFQDB1QTSNEXgAADAEQ2gYZ9CcycAAAAAElFTkSuQmCC", tx, ty, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	Joint.addEvent(this.toolbox[this.toolbox.length-1].node, "mousedown", function(e){
			   dia.Element.prototype.zoomer.apply(self, [e]);
		       });*/
            
            /*
	// embed (mint icon: page_spearmint_up.png)
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEJSURBVHjaYvj//z8DFGOAnz9/rjl27Jg0AwMDExAzAAQQI0ghFPz/8usZjM3ACJTnYBEC0iyfmZmZZYBCXwECiAkm+evXL4bff34w/P33C4z//PvB8O33awYmJiZeoDQ/ELMBBBALSKGJiQkPOzs7AxsbC8OaTXMZWFhZoEb8g5nFDsTMAAHEBFIIZLwCuo/hy5dvDCF+yQx/fv+BuAvhRDAACCCQM0AO5YRJfv78lSE+Ko/h79+/DP8RJoMBQACheHDv4wYGdOAs28DAyMioCmS+AAggJgYSAEAAoZiMUxHUZIAAYkES4AJSQjD3o4HvQPwXIIDgJgMVM4PCEhREWBT/BUUFQIABAMuFbgea+o0EAAAAAElFTkSuQmCC", tx + 22, ty, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onclick = function(){self.embed();};
	// unembed (mint icon: page_spearmint_down.png)
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEJSURBVHjaYvj//z8DFGOAnz9/rjl27Jg0AwMDExAzAAQQI0ghFPz/8usZjM3ACJTnYBEC0iyfmZmZZYBCXwECiIkBCfz99wuO//z7wfDt92sGJiYmXqAUPxCzAQQQi4mJyX0gQwFZExcXJ8OaTXMYODmZYULsQMwMEEAgk9WB+D0jIyNElJ2NYdXG2QzsHOwMSE4EA4AAYjpz5swvIC3By8sLVrh2yzygiRwQTzD8Q1EMEEBwD/779+//7gcNDCysKN5gcJZtYADaqgpkvgAIILgM0CMYCtEBQAChBB1ORVCTAQKIBUmAC0gJATEnFvXfQSELEEBwk4GKQeHEBgoiLIr/AvEvgAADAH4mYO9cg5S2AAAAAElFTkSuQmCC", tx + 11, ty, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onclick = function(){self.unembed();};
	// delete (icon: stop.png)
        */
        
            //	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFEBQbDFwnwRsAAAE8SURBVBjTVZG9agJREEbP1TWL266wja2tWggipEhpIxh9gIUgiIW1vZWvkHJJHVLYig+ghWARbGzEYgMKrojr/t4UNwoZmGY4882BEfyVHA5HmOaEXA6khCSB83nK4fAmHOcAoAFI2+7RaIwxTQhDiGO1cLu1WK3egS6AkIPBiFptjGU9kc3Cfg++D4WCSg8CyWLxRRD0MxjGBMNQYLMJlQoUi9BuQ6kEx6PAMDrAs4aUcL3C5QLLJVSrUC6D68J8Duez0gIySKk8fV8ppCnoOux24HkQRUoH0EhTNTBNpeG6CqzX4XSC2eyRrBEEUzyvha7Deq1Oe54CXVcFxfE3sBXStgsYxjuW9UqaCsJQAfcOwx/i+EU4zkY8ntLrfZLPdwB1NklUYpJ0heNsHk8BIIr6RNEH/2t7BwF+AeKFndSgPkjIAAAAAElFTkSuQmCC", tx + 11, ty + 11, 11, 11));
        
            this.toolbox.push(this.paper.path("M26.33,15.836l-3.893-1.545l3.136-7.9c0.28-0.705-0.064-1.505-0.771-1.785c-0.707-0.28-1.506,0.065-1.785,0.771l-3.136,7.9l-4.88-1.937l3.135-7.9c0.281-0.706-0.064-1.506-0.77-1.786c-0.706-0.279-1.506,0.065-1.785,0.771l-3.136,7.9L8.554,8.781l-1.614,4.066l2.15,0.854l-2.537,6.391c-0.61,1.54,0.143,3.283,1.683,3.895l1.626,0.646L8.985,26.84c-0.407,1.025,0.095,2.188,1.122,2.596l0.93,0.369c1.026,0.408,2.188-0.095,2.596-1.121l0.877-2.207l1.858,0.737c1.54,0.611,3.284-0.142,3.896-1.682l2.535-6.391l1.918,0.761L26.33,15.836z").attr({
                fill: "#000", 
                stroke: "none"
            }).translate(tx, ty-10).scale(0.6));
            this.toolbox[this.toolbox.length-1].toFront();
            this.toolbox[this.toolbox.length-1].node.onmousedown = function(e){ //(brabec)
                Joint.fixEvent(e);  //
                //console.log(Joint.getMousePosition(e,Joint.paper()));
                //var j = self.joint(Joint.getMousePosition(e,this));
                
                // added rano by franta toman - pro connections v FF
                var j = self.joint(Joint.getMousePosition(e,Joint.paper()));
                j.register(Joint.dia.registeredElements());

                
                //j.showHandle();//connection().events[1].f(e);
                j.select();
                j.capMouseDown(e,j.dom.endCap);
                e.stopPropagation();
                e.preventDefault();
            //j.dom.handleEnd.events[0].f(e);
            //console.log(j);
            };
        
            ////////////////////////////////////////////////////////////////////
            // show select type box (toman, 19. april 2012)
            
            var connectionTypeSelector = Joint.getConnectionTypeSelector();
            if( connectionTypeSelector != null ){
                connectionTypeSelector.show({ px: tx, py: ty });
            }            
        
            this.toolbox[this.toolbox.length-1].node.onclick = function(){
            };
            ////////////////////////////////////////////////////////////////////
        
            this.toolbox.push(this.paper.path("M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z").attr({
                fill: "#000", 
                stroke: "none"
            }).translate(tx, ty+10).scale(0.6));
            this.toolbox[this.toolbox.length-1].toFront();
            this.toolbox[this.toolbox.length-1].node.onmousedown = function(e){
                Joint.fixEvent(e);
                self.liquidate();
                e.stopPropagation();
                e.preventDefault();
            };
            
            /*
            this.toolbox.push( this.paper.path("M22.255,19.327l-1.017,0.131c-0.609,0.081-1.067,0.208-1.375,0.382c-0.521,0.293-0.779,0.76-0.779,1.398c0,0.484,0.178,0.867,0.532,1.146c0.354,0.28,0.774,0.421,1.262,0.421c0.593,0,1.164-0.138,1.72-0.412c0.938-0.453,1.4-1.188,1.4-2.229v-1.354c-0.205,0.131-0.469,0.229-0.792,0.328C22.883,19.229,22.564,19.29,22.255,19.327zM8.036,18.273h4.309l-2.113-6.063L8.036,18.273zM28.167,7.75H3.168c-0.552,0-1,0.448-1,1v16.583c0,0.553,0.448,1,1,1h24.999c0.554,0,1-0.447,1-1V8.75C29.167,8.198,28.721,7.75,28.167,7.75zM14.305,23.896l-1.433-4.109H7.488L6,23.896H4.094L9.262,10.17h2.099l4.981,13.727H14.305L14.305,23.896zM26.792,23.943c-0.263,0.074-0.461,0.121-0.599,0.141c-0.137,0.02-0.323,0.027-0.562,0.027c-0.579,0-0.999-0.204-1.261-0.615c-0.138-0.219-0.231-0.525-0.29-0.926c-0.344,0.449-0.834,0.839-1.477,1.169c-0.646,0.329-1.354,0.493-2.121,0.493c-0.928,0-1.688-0.28-2.273-0.844c-0.589-0.562-0.884-1.271-0.884-2.113c0-0.928,0.29-1.646,0.868-2.155c0.578-0.511,1.34-0.824,2.279-0.942l2.682-0.336c0.388-0.05,0.646-0.211,0.775-0.484c0.063-0.146,0.104-0.354,0.104-0.646c0-0.575-0.203-0.993-0.604-1.252c-0.408-0.26-0.99-0.389-1.748-0.389c-0.877,0-1.5,0.238-1.865,0.713c-0.205,0.263-0.34,0.654-0.399,1.174H17.85c0.031-1.237,0.438-2.097,1.199-2.582c0.77-0.484,1.659-0.726,2.674-0.726c1.176,0,2.131,0.225,2.864,0.673c0.729,0.448,1.093,1.146,1.093,2.093v5.766c0,0.176,0.035,0.313,0.106,0.422c0.071,0.104,0.223,0.156,0.452,0.156c0.076,0,0.16-0.005,0.254-0.015c0.093-0.011,0.191-0.021,0.299-0.041L26.792,23.943L26.792,23.943z").attr({
                fill: "#000", 
                stroke: "none"
            }).translate(tx + 5, ty+25).scale(0.6) );*/
            
            // clone (mint icon: sound_grey.png)
        
            /*
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEjSURBVHjaYvz//z8DsQAggJjwSaanpwsBMReMDxBATAQMO/zv379eRkZGdiBmAgggJiymqaWlpS0GSrIAFZ4A0h5AYR4gZgEIICaoAg6ggolACea/f/9aAulAoDD3169fNwPZ0kA2B0gxQADBTBYECuYCaa7bt2/vACkEYs4zZ84cA9KsQAwKBUaAAGIBqfzz5w8jExPTRiCTXUFBwQ9IfwP5x8TExAJI/4IpBgggsOJ58+Y9B1JRQMwGdOdjoFP2ghRwcnL6A4P2KUghiA8QQGDFQIH/QGf8BDJ/L1myZC8fHx/IeiZmZmbr379/H4ApBgggFlgoANX/A1L/gJoYP336BHIG47Nnz1zu3r0LUvgD5FqAAGLEF4Og0EHy4G+AAAMAho1gqqugDLgAAAAASUVORK5CYII=", tx, ty + 11, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onmousedown = function(){dia._currentDrag = self.clone()[0];console.log(dia._currentDrag[0])};
        */
        
            // toolbox wrapper
            return this;
        },

        /**
     * Hide (remove) toolbox.
     * @todo Will be public after it is properly tested.
     * @private
     */
        removeToolbox: function(){
            
            var connectionTypeSelector = Joint.getConnectionTypeSelector();
            if( connectionTypeSelector != null ){
                connectionTypeSelector.hide();
            }  
            
            if (this.toolbox)
                for (var i = this.toolbox.length - 1; i >= 0; --i)
                    this.toolbox[i].remove();
            this.toolbox = null;
            return this;
        },

        /**
     * Show/hide toolbox.
     * @todo Will be public after it is properly tested.
     * @private
     */
        toggleToolbox: function(){
            this._opt.toolbox = !this._opt.toolbox;
            if (this._opt.toolbox){
                this.addToolbox();
            } else {
                this.removeToolbox();
            }
            return this;
        },

        /**
     * Move toolbox by offset (dx, dy).
     * @private
     */
        translateToolbox: function(dx, dy){
            if (this.toolbox)
                for (var i = this.toolbox.length - 1; i >= 0; --i)
                    this.toolbox[i].translate(dx, dy);
        },

        /**
     * Disconnects element from all joints. Empties the element joints array.
     * Note that it preserves registration of the element in its joints.
     * @methodOf Joint.dia.Element#
     */
        disconnect: function(){
            var joints = this.joints(), idx = joints.length, j;
            while (idx--){
                j = joints[idx];

                if (j.endObject().wholeShape === this){
                    j.freeJoint(j.endObject());
                    j.draw(["dummyEnd"]);
                    j.update();
                }
                if (j.startObject().wholeShape === this){
                    j.freeJoint(j.startObject());
                    j.draw(["dummyStart"]);
                    j.update();
                }
            }
        },

        /**
     * Unregister the element from its joints registeredObjects.
     * After the call, the element is not registered in any of its joints.
     * @private
     */
        unregisterFromJoints: function(){
            var joints = this.joints(), idx = joints.length;
            while (idx--) joints[idx].unregister(this);
            return this;
        },

        /**
     * Remove element.
     * @methodOf Joint.dia.Element#
     * @return {null}
     */
        remove: function(){
            var inners = this.inner, idx = inners.length;
            this.unregisterFromJoints();
            this.disconnect();
            this.removeToolbox();
            this.unembed();
            while (idx--) inners[idx].remove();
            this.wrapper.remove();
            dia.unregister(this);
            this.removed = true;
            return null;
        },

        /**
     * Remove element and all joints pointing from and to this element.
     * @methodOf Joint.dia.Element#
     * @return {null}
     */
        liquidate: function(){
            this.deselect();
            var joints = this.joints(), idx = joints.length, j, inners = this.inner;
            // remove joints
            while (idx--){
                j = joints[idx]; // (brabec)
                /*j.freeJoint(j.startObject());
                j.freeJoint(j.endObject());
                j.clean(["connection", "startCap", "endCap", "handleStart", "handleEnd", "label"]);
                dia.unregisterJoint(j);
	    j.unregister(this);*/
                j.liquidate();
            }
        
            this.unembed();
            // liquidate subelements
            idx = inners.length;
            while (idx--){
                if (inners[idx].liquidate) inners[idx].liquidate();
                else inners[idx].remove();
            }
            this.wrapper.remove();
            dia.unregister(this);
            this.removed = true;
            return null;
        },

        /**
     * Enable/disable dragging of the element.
     * @methodOf Joint.dia.Element#
     * @param {boolean} enable True/false.
     * @return {Element} Return this.
     */
        draggable: function(enable){
            this._opt.draggable = enable;
            this.wrapper.node.style.cursor = enable ? "move" : null;
            var idx = this.inner.length;
            while (idx--) this.inner[idx].node.style.cursor = enable ? "move" : null;
            return this;
        },

        /**
     * Highlights the element.
     * Override in inherited objects or @todo set in options.
     * @methodOf Joint.dia.Element#
     * @return {Element} Return this.
     */
        highlight: function(){
            this.wrapper.attr("stroke", "red");
            return this;
        },

        /**
     * Unhighlights the element.
     * @methodOf Joint.dia.Element#
     * @return {Element} Return this.
     */
        unhighlight: function(){
            this.wrapper.attr("stroke", this.properties.attrs.stroke || "#000");
            return this;
        },

        /**
     * Embed me into the first registered dia.Element whos bounding box
     * contains my bounding box origin. Both elements will behave as a whole.
     * @todo It is probably out of date. Retest!!!
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
        embed: function(){
            var
            ros = dia._registeredObjects[this.paper.euid()],
            myBB = rect(this.wrapper.getBBox()),
            embedTo = null;

            // for all registered objects (sharing the same raphael paper)
            for (var i = 0, len = ros.length; i < len; i++){
                var
                shape = ros[i],
                shapeBB = rect(shape.getBBox());

                // does shape contain my origin point?
                if (shapeBB.containsPoint(myBB.origin()))
                    embedTo = shape;	// if yes, save the shape

                if (shape == this.parentElement){
                    shape.delInner(this);

                    // just for optimization, a shape can be a subshape of
                    // only one shape, so if I have been deleted from my parent,
                    // I am free, and further, if I know where to embed -> do not search deeper
                    if (embedTo) break;
                }
            }

            // embed if possible
            embedTo && embedTo.addInner(this);
            return this;
        },

        /**
     * Resize element.
     * @author Franta Toman, frantatoman
     * @date 15.11.2011
     */
        resize: function(sx, sy){        
        
        // save translation
        /*
	this.properties.sx = sx;
	this.properties.sy = sy;

        console.log('resize' + arguments.length);

	this.shadow && this.shadow.scale.apply(this.shadow, arguments);
	this.wrapper.scale.apply(this.wrapper, arguments);
        
        this.zoom.apply(this, arguments);
	// apply scale to all subshapes that are Elements (were embeded)
	for (var i = 0, len = this.inner.length; i < len; i++){
	    var inner = this.inner[i];
	    if (inner._isElement){
		inner.scale.apply(inner, arguments);
	    }
	}
        
	if (this._doNotRedrawToolbox) return;
	this.removeToolbox();
	this.addToolbox();
        
        this.removeBoundingBox();
        this.addBoundingBox();
        */
        
        },

        /**
     * Decouple embedded element from its parent.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
        unembed: function(){
            if (this.parentElement){
                this.parentElement.delInner(this);
                this.parentElement = null;
                this.properties.parent = undefined;
            }
            return this;
        },

        /**
     * Scale element.
     * @methodOf Joint.dia.Element#
     * @param {Number} sx Scale in x-axis.
     * @param {Number} &optional sy Scale in y-axis.
     * @example e.scale(1.5);
     */
        scale: function(sx, sy){
            // save translation
            this.properties.sx = sx;
            this.properties.sy = sy;

            this.shadow && this.shadow.scale.apply(this.shadow, arguments);
            this.wrapper.scale.apply(this.wrapper, arguments);

            this.zoom.apply(this, arguments);
            // apply scale to all subshapes that are Elements (were embeded)
            for (var i = 0, len = this.inner.length; i < len; i++){
                var inner = this.inner[i];
                if (inner._isElement){
                    inner.scale.apply(inner, arguments);
                }
            }
            if (this._doNotRedrawToolbox) return;
            this.removeToolbox();
            this.addToolbox();
        
            this.removeBoundingBox();
            this.addBoundingBox();
        
        },
        /**
     * This method should be overriden by inherited elements to implement
     * the desired scaling behaviour.
     * @methodOf Joint.dia.Element#
     * @param {Number} sx Scale in x-axis.
     * @param {Number} &optional sy Scale in y-axis.
     */
        zoom: function(sx, sy){
        // does nothing, overriden by specific elements
        },

        /**
     * @methodOf Joint.dia.Element#
     * @return {Object} Bounding box of the element.
     */
        getBBox: function(){
            return this.wrapper.getBBox();
        },

        /**
     * @see Joint
     * @methodOf Joint.dia.Element#
     */
        joint: function(to, opt){
            var toobj = (to._isElement) ? to.wrapper : to,
            j = this.wrapper.joint.apply(this.wrapper, [toobj, opt]);
            Joint.dia.registerJoint(j);
            
            return j;
        },

        /**
     * Delegate attr message to my wrapper.
     * @private
     */
        attr: function(){
            return Raphael.el.attr.apply(this.wrapper, arguments);
        },
    
        /**
     *  Bounding Box:
     *  - border around element
     *  - resizing points (LT, RT, LB, RB, LC, RC, CT, CB)
     *        
     *  @author: frantatoman     
     *
     */
    
        addBoundingBox: function(){
        
            //console.log("add bb")
            //
            // dont show boundingbox if it is not enabled
            if(!this._opt.boundingBox){
                return this;
            }
        
            var self = this,
            bb = this.wrapper.getBBox(),    // wrapper of bounding box
            bx = bb.x - 5,                  // bounding box x position
            by = bb.y - 5,                  // bounding box y position
            bwidth = bb.width + 10,
            bheight = bb.height + 10;
        
            this.boundingBox = [];
        
            //console.log('addbbox');
        
            this.boundingBox.push( this.paper.rect(bx, by, bwidth, bheight).attr({
                'stroke-width': '1', 
                'stroke': '#000', 
                'stroke-dasharray': '. '
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();          
        
            this.boundingBox.push( this.paper.rect( bx, by, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "nw-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();
        
            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    Joint.fixEvent(e);
                
                    //console.log("tl mousedown");
                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.TL]);
                    e.preventDefault();
                    e.stopPropagation();
                }
                );
                
            this.boundingBox.push( this.paper.rect( bx + bwidth - 5, by, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "ne-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();

            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.TR]);
                    e.stopPropagation();
                }
                );
        
            this.boundingBox.push( this.paper.rect( bx + bwidth/2 - 2.5, by, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "n-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();
        
            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.TC]);
                    e.stopPropagation();
                }
                );
        
            this.boundingBox.push( this.paper.rect( bx, by + bheight - 5, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "ne-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();        
                
            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.BL]);
                    e.stopPropagation();
                }
                );
                
            this.boundingBox.push( this.paper.rect( bx + bwidth - 5, by + bheight - 5, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "nw-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();
                
            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.BR]);
                    e.stopPropagation();
                }
                );
                
            this.boundingBox.push( this.paper.rect( bx + bwidth/2 - 2.5, by + bheight - 5, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "n-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();
                
            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.BC]);
                    e.stopPropagation();
                }
                );
                
            this.boundingBox.push( this.paper.rect( bx, by + bheight/2-2.5, 5, 5 ).attr({
                'fill':'#000', 
                "cursor": "w-resize"
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();
        
            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.CL]);
                    e.stopPropagation();
                }
                );
        
            this.boundingBox.push( this.paper.rect( bx + bwidth - 5, by + bheight/2 - 2.5, 5, 5 ).attr({
                'fill':'#000', 
                'cursor':'w-resize'
            }) );
            this.boundingBox[this.boundingBox.length-1].toFront();        

            Joint.addEvent(
                this.boundingBox[this.boundingBox.length-1].node,
                "mousedown",
                function(e){                                
                    dia.Element.prototype.resizer.apply(self, [e, dia.Element._resizeDirections.CR]);
                    e.stopPropagation();
                }
                );

            return this;        
        },
    
        removeBoundingBox: function(){
            if(this.boundingBox){
                for(var i = this.boundingBox.length - 1; i >= 0; --i){
                    this.boundingBox[i].remove();
                }
            }
        
            this.boundingBox = null;
        
            return this;
        },
    
        toogleBoundingBox: function(){
            this._opt.boundingBox = !this._opt.boundingBox;
        
            if(this._opt.boundingBox){
                this.addBoundingBox();
            }else{
                this.removeBoungingBox();
            }
        
            return this;
        },
    
        translateBoundingBox: function(dx, dy){
            if(this.boundingBox){
                for( var i = this.boundingBox.length - 1; i >= 0; --i ){
                    this.boundingBox[i].translate(dx, dy);
                }
            }
        },
    
        getBoundingBox: function(){
            return this.boundingBox;
        },
        
        /// (brabec)
        select: function(){  //(brabec)
            if(Joint.dia._currentSelected && Joint.dia._currentSelected !== this){
                Joint.dia._currentSelected.deselect();
            } else if (Joint.dia._currentSelected === this) {
                return;
            }
            Joint.dia._currentSelected = this;
            this.wrapper.attr("cursor", "move");
            this.addBoundingBox();
            this.addToolbox();
            //this.highlight();
            
        },
        
        deselect: function(){ //(brabec)
            if(Joint.dia._currentSelected == this){
                Joint.dia._currentSelected = false;
                this.wrapper.attr("cursor", "pointer");
                this.removeBoundingBox();
                this.removeToolbox();
                this.unhighlight();
            }
        },
    
        ////////////////////////////////////////////////////////////////////////////
        // settings callback
    
        setDblClickCallback: function(callback){
            this.dblClickCallback = callback;        
            this.wrapper.dblclick( function(){
                this.wholeShape.invokeDblClickCallback();
            } );
        },
    
        // invoke doubleclick callbock
        invokeDblClickCallback: function(){        
            if(this.dblClickCallback){
                this.dblClickCallback.call( this, this );
            }
        },
    
        ////////////////////////////////////////////////////////////////////////////
        // settings callback
    
        /**
     *  Lock the element
     */
        lock: function(){
            this.locked = true;
        },
    
        /**
     * Unlock the element
     */
        unlock: function(){
            this.locked = false;
        },
    
        isLocked: function(){
            return this.locked;
        },
        
        getMinHeight: function(){
            return 50;
        },
        
        getMinWidth: function(){
            return 50;
        }
        
    };

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////////////////
    // EVENTS

    /**
 * Document mousemove event.
 * @private
 */
    Element.mouseMove = function(e){
        e = e || window.event;
        // object dragging
        //console.log(dia._currentDrag);
        if (dia._currentDrag){
            if (dia._currentDrag._opt.ghosting)	// if ghosting, move ghost
                dia._currentDrag.ghost.translate(e.clientX - dia._currentDrag.dx, e.clientY - dia._currentDrag.dy);
            else	// otherwise, move the whole shape
                dia._currentDrag.translate(e.clientX - dia._currentDrag.dx, e.clientY - dia._currentDrag.dy);

            /*var js = dia._currentDrag.joints();
        var i =0;
        for(i=0;i<js.length;i++){
            var sbp = js[i]._start.boundPoint;
            var ebp = js[i]._end.boundPoint;
            if(js[i]._start.shape == dia._currentDrag) js[i]._start.boundPoint = point(sbp.x+(e.clientX - dia._currentDrag.dx),sbp.y+(e.clientY - dia._currentDrag.dy));
            if(js[i]._end.shape == dia._currentDrag) js[i]._end.boundPoint = point(ebp.x+(e.clientX - dia._currentDrag.dx),ebp.y+(e.clientY - dia._currentDrag.dy));
        }*/
            dia._currentDrag.updateJoints();
            dia._currentDrag.dx = e.clientX;
            dia._currentDrag.dy = e.clientY;
        }

        // object zooming
        if (dia._currentZoom){
            var
            dx = e.clientX - dia._currentZoom.dx,
            dy = e.clientY - dia._currentZoom.dy;

            dia._currentZoom.dWidth -= dx;
            dia._currentZoom.dHeight -= dy;
            // correction
            if (dia._currentZoom.dWidth < 1) dia._currentZoom.dWidth = 1;
            if (dia._currentZoom.dHeight < 1) dia._currentZoom.dHeight = 1;

            // scaling parameters
            var
            sx = dia._currentZoom.dWidth / dia._currentZoom.origBBox.width,
            sy = dia._currentZoom.dHeight / dia._currentZoom.origBBox.height;

            // do not redraw toolbox because it is not there
            dia._currentZoom._doNotRedrawToolbox = true;
            dia._currentZoom.scale(sx, sy);	// scale
            r.safari();

            // save for later usage
            dia._currentZoom.dx = e.clientX;
            dia._currentZoom.dy = e.clientY;
            dia._currentZoom.lastScaleX = sx;
            dia._currentZoom.lastScaleY = sy;
        }
    
    
        // object resizing, added by frantatoman, 15.11.2011
        if(dia._currentResize){    
        
            //var
            dx = e.clientX - dia._currentResize.dx,
            dy = e.clientY - dia._currentResize.dy;

        
            ////////////////////////////////////////////////////////////////////////
            // added by frantatoman, 15.11.2011
            // set up center scaling
        
            var centerX = dia._currentResize.getBBox().x;
            var centerY = dia._currentResize.getBBox().y;
            var scaleXEnable = true;
            var scaleYEnable = true;
        
            if(dia._currentResizeDirection == dia.Element._resizeDirections.CL){        // center left point
                centerX += dia._currentResize.getBBox().width;
                dx *= -1;
                scaleYEnable = false;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.CR){  // center right point
                scaleYEnable = false;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.BC){  // bottom center
                scaleXEnable = false;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.TC){  // top center
                scaleXEnable = false;
                centerY += dia._currentResize.getBBox().height;
                dy *= -1;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.TL){
                centerX += dia._currentResize.getBBox().width;
                centerY += dia._currentResize.getBBox().height;
                dx *= -1;
                dy *= -1;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.TR){            
                centerY += dia._currentResize.getBBox().height;            
                dy *= -1;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.BL){           
                centerX += dia._currentResize.getBBox().width;  
                dx *= -1;
            }else if(dia._currentResizeDirection == dia.Element._resizeDirections.BR){           
            
            }
        
        
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////
                        
            dia._currentResize.dWidth += dx;        
            dia._currentResize.dHeight += dy;        
        
            // correction
            if (dia._currentResize.dWidth < 1) dia._currentResize.dWidth = 1;
            if (dia._currentResize.dHeight < 1) dia._currentResize.dHeight = 1;

            // scaling parameters
            //var
            sx = dia._currentResize.dWidth / dia._currentResize.origBBox.width,
            sy = dia._currentResize.dHeight / dia._currentResize.origBBox.height;

            // console.log(sx + ' : ' + sy);
            // do not redraw toolbox because it is not there
            dia._currentResize._doNotRedrawToolbox = true;       
        
        
            if(!scaleYEnable){
                sy = dia._currentResize.lastScaleY;
            }                                            // if is vertical scaling, then disabled scaleY
            if(!scaleXEnable){
                sx = dia._currentResize.lastScaleX;
            }                                            // if is horizontal scaling, then disabled scaleX
                    
            dia._currentResize.scale(sx, sy, centerX, centerY);	// scale        
            var center = rect(dia._currentResize.getBBox()).center().relativeTo(point(centerX,centerY));
            dia._currentResize.properties.dx = center.x;
            dia._currentResize.properties.dy = center.y;

            // save for later usage
            dia._currentResize.dx = e.clientX;
            dia._currentResize.dy = e.clientY;
            dia._currentResize.lastScaleX = sx;
            dia._currentResize.lastScaleY = sy;
        
            dia._currentResize.updateJoints();

        }
    
    };

    /**
 * Document mouseup event.
 * @private
 */
    Element.mouseUp = function(e){
        // if ghosting is enabled, translate whole shape to the position of
        // the ghost, then remove ghost and update joints
        if (dia._currentDrag && dia._currentDrag._opt.ghosting){
            var
            gPos = dia._currentDrag.ghostPos(),
            wPos = dia._currentDrag.wrapperPos();

            dia._currentDrag.translate(gPos.x - wPos.x, gPos.y - wPos.y);
            dia._currentDrag.ghost.remove();
            dia._currentDrag.updateJoints();
        }
        // add toolbar again when dragging is stopped
        if (dia._currentDrag){
            dia._currentDrag.addToolbox();
            //dia._currentDrag.toFront();
            dia._currentDrag.addBoundingBox();
            // small hack: change slightely the position to get the connections to front
            dia._currentDrag.translate(1,1);
            dia._currentDrag.translate(-1,-1);
        }

        // add toolbar again when zooming is stopped
        if (dia._currentZoom){
            // remove toolbox, because scale above may create one,
            // so there would be two toolboxes after addToolbox() below
            dia._currentZoom.removeToolbox();
            dia._currentZoom.addToolbox();        
            //dia._currentZoom.toFront();
        }
    
        if(dia._currentResize){
            dia._currentResize.removeBoundingBox();
            dia._currentResize.addBoundingBox();
        }

        dia._currentDrag = false;
        dia._currentZoom = false;    
    
        // added by frantatoman, 15.11.2011
        dia._currentResize = false;                             // current resize object set to false, now is not resized
        dia._currentResizeDirection = -1;                       // resize direction -1 = undefined

    };

    ////////////////////////////////////////////////////////////////////////////////
    // added by frantatoman, 19. november, 2011

    /**
     * Document keydown event.
     * @private
     */
    Element.keyDown = function(e){
        
        var selected = dia._currentSelected;
        
        if(selected){
            if(e.keyCode >= 37 && e.keyCode < 41){
                
                var dx = dy = 0,
                step = 1;
                
                if(e.shiftKey){
                    step = 20;
                }
                
                if(e.keyCode == 37 || e.keyCode == 39){                    
                    dx = step;
                    if(e.keyCode == 37){
                        dx *= -1;
                    }
                    selected.dx = dx;
                }else{
                    dy = step;
                    if(e.keyCode == 38){
                        dy *= -1;
                    }
                    selected.dy = dy;
                }
                
                selected.translate(dx, dy);
                
            }else if(e.keyCode == 46){
                selected.liquidate();
            }
        }
        
    };
    
    /**
     * Document keydown event.
     * @private
     */
    Element.keyUp = function(e){
        if(e.shiftKey){             // set up shift key to false (dont select content around)
            e.shiftKey = false;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    Joint.addEvent(document, "mousemove", Element.mouseMove);
    Joint.addEvent(document, "mouseup", Element.mouseUp);
    Joint.addEvent(document, "keydown", Element.keyDown);
    Joint.addEvent(document, "keyup", Element.keyUp);



})(this);	// END CLOSURE


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var dia = Joint.dia;






