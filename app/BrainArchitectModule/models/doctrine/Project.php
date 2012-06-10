<?php

namespace BrainArchitect\Models\Doctrine;

class Project extends \BrainArchitect\Models\Doctrine\AbstractDoctrineCRUD implements \BrainArchitect\Interfaces\Models\IProject {
    
    protected $entityName = 'Project';    
    
    /**
     * Create a new project entity and store it into database
     * @param type $values
     * @return \BrainArchitect\Interfaces\Entities\IProject
     */
    public function create($values){
        
        $entity = new \Project();
        
        $entity->setTitle($values['title']);        
        $entity->setDescription($values['description']);
        
        $entity->setCreated();
        $entity->setUpdated();
       
        // find owner
        $userModel = new \BrainArchitect\Models\Doctrine\User($this->entityManager);
        $owner = $userModel->findById($values['owner']);
        
        if( !$owner ){
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exist!');
        } 
        
        $entity->setOwner($owner);
        
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
        
        return $entity;
    }

    public function update($id, $values) {
   
            $entity = $this->findById($id);
        
            if (!$entity) {
                throw new \BrainArchitect\Exception\EntityNotExistsException('Project does not exists!');
            }
            
            $userModel = new \BrainArchitect\Models\Doctrine\User($this->entityManager);
            $owner = $userModel->findById($values['owner']);

            if( !$owner ){
                throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exist!');
            } 

            $entity->setOwner($owner);
            $entity->setTitle($values['title']);
            $entity->setDescription($values['description']);

            $this->entityManager->flush();
            
            return $entity;
    }
    
    
}

