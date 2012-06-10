<?php

namespace BrainArchitect\Interfaces\Entities;

interface IDiagram {

    public function getCreated();    
    public function getLastUpdate();    
    public function getTitle() ;
    public function getDescription() ;
    public function getContent() ;    
    public function getProject();
    public function getWidth();
    public function getHeight();
    
    public function setTitle($title);
    public function setDescription($description);
    public function setContent($content);    
    public function setUpdated();    
    public function setCreated();    
    public function setProject($project);
    public function setWidth($width);
    public function setHeight($height);
    
}

