

/**
 * @name Dialog
 * @namespace Dynamic dialogs
 * @dependency jQuery, jQuery UI
 */

var Dialog = Class.extend({
    
    name: '',
    title : '',
    content: '',
    properties: null,
    applicationReference: null,
    dialog: null,
    onOpen: null,
    elementProperties: null,
    
    construct: function( name, title, content, properties ){
        this.name = name;
        this.title = title;
        this.content = content;
        this.properties = properties || {};
        this.properties.autoOpen = false;
    },
    
    setApplicationReference : function(applicationReference){
        this.applicationReference = applicationReference;
    },
    
    getApplicationReference :  function(){
        return this.applicationReference;
    },
    
    getTitle: function(){return this.title},
    
    getName: function(){
        return this.name;
    },
    getContent: function(){
        return this.content;
    },
    getProperties: function(){
        return this.properties;
    },
    getDialog: function(){
        return this.dialog;
    },
    
    
    /**
     *  Returns dialog option
     */
    getOption : function(option){
        return $(this.getDialog()).dialog('option', option);
    },
    
    setName: function(name){
        this.name = name;
    },
    setContent: function(content){
        this.content = content;
    },
    setOptions : function(options){
        $(this.getDialog()).dialog('option', options);
    },
    setOnOpen: function( onOpen ){
        this.onOpen = onOpen;
    },
    
    
    create : function(targetElement){
        var html = $("<div>").attr( {title: this.getTitle()} ).addClass('dialog');            // creates new element and set properties        
        $(html).html( this.getContent() );                      // sets content of dialog
        
        // if target entity is not specified, append new html into body element
        if( typeof(targetElement) == 'undefined' || targetElement == null ){
            targetElement = 'body';                             
        }
        
        $(targetElement).append(html);                          // append dialog html into target element        
        this.dialog = $(html).dialog(this.properties);        
        
    },
    
    open: function(){
        
        //console.log('WANT TO OPEN DIALOG');
        
        if(!this.isCreated()){
            this.create();
            //console.log(' it is not created ');
        }
        
        if( typeof(this.onOpen) == 'function' ){
            this.onOpen(this);
        }   
        
        this.setOptions({
            model: this
        });
            
        $(this.getDialog()).dialog('open');                 // call jQuery UI dialog to open
    },
    
    close: function(){
        if( this.isCreated() ){
            this.getDialog().dialog('close');
        }
    },
    
    destroy : function(){  },
    
    isCreated: function(){
        return !this.getDialog() == null;
    }
    
    
});

/**
 *  Base Control of Form
 */

var ControlFormat = {  
  INTEGER: 'custom[integer]'
};

var Control = Class.extend({
    
    name: null,
    label: null, 
    value: null,
    hideLabel: false,
    required: false,
    format: null,
    
    construct: function( name, label, value ){
        this.name = name;
        this.label = label;
        this.value = value;
        this.hideLabel = false;
        this.format = [];
        this.required = false;
    },
    
    isLabelHide: function(){
        return this.hideLabel;
    },
    
    getName : function(){
        return this.name;
    },
    getLabel : function(){
        return this.label;
    },
    getValue : function(){
        return this.value;
    },
    
    setName : function(name) {
        this.name = name;
    },
    setLabel : function(label) {
        this.label = label;
    },
    setValue : function(value) {
        this.value = value;
    },
    
    // validation fields
    isRequired: function(){
        return this.required;
    },
    
    setRequired: function(){
        this.required = true;
        return this;
    },
    
    getValidationClass : function(){
     
        var classes = '';
        
        if( this.isRequired() ){
            classes = classes.concat(['required']);
        }
        
        if( this.format.length ){
                classes = classes.concat( ',', this.format.join(',') );
        }
        
        
        if( classes.length > 0 ){
            classes = "validate[" + classes + "]";
        }
     
        return classes;
    },
    
    setFormat : function( format ){
        this.format.push( format );
        return this;
    },
    
    
    beforeRender: function(){},
    renderControl: function(){
        return ''
    },
    renderLabel: function(){  
    
        if( this.isLabelHide() ){
            return '';
        }
    
        var labelHtml = $('<label for='+this.getName()+'>').text( this.getLabel() );  
        
        return labelHtml;
    }
    
});

var InputControl = Control.extend({
    
    type: null,
    
    getValue: function(){
        return $("#"+this.getName()).val();
    },
    setValue: function(value){
        $('#'+this.getName()).val(value);
    },
    
    getType: function(){
        return this.type;
    },
    
    renderControl: function(){
        this.beforeRender();
        var html = $('<input>').attr({
            type: this.getType(), 
            id: this.getName(), 
            name: this.getName(), 
            placeholder: this.getLabel(), 
            value: this.getValue()
        });    
        

        $(html).addClass(this.getValidationClass());
        
        return html;
    }
    
});

var TextControl = InputControl.extend({
    type: 'text'
});

var CheckboxControl = InputControl.extend({
    
    type: 'checkbox',
    
    
    getValue : function(){
        return $("#" + this.getName()).attr('checked');
    },
    
    setValue : function(value){
        $("#"+this.getName()).attr("checked", value);
    }
    
});

/**
 *  Select Control
 */

var SelectControl = Control.extend({
    
    options: null,
    
    construct: function(name, label, options){
        this.name = name;
        this.label = label;
        this.options = options;
        this.required = false;
    },
    
    renderControl : function(){
        this.beforeRender();
        var html = $('<select>').attr({ 
            id: this.getName(), 
            name: this.getName(), 
            value: this.getValue()
        });

        if(this.getOptions()){        
            var options = this.getOptions();
            for(var i in options){
                $(html).append( $('<option>').attr({
                    value: i
                }).text(options[i]) );
            }
        }
        
        $(html).addClass(this.getValidationClass());

        return html;
    },
    
    getOptions : function(){
        return this.options;
    },
    
    getValue : function(){return $("#"+this.getName()).val();}
    
});

/**
 *  Textarea Control
 */

TextareaControl = Control.extend({
    
    renderControl : function(){
     
        var html = $('<textarea>').attr({
            id: this.getName(), 
            name: this.getName(), 
            placeholder: this.getLabel(), 
            value: this.getValue()
        }); 
     
        $(html).addClass(this.getValidationClass());
     
        return html;
    },
    
    setValue: function(value){$("#"+this.getName()).val(value);},
    getValue: function(){return $("#"+this.getName()).val();}
    
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/**
 *  Combine control
 */

function CombineList(name, cols){
    
    this.name = name;
    this.elements = [];
    this.cols = cols || {};
    this.items = [];
    
    this.getName = function(){
        return this.name;
    }
    this.getCols = function(){
        return this.cols;
    }
    this.getItems = function(){
        return this.items;
    }
    
    this.renderControl = function(){
        var html = this.renderWrapper();   
        
        $(html).append(this.renderEditControls()).append( this.renderButtons() ) . append( this.renderList() ) ;
        
        return html;
    }
    
    /**
     *  Render combine list wrapper
     */
    this.renderWrapper = function(){
        return $("<div class='combine-list-wrapper'>").attr("id", this.getName());
    }
    
    this.renderButtons = function(){
        var buttonAdd = $("<button>add</button>");
        var buttonRemove = $("<button>delete</button>");
        var buttonEdit = $("<button>edit</button>");
        
        buttonAdd.data('ref', this);                
        buttonRemove.data('ref', this);                
        buttonEdit.data('ref', this);                
        
        $(buttonAdd).bind('click', this.buttonAddHandle);
        
        $(buttonRemove).bind('click', function(){
            var ref = $(this).data('ref');
            
            $( ref.getActiveItem() ).remove();
            return false;
        });
        
        $(buttonEdit).bind('click', function(){
            var ref = $(this).data('ref');
            var activeItem = ref.getActiveItem();
            
            if( activeItem.length == 1 ){
                
                var controls = ref.getControls();
                var data = [];
                
                for(var i in controls){
                    data[i] = controls[i].getValue();
                }
                
                $(activeItem).data(data);
                
                // set view datas
                $($(activeItem).find('td')).remove();
                
                var cols = ref.getCols();
                for( var j in cols ){
                    var td = $("<td>");
                    $(td).text( data[j] );
                    $(activeItem).append( td );
                }
                
            }   
            
            return false;
        });
        
        var html = $("<div class='buttons'>").append(buttonAdd).append(buttonEdit).append(buttonRemove);
        
        return html;
    }
    
    this.renderEditControls = function(){
        var html = $("<div>").addClass("edit-controls");  
        var controls = this.getControls();
        
        for(var i in controls){
            var pair = $("<div class='pair'>");
            $(pair).append( controls[i].renderLabel() ) . append( controls[i].renderControl() );            
            $(html).append(pair);
        }
        
        return html;
    }
    
    this.renderList = function(){        
        return $("<table class='list'>").append(this.renderListHeader() ).append(this.renderListItems());        
    }
    
    this.renderListHeader = function(){                
        
        var row = $("<tr>");        
        var cols = this.getCols();
        
        for( var i in cols ){
            $(row).append( $("<th>").text( cols[i] ) );
        }
        
        return $("<thead>").append(row);
    }
    
    this.renderListItems = function(){
        return $("<tbody>");
    }
    
    this.addItem = function(item){
        
        console.log( item );
        
        var html = $("<tr>");       
        var cols = this.getCols();
        
        $(html).data(item);
        
        for( var i in cols ){
            var data = $("<td>");
            $(data).text( item[ i ] );
            $(html).append( data );
        }
        
        $(html).data('ref', this);
        
        $(html).bind('click', function(){  
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            var ref = $(this).data('ref');
            var data = $(this).data();
            var controls = ref.getControls();
            
            for(var i in controls){
                controls[i].setValue( data[i] );
            }
            
        });
        
        $("#"+this.getName()).find('table tbody').append( html );
    }
    
    this.clearList = function(){
        $("#"+this.getName()).find('table tbody tr').remove();
    }
    
    this.buttonAddHandle = function(e){
            
        var list = $(this).data('ref');
            
        var controls = list.getControls();
        var data = [];
            
        // console.log(controls);
            
        for( var i in controls ){            
            //console.log( controls[i].getValue() );            
            data[i] = controls[i].getValue();
            controls[i].setValue('');
        }
            
        list.addItem(data);
        
        $( list )
            
        return false;
        
    }
    
    this.getActiveItem = function(){
        return $("#"+this.getName()).find('table tbody tr.active');
    }
    
    this.unactive = function(){
        $("#"+this.getName()).find('table tbody tr').removeClass('active');
    }

    this.getValue = function(){
        var list = $($("#"+this.getName())).find('table tbody');
        var data = [];

        var items = $(list).children('tr');

        for( var i = 0; i < items.length; i++ ){
            var item = $(items).get(i);
            data.push( $(item).data() );
        }

        return data;
    }

}


/**
 *  Combine Control
 */
CombineControl = function(name){
    
    this.name = name;
    this.elements = [];
    
    this.renderControl = function(){
    
        var controls = this.getControls();
        var html = $('<div>');
        
        var addButton = $(html).append( $('<button>').text('add') ).bind('click', function(e){            
            var clone = $(this).siblings(".combine-line");
            
            return false;
        });

        var line = $('<div>').addClass('combine-line');

        for(var i in controls){            
            $(line).append( $( controls[i].renderControl() ) );
        }
        
        

        return $(html).append(line);
    }
    
    this.getName = function(){
        return this.name;
    };
    
    this.getValue = function(){
        
        console.log("COMBINE GET VALUES");
        
        var values = {};
        var controls = this.getControls();
        for( var i in controls){
            
            values[i] = $('#'+ controls[i].getName() ).val();
        }             
        return values;
    };
    
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

var ControlsContainer = Container.extend({
    
    name: null,
    
    construct : function(name){
        this.items = [];
        this.name = name;
    },
    
    addControl : function(name, element){
        return this.items[name] = element;
    },
    
    getControl : function(name){
        return this.items[name];
    },
    
    getControls : function(){
        return this.items;
    },
    
    /* factory */
    
    addText : function(name, label){
        return this.addControl(name, new TextControl(this.name+'_'+name, label));
    },
    
    addTextarea : function(name, label){
        return this.addControl(name, new TextareaControl( this.name+'_'+name, label ));
    },
    
    addCheckbox : function(name, label){
        return this.addControl(name, new CheckboxControl( this.name+'_'+name, label ));
    },
    
    addSelect : function(name, label, options){
        return this.addControl(name, new SelectControl( this.getName() + '_' + name, label, options));
    },
    
    addTab : function(name, label){
        return this.addControl(name, new Tab('tab_' + this.name+'_'+name, label));
    },
    
    addCombine : function(name, cols){
        return this.addControl(name, new CombineList(this.name+"_"+name, cols));
    }
    
});


/**
 *  Tab form
 */
var Tab = ControlsContainer .extend({
    
    name: null,
    label: null,
    
    construct: function(name, label){
        this.name = name;
        this.label = label;
        this.items = [];
    },
   
    
    getTitle : function(){
        return this.title
    },
    
    getName : function(){
        return this.name
    },
    
    setValue : function(values){
        var controls = this.getControls();
        
        for(var i in controls){
            if( controls[i] != null ){
                if( typeof(values[ i ]) != 'undefined' ){
                    controls[i].setValue( values[i] );
                }
            }
        }
        
    },
    
    getValue : function(){
        console.log('Return form Values!');
        var values = {};
        var controls = this.getControls();
        for( var i in controls){
            if( controls[i] instanceof CombineControl ){
                values[i] = controls[i].getValue();
            }else{
                console.log('Get value of ' + '#'+ controls[i].getName() );
                values[i] = $('#'+ controls[i].getName() ).val();
            }
        }             
        return values;
    },
    
    render : function(){
        var controls = this.getControls();
        var html = $('<div>').attr('id', this.getName()); 
        
        for(var i in controls ){
        
            if( controls[i] instanceof Tab ){
            
                if( controls[i] != null ){
                    
                    // if tabs doesnt exists, then we create them
                    if( $( html ). find( ' ul.tabs' ).length == 0 ){
                        $(html).prepend( $('<ul>').addClass('tabs') );
                    }
                    
                    // tab
                    $(html).find( 'ul.tabs' ).append( $('<li>').append( $("<a></a>").text( controls[i].getTitle() ).attr("href", '#' + controls[i].getName() ) ) );
                    
                    // add tab content                    
                    $(html).append( controls[i].render() );
                    
                    hasTabs = true;
                }
                
            }else if( controls[i] instanceof CombineList ){                
            
                var combineControl = $("<div>").append(controls[i].renderControl());
                $(html).append(combineControl);
                
            }else{

                var label = $('<div>').append( controls[i].renderLabel() ).addClass('label');
                var control = $('<div>').append(controls[i].renderControl() ).addClass('control');

                var pair = $('<div>').addClass('pair').append(label).append(control);
                $(html).append(pair);
            }
        }       
        
        return html;
    }
});



var BAForm = ControlsContainer.extend({   
    
    name: null,
    elements: null,
    
    getName : function(){
        return 'form_'+this.name
    },
    
    getValues : function(){
        
        
        console.log('Return form Values!');
        var values = {};
        var controls = this.getControls();
        for( var i in controls){
            
            if( controls[i] instanceof Tab ){
                values[i] = controls[i].getValue();            
            }else if( controls[i] instanceof CombineControl ){
                values[i] = controls[i].getValue();
            }else{
                values[i] = $('#'+ controls[i].getName() ).val();
            }
            
        }             
        return values;
        
        
    },
    
    setValues : function(values){
        
        var controls = this.getControls();
        
        for(var i in controls){
            if( controls[i] != null ){
                if( typeof(values[ i ]) != 'undefined' ){
                    controls[i].setValue( values[i] );
                }
            }
        }
        
    },
    
    render : function(){
        
        var html = $('<form>').attr('id', 'form_'+this.name);        
        var controls = this.getControls();
        
        var hasTabs = false;
        
        for(var i in controls){
            
            if( controls[i] instanceof Tab ){
            
                if( controls[i] != null ){
                    
                    // if tabs doesnt exists, then we create them
                    if( $( html ). find( ' ul.tabs' ).length == 0 ){
                        $(html).prepend( $('<ul>').addClass('tabs') );
                    }
                    
                    // tab
                    $(html).find( 'ul.tabs' ).append( $('<li>').append( $("<a></a>").text( controls[i].getTitle() ).attr("href", '#' + controls[i].getName() ) ) );
                    
                    // add tab content                    
                    $(html).append( controls[i].render() );
                    
                    hasTabs = true;
                }
                
            }else if( controls[i] instanceof CombineList ){                
            
                var combineControl = $("<div>").append(controls[i].renderControl());
                $(html).append(combineControl);
                
            }else{

                var label = $('<div>').append(controls[i].renderLabel() ).addClass('label');
                var control = $('<div>').append(controls[i].renderControl() ).addClass('control');

                var pair = $('<div>').addClass('pair').append(label).append(control);
                $(html).append(pair);
            }
        }
        
        // validation
        $( html ).validationEngine();
        
        // tabs plugin
        if(hasTabs){
            $(html).tabs();
        }
        
        return html;
    },

    /**
     *  Reset form values
     */
    resetValues : function(){
        var controls = this.getControls();
        for(var i in controls){
            controls[i].setValue('');
        }
    },
    
    validate: function(){
        return $("#" + this.getName() ).validationEngine('validate');  
    },
    
    hideValidation: function(){
        $("#" + this.getName() ).validationEngine('hideAll');
    }

});


/**
 * Toolset - Brain Architect Toolset Class
 * @author  Franta Toman
 * 
 */

function Toolset(name, title){
    var properties = {
        name: name,                         // toolset name
        title: title,                       // toolset title
        elements: []
    };
    
    /**
     *  Set name of toolset
     */
    this.setName = function(name){
        properties.name = name;
    };
    
    /**
     *  Returns toolset name
     */
    this.getName = function(){
        return properties.name;
    };
    
    /**
     *  Set title of toolset
     */
    this.setTitle = function(title){
        properties.title = title;
    };
    
    /**
     *  Returns title of toolset
     */
    this.getTitle = function(){
        return properties.title;
    };
    
    /**
     *  Append element into toolset
     */
    this.addElementTool = function(element){
        properties.elements.push(element);
    } 
    
    /**
     *  Returns all elements tools
     */
    this.getElementsTools = function(){
        return properties.elements;
    }
    
}

/**
 * Toolbar - Brain Architect Toolbar Class
 * @author  Franta Toman
 * 
 */

var Toolbar = {
    
    settings: {
        selector: '',
        toolsets: []
    },
    
    /**
     *  Add toolset into toolbar
     */
    addToolset: function(toolset){
        this.settings.toolsets.push(toolset);
    },
    
    getToolset: function ( index ){
        return this.settings.toolsets[index];
    },
    
    getToolsetCount: function(){
        return this.settings.toolsets.length;
    }
    
};