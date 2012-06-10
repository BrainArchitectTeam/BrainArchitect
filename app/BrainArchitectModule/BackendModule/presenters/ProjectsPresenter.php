<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProjectsPresenter
 *
 * @author California
 */

namespace BrainArchitectModule\BackendModule;

class ProjectsPresenter extends CRUDPresenter{
    
    protected function startup(){
        parent::startup();        
        $this->model = $this->context->projectModel;
    }
    
    /***************************************************************************
     * Actions 
     * ************************************************************************* */
    
    public function actionDefault(){
        $this->template->list = $this->model->findAll();
    }   
    
    public function actionEdit($id){
        
        try{
            
            $model = $this->getModel();
            $entity = $model->findById($id);
            
            $owner = $entity->getOwner() ? $entity->getOwner()->getId() : null;
            
            $data = Array(
                "title" => $entity->getTitle(),
                "description" => $entity->getDescription(),
                "owner" => $owner
            );
            
            $this['editForm']->setDefaults($data);
            
        }catch(\BrainArchitect\Exception\EntityNotExistsException $e){
            $this->flashMessage($e->getMessage());
            $this->redirect('default');
        }
        
    }
    
    /***************************************************************************
     * Components 
     * ************************************************************************* */
    
    /**
     * TODO: description
     * @param type $name 
     */
    public function createComponentNewForm($name){
        $component = $this->getForm();     
        $component->addSubmit('create', 'Create'); 
        $component->onSuccess[] = callback($this, 'createFormSubmitted');
        $this->addComponent($component, $name);
    }
    
    /**
     * TODO: DESCRIPTION
     * @param \Nette\Application\UI\Form $form
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function createFormSubmitted(\Nette\Application\UI\Form $form){
        
        try{            
            $values = $form->getValues();                        
            $this->getModel()->create($values);                                    
            $this->flashMessage('Project was created.');
            $this->redirect('default');

        }catch(\BrainArchitect\Exception\EntityNotExistsException $e){
            $this->flashMessage($e->getMessage(), 'error');
            
        }
        
    }
    
    public function createComponentEditForm($name){
        $component = $this->getForm();  
        $component->addSubmit('edit', 'Edit'); 
        $component->onSuccess[] = callback($this, 'editFormSubmitted');
        $this->addComponent($component, $name);
    }
    
    public function editFormSubmitted(\Nette\Application\UI\Form $form){
        
        try{            
            $values = $form->getValues();
            $this->getModel()->update($this->getParam('id'), $values);            
            $this->flashMessage('Project was edited.');
            $this->redirect('default');
        }catch(\BrainArchitect\Exception\EntityNotExistsException $e){
            $this->flashMessage($e->getMessage(), 'error');
        }
        
    }
       
    public function getForm(){
        
        $component = new \Nette\Application\UI\Form();                  
        $component->addText('title', 'Title')->setRequired('Please fill title.');
        $component->addTextarea('description', 'Description');
                
        $users = $this->context->userModel->findAll();
        
        $selectUsers = Array();
        if($users){
            foreach($users as $user){
                $selectUsers[$user->getId()]  = $user->getUsername();
            }
        }
        
        $component->addSelect('owner', 'Owner', $selectUsers);
        
        return $component;
    }
    
}

