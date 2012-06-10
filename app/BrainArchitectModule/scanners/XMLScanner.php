<?php

/**
 * Description of XML Definition of Package Scanner
 *
 * @author frantatoman
 */

namespace BrainArchitect\Scanners\DiagramPackage;

class XMLScanner extends \BrainArchitect\Scanners\FileScanner{
    
    protected $fileExp = 'definition.xml';
    
    public function getDefinitionData($file){
        
        $xmlDefinition = simplexml_load_file($file);
        
        $path = str_replace($this->fileExp, '', $file);
        
        $data = Array();
        $data['title'] = (string)$xmlDefinition->title;
        $data['author'] = (string)$xmlDefinition->author;
        $data['description'] = (string)$xmlDefinition->description;
        $data['version'] = (string)$xmlDefinition->version;
        $data['definition_file'] = $file;
        $data['type'] = (string)$xmlDefinition->type;
        
        $data['resources'] = Array();
        
        foreach( $xmlDefinition->resources as $resource ){
            $data['resources'][] = $path . $resource->item[0]['src'];
        }
        
        return $data;
        
    }
   
    
}
