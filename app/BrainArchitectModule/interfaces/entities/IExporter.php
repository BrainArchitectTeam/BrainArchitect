<?php

namespace BrainArchitect\Interfaces\Entities;

interface IExporter {
    
    public function isActive();
    public function getName();    
    public function getTitle();
    public function getVersion();
    public function getType();
    public function getLabel();
    public function getDescription();
    public function getFile();    
    public function getAuthor();
    
    // setters
    
    public function activate();    
    public function deactivate();    
    public function setName($name);    
    public function setTitle($title);
    public function setVersion($version);
    public function setType($type);
    public function setLabel($label);
    public function setDescription($description);
    public function setDefinitionFile($file); 
    public function setAuthor($author);
    
    
}
