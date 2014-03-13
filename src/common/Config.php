<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 上午8:58
 */

namespace src\common;


use src\config\App;

class Config {
    private static $config;

    public static function get($keys = "") {
        $config = static::config();
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

    private static function config() {
        if (isset(static::$config)) {
            return static::$config;
        }
        static::$config = static::prod();
        if (!App::get('prod')) {
            $dev = static::dev();
            static::$config = array_merge(static::$config, $dev);
        }
        return static::$config;
    }

    public static function prod() {
        return array();
    }

    public static function dev() {
        return array();
    }
} 