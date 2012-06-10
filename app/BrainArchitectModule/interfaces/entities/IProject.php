<?php

namespace BrainArchitect\Interfaces\Entities;

interface IProject {
    
    public function getCreated();
    public function getUpdated();
    public function getTitle();
    public function getDescription();
    public function getOwner();
    public function getDiagrams();
            
    public function setTitle($title);
    public function setDescription($description);
    public function setOwner($owner);
    public function setUpdated();
    public function setCreated();
    
}
