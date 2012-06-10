<?php

use \BrainArchitect\Exporters;
        
namespace BrainArchitect\Exporters\ExportProjectToXML;

class ExporterWidget extends \BrainArchitect\Exporters\AbstractExporterWidget {

    public function handleExport() {
        
        $post = $this->getPresenter()->getRequest()->getPost();        
        
        $exporter = new Exporter();
        $exporter->setData($post);
        
        $result = $exporter->export();        
        $this->template->result = $result;
        
    }
    
    public function render() {
        $template = $this->template;
        $template->setFile(dirname(__FILE__) . '/templates/default.latte');
        $template->render();
    }
    
}
