<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 上午10:28
 */

namespace src\common\util;


use Slim\Slim;
use src\common\Log;

class Auth {

    public static function account() {
        $str = Slim::getInstance()->getCookie('auth');
        $auth = json_decode($str, true);
        if (!isset($auth) || !isset($auth['token']) || !isset($auth['account']) || $auth['token'] != md5($auth['account'])) {
            Log::error("Auth failed|$str");
            Slim::getInstance()->halt(403);
        }
        return $auth['account'];
    }

    public static function auth($account, $path) {
        $auth = json_encode(array('account' => $account, 'token' => md5($account)));
        Slim::getInstance()->setCookie('auth', $auth, '7 days', $path);
    }
} 