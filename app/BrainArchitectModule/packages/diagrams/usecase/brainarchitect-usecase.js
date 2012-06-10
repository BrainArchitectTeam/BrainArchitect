(function(global){	// BEGIN CLOSURE

    var Joint = global.Joint, 
    Element = Joint.dia.Element, 
    point = Joint.point;
    
    var diagramTypeName = "usecasediagram";
    var usecase = Joint.dia[diagramTypeName] = {};
    
    
    /**
     * USE CASE DIAGRAM
     * Elements:
     *  - Actor
     *  - Use Case
     *  - Boundary     
     */
    
    // Edit Windows
    
    /**
     *  Use Case - Actor Edit Form Dialog
     */
    
    var useCaseActorEditForm = new BAForm(diagramTypeName + '-actor-edit');
    var useCaseActorGeneralTab = useCaseActorEditForm.addTab('general', 'General');
    useCaseActorGeneralTab.addText('name', 'Name');
    
    var useCaseActorEditDialog = new Dialog(diagramTypeName + '-actor-edit', 'Edit actor', useCaseActorEditForm.render(), {
        modal: true,        
        form: useCaseActorEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                var values = form.getValues();
                
                reference.setName(values.general.name);
                reference.update();
                
                form.resetValues();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });
    
    /**
     *  Use Case - Use Case Edit Form Dialog
     */
    
    var useCaseUseCaseEditForm = new BAForm( diagramTypeName + '-usecase-edit');
    var useCaseUseCaseGeneralTab = useCaseUseCaseEditForm.addTab('general', 'General');
    useCaseUseCaseGeneralTab.addText('name', 'Name');
    useCaseUseCaseGeneralTab.addText('stereotype', 'Stereotype');
    
    var useCaseUseCaseEditDialog = new Dialog( diagramTypeName + '-usecase-edit', 'Edit use case', useCaseUseCaseEditForm.render(), {
        modal: true,        
        form: useCaseUseCaseEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                var values = form.getValues();
                
                reference.setName( values.general.name );
                reference.setStereotype( values.general.stereotype );
                reference.update();
                
                console.log(values);
                
                form.resetValues();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });
    
    /**
     *  Use Case - Use Case Edit Form Dialog
     */
    
    var useCaseBoundaryEditForm = new BAForm( diagramTypeName + '-boundary-edit');
    var useCaseBoundaryGeneralTab = useCaseBoundaryEditForm.addTab('general', 'General');
    useCaseBoundaryGeneralTab.addText('name', 'Name');    
    
    var useCaseBoundaryEditDialog = new Dialog( diagramTypeName + '-boundary-edit', 'Edit boundary', useCaseBoundaryEditForm.render(), {
        modal: true,        
        form: useCaseBoundaryEditForm,
        buttons: {
            "Ok": function(){
                
                var reference = $(this).dialog('option', 'reference');
                var form = $(this).dialog('option', 'form');
                var values = form.getValues();
                
                reference.setName( values.general.name );
                reference.update();
                
                form.resetValues();
                
                $(this).dialog('close');
            },
            
            "Cancel": function(){
                $(this).dialog('close');
            }            
        }
    });
    
    // Elements
    
    /**
     *  BA UseCase Actor
     */
    usecase.Actor = Element.extend({
        
        object: "Actor",
        module: diagramTypeName,
        
        init: function(properties){
            
            var p = Joint.DeepSupplement(this.properties, properties, {
                
                attrs: {
                    stroke: 'none',
                    fill: '#ffffff'
                },
                label: '',
                labelOffsetX: 10,
                labelOffsetY: 10

            });
            
            this.setName('Actor');
            
            // wrapper
            this.setWrapper(w = this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));

            // set double click handle to open edit window
            useCaseActorEditDialog.create();

            this.setDblClickCallback( function(reference){ 
                var form = useCaseActorEditDialog.getOption('form');  
                
                form.setValues({
                    general: {
                        name: reference.properties.data.name
                    }
                });

                useCaseActorEditDialog.open();  

                useCaseActorEditDialog.setOptions({
                    reference: reference
                });
      
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
            t = this.paper.text(bb.x, bb.y, this.getName()).attr(p.labelAttrs || {}),
            tbb = t.getBBox();
            t.translate(bb.width/2 - tbb.width/2 + bb.x - tbb.x, bb.height + bb.y - tbb.height - tbb.y);
            return t;
        },
        getHeadElement: function(){
            var bb = this.wrapper.getBBox(), p = this.properties;
            return this.paper.circle(bb.x+bb.width/2, bb.y+bb.height/4, Math.min(bb.width/4,bb.height/4)).attr({
                fill:"0-#ced8e7-#dfe9f8"
            });
        },
        getBodyElement: function(){
            var bb = this.wrapper.getBBox(), p = this.properties;
            return this.paper.path(["M",bb.x+bb.width/10,bb.y+bb.height/2.2, /*"L",bb.x+bb.width/2,bb.y+bb.height/2.4,*/ "L",bb.x+bb.width-bb.width/10,bb.y+bb.height/2.2, "M",bb.x+bb.width/5,bb.y+bb.height/1.2, "L",bb.x+bb.width/2,bb.y+bb.height/1.6, "L",bb.x+bb.width-bb.width/5,bb.y+bb.height/1.2, "M",bb.x+bb.width/2,bb.y+bb.height/1.6,,bb.x+bb.width/2, "L",bb.x+bb.width/2,bb.y+bb.height/3.5].join(" "));
        },

        zoom: function(){
            this.update();
        },

        update: function(){
            
            this.inner[0].remove(); // body
            this.inner[1].remove(); // head
            this.inner[2].remove(); // label
            this.inner[0] = this.getBodyElement();
            this.inner[1] = this.getHeadElement();
            this.inner[2] = this.getLabelElement();
            
            for( var i = 0; i < 3; i++){
                this.inner[i].wholeShape = this;
                this.inner[i].parentElement = this;
                if (this.inner[i]._isElement) this.inner[i].properties.parent = this.euid();

                this.inner[i].dblclick = function(){ alert('test'); };

                if (!this.inner[i]._isElement && this._opt && this._opt.draggable){
                    this.inner[i].mousedown(this.dragger);
                    this.inner[i].node.style.cursor = "move";                    
                }
            }
            
        }

    });
    
    
    usecase.Boundary = Element.extend({
        object: 'Boundary',
        module: diagramTypeName,        
        depth: 1,
        
        init: function(properties){
            var p = Joint.DeepSupplement(this.properties, properties, {
                //attrs: { fill: 'none', stroke: 'none' },
                attrs: {
                    stroke: '#000000'
                },
                
                labelOffsetX: 10,
                labelOffsetY: 10,
                
                view:{
                    name: {
                        attrs: { fill: 'black' },
                        offsetY: 10
                    }
                }
                
            });
            
            this.setName('System');
  
            // wrapper
            this.setWrapper(w = this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
            this.addInner( this.getNameElement() );
            
            // boundary
            
            useCaseBoundaryEditDialog.create();

            this.setDblClickCallback( function(reference){ 
                
               // alert('test');
                
                var form = useCaseBoundaryEditDialog.getOption('form');  
                
                form.setValues({
                     general: reference.getName()
                });
                
                useCaseBoundaryEditDialog.open(); 
                
                useCaseBoundaryEditDialog.setOptions({
                    reference: reference
                });
                
            }); 

        },
        
        /**
         *  View
         */
        
        getNameElement: function(){
            
            var p = this.properties,
            bb = this.getBBox();

            var text = this.paper.text( bb.x + bb.width/2, bb.y + p.view.name.offsetY, this.getName() ).attr( p.view.name.attrs );

            return text;
        },       
        
        zoom: function(){
            this.update();
        },
        
        update: function(){
            
            
            this.inner[0].remove();
            this.inner[0] = this.getNameElement();  
           
           
            this.inner[0].wholeShape = this;
            this.inner[0].parentElement = this;
            if (this.inner[0]._isElement) this.inner[0].properties.parent = this.euid();
           
            if (!this.inner[0]._isElement && this._opt && this._opt.draggable){
                this.inner[0].mousedown(this.dragger);
                this.inner[0].node.style.cursor = "move";
            }
           
        }
        
    });
    
    usecase.UseCase = Element.extend({
        object: "UseCase",
        module: diagramTypeName,
    
        init: function(properties){
        
            var p = Joint.DeepSupplement(this.properties, properties, {
                attrs: {
                    fill: "0-#ced8e7-#dfe9f8"
                },
                label: '',
                labelOffsetX: 10,
                labelOffsetY: 10
            
            });
            
            this.setName('Use Case');
            
            // wrapper
            this.setWrapper(w = this.paper.ellipse(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));    
            // inner
            this.addInner(this.getLabelElement());
            
            // set double click handle to open edit window
            useCaseUseCaseEditDialog.create();

            this.setDblClickCallback( function(reference){ 
                
                var form = useCaseUseCaseEditDialog.getOption('form');        
                form.setValues({
                    general:{
                        name: reference.properties.data.name,
                        stereotype: reference.properties.data.stereotype
                    }
                });
                
                useCaseUseCaseEditDialog.open();
                
                useCaseUseCaseEditDialog.setOptions({
                    reference: reference
                });
        
            } ); 
            
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
            t = this.paper.text(bb.x, bb.y, p.data.name).attr(p.labelAttrs || {}),            
            //t = this.paper.text(bb.x, bb.y, p.label).attr({text-anchor: "middle"}),
            tbb = t.getBBox();
            t.translate(bb.width/2 - tbb.width/2 + bb.x - tbb.x, bb.height/2 - tbb.height/2 + bb.y - tbb.y);            
            return t;
        },
        zoom: function(){
            this.update();
        },
    
        update: function(){                        
            this.inner[0].remove(); // label
            this.inner[0] = this.getLabelElement();    
            
            
            this.inner[0].wholeShape = this;
            this.inner[0].parentElement = this;
            if (this.inner[0]._isElement) this.inner[0].properties.parent = this.euid();
           
            if (!this.inner[0]._isElement && this._opt && this._opt.draggable){
                this.inner[0].mousedown(this.dragger);
                this.inner[0].node.style.cursor = "move";
            }
            
        }
    
    
    });
    
    // Toolbar

    var useCaseToolset = new Toolset(diagramTypeName, 'Use Case');

    useCaseToolset.addElementTool({
        name: 'actor', 
        title:'Actor',     
        icon: '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', 
    
        callback: function(event){
            
            //if(BAPRO.getActiveDiagram() == null) return;
            
            var point = getCreatePosition();
            
            Joint.dia.usecasediagram.Actor.create({
                rect: {
                    x: point.x - 20, 
                    y: point.y - 40, 
                    width: 40, 
                    height: 80
                }                        
            });   
            
            event.preventDefault();
        }
    });

    useCaseToolset.addElementTool({
        name: 'boundary', 
        title:'Boundary', 
        icon: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABeSURBVHjaYvz//z8DJYCJgULAAmP8+fOHJKewsLAwohjw798/ylzw9+9fyg3g4eFhJEbTly9f/mMEIikuQFbLhBSIRBuArHbUAGrGArkGoCSkK1eukJw1GQc8OwMGABHpTNGc2pKzAAAAAElFTkSuQmCC', 
    
        callback: function(event){
            
            var point = getCreatePosition();
            
            item = Joint.dia.usecasediagram.Boundary.create({
                rect: {
                    x: point.x - 50, 
                    y: point.y - 100, 
                    width: 100, 
                    height: 200
                }
                
            });                       
            event.preventDefault();
        }
    });
    
    useCaseToolset.addElementTool({
        name: 'usecase', 
        title:'Use Case', 
        icon: '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',
    
        callback: function(event){
            
            //if(BAPRO.getActiveDiagram() == null) return;
            
            var point = getCreatePosition();
            
            item = Joint.dia.usecasediagram.UseCase.create({
                rect: {
                    x: point.x - 25, 
                    y: point.y - 15, 
                    width: 50, 
                    height: 30
                }
                
            });                       
            event.preventDefault();
        }
    });
    
    Toolbar.addToolset(useCaseToolset);
    
    
    ExtendRelationship = {
        attrs: {
            attrs:{
                'stroke-dasharray': '--'
            },
            endArrow: {                                 // end arrow type
                type: "simplearrow", 
                size: 4
            }
        },
        title: 'Extend',
        type: 'extend',
        onSet: function(ref){
            ref.setStereotype('extend');
        }
    };
    
    IncludeRelationship = {
        attrs: {
            attrs:{
                'stroke-dasharray': '--'
            },
            endArrow: {                                 // end arrow type
                type: "simplearrow", 
                size: 4
            }
        },
        title: 'Include',
        type: 'include',
        onSet: function(ref){
            ref.setStereotype('include');
        }
    };
    
    
    BAConnectionTypeSelector.addModule(diagramTypeName, { 
        'association': associationRelationship,
        'generalization': generalizationRelationship,
        'extend': ExtendRelationship,
        'include': IncludeRelationship
    });
    
    App.registerDiagramType(diagramTypeName, {title: 'Use Case', type: diagramTypeName});
    App.registerDiagramType(diagramTypeName + 'eee', {title: 'Use Case', type: diagramTypeName});
    
   
})(this);