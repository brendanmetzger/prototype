<?php
namespace models;

use \bloc\dom\document;
use \bloc\dom\query;

/**
  * Graph
  *
  */

  class Graph
  {
    const DB = 'data/graph';
  
    public $storage = null;
    
    static public function instance()
    {
      static $instance = null;
    
      if ($instance === null) {
        $instance = new static();
      }
      
      return $instance;
    }
    
    static public function ID($id)
    {
      if ($id === null) return null;
      if (! $element = Graph::instance()->storage->getElementById($id)) {
        throw new \InvalidArgumentException("{$id}... Doesn't ring a bell.", 1);
      }
      return $element;
    }
  
    private function __construct()
    {
      $this->storage = new Document(self::DB, ['validateOnParse' => true]);
    }
    
    public function query($expression)
    {
      return (new Query($this->storage))->path($expression);
    }
    
    
  }