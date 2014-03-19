<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午5:43
 */

namespace src\common;


use Slim\Middleware;
use src\common\util\Output;

class Acceptor extends Middleware {
    /**
     * Call
     *
     * Perform actions specific to this middleware and optionally
     * call the next downstream middleware.
     */
    public function call()
    {
        // Run inner middleware and application
        $this->next->call();
        $accept = $this->app->request()->headers('Accept', 'application/json');
        list($contentType) = preg_split('/\s*[;,]\s*/', $accept);
        $contentType = strtolower($contentType);
        switch ($contentType) {

            default:
                $body = $this->toJson();
                break;
        }
        $response = $this->app->response();
        $old = $response->getBody();
        if (isset($old) && !empty($old)) {
            return;
        }
        $response->setBody($body);
        $response->header('Content-Type', $contentType);
    }

    private function toJson() {
        return json_encode(Output::body());
    }

} 