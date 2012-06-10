/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Actor element edit dialog
 */   
var showUseCaseDiagramActorEdit = function(obj){    
    var window = $("#use-case-dialog-actor");
    window.dialog("open");
    console.log(obj);
    window.dialog( "option", "reference", obj );
    $(window).find('textarea[name="content"]').val(obj.getLabel());    
    obj.lock();        
};  
    
/**
 * Use Case element edit dialog
 */    
var showUseCaseDiagramUseCaseEdit = function(obj){    
    var window = $("#use-case-dialog-usecase");
    window.dialog("open");
    window.dialog( "option", "reference", obj );
    $(window).find('textarea[name="content"]').val(obj.getLabel());    
    obj.lock();        
};    




$(document).ready( function(){
    
    //UseCaseUseCaseEditDialog.create();
    
    // actor element dialog settings
    $("#use-case-dialog-actor").dialog({
        autoOpen: false,
        modal: true,
        reference: '',
        width: '600',
        buttons: {
            OK: function() {
                
                var current = $(this).dialog("option", 'reference'); 
                var content = $(this).find("textarea[name='content']").val();                
                
                current.setLabel(content);  
                current.update();
                
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            
        }
    });
    
    $( "#use-case-dialog-actor #tabs" ).tabs();   
    
    
    // actor element dialog settings
    $("#use-case-dialog-usecase").dialog({
        autoOpen: false,
        modal: true,
        myAttr: '',
        width: '600',
        buttons: {
            OK: function() {
                
                var current = $(this).dialog("option", 'reference'); 
                var content = $(this).find("textarea[name='content']").val();                
                
                current.setLabel(content);  
                current.update();
                
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            
        }
    });
    
    $( "#use-case-dialog-usecase #tabs" ).tabs();        
});
