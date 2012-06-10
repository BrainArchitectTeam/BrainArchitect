<?php

namespace BrainArchitect\Interfaces\Models;

interface ICRUD {

    public function create( $values );   
    public function update($id, $values );    
    public function delete($identifier);
   
    public function findAll();
    public function findById($identifier);
    public function findInRange($from, $to);
    public function findBy(Array $params);
    public function findOneBy(Array $params);
   
}
