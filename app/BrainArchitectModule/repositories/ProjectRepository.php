<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProjectRepository
 *
 * @author California
 */
class ProjectRepository extends ListingRepository{

    public function findAllUserProjects($user){
        return $this->getEntityManager()->createQuery("SELECT pr FROM Project pr                                                       
                                                       WHERE pr.owner=:owner")->setParameter('owner', $user)->getResult();
    }
    
}
