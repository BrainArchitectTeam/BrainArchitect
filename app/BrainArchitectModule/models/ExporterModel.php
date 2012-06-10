<?php

/**
 * Description of ExporterModel
 *
 * @author frantatoman
 */

namespace BrainArchitect\Models;

class Exporter {
    
    public function getWidget( $name ){
        
        $name = "\\BrainArchitect\\Exporters\\" . ucfirst($name) . '\\ExporterWidget';
        
        
        if(class_exists($name) ){
            //
        }

        $widget = new $name();
        return $widget;
        
    }
    
}

