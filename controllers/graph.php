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
    $graph = \Models\Graph::instance();
    $this->tracks = $graph->query('/graph')->find('/track');
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
  
  public function POSTupdate($request)
  {
    $element  = \Models\Graph::ID('assets/audio/Bucket_Boys.m4a');
    $document = $element->ownerDocument;

    $plot = $element->appendChild($document->createElement('plot'));

    $plot->setAttribute('t', implode(' ', $_POST['plot']['t']));
    $plot->setAttribute('r', implode(' ', $_POST['plot']['r']));

    $document->save(PATH . \Models\Graph::DB . '.xml');

    return print_r($element->write(), true) . print_r($_POST, true);
  }
}