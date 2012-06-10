<?php

namespace BrainArchitectModule\FrontendModule;

class BasePresenter extends \Nette\Application\UI\Presenter{
    
    public function actionDefault($name){
        
        
        
    }
    
    public function handleExport($data){
        
        
        
    }
    
    /**
     * Assing message to payload of editor messages
     * @param type $text
     * @param type $type 
     */
    public function editorMessage($text, $type = 'info') {
        $this->payload->messages[] = Array('text' => $text, 'type' => $type);
    }
    
}
