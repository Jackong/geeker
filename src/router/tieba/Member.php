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
use src\common\util\Mongo;
use src\common\util\Output;
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
        $cb = Input::optional('cb');
        $account = 'jack';
        $collection = Mongo::collection('tieba.member');
        $doc = $collection->findOne(
            array(
                'uid' => $account
            ),
            array(
                'members'
            )
        );
        if (is_null($doc) || !isset($doc['members'])) {
            Log::error("tieba member is crawling|$account");
            echo 'gkWait()';
            return;
        }
        $members = $doc['members'];
        if (is_null($cb)) {
            Output::set('members', $members);
        } else {
            echo $cb . '(' . json_encode($members) . ')';
        }
    }
} 