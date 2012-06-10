<?php

namespace BrainArchitect\Models\Doctrine;

use \BrainArchitect\Security\SecurityHelper as SH;

class User extends \BrainArchitect\Models\Doctrine\AbstractDoctrineCRUD implements \BrainArchitect\Interfaces\Models\IUser {

    protected $entityName = 'User';
    protected $emailTemplatesPath = '';

    public function __construct(\Doctrine\ORM\EntityManager $entityManager) {
        parent::__construct($entityManager);
        $this->emailTemplatesPath = APP_DIR . '/BrainArchitectModule/FrontendModule/templates/emails/';
    }

    /**
     * Create new User entity
     * @param type $values
     * @return \BrainArchitect\Interfaces\Entities\IUser
     */
    public function create($values) {

        if ($this->userExists($values->username)) {
            throw new \BrainArchitect\Exception\EntityExistsException('Username already exists.');
        }

        if ($this->userEmailExists($values->email)) {
            throw new \BrainArchitect\Exception\EntityExistsException('Email already exists.');
        }

        $user = new \User();

        $user->setUsername($values->username);
        $user->setEmail($values->email);
        $user->setName($values->name);
        $user->setSurname($values->surname);


        if ($values->isActive) {
            $user->activate();
        } else {
            $user->deactivate();
        }

        if ($values->isAdmin) {
            $user->setAdminRole();
        } else {
            $user->unsetAdminRole();
        }

        $user->unban();

        $user->setRegistered();
        $user->setActivationKey('unset');
        $user->setPasswordHash(SH::calculatePasswordHash($values->password));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $user->setActivationKey(SH::generateActivationCode($user->getId(), $user->getUsername()));

        $this->entityManager->flush();

        return $user;
    }

    public function update($id, $values) {

        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        if ($entity->getUsername() != $values->username) {
            if ($this->userExists($values->username)) {
                throw new \BrainArchitect\Exception\EntityExistsException('Username already exists.');
            }
        }

        if ($entity->getEmail() != $values->email) {
            if ($this->userEmailExists($values->email)) {
                throw new \BrainArchitect\Exception\EntityExistsException('Email already exists.');
            }
        }

        $entity->setUsername($values->username);
        $entity->setEmail($values->email);
        $entity->setName($values->name);
        $entity->setSurname($values->surname);

        if ($values->isActive) {
            $entity->activate();
        } else {
            $entity->deactivate();
        }

        if ($values->isAdmin) {
            $entity->setAdminRole();
        } else {
            $entity->unsetAdminRole();
        }

        if ($values->isBanned) {
            $entity->ban();
        } else {
            $entity->unban();
        }

        if (isset($values->password)) {
            $entity->setPasswordHash(SH::calculatePasswordHash($values->password));
        }

        $this->entityManager->flush();

        return $entity;
    }

    /**
     * Activate user account by id
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function activate($id) {
        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        $entity->activate();
        $this->entityManager->flush();
    }

    public function activateByKey($email, $key) {

        $user = $this->findOneBy(Array("email" => $email));

        if (!$user) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        if ($user->isActive()) {
            throw new \BrainArchitect\Exception\UserAccountActivatedException('Account has already activated!');
        }

        if ($user->getActivationKey() != SH::generateActivationCode($user->getId(), $user->getUsername())) {
            throw new \BrainArchitect\Exception\BadActivationCodeException('Bad activation code!');
        }

        $user->activate();

        $this->sendActivationEmail($user->getId());

        $this->entityManager->flush();
    }

    /**
     * Deactivate user account by id
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function deactivate($id) {
        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        $entity->deactivate();
        $this->entityManager->flush();
    }

    /**
     * Ban Account
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function ban($id) {
        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        $entity->ban();
        $this->entityManager->flush();
    }

    /**
     * Unban account
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function unban($id) {
        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        $entity->unban();
        $this->entityManager->flush();
    }

    /**
     * Check if user exists
     * @param type $username
     * @return type 
     */
    public function userExists($username) {
        return $this->findBy(Array('username' => $username)) ? true : false;
    }

    /**
     * Check if email exists
     * @param type $email
     * @return type 
     */
    public function userEmailExists($email) {
        return $this->findBy(Array('email' => $email)) ? true : false;
    }

    /**
     *
     * @param type $login
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function resetPasswordRequest($login) {

        $user = null;

        $user = $this->findOneBy(Array('username' => $login));

        if (!$user) {
            $user = $this->findOneBy(Array('email' => $login));
            if (!$user) {
                throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
            }
        }

        $user->setResetRequestNow();
        $this->entityManager->flush();

        $this->sendResetPasswordRequest($user);
    }

    /**
     *
     * @param type $email
     * @param type $resetCode
     * @throws \BrainArchitect\Exception\EntityExistsException 
     */
    public function resetPassword($email, $resetCode) {

        $user = $this->findOneBy(Array("email" => $email));

        if (!$user) {
            throw new \BrainArchitect\Exception\EntityExistsException('User account not found!');
        }
        
        $linkForgotPassword = '<a href="' . \Nette\Environment::getApplication()->getPresenter()->link('//Account:forgotPassword') . '"><strong>Send new request</strong></a>';
        
        if($user->getResetRequestTime() == null){
            throw new \BrainArchitect\Exception\EntityExistsException('To reset pass you must send request. ' . $linkForgotPassword);
        }
        
        $resetPasswordRequestCode = SH::calculateResetPasswordRequest($user->getId(), $user->getResetRequestTime()->format('d.m.Y, h:i:s'));
        
        if ($resetPasswordRequestCode != $resetCode) {
                throw new \BrainArchitect\Exception\EntityExistsException('Bad reset password code. ' . $linkForgotPassword);
        }
        
        $password = SH::generateRandomPassword();
            
        $user->setPasswordHash(SH::calculatePasswordHash($password));
        $user->unsetResetRequestTime();
            
        $this->entityManager->flush();
        
        $this->sendNewPasswordEmail($user, $password);
    }

    /**
     * Email
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function getEmailTemplatesPath() {
        return $this->emailTemplatesPath;
    }

    /**
     * Sends registration email to user specified by ID
     * @param type $id
     * @throws \BrainArchitect\Exception\EntityNotExistsException 
     */
    public function sendRegistrationEmail($id) {

        $user = $this->findById($id);

        if (!$user) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        $link = \Nette\Environment::getApplication()->getPresenter()->link('//Account:activation');

        $data = Array(
            'activationUrl' => $link,
            'activationKey' => $user->getActivationKey(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'password' => $user->getPassword()
        );

        $mailer = new \BrainArchitect\Mailer($this->getEmailTemplatesPath() . 'registered.latte',
                        $data,
                        'info@brainarchitect.net',
                        $user->getEmail(),
                        'Brain Architect - Account registration');

        $mailer->send();
    }

    public function sendActivationEmail($id) {

        $user = $this->findById($id);

        if (!$user) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        $mailer = new \BrainArchitect\Mailer($this->getEmailTemplatesPath() . 'activated.latte',
                        Array('username' => $user->getUsername()),
                        'info@brainarchitect.net',
                        $user->getEmail(),
                        'Brain Architect - Account activated');

        $mailer->send();
    }

    public function sendResetPasswordRequest($user) {

        $resetCode = SH::calculateResetPasswordRequest($user->getId(), $user->getResetRequestTime()->format('d.m.Y, h:i:s'));
        $link = \Nette\Environment::getApplication()->getPresenter()->link('//Account:resetPassword', Array("email" => $user->getEmail(), "resetCode" => $resetCode));

        $mailer = new \BrainArchitect\Mailer($this->getEmailTemplatesPath() . 'resetPasswordRequest.latte',
                        Array('username' => $user->getUsername(),
                            'requestURL' => $link),
                        'info@brainarchitect.net',
                        $user->getEmail(),
                        'Brain Architect - Reset password request');
        $mailer->send();
    }
    
    public function sendNewPasswordEmail($user, $password){
        
        $mailer = new \BrainArchitect\Mailer($this->getEmailTemplatesPath().'newPassword.latte',
                        Array('username' => $user->getUsername(),
                            'password' => $password),
                        'info@brainarchitect.net',
                        $user->getEmail(),
                        'Brain Architect - New password');

        $mailer->send();
    }
    
    public function updateUserSettings($id, $values){
        
        $entity = $this->findById($id);

        if (!$entity) {
            throw new \BrainArchitect\Exception\EntityNotExistsException('User does not exists!');
        }

        if ($entity->getEmail() != $values->email) {
            if ($this->userEmailExists($values->email)) {
                throw new \BrainArchitect\Exception\EntityExistsException('Email already exists.');
            }
        }
        
        $entity->setEmail($values->email);
        $entity->setName($values->name);
        $entity->setSurname($values->surname);

        if (isset($values->password)) {
            $entity->setPasswordHash(SH::calculatePasswordHash($values->password));
        }

        $this->entityManager->flush();

        return $entity;
        
    }

}

