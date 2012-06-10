<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Project
 *
 * @author California
 */

/**
 * @Entity(repositoryClass="\ProjectRepository")
 * @Table(name="BA_Project")
 */
class Project extends BaseEntity implements BrainArchitect\Interfaces\Entities\IProject{
    
    /**
     * @column (type="string", length=255)
     * @var type 
     */
    private $title;
    
    /**
     * @column (type="text")
     * @var type 
     */
    private $description;
    
    /** 
    * @ManyToOne(targetEntity="User", inversedBy="projects")
    * @JoinColumn(name="user_id", referencedColumnName="id")
    */ 
    private $owner;
    
    
    /** @Column(type="datetime") */
    private $created;

    /** @Column(type="datetime") */
    private $updated;
    
    /**
     * @OneToMany(targetEntity="Diagram", mappedBy="project", cascade={"persist","remove"})
     * @orderBy({"created" = "DESC", "id" = "ASC"})
     */
    private $diagrams;
    
    public function __construct() {
        $this->diagrams = new Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function getCreated(){return $this->created;}
    public function getUpdated(){return $this->updated;}
    public function getTitle(){ return $this->title; }
    public function getDescription(){return $this->description;}
    public function getOwner(){ return $this->owner; }
    public function getDiagrams(){ return $this->diagrams; }
            
    public function setTitle($title){ $this->title = $title; }
    public function setDescription($description){ $this->description = $description; }
    public function setOwner($owner){ $this->owner = $owner; }
    public function setUpdated() { $this->updated = new \DateTime("now"); }    
    public function setCreated(){ $this->created = new \DateTime("now"); }
    

    
}

