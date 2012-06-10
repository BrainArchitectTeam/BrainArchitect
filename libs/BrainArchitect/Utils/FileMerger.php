<?php

/**
 * Description of FileMerger
 * 
 * @author Franta Toman
 */

use Nette\Utils\Finder;

final class FileMerger extends \Nette\Object{
    
    /**
     * Store files to merge
     * @var Array of string 
     */
    private $files = Array();
    
    /**
     * Add one file
     * @param string $filePath 
     */
    public function addFile($filePath){
        $this->files[] = $filePath;
    }
    
    /**
     * Add array of files
     * @param array $files 
     */
    public function addFiles(Array $files){
        if( count($files) ){
            foreach($files as $file){
                array_push($this->files, $file);
            }
        }
    }
    
    /**
     * Returns all added files
     * @return Array 
     */
    public function getFiles(){
        return $this->files;
    }
    
    /**
     * Merge all added files
     * @param string $outputFile
     * @return  
     */
    public function mergeTo($outputFile){
        
        if(!$outputFile){
            return;
        }
        
        $output = fopen($outputFile, 'w+');
        $files = $this->getFiles();   
        if( count($files) ){
            foreach($files as $file){                   
                if(file_exists($file)){ 
                       $content = file_get_contents($file);
                       fputs($output, $content);                    
                }
            }
        }  
        
        fclose($output);
    }
    
}


