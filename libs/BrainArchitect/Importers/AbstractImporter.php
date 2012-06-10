<?php

namespace BrainArchitect\Importers;

abstract class AbstractImporter implements IImporter{
    
    protected $data;
    
    public function setData($data){
        $this->data = $data;
    }
    
    public function getData(){
        return $this->data;
    }
    
    public function import(){
        throw new \Nette\NotImplementedException();
    }
    
}


