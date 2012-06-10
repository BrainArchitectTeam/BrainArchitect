<?php

use \BrainArchitect\Importers;
        
namespace BrainArchitect\Importers\ImportDiagramFromXML;

class ImporterWidget extends \BrainArchitect\Importers\AbstractImporterWidget {

    public function handleImport() {
        
        $post = $this->getPresenter()->getRequest()->getPost();        
        
        //print_r( Array ( 'adas' ) );
        
        $importer = new Importer();
        $importer->setData($post);
        
        $result = $importer->import();        
        $this->template->result = $result;
        
        $this->getPresenter()->payload->action = 'importDiagram';
        $this->getPresenter()->payload->diagramData = $result;
        $this->getPresenter()->editorMessage('Diagram was imported.');
    }
    
    public function render() {
        $template = $this->template;
        $template->setFile(dirname(__FILE__) . '/templates/default.latte');
        $template->render();
    }
    
}
