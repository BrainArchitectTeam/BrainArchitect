<?php

namespace BrainArchitect\Scanners;

abstract class FileScanner extends \Nette\Object implements \BrainArchitect\Scanners\IScanner{

    private $dirPath;
    protected $fileExp;
    
    public function __construct($dirPath = ''){
        $this->setDirectory($dirPath);
    }
    
    public function scan() {
        
        if(!file_exists($this->getDirectory())){
            throw new \BrainArchitect\Exception\ScannerException('Directory ' . $this->getDirectory() . ' not found.');
        }
        
        
        $result = Array();
        
        $files = \Nette\Utils\Finder::findFiles($this->getFileExp())->from($this->getDirectory());
        
        foreach($files as $file){
            $result[] = $this->getDefinitionData($file);
        }
        
        return $result;
    }
    
    public function getDirectory(){
        return $this->dirPath;
    }
    
    public function setDirectory($dirPath) {
        $this->dirPath = $dirPath;
    }
    
    protected function findFiles(){
        
    }
    
    protected function getFileExp(){
        return $this->fileExp;
    }
    
    abstract protected function getDefinitionData($file);
    
}

