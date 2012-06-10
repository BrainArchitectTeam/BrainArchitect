<?php

/**
 * Base Entity Class
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

/** @MappedSuperclass */
abstract class BaseEntity implements BrainArchitect\Interfaces\Entities\IIdentityEntity{
    
    /**
     * @id @column(type="integer")
     * @GeneratedValue
     */
    private $id;
    
    /** GETTERS */
    
    /**
     * Returns diagram id
     * @return integer
     */
    public function getId() {
        return $this->id;
    }
    
}
