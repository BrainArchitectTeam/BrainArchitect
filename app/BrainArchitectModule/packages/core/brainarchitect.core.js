/**
 * Direct Inheritance (ThinWire Ajax Framework) 
 * @url http://ajaxpatterns.org/Javascript_Inheritance
 * @copyright Ajax Patterns
 */

function Class(){}
function Class() { }
Class.prototype.construct = function() {};
Class.extend = function(def) {
    var classDef = function() {
        if (arguments[0] !== Class) {
            this.construct.apply(this, arguments);
        }
    };
 
    var proto = new this(Class);
    var superClass = this.prototype;
 
    for (var n in def) {
        var item = def[n];                      
        if (item instanceof Function) item.$ = superClass;
        proto[n] = item;
    }
 
    classDef.prototype = proto;
 
    //Give this new class the same static extend method    
    classDef.extend = this.extend;      
    return classDef;
};

/**
 *  Container object
 */

var Container = Class.extend({
    
    items: null,
    
    construct: function(){
        this.items = [];
    },
    
    add: function(name, item){
        this.items[name] = item;
    },
    
    get: function( name ){
        if( this.items[name] != null && this.items[name] != undefined ){
            return this.items[name];
        }
        
        return null;
    },
    
    remove: function(name){
        this.items[name] = null;
    },
    
    getAll: function(name){
        return this.items;
    },
    
    count: function(){
        return this.items.length;
    }
    
});

/**
 * Diagram - Brain Architect Diagram Class
 * @author  Franta Toman
 * 
 */

var Diagram = Class.extend({
    
    id: null,
    title: null,
    description: null,
    index: null,
    paper: null,
    content: null,
    type: null,
    width: null,
    height: null,
    
    construct: function(id, title, description, index, paper, content, type, width, height){
        this.id = id;
        this.title = title;
        this.description = description;
        this.index = index;
        this.paper = paper;
        this.content = content;
        this.type = type;
        this.width = width;
        this.height = height;
    },
    
    getContent:     function(){return this.content;},
    getDescription: function(){return this.description;},
    getId:          function(){return this.id;},
    getIndex:       function(){return this.index;},
    getPaper:       function(){return this.paper;},
    getWidth:       function(){return this.width;},
    getHeight:      function(){return this.height;},
    getTitle:       function(){return this.title;},
    getType:        function(){return this.type;},
    
    getJSON: function(){    
        
        var content = this.getContent();
        
        if( this.getPaper() != null ){
            content = Joint.dia.stringify( this.getPaper() );
        }
        
        return {
            id: this.getId(), 
            index: this.getIndex(), 
            title: this.getTitle(), 
            description: this.getDescription(), 
            content: content, 
            type: this.getType(),
            width: this.getWidth(),
            height: this.getHeight()
        };    
    },
    
    setContent:     function(content){this.content = content;},
    setDescription: function(description){this.description = description;}, 
    setId:          function(id){this.id = id;},    
    setIndex:       function(index){this.index = index;},
    setPaper:       function(paper){this.paper = paper;},
    setTitle:       function(title){this.title = title;},    
    setType:        function(type){this.type = type;},
    setWidth:       function(width){this.width = width;},
    setHeight:      function(height){this.height = height;}
    
    
});




/**
 * Brain Architect Project Library
 * Library use to manage project
 * @author  Franta Toman
 * 
 * TODO:
 *  - Create project
 *  - Open project
 *  - Save project
 *  - Close project
 *  - Add diagram
 *  - Open diagram
 *  - Save diagram
 *  - Close diagram
 * 
 */

var Project = Class.extend({
   
   
    id: null,
    title: null,
    description: null,
    diagrams: null,
    activeDiagram: null,
    
    construct: function(id, title, description){
        this.id = id;
        this.title = title;
        this.description = description;
        this.diagrams = new Container();
    },
    
   
    /************************ Project properties methods ***********************/
   
    
   
    /**
    *   Set project ID
    *   @param id integer
    */
    setId : function(id){
        this.id = id;
    },
    
    /**
    *   Set project title
    *   @param title string
    */
    setTitle: function(title){
        this.title = title;
    },
    
    /**
    *   Set project title
    *   @param description string
    */
    setDescription : function(description){
        this.description = description;
    },
    
    /**
     *  Return project id
     */
    getId : function(){
        return this.id;
    },
    
    /**
     * Returns project title
     */
    getTitle : function(){
        return this.title;
    },
   
    /**
    *   Returns project description
    */
    getDescription : function(){
        return this.description;
    },
    
    /**
     *  Returns if project is new
     */
    isNew : function(){        
        console.log( this.getId() );
        return this.getId() <= 0;
    },
   
    
    getProjectJSON : function(){
        return {
            title: this.getTitle(), 
            description: this.getDescription(), 
            id: this.getId()
        };
    },
   
    /* Diagrams */
   
    /**
    *   Insert new diagram
    */
    addDiagram : function(diagram){
        var index = this.diagrams.count();
        this.diagrams.add( index, diagram );
        diagram.setIndex(index);
        return index;
    },
   
    getDiagram: function(index){
        
        var diagram = this.diagrams.get( index );
        
        if( diagram instanceof Diagram ){
            return diagram;
        }
        
        return null;        
    },
    
    /**
     *  Remove diagram by index
     */
    removeDiagram : function(index){
        this.diagrams.remove(index);
    },
    
    clearDiagrams : function(){
        delete this.diagrams;
        this.diagrams = new Container();
    },
   
    /**
    *   Returns project diagrams
    */
    
    getDiagrams : function(){
        return this.diagrams;
    },
  
    getDiagramsJSON : function(){
        
        var diagramsCont = this.getDiagrams();
        var json = [];
        
        if(diagramsCont.count()){
            var diagrams = diagramsCont.getAll();
            for( var i in diagrams ){
                var diagram = diagrams[i];
                if( diagram instanceof Diagram ){
                    json[i] = diagram.getJSON() ;
                }
            }
        }
        
        return json;
        
    },
    
    getDiagramId : function(index){
        var diagram = this.getDiagram(index);
        if( diagram ){
            return diagram.getId();
        }        
        return null;
    },
   
    
    diagramExists : function(index){
        return this.getDiagram(index) instanceof Diagram ;
    }
   
});

var Widget = Class.extend({
    
    applicationReference: null,
    
    init: function(  ){
        console.error('Init method was not implemented');
    },
    
    create: function(){
        console.error( 'Create method was not implemented' );
    },
    
    open: function(){
        console.error( 'Open method was not implemented' );
    },
    
    show:  function(){
        console.error( 'Show method was not implemented' );
    },
    
    hide:  function(){
        console.error( 'Hide method was not implemented' );
    },
    
    update: function(){
        console.error( 'Update method was not implemented' );
    },
    
    setAppplicationReference: function(appRef){
        this.applicationReference = appRef;
    },
    
    getApplicationReference: function(appRef){
        return this.applicationReference;
    }
    
    
});

var Menu = Container.extend({
    
    appRef: null,
   
    construct: function(appRef){
        this.items = [];
        this.appRef = appRef;
    },
    
    add: function(name, item){
        if( item instanceof MenuItem || item instanceof MenuItemSeparator ){
            this.items[name] = item;
            
            if( item instanceof MenuItem ){
                item.setParent( this );
            }
        }
    },
   
    getAppRef: function(){
        return this.appRef;
    },
   
    render: function(){
        var html = $("<ul class='menu'></ul>");
        var elements = this.getAll();
       
        for( var i in elements ){
            if( elements[i] instanceof MenuItem || elements[i] instanceof MenuItemSeparator ){
                $(html).append(  elements[i].render()  );
            }
        }
       
        $("#top-panel-wrapper").append( html );
    }
    
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// MENU ITEM

var MenuItem = Class.extend({
   
    parent: null,
    title: null,
    label: null,
    onClick: null,
    icon: null,
    subItems: null,
    element: null,
   
    construct: function(name, title, label, icon){
        this.title = title;
        this.name = name;
        this.label = label;
        this.icon = icon;
        this.subItems = new Container;
    },
   
    getName: function(){
        return this.name;
    },
    getTitle: function(){
        return this.title;
    },
    getLabel: function(){
        return this.label;
    },
    
    getIcon: function(){
        return this.icon;
    },
   
    getAppRef: function(){
        
        if( this.parent != null ){
            if( this.parent.getAppRef ){
                return this.parent.getAppRef();
            }
        }
       
        return null;
    },
   
    getParent: function(){
        return this.parent;
    },
    setParent: function(parent){
        this.parent = parent;
    },
    
    setIcon: function(icon){
        this.icon = icon;
    },
    
    addSubItem: function( name, item ){
        item.setParent( this );
        this.subItems.add(name, item);
    },
    
    getSubItems: function(){
        return this.subItems.getAll();
    },
   
    bindOnClick: function( handle ){
        this.onClick = handle;
    },
    
    /**
     *  Enables item
     */
    
    enable: function(){
        $(this.element).removeClass('inactive');
        //$(this.element).data('disabled', false);
    },
    
    /**
     *  Disables item
     */
    
    disable: function(){
        $(this.element).addClass('inactive');
        //$(this.element).data('disabled', true);
    },
   
   
    /**
     *  Render item
     */
    render: function(){
       
        var elementWrapperHTML = $("<li>");
        var elementHTML = $("<a>" + this.getLabel() + "</a>");
        var subItems = this.getSubItems();
        var subItemsHTML = '';
       
        if(  this.getIcon() != null ){
            $(elementHTML).addClass('icon icon-centered icon-' + this.getIcon());
        }
        
        if( this.getTitle() != null){
            $(elementHTML).addClass('tip').attr('title', this.getTitle());
        }
       
        if( this.onClick != null ){
            
            $(elementHTML).bind('click', {
                reference: this
            }, function(e){
                
                if( $(this).hasClass('inactive') ){
                    return false;
                }
                
                var obj = e.data.reference;
                obj.onClick.call(obj);
                return false;
            });
        }
        
        
        
        if( subItems ){
            subItemsHTML = $("<ul>");
            
            for(var i in subItems){
                var subItem = subItems[i];
                $(subItemsHTML).append( subItem.render() );
            }
         
            $(subItemsHTML).hover(function(){
                if( $(this).hasClass('inactive') ){
                    return;
                }
                
                $(this).slideDown();
                
            }, function(){
               $(this).slideUp(); 
            });
         
        }        
        
        this.element = elementHTML;
       
        return $(elementWrapperHTML).append(elementHTML).append(subItemsHTML);
    }
   
});

/**
 * Menu item separator
 */
var MenuItemSeparator = Class.extend({
    render: function(){
        return $("<li class='separator'></li>");
    }
});


/**
 *  Diagram Manager Widget
 */
var DiagramManager = Widget.extend({
    
    diagramList : null,
    html: null,
    
    create: function(){
        
        var html = $('<div>').addClass('dock hidden').attr({id: 'diagrams-dock'});
        var title = $('<div>').text('Diagrams').addClass('header');
        var clear = $('<div>').addClass('clear');
        
        var content = $('<div>').addClass('content');
        this.diagramsList = $("<div>").attr('id', 'diagram-list').text('asd');
        
        $(content).append( this.diagramsList );
        
        $(html).append(title).append(clear).append(content).append(clear);
        
        $('#canvas').append(html);
        
        $(html).draggable({handle: '.header'});
        
        this.createContextMenu();
        this.update();
        
    },
    
    createContextMenu : function(){
        
        var prefix = "diagrams-list-context-menu";
        
        var htmlContextMenu = $("<div id='"+prefix+"'>").addClass('context-menu');
        var itemsHtml = $("<ul>");
        
        $(itemsHtml).append(
            $("<li>").attr('id', prefix + "-open").text('open')
        )
        .append(
            $("<li>").attr('id', prefix + "-save").text('save')
        )
        .append(
            $("<li>").attr('id', prefix + "-delete").text('delete')
        )
        .append(
            $("<li>").attr('id', prefix + "-properties").text('properties')
        );
        
        //console.log( htmlContextMenu );
        
        $(htmlContextMenu).append( itemsHtml );
        $( '#canvas' ).append(htmlContextMenu);
        
    },
    
    open: function(){
        console.error( 'Open method was not implemented' );
    },
    
    show:  function(){
        console.error( 'Show method was not implemented' );
    },
    
    hide:  function(){
        console.error( 'Hide method was not implemented' );
    },
    
    update: function(){
        
        var app = this.getApplicationReference();
        
        if(app.getState() > ApplicationState.CLOSE){
            $(this.html).show();
        }else{
            $(this.html).hide();
        }
        
        $(this.diagramsList).empty();                                            // empty content of diagram list
        
        var diagrams = null;                                     // get all diagrams of project
        
        var counter = 0;                                                        // counter - store count of diagrams
        
        if(app != null){
            
            var project = app.getProject();
            
            if( project != null ){
        
                var count = project.getDiagrams().count();

                if( count){
                    diagrams = project.getDiagrams().getAll();
                    for(var i in diagrams)                                                  // foreach diagram
                    {            
                        if(diagrams[i] instanceof Diagram){          // which is exists (it is not null - deleted diagrams)                

                            $("#diagram-list").append("<div class='item"+( diagrams[i].getId() ? '' : ' red' )+"' data-index='"+i+"'>"+diagrams[i].getTitle() + "</div>");    // append diagram to list
                            counter++;                                                      // counter up
                        }
                    }
                }
            }
        }
        
        if( !counter ){                                                         // if counter is equals to zero
            $("#diagram-list").html('<div>No diagrams created ...</div>');      // show info
        }
        
        this.updateContextMenu();
        
    },
    
    updateContextMenu: function(){
        
        var prefix = "diagrams-list-context-menu";
        
        $( "#diagram-list .item" ) .contextMenu( prefix , {
            
            bindings:{
                
                /**
                 *  Open diagram
                 */
                "diagrams-list-context-menu-open" : function(e){                    
                    var index = $(e).data('index');                             // get diagram index             
                    this.App.openDiagram(index);
                },
                
                /**
                 *  Save diagram contents
                 */
                "diagrams-list-context-menu-save": function(e){
                    var index = $(e).data('index');                             // get index of diagram
                    //this.App.storeDiagramData(index);                              // copy edited data into diagram
                    this.App.saveDiagram(index);                                   // save diagram
                },
                
                /**
                 * Opens dialog of delete selected diagram 
                 */
                
                "diagrams-list-context-menu-delete": function(e){   
                    var dialog = this.App.getDialog( 'deleteDiagram' );
                    dialog.open();
                    dialog.setOptions( {diagramIndex : $(e).data('index')} );                                              // open dialog
                },
                
                /**
                 *  Opens dialog contains form to edit diagram settings
                 */
                
                "diagrams-list-context-menu-properties": function(e){
                    
                    
                    var app = this.App;
                    var diagram = app.getProject().getDiagram( $(e).data('index') );
                    var dialog = app.getDialog( 'editDiagramProperties' );


                    if( diagram instanceof Diagram ){
                        
                        dialog.open();
                        dialog.setOptions({diagramIndex: diagram.getIndex()});

                        var form = dialog.getOption('form');

                        form.setValues({
                            title: diagram.getTitle(),
                            description: diagram.getDescription(),
                            width: diagram.getWidth(),
                            height: diagram.getHeight()
                        });

                    }
                    
                    
                }
                
            },
            
            itemStyle: {
                fontSize: '11px',
                textShadow: 'none'
            }
        });
        
    }
    
    
});

// Toolbar widget