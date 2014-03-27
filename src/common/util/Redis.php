<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午5:14
 */

namespace src\common\util;


use src\common\Log;
use src\config\Service;

class Redis {
    /**
     * @param $name
     * @return null|\Redis
     */
    public static function select($name) {
        $redis = new \Redis();
        $service = Service::get();
        $config = $service['redis'];
        $ret = $redis->pconnect($config['host'], $config['port']);
        if ($ret === false) {
            Log::warn($redis->getLastError() . "|" . $name);
            return null;
        }

        $ret = $redis->auth($service['ak'] . "-" . $service['sk'] . "-" . $config['name']);
        if ($ret === false) {
            Log::warn($redis->getLastError() . "|" . $name);
            return null;
        }

        $redis->setOption(\Redis::OPT_PREFIX, "$name:");

        return $redis;
    }
} 