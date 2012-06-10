window.onload = function(){
    
}

/**
 * UI Manipulation
 * - Singleton
 */
var ui = {
    
    
    init: function(){
        this.initNavigation();
        this.initHandles();
    },
    
    // ----
    initNavigation: function(){
        
        // submenus slide down & up
        $("ul li").hover( function(){            
            if( !$(this).hasClass('inactive') ){
                $(this).children('ul').stop(true, true).slideDown('fast');
            }            
        }, function(){
            $(this).children('ul').stop(true, true).slideUp('fast');
        });  
      
    },
    
    /* OVERLAYS function */
    hideOverlay: function(fade){
        if(fade){
            $('#overlay').fadeOut();
            return;
        }        
        $('#overlay').hide();
    },
    
    showOverlay: function(fade){
        if(fade){
            $('#overlay').fadeIn();
            return;
        }        
        $('#overlay').show();
    },
    
    
    // --
    hideLoginForm: function(fade){
        if(fade){
            $('#login-wrapper').fadeOut();
            return;
        }        
        $('#login-wrapper').hide();
    },
    
    showLoginForm: function(fade){
        if(fade){
            $('#login-wrapper').fadeIn();
            return;
        }        
        $('#login-wrapper').show();
    },
    
    
    showLogin: function(fade){
        this.showOverlay(fade);
        this.showLoginForm(fade);
    },
    
    hideLogin: function(fade){
        this.hideOverlay(fade);
        this.hideLoginForm(fade);
    },
    
    // --
    
    
    
    
    
    
    
    
    
    showContentWindow: function(fade){
        this.showOverlay(fade);
        
        var contentWindow = $("#content-window-wrapper");
        
        if( fade ){
            $(contentWindow).fadeIn();
        }else{
            $(contentWindow).show();
        }
        
    },
    
    hideContentWindow: function(fade){
        this.hideOverlay(fade);
        
        var contentWindow = $("#content-window-wrapper");
        
        if( fade ){
            $(contentWindow).fadeOut();
        }else{
            $(contentWindow).hide();
        }
    },









    initHandles: function(){

        // ----------
        $("a").not('.external, .system, .content-window-open').click( function(){  
            $.get( this.href );
            return false;
        });
    
        // 
        $("#nav-try-it").bind('click', function(){
            ui.hideLogin(true);
            return false;
        });
    
        // signin bind click
        $("#nav-signin").bind('click', function(){
            ui.showLogin(true);
            return false;
        });
        
        
        
        
        
      
        //
        $("form.ajax").bind("submit", function () {
            $(this).ajaxSubmit();
            return false;
        });
        
        // account settings
        $(".content-window-open").bind('click', function(){
            ui.showContentWindow(true);
            $.get( this.href );
            return false;
        });
        
        $("#content-window-close").bind('click', function(){
            ui.hideContentWindow(true);
            return false;
        });
        
        
     
    }
    
    
    
    
    
}

/** RUN! */
$(document).ready( function(){
    ui.init();
} );