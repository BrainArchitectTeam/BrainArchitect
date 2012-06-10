<?php

namespace BrainArchitect\Models\Doctrine;

use \Doctrine\ORM\EntityManager,
        \BrainArchitect\Interfaces\Entities\IIdentityEntity;

abstract class AbstractDoctrineCRUD extends \Nette\Object implements \BrainArchitect\Interfaces\Models\ICRUD{
    
    /**
     * Store entity name
     */
    protected $entityName = null;
    
    /**
     * Entity manager to manipulate with entities
     * @var Doctrine\ORM\EntityManager 
     */
    protected $entityManager = null;
    
    public function __construct(\Doctrine\ORM\EntityManager $entityManager) {
        $this->entityManager = $entityManager;
    }       
    
    /**
     * Delete record by identifier
     * @param type $identifier 
     */
    public function delete($identifier) {        
        
        $entity = $this->findById($identifier);                                  // find entity specified by id
        
        if( !$entity ){        
            throw new \BrainArchitect\Exception\EntityNotExistsException('Entity does not exists!');
        }
        
        $this->entityManager->remove($entity);                                  // remove entity
        $this->entityManager->flush();                                          // do everything you need
    }
    
    
    /**
     * Returns record by identifier
     * @param type $identifier
     * @return $entityName 
     */
    public function findById( $identifier ) {          
        return $this->entityManager->find($this->getEntityName(), $identifier);
    }
    
    public function findAll(){
        return $this->entityManager->getRepository($this->getEntityName())->findAll();
    }
    
    public function findInRange($from, $to){
        return $this->entityManager->getRepository($this->getEntityName())->findInRange($from, $to);
    }
    
    public function findBy(Array $params){
        return $this->entityManager->getRepository($this->getEntityName())->findBy($params);
    }
    
    public function findOneBy(Array $params){
        return $this->entityManager->getRepository($this->getEntityName())->findOneBy($params);
    }
    
    /**
     * Returns Entity Name
     * @return String
     * @throws Exception 
     */
    protected function getEntityName(){
        
        if( !$this->entityName ){
            throw new Exception('Entity of '. $this->getReflection()->getName() .' model is not specified.');
        }
        
        return $this->entityName;
    }
    
    
    
}

