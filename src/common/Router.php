<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午2:55
 */

namespace src\common;


use Slim\Slim;

abstract class Router {
    protected $app;

    public function __construct(Slim $app) {
        $this->app = $app;
    }

    public abstract function go();
} 