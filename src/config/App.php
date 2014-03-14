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
    protected static function prod()
    {
        return array(
            'salt' => '3%d@!=-.v4',
            'debug' => false,
            'log' => array(
                'file' => PROJECT . "/log/" . DATE . ".log",
                'level' => Log::INFO
            ),
        );
    }

    protected static function dev()
    {
        return array(
            'debug' => true,
            'log' => array(
                'level' => Log::TRACE
            )
        );
    }


}