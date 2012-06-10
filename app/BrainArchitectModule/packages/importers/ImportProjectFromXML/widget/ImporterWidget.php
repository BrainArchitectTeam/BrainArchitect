<?php

use \BrainArchitect\Importers;
        
namespace BrainArchitect\Importers\ImportProjectFromXML;

class ImporterWidget extends \BrainArchitect\Importers\AbstractImporterWidget {

    public function handleImport() {
        
        $post = $this->getPresenter()->getRequest()->getPost();        

        $importer = new Importer();
        $importer->setData($post);
        
        $result = $importer->import();        
        
        $this->getPresenter()->payload->action = 'importProject';
        $this->getPresenter()->payload->projectData = $result;
        $this->getPresenter()->editorMessage('Project was imported.');
    }
    
    public function render() {
        $template = $this->template;
        $template->setFile(dirname(__FILE__) . '/templates/default.latte');
        $template->render();
    }
    
}
