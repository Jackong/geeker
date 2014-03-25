<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 上午8:58
 */

namespace src\common;

trait Config {

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
        $config = static::prod();
        if (false) {
            $dev = static::dev();
            $config = array_replace_recursive($config, $dev);
        }
        return $config;
    }

    protected static function prod() {
        return array();
    }

    protected static function dev() {
        return array();
    }
} 