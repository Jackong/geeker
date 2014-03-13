<?php
require_once "env.php";

$app = new \Slim\Slim(
    array(
        'debug' => \src\config\App::get('debug'),
        'cookies.encrypt' => true,
        'cookies.secret_key' => \src\config\App::get('salt'),
        'cookies.cipher' => MCRYPT_RIJNDAEL_256,
        'cookies.cipher_mode' => MCRYPT_MODE_CBC
    )
);

$app->add(new \Slim\Middleware\ContentTypes());
$app->add(new \src\common\Acceptor());

$app->error(function(Exception $e) use($app) {
    \src\common\Log::fatal(sprintf("Server error|%s|%s|%s|%s", $e->getFile(), $e->getLine(), $e->getCode(), $e->getMessage()));
    $app->halt(500, "sorry! server error");
});

$request = $app->request();
$paths = explode('/', $request->getResourceUri());
if (count($paths) < 4) {
    \src\common\Log::error(sprintf("Not found|%s|%s|%s", $request->getResourceUri(), $request->getIp(), $request->getUserAgent()));
    $app->status(404);

} else {
    $app->group("/$paths[1]", function () use ($app, $request, $paths) {
        $app->group(
            "/$paths[2]", function() use ($app, $request, $paths) {
                $group = strtolower($paths[2]);
                $file  = PROJECT . "/src/router/$group/" . ucfirst(strtolower($paths[3]));
                if (!file_exists($file . ".php")) {
                    \src\common\Log::error(sprintf("Not found|%s|%s|%s", $request->getResourceUri(), $request->getIp(), $request->getUserAgent()));
                    $app->status(404);
                } else {
                    $class = str_replace("/", "\\", $file);
                    /**
                     * @var $router src\common\Router
                     */
                    $router = new $class($app);
                    $router->go();
                }
            }
        );
    });
}

$app->run();