<?php

namespace BrainArchitectModule\FrontendModule;

class ImportPresenter extends BasePresenter{

    public function actionDefault($name) {
        
        $model = $this->context->importerModel;
        $widget = $model->getWidget($name);
        $this->addComponent($widget, 'importWidget');
        $this->payload->showContentWindow = true;

        $this->invalidateControl('contentWindow');
        
    }
    
}

