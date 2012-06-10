/**
 * AJAX Nette Framework plugin for jQuery
 *
 * @copyright   Copyright (c) 2009 Jan Marek
 * @license     MIT
 * @link        http://addons.nette.org/cs/jquery-ajax
 * @version     0.2
 */

function isSet(varname) {
    if(typeof( window[ varname ] ) != "undefined") return true;
    else return false;
}

jQuery.extend({
    nette: {
        updateSnippet: function (id, html) {
            $("#" + id).html(html);
        },

        success: function (payload) {
            
            var UI = App.getUI();
            
            // redirect
            if (payload.redirect) {
                window.location.href = payload.redirect;
                return;
            }

            // snippets
            if (payload.snippets) {
                for (var i in payload.snippets) {
                    jQuery.nette.updateSnippet(i, payload.snippets[i]);
                }
            }
            
            // SHOW/HIDE LOGIN FORM
            if( (typeof payload.showLoginForm != 'undefined') ){
                if( payload.showLoginForm ){
                    UI.showLogin(true);
                }else{
                    UI.hideLogin(true);
                }
            }
            
            // SHOW/HIDE CONTENT WINDOW
            if( (typeof payload.showContentWindow != 'undefined') ){
                if( payload.showContentWindow ){                    
                    UI.showContentWindow(true);
                }else{
                    UI.hideContentWindow(true);
                }
            }
            
            BAEUI.initSubmenus();
            
            
            var project = App.getProject();
            //ui.init();
            
            // ACTIONS 
            if( typeof(payload.action) != undefined ){   
                App.processAjaxResponse(payload.action, payload);
            }
                
           
            if(typeof(payload.messages) != 'undefined'){                
                if(payload.messages.length){
                    for(var k in payload.messages){
                        var messageData = payload.messages[k];
                        var message = $('<div>').addClass('item ' + messageData.type).html(messageData.text);
                        $("#editor-messages").prepend(message);                
                        $(message).delay(2500).fadeOut();      
                    }
                }                
            }
           
            App.getUI().hideProcessScreen();
            App.update();
            
            
        }
    }
});

jQuery.ajaxSetup({
    success: jQuery.nette.success,
    error: function(){
        
        var message = $('<div>').addClass('item error').html('Error: please, contact us via info@brainarchitect.net');
        $("#editor-messages").prepend(message);                
        $(message).delay(2500).fadeOut();
        
    },
    dataType: "json"
});