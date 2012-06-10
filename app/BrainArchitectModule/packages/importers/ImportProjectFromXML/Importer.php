<?php

namespace BrainArchitect\Importers\ImportProjectFromXML;

class Importer extends \BrainArchitect\Importers\AbstractImporter {

    public function import() {
        $data = $this->getData();      
        
        $result = Array();
        
        $doc = new \DOMDocument();
        $doc->loadXML( $data['data'] );
        
        $titleElement =  $doc->getElementsByTagName( "title" );
        $descriptionElement =  $doc->getElementsByTagName( "description" );
        
        $result['title'] = $titleElement->item(0)->nodeValue;
        $result['description'] = $descriptionElement->item(0)->nodeValue;
        
        $diagramsElement = $doc->getElementsByTagName('diagram');
        
        $result['diagrams'] = null;
        
        foreach( $diagramsElement as $diagram ){
        
            $diagramData = Array();
            
            $diagramTitleElement =  $diagram->getElementsByTagName( "title" );
            $diagramDescriptionElement =  $diagram->getElementsByTagName( "description" );
            $diagramContentElement =  $diagram->getElementsByTagName( "data" );
            
            $diagramData['width'] = $diagram->attributes->getNamedItem("width")->nodeValue;
            $diagramData['height'] = $diagram->attributes->getNamedItem("height")->nodeValue;
            $diagramData['type'] = $diagram->attributes->getNamedItem("type")->nodeValue;

            $diagramData['title'] = $diagramTitleElement->item(0)->nodeValue;
            $diagramData['description'] = $diagramDescriptionElement->item(0)->nodeValue;
            $diagramData['content'] = $diagramContentElement->item(0)->nodeValue;

            $result['diagrams'][] = $diagramData;
        }
        
        return $result;
    }

}


