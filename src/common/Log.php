<?php
/**
 * @author: Jackong
 * Date: 14-3-12
 * Time: 下午7:23
 */

namespace src\common;

class Log {

    const TRACE = 0;
    const DEBUG = 1;
    const INFO = 2;
    const WARN = 3;
    const ERROR = 4;
    const FATAL = 5;

    private $handler;
    private $level = 0;

    private static $instance;

    /**
     * @return Log
     */
    public static function instance() {
        if (isset(static::$instance)) {
            return static::$instance;
        }
        $log = \src\config\App::get('log');
        static::$instance = new Log($log['resource'], $log['level']);
        return static::$instance;
    }

    public function trace($msg) {
        $this->output(static::TRACE, $msg);
    }

    public function debug($msg) {
        $this->output(static::DEBUG, $msg);
    }

    public function info($msg) {
        $this->output(static::INFO, $msg);
    }

    public function warn($msg) {
        $this->output(static::WARN, $msg);
    }

    public function error($msg) {
        $this->output(static::ERROR, $msg);
    }

    public function fatal($msg) {
        $this->output(static::FATAL, $msg);
    }

    private function __construct($file, $level)
    {
        $this->handler = fopen($file, "a");
        $this->level = $level;
    }

    public function output($level, $msg) {
        if ($level < $this->level) {
            return;
        }
        fwrite($this->handler, sprintf("%s-%s:%s\n", $level, TIME, $msg));
    }

    public function __destruct()
    {
        fclose($this->handler);
    }
}

