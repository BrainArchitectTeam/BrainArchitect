<?php

/**
 * Description of ThreadRepository
 *
 * @author California
 */

class ThreadRepository extends \Doctrine\ORM\EntityRepository{

    public function findAllThreadsByUser($user){
        
        return $this->getEntityManager()->createQuery("SELECT th FROM MessageThread th
                                                       LEFT JOIN th.recipients thr
                                                       WHERE thr.user=:user")->setParameter('user', $user)->getResult();        
    }
    
}

