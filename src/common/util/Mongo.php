<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 上午9:30
 */

namespace src\common\util;


use src\config\Service;

class Mongo {
    private static $db;

    public static function instance() {
        if (isset(self::$db)) {
            return self::$db;
        }
        $config = Service::get('mongo');
        $name = $config['name'];
        $host = $config['host'];
        $port = $config['port'];
        $user = $config["ak"];
        $pwd = $config["sk"];

        $mongoClient = new \MongoClient("mongodb://{$host}:{$port}");

        $db = $mongoClient->selectDB($name);
        $db->authenticate($user, $pwd);
        self::$db = $db;
        return $db;
    }

    public static function collection($name) {
        return static::instance()->selectCollection($name);
    }

} 