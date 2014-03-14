<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 下午12:51
 */

namespace src\common\log;


class Logger {

    private $handler;
    private $level = 0;

    private static $instance;

    /**
     * @param $file
     * @param $level
     * @return Logger
     */
    public static function instance($file, $level) {
        if (isset(static::$instance)) {
            return static::$instance;
        }
        static::$instance = new Logger($file, $level);
        return static::$instance;
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
        fwrite($this->handler, sprintf("%s|%s|%s\n", $level, NOW, $msg));
    }

    public function __destruct()
    {
        fclose($this->handler);
    }
} 