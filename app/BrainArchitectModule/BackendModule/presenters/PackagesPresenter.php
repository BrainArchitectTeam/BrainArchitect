<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PackagesPresenter
 *
 * @author California
 */

namespace BrainArchitectModule\BackendModule;

class PackagesPresenter extends CRUDPresenter {

    protected function startup(){
        parent::startup();        
        $this->model = $this->context->packageModel;
    }

    /*     * *************************************************************************
     * Actions 
     * ************************************************************************* */

    public function actionDefault() {
        $this->template->list = $this->context->packageModel->findAll();
    }

    /*     * *************************************************************************
     * Handles 
     * ************************************************************************* */

    public function handleActivate($id) {
        $this->getModel()->activate($id);
        $this->flashMessage('Diagram package was activated.');
        $this->redirect('default');
    }

    public function handleDeactivate($id) {
        $this->getModel()->deactivate($id);
        $this->flashMessage('Diagram package was deactivated.');
        $this->redirect('default');
    }

    public function handleScan() {
        $packages = $this->getModel()->scan();
        
        if( count($packages) ){
            foreach($packages as $package){
                $this->flashMessage('New package: ' . $package, 'info');
            }
        }else{
                $this->flashMessage('Count of new packages: 0');
        }
        
        $this->redirect('default');
    }
    
    public function handleRebuild(){
        $this->getModel()->build();
        $this->flashMessage('Application package was rebuilt.');
        $this->redirect('default');
    }

}

