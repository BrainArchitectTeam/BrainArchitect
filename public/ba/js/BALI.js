/**
 * BAEUI - Brain Architect Editor UI Library
 * 
 * 
 */
var BAEUI = {
    
    
    projectRef: null,
    appRef: null,
    
    setProjectRef: function(ref){
        this.projectRef = ref;
    },
    
    getProjectRef: function(){
        return this.projectRef;
    },
    
    setAppRef: function(ref){
        this.appRef = ref;
    },
    
    getAppRef: function(){
        return this.appRef;
    },
    
    
    serverURL: '/',
    
    dialogs: [],
    
    init: function(){
        this.initProjectNavigation();
        this.initDialogs();
        this.initTabs();
        this.createToolbar();
        this.initDocks();
        
        this.initSubmenus();
        
        this.update();
    },
    
    saveEditorState: function(){
    
        //console.log('save editor state');
    
        setTimeout( 
            function(){
            //BAEUI.saveEditorState();
            }, 2000
            );
    },
    
    initTabs: function(){
        $("#opened-tabs .tab").click( function(){                               // on click of tab
            var index = BAEUI.setActiveTab(this);                               // set active tab & get index of current diagram
            
            if( BAEUI.getProjectRef() != null ){
                BAEUI.getProjectRef().setActiveDiagramByIndex(index);                               // set active diagram by index
            }
        });
    },
    
    getServerURL: function(){
        return this.serverURL;
    },
    
    /**
     * Create toolbar element
     */
    createToolbar: function(){
    
        var count = Toolbar.getToolsetCount();
        for(var i = 0; i < count; i++){
            var toolset = Toolbar.getToolset(i);                                // get toolset from toolbar register                        
            var elements = toolset.getElementsTools();                          // get toolset elements
            var elementsCount = elements.length;                                // count of toolset elements
            
            var group = $('<div>').addClass('group').attr('id', 'toolbar-'+toolset.getName());        // create new group               
            
            
            // append tools
            for(var j = 0; j < elementsCount; j++){
                var item = $('<div>').addClass('item').html("<img src='data:image/png;base64," + elements[j].icon + "' />" + "<span>" + elements[j].title + "</span>" );                
                $(item).bind('click', elements[j].callback);                    // set click callback
                $(group).append(item);                                          // append html group
            }
            
            $("#toolbar").append(group);                                        // add group into toolbar
            
        }
    },
    
    selectToolbar: function(type){
        $("#toolbar .group").not('.common').hide();
        var toolbar = $("#toolbar-"+type).show();
    },
    
    initDocks: function(){
        // set dock and toolbar as dragable and docks as resizeable
        $('#toolbar, .dock').draggable({
            handle: '.header',
            containment: "#canvas"
        });    

        $('.dock').resizable({
            minWidth: 220,
            minHeight: 200
        });
        
        $.each( $('.dock .tabs') , function(){
            
            var tabs = $(this).children('ul').children('li');            
            var firstChild = $(tabs).get(0);
            $(this).find(".tab").hide();
            
            $(tabs).removeClass('active');          // remove active items
            $(firstChild).addClass('active');   // add first child as active element            
            $( $(firstChild).data('tab') ).show();
            
            $(tabs).click(function(){
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                var tab = $(this).data('tab');
                
                $(tab).siblings().hide();
                $(tab).show();                
            });
            
        });
        
    },
    
    /**
     * Initialization submenus
     * - unbind/bind hover on LI elements show their UL subelements
     */
    initSubmenus: function(){
        
        
        $("ul li").unbind('hover');
        
        $("ul li").hover( function(){                    
            if( !$(this).children('a').hasClass('inactive') ){
                $(this).children('ul').stop(true, true).slideDown('fast');
            }            
        }, function(){
            $(this).children('ul').stop(true, true).slideUp('fast');
        });   
          
    },
    
    /**
     *  Initization of project navigation
     *  - new project
     *  - save project
     *  - close project
     *  - add diagram by item type
     *  - update project settings
     *  - open project
     *  - delete project
     */
    initProjectNavigation: function(){
        
        //
        
        $('a').not('.external').live('click', function(){            
            return false;
        });
        
        $('a.ajax').live('click', function(){
            $.get(this.href);
            return false;
        });
        
        $("#nav-try-it").bind('click', function(){
            BAEUI.hideLogin(true);
            return false;
        });
    
        // signin bind click
        $("#nav-signin").live('click', function(){
            BAEUI.showLogin(true);
            return false;
        });
        
        // bind ajax forms
        $("form").live("submit", function () {
            if( $(this).hasClass('ajax') ){
                $(this).ajaxSubmit();   
            }
            return false;
        });
        
        
        /**
         *  Open new project dialog
         */
        $("#main-menu-project-new").bind('click', function(){ 
            
            if( BAEUI.getProjectRef() != null ){
                BAEUI.getDialog('newProjectConfirm').open();
                return false;
            }
            
            BAEUI.getDialog('newProjectDialog').open(); 
            return false;
        });
        
        /**
         *  Open project settings dialog
         */
        
        $("#main-menu-project-settings").bind('click', function(){
            
            if( !$(this).hasClass('inactive') ){
                var dialog = BAEUI.getDialog('projectSettings');                                              
                var form = dialog.getOption('form');                                     // dialog form option                
                
                var project = BAEUI.getProjectRef();
                
                form.getControl('title').setValue(project.getTitle());                   // set dialog form input title value
                form.getControl('description').setValue(project.getDescription());       // set dialog form textarea description value                    
                dialog.open();  
                
            }            
            
            return false;
        });
        
        /**
         *  Save all button call this action.
         *  First time checks if project exists/is saved then try to create/save project
         */
        $("#main-menu-project-save").bind('click', function(){
           
            if( $(this).hasClass('inactive') ){
                return false;
            }
           
            BAEUI.showProcessScreen();                                          // show process screen
           
            var project = BAEUI.getProjectRef();
           
            if(project.isNew()){                                                  // if project is new                
                $.post(BAEUI.getServerURL()+'?do=createProject', {              // try to create a new project
                    title:project.getTitle(),                                     // get project title
                    description:project.getDescription(),                         // get project description
                    diagrams:project.getDiagramsJSON()                            // get diagrams JSON representation
                });                                
                              
                return false;
            }
            
            // store all diagrams data to save
            var diagrams = project.getDiagrams();                                 // get all diagrams
            for(var i in diagrams){                                             // for each diagram
                if( diagrams[i] != null && diagrams[i] instanceof BADiagram ){    // if exists, is not null
                    if(BAEUI.isDiagramOpen(i)){                                 // if diagram is open
                        BAEUI.storeDiagramData(i);                              // store diagram data
                    }
                }
            }
            
            // send data to server
            $.post(BAEUI.getServerURL()+'?do=saveProject',{
                projectId: project.getId(),
                title:project.getTitle(),                                         // get project title
                description:project.getDescription(),                             // get project description
                diagrams:project.getDiagramsJSON()                                // get diagrams JSON representation
            });
            
            return false;
        });
        
        // close current project
        $("#main-menu-project-close").bind('click', function(){            
            BAEUI.getDialog('closeProject').open();             
            return false;
        });
        
        // add diagram into project
        $("#main-menu-diagram-add .item").bind('click', function(e){
            var type = $(this).data('type');
            var dialog = BAEUI.getDialog('newDiagramDialog');
            
            var form = dialog.getOption('form');  
            form.setValues({
                width: 800,
                height: 600
            });
            
            dialog.setOptions({
                diagramType: type
            });
            
            dialog.open();
            return false;
        });
        
        // close current project
        
        $("#main-menu-diagram-save").bind('click', function(){            
            
            if( $(this).hasClass('inactive') ){
                return false;
            }
            
            var project = BAEUI.getProjectRef();
            var diagram = project.getActiveDiagram();

            if(diagram != null && diagram instanceof BADiagram){
                
                var index = diagram.getIndex();                
                BAEUI.storeDiagramData(index);                              // copy edited data into diagram
                BAEUI.saveDiagram(index);                                   // save diagram
            }
            
            return false;
        });
        
        $("#main-menu-diagram-settings").bind('click', function(){            
            
            if( $(this).hasClass('inactive') ){
                return false;
            }
            
            var project = BAEUI.getProjectRef();
            var diagram = project.getActiveDiagram();
            
            if(diagram != null && diagram instanceof BADiagram){
            
                var index = diagram.getIndex();                             // get diagram index                    
                var dialog = BAEUI.getDialog('editDiagramProperties');      // get dialog by name
                    
                var form = dialog.getOption('form');                        // dialog form option
                form.getControl('title').setValue(diagram.getTitle());                   // set dialog form input title value
                form.getControl('description').setValue(diagram.getDescription());       // set dialog form textarea description value
                         
                form.setValues({
                    title: diagram.getTitle(),
                    description: diagram.getDescription(),
                    width: diagram.getWidth(),
                    height: diagram.getHeight()
                });         
                         
                dialog.setOptions({
                    diagramIndex: index
                });                   // set diagram index into dialog
                
                //console.log(index + '::= ' + diagram.getTitle() + " --- " + diagram.getDescription());
                
                dialog.open(); 
            
            }
            
            return false;
        });
        
        $("#main-menu-diagram-close").bind('click', function(){            
            
            if( $(this).hasClass('inactive') ){
                return false;
            }
            
            var project = BAEUI.getProjectRef();
            
            var diagram = project.getActiveDiagram();
            
            if(diagram != null && diagram instanceof BADiagram){
                var index = diagram.getIndex();
                if( BAEUI.isDiagramOpen(index) ){
                    BAEUI.closeDiagram(index);
                }
            }
            
            return false;
        });
                
        // set canvas size
        $("#form-diagram-settings").submit( function(){
            
            if( $(this).hasClass('inactive') ){
                return false;
            }
            
            var project = BAEUI.getProjectRef();
            
            var activeDiagram = project.getActiveDiagram();
            var diagramPaper = activeDiagram.getPaper();
            diagramPaper.setSize(2000, 2000);
            return false;
        });
        
        ////////////////////////////////////////////////////////////////////////
        // Project management window
        
        $('a.project-manage-project-delete').live('click', function(){
            
            var deleteProjectDialog = BAEUI.getAppRef().getDialog('deleteProject');
            var projectId = $(this).data('project');
  
            deleteProjectDialog.open();
  
            deleteProjectDialog.setOptions({
                href: this.href, 
                projectId: projectId
            });
            
            return false;
        });
        
       
        $('a.project-manage-project-open').live('click', function(){           
            
            var id = $(this).data('project');
            
            var app = BAEUI.getAppRef();            
            var project = app.getProject();
            
            if( project instanceof Project ){

                if( project.getId() == id ){
                    BAEUI.hideContentWindow();
                    return false;
                }
                
                var openDialog = app.getDialog('openProject');
                openDialog.open();
                
                openDialog.setOptions({
                    projectId: id
                });

                return false;
            }
            
            app.openProject(id);
                      
            return false;
        });
        
        
        $('#content-window-close').live('click', function(){
            BAEUI.hideContentWindow(true);
            return false;
        });
        
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        
    },
   
   

    enableProjectEdit: function(){
        
    },
    
    enableDiagramEdit: function(){
        
    },

   
   
    update: function( ){
        
        var projectMenu = [
            'saveproject',
            'projectsettings',
            'closeproject',
            'exportproject',
            'importproject',
        ];
        
        var diagramMenu = [
            'creatediagram',
            'savediagram',
            'closediagram',
            'exportdiagram',
            'diagramsettings',
            'importdiagram'
        ];       
        
        var appRef = this.getAppRef();
        
        if( appRef instanceof Application ){
            
            switch( appRef.getState() ){

                case ApplicationState.CLOSE:

                    this.hideProjectDocks();
                    this.hideToolbar();
                    this.hidePapersWrapper();
                    
                    this.disableMenuItems([
                        'saveproject', 'projectsettings', 'closeproject', 'exportproject',
                        'creatediagram', 'savediagram', 'closediagram', 'exportdiagram', 'importdiagram', 'diagramsettings'
                    ]);
                    

                    break;

                case ApplicationState.OPEN:

                    this.showProjectDocks();
                    this.hideToolbar();
                    
                    this.enableMenuItems([
                        'saveproject', 'projectsettings', 'closeproject', 'exportproject', 'creatediagram', 'importdiagram',
                    ]);
                    
                    this.disableMenuItems([
                        'savediagram', 'closediagram', 'exportdiagram', 'diagramsettings'
                    ]);
                    
                    this.hidePapersWrapper();
                    
                    break;

                case ApplicationState.EDITING:
                    
                    this.showProjectDocks();
                    this.showToolbar();
                    
                    this.showPapersWrapper();

                    var diagram = appRef.getActiveDiagram();
                    
                    if( diagram instanceof Diagram ){
                        this.selectToolbar(diagram.getType());
                    }
                    
                    this.enableMenuItems([
                        'saveproject', 'projectsettings', 'closeproject', 'exportproject', 'importproject',
                        'creatediagram', 'savediagram', 'closediagram', 'exportdiagram', 'importdiagram', 'diagramsettings'
                    ]);
                    
                    
                    break;
                    

            }
        }
        
    },
   
   
   
   
    /**
     *  Initialization of editor dialogs
     *      1. new project dialog
     *      2. new diagram dialog
     *      3. close diagram dialog
     *      4. delete diagram dialog
     *      5. edit diagram properties dialog
     *      6. close project confirm dialog
     *      7. delete project confirm dialog
     *      8. open project confirm dialog
     *      9. create a new propject confirm dialog
     *      10. project settings
     *
     */
    initDialogs: function(){
        
    /*
        // 1. NEW PROJECT DIALOG    
        
        var newProjectForm = new BAForm('newproject');
        newProjectForm.addText('title', 'Title');
        newProjectForm.addTextarea('description', 'Description');
        
        var newProjectFormHTML =  $("<div class='p12'></div>").append(newProjectForm.render());
        
        this.dialogs['newProjectDialog'] = new baDialog('new-project', 'Create a new project ...', newProjectFormHTML,{
            modal: true,
            autoOpen: false,
            form: newProjectForm,
            buttons: {
                "Create": function(){
                    
                    var app  = BAEUI.getAppRef();
                    app.closeProject();          
                    app.createProject();
                    
                    var project = BAEUI.getProjectRef();
                    
                    BAEUI.showProjectDocks();
                    
                    // CLOSE ALL DIAGRAMS
                    BAEUI.updateDiagramList();
                    
                    // set project settings
                    
                    var form = $(this).dialog('option', 'form');              
                    var values = form.getValues();
                    
                    // console.log(values);
                                        
                    project.setTitle(values.title);
                    project.setDescription(values.description);
                    project.setOpen();
                    
                    // send project
                    $.post(BAEUI.getServerURL()+'?do=createProject', {
                        title:project.getTitle(), 
                        description:project.getDescription(), 
                        diagrams:project.getDiagramsJSON()
                    });                                
                    BAEUI.showProcessScreen();                     
                    form.resetValues();
                    
                    BAEUI.enableProjectEditMenu();
                    
                    $( this ).dialog( "close" );
                },

                "Cancel": function(){
                    $( this ).dialog( "close" );
                }
            }
        });     
        
        this.dialogs['newProjectDialog'].create();
        
        // 2. NEW DIAGRAM DIALOG           
        var newDiagramForm = new BAForm('new-diagram');
        newDiagramForm.addText('title', 'Title');
        newDiagramForm.addTextarea('description', 'Description');
        newDiagramForm.addText('width', 'Width');
        newDiagramForm.addText('height', 'Height');
        
        var newDiagramFormHTML =  $("<div class='p12'></div>").append(newDiagramForm.render());
        
        this.dialogs['newDiagramDialog'] = new baDialog('new-diagram', 'Create a new diagram ...', newDiagramFormHTML,{
            modal: true, 
            autoOpen: false,
            diagramType: '',
            form: newDiagramForm,
            buttons: {

                "Create": function(){
                    
                    // ADD INTO PROJECT NEW DIAGRAM
                    
                    var type = $(this).dialog('option', 'diagramType'); 
                    
                    // console.log('NEW DIAGRAM: ' + type);
                    
                    var form = $(this).dialog('option', 'form');              
                    var values = form.getValues();
                                
                    if(values.title == ''){
                        values.title = 'untitled '+type+' diagram';
                    }
                          
                    var project = BAEUI.getProjectRef();      
                    var diagram = new BADiagram(0, values.title, values.description, -1, null, '', type, values.width, values.height);
                    var index = project.addDiagram(diagram);
                    
                    // REFRESH DIAGRAM LIST
                    
                    BAEUI.showProcessScreen();                                  // show process screen                    
                    BAEUI.saveDiagram(index);                                   // call save diagram (try to store data to server)
                    BAEUI.openDiagram(index);                                   // open diagram in editor
                    BAEUI.updateDiagramList();                                  // update diagram list
                    
                    form.resetValues();
                    
                    $( this ).dialog( "close" );
                },

                "Cancel": function(){
                    $( this ).dialog( "close" );
                }
            }         
        });
        
        this.dialogs['newDiagramDialog'].create();
        
        
        // 3. CLOSE DIAGRAM DIALOG    
        
        this.dialogs['closeDiagram'] = new baDialog('close-diagram', 'Close diagram', 'Do you want save changes?', {
            modal: true, 
            autoOpen: false,
            tab: null,
            tabContent: null,
            diagramId: -1,
            diagramIndex: -1,
            buttons: {

                "Yes": function(){   
                    
                    if( $(this).dialog('option', 'diagramIndex') >= 0 ){

                        var index = $(this).dialog('option', 'diagramIndex');               // diagram index
                        var project = BAEUI.getProjectRef();
                        
                        var diagram = project.getDiagram(index);                              // get diagram                        
                        diagram.setContent(Joint.dia.stringify( diagram.getPaper()));       // copy content of editing                       
                        diagram.setPaper(null);                                             // null paper                        
                        BAEUI.saveDiagram(index);                                           // save diagram
                        
                        var tabSiblings = $($(this).dialog('option', 'tab')).siblings();
                        var nextTab = $(tabSiblings).get( $(tabSiblings).length - 1 );
                        BAEUI.setActiveTab(nextTab);
                        
                        
                        BAEUI.removeTab($(this).dialog('option', 'tab'));                                                // remove tab   
                        BAEUI.removeTabContent($(this).dialog('option', 'tabContent'));                                  // remove tab content
                    }
                    
                    $( this ).dialog( "close" );
                },

                "No": function(){          
                    //console.log( $(this).dialog('option', 'diagramIndex') );
                    var project = BAEUI.getProjectRef();
                    var diagram = project.getDiagram( $(this).dialog('option', 'diagramIndex') );
                    diagram.setPaper(null);                                             // set diagram paper to null
                    
                    var tabSiblings = $($(this).dialog('option', 'tab')).siblings();
                    var nextTab = $(tabSiblings).get( $(tabSiblings).length - 1 );
                    BAEUI.setActiveTab(nextTab);
                    
                    
                    BAEUI.removeTab( $(this).dialog('option', 'tab') );                                                // remove tab   
                    BAEUI.removeTabContent( $(this).dialog('option', 'tabContent') );                                  // remove tab content
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
                
                var countOfOpenedTabs = $("#opened-tabs .tab").length;
                if(countOfOpenedTabs < 1){
                    BAEUI.hidePapersWrapper();
                    BAEUI.disableDiagramEditMenu();
                    BAEUI.hideToolbar();
                }
                
                BAEUI.updateDiagramList();
            }
        });
        
        this.dialogs['closeDiagram'].create();
        
        // 4. DELETE DIAGRAM DIALOG
        this.dialogs['deleteDiagram'] = new baDialog('delete-diagram', 'Delete diagram', 'Do you really want delete diagram?', {
            modal: true, 
            autoOpen: false,            
            diagramIndex: -1,
            buttons: {

                "Yes": function(){   
                    
                    if( $(this).dialog('option', 'diagramIndex') >= 0 ){                            // check index
                        var index = $(this).dialog('option', 'diagramIndex');                       // set index
                        var project = BAEUI.getProjectRef();
                        var diagram = project.getDiagram(index);                                      // get diagram
                        
                        if( diagram != null ){                                                      // if diagram currently exists
                            var diagramId = diagram.getId();                                        // get diagram id
                            diagram = null;                                                         // null diagram

                            if( BAEUI.isDiagramOpen(index) ){
                                var tab = BAEUI.getDiagramTab(index);
                                BAEUI.removeTab(tab.tab);
                                BAEUI.removeTabContent(tab.content);
                            }

                            project.removeDiagram(index);                                             // remove diagram at index
                            BAEUI.updateDiagramList();                                              // update diagram list

                            BAEUI.showProcessScreen();                                          // show process screen

                            $.post(BAEUI.getServerURL()+'?do=deleteDiagram', {
                                id: diagramId
                            });                      // call server action
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
        
        this.dialogs['deleteDiagram'].create();
        
        // 5. EDIT DIAGRAM PROPERTIES
        
        var editDiagramPropertiesForm = new BAForm();
        editDiagramPropertiesForm.addText('title', 'Title');
        editDiagramPropertiesForm.addTextarea('description', 'Description');
        editDiagramPropertiesForm.addText('width', 'Width');
        editDiagramPropertiesForm.addText('height', 'Height');
        
        var editDiagramPropertiesFormHTML =  $("<div class='p12'></div>").append(editDiagramPropertiesForm.render());
        
        this.dialogs['editDiagramProperties'] = new baDialog('edit-diagram-properties', 'Edit diagram properties', editDiagramPropertiesFormHTML, {
            form:editDiagramPropertiesForm,
            modal: true, 
            autoOpen: false,
            diagramIndex: -1,
            buttons: {
                "Save": function(){
                    
                    var project = BAEUI.getProjectRef();
                    
                    var index = $(this).dialog('option', 'diagramIndex');
                    var diagram = project.getDiagram(index);
                    
                    if( diagram != null && diagram instanceof BADiagram ){
                        
                        var form = $(this).dialog('option', 'form');
                        var values = form.getValues();
                        
                        diagram.setTitle(values.title);
                        diagram.setDescription(values.description);
                        
                        
                        if( diagram.getWidth() != values.width || diagram.getHeight() != values.height ){
                            var paper = diagram.getPaper();
                            
                            if(paper != null){
                                console.log('set size');
                                paper.setSize(values.width, values.height);
                            }
                        }
                        
                        diagram.setWidth(values.width);
                        diagram.setHeight(values.height);
                        
                        BAEUI.saveDiagram(index);                         
                        BAEUI.updateDiagramList();
                        
                        // if is tab open, then label of tab set title
                        
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
        
        this.dialogs['editDiagramProperties'].create();        
        
        // 6. CLOSE PROJECT DIALOG
        this.dialogs['closeProject'] = new baDialog('close-project', 'Close project', 'Do you want close project? Unsaved changes will be permanently lost.', {
            modal: true,
            autoOpen: false,
            buttons: {
                "Yes": function(){
                    BAEUI.closeProject();
                    $(this).dialog('close');
                },
                "No": function(){
                    $(this).dialog('close');
                }
            }
        });
        
        this.dialogs['closeProject'].create();        
        
        // 7. DELETE PROJECT CONFIRM        
        this.dialogs['deleteProject'] = new baDialog('delete-project', 'Delete project', 'Do you want to delete project?', {
            modal: true,
            autoOpen: false,
            projectId: -1,
            href: '',
            buttons: {
                "Yes": function(){
                                  
                    BAEUI.showProcessScreen();                                          // show process screen
                                  
                    var projectId = $(this).dialog('option', 'projectId');
                    var href = $(this).dialog('option', 'href');
                    
                    var project = BAEUI.getProjectRef();
                    
                    if( project.getId() == projectId ){
                        BAEUI.closeProject();
                    }
                               
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
        
        this.dialogs['deleteProject'].create(); 
        
        // 8. OPEN PROJECT CONFIRM        
        this.dialogs['openProject'] = new baDialog('open-project', 'Open project', 'Do you want to open project? <strong>Changes in the current open project will be lost.</strong>', {
            modal: true,
            autoOpen: false,
            projectId: -1,
            buttons: {
                "Yes": function(){
                    
                    var projectId = $(this).dialog('option', 'projectId');
                    BAEUI.openProject(projectId);
                    
                    $(this).dialog('close');
                },
                "No": function(){
                    $(this).dialog('close');
                }
            }
        });
        
        this.dialogs['openProject'].create(); 
        
        // 9. CREATE A NEW PROJECT CONFIRM        
        this.dialogs['newProjectConfirm'] = new baDialog('new-project-confirm', 'New project', 'Do you want really to create a new project? <strong>Changes in the current open project will be lost.</strong>', {
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
        
        this.dialogs['newProjectConfirm'].create(); 
        
        // 10. PROJECT SETTINGS
        
        var projectSettingsForm = new BAForm('dialog-project-settings');
        projectSettingsForm.addText('title', 'Title');
        projectSettingsForm.addTextarea('description', 'Description');
        
        var projectSettingsFormHTML =  $("<div class='p12'></div>").append(projectSettingsForm.render());
        
        this.dialogs['projectSettings'] = new baDialog('edit-project-settings', 'Project settings', projectSettingsFormHTML, {
            form:projectSettingsForm,
            modal: true,
            autoOpen: false,            
            buttons: {
                "Save": function(){                                        

                    var form = $(this).dialog('option', 'form'),
                    values = form.getValues();
                    
                    var project = BAEUI.getProjectRef();
                    
                    // if is changed then save
                    if( project.getTitle() != values.title || project.getDescription() != values.description ){ 
                        
                        if( project.isNew() ){
                            project.setTitle(values.title);
                            project.setDescription(values.description);
                            
                            $(this).dialog('close');
                            
                            return false;
                        }
                        
                        $.post(BAEUI.getServerURL()+'?do=saveProjectSettings', {
                            id: project.getId(), 
                            title: values.title, 
                            description: values.description
                        });         

                        BAEUI.showProcessScreen();                                          // show process screen
                    }
                                       
                                       
                    $(this).dialog('close');
                },
                "Close": function(){
                    $(this).dialog('close');
                }
            }
        });
        this.dialogs['projectSettings'].create();
        
        */
        
    },
    
    /**
     *  Initialization of context menu - diagram list
     */
    
    
    // TABS manage
    
    /**
     *  Insert Tab into footer
     */
    addTab: function( index, title, type ){        
        var tab = $('<div>').html(title).addClass('tab active').attr('id', "#tab_" + index).data('type', type);        // create html of tab
        var closeButton = $(" <span class='close'>(x)</span>");
        
        $(tab).append(closeButton);
        
        $(closeButton).click(function(){
            var tab = $(this).parent('.tab');                                   // select parent element tab
            var tabContent = $(tab.attr('id'));                                 // select tab content by attr id
            var index = $(tabContent).data('index');
            
            BAEUI.closeDiagram(index);
        });
        
        $('#opened-tabs').append(tab);                                                              // append into opened tabs element
        return tab;                                                             // returns created tab
    },
    
    /**
     * Insert tab content
     */
    addTabContent: function(index){
        var tabContent = $('<div>').addClass('tab-content paper').attr('id', "tab_" + index);  // create content tab
        $(tabContent).data("index", index);                                     // set diagram index into tab
        $('#papers-wrapper .jspPane').append(tabContent);                                        // append content tab html into #canvas (draw place)
        //console.log('index to tab content was set: ' + $(tabContent).data('index'));
        return tabContent;                                                      // return created tab content
    },

    /**
     *  Removes tab
     */
    removeTab: function(tab){
        $(tab).remove();
    },
    
    /**
     *  Removes tab contet
     */
    removeTabContent: function(tabContent){
        $(tabContent).remove();
    },

    /**
     * Set active tab and tab content
     * return integer index of diagram
     */
    
    setActiveTab: function(tab){
        
        Joint.dia.unselect();
        
        $(".tab-content").hide();                               // others tab hide
        var tabContent = $( $(tab).attr('id') );                // select tab content element
        
        $( tabContent ).show();                                 // current tab show
        $('#opened-tabs .tab.active').removeClass('active');    // remove active class from previous active tab
        $(tab).addClass('active');                              // add class active to selected tab
        
        var type = $(tab).data('type');
        this.selectToolbar(type);
        
        return $(tabContent).data('index');                     // return index of tab content
    },
    
    
    /**
     * Show:
     * - toolbar
     * - project settings
     * - project inspector
     */
    
    showProjectDocks: function(){
        $(".dock").show();
    },
    
    hideProjectDocks: function(){
        $(".dock").hide();
    },
    
    showToolbar: function(){
        $("#toolbar").show();
    },
    
    hideToolbar: function(){
        $("#toolbar").hide();
    },
    
    /* WORKING SCREEN */
    showProcessScreen: function(){
        this.showProcessOverlay();
        $('#process-screen').show();
    },
    
    hideProcessScreen: function(){
        this.hideProcessOverlay();
        $('#process-screen').hide();
    },
   
    /**
     *  Show process overlay layer
     */
    showProcessOverlay: function(){
        $("#process-overlay").show()
    },
    
    /**
     *  Hide process overlay layer
     */
    hideProcessOverlay: function(){
        $("#process-overlay").hide()
    },
    
    /**
     *  Return dialog by name
     */
    getDialog: function(name){
        return this.dialogs[name];
    },
    
    /**
     *  Check if diagram is open
     */
    isDiagramOpen: function(index){               
        if($("#opened-tabs .tab[id='#tab_"+index+"']").length > 0){
            return true;
        }        
        return false;
    },
    
    
    saveDiagram: function(index){        
        
        BAEUI.showProcessScreen();                                              // show process screen
        
        //console.log('SAVE DIAGRAM > SET INDEX: ' + index);
        
        var project = this.getProjectRef();
        var diagram = project.getDiagram(index);   
        
        if( diagram instanceof BADiagram && diagram != null){  
            
            $.post(BAEUI.getServerURL()+'?do=saveDiagram', {
                projectId: project.getId(),
                diagramId: diagram.getId(),
                diagramIndex: index,
                title: diagram.getTitle(),
                description: diagram.getDescription(),
                type: diagram.getType(),
                content: diagram.getContent(),
                width: diagram.getWidth(),
                height: diagram.getHeight()
            });         
            
        }     
        
    },
    
    closeDiagram: function(index){
        
        var project = this.getProjectRef();
        
        var diagram = project.getDiagram(index);                                  // returns diagram
        var diagramId = diagram.getId();                                        // diagram id
        var diagramTab = BAEUI.getDiagramTab(index);
            
        var closeDialog = BAEUI.getDialog('closeDiagram');                      // close dialog
        closeDialog.setOptions( {           
            diagramId: diagramId, 
            diagramIndex: index, 
            tab: diagramTab.tab, 
            tabContent: diagramTab.content
        });                                                                     // set close dialog properties
        closeDialog.open();                                                     // open close dialog
    },
    
    storeDiagramData: function(index){
        
        var project = this.getProjectRef();
        var diagram = project.getDiagram(index);
        
        if( diagram != null && diagram instanceof BADiagram ){
            Joint.dia.unselect();
            diagram.setContent(Joint.dia.stringify( diagram.getPaper()));
        }        
    },
    
    closeProject: function(){
        
        var project = this.getProjectRef();
        
        BAEUI.disableDiagramEditMenu();
        BAEUI.disableProjectEditMenu();
        
        project.closeProject();
        
        BAEUI.hideProjectDocks();
        BAEUI.hidePapersWrapper();
        Joint.resetPaper();
        BAEUI.closeTabs();
        
        BAEUI.updateDiagramList();
    },
    
    
    /**
     *  Hide overlay layer
     */
    hideOverlay: function(fade){
        if(fade){
            $('#overlay').fadeOut();
            return;
        }        
        $('#overlay').hide();
    },
    
    /**
     *  Show overlay layer
     */
    showOverlay: function(fade){
        if(fade){
            $('#overlay').fadeIn();
            return;
        }        
        $('#overlay').show();
    },
    
    /**
     *  Show login form
     */
    hideLoginForm: function(fade){
        if(fade){
            $('#login-wrapper').fadeOut();
            return;
        }        
        $('#login-wrapper').hide();
    },
    
    /**
     *  Show login form
     */
    showLoginForm: function(fade){
        if(fade){
            $('#login-wrapper').fadeIn();
            return;
        }        
        $('#login-wrapper').show();
    },
    
    
    /**
     *  Show login form and overlay
     */
    showLogin: function(fade){
        this.showOverlay(fade);
        this.showLoginForm(fade);
    },
    
    /**
     *  Hide login form overlay
     */
    hideLogin: function(fade){
        this.hideOverlay(fade);
        this.hideLoginForm(fade);
    },
    
    /**
     *  Show content window
     */
    showContentWindow: function(fade){
        this.showOverlay(fade);
        
        var contentWindow = $("#content-window-wrapper");
        
        if( fade ){
            $(contentWindow).fadeIn();
        }else{
            $(contentWindow).show();
        }
        
        var height = $(document).height();
        
        $("#content-window .content").css({
            maxHeight: (height * 0.6) + "px"
        });
        
        $('#content-window .content').jScrollPane({
            autoReinitialise: true
        });
        
    },
    
    /**
     * Hide content window
     */
    hideContentWindow: function(fade){
        this.hideOverlay(fade);
        
        var contentWindow = $("#content-window-wrapper");
        
        if( fade ){
            $(contentWindow).fadeOut();
        }else{
            $(contentWindow).hide();
        }
    },
    
    /**
     * Show papers wrapper
     */
    showPapersWrapper: function(){
        $("#papers-wrapper").show();        
    },
    
    /**
     * Hide papers wrapper
     */
    hidePapersWrapper: function(){
        $("#papers-wrapper").hide();
    },
    
    
    
    
    
    
    disableMenuItems: function(items){
        
        var appRef = this.getAppRef();
        var menu = appRef.getMenu();
        
        for(var i in items){
              var item = menu.get( items[i] );
              item.disable();
        }
    },
    
    enableMenuItems: function(items){
        
        var appRef = this.getAppRef();
        var menu = appRef.getMenu();
        
        for(var i in items){
              var item = menu.get( items[i] );
              item.enable();
        }
    },
    
    
    
    
    
    
    
    
    
    setDocumentViewport: function(){

        var viewportHeight = $(document).height(); 
        $("#papers-wrapper").css({
            paddingTop: '34px', 
            height: (viewportHeight - 68) + "px"
        });

        $(window).resize(function(){
            var viewportHeight = $(document).height(); 
            $("#papers-wrapper").css({
                paddingTop: '34px', 
                height: (viewportHeight - 68) + "px"
            });
            
            $(".jspPane").css( {'paddingTop': '0'} );
            
        });
        
    },
    
    
    addTabulator: function(id, title, content, data){
    
    
        var tab = $('<div>').html(title).addClass('tab active').attr('id', "#tab_" + id).data( data );        // create html of tab
        var closeButton = $(" <span class='close'>(x)</span>");
        
        $(tab).append(closeButton);
        
        $(tab).click( function(){
            var app = BAEUI.getAppRef();
            app.setActiveDiagram( $(this).data('index') );
        });
        
        $(closeButton).click(function(){
            
            var tab = $(this).parent('.tab');                                   // select parent element tab
            var tabContent = $(tab.attr('id'));                                 // select tab content by attr id
            var index = $(tabContent).data('index');
            
            var app = BAEUI.getAppRef();
            var closeDialog = app.getDialog('closeDiagram');
            closeDialog.open();
            
            closeDialog.setOptions({
                diagramIndex: index
            });
            
        });
        
        $('#opened-tabs').append(tab);                                                              // append into opened tabs element
        
        this.addTabulatorContent(id, content, data);
        
        return tab;

    },
    
    addTabulatorContent: function( id, content, data ){
    
        var tabContent = $('<div>').addClass('tab-content paper').attr('id', "tab_" + id);  // create content tab
        $(tabContent).data(data);                                     // set diagram index into tab
        $('#papers-wrapper .jspPane').append(tabContent);                                        // append content tab html into #canvas (draw place)
        return tabContent; 

    },
    
    setActiveTabulator : function( id ){
        
        //Joint.dia.unselect();
        
        $("#opened-tabs .tab").removeClass('active');
        $("#papers-wrapper .paper").addClass('hidden');
        
        this.showPapersWrapper();
        
        var tabulator = this.getTabulator( id );
        
        $( tabulator.tab ).removeClass('hidden').addClass('active');
        $( tabulator.content).removeClass('hidden');
        
    },
    
    getTabulator: function(id){
        var tab = $("#opened-tabs .tab[id='#tab_"+id+"']");
        var tabContent = $($(tab).attr('id'));
        
        return {
            tab: tab, 
            content: tabContent
        };
    },
    
    isOpenTabulator : function( id ){
        return $("#opened-tabs .tab[id='#tab_"+id+"']").length;
    },
    
    getTabulatorSibling : function(id){
        var tabSiblings = $( this.getTabulator(id).tab ).siblings();
        var nextTab = $(tabSiblings).get( $(tabSiblings).length - 1 );
      
        return nextTab;
    },
    
    removeTabulator: function(index){
        var tab = this.getTabulator(index);
        $( tab.content ).remove();
        $( tab.tab ).remove();
    },
    
    clearTabulators: function(){
        $('#papers-wrapper .paper').remove();
        $('#opened-tabs .tab').remove();
    }
   
    
    

}

window.onload = function(){
    
    $("#top-panel-wrapper, #canvas, #footer-panel-wrapper").show();
    
    $('#loading-screen').fadeOut('slow');
}

//window.onbeforeunload = function(){ return false; };


    

$(document).ready( function(){  
    
    App.setUI(BAEUI);
    App.setConnectionEditor( BAConnector );
    App.setConnectionTypeSelector( BAConnectionTypeSelector );
    
    App.run();
    
    //BAEUI.init();
    BAEUI.setDocumentViewport();
    
    //Joint.setConnectionEditor(BAConnector);
    //Joint.setConnectionTypeSelector(BAConnectionTypeSelector);
    
    $('#papers-wrapper').jScrollPane({
        autoReinitialise: true
    });   
    
    $(".tip").tipTip();
    
    
//BAMenuDiagrams.setRenderer( new BAMenuDiagramsRender() );
//BAMenuDiagrams.render();
        
});

