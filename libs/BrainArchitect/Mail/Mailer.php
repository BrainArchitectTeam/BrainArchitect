<?php

/**
 * Description of Mailer
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

namespace BrainArchitect;

class Mailer extends \Nette\Object{
    
    private $message = null;
    
    public function __construct($template, $data, $from, $to, $subject, $encoding = 'utf-8'){
        
        $template = new \Nette\Templating\FileTemplate($template);
        $template->registerFilter(new \Nette\Latte\Engine);
        
        if(count($data)){
            foreach($data as $key => $value){
                $template->$key = $value;
            }
        }
        
        $this->message = new \Nette\Mail\Message();
        $this->message->setHtmlBody($template, WWW_DIR . '/public/ba/images/');
        $this->message->setSubject($subject);
        $this->message->setEncoding($encoding);
        $this->message->setFrom($from);
        $this->message->addTo($to);
    }
    
    public function send(){
        $this->message->send();
    }
    
}
