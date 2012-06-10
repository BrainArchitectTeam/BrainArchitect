<?php

namespace BrainArchitect\Interfaces\Entities;

interface IDiagramType {

    public function isActive();
    public function getTitle();
    public function getDescription();
    public function getVersion();
    public function getType();
    public function getDefinitionFile();
    public function getAuthor();
    
    public function activate();
    public function deactivate();
    public function setTitle($title);
    public function setDescription($description);
    public function setVersion($version);
    public function setType($type);
    public function setDefinitionFile($definitionFile);
    public function setAuthor($author);
    
}

