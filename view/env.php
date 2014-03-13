<?php
date_default_timezone_set("PRC");

define("PROJECT", dirname(__DIR__));
define("TIME", $_SERVER['REQUEST_TIME']);
define("DATE", date("Ymd", TIME));
define("NOW", date("Y-m-d H:i:s", TIME));


require_once PROJECT . '/vendor/autoload.php';

function project_loader($class) {
    $namespace = "src\\";
    $length = strlen($namespace);
    if (substr($class, 0, $length) == $namespace) {
        require_once PROJECT . '/' . str_replace("\\", "/", $class) . '.php';
    }
}

spl_autoload_register('project_loader');