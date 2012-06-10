<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of EntityExistsException
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

namespace BrainArchitect\Exception;

class EntityExistsException extends \Exception{ }
class BadActivationCodeException extends \Exception{}
class UserAccountActivatedException extends \Exception{}
class BadBrowserException extends \Exception{  }
class EntityNotExistsException extends \Exception{ }
class AuthorizationException extends \Exception{} 
class ScannerException extends \Exception{} 

class ExporterException extends \Exception{} 
class ImporterException extends \Exception{} 
