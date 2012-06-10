<?php

/**
 * Description of WorkspacePresenter
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

namespace BrainArchitectModule\FrontendModule;

use Nette\Application\UI\Form,
    BrainArchitect\Security\SecurityHelper as SH;

class WorkspacePresenter extends BasePresenter {

    protected function startup() {
        parent::startup();
        //$this->checkBrowser();
        $this->assignUser();
        $this->invalidateControl('contentWindowFlashes');
    }

    /** ACTIONS */
    public function actionAccountSettings() {

        if (!$this->checkIsAllowed('Account settings')) {
            $this->payload->showContentWindow = false;
            return;
        }

        $user = $this->getCurrentUserEntity();                                      // get current user entity

        if ($user) {                                                                // if entity exists
            $data = Array(// fill data
                "email" => $user->getEmail(), // * email
                "name" => $user->getName(), // * name
                "surname" => $user->getSurname()                                // * surname
            );

            $this['accountSettingsForm']->setDefaults($data);                   // set default values
        }

        $this->payload->showContentWindow = true;
        $this->invalidateControl('contentWindow');                                  // invalidate control window
    }

    /** COMPONENTS */

    /**
     * Login form
     * @param type $name 
     */
    public function createComponentLoginForm($name) {

        $loginForm = new \Nette\Application\UI\Form();

        $loginForm->addText('login')->setRequired('Please, fill your username.')->setAttribute('placeholder', 'Username or email');
        $loginForm->addPassword('password')->setRequired('Please, fill your password')->setAttribute('placeholder', 'Password');
        $loginForm->addSubmit('signin', 'Sign In');
        $loginForm->addCheckbox('remember_me', "Remember me");

        $loginForm->onSuccess[] = callback($this, 'loginFormSubmitted');

        $this->addComponent($loginForm, $name);
    }

    public function createComponentAccountSettingsForm($name) {

        $accountSettingsForm = new \Nette\Application\UI\Form();
        $accountSettingsForm->getElementPrototype()->class('ajax');

        $accountSettingsForm->addText('email', 'Email')->setRequired('Please, fill your email.')->addRule(Form::EMAIL, 'Wrong email format.');
        $accountSettingsForm->addText('name', 'Name')->setRequired('Please, fill your name.');
        $accountSettingsForm->addText('surname', 'Surname')->setRequired('Please, fill your surname.');

        $accountSettingsForm->addPassword('password', 'Password')->addCondition(Form::FILLED, true)->addRule(FORM::MIN_LENGTH, 'Password must have minimal 8 characters.', 8);
        $accountSettingsForm->addPassword('password_repeat', 'Password again')->addRule(Form::EQUAL, 'Password are not equal.', $accountSettingsForm['password']);

        $accountSettingsForm->addSubmit('save', 'Save settings');

        $accountSettingsForm->onSuccess[] = callback($this, 'accountSettingsFormSubmitted');
        $this->addComponent($accountSettingsForm, $name);
    }

    /**
     * Login form submitted
     * @param Form $form 
     */
    public function loginFormSubmitted(\Nette\Application\UI\Form $form) {

        try {

            $values = $form->getValues();
            $authenticator = new \BrainArchitect\Security\Authenticator($this->context->userModel);
            $this->getUser()->setAuthenticator($authenticator);

            if ($values->remember_me) {
                $this->getUser()->setExpiration('+ 14 days', FALSE);
            } else {
                $this->getUser()->setExpiration('+ 2 hours', TRUE);
            }

            $this->getUser()->login($values->login, $values->password);

            $this->invalidateControl();                                         // content invalidate
            $this->payload->showLoginForm = false;
            $this->editorMessage('You are logged in. Enjoy the Brain Architect!', 'info');

            $this->assignUser();
        } catch (\Nette\Security\AuthenticationException $e) {
            $this->flashMessage($e->getMessage() . ' <a target="_blank" class="external" href="' . $this->getPresenter()->link(':Account:forgotPassword') . '">Forgot password?</a>', 'login-error');
            $this->invalidateControl();                                         // content invalidate
        }
    }

    /**
     * Account settings form submitted
     * @param \Nette\Application\UI\Form $form 
     */
    public function accountSettingsFormSubmitted(\Nette\Application\UI\Form $form) {


        $user = $this->getCurrentUserEntity();
        $values = $form->getValues();

        if ($user) {
            try {
                $this->context->userModel->updateUserSettings( $this->getUser()->getId(), $values );
                $this->flashMessage('Settings was updated.', 'contentWindowInfo');
            } catch (\BrainArchitect\Exception\EntityExistsException $e) {
                $this->flashMessage($e->getMessage(), 'contentWindowError');
            }
        }

        $this->invalidateControl('contentWindow');
    }

    /*************************************************************************** 
     * HANDLES 
     **************************************************************************/

    public function handleLogout() {
        if ($this->getUser()->isLoggedIn()) {                                       // if is user logged
            $this->getUser()->logout(TRUE);                                         // log out them
        }

        $this->invalidateControl();                                                 // invalidate control
        $this->payload->showLoginForm = true;                                       // show login form
        $this->template->user = null;                                               // remove user entity from template
    }

    /** MISC */

    /**
     * Check if browser is supported
     * @return boolean 
     */
    protected function checkBrowser() {

        $userAgent = $_SERVER['HTTP_USER_AGENT'];                                       // user agent header

        if ((strpos($userAgent, 'Gecko') && strpos($userAgent, 'Firefox'))              // if browser is Firefox or Chrome
                || (strpos($userAgent, 'Gecko') && strpos($userAgent, 'Chrome'))) {
            return true;                                                                // continue
        }

        $this->redirect('BadBrowser:default');                                          // else redirect to bad browser page
    }

    /**
     *  Assign current user entity into template 
     */
    protected function assignUser() {
        $this->template->user = $this->getCurrentUserEntity();                          // assign current user entity into template     
    }

    /**
     * Returns current user entity
     * @return \User
     */
    protected function getCurrentUserEntity() {

        $user = $this->getUser();                                                       // get currenet user

        if ($user->isLoggedIn()) {                                                      // if is user logged                            
            return $this->context->userModel->findById($user->getId());
        }

        return null;
    }

    /**************************************************************************** 
     * PROJECT
     * ************************************************************************** */

    /**
     * Handle creates a new diagram and send its ID
     * @param type $title
     * @param type $description 
     */
    public function handleCreateProject($title, $description, Array $diagrams = null) {

        $this->payload->action = 'createProject';
        $this->payload->result = false;

        if (!$this->checkIsAllowed('Save new project')) {
            return;
        }

        $values = Array(
            "title" => $title,
            "description" => $description,
            "owner" => $this->getCurrentUserEntity()->getId()
        );

        $project = $this->context->projectModel->create($values);

        $this->payload->diagrams = null;

        if ($diagrams) {

            $this->payload->diagrams = Array();

            foreach ($diagrams as $key => $diagram) {
                $this->payload->diagrams[$key] = null;

                if ($diagram != null) {
                    $diagram['project'] = $project->getId();
                    $diagramEntity = $this->context->diagramModel->create($diagram);
                    $this->payload->diagrams[$key] = $diagramEntity->getId();
                }
            }
        }

        $this->payload->projectId = $project->getId();
        $this->payload->result = true;

        $this->editorMessage('Project saved.');
    }

    public function handleSaveProject($projectId, $title, $description, Array $diagrams = null) {

        try {
            $this->payload->action = 'saveProject';
            $this->payload->result = false;

            if (!$this->checkIsAllowed('Save project')) {
                return;
            }

            $project = $this->findProject($projectId);
            if ($project->getOwner()->getId() != $this->getUser()->getId()) {
                throw new \BrainArchitect\Exception\AuthorizationException('You are not owner of this project!');
            }

            $data = Array(
                'title' => $title,
                'description' => $description,
                'owner' => $this->getUser()->getId()
            );
            
            $this->context->projectModel->update($projectId, $data);

            if ($diagrams) {
                foreach ($diagrams as $key => $diagram) {
                    $this->payload->diagrams[$key] = null;

                    if ($diagram != null) {

                        $diagramEntity = null;

                        if ($diagram['id'] > 0) {                                     // if diagram has id, probadly is stored in database
                            $diagram['project'] = $projectId;
                            $diagramEntity = $this->context->diagramModel->update($diagram['id'], $diagram);
                        } else {
                            $diagram['project'] = $projectId;
                            $diagramEntity = $this->context->diagramModel->create($diagram);
                        }

                        $this->payload->diagrams[$key] = $diagramEntity->getId();
                    }
                }
            }
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Save project:' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Save project:' . $e->getMessage(), 'error');
        }
    }

    public function handleSaveProjectSettings($id, $title, $description) {
        try {

            $this->payload->action = 'saveProject';
            $this->payload->result = false;

            if (!$this->checkIsAllowed('Save project settings')) {
                return;
            }

            $project = $this->findProject($id);

            $project->setTitle($title);
            $project->setDescription($description);
            $project->setUpdated();

            $this->context->projectModel->update($project);

            $this->payload->result = true;
            $this->editorMessage('Project saved.');
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Save project settings:' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Save project settings:' . $e->getMessage(), 'error');
        }
    }

    

    public function handleSaveDiagramSettings($id, $title, $description, $width, $height) {
        
        try {

            $this->payload->action = 'saveDiagramSettings';

            if (!$this->checkIsAllowed('Save diagram settings')) {
                return;
            }

            $this->context->diagramModel->updateDiagramSettings($id, $title, $description, $width, $height);
            

            $this->editorMessage('Diagram settings saved.');
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Save diagram settings:' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Save diagram settings:' . $e->getMessage(), 'error');
        }
    }

    public function handleSaveDiagram($projectId, $id, $index, $title, $description, $type, $content, $width, $height) {

        $this->payload->action = 'saveDiagram';                                 // payload action name
        $this->payload->result = false;                                         // something is wrong

        if (!$this->checkIsAllowed('Save diagram')) {
            return;
        }

        
        try {

            if (!$projectId) {
                $projectId = 0;
            }

            $project = $this->findProject($projectId);
            if ($project->getOwner()->getId() != $this->getUser()->getId()) {
                throw new \BrainArchitect\Exception\AuthorizationException('You are not owner of this project!');
            }

            $diagram = $this->context->diagramModel->findById($id);                        // find diagram

            $data = Array(
                    "project" => $project->getId(),
                    "title" => $title,
                    "description" => $description,
                    "content" => $content,
                    "type" => $type,
                    "width" => $width,
                    "height" => $height);
            
            if (!$diagram) {                                                      // if diagram does not exist
                $diagram = $this->context->diagramModel->create($data);

            } else {                                                              // else diagram exists 
                
                if ($diagram->getProject()->getOwner()->getId() != $this->getUser()->getId()) {     // check diagram owner
                    throw new \BrainArchitect\Exception\AuthorizationException('You are not owner of this diagram!');
                }
                
                $this->context->diagramModel->update($diagram->getId(), $data);
            }


            $this->payload->result = true;
            $this->payload->diagramIndex = $index;
            $this->payload->diagramId = $diagram->getId();

            $this->editorMessage('Diagram saved.');                             // set message of editor
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Save diagram: ' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Save diagram: ' . $e->getMessage(), 'error');
        }
    }

    public function handleDeleteDiagram($id) {
        try {

            $this->payload->action = 'deleteDiagram';

            if (!$this->checkIsAllowed('Delete diagram')) {
                return;
            }

            $this->context->diagramModel->delete($id);

            $this->editorMessage('Diagram was deleted.');
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Delete diagram:' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Delete diagram:' . $e->getMessage(), 'error');
        }
    }

    /**
     * Check if user is allowed to do action
     * @param type $actionName
     * @return boolean 
     */
    protected function checkIsAllowed($actionName = '') {

        if (!$this->getUser()->isLoggedIn()) {
            $this->editorMessage(( $actionName != '' ? '<strong>' . $actionName . ':</strong> ' : '' ) . 'You must be logged in to do this action.', 'error');
            return false;
        }

        return true;
    }

    /**
     * Create a new diagram entity
     * @param type $title
     * @param type $description
     * @param type $content
     * @param type $project
     * @return \BrainArchitect\Interfaces\Entities\IDiagram
     */
    protected function createDiagram($title, $description, $content, $project, $width, $height) {

        return $this->context->diagramModel->create(Array(
                    'title' => $title,
                    'description' => $description,
                    'content' => $content,
                    'project' => $project,
                    'width' => $width,
                    'height' => $height
                ));
    }

    

    /**
     * Find project by ID
     * @param type $id
     * @return \BrainArchitect\Interfaces\Entities\IProject
     * @throws \BrainArchitect\Exception\EntityNotExistsException
     * @throws \BrainArchitect\Exception\AuthorizationException 
     */
    public function findProject($id) {

        if (!$id) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Project doesn\'t exists or is not saved.');
        }

        $project = $this->context->projectModel->findById($id);
        if (!$project) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Project doesn\'t exists or is not saved.');
        }

        if ($project->getOwner()->getId() != $this->getUser()->getId()) {
            throw new \BrainArchitect\Exception\AuthorizationException('You are not allowed to edit this project!');
        }

        return $project;
    }

    /**
     * 
     * @param type $id
     * @return \BrainArchitect\Interfaces\Entities\IDiagram
     * @throws \BrainArchitect\Exception\EntityNotExistsException
     * @throws \BrainArchitect\Exception\AuthorizationException 
     */
    public function findDiagram($id) {

        $diagram = $this->context->diagramModel->findById($id);

        if (!$diagram) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('Diagram doesn\'t exists.');
        }

        if ($diagram->getProject()->getOwner()->getId() != $this->getUser()->getId()) {
            throw new \BrainArchitect\Exception\AuthorizationException('You are not allowed to edit this diagram!');
        }

        return $diagram;
    }

    /**
     * Show user projects
     * @return type 
     */
    public function actionManageProjects() {

        if (!$this->checkIsAllowed('Manage projects')) {
            $this->payload->showContentWindow = false;
            return;
        }

        $this->payload->showContentWindow = true;
        $this->template->projects = $this->getCurrentUserEntity()->getProjects();                

        $this->invalidateControl('contentWindow');
    }

    public function handleOpenProject($projectId) {
        $this->payload->action = 'openProject';

        try {

            if (!$this->checkIsAllowed('Open project')) {
                return;
            }

            $project = $this->findProject($projectId);
            if ($project->getOwner()->getId() != $this->getUser()->getId()) {
                throw new \BrainArchitect\Exception\AuthorizationException('You are not owner of this project!');
            }

            $projectDiagrams = $project->getDiagrams();
            $diagrams = Array();

            if ($projectDiagrams) {
                foreach ($projectDiagrams as $diagram) {
                    $diagrams[] = Array(
                        "title" => $diagram->getTitle(),
                        "description" => $diagram->getDescription(),
                        "content" => $diagram->getContent(),
                        "id" => $diagram->getId(),
                        "type" => $diagram->getType(),
                        "width" => $diagram->getWidth(),
                        "height" => $diagram->getHeight()
                    );
                }
            }


            $this->payload->project = Array(
                "title" => $project->getTitle(),
                "description" => $project->getDescription(),
                "id" => $project->getId(),
                "diagrams" => $diagrams
            );

            $this->editorMessage('Project was loaded.');
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Delete project:' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Delete project:' . $e->getMessage(), 'error');
        }
    }

    public function handleDeleteProject($projectId) {
        try {

            $this->payload->action = 'deleteProject';

            if (!$this->checkIsAllowed('Delete project')) {
                return;
            }

            $project = $this->findProject($projectId);
            if ($project->getOwner()->getId() != $this->getUser()->getId()) {
                throw new \BrainArchitect\Exception\AuthorizationException('You are not owner of this project!');
            }

            $diagrams = $project->getDiagrams();

            if ($diagrams) {
                foreach ($diagrams as $diagram) {
                    $this->context->diagramModel->delete($diagram->getId());
                }
            }

            $this->context->projectModel->delete($project->getId());

            $this->editorMessage('Project was deleted.');

            $this->forward('manageProjects');
        } catch (\BrainArchitect\Exception\EntityNotExistsException $e) {
            $this->editorMessage('Delete project:' . $e->getMessage(), 'error');
        } catch (\BrainArchitect\Exception\AuthorizationException $e) {
            $this->editorMessage('Delete project:' . $e->getMessage(), 'error');
        }
    }

}
