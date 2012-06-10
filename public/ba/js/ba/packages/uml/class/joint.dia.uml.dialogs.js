/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Class element edit dialog
 */
var showClassDiagramClassEdit = function(obj){
    
    var window = $("#class-diagram-dialog-class");
    window.dialog("open");
    window.dialog( "option", "reference", obj );
    $("#label").attr('value', obj.getLabel());
    obj.lock();
        
    var attributes = obj.getAttributes();
    var attrCount = attributes.length;
        
    for(var i = 0; i < attrCount; i++){
        var line = $($($("#attributes tbody tr")).get(0)).clone();            
        $(line).find('input[name="attr_name[]"]').attr('value', attributes[i].name);
        $(line).find('input[name="attr_type[]"]').attr('value', attributes[i].type);            
        $(line).find('option[value="'+attributes[i].visibility+'"]').attr('selected', 'selected');            
        $("#attributes tbody").append(line);
    }
        
    var methods = obj.getMethods(),
    methodsCount = methods.length;
        
    for(i = 0; i < methodsCount; i++){
        line = $($($("#methods tbody tr")).get(0)).clone();            
        $(line).find('input[name="method_name[]"]').attr('value', methods[i].name);
        $(line).find('input[name="method_attributes[]"]').attr('value', methods[i].attributes);
        $(line).find('input[name="method_type[]"]').attr('value', methods[i].type);            
        $(line).find('option[value="'+methods[i].visibility+'"]').attr('selected', 'selected');            
        $("#methods tbody").append(line);
    }
        
};
    
/**
 * Note element edit dialog
 */    
var showClassDiagramNoteEdit = function(obj){    
    var window = $("#class-diagram-dialog-note");
    window.dialog("open");
    window.dialog( "option", "reference", obj );
    $(window).find('textarea[name="content"]').val(obj.getContent());    
    obj.lock();        
};    


$(document).ready( function(){
    
    // class element dialog settings
    $("#class-diagram-dialog-class").dialog({
        autoOpen: false,
        modal: true,
        reference: '',
        width: '600',
        height: 440,
        resizable: false,
        buttons: {
            OK: function() {
                //console.log( $(this).dialog("option", 'myAttr') ); 
                
                var current = $(this).dialog("option", 'reference'); 
                
                var serializedData = $(this).find('form').serializeArray(),
                serializedDataCount = serializedData.length,
                label = '',
                attributes = Array(),
                methods = Array();
                
                var json = Array();
                
                var attrCnt = 0;
                var methodsCnt = 0;
                
                //console.log(serializedData);
                
                for( var i = 0; i < serializedDataCount; i++ ){
                    
                    // set label
                    if( serializedData[i].name == 'label' ){
                        label = serializedData[i].value;
                    }
                    
                    // set attributes
                    if( serializedData[i].name == 'attr_name[]' ){
                        if( serializedData[i].value != '' ){
                            attributes[attrCnt++] = {
                                name: serializedData[i++].value,
                                type: serializedData[i++].value,
                                visibility: serializedData[i].value
                            }
                        }else{
                            i += 2;
                        }
                    }    
                    
                    // set methods
                    if( serializedData[i].name == 'method_name[]' ){
                        if( serializedData[i].value != '' ){
                            methods[methodsCnt++] = {
                                name: serializedData[i++].value,
                                attributes: serializedData[i++].value,
                                type: serializedData[i++].value,                                
                                visibility: serializedData[i].value                               
                            }
                        }else{
                            i += 3;
                        }
                    }
                    
                }
                
                console.log(methods);
                
                current.setLabel(label);
                current.setAttributes(attributes);
                current.setMethods(methods);
                current.unlock();
                current.update();
                
                // clean
                
                $( "#attributes tbody tr" ).not(':first-child').remove();
                $( "#attributes tbody tr input" ).attr('value', '');
                
                $( "#methods tbody tr" ).not(':first-child').remove();
                $( "#methods tbody tr input" ).attr('value', '');
                
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            
        }
    });
    
    $( "#class-diagram-dialog-class #tabs" ).tabs();
    
    // note element dialog settings
    $("#class-diagram-dialog-note").dialog({
        autoOpen: false,
        modal: true,
        myAttr: '',
        width: '600',
        buttons: {
            OK: function() {
                
                var current = $(this).dialog("option", 'reference'); 
                var content = $(this).find("textarea[name='content']").val();                
                
                current.setContent(content);  
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
    
    $( "#class-diagram-dialog-note #tabs" ).tabs();    
    
});
