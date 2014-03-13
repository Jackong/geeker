<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 上午8:48
 */

namespace src\config;


use src\common\Config;
use src\common\Log;

class App extends Config {
    public static function prod()
    {
        return array(
            'prod' => true,
            'log' => array(
                'resource' => PROJECT . "/log/" . DATE . ".log",
                'level' => Log::INFO
            )
        );
    }
}