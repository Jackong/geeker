<?php
define("PROJECT", dirname(__DIR__));
define("TIME", $_SERVER['REQUEST_TIME']);
define("DATE", date("Ymd", TIME));
define("NOW", date("Y-m-d H:i:s", TIME));

$log = \src\config\App::get('log');
define("LOG", \src\common\Log::instance($log['file'], $log['level']));

require_once PROJECT . 'vendor/autoload.php';

function project_loader($class) {
    $namespace = "src\\";
    $length = strlen($namespace);
    if (substr($class, 0, $length) == $namespace) {
        require_once PROJECT . $class . '.php';
    }
}

spl_autoload_register('project_loader');