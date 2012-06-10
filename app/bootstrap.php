<?php

/**
 * My Application bootstrap file.
 */
use Nette\Application\Routers\Route;


// Load Nette Framework
require LIBS_DIR . '/Nette/loader.php';


// Configure application
$configurator = new Nette\Config\Configurator;

// Enable Nette Debugger for error visualisation & logging
$configurator->setProductionMode(TRUE);
$configurator->enableDebugger(__DIR__ . '/../log');

// Enable RobotLoader - this will load all classes automatically
$configurator->setTempDirectory(__DIR__ . '/../temp');
$configurator->createRobotLoader()
	->addDirectory(APP_DIR)
	->addDirectory(LIBS_DIR)
	->register();

// Create Dependency Injection container from config.neon file
$configurator->addConfig(__DIR__ . '/config/config.neon');
$container = $configurator->createContainer();

////////////////////////////////////////////////////////////////////////////////
// DOCTRINE 2 

use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManager;
use Doctrine\Common\ClassLoader;

require_once LIBS_DIR.'/Doctrine/Common/ClassLoader.php';
 
$classLoader = new \Doctrine\Common\ClassLoader('Doctrine', __DIR__ . '/../libs/Doctrine');
$classLoader->register();
 
$classLoader = new \Doctrine\Common\ClassLoader('Symfony', __DIR__ . '/../libs/Symfony');
$classLoader->register();

$classLoader = new \Doctrine\Common\ClassLoader('Entity', __DIR__."/models/entity");
$classLoader->register();
 
 
// vytvoříme instanci entity manageru
//$em = EntityManager::create($connectionOptions, $config);
//Nette\Environment::setVariable( "entityManager", $em );

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Setup router

//$router = $application->getRouter();

$container->router[] = new Route('admin/<presenter>/<action>', array(
							'module' => 'BrainArchitect:Backend',
							'presenter' => 'Default',
        					'action' => 'default'));
 
$container->router[] = new Route('auth/<action>', array(
							'module' => 'BrainArchitect',
							'presenter' => 'Auth',
        					'action' => 'default'));

$container->router[] = new Route('bad-browser/', 'BrainArchitect:BadBrowser:default');


$container->router[] = new Route('account/<action>', array(
							'module' => 'BrainArchitect:Frontend',
							'presenter' => 'Account',
                                                        'action' => 'default'));

$container->router[] = new Route('export/<action>', array(
							'module' => 'BrainArchitect:Frontend',
							'presenter' => 'Export',
                                                        'action' => 'default'));

$container->router[] = new Route('import/<action>', array(
							'module' => 'BrainArchitect:Frontend',
							'presenter' => 'Import',
                                                        'action' => 'default'));

$container->router[] = new Route('<action>/', array(
							'module' => 'BrainArchitect:Frontend',
							'presenter' => 'Workspace',
                                                        'action' => 'default'));

$container->router[] = new Route('/', 'BrainArchitect:Workspace:default');

// Configure and run the application!
$container->application->run();