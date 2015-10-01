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
    return $view->render($this());
  }
  
  public function GETaudio()
  {
    $view = new \bloc\view('views/layout.html');
    $view->main = 'views/audio.html';
    return $view->render($this());
  }
}