<?php

use \BrainArchitect\Exporters;
        
namespace BrainArchitect\Exporters\ExportDiagramToImage;

class ExporterWidget extends \BrainArchitect\Exporters\AbstractExporterWidget {

    public function handleExport() {
        
        $post = $this->getPresenter()->getRequest()->getPost();        
        $format = $this->getParam('format');
        
        $exporter = new Exporter();
        $exporter->setData(Array(
            "svg" => $post['data'],
            "format" => $format
        ));
        
        $result = $exporter->export();
        $result = 'data:image/'.$format.';base64,'.base64_encode($result);
        
        $this->template->result = $result;
        
    }
    
    public function render() {
        $template = $this->template;
        $template->setFile(dirname(__FILE__) . '/templates/default.latte');
        $template->render();
    }
    
}
