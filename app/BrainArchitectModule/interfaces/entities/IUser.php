<?php

namespace BrainArchitect\Interfaces\Entities;

interface IUser {
    
  public function getActivationKey();
  
  /**
   * Returns user email
   * @return string 
   */
  public function getEmail();
  
  /**
   * Returns user fullname
   * @return string 
   */
  public function getFullname();
  
  /**
   * Returns returns user name
   * @return string 
   */
  public function getName();
  
  /**
   * Returns password hash
   * @return string 
   */
  public function getPassword();
  
  /**
   * Returns time of registration
   * @return \DateTime 
   */
  public function getRegistered();
  
  /**
   * Return reset request time
   * @return \DateTime 
   */
  public function getResetRequestTime();
  
  /**
   * Returns user surname
   * @return string 
   */
  public function getSurname();
  
  /**
   * Returns username
   * @return string 
   */
  public function getUsername();
  
  /**
   * Returns if user account is active
   * @return string 
   */
  public function isActive();
  
  /**
   * Returns if user account is banned
   * @return string 
   */
  public function isBanned();
  
  /**
   * Returns if user is administrator
   * @return boolean
   */
  public function isAdministrator();
  
  /** SETTERS */
  
  /**
   * Activate user 
   */
  public function activate();
  
  /**
   * Set user ban!
   */
  public function ban();
  
  /**
   *Deactivate user 
   */
  public function deactivate();
  
  /**
   * Sets date/time of registration now
   */
  public function setRegistered();
  
  /**
   * Sets activation key
   * @param string $key 
   */
  public function setActivationKey($key);
  
  /**
   * Sets user email
   * @param string $email 
   */
  public function setEmail($email);
  
  /**
   * Sets user name
   * @param string $name 
   */
  public function setName($name);
  
  /**
   * Sets password hash
   * @param string $passwordHash 
   */
  public function setPasswordHash($passwordHash);
  
  public function setResetRequestNow();
  
  /**
   * Set user surname
   * @param string $username 
   */
  public function setSurname($surname);
  
  /**
   * Set username
   * @param string $username 
   */
  public function setUsername($username);
  
  /**
   * Unban user  
   */
  public function unban();
  
  /**
   * Unset reset request time 
   */
  public function unsetResetRequestTime();

  public function setAdminRole();
  
  public function unsetAdminRole();
    
}
