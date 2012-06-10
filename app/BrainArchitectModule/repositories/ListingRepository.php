<?php

/**
 * Description of ListingRepository
 *
 * @author California
 */
class ListingRepository extends \Doctrine\ORM\EntityRepository{

    public function findInRange($from, $to){
        return $this->getEntityManager()->createQuery("SELECT e FROM {$this->getEntityName()} e")->getResult();
    }
    
}

