<?php
/**
 * @author: Jackong
 * Date: 14-3-27
 * Time: 上午11:33
 */

namespace src\router\tieba;


use src\common\Log;
use src\common\Router;
use src\common\util\Input;
use src\common\util\Redis;

class Member {
    use Router;
    public function get($id) {
        $account = 'jack';
        $url = urldecode(Input::get('url'));
        if (false === strpos($url, 'http://tieba.baidu.com/bawu2/platform/listMemberInfo?word=')) {
            return;
        }
        exec("php " . PROJECT . "/src/tool/job/tieba/member.php $account \"$url\" >/dev/null 2>&1 &");
        echo 'crawling()';
    }

    public function gets() {
        $account = 'jack';
        $redis = Redis::select('tieba');
        $redis->multi();
        for ($idx = 0; $idx < 20; $idx++) {
            $redis->lPop($account);
        }
        $members = $redis->exec();
        if (is_null($members) || !is_array($members)) {
            $members = array();
        }
        echo 'batchFollow(' . json_encode($members) . ',0)';
    }
} 