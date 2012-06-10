<?php

namespace BrainArchitect\Models\Doctrine;

class Package extends \BrainArchitect\Models\Doctrine\AbstractDoctrineCRUD {

    protected $entityName = 'Package';
    protected $path = '';
    
    public function __construct(\Doctrine\ORM\EntityManager $entityManager) {
        $this->entityManager = $entityManager;
        $this->path = APP_DIR . '/BrainArchitectModule/packages/';
    }     
    
    /**
     * Create a new project entity and store it into database
     * @param type $values
     * @return \BrainArchitect\Interfaces\Entities\IDiagramType
     */
    public function create($values) {

        $entity = new \Package();

        $entity->setDefinitionFile($values['definition_file']);
        $entity->setTitle($values['title']);
        $entity->setVersion($values['version']);
        $entity->setDescription($values['description']);
        $entity->setType($values['type']);
        $entity->setAuthor($values['author']);
        $entity->deactivate();

        \Nette\Diagnostics\Debugger::fireLog('ADDD');
        
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return $entity;
    }
    
    public function update($id, $values){
    
        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Entity does not exists!');
        }
        
        $entity->setDefinitionFile($values['definition_file']);
        $entity->setTitle($values['title']);
        $entity->setVersion($values['version']);
        $entity->setDescription($values['description']);
        $entity->setType($values['type']);
        $entity->setAuthor($values['author']);
        
        if( isset( $values['active'] ) ){        
            $entity->deactivate();
        }else{
            $entity->activate();
        }

        $this->entityManager->flush();
        
    }
    
    public function activate($id){
        $entity = $this->findById($id);
        
        if(!$entity){
            throw new \BrainArchitect\Exception\EntityNotExistsException('Entity does not exists!');
        }
        
        $entity->activate();   
        $this->entityManager->flush();
    }
    
    public function deactivate($id){
        $entity = $this->findById($id);
        
        if(!$entity){
            throw new \BrainArchitect\Exception\EntityNotExistsException('Entity does not exists!');
        }
        
        $entity->deactivate();  
        $this->entityManager->flush();
    }
    
    public function scan(){

        $path = $this->getPath();
        $directories = Array(
            $path . 'diagrams/',
            $path . 'exporters/',
            $path . 'importers/'
        );
        
        $xmlScanner = new \BrainArchitect\Scanners\DiagramPackage\XMLScanner();
        
        $newPackages = Array();
        
        foreach($directories as $directory){
            
            $xmlScanner->setDirectory( $directory );
            $result = $xmlScanner->scan();
            
            \Nette\Diagnostics\Debugger::fireLog($result);
            
            foreach($result as $item){
                
                $entity = $this->findOneBy(Array( 'definition_file' => $item['definition_file']));
                
                if( !$entity ){
                    $this->create($item);
                    $newPackages[] = $item['title'];
                }        
                
                $entity = null;
            }           
            
        }
        
        return $newPackages;
    }
    
    /**
     * Build final javascript file 
     * All of resources code merge into one 
     */
    
    public function build(){
        
        $path = $this->getPath();                                          // path to resources
        $corePath = $path . 'core/';
        
        $fileMerger = new \FileMerger();

        // adding core files
        $fileMerger->addFiles(Array(
            'jquery-validation-engine' => $corePath . "jquery.validationEngine.js",
            'jquery-validation-engine-en' => $corePath . "jquery.validationEngine-en.js",
            'json2' => $corePath . "json2-min.js",
            'raphael-library' => $corePath . "raphael.js",
            'joint-js' => $corePath . "joint.js",
            'joint-js-dia' => $corePath . "joint.dia.js",
            'joint-js-dia-serializer' => $corePath . "joint.dia.serializer.js",
            'joint-js-dia-arrows' => $corePath . "joint.arrows.js",
            'brain-architect-core' => $corePath . "brainarchitect.core.js",
            'joint-js-dia-gui' => $corePath . "joint.dia.gui.js",
            'brain-architect-application' => $corePath . "brainarchitect.application.js",
            'brain-architect-tools' => $corePath . "brainarchitect.tools.js",
            'brain-architect-relationships' => $corePath . "brainarchitect.relationships.js"
        ));
        
        // add active packages from database
        $packages = $this->findBy(Array('isActive' => true));
        $xmlScanner = new \BrainArchitect\Scanners\DiagramPackage\XMLScanner();
        
        foreach( $packages as $package ){
            $definition = $xmlScanner->getDefinitionData($package->getDefinitionFile());
            foreach($definition['resources'] as $source){
                $fileMerger->addFile($source);
            }
        }
        
        $fileMerger->mergeTo(WWW_DIR . '/public/ba/js/last.build.js');
    }
    
    private function getPath(){
        return $this->path;
    }
    
}
