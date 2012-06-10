<?php

namespace BrainArchitect\Importers\ImportDiagramFromXML;

class Importer extends \BrainArchitect\Importers\AbstractImporter {

    public function import() {
        $data = $this->getData();      
        
        $result = Array();
        
        $doc = new \DOMDocument();
        $doc->loadXML( $data['data'] );
        
        $diagramElement = $doc->getElementsByTagName('diagram');
        $titleElement =  $doc->getElementsByTagName( "title" );
        $descriptionElement =  $doc->getElementsByTagName( "description" );
        $dataElement =  $doc->getElementsByTagName( "data" );
        
        $result['width'] = $diagramElement->item(0)->attributes->getNamedItem("width")->nodeValue;
        $result['height'] = $diagramElement->item(0)->attributes->getNamedItem("height")->nodeValue;
        $result['type'] = $diagramElement->item(0)->attributes->getNamedItem("type")->nodeValue;

        $result['title'] = $titleElement->item(0)->nodeValue;
        $result['description'] = $descriptionElement->item(0)->nodeValue;
        $result['content'] = $dataElement->item(0)->nodeValue;
        
        return $result;
    }

}


