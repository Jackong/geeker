<?php
/**
 * @author: Jackong
 * Date: 14-3-12
 * Time: 下午7:23
 */

namespace src\common;

use src\common\log\Logger;
use src\config\App;

class Log {
    const TRACE = 0;
    const DEBUG = 1;
    const INFO = 2;
    const WARN = 3;
    const ERROR = 4;
    const FATAL = 5;

    public static function trace($msg) {
        static::logger()->output(static::TRACE, $msg);
    }

    public static function debug($msg) {
        static::logger()->output(static::DEBUG, $msg);
    }

    public static function info($msg) {
        static::logger()->output(static::INFO, $msg);
    }

    public static function warn($msg) {
        static::logger()->output(static::WARN, $msg);
    }

    public static function error($msg) {
        static::logger()->output(static::ERROR, $msg);
    }

    public static function fatal($msg) {
        static::logger()->output(static::FATAL, $msg);
    }

    private static function logger() {
        $log = App::get('log');
        return Logger::instance($log['file'], $log['level']);
    }
}

