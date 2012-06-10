<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AuthPresenter
 *
 * @author California
 */

namespace BrainArchitectModule\BackendModule;

class AuthPresenter extends BasePresenter{
    
    public function createComponentLoginForm($name){        
        $component = new \Nette\Application\UI\Form();   
        $component->addText('login', 'Login')->getControlPrototype()->addAttributes(Array( "placeholder" => "Username or email" ));
        $component->addPassword("password", "Password")->getControlPrototype()->addAttributes(Array("placeholder" => "Password"));        
        $component->addCheckbox('remember_me', 'Remember me');
        $component->addSubmit('submit', 'Login');
        $component->onSuccess[] = callback($this, 'loginFormSubmitted');
        $this->addComponent($component, $name);
    }
    
    public function loginFormSubmitted(\Nette\Application\UI\Form $form){
        
        try{
            
            $values = $form->getValues();
            $authenticator = new \BrainArchitect\Security\Authenticator( $this->context->userModel );
            $this->getUser()->setAuthenticator($authenticator);

            if ($values->remember_me) {
                $this->getUser()->setExpiration('+ 14 days', FALSE);
            } else {
                $this->getUser()->setExpiration('+ 2 hours', TRUE);
            }

            $this->getUser()->login($values->login, $values->password);
            
            $this->redirect('Default:default');
            
        }catch( \Nette\Security\AuthenticationException $e ){
            $this->flashMessage($e->getMessage(), 'error');
        }
        
    }
    
    public function actionLogout(){
        $this->getUser()->logout();
        $this->redirect('Auth:default');
    }
    
}

