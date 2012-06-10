<?php

namespace BrainArchitect\Exporters\ExportDiagramToImage;

class Exporter extends \BrainArchitect\Exporters\AbstractExporter{

    public function export() {

        $data = $this->getData();
        
        $svg = $data['svg'];
        $svg = str_replace(Array(
                'Arial',
                'Arial'
            
            ), 'webfontWLF9Q09S', $svg);
        
        $format = $data['format'];

        if ($svg == '') {
            return '';
        }
        
        $im = new \Imagick();
        $im->setFont('Nimbus-Sans-Regular');       
        
        $im->readimageblob('<?xml version="1.0" encoding="UTF-8" standalone="no"?>' .$svg);
        $im->borderImage('black', 1, 1);
        $im->setimageformat($format);
        //$im->drawimage(  $frame );
    
        return $im;
    }
    
}
