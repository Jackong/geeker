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
use src\common\util\Redis;

class Receiver {
    use Router;
    public function get($receiver) {
        $account = Auth::account();
        $url = urldecode(Input::get('url'));
        if (false === strpos($url, 'http://list.taobao.com/itemlist')) {
            return;
        }
        $trade = Input::get('trade', "/^[0-9]{1,2}$/", 10);

        $redis = Redis::select('ww');
        $count = $redis->sCard($account);
        if ($count > 0) {
            $redis->del($account);
        }
        if ($receiver == 'buyer') {
            $this->buyer($account, $trade, $url);
        } else {
            $this->seller($account, $trade, $url);
        }
        echo "receivers()";
    }

    public function gets() {
        $account = Auth::account();
        $redis = Redis::select('ww');
        $redis->multi();
        for ($idx = 0; $idx < 10; $idx++) {
            $redis->sPop($account);
        }
        $users = $redis->exec();
        $result = array();
        foreach ($users as $user) {
            if (false === $user) {
                continue;
            }
            $result[] = $user;
        }
        echo "send(" . json_encode($result) . ")";
    }
    private function buyer($account, $trade, $url) {
        $recent = Input::get('recent', "/^[0-9]{1,2}$/", 0);
        exec("php " . PROJECT . "/src/tool/job/taobao/buyer.php $account $recent $trade \"$url\" >/dev/null 2>&1 &");
    }

    private function seller($account, $trade, $url) {
        exec("php " . PROJECT . "/src/tool/job/taobao/seller.php $account $trade \"$url\" >/dev/null 2>&1 &");
    }
} 