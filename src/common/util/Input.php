<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午6:39
 */

namespace src\common\util;


use Slim\Slim;
use src\common\Log;

class Input {
    public static function get($name, $pattern = null, $default = null) {
        if (isset($_REQUEST[$name])) {
            $value = $_REQUEST[$name];
        } else {
            $env = Slim::getInstance()->environment();
            $request = $env['slim.input'];
            $value = isset($request[$name]) ? $request[$name] : null;
        }
        if (is_null($value)) {
            if (is_null($default)) {
                static::invalid($name);
            }
            return $default;
        }
        if (!empty($value) && is_null($pattern)) {
            return $value;
        }
        if (empty($value)) {
            static::invalid($name);
        }
        if (preg_match($pattern, $value, $matches)) {
            return $value;
        }
        static::invalid($name);
    }

    private static function invalid($name) {
        $msg = "Invalid parameter $name";
        $app = Slim::getInstance();
        $request = $app->request();
        Log::warn($request->getIp(), $request->getUserAgent(), $request->getResourceUri(), $msg);
        $app->halt(400, $msg);
    }
} 