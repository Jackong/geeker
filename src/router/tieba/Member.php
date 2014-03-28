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
        $cmd = "php " . PROJECT . "/src/tool/job/tieba/member.php $account \"$url\"";
        exec(sprintf("%s >%s 2>&1 & echo $! > %s", $cmd, "/tmp/job_$account.log", "/tmp/job_$account.pid"));
        echo 'crawling(0)';
    }

    public function gets() {
        $account = 'jack';
        $redis = Redis::select('tieba');
        if ($redis->get("flag.$account")) {
            Log::error("tieba member is crawling|$account");
            echo 'gkWait()';
            return;
        }
        $members = $redis->lRange($account, 0, -1);
        if (is_null($members) || !is_array($members)) {
            $members = array();
        }
        $result = array();
        foreach ($members as $member) {
            if ($member === false) {
                continue;
            }
            $result[] = $member;
        }

        echo 'finish(' . json_encode($result) . ')';
    }
} 