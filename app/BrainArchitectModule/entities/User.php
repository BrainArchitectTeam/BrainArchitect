<?php

/**
 * Description of User
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

/**
 * @Entity(repositoryClass="\ListingRepository")
 * @Table(name="BA_User")
 * 
 */
class User extends BaseEntity implements \BrainArchitect\Interfaces\Entities\IUser{
  
  /**
   * @column (type="boolean")
   * @var boolean 
   */
  private $isActive;
  
  /**
   * @column (type="boolean")
   * @var boolean 
   */
  private $isAdministrator;
  
  /**
   * @column (type="boolean")
   * @var boolean 
   */
  private $isBanned;
  
  /**
   * @column (type="datetime")
   * @var \DateTime
   */
  private $registered;
  
  /**
   * @column (type="datetime", nullable=true)
   * @var \DateTime
   */
  private $resetRequestTime;
  
  
  /**
   * @column(type="string", length=255)
   * @var string 
   */
  private $username;
  
  /**
   * @column(type="string", length=255)
   * @var string 
   */
  private $email;
  
  /**
   * @column(type="string", length=255)
   * @var string 
   */
  private $name;
  
  /**
   * @column(type="string", length=255)
   * @var string 
   */
  private $surname;
  
  /**
   * @column(type="string", length=50)
   * @var string 
   */
  private $password;
  
  /**
   * @column(type="string", length=255)
   * @var string 
   */
  private $activation_key;
 
  /** 
    * @OneToMany(targetEntity="Project", mappedBy="owner", cascade="remove")
    */ 
  private $projects;
  
  public function __construct() {
      $this->projects = new \Doctrine\Common\Collections\ArrayCollection();
  }


  /** GETTERS */
  
  /**
   * Returns activation key
   * @return string 
   */
  public function getActivationKey(){
      return $this->activation_key;
  }
  
  /**
   * Returns user email
   * @return string 
   */
  public function getEmail(){
      return $this->email;
  }
  
  /**
   * Returns user fullname
   * @return string 
   */
  public function getFullname(){
      return $this->name . ' ' . $this->surname;
  }
  
  /**
   * Returns returns user name
   * @return string 
   */
  public function getName(){
      return $this->name;
  }
  
  /**
   * Returns password hash
   * @return string 
   */
  public function getPassword(){
      return $this->password;
  }
  
  /**
   * Returns time of registration
   * @return \DateTime 
   */
  public function getRegistered(){
      return $this->registered;
  }
  
  /**
   * Return reset request time
   * @return \DateTime 
   */
  public function getResetRequestTime(){
      return $this->resetRequestTime;
  }
  
  /**
   * Returns user surname
   * @return string 
   */
  public function getSurname(){
      return $this->surname;
  }
  
  /**
   * Returns username
   * @return string 
   */
  public function getUsername(){
      return $this->username;
  }
  
  public function getProjects(){
      return $this->projects;
  }
  
  /**
   * Returns if user account is active
   * @return string 
   */
  public function isActive(){
      return $this->isActive;
  }
  
  /**
   * Returns if user account is banned
   * @return string 
   */
  public function isBanned(){
      return $this->isBanned;
  }
  
  /**
   * Returns if user is administrator
   * @return boolean
   */
  public function isAdministrator(){
      return $this->isAdministrator;
  }
  
  /** SETTERS */
  
  /**
   * Activate user 
   */
  public function activate(){
      $this->isActive = true;
  }
  
  /**
   * Set user ban!
   */
  public function ban(){
      $this->isBanned = true;
  }
  
  /**
   *Deactivate user 
   */
  public function deactivate(){
      $this->isActive = false;
  }
  
  /**
   * Sets date/time of registration now
   */
  public function setRegistered(){
      $this->registered = new \DateTime('now');
  }
  
  /**
   * Sets activation key
   * @param string $key 
   */
  public function setActivationKey($key){
      $this->activation_key = $key;
  }
  
  /**
   * Sets user email
   * @param string $email 
   */
  public function setEmail($email){
      $this->email = $email;
  }
  
  /**
   * Sets user name
   * @param string $name 
   */
  public function setName($name){
      $this->name = $name;
  }
  
  /**
   * Sets password hash
   * @param string $passwordHash 
   */
  public function setPasswordHash($passwordHash){
      $this->password = $passwordHash;
  }
  
  public function setResetRequestNow() {
      $this->resetRequestTime = new \DateTime('now');
  }
  
  /**
   * Set user surname
   * @param string $username 
   */
  public function setSurname($surname){
      $this->surname = $surname;
  }
  
  /**
   * Set username
   * @param string $username 
   */
  public function setUsername($username){
      $this->username = $username;
  }
  
  /**
   * Unban user  
   */
  public function unban(){
      $this->isBanned = false;
  }
  
  /**
   * Unset reset request time 
   */
  public function unsetResetRequestTime(){
      $this->resetRequestTime = null;
  }

  public function setAdminRole(){
      $this->isAdministrator = true;
  }
  
  public function unsetAdminRole(){
      $this->isAdministrator = false;
  }
  
}

