<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午6:45
 */

namespace src\common\util;


class Output {
    private static $body = array();

    public static function set($key, $value) {
        static::$body[$key] = $value;
    }

    public static function body() {
        return static::$body;
    }
}