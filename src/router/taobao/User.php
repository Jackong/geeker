<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午6:33
 */

namespace src\router\taobao;


use src\common\Router;
use src\common\util\Auth;
use src\common\util\Redis;

class User {
    use Router;
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
} 