<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午2:55
 */

namespace src\common;

use Slim\Slim;

trait Router {

    public function go(Slim $app, $name) {
        $app->get("/$name/:id", array($this, 'get'));
        $app->get("/$name", array($this, 'gets'));
        $app->put("/$name", array($this, 'create'));
        $app->post("/$name/:id", array($this, 'update'));
        $app->delete("/$name/:id", array($this, 'del'));
        $app->delete("/$name", array($this, 'clear'));
    }

    public function get($id) {
        $this->unSupport();
    }

    public function gets() {
        $this->unSupport();
    }

    public function create() {
        $this->unSupport();
    }

    public function update($id) {
        $this->unSupport();
    }

    public function del($id) {
        $this->unSupport();
    }

    public function clear() {
        $this->unSupport();
    }

    private function unSupport() {
        $app = Slim::getInstance();
        $request = $app->request();
        Log::error(sprintf("Not support|%s|%s|%s|%s", $request->getMethod(), $request->getResourceUri(), $request->getIp(), $request->getUserAgent()));
        $app->status(404);
    }
} 