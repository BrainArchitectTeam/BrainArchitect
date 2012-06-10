<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SecurityPresenter
 *
 * @author California
 */

namespace BrainArchitectModule\BackendModule;

class SecuredPresenter extends BasePresenter{
    
    protected function startup() {
        parent::startup();
        
        $user = $this->getUser();
        
        if( !$user->isLoggedIn() ){
            $this->redirect( 'Auth:default' );
        }
        
        if(!$user->isInRole('Admin')){
            $this->redirect(':BrainArchitect:Frontend:Workspace:default');
        }
    }
    
}


