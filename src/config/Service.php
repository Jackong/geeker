<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午5:15
 */

namespace src\config;


use src\common\Config;

class Service {
    use Config;
    protected static function prod()
    {
        return array(
            'ak' => 'TixdQ5pd2r9Su4Q1G0oUCEtO',
            'sk' => 'smUmBPlexEZNcAGyGkYHTcbBueYTnVMA',
            'redis' => array(
                'ww' => array(
                    'host' => 'redis.duapp.com',
                    'port' => 80,
                    'name' => 'uulQAzmFiQjGOebmXKxi',
                )
            )
        );
    }

    protected static function dev()
    {
        return array(
            'redis' => array(
                'ww' => array(
                    'name' => 'ww',
                    'host' => '127.0.0.1',
                    'port' => 6379,
                )
            )
        );
    }

} 