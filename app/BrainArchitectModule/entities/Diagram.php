<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Diagram
 *
 * @author California
 */

/**
 * @Entity 
 * @Table(name="BA_Diagram")
 */
class Diagram extends BaseEntity implements \BrainArchitect\Interfaces\Entities\IDiagram{

    /** 
     * @Column(type="datetime") 
     */
    private $created;

    /** 
     * @Column(type="datetime") 
     */
    private $updated;

    /**
     * @column (type="string", length=255)
     * @var type 
     */
    private $title;

    /**
     * @column (type="text", nullable=true)
     * @var type 
     */
    private $description;

    /**
     * @column (type="text", nullable=true)
     * @var type 
     */
    private $content;
    
    /**
     * @manyToOne(targetEntity="Project", inversedBy="diagram")
     * @joinColumn(name="project_id", referencedColumnName="id")
     */
    private $project;
    
    /**
     * @column (type="string", length=40)
     * @var string 
     */
    private $type;
    
    /**
     * @column(type="integer")
     * @var integer
     */
    private $width;
    
    /**
     * @column(type="integer")
     * @var integer
     */
    private $height;

    public function getCreated(){
        return $this->created;
    }
    
    public function getLastUpdate(){
        return $this->updated;
    }
    
    public function getType() {
        return $this->type;
    }
    
    public function getTitle() {
        return $this->title;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getContent() {
        return $this->content;
    }
    
    public function getProject(){
        return $this->project;
    }

    public function setType($type){
        $this->type = $type;
    }
    
    public function setTitle($title) {
        $this->title = $title;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function setContent($content) {
        $this->content = $content;
    }
    
    public function setUpdated() {
        $this->updated = new \DateTime("now");
    }
    
    public function setCreated(){
        $this->created = new \DateTime("now");
    }
    
    public function setProject($project){
        $this->project = $project;
    }

    public function getHeight() {
        return $this->height;
    }

    public function getWidth() {
        return $this->width;
    }

    public function setHeight($height) {
        $this->height = $height;
    }

    public function setWidth($width) {
        $this->width = $width;
    }
    
}
