<?php
define("PROJECT", dirname(__DIR__));
require_once PROJECT . 'vendor/autoload.php';

function project_loader($class) {
    $namespace = "src\\";
    $length = strlen($namespace);
    if (substr($class, 0, $length) == $namespace) {
        require_once PROJECT . $class . '.php';
    }
}

spl_autoload_register('project_loader');