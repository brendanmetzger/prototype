<?php

namespace controllers;

class Graph extends \bloc\controller
{
  
  public function __construct($reques)
  {
    $this->title = "Knight Prototype";
  }
  
  function GETindex($var = 'default')
  {
    $view = new \bloc\view('views/layout.html');
    $this->action = 'whatever';
    return $view->render($this());
  }
  
  public function GETaudio()
  {
    $view = new \bloc\view('views/layout.html');
    $view->main = 'views/audio.html';
    return $view->render($this());
  }
  
  public function GETperspective()
  {
    $view = new \bloc\view('views/layout.html');
    $view->main = 'views/perspective.html';
    return $view->render($this());
  }
  
  public function GETprompt()
  {
    $view = new \bloc\view('views/layout.html');
    $view->main = 'views/prompt.html';
    return $view->render($this());
  }
  
  public function GETanalyzer()
  {
    $view = new \bloc\view('views/layout.html');
    $view->main = 'views/analyzer.html';
    return $view->render($this());
  }
}