<?php

/**
 * Description of Authenticator
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

namespace BrainArchitect\Security;

class Authenticator extends \Nette\Object implements \Nette\Security\IAuthenticator {

    private $userModel = null;

    public function __construct(\BrainArchitect\Interfaces\Models\IUser $userModel) {
        $this->userModel = $userModel;
    }

    public function authenticate(array $credentials) {

        list($login, $password) = $credentials;
        
        $passwordHash = SecurityHelper::calculatePasswordHash($password);
        
        $user = $this->userModel->findOneBy(Array("username" => $login, "password" => $passwordHash));

        if (!$user) {
            $user = $this->userModel->findOneBy(Array("email" => $login, "password" => $passwordHash));

            if (!$user) {
                throw new \Nette\Security\AuthenticationException('Bad credentials! Try it again.');
            }
        }
        
        if(!$user->isActive()){
            throw new \Nette\Security\AuthenticationException('Your account has not been activated!');
        }
        
        if($user->isBanned()){
            throw new \Nette\Security\AuthenticationException('Your account is blocked!');
        }

        $role = null;
        
        if( $user->isAdministrator() ){
            $role = 'Admin';
        }
        
        return new \Nette\Security\Identity($user->getId(), $role);
    }

}
