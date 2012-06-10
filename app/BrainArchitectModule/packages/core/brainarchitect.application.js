
/* BACallback */
function BACallback( objRef, funcName, parameters ){
    
    this.objRef = objRef;
    this.funcName = funcName;
    this.parameters = parameters;
     
    return false;
}

BACallback.prototype.call = function(callback){
    var objRef = callback.data.objRef;
    objRef[ callback.data.funcName ].call(objRef, callback.data.parameters);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var ApplicationState = {
    CLOSE: 0,                               // no project is open
    OPEN: 1,                                // project is open
    EDITING: 2                             // project is open and any diagram is edited by user
};

Application = function(){
  
    var self = this;
    this.state = ApplicationState.CLOSE;
  
    this.menu = new Menu(this);
  
    this.settings = {
        serverURL: '/',
        exportURL: 'export',
        importURL: 'import',
        saveProjectURL: '',
        saveDiagramURL: '',
        saveDiagramSettingsURL: '',
        saveProjectSettingsURL: '',
        openProjectURL: '?do=openProject'
    };
  
    this.project = null;                           // store current project
    this.activeDiagram = null;
    this.ui = null;                                // store UI
  
    this.dialogs = [];                             // registered dialogs
    this.diagramTypes = [];                        // registered diagram types
    this.widgets = [];
    
    this.diagramExporters = [];                    // diagram exporters
    this.diagramImporters = [];                    // diagram importers
    this.projectExporters = [];                    // project exporters
    this.projectImporters = [];                    // project importers
  
    this.setUI = function(ui){
        this.ui = ui;
        this.ui.setProjectRef(this.project);
        this.ui.setAppRef(this);
    };
  
    this.getUI = function(){
        return this.ui;
    }
  
    /* tools */
  
    this.setConnectionEditor = function(connectionEditor){
        Joint.setConnectionEditor(connectionEditor);
    },
  
    this.setConnectionTypeSelector = function(connectionTypeSelector){
        Joint.setConnectionTypeSelector(connectionTypeSelector);
    }
  
  
    /**/
  
    this.run = function(){
        
        ////////////////////////////////////////////////////////////////////////
        // diagram types render
        
        //var packages = this.getPackage('diagramType');                          // get container registered of diagram types
        var diagramTypes = this.diagramTypes;
        var diagramsMenuItem = this.menu.get('creatediagram');                  // return create diagram menu item
        
        if( diagramsMenuItem instanceof MenuItem ){                           // if is instance of MenuItem
            
            for(var i in diagramTypes){                                         // iterate over registered diagram types
                var diagramType = diagramTypes[i];              
                var menuItem = new MenuItem( diagramType.type, diagramType.title, diagramType.title );      // new diagram type menu item
                
                menuItem.onClick = function(){
                    var appRef = this.getAppRef();
                    var dialog = appRef.getDialog('newDiagram');
                    dialog.open();
                    
                    dialog.setOptions({
                        diagramType: this.getName()
                    });
                    
                }
                
                diagramsMenuItem.addSubItem( diagramType.type, menuItem );                                    // insert it to the menu
            }
            
            
        }
        
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        
        ////////////////////////////////////////////////////////////////////////
        // Exporters
        var exportList = {exportdiagram : 'diagramExporters', exportproject : 'projectExporters'};
                                
        
        for(var j in exportList){
            var items = this[exportList[j]];
            
            if( items != undefined && items != null ){
                var EMenu = this.menu.get( j );
                for( var k in items ){
                    var item = items[k];
                    var EmenuItem = new MenuItem( k, item.label, item.title );
                    
                    EmenuItem.onClick = function(){
                        this.getAppRef().sendAjaxRequest('export', {name: this.getName()});
                    }

                    EMenu.addSubItem( k, EmenuItem );
                }
            }
            
        }
        
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        
        ////////////////////////////////////////////////////////////////////////
        // IMPORTERS
        var importList = {importdiagram : 'diagramImporters', importproject : 'projectImporters'};
        
        for(var j in importList){
            var items = this[importList[j]];
            
            if( items != undefined && items != null ){
                var IMenu = this.menu.get( j );
                for( var k in items ){
                    var item = items[k];
                    var ImenuItem = new MenuItem( k, item.label, item.title );
                    
                    ImenuItem.onClick = function(){
                        this.getAppRef().sendAjaxRequest('import', {name: this.getName()});
                    }
                    
                    IMenu.addSubItem( k, ImenuItem );
                }
            }
            
        }
        
        
        
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        
        // menu init
        this.menu.render();
        
        // user init interface
        this.ui.init();
        
        ////////////////////////////////////////////////////////////////////////
        // widgets
        
        for( var i in this.widgets ){            
            if( this.widgets[i] != null ){
                this.widgets[i].setAppplicationReference(this);
                this.widgets[i].create();
            }
        }
        
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        
    }
  
    //////////////////////////////////////////////////////////////////////////////
    // DIALOGS
  
    this.registerDialog = function(name, dialog){
        this.dialogs[name] = dialog;
        this.dialogs[name].setApplicationReference( this );
    };
  
    this.getDialog = function(name){

        if( this.dialogs[name] != undefined && this.dialogs[name] != null ){
            return this.dialogs[name];
        }
      
        return null;
    };
  
    this.openDialog = function(name){
  
        var dialog = self.getDialog(name);

        if( dialog != null ){
            dialog.open();
        }
  
        return;
    };
  
  
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
  
  
    //////////////////////////////////////////////////////////////////////////////
    // PROJECT METHODS
  
    this.createProject = function(title, description){
        this.project = new Project(-1, title, description);

        this.ui.setProjectRef(this.project);
        this.setState( ApplicationState.OPEN );
        this.ui.update();
    }
    
    this.openProject = function( id ){    
        this.sendAjaxRequest(this.settings.openProjectURL, {projectId: id});
        this.getUI().showProcessScreen(); 
    }
  
    this.closeProject = function(){
        this.project = null;
        this.ui.setProjectRef(null);
        this.setState(ApplicationState.CLOSE);
        this.ui.clearTabulators();
        this.ui.update();
    };
    
    this.saveProject = function(){
       
        var project = this.getProject();
           
        this.getUI().showProcessScreen();   
           
        if( project.isNew()){                                                  // if project is new                
            $.post(this.settings.serverURL + '?do=createProject', {              // try to create a new project
                title:project.getTitle(),                                     // get project title
                description:project.getDescription(),                         // get project description
                diagrams:project.getDiagramsJSON()                            // get diagrams JSON representation
            });                                
                
        }else{
            
            // store all diagrams data to save
            var diagrams = project.getDiagrams();                                 // get all diagrams
            for(var i in diagrams){                                             // for each diagram
                if( diagrams[i] != null && diagrams[i] instanceof Diagram ){    // if exists, is not null
                    if(this.ui.isDiagramOpen(i)){                                 // if diagram is open
                        this.ui.storeDiagramData(i);                              // store diagram data
                    }
                }
            }


            $.post( this.settings.serverURL +'?do=saveProject',{
                projectId: project.getId(),
                title:project.getTitle(),                                         // get project title
                description:project.getDescription(),                             // get project description
                diagrams: project.getDiagramsJSON()                                // get diagrams JSON representation
            });
            
        }
       
        
        this.ui.update();

    };
    
    this.getProject = function(){
        if( this.project instanceof Project ){
            return this.project;
        }
        
        return null;
    }
    
    this.isProjectOpen = function(){
        return this.getState() > ApplicationState.CLOSE;
    }
   
    
    //////////////////////////////////////////////////////////////////////////////
    // Diagrams
    
    this.addDiagram = function( diagram ){
        
        if( this.isProjectOpen() ){
            if( diagram instanceof Diagram ){
                var project = this.getProject();
                return project.addDiagram( diagram );
            }
        }
        
    };
    
    this.openDiagram = function(index){
        
        if( this.isProjectOpen() ){
           
            if( this.getProject().diagramExists( index ) ){
               
                var diagram = this.getProject().getDiagram(index);              // get diagram
                
                if( !this.ui.isOpenTabulator(index) ){
                    
                    this.ui.addTabulator( diagram.getIndex(), diagram.getTitle(), '', {
                        index: diagram.getIndex()
                    } );
                    
                    if( diagram.getPaper() == null ){
                        
                        diagram.setPaper( Joint.paper( "tab_" + index, diagram.getWidth(), diagram.getHeight() ) );   // set paper of diagram to draw
                        
                        if( diagram.getContent() != '' && diagram.getContent() != null ){
                            
                            this.setActiveDiagram(index);
                            
                            Joint.dia.parse( diagram.getContent() );
                        }
                        
                    }
                }
                
                this.setActiveDiagram(index);
                
                this.setState(ApplicationState.EDITING);
                this.update();
            }
           
            
           
        }
    }
    
    this.saveDiagram = function(index){
        
        if( this.isProjectOpen() ){
                    
            var diagram = this.project.getDiagram( index );

            if(  diagram instanceof Diagram ){
                
                if( this.getUI().isOpenTabulator( index ) ){
                    this.storeDiagramData(diagram);
                }
                
                var diagramJSON = diagram.getJSON();
                diagramJSON['projectId'] =  this.getProject().getId();
                
                $.post(BAEUI.getServerURL()+'?do=saveDiagram', diagramJSON); 

                this.getUI().showProcessScreen();
            }
            
        }    
        
    }
    
    this.saveDiagramSettings = function(index){
      
        var diagram = this.getProject().getDiagram(index);
      
      
        if( diagram instanceof Diagram ){
            $.post(this.settings.serverURL + '?do=saveDiagramSettings', {
                id: diagram.getId(),
                width: diagram.getWidth(),
                height: diagram.getHeight(),
                title: diagram.getTitle(),
                description: diagram.getDescription()
            });
            this.getUI().showProcessScreen();
        }
      
    };
    
    this.saveDiagrams = function(){
      
        var diagrams = this.getProject().getDiagrams();
        
        if( diagrams.count() ){
            
            diagrams = diagrams.getAll();
            for( var i in diagrams ){
                if( diagrams[i].getPaper() != null ){
                    this.storeDiagramData(diagrams[i]);
                }
            }
           
        }
      
    };
    
    this.storeDiagramData = function( diagram ){
        
        console.log(' Copy diagram data ');
        
        if( diagram instanceof Diagram ){
            Joint.dia.unselect();
            diagram.setContent( Joint.dia.stringify( diagram.getPaper() ) );
        }
        
    }
    
    this.closeDiagram = function(){
        
        if( this.isProjectOpen() ){
            
    }
        
    };
    
    this.removeDiagram = function(index){
    
        if( this.isProjectOpen() ){
            this.getProject().removeDiagram(index);
        }

    };
    
    this.setActiveDiagram = function(index){
        
        Joint.dia.unselect();
        
        var diagram = this.getProject().getDiagram(index);

        if( diagram instanceof Diagram ){
            this.activeDiagram = diagram;
            this.ui.setActiveTabulator( diagram.getIndex() );
            
            Joint.paper( diagram.getPaper() );
            
        }
        
    }
    
    this.getActiveDiagram = function(){
        return this.activeDiagram;
    }
    
    //////////////////////////////////////////////////////////////////////////////
    // Application states
    
    this.getState = function(){
        return this.state;
    }
    
    this.setState = function(state){
        this.state = state;
    },
    
    this.update = function(){
        var ui = this.getUI();
        if( ui != null ){
            ui.update();
        }
        
        for( var i in this.widgets ){
            if( this.widgets[i] != null ){
                this.widgets[i].update();
            }
        }
        
    },
    
    
    this.getSettings = function(){
        return this.settings;
    }
    
    //////////////////////////////////////////////////////////////////////////////
    // Diagrams types
    
    this.registerDiagramType = function(name, properties){
        this.diagramTypes[name] = properties;   
    }
    
    //////////////////////////////////////////////////////////////////////////////
    // Diagrams types
    
    this.registerDiagramExporter = function(name, label, title){
        this.diagramExporters[name] = {label: label, title: title, type: 'export'};
    }
    
    this.registerDiagramImporter = function(name, label, title){
        this.diagramImporters[name] = {label: label, title: title, type: 'import'};
    }
    
    this.registerProjectExporter = function(name, label, title){
        this.projectExporters[name] = {label: label, title: title, type: 'export'};
    }
    
    this.registerProjectImporter = function(name, label, title){
        this.projectImporters[name] = {label: label, title: title, type: 'import'};
    }
    
    this.getDiagramExporter = function( name ){
        return this.diagramExporters[name];
    }
    
    this.getDiagramImporter = function( name ){
        return this.diagramImporters[name];
    }
    
    this.getProjectExporter = function( name ){
        return this.projectExporters[name];
    }
    
    this.getProjectImporter = function( name ){
        return this.projectImporters[name];
    }
    
    
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////
    // Widgets
    
    this.registerWidget = function(name, instance){
        this.widgets[name] = instance;
    }
    
    /////////////////////////////////////////////////////////////////////////////
    // Menu
    
    this.setMenu = function(menu){
        this.menu = menu;
    };
    
    this.getMenu = function(){
        return this.menu;
    };
    
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    
    
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    // AJAX  
  
    this.ajaxResponseActionHandlers = [];
  
    this.sendAjaxRequest = function (url, data){
        $.post( this.settings.serverURL + url, data);
    }  

    this.existsAjaxResponseHandler = function(handle){
        return typeof(this.ajaxResponseActionHandlers[handle]) == 'function';
    }

    this.getAjaxResponseHandle = function( handle ){
        return this.ajaxResponseActionHandlers[handle];
    }

    this.callAjaxResponseHandle = function(handle, payload){
        var handle = this.getAjaxResponseHandle(handle);
    
        if( handle != null && handle != undefined ){
        
            console.log( ' I call  ' + handle + ' response handle ' );
            handle.call(handle, payload);
        }
        console.log('end ajax handle response');
    }

    this.processAjaxResponse = function(handle, payload){
    
        if( this.existsAjaxResponseHandler(handle) ){
            this.ajaxResponseActionHandlers[handle].call(this, payload);
        }
    
    }


    // handlers

    this.ajaxResponseActionHandlers['createProject'] = function(payload){
        
        var project = this.getProject();
        
        if( project instanceof Project ){
        
            project.setId(payload.projectId);

            if(payload.diagrams != null){
                for( var j in payload.diagrams ){
                    if(payload.diagrams[j] != null){
                        //payload.diagrams[i] = 
                        var diagram = project.getDiagram(j);

                        if(diagram != null){
                            diagram.setId( payload.diagrams[j] );
                        }
                    }
                }
            }
        }
    }
  
    this.ajaxResponseActionHandlers['saveProject'] = function(payload){
        if(payload.diagrams != null){
            for( var m in payload.diagrams ){
                if(payload.diagrams[m] != null){
                    //payload.diagrams[i] = 
                    var diagram = this.getProject().getDiagram(m);
                                
                    if(diagram != null){
                        diagram.setId( payload.diagrams[m] );
                    }
                }
            }
        }
    }
    
    this.ajaxResponseActionHandlers['saveDiagram'] = function(payload){
        if( payload.diagramIndex != undefined && payload.diagramId != undefined ){
            var diagram = this.getProject().getDiagram(payload.diagramIndex);                        
            if( diagram instanceof Diagram && diagram != null){                        
                diagram.setId(payload.diagramId);                            
            }
        }
    }
    
    this.ajaxResponseActionHandlers['openProject'] = function(payload){
        if( payload.project != null && payload.project != undefined ){
                        
            this.closeProject();
                        
            this.createProject( payload.project.title, payload.project.description );
            var project = this.getProject();
                        
            project.setId( payload.project.id );
                        
            var projectDiagrams = payload.project.diagrams;
                        
            if(projectDiagrams != null && projectDiagrams != undefined ){
                //console.log('DIAGRAMS exists');
                if(projectDiagrams.length){
                    for(var l in projectDiagrams){
                        var diagram = projectDiagrams[l];
                        this.addDiagram( new Diagram(diagram.id, diagram.title, diagram.description, '', null, diagram.content, diagram.type, diagram.width, diagram.height) );
                    }
                }
            }
                        
 
                        
        }
    }
    
    this.ajaxResponseActionHandlers['importDiagram'] = function(payload){
    
        if( this.getProject() instanceof Project ){
            var diagramData = payload.diagramData;
            var diagram = new Diagram(-1, diagramData.title, diagramData.description, '', null, diagramData.content, diagramData.type, diagramData.width, diagramData.height);
            
            this.addDiagram(diagram);
            
        }

    }
    
    this.ajaxResponseActionHandlers['importProject'] = function(payload){
    
        if( this.getProject() instanceof Project ){
            this.closeProject();
        }

        var projectData = payload.projectData;
        this.createProject(projectData.title, projectData.description);
        
        if( projectData.diagrams != null && projectData.diagrams != undefined ){
            var diagrams = projectData.diagrams;
            
            for( var i in diagrams ){
                if(diagrams[i] != null && diagrams[i] != undefined){
                    var diagramData = diagrams[i];
                    var newDiagram = new Diagram(-1, diagramData.title, diagramData.description, '', null, diagramData.content, diagramData.type, diagramData.width, diagramData.height);
                    
                    this.addDiagram(newDiagram);
                    
                }
            }
            
        }
        
    }
    
  
    // interfaces for exporters
    this.sendExporterData = function(url, data){
        $.post(url, data);
    }
    
    this.sendImporterData = function(url, data){
        $.post(url, data);
    }
    
  
//////////////////////////////////////////////////////////////////////////////

};

var App = new Application;
var appMenu = new Menu(App);

//

App.registerWidget( 'diagrammanager', new DiagramManager() );

//

var miCreateProject = new MenuItem('createproject', 'Create a new project', 'Create a new project', 'document');
miCreateProject.onClick = function(){
    var appRef = this.getAppRef();
    appRef.openDialog('newProject');
};

var miSaveProject = new MenuItem('saveproject', 'Save project', 'Save project', 'save');
miSaveProject.onClick = function(){
    var appRef = this.getAppRef();
    appRef.saveProject();
};

var miManageProjects = new MenuItem('openproject', 'Manage projects', 'Manage projects', 'folder');
miManageProjects.onClick = function(){
    var appRef = this.getAppRef();
    var url = appRef.settings.serverURL + 'manage-projects';
    $.post(url);
}

var miCloseProject = new MenuItem('closeproject', 'Close project', 'Close project', 'close');
miCloseProject.onClick = function(){
    var appRef = this.getAppRef();
    appRef.openDialog('closeProject');
}

var miSetupProject = new MenuItem('projectsettings', 'Project settings', 'Project settings', 'settings');
miSetupProject.onClick = function(){
    var appRef = this.getAppRef();
    appRef.openDialog('editProjectSettings');
}


var miExportProject = new MenuItem('exportproject', 'Export project', 'Export project', 'export');
var miImportProject = new MenuItem('importproject', 'Import project', 'Import project', 'import');

var miCreateDiagram = new MenuItem('creatediagram', 'Create a new diagram', 'Create a new diagram', 'plus');
var miSaveDiagram = new MenuItem('savediagram', 'Save diagram', 'Save diagram', 'save');
miSaveDiagram.onClick = function(self){

    var appRef = this.getAppRef();
    var currentDiagram = appRef.getActiveDiagram();
    
    if( currentDiagram instanceof Diagram ){
        appRef.saveDiagram( currentDiagram.getIndex() );
    }

}

var miCloseDiagram = new MenuItem('closediagram', 'Close diagram', 'Close diagram', 'close');
miCloseDiagram.onClick = function(self){
    
    var appRef = this.getAppRef();
    var dialog = appRef.getDialog('closeDiagram');
    var currentDiagram = appRef.getActiveDiagram();
    
    if( currentDiagram instanceof Diagram ){        
        dialog.open(); 
        
        dialog.setOptions({
            diagramIndex: currentDiagram.getIndex()
        });
    }
    
}

var miDiagramSettings = new MenuItem('diagramsettings', 'Diagram settings', 'Diagram settings', 'settings-2');
miDiagramSettings.onClick = function(self){
    
    var appRef = this.getAppRef();
    var diagram = appRef.getActiveDiagram();
    var dialog = appRef.getDialog( 'editDiagramProperties' );
    
    
    if( diagram instanceof Diagram ){
        dialog.open();
        dialog.setOptions({
            diagramIndex: diagram.getIndex()
        });
        
        var form = dialog.getOption('form');
        
        form.setValues({
            title: diagram.getTitle(),
            description: diagram.getDescription(),
            width: diagram.getWidth(),
            height: diagram.getHeight()
        });
        
    }
}

var miExportDiagram = new MenuItem('exportdiagram', 'Export diagram', 'Export diagram', 'export');
var miImportDiagram = new MenuItem('importdiagram', 'Import diagram', 'Import diagram', 'import');

appMenu.add( miCreateProject.getName(), miCreateProject );
appMenu.add( miManageProjects.getName(), miManageProjects );
appMenu.add( miSaveProject.getName(), miSaveProject );
appMenu.add( miCloseProject.getName(), miCloseProject );
appMenu.add( miSetupProject.getName(), miSetupProject );
appMenu.add( miExportProject.getName(), miExportProject );
appMenu.add( miImportProject.getName(), miImportProject );

appMenu.add( 'seperator', new MenuItemSeparator() );

appMenu.add( miCreateDiagram.getName(), miCreateDiagram );
appMenu.add( miSaveDiagram.getName(), miSaveDiagram );
appMenu.add( miCloseDiagram.getName(), miCloseDiagram );
appMenu.add( miDiagramSettings.getName(), miDiagramSettings );
appMenu.add( miExportDiagram.getName(), miExportDiagram );
appMenu.add( miImportDiagram.getName(), miImportDiagram );

App.setMenu(appMenu);

///////////////////////////////////////////////////////////////////////////////
//
// Initialization of editor dialogs
// 
// 1. new project dialog
// 2. new diagram dialog
// 3. close diagram dialog
// 4. delete diagram dialog
// 5. edit diagram properties dialog
// 6. close project confirm dialog
// 7. delete project confirm dialog
// 8. open project confirm dialog
// 9. create a new propject confirm dialog
// 10. project settings
//

var newProjectForm = new BAForm('newproject');
newProjectForm.addText('title', 'Title').setRequired();
newProjectForm.addTextarea('description', 'Description');
        
var newProjectFormHTML =  $("<div class='p12'></div>").append(newProjectForm.render());
        
var newProjectDialog = new Dialog('new-project', 'Create a new project ...', newProjectFormHTML,{
    modal: true,
    autoOpen: false,
    form: newProjectForm,
    buttons: {
        "Create": function(){
                    
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference(),
            form = $(this).dialog('option', 'form');
            

            if( !form.validate() ){
                return false;
            }
            
            var values = form.getValues();
            
            app.closeProject();          
            app.createProject( values.title, values.description );
            app.saveProject();
            
            app.update();
            
            $( this ).dialog( "close" );
            
            return;            
        },

        "Cancel": function(){
            $( this ).dialog( "close" );
        }
    },
    
    close: function(){
        var form = $(this).dialog('option', 'form');              
        form.resetValues();
        form.hideValidation();
    }
    
}); 

        
App.registerDialog('newProject', newProjectDialog);             
        
        
        
// 2. NEW DIAGRAM DIALOG           
var newDiagramForm = new BAForm('new-diagram');
newDiagramForm.addText('title', 'Title').setRequired();
newDiagramForm.addTextarea('description', 'Description');
newDiagramForm.addText('width', 'Width').setRequired().setFormat( ControlFormat.INTEGER );
newDiagramForm.addText('height', 'Height').setRequired().setFormat( ControlFormat.INTEGER );
        
var newDiagramFormHTML =  $("<div class='p12'></div>").append(newDiagramForm.render());
        
var newDiagramDialog = new Dialog('new-diagram', 'Create a new diagram ...', newDiagramFormHTML,{
    modal: true, 
    autoOpen: false,
    diagramType: '',
    form: newDiagramForm,
    buttons: {

        "Create": function(){
                    
            // ADD INTO PROJECT NEW DIAGRAM
                    
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference(),
            form = $(this).dialog('option', 'form'),
            values = form.getValues(),
            type = $(this).dialog('option', 'diagramType'),
            project = app.getProject(); 
            
            
            if( !form.validate() ){
                return false;
            }
            
            
            if(values.title == ''){
                values.title = 'untitled '+type+' diagram';
            }
            
            if(values.width < 200){
                values.width = 200;
            }
            
            if( values.height < 100 ){
                values.width = 100;
            }
                          
            // new diagram: id, title, description, index, paper, type, width, height
            var diagram = new Diagram(0, values.title, values.description, -1, null, '', type, values.width, values.height);
            var index = app.addDiagram(diagram);
            
            app.saveDiagram( index );
            app.openDiagram(index);
                    
            // REFRESH DIAGRAM LIST
            app.update();
                    
            form.resetValues();
                    
            $( this ).dialog( "close" );
        },

        "Cancel": function(){
            $( this ).dialog( "close" );
        }
    }         
});
      
newDiagramDialog.onOpen = function(self){
    var form = self.getOption('form');
    form.setValues({
        width: 800, 
        height: 600
    });
}

App.registerDialog('newDiagram', newDiagramDialog);             
        
        
// 3. CLOSE DIAGRAM DIALOG    
        
var closeDiagramDialog = new Dialog('close-diagram', 'Close diagram', 'Do you want save changes?', {
    modal: true, 
    autoOpen: false,
    tabId: null,
    buttons: {

        "Yes": function(){   
                
            var index = $(this).dialog('option', 'diagramIndex');               // diagram index  
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference();
                
                
            if( index >= 0 ){

                var diagram = app.getProject().getDiagram(index);                   // get diagram                        
                
                console.log( diagram.getContent() );
                
                app.saveDiagram( index );

                diagram.setContent(Joint.dia.stringify( diagram.getPaper()));       // copy content of editing                       
                diagram.setPaper(null);                                             // null paper                        
                
                var nextTab = app.getUI().getTabulatorSibling( index );
                
                if( nextTab != null){
                    app.setActiveDiagram( $(nextTab).data('index') );
                }else{
                    app.setState( ApplicationState.OPEN );
                }
                
                app.getUI().removeTabulator( index );        
                app.update();
            }
                    
            $( this ).dialog( "close" );
        },

        "No": function(){          
            
            var index = $(this).dialog('option', 'diagramIndex');               // diagram index  
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference();
                
                
            if( index >= 0 ){

                var diagram = app.getProject().getDiagram(index);                   // get diagram                                              
                diagram.setPaper(null);                                             // null paper                        
                
                var nextTab = app.getUI().getTabulatorSibling( index );
                
                if( nextTab != null){
                    app.setActiveDiagram( $(nextTab).data('index') );
                }else{
                    app.setState( ApplicationState.OPEN );
                }
                
                app.getUI().removeTabulator( index );        
                app.update();
            }
                    
            $( this ).dialog( "close" );
           
        },

        "Cancel": function(){
            $( this ).dialog( "close" );
        }
    },
    close: function() {
        $(this).dialog('option', 'diagram', null);
        $(this).dialog('option', 'tab', null);
        $(this).dialog('option', 'tabContent', null);
        
        
    }
});
        
App.registerDialog('closeDiagram', closeDiagramDialog);             
        
// 4. DELETE DIAGRAM DIALOG
var deleteDiagramDialog = new Dialog('delete-diagram', 'Delete diagram', 'Do you really want delete diagram?', {
    modal: true, 
    autoOpen: false,            
    diagramIndex: -1,
    buttons: {

        "Yes": function(){   
                    
            var model = $(this).dialog('option', 'model');        
            var app = model.getApplicationReference();
            var index = $(this).dialog('option', 'diagramIndex');               // diagram index  
                    
            console.log(index);
                    
            if( index >= 0 ){                            // check index
                
                var project = app.getProject();
                
                if( project instanceof Project ){
               
                    var diagram = project.getDiagram(index);                                      // get diagram

                    if( diagram != null ){                                                      // if diagram currently exists
                        var diagramId = diagram.getId();                                        // get diagram id                       

                        app.removeDiagram(diagram.getIndex());

                        /*if( BAEUI.isDiagramOpen(index) ){
                            var tab = BAEUI.getDiagramTab(index);
                            BAEUI.removeTab(tab.tab);
                            BAEUI.removeTabContent(tab.content);
                        }*/

                       // project.removeDiagram(index);                                             // remove diagram at index
                        //BAEUI.updateDiagramList();                                              // update diagram list

                        app.getUI().showProcessScreen();                                          // show process screen

                        $.post(BAEUI.getServerURL()+'?do=deleteDiagram', {
                            id: diagramId
                        }); 
                        
                        app.update();
                    }
                }
            }
                    
            $( this ).dialog( "close" );
        },

        "No": function(){          
            $( this ).dialog( "close" );
        }
    },
    close: function() {
        $(this).dialog('option', 'diagramIndex', null);
    }
});
        
App.registerDialog('deleteDiagram', deleteDiagramDialog);             
        
// 5. EDIT DIAGRAM PROPERTIES
        
var editDiagramPropertiesForm = new BAForm();
editDiagramPropertiesForm.addText('title', 'Title').setRequired();
editDiagramPropertiesForm.addTextarea('description', 'Description');
editDiagramPropertiesForm.addText('width', 'Width').setRequired().setFormat( ControlFormat.INTEGER );;
editDiagramPropertiesForm.addText('height', 'Height').setRequired().setFormat( ControlFormat.INTEGER );;
        
var editDiagramPropertiesFormHTML =  $("<div class='p12'></div>").append(editDiagramPropertiesForm.render());
        
var editDiagramPropertiesDialog = new Dialog('edit-diagram-properties', 'Edit diagram properties', editDiagramPropertiesFormHTML, {
    form:editDiagramPropertiesForm,
    modal: true, 
    autoOpen: false,
    diagramIndex: -1,
    buttons: {
        "Save": function(){
                    
            var index = $(this).dialog('option', 'diagramIndex');               // diagram index  
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference();
                    
            var diagram = app.getProject().getDiagram(index);
                    
            if( diagram instanceof Diagram ){
                        
                var form = model.getOption('form');
                var values = form.getValues();
                        
                if( !form.validate() ){
                    return false;
                }
                        
                diagram.setTitle(values.title);
                diagram.setDescription(values.description);
                        
                if( diagram.getWidth() != values.width || diagram.getHeight() != values.height ){
                    var paper = diagram.getPaper();
                    if(paper != null){
                        paper.setSize(values.width, values.height);
                    }
                }
                        
                diagram.setWidth(values.width);
                diagram.setHeight(values.height);
                        
                app.saveDiagramSettings(index);
                        
                app.update();
                form.resetValues();
            }
                    
            $(this).dialog('close');
        },
        "Cancel": function(){
            $(this).dialog('close');
        }
    },
            
    close: function(){
        $(this).dialog('option', {
            diagramIndex: -1
        });
    }
            
});
        
App.registerDialog('editDiagramProperties', editDiagramPropertiesDialog);             
        
// 6. CLOSE PROJECT DIALOG
var closeProjectDialog = new Dialog('close-project', 'Close project', 'Do you want close project? Unsaved changes will be permanently lost.', {
    modal: true,
    autoOpen: false,
    buttons: {
        "Yes": function(){
            
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference();
            
            app.closeProject();
            
            $(this).dialog('close');
        },
        "No": function(){
            $(this).dialog('close');
        }
    }
});
        
App.registerDialog('closeProject', closeProjectDialog);       
        
// 7. DELETE PROJECT CONFIRM        
var deleteProjectDialog = new Dialog('delete-project', 'Delete project', 'Do you want to delete project?', {
    modal: true,
    autoOpen: false,
    projectId: -1,
    href: '',
    buttons: {
        "Yes": function(){
                            
                            
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference();               
                            
            app.getUI().showProcessScreen();                                          // show process screen
                                  
            var projectId = $(this).dialog('option', 'projectId');
            var href = $(this).dialog('option', 'href');
                    
            if( app.getState() >= ApplicationState.OPEN ){
                var project = app.getProject();
                if( project.getId() == projectId ){
                    app.closeProject();
                }
            }
                   
            console.log(href);
                   
            $.post(href, {
                projectId: projectId
            });
                               
            $(this).dialog('close');
                    
        },
        "No": function(){
            $(this).dialog('close');
        }
    }
});
        
App.registerDialog('deleteProject', deleteProjectDialog);
        
// 8. OPEN PROJECT CONFIRM        
var openProjectDialog = new Dialog('open-project', 'Open project', 'Do you want to open project? <strong>Changes in the current open project will be lost.</strong>', {
    modal: true,
    autoOpen: false,
    projectId: -1,
    buttons: {
        "Yes": function(){
                    
            var model = $(this).dialog('option', 'model'),        
            app = model.getApplicationReference(); 
                    
            var projectId = $(this).dialog('option', 'projectId');
            app.openProject(projectId);
                    
            $(this).dialog('close');
        },
        "No": function(){
            $(this).dialog('close');
        }
    }
});
        
App.registerDialog('openProject', openProjectDialog);
        
// 9. CREATE A NEW PROJECT CONFIRM        
var newProjectConfirmDialog = new Dialog('new-project-confirm', 'New project', 'Do you want really to create a new project? <strong>Changes in the current open project will be lost.</strong>', {
    modal: true,
    autoOpen: false,            
    buttons: {
        "Yes": function(){                                        
            BAEUI.closeProject();
            BAEUI.getDialog('newProjectDialog').open();                    
            $(this).dialog('close');
        },
        "No": function(){
            $(this).dialog('close');
        }
    }
});
        
App.registerDialog('newProjectConfirm', newProjectConfirmDialog);
        
// 10. PROJECT SETTINGS
        
var projectSettingsForm = new BAForm('dialog-project-settings');
projectSettingsForm.addText('title', 'Title').setRequired();
projectSettingsForm.addTextarea('description', 'Description');
        
var projectSettingsFormHTML =  $("<div class='p12'></div>").append(projectSettingsForm.render());
        
var projectSettingsDialog = new Dialog('edit-project-settings', 'Project settings', projectSettingsFormHTML, {
    form:projectSettingsForm,
    modal: true,
    autoOpen: false,            
    buttons: {
        "Save": function(){                                        

            var model = $(this).dialog('option', 'model'),        
            form = model.getOption('form'),
            values = form.getValues(),
            app = model.getApplicationReference();
            
            if( !form.validate() ){
                return false;
            }
            
            var project = app.getProject();
                    
            // if is changed then save
            if( project.getTitle() != values.title || project.getDescription() != values.description ){          
                project.setTitle(values.title);
                project.setDescription(values.description);       
                app.saveProject();
            }
                                       
                                       
            $(this).dialog('close');
        },
        "Close": function(){
            $(this).dialog('close');
        }
    }
});

projectSettingsDialog.onOpen = function(self){
    
    var appRef = self.getApplicationReference();
    var form = self.getOption('form');
    var project = appRef.getProject();
    
    form.setValues({
        title: project.getTitle(),
        description: project.getDescription()
    });
    
}

App.registerDialog('editProjectSettings', projectSettingsDialog);



// import export testing



