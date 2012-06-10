<?php

namespace BrainArchitect\Exporters\ExportProjectToXML;

class Exporter extends \BrainArchitect\Exporters\AbstractExporter {

    public function export() {
        
        $data = $this->getData();      
        
        //print_r($data);
        
        $doc = new \DOMDocument();
        $doc->formatOutput = true;
        
        $root = $doc->createElement('project');
        $doc->appendChild($root);
        
        $title = $doc->createElement('title');
        $title->appendChild( $doc->createTextNode($data['project']['title']) );
        
        $description = $doc->createElement('description');
        $description->appendChild( $doc->createTextNode($data['project']['description']) );
        
        $root->appendChild( $title );
        $root->appendChild( $description );
        
        if( isset($data['diagrams']) ){
            $diagrams = $data['diagrams'];

            $diagramsElement = $doc->createElement('diagrams');
            $root->appendChild($diagramsElement);
            
            foreach($diagrams as $diagram){
                $this->appendDiagram($doc, $diagramsElement, $diagram);
            }
        }
        
        return $doc->saveXML();
    }
    
    private function appendDiagram (&$doc, &$parent, $data){
        
        $root = $doc->createElement('diagram');
        
        $root->setAttribute("width", $data['width']);
        $root->setAttribute("height", $data['height']);
        $root->setAttribute("type", $data['type']);
        
        $title = $doc->createElement('title');
        $title->appendChild( $doc->createTextNode($data['title']) );
        
        $description = $doc->createElement('description');
        $description->appendChild( $doc->createTextNode($data['description']) );
        
        $dataStr = $data['content'];
        $data = $doc->createElement('data');
        $data->appendChild( $doc->createCDATASection($dataStr) );

        $root->appendChild($title);
        $root->appendChild($description);
        $root->appendChild($data);
        
         
        $parent->appendChild($root);
        
    }

}


