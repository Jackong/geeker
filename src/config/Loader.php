<?php
/**
 * @author: Jackong
 * Date: 14-3-12
 * Time: 下午7:12
 */

namespace src\config;


class Loader {
    public static function get($keys = "") {
        $config = static::prod();
        if (is_null($keys) || empty($keys)) {
            return $config;
        }
        $keys = explode(".", $keys);
        foreach ($keys as $key) {
            if (isset($config[$key])) {
                $config = $config[$key];
                continue;
            }
            return null;
        }
        return $config;
    }

    public static function prod() {
        return array();
    }
}