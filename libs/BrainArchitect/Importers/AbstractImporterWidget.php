<?php

namespace BrainArchitect\Importers;

abstract class AbstractImporterWidget extends \Nette\Application\UI\Control implements \BrainArchitect\Importers\IImporterWidget {
    
    public function handleImport(){
        throw new \Nette\NotImplementedException('Not implemented export handle.');
    }    
    
}
