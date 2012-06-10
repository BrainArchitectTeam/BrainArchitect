<?php

/**
 * Description of CRUDPresenter
 *
 * @author California
 */

namespace BrainArchitectModule\BackendModule;

abstract class CRUDPresenter extends SecuredPresenter {
 
    /**
     * 
     * @var \BrainArchitect\Interfaces\Models\ICRUD 
     */
    protected $model = null;    
    
    /**
     * 
     * @return BrainArchitect\Interfaces\Models\ICRUD
     */
    protected function getModel(){
        
        if($this->model == null){
            throw new Exception('Model was not specified ... ');
        }
        
        return $this->model;
    }
    
    public function actionDelete($id){
        $this->getModel()->delete($id);
        $this->flashMessage('Item was deleted');
        $this->redirect('default');        
    }
    
    public function actionDetail($id){
        $this->template->entityDetail = $this->getModel()->findById($id);
    }
   
    
}
