<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午2:55
 */

namespace src\common;


use Slim\Slim;

abstract class Router {
    public function go($router, Slim $app) {
        $app->get("/$router/:id", array($this, 'get'));
        $app->get("/$router", array($this, 'gets'));
        $app->put("/$router", array($this, 'create'));
        $app->post("/$router/:id", array($this, 'update'));
        $app->delete("/$router/:id", array($this, 'delete'));
        $app->delete("/$router", array($this, 'delete'));
    }

    public abstract function get($id);

    public abstract function gets();

    public abstract function create();

    public abstract function update($id);

    public abstract function delete($id);

    public abstract function clear();
} 