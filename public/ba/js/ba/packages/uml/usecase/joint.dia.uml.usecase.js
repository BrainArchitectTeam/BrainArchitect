(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element,
     point = Joint.point;

/**
 * @name Joint.dia.usecase
 * @namespace Holds functionality related to USE CASE diagrams.
 */
var usecase = Joint.dia.usecase = {};


Joint.arrows.aggregation = function(size){
    return {
        path: ["M","7","0","L","0","5","L","-7","0", "L", "0", "-5", "z"],
        dx: 9,
        dy: 9,
        attrs: {
            stroke: "black",
            "stroke-width": 2.0,
            fill: "black"
        }
    };
};

usecase.aggregationArrow = {
  endArrow: {type: "aggregation"},
  startArrow: {type: "none"},
  attrs: {"stroke-dasharray": "none"}
};

usecase.dependencyArrow = {
  endArrow: {type: "basic", size: 5},
  startArrow: {type: "none"},
  attrs: {"stroke-dasharray": "none"}
};

usecase.generalizationArrow = {
  endArrow: {type: "basic", size: 10, attrs: {fill: "white"}},
  startArrow: {type: "none"},
  attrs: {"stroke-dasharray": "none"}
};

usecase.arrow = {
    startArrow: {type: "none"},
    endArrow: {type: "basic", size: 5},
    attrs: {"stroke-dasharray": "none"}
};

// -----------------------------------------------------------------------------
// USECASE DIALOGS

    var useCaseUseCaseEditForm = new BAForm('use-case-use-case-edit');
    useCaseUseCaseEditForm.addText('label', 'Label');

    var useCaseUseCaseEditDialog = new baDialog('use-case-use-case-edit', 'Edit use case', useCaseUseCaseEditForm.render(), {
        modal: true,        
        form: useCaseUseCaseEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                var values = form.getValues();
                
                reference.setLabel( values.label );
                reference.update();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });
    
    var useCaseActorEditForm = new BAForm('use-case-actor-edit');
    useCaseActorEditForm.addText('title', 'Title');

    var useCaseActorEditDialog = new baDialog('use-case-actor-edit', 'Edit actor', useCaseActorEditForm.render(), {
        modal: true,        
        form: useCaseActorEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                var values = form.getValues();
                
                reference.setLabel( values.title );
                reference.update();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/*
 USE CASE - Usecase
 */
usecase.Usecase = Element.extend({
    object: "Usecase",
    module: "usecase",
    
    init: function(properties){
        
    var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: {fill:"0-#ffe-#eed"},
            label: '',
            labelOffsetX: 10,
            labelOffsetY: 10
            
        });
    // wrapper
    this.setWrapper(w = this.paper.ellipse(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
    
    
    // set edit dialog
    useCaseUseCaseEditDialog.create();
    
    this.setDblClickCallback( function(reference){ 
        var form = useCaseUseCaseEditDialog.getOption('form');        
        form.setValues({label: reference.getLabel()});
        useCaseUseCaseEditDialog.setOptions({reference: reference});
        useCaseUseCaseEditDialog.open();        
    } );    
    
    
    // inner
    this.addInner(this.getLabelElement());
    },
    // Returns minimal size of Element. Used for resizing. (Opi)
    getMinSize: function(){
        // label
        var w = this.inner[0].getBBox()["width"] + 2*this.properties.labelOffsetX;
        var h = this.inner[0].getBBox()["height"] + this.properties.labelOffsetY;

        return [w, h];
    },
    getLabelElement: function(){
        var
        p = this.properties,
        bb = this.wrapper.getBBox(),
        t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
        //t = this.paper.text(bb.x, bb.y, p.label).attr({text-anchor: "middle"}),
        tbb = t.getBBox();
        t.translate(bb.width/2 - tbb.width/2 + bb.x - tbb.x, bb.height/2 - tbb.height/2 + bb.y - tbb.y);
        return t;
    },
    zoom: function(){
        this.update();
    },
    
    
    getLabel: function(){
        return this.properties.label;
    },
    
    setLabel: function(label){
        this.properties.label = label;
    },
    
    update: function(){
        this.inner[0].remove(); // label
        this.inner[0] = this.getLabelElement();
    }
    
    
});


/*
 USE CASE Actor
 */
usecase.Actor = Element.extend({
    object: "Actor",
    module: "usecase",
    init: function(properties){
    var p = Joint.DeepSupplement(this.properties, properties, {
            //attrs: { fill: 'none', stroke: 'none' },
            attrs: {stroke: 'none', fill: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sLFxYyI1mP4roAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==')"},
            label: '',
            labelOffsetX: 10,
            labelOffsetY: 10
        });
    // wrapper
    this.setWrapper(w = this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
        
    // set double click handle to open edit window
    useCaseActorEditDialog.create();
    
    this.setDblClickCallback( function(reference){ 
        var form = useCaseActorEditDialog.getOption('form');        
        form.setValues({title: reference.getLabel()});
        useCaseActorEditDialog.setOptions({reference: reference});
        useCaseActorEditDialog.open();        
    } );    
        
    // inner
    this.addInner(this.getBodyElement());
    this.addInner(this.getHeadElement());
    this.addInner(this.getLabelElement());
    },
    // Returns minimal size of Element. Used for resizing. (Opi)
    getMinSize: function(){
        // label
        var w = this.inner[2].getBBox()["width"] + 2*this.properties.labelOffsetX;
        var h = 60+this.inner[2].getBBox()["height"] + this.properties.labelOffsetY;

        return [w, h];
    },
    getLabelElement: function(){
        var
        p = this.properties,
        bb = this.wrapper.getBBox(),
        t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
        tbb = t.getBBox();
        t.translate(bb.width/2 - tbb.width/2 + bb.x - tbb.x, bb.height + bb.y - tbb.height - tbb.y);
        return t;
    },
    getHeadElement: function(){
        var bb = this.wrapper.getBBox(), p = this.properties;
        return this.paper.circle(bb.x+bb.width/2, bb.y+bb.height/4, Math.min(bb.width/4,bb.height/4)).attr({fill:"0-#ffe-#eed"});
    },
    getBodyElement: function(){
        var bb = this.wrapper.getBBox(), p = this.properties;
        return this.paper.path(["M",bb.x+bb.width/10,bb.y+bb.height/2.2, /*"L",bb.x+bb.width/2,bb.y+bb.height/2.4,*/ "L",bb.x+bb.width-bb.width/10,bb.y+bb.height/2.2, "M",bb.x+bb.width/5,bb.y+bb.height/1.2, "L",bb.x+bb.width/2,bb.y+bb.height/1.6, "L",bb.x+bb.width-bb.width/5,bb.y+bb.height/1.2, "M",bb.x+bb.width/2,bb.y+bb.height/1.6,,bb.x+bb.width/2, "L",bb.x+bb.width/2,bb.y+bb.height/3.5].join(" "));
    },
    
    zoom: function(){
        this.update();
    },
    
    getLabel: function(){
        return this.properties.label;
    },
    
    setLabel: function(label){
        this.properties.label = label;
    },
    
    update: function(){
        this.inner[0].remove(); // body
        this.inner[1].remove(); // head
        this.inner[2].remove(); // label
        this.inner[0] = this.getBodyElement();
        this.inner[1] = this.getHeadElement();
        this.inner[2] = this.getLabelElement();
    }
    
});


})(this);   // END CLOSURE