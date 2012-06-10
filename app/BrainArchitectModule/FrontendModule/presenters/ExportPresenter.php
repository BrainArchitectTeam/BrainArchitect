<?php

namespace BrainArchitectModule\FrontendModule;

class ExportPresenter extends BasePresenter {

    public function actionDefault($name) {        
        $model = $this->context->exporterModel;
        $widget = $model->getWidget($name);
        $this->addComponent($widget, 'exportWidget');
        $this->payload->showContentWindow = true;
        $this->invalidateControl('contentWindow');
    }

}

