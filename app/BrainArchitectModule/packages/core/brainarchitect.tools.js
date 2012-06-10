

/**
     * BAConnector (Brain Architect Connection Editor)
     * 
     * Is a singleton object used to manipulate with diagram connections. 
     * It provides: 
     *  - set name, stereotype of connections
     *  - source entity connection settings
     *      - name
     *      - role
     *      - muliplicity
     *  - target entity connection settings
     *      - name
     *      - role
     *      - multiplicity
     *      
     */ 
var BAConnector = {
        
    dialog: null,               // store dialog of editor
    reference: null,            // store reference to connection
        
    /**
         *  Sets reference by argument
         *  @param reference
         */
    setReference: function(reference){
        this.reference = reference;  
    },
        
    /**
         *  Returns reference         
         */
    getReference: function(){
        return this.reference;
    },
        
    /**
         *  Sets reference to null
         */
    clearReference: function(){
        this.reference = null;
    },
        
    setReferenceData: function(values){
        var reference = this.getReference();
            
        if( reference != null ){          
            reference.setName( values.general.name );
            reference.setStereotype( values.general.stereotype );                                                                
            reference.setSourceData( values.source );
            reference.setTargetData( values.target );                
        }
            
    },
        
    /**
         *  Open dialog
         */
    open: function(){
            
        if( this.getReference() == null ){
            return;
        }
            
        var reference = this.getReference();
            
        var defaults = {
                
            general: {
                name: reference.getName(),
                stereotype: reference.getStereotype()
            },
                
            source: reference.getSourceData(),
            target: reference.getTargetData()                
                
        };
            
            
        if( this.dialog == null ){    
                
            var editForm = this.getEditForm();
                
            this.dialog = new Dialog('connection-editor', 'connection settings', editForm.render(), {
                modal: true,
                form: editForm,
                buttons: {
                    "OK": function(){
                            
                        var form = $(this).dialog('option', 'form');                                
                        var values = form.getValues();
                                
                        BAConnector.setReferenceData(values); 

                        $(this).dialog('close');
                    },
                    "Apply": function(){
                            

                        var form = $(this).dialog('option', 'form');                                
                        var values = form.getValues();
                                
                        BAConnector.setReferenceData(values);
   
                            
                    },
                    "Cancel": function(){
                        $(this).dialog('close');
                    }                    
                },
                    
                close: function(){
                        
                    var form = $(this).dialog('option', 'form');                                
                    form.resetValues();
                        
                    BAConnector.clearReference();
                }
                    
            });
                               
        }
            
        this.dialog.open();
            
        var form = this.dialog.getOption('form'); 
        form.setValues( defaults );
            
    },
        
    /**
         *  Returns edit form
         */
        
    getEditForm: function(){
        var form = new BAForm('connection-editor-form');
        var tabGeneral = form.addTab('general', 'General');
            
        // set types off connection
            
        var tabSource = form.addTab('source', 'Source');
        var tabTarget = form.addTab('target', 'Target');
            
        tabGeneral.addText('name', 'Name');
        tabGeneral.addText('stereotype', 'Stereotype');
            
        tabSource.addText('role', 'Role');
        tabSource.addText('multiplicity', 'Multiplicity');
            
        tabTarget.addText('role', 'Role');
        tabTarget.addText('multiplicity', 'Multiplicity');            
            
        return form;
    }
        
};
   
   
/**
     *  Brain Architect Type Selector
     *
     */
var BAConnectionTypeSelector = {
        
    modules: [],
    name: 'ba-connection-type-selector',
        
    getName: function(){
        return this.name;
    },
        
    addModule: function(name, connectionTypes){
        if( this.getModule( name ) ){
            console.error("Connections settings of " + name + " module has been already exists ...");
            return;
        }
            
        this.modules[name] = connectionTypes;
    },
        
    /**
         *  Returns modules connection informations by specified name
         *  @param name string
         */
    getModule: function(name){
            
        if( this.modules[name] != undefined && this.modules[name] != null ){
            return this.modules[name];
        }
            
        return null;
    },
        
    getModules: function(){
        return this.modules;
    },
        
    setActiveModule: function(name){
            
    },
        
    show: function(options){
            
        var html = $("#" + this.getName() );
            
        if( !html.length ){
                
            html = $("<select id='"+this.getName()+"'></select>").css({
                position: 'absolute', 
                fontSize: '11px', 
                border: '1px solid #000'
            });                       
                
            // assign module groups
            var modules = this.getModules();
            for( var i in modules ){
                var module = modules[i];                                    // get module                    
                if( module != null && module != undefined ){                // if module is not undefined
                    var group = $("<optgroup label='"+i+"'></optgroup>");
                        
                    for( var j in module ){                                 // iterate over module connection types
                        var type = module[j];      
                        var typeHtml = $("<option>").text(type.title).val( i + "-" + j);
                        $(group).append(typeHtml);
                    }
                        
                    $(html).append(group);
                }                    
            }
                
            $("#papers-wrapper").append(html);
                
        }
            
        console.log($(document));
            
        $( html ).css({
            top: (options.py + 41)+'px', 
            left: (options.px + 43 )+'px'
        });            
        $( html ).show();
            
    },
        
    hide: function(){
        $( this.getHtml() ).hide();
    },
        
    getHtml: function(){
        return $("#" + this.getName() );
    },
        
    getSelectedValue: function(){
        return $(this.getHtml()).val();
    },
        
    getSelectedType: function(){
            
        var currentSelected = this.getSelectedValue().split('-');
        var module = this.getModule(currentSelected[0]);
            
        if( module != null && module != undefined ){
            var type = module[currentSelected[1]];
                
            if( type != undefined && type != null ){
                return type;
            }                
        }
            
        return null;
    }


};


/**
 * Brain Architect Diagrams Menu Render
 */

function BAMenuDiagramsRender(){
  
    this.render = function(items){
  
        var html = $("<ul>");

        var registeredItems = items;

        for(var i in registeredItems){
            var item = registeredItems[i];

            if( item != null && item != undefined ){
                var itemHtml = $("<li>");
                $(itemHtml).append( $("<a>").text(item.title) ).data({
                    type: item.type
                    }).addClass('item system');
                html.append(itemHtml);
            }
        }

        $("#main-menu #main-menu-diagram-add").append(html);
    }
    
}

/**
 * Brain Architect Diagrams Exporters Menu Render
 */

function BAMenuDiagramExportersRender(){
  
    this.render = function(items){
  
        var html = $("<ul>");

        var registeredItems = items;

        for(var i in registeredItems){
            var item = registeredItems[i];

            if( item != null && item != undefined ){
                var itemHtml = $("<li>");
                $(itemHtml).append( $("<a>").text(item.title) ).data({
                    type: item.type
                    }).addClass('item system');
                html.append(itemHtml);
            }
        }

        $("#main-menu #diagram-exporters").append(html);
    }
    
}

/**
 * Brain Architect Diagrams Importers  Menu Render
 */

function BAMenuDiagramImportersRender(){
  
    this.render = function(items){
  
        var html = $("<ul>");

        var registeredItems = items;

        for(var i in registeredItems){
            var item = registeredItems[i];

            if( item != null && item != undefined ){
                var itemHtml = $("<li>");
                $(itemHtml).append( $("<a>").text(item.title) ).data({
                    type: item.type
                    }).addClass('item system');
                html.append(itemHtml);
            }
        }

        $("#main-menu #main-menu-diagram-add").append(html);
    }
    
}

/**
 * Brain Architect Project Exporters  Menu Render
 */

function BAMenuProjectExportersRender(){
  
    this.render = function(items){
  
        var html = $("<ul>");

        var registeredItems = items;

        for(var i in registeredItems){
            var item = registeredItems[i];

            if( item != null && item != undefined ){
                var itemHtml = $("<li>");
                $(itemHtml).append( $("<a>").text(item.title) ).data({
                    type: item.type
                    }).addClass('item system');
                html.append(itemHtml);
            }
        }

        $("#main-menu #main-menu-diagram-add").append(html);
    }
    
}

/**
 * Brain Architect Project Importers Menu Render
 */

function BAMenuProjectImportersRender(){
  
    this.render = function(items){
  
        var html = $("<ul>");

        var registeredItems = items;

        for(var i in registeredItems){
            var item = registeredItems[i];

            if( item != null && item != undefined ){
                var itemHtml = $("<li>");
                $(itemHtml).append( $("<a>").text(item.title) ).data({
                    type: item.type
                    }).addClass('item system');
                html.append(itemHtml);
            }
        }

        $("#main-menu #main-menu-diagram-add").append(html);
    }
    
}


/* HELPERS */


/**
 * Returns [x, y] point to set new element into diagram
 */
function getCreatePosition(){
    
    var currentPaper = Joint.paper();
    
    var x = Math.floor(Math.random() * ( currentPaper.width/4 - (currentPaper.width/4) * 3 +1)) + (currentPaper.width/4) * 3;
    var y = Math.floor(Math.random() * ( currentPaper.height/4 - (currentPaper.height/4) * 3 +1)) + (currentPaper.height/4) * 3;
    
    return {x: x, y: y};
};


