<?php

namespace BrainArchitect\Exporters;

class AbstractExporterWidget extends \Nette\Application\UI\Control implements \BrainArchitect\Exporters\IExporterWidget {
    public function handleExport(){
        throw new \Nette\NotImplementedException('Not implemented export handle.');
    }
    
}
