<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午2:46
 */

namespace src\router\taobao;


use src\common\Log;
use src\common\Router;
use src\common\util\Auth;
use src\common\util\Input;

class Seller {
    use Router;
    public function get($id) {
        $account = Auth::account();
        $url = urldecode(Input::get('url'));
        if (false === strpos($url, 'http://list.taobao.com/itemlist')) {
            return;
        }
        $trade = Input::get('trade', "/^[0-9]{1,2}$/", 10);


        exec("php " . PROJECT . "/src/tool/job/taobao/seller.php $account $trade \"$url\" >/dev/null 2>&1 &");

        echo "users()";
    }
} 