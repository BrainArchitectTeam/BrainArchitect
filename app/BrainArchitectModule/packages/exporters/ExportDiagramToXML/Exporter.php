<?php

namespace BrainArchitect\Exporters\ExportDiagramToXML;

class Exporter extends \BrainArchitect\Exporters\AbstractExporter {

    public function export() {
        $data = $this->getData();      
        
        $doc = new \DOMDocument();
        $doc->formatOutput = true;
        
        $root = $doc->createElement('diagram');
        $doc->appendChild($root);
        
        $root->setAttribute("width", $data['width']);
        $root->setAttribute("height", $data['height']);
        $root->setAttribute("type", $data['type']);
        
        $title = $doc->createElement('title');
        $title->appendChild( $doc->createTextNode($data['title']) );
        
        $description = $doc->createElement('description');
        $description->appendChild( $doc->createTextNode($data['description']) );
        
        $dataStr = $data['data'];
        $data = $doc->createElement('data');
        $data->appendChild( $doc->createCDATASection($dataStr) );

        $root->appendChild($title);
        $root->appendChild($description);
        $root->appendChild($data);
        
        return $doc->saveXML();
    }

}


