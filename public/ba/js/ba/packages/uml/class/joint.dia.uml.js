(function(global){	// BEGIN CLOSURE

    String.prototype.wordWrap = function(m, b, c){
        var i, j, s, r = this.split("\n");
        if(m > 0) for(i in r){
            for(s = r[i], r[i] = ""; s.length > m;
                j = c ? m : (j = s.substr(0, m).match(/\S*$/)).input.length - j[0].length
                || m,
                r[i] += s.substr(0, j) + ((s = s.substr(j)).length ? b : "")
            );
            r[i] += s;
        }
        return r.join("\n");
    };

    var Joint = global.Joint,
    Element = Joint.dia.Element,
    point = Joint.point;

    /**
 *list of possible cardinalities
 */
    Joint.dia.cardinalities = new Array("*","0","0..*","0..1","1","1..","1..*");

    /**
 * @name Joint.dia.uml
 * @namespace Holds functionality related to UML diagrams.
 */
    var uml = Joint.dia.uml = {};

    /**
 * Predefined aggregation arrow for Class diagram.
 * @name aggregationArrow
 * @memberOf Joint.dia.uml
 * @example c1.joint(c2, Joint.dia.uml.aggregationArrow);
 */
    uml.aggregationArrow = {
        endArrow: {
            type: "aggregation"
        },
        startArrow: {
            type: "none"
        },
        attrs: {
            "stroke-dasharray": "none"
        }
    };
    /**
 * Predefined dependency arrow for Class diagram.
 * @name dependencyArrow
 * @memberOf Joint.dia.uml
 * @example c1.joint(c2, Joint.dia.uml.dependencyArrow);
 */
    uml.dependencyArrow = {
        endArrow: {
            type: "basic", 
            size: 5
        },
        startArrow: {
            type: "none"
        },
        attrs: {
            "stroke-dasharray": "none"
        }
    };
    /**
 * Predefined generalization arrow for Class diagram.
 * @name generalizationArrow
 * @memberOf Joint.dia.uml
 * @example c1.joint(c2, Joint.dia.uml.generalizationArrow);
 */
    uml.generalizationArrow = {
        endArrow: {
            type: "basic", 
            size: 10, 
            attrs: {
                fill: "white"
            }
        },
        startArrow: {
            type: "none"
        },
        attrs: {
            "stroke-dasharray": "none"
        }
    };
    /**
 * Predefined arrow for StateChart.
 * @name Joint.dia.uml.arrow
 * @memberOf Joint.dia.uml
 * @example s1.joint(s2, Joint.dia.uml.arrow);
 */
    uml.arrow = {
        startArrow: {
            type: "none"
        },
        endArrow: {
            type: "basic", 
            size: 5
        },
        attrs: {
            "stroke-dasharray": "none"
        }
    };

    /**
 * UML StateChart state.
 * @name State.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the State (e.g. {x: 50, y: 100, width: 100, height: 80}).
 * @param {Number} [properties.radius] Radius of the corners of the state rectangle.
 * @param {String} [properties.label] The name of the state.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the state rectangle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the state rectangle origin.
 * @param {Number} [properties.swimlaneOffsetY] Offset in y-axis of the swimlane shown after the state label.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the state.
 * @param {Object} [properties.actions] Actions of the state.
 * @param {String} [properties.actions.entry] Entry action of the state.
 * @param {String} [properties.actions.exit] Exit action of the state.
 * @param {array} [properties.actions.inner] Actions of the state (e.g. ["Evt1", "Action1()", "Evt2", "Action2()"])
 * @param {Number} [properties.actionsOffsetX] Offset in x-axis of the actions.
 * @param {Number} [properties.actionsOffsetY] Offset in y-axis of the actions.
 * @example
var s1 = Joint.dia.uml.State.create({
  rect: {x: 120, y: 70, width: 100, height: 60},
  label: "state 1",
  attrs: {
    fill: "90-#000-green:1-#fff"
  },
  actions: {
    entry: "init()",
    exit: "destroy()",
    inner: ["Evt1", "foo()", "Evt2", "bar()"]
  }
});
 */
    uml.State = Element.extend({
        object: "State",
        module: "uml",
        init: function(properties){
            // options
            var p = Joint.DeepSupplement(this.properties, properties, {
                radius: 15,
                attrs: {
                    fill: ''
                },
                label: '',
                labelOffsetX: 20,
                labelOffsetY: 5,
                swimlaneOffsetY: 18,
                actions: {
                    entry: null,
                    exit: null,
                    inner: []
                },
                actionsOffsetX: 5,
                actionsOffsetY: 5
            });
            // wrapper
            this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
            // inner
            this.addInner(this.getLabelElement());
            this.addInner(this.getSwimlaneElement());
            this.addInner(this.getActionsElement());
        },
        getLabelElement: function(){
            var
            p = this.properties,
            bb = this.wrapper.getBBox(),
            t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
            tbb = t.getBBox();
            t.translate(bb.x - tbb.x + p.labelOffsetX,
                bb.y - tbb.y + p.labelOffsetY);
            return t;
        },
        getSwimlaneElement: function(){
            var bb = this.wrapper.getBBox(), p = this.properties;
            return this.paper.path(["M", bb.x, bb.y + p.labelOffsetY + p.swimlaneOffsetY, "L", bb.x + bb.width, bb.y + p.labelOffsetY + p.swimlaneOffsetY].join(" "));
        },
        getActionsElement: function(){
            // collect all actions
            var p = this.properties;
            var str = (p.actions.entry) ? "entry/ " + p.actions.entry + "\n" : "";
            str += (p.actions.exit) ? "exit/ " + p.actions.exit + "\n" : "";
            var l = p.actions.inner.length;
            for (var i = 0; i < l; i += 2){
                str += p.actions.inner[i] + "/ " + p.actions.inner[i+1] + "\n";
            }
            // trim
            str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

            // draw text with actions
            var
            bb = this.wrapper.getBBox(),
            t = this.paper.text(bb.x + p.actionsOffsetX, bb.y + p.labelOffsetY + p.swimlaneOffsetY + p.actionsOffsetY, str),
            tbb = t.getBBox();
            t.attr("text-anchor", "start");
            t.translate(0, tbb.height/2);	// tune the y position
            return t;
        },
        zoom: function(){
            this.wrapper.attr("r", this.properties.radius); 	// set wrapper's radius back to its initial value (it deformates after scaling)
            this.shadow && this.shadow.attr("r", this.properties.radius); 	// update shadow as well if there is one 
            this.inner[0].remove();	// label
            this.inner[1].remove();	// swimlane
            this.inner[2].remove();	// actions
            this.inner[0] = this.getLabelElement();
            this.inner[1] = this.getSwimlaneElement();
            this.inner[2] = this.getActionsElement();
        }
    });


    /**
 * UML StateChart start state.
 * @name StartState.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.position Position of the start state (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the start state.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the start state.
 * @example
var s0 = Joint.dia.uml.StartState.create({
  position: {x: 120, y: 70},
  radius: 15,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  }
});
 */
    uml.StartState = Element.extend({
        object: "StartState",
        module: "uml",
        init: function(properties){
            // options
            var p = Joint.DeepSupplement(this.properties, properties, {
                position: point(0,0),
                radius: 10,
                attrs: {
                    fill: 'black'
                }
            });
            // wrapper
            this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
        }
    });


    /**
 * UML StateChart end state.
 * @name EndState.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.position Position of the end state (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the end state.
 * @param {Number} [properties.innerRadius] Radius of the inner circle of the end state.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the end state.
 * @param {Object} [properties.innerAttrs] SVG attributes of the appearance of the inner circle of the end state.
 * @example
var s0 = Joint.dia.uml.EndState.create({
  position: {x: 120, y: 70},
  radius: 15,
  innerRadius: 8,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  },
  innerAttrs: {
    fill: "red"
  }
});
 */
    uml.EndState = Element.extend({
        object: "EndState",
        module: "uml",
        init: function(properties){
            // options
            var p = Joint.DeepSupplement(this.properties, properties, {
                position: point(0,0),
                radius: 10,
                innerRadius: (properties.radius && properties.radius / 2) || 5,
                attrs: {
                    fill: 'white'
                },
                innerAttrs: {
                    fill: 'black'
                }
            });
            // wrapper
            this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
            // inner
            this.addInner(this.paper.circle(p.position.x, p.position.y, p.innerRadius).attr(p.innerAttrs));
        },
        zoom: function(){
            this.inner[0].scale.apply(this.inner[0], arguments);
        }
    });


    /**
 * UML StateChart class.
 * @name Class.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the Class (e.g. {x: 50, y: 100, width: 100, height: 80}).
 * @param {String} [properties.label] The name of the class.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the class rectangle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the class rectangle origin.
 * @param {Number} [properties.swimlane1OffsetY] Offset in y-axis of the swimlane shown after the class label.
 * @param {Number} [properties.swimlane2OffsetY] Offset in y-axis of the swimlane shown after the class attributes.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the state.
 * @param {array} [properties.attributes] Attributes of the class.
 * @param {array} [properties.methods] Methods of the class.
 * @param {Number} [properties.attributesOffsetX] Offset in x-axis of the attributes.
 * @param {Number} [properties.attributesOffsetY] Offset in y-axis of the attributes.
 * @param {Number} [properties.methodsOffsetX] Offset in x-axis of the methods.
 * @param {Number} [properties.methodsOffsetY] Offset in y-axis of the methods.
 * @example
var c1 = Joint.dia.uml.Class.create({
  rect: {x: 120, y: 70, width: 120, height: 80},
  label: "MyClass",
  attrs: {
    fill: "90-#000-yellow:1-#fff"
  },
  attributes: ["-position"],
  methods: ["+createIterator()"]
});
 */

    // DIALOGS

    var noteEditForm = new BAForm('note-edit-dialog');
    noteEditForm.addTextarea('content', 'Fill your note');
    
    var noteEditDialog = new baDialog('note-edit', 'Edit note', noteEditForm.render(), {
        modal: true,        
        form: noteEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                
                var values = form.getValues();
                
                reference.setContent( values.content );
                reference.update();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });

    // ELEMENTS

    uml.Note = Element.extend({
        object: "Note",
        module: "uml",
    
        init: function(properties){
            var p = Joint.DeepSupplement(this.properties, properties, {
                attrs: {
                    fill: '0-#f5ecef-#f6f2f2'
                },
                content: '',
                contentOffsetX: 10,
                contentOffsetY: 10
            });
        
            this.setWrapper( this.paper.rect( p.rect.x, p.rect.y, p.rect.width, p.rect.height ).attr(p.attrs) );
            this.addInner(this.getContentElement());    // 0 - text content
            
            // set edit dialog
            noteEditDialog.create();

            this.setDblClickCallback( function(reference){ 
                var form = noteEditDialog.getOption('form');        
                form.setValues({
                    content: reference.getContent()
                    });
                noteEditDialog.setOptions({
                    reference: reference
                });
                noteEditDialog.open();        
            } );   
            
            
        },
    
        getContent: function(){
            return this.properties.content;
        },
    
        setContent: function(content){
            this.properties.content = content;
        },
    
        getContentElement: function(){
            var p = this.properties,
            bb = this.wrapper.getBBox(),
            content = p.content;
        
            console.log(content.length);
            console.log(bb.width);
        
            var resultContent = '';        
            var charLength = 5;

            resultContent = content.wordWrap( Math.ceil((bb.width-2*p.contentOffsetX)/charLength ) , '\n', false);
        
            var t = this.paper.text( bb.x, bb.y, resultContent ),
            tbb = t.getBBox();
            t.attr("text-anchor", "start");
        
            t.translate(p.contentOffsetX , (tbb.height/2) + p.contentOffsetY );
            return t;
        },

        zoom: function(){
            this.update();
        },
    
        update: function(){
            this.inner[0].remove();
            this.inner[0] = this.getContentElement();
        }
    
    
    });


    // DIALOGS

    var classEditForm = new BAForm('class-edit-dialog');
    var classEditGeneralTab = classEditForm.addTab('general', 'General');
    classEditGeneralTab.addText('label', "Title");
    
    var classEditPropertiesTab = classEditForm.addTab('properties', 'Properties');
    
    var combineProperties = classEditPropertiesTab.addCombine('properties', {
        name: 'Name', 
        parameters: 'Parameters', 
        returns: 'Returns'
    });
    combineProperties.addText('name', 'Name');
    combineProperties.addText('parameters', 'Parameters');
    combineProperties.addText('returns', 'Returns');
    
    var classEditMethodsTab = classEditForm.addTab('methods', 'Methods');
    
    var classEditDialog = new baDialog('class-edit', 'Edit class', classEditForm.render(), {
        modal: true,        
        form: classEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                
                var values = form.getValues();
                
                console.log('class edit dialog form: ');
                console.log(values);
                
                reference.setLabel( values.general.label );
                reference.setAttributes( values.properties.properties );
                reference.update();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });


    uml.Class = Element.extend({
        object: "Class",
        module: "uml",
        init: function(properties){
            var p = Joint.DeepSupplement(this.properties, properties, {
                attrs: {
                    fill: '0-#fcf2e3-#e5dbcc'
                },
                label: '',
                labelOffsetX: 20,
                labelOffsetY: 5,
                swimlane1OffsetY: 18,
                swimlane2OffsetY: 18,
                attributes: [],
                attributesOffsetX: 5,
                attributesOffsetY: 5,
                methods: [],
                methodsOffsetX: 5,
                methodsOffsetY: 5,
                isInterface: false                                  
            });
            // wrapper
            this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
            // inner
            this.addInner(this.getLabelElement());
            this.addInner(this.getSwimlane1Element());
            this.addInner(this.getAttributesElement());
            this.addInner(this.getSwimlane2Element());
            this.addInner(this.getMethodsElement());
            
            // set edit dialog
            classEditDialog.create();

            this.setDblClickCallback( function(reference){ 
                var form = classEditDialog.getOption('form');   
                
                //form.setValues({content: reference.getContent()});
                form.setValues({
                    general: {
                        label: reference.getLabel()
                    }
                });
            classEditDialog.setOptions({
                reference: reference
            });
            classEditDialog.open();        
            } );
            
    },
    getLabelElement: function(){
        var
        p = this.properties,
        bb = this.wrapper.getBBox();
        
        var label = p.label;
        if( p.isInterface ){            
            label = "<<interface>>\n" + label;
            p.labelOffsetY = 10;
        }
        
        var t = this.paper.text(bb.x, bb.y, label).attr(p.labelAttrs || {}),
        tbb = t.getBBox();
        t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + p.labelOffsetY);
        return t;
    },
    
    ////////////////////////////////////////////////////////////////////////////
    // Added by frantatoman, 17.11.2011
    
    /**
     *  Set label text
     */
    setLabel: function(value){
        this.inner[0].attr('text', value);
        this.properties.label = value;
    },
    
    /**
     *  Returns label text
     */
    getLabel: function(){
        return this.properties.label;
    },
    
    /**
     *  Returns class methods
     */
    
    getMethods: function(){
        return this.properties['methods'];
    },
    
    setMethods: function(methods){
        this.properties['methods'] = methods;        
    },
    
    /**
     *  Returns class attributes
     */
    getAttributes: function(){
        return this.properties['attributes'];
    },
    
    /**
     * Set class attributes
     */
    setAttributes: function(attributes){
        this.properties['attributes'] = attributes;        
    },
    
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    
    getSwimlane1Element: function(){
        var bb = this.wrapper.getBBox(), p = this.properties;  
        return this.paper.path(["M", bb.x, bb.y + p.labelOffsetY + p.swimlane1OffsetY, "L", bb.x + bb.width, bb.y + p.labelOffsetY + p.swimlane1OffsetY].join(" "));
    },
    getSwimlane2Element: function(){
        var
        p = this.properties,
        bb = this.wrapper.getBBox(),
        bbAtrrs = this.inner[2].getBBox();  // attributes
        return this.paper.path(["M", bb.x, bb.y + p.labelOffsetY + p.swimlane1OffsetY + bbAtrrs.height + p.swimlane2OffsetY, "L", bb.x + bb.width, bb.y + p.labelOffsetY + p.swimlane1OffsetY + bbAtrrs.height + p.swimlane2OffsetY].join(" "));
    },
    getAttributesElement: function(){

        var str = "", p = this.properties;
        
        for( var i = 0; i < this.properties.attributes.length; i++ ){
            var visibility = '';
            
            if(p.attributes[i].visibility == 'protected'){
                visibility = '#';
            }else if( p.attributes[i].visibility == 'private' ){
                visibility = '-';
            }else{
                visibility = '+';
            }
            
            str += visibility + " " + p.attributes[i].name + ': ' + p.attributes[i].type + "\n" ;
        }
        
        bb = this.wrapper.getBBox();        
        t = this.paper.text(bb.x+p.attributesOffsetX, bb.y + p.labelOffsetY + p.swimlane1OffsetY + p.attributesOffsetY, str);
        tbb = t.getBBox();
        t.attr('text-anchor', 'start');
        t.translate(0, tbb.height/2);
        
        return t;
    },
    getMethodsElement: function(){
        var str = " ", p = this.properties;
	
        for( var i = 0; i < this.properties.methods.length; i++ ){
            var visibility = '';
            
            if(p.methods[i].visibility == 'protected'){
                visibility = '#';
            }else if( p.methods[i].visibility == 'private' ){
                visibility = '-';
            }else{
                visibility = '+';
            }
                        
            // parsing method attributes
            var methodAttrs = p.methods[i].attributes.split(';');
            var attrsStr = '';
            
            if( typeof(methodAttrs)=='object'&&(methodAttrs instanceof Array) ){
                for( var j = 0; j < methodAttrs.length; j++ ){                
                    if(methodAttrs[j] != ''){
                        var attr = methodAttrs[j].split(":");                
                        console.log(attr);
                        if(attrsStr != ''){
                            attrsStr += ", " + attr[1];
                        }else{
                            attrsStr = attr[1];
                        }
                    }
                }
            }else{
                attrsStr = '';
            }
            
            str += visibility + " " + p.methods[i].name + '('+ attrsStr +'): ' + p.methods[i].type + "\n" ;
        }
        
        var
        bb = this.wrapper.getBBox(),
        bbAtrrs = this.inner[2].getBBox(),  // attributes
        t = this.paper.text(bb.x + p.methodsOffsetX, bb.y + p.labelOffsetY + p.swimlane1OffsetY + p.attributesOffsetY + bbAtrrs.height + p.swimlane2OffsetY + p.methodsOffsetY, str),
        tbb = t.getBBox();
        
        t.attr("text-anchor", "start");
        t.translate(0, tbb.height/2);	// tune the y-position
        
        return t;
        
    },
    
    zoom: function(){
        this.update();
    },
    
    update: function(){
        this.inner[0].remove();	// label
        this.inner[1].remove();	// swimlane1
        this.inner[2].remove();	// attributes
        this.inner[3].remove();	// swimlane2
        this.inner[4].remove();	// methods
        this.inner[0] = this.getLabelElement();
        this.inner[1] = this.getSwimlane1Element();
        this.inner[2] = this.getAttributesElement();
        this.inner[3] = this.getSwimlane2Element();
        this.inner[4] = this.getMethodsElement();        
    }

    
    });
    
    
/**
    * Common UML diagram elements
    * 
    * 
    */
   
uml.Constraint = Element.extend({
    object: 'Constraint',
    module: 'uml',
    init: function(properties){
           
        var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: {
                fill: '0-#fcf2e3-#e5dbcc'
            },
                
            type: '',
            constraint: '',
                
            label: '',
            labelOffsetX: 20,
            labelOffsetY: 5,
            swimlane1OffsetY: 18,
            swimlane2OffsetY: 18,
            attributes: [],
            attributesOffsetX: 5,
            attributesOffsetY: 5,
            methods: [],
            methodsOffsetX: 5,
            methodsOffsetY: 5,
            isInterface: false                                  
        });
        // wrapper
        this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
            
    }
});
   
   
   
   
   
////////////////////////////////////////////////////////////////////////////////
// UML Class element
// - static view of system (structure diagram)
   
   /*
uml.Class = Element.extend({
    object: 'Class',
    module: 'uml',
       
    init: function(properties){
       
        var p = Joint.DeepSupplement(this.properties, properties, {
            
            // graphic representation of UML Class Element
            
                attrs: {
                    fill: '#ffffff'
                },
                
                swimlaneOffset: 5,
                nameOffsetX: 5,
                nameOffsetY: 5,
                
                font: {
                    
                },
            
            
            data:{
                isAbstract: false,
                isInterface: false,
                name: '',
                methods: [],
                attributes: []              // each of attributes contains: visibility/name:type multiplicity = implicitValue
            }
            
        });
        
        
        this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
        this.addInner(this.getLabelElement());
       
    },
       
    // drawing
       
    getLabelElement: function(){
       
        var
        p = this.properties,
        bb = this.wrapper.getBBox();
        
        var label = p.data.name;
        if( p.data.isInterface ){            
            label = "<<interface>>\n" + label;
            p.nameOffsetY = 10;
        }
        
        var t = this.paper.text(bb.x, bb.y, label).attr(p.font || {}),
        tbb = t.getBBox();
        t.translate(bb.x - tbb.x + p.nameOffsetX, bb.y - tbb.y + p.nameOffsetY);
        return t;
       
    },
       
    update: function(){
       
        this.inner[0].remove();	// label
        this.inner[0] = this.getLabelElement();
       
    }
       
       
       
});*/
   
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    

})(this);	// END CLOSURE

