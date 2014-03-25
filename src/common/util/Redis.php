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
     * @param $dbname
     * @return null|\Redis
     */
    public static function select($dbname) {
        $redis = new \Redis();
        $service = Service::get();
        if (!isset($service['redis'][$dbname])) {
            Log::warn("$dbname not exist");
            return null;
        }
        $config = $service['redis'][$dbname];
        $ret = $redis->pconnect($config['host'], $config['port']);
        if ($ret === false) {
            Log::warn($redis->getLastError() . "|" . $dbname);
            return null;
        }

        $ret = $redis->auth($service['ak'] . "-" . $service['sk'] . "-" . $config['name']);
        if ($ret === false) {
            Log::warn($redis->getLastError() . "|" . $dbname);
            return null;
        }

        return $redis;
    }
} 