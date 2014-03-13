<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 上午8:58
 */

namespace src\common;


use src\config\App;

class Config {
    protected static $config;

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

    protected static function config() {
        if (isset(static::$config)) {
            return static::$config;
        }
        static::$config = static::prod();
        if (!App::get('prod')) {
            $dev = static::dev();
            static::$config = array_replace_recursive(static::$config, $dev);
        }
        return static::$config;
    }

    protected static function prod() {
        return array();
    }

    protected static function dev() {
        return array();
    }
} 