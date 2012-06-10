<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AccountPresenter
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

namespace BrainArchitectModule\FrontendModule;

use Nette\Application\UI\Form,
    \BrainArchitect\Exception\EntityExistsException,
    \BrainArchitect\Exception\BadActivationCodeException,
    BrainArchitect\Exception\UserAccountActivatedException,
    BrainArchitect\Security\SecurityHelper as SH;

class AccountPresenter extends BasePresenter {
       
    /***************************************************************************
     * ACTIONS
     **************************************************************************/

    /**
     * Activation action
     * @param string $email
     * @param string $activationKey 
     */
    public function actionActivation($email, $activationKey = '') {

        $data = Array(
            "email" => $email,
            "activationKey" => $activationKey
        );

        $this['activationForm']->setDefaults($data);
    }

    /**
     * Reset password acction
     * @param type $email
     * @param type $resetCode
     * @throws EntityExistsException 
     */
    public function actionResetPassword($email, $resetCode) {

        try {         
            $this->context->userModel->resetPassword($email, $resetCode);
            $this->flashMessage('New password was sent to your email.');
        } catch (\BrainArchitect\Exception\EntityExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }
    
    /***************************************************************************
     * REGISTER ACCOUNT 
     **************************************************************************/
    
    /**
     * Register form component
     * @param type $name 
     */
    public function createComponentRegisterForm($name) {
        $registerForm = new Form();
        $registerForm->addText('username', 'Username')->setRequired('Please fill your username.')->addRule(Form::MIN_LENGTH, 'Minimal length of username is 5 characters.', 5);
        $registerForm->addText('email', 'Email')->setRequired('Please, fill your email.')->addRule(Form::EMAIL, 'Wrong email format.');
        $registerForm->addText('name', 'Name')->setRequired('Please, fill your name.');
        $registerForm->addText('surname', 'Surname')->setRequired('Please, fill your surname.');
        $registerForm->addPassword('password', 'Password')->setRequired('Please, fill your password.')->addRule(FORM::MIN_LENGTH, 'Password must have minimal 8 characters.', 8);
        $registerForm->addPassword('password_repeat', 'Password again')->setRequired('Please, fill your password again.')->addRule(Form::EQUAL, 'Password are not equal.', $registerForm['password']);
        $registerForm->addSubmit('save', 'Create account');
        $registerForm->onSuccess[] = callback($this, 'registerFormSubmitted');
        $this->addComponent($registerForm, $name);
    }
    
    /**
     * Register form handle submitted
     * @param Form $form
     * @throws EntityExistsException 
     */
    public function registerFormSubmitted(Form $form) {

        try {
            
            $values = $form->getValues();                                       // get form values
            $userModel = $this->context->userModel;
            $values->isAdmin = $values->isBanned = $values->isActive = false;
            $user = $userModel->create($values);                        
            $userModel->sendRegistrationEmail($user->getId());
            
            $this->flashMessage("Account was created, please insert your activation code.");

            $this->redirect('activation', Array(
                "email" => $user->getEmail()
            ));
            
        } catch (\BrainArchitect\Exception\EntityExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }
    
    /***************************************************************************
     * ACTIVATION ACCOUNT
     **************************************************************************/

    /**
     * Activation form component
     * @param type $name 
     */
    public function createComponentActivationForm($name) {
        $registerForm = new Form();
        $registerForm->addText('email', '')->setRequired('Please fill your name.')->setAttribute('placeholder', 'Email');
        $registerForm->addText('activation_key', '')->setRequired('Please fill your activation code.')->setAttribute('placeholder', 'Activation code');
        $registerForm->addSubmit('save', 'Activate account');
        $registerForm->onSuccess[] = callback($this, 'activationFormSubmitted');
        $this->addComponent($registerForm, $name);
    }
    
    /**
     * Activation form handle submitted
     * @param Form $form
     * @throws EntityExistsException 
     */
    public function activationFormSubmitted(Form $form) {
        try {
            $values = $form->getValues();  
            $userModel = $this->context->userModel;
            $userModel->activateByKey($values->email, $values->activation_key);            
            $this->flashMessage('Your account was activated.');
            $this->redirect('activated');
        } catch (EntityExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        } catch (BadActivationCodeException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        } catch (UserAccountActivatedException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }
    
    
    
    /***************************************************************************
     * RESET PASSWORD
     **************************************************************************/
    
    /**
     * Reset password form component
     * @param type $name 
     */
    
    public function createComponentResetPasswordForm($name) {
        $resetPasswordForm = new Form();
        $resetPasswordForm->addText('login')->setAttribute('placeholder', 'Username or email');
        $resetPasswordForm->addSubmit('send', 'Reset password');
        $resetPasswordForm->onSuccess[] = callback($this, 'resetPasswordFormSubmitted');
        $this->addComponent($resetPasswordForm, $name);
    }
    
    /**
     * Reset password form handle submitted
     * @param Form $form
     * @throws EntityExistsException 
     */
    public function resetPasswordFormSubmitted(Form $form) {
        try {
            $values = $form->getValues();
            $userModel = $this->context->userModel;
            $userModel->resetPasswordRequest( $values->login );
            $this->flashMessage('Reset password request was sent to your email.');
            $this->redirect('this');
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }
    
}
