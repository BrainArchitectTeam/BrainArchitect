<?php

/**
 * @Entity
 * @Table(name="BA_Package")
 */

class Package extends BaseEntity{
    
    /**
     * @column (type="boolean")
     * @var boolean 
     */
    private $isActive;
    
    /**
     * @column (type="string", length=255)
     * @var type 
     */
    private $title;
    
    /**
     * @column(type="string", length=255)
     * @var string 
     */
    private $author;
    
    
    /**
     * @column (type="text")
     * @var string 
     */
    private $description;
    
    /**
     * @column (type="string", length=10)
     * @var string 
     */
    private $version;
    
    /**
     * @column (type="string", length=50)
     * @var string 
     */
    private $type;
    
    /**
     * @column (type="text")
     * @var string 
     */
    private $definition_file;
    
    
    public function isActive(){ return $this->isActive; }
    public function getTitle(){ return $this->title; }
    public function getDescription(){ return $this->description; }
    public function getVersion(){ return $this->version; }
    public function getType(){ return $this->type; }
    public function getDefinitionFile(){ return $this->definition_file; }
    public function getAuthor(){
        return $this->author;
    }
    
    public function activate(){ $this->isActive= true; }
    public function deactivate(){ $this->isActive = false; }
    public function setTitle($title){ $this->title= $title; }
    public function setDescription($description){ $this->description= $description; }
    public function setVersion($version){ $this->version= $version; }
    public function setType($type){ $this->type= $type; }
    public function setDefinitionFile($definitionFile){ $this->definition_file= $definitionFile; }
    public function setAuthor($author){
        $this->author = $author;
    }
    
}
