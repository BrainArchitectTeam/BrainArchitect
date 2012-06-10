<?php

class EntityManagerConn {
    

    static function create(Nette\DI\Container $container)
    {
        
        $config = new \Doctrine\ORM\Configuration();
        $config->setMetadataCacheImpl(new \Doctrine\Common\Cache\ArrayCache);
        $config->setProxyDir(APP_DIR . '/models/proxy');
        $config->setProxyNamespace('Proxy');

        $driverImpl = $config->newDefaultAnnotationDriver(array(__DIR__."/models/entity"));
        $config->setMetadataDriverImpl($driverImpl);

        $cache = new \Doctrine\Common\Cache\ArrayCache();
        $config->setMetadataCacheImpl($cache);
        $config->setQueryCacheImpl($cache);
        
        $parameters = $container->getParameters();        
        
        return  Doctrine\ORM\EntityManager::create($parameters['database'], $config);
    }    
    
}

