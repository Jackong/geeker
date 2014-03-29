<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 上午8:48
 */

namespace src\config;


use src\common\Config;
use src\common\Log;

class App {
    use Config;
    protected static function prod()
    {
        return array(
            'salt' => '3%d@!=-.v4',
            'debug' => false,
            'log' => array(
                'file' => "/home/bae/log/user.log." . DATE,
                'level' => Log::TRACE
            ),
        );
    }

    protected static function dev()
    {
        return array(
            'debug' => true,
        );
    }


}