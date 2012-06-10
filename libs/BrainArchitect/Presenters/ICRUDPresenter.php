<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author California
 */

namespace BrainArchitect;

interface ICRUDPresenter {
    
    public function actionRead($id);
    public function actionDelete($id);
    
}
