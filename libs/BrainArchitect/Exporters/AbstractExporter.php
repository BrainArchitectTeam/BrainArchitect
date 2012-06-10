<?php

namespace BrainArchitect\Exporters;

abstract class AbstractExporter implements IExporter{
    
    protected $data;
    
    public function setData($data){
        $this->data = $data;
    }
    
    public function getData(){
        return $this->data;
    }
    
    public function export(){
        throw new \Nette\NotImplementedException();
    }
    
}


