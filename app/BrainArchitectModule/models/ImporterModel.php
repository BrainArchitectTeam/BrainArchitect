<?php

/**
 * Description of ImporterModel
 *
 * @author frantatoman
 */

namespace BrainArchitect\Models;

class Importer {
    
    public function getWidget( $name ){
        
        $name = "\\BrainArchitect\\Importers\\" . ucfirst($name) . '\\ImporterWidget';
        
        if(class_exists($name) ){
            //
        }

        $widget = new $name();
        return $widget;
        
        
    }
    
}

