<?php
/**
 * @author: Jackong
 * Date: 14-4-9
 * Time: 下午4:00
 */

namespace src\router\qq;


use Slim\Slim;
use src\common\Router;

class Sender {
    use Router;

    public function get($id)
    {
        $auth = json_decode(Slim::getInstance()->getCookie('auth'), true);
        if (is_null($auth) || TIME >= $auth['expiration']) {
            echo 'onError("未登录或账号过期")';
            return;
        }

        echo file_get_contents(PROJECT . '/view/js/platform/qq.js');
    }

} 