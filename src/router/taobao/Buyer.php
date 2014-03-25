<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午2:46
 */

namespace src\router\taobao;


use Slim\Slim;
use src\common\Log;
use src\common\Router;
use src\common\util\Input;

class Buyer {
    use Router;
    public function get($id) {
        $url = urldecode(Input::get('url'));
        if (false === strpos($url, 'http://list.taobao.com/itemlist')) {
            return;
        }

        Slim::getInstance()->setCookie('id', $id, "3 days", "/");
        $trade = Input::get('trade', "/^[0-9]{1,2}$/", 10);

        $recent = Input::get('recent', "/^[0-9]{1,2}$/", 0);

        shell_exec("php " . PROJECT . "/src/tool/job/taobao/buyer.php $id $recent $trade \"$url\" >/dev/null 2>&1");

        echo "users()";
    }
} 