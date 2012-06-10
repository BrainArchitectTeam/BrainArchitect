<?php

namespace BrainArchitect\Models\Doctrine;

class Diagram extends \BrainArchitect\Models\Doctrine\AbstractDoctrineCRUD {

    protected $entityName = 'Diagram';

    /**
     * Create a new diagram entity and store it into database
     * @param type $values
     * @return \BrainArchitect\Interfaces\Entities\IDiagram
     */
    public function create($values) {

        $diagram = new \Diagram();

        $diagram->setContent($values['content']);
        $diagram->setTitle($values['title']);
        $diagram->setDescription($values['description']);
        
        $projectModel = new \BrainArchitect\Models\Doctrine\Project($this->entityManager);
        $project = $projectModel->findById($values['project']);
        
        if (!$project) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Project does not exists!');
        }
        
        $diagram->setProject($project);
        
        
        $diagram->setType($values['type']);
        $diagram->setWidth($values['width']);
        $diagram->setHeight($values['height']);
        $diagram->setUpdated();
        $diagram->setCreated();

        $this->entityManager->persist($diagram);
        $this->entityManager->flush();

        return $diagram;
    }

    public function update($id, $values) {

        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Entity does not exists!');
        }
        
        $entity->setContent($values['content']);
        $entity->setTitle($values['title']);
        $entity->setDescription($values['description']);       
        
        $projectModel = new \BrainArchitect\Models\Doctrine\Project($this->entityManager);
        $project = $projectModel->findById($values['project']);
        
        if (!$project) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Project does not exists!');
        }
        
        $entity->setProject($project);
        
        $entity->setType($values['type']);
        $entity->setWidth($values['width']);
        $entity->setHeight($values['height']);
        $entity->setUpdated();

        $this->entityManager->flush();
        
        return $entity;
    }

    public function updateDiagramSettings($id, $title, $description, $width, $height) {

        $diagram = $this->findById($id);

        if (!$diagram) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Entity does not exists!');
        }

        $diagram->setTitle($title);
        $diagram->setDescription($description);
        $diagram->setWidth($width);
        $diagram->setHeight($height);

        $this->entityManager->flush();
    }

}

