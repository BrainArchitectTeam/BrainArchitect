<?php

/**
 * Description of UsersPresenter
 *
 * @author California
 */

namespace BrainArchitectModule\BackendModule;

use \BrainArchitect\Security\SecurityHelper as SH,
 \Nette\Forms\Form;

class UsersPresenter extends CRUDPresenter {
    /*     * *************************************************************************
     * Actions 
     * ************************************************************************* */

    protected function startup() {
        parent::startup();
        $this->model = $this->context->userModel;
    }

    /**
     * Default actions
     * - shows list of records 
     */
    public function actionDefault() {
        $this->template->list = $this->context->userModel->findAll();
    }

    /**
     * Detail action - shows detail of user by ID
     * @param type $id 
     */
    public function actionDetail($id) {
        parent::actionDetail($id);
        $owner = $this->getModel()->findById($id);
        $this->template->userProjects = $this->context->projectModel->findAllUserProjects($owner);
    }

    /**
     * Edit action
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function actionEdit($id) {

        try {
            $entity = $this->getModel()->findById($id);

            if (!$entity) {
                throw new \BrainArchitect\Exception\EntityNotExistsException("User #{$id} doesn't exists.");
            }

            $data = Array(
                "username" => $entity->getUsername(),
                "email" => $entity->getEmail(),
                "name" => $entity->getName(),
                "surname" => $entity->getSurname(),
                "isActive" => $entity->isActive(),
                "isBanned" => $entity->isBanned(),
                "isAdmin" => $entity->isAdministrator()
            );

            $this['editForm']->setDefaults($data);
            
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->flashMessage($e->getMessage());
            $this->redirect('default');
        }
    }

    /*     * *************************************************************************
     * Components
     * ************************************************************************* */

    /**
     * New Form Component
     * @param string $name 
     */
    public function createComponentNewForm($name) {
        $component = $this->getForm();
        $component->addSubmit('create', 'Create');

        $component->getComponent('password')->setRequired('Please fill password');
        $component->getComponent('password_again')->setRequired('Please fill password again.')->addRule(
                \Nette\Forms\Form::EQUAL, 'Password must be equal.', $component['password']
        );

        $component->onSuccess[] = callback($this, 'createFormSubmitted');
        $this->addComponent($component, $name);
    }

    /**
     * Component new form submitted handle
     * @param \Nette\Application\UI\Form $form 
     */
    public function createFormSubmitted(\Nette\Application\UI\Form $form) {

        try {
            $values = $form->getValues();
            $model = $this->getModel();
            $user = $model->create($values);
            $this->flashMessage('User ' . $user->getUsername() . ' was created.');
            $this->redirect('default');
        } catch (\BrainArchitect\Exception\EntityExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }

    /**
     * Edit Form Component
     * @param type $name 
     */
    public function createComponentEditForm($name) {
        $component = $this->getForm();
        $component->addCheckbox('isBanned', 'Banned');
        $component->addSubmit('create', 'Edit');
        
        $component->getComponent('password_again')
                    ->addConditionOn($component['password'], Form::FILLED, TRUE)
                    ->addRule( Form::FILLED, 'Fill password again' )
                    ->addRule( Form::EQUAL, 'Password must be equal', $component['password'] );
        
        $component->onSuccess[] = callback($this, 'editFormSubmitted');
        $this->addComponent($component, $name);
    }

    /**
     * Component edit form submitted handle
     * @param \Nette\Application\UI\Form $form 
     */
    public function editFormSubmitted(\Nette\Application\UI\Form $form) {
        try {
            $this->getModel()->update($this->getParam('id'), $form->getValues());
            $this->flashMessage('User was edited.');
            $this->redirect('default');
        } catch (\BrainArchitect\Exception\EntityExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }

    /**
     * Returns common forms fields to creating a new or edit record
     * @return \Nette\Application\UI\Form 
     */
    public function getForm() {
        $component = new \Nette\Application\UI\Form();
        $component->addText('username', 'Username')->setRequired('Please fill username.');
        $component->addText('email', 'Email')->setRequired('Please fill user email.')->addRule(\Nette\Application\UI\Form::EMAIL, 'Invalid email format.');

        $component->addText('name', 'Name')->setRequired('Please fill name');
        $component->addText('surname', 'Surname')->setRequired('Please fill surname');

        $component->addPassword('password', 'Password');
        $component->addPassword('password_again', 'Password again');

        $component->addCheckbox('isAdmin', 'Admin account');
        $component->addCheckbox('isActive', 'Active');

        return $component;
    }

    /*     * *************************************************************************
     * Handles 
     * ************************************************************************* */

    /**
     * Activates user account
     * @param type $id 
     */
    public function handleActivate($id) {
        
        try {
            $this->getModel()->activate($id);
            $this->flashMessage("User #{$id} was activated.");
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }

        $this->redirect('default');
    }

    /**
     * Deactivates user account
     * @param type $id 
     */
    public function handleDeactivate($id) {

        try {
            $this->getModel()->deactivate($id);
            $this->flashMessage("User #{$id} was deactivated.");
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }

        $this->redirect('default');
    }

    /**
     * Set ban of user account
     * @param type $id 
     */
    public function handleBan($id) {

        try {
            $this->getModel()->ban($id);
            $this->flashMessage("User #{$id} was banned.");
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }

        $this->redirect('default');
    }

    /**
     * Unset ban of user account
     * @param type $id 
     */
    public function handleUnban($id) {

        try {
            $this->getModel()->unban($id);
            $this->flashMessage("User #{$id} was unbanned.");
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }

        $this->redirect('default');
    }

}

