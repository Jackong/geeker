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
use src\service\Crawler;
use src\service\tieba\Main;

class Member {
    use Router;
    public function get($id) {
        $account = 'jack';
        $tbUrl = "http://tieba.baidu.com/f?ie=utf-8&kw=$id";

        $crawler = new Crawler('http://tieba.baidu.com/');
        $handler = new Main();
        Log::debug("tieba|main|$account|$tbUrl");
        $data = $crawler->crawl($tbUrl, $handler);
        if (!$data['ok']) {
            return;
        }
        $num = $data['num'];
        $url = $data['url'];

        $cmd = "php " . PROJECT . "/src/tool/job/tieba/member.php $account \"$url\"";
        exec(sprintf("%s >%s 2>&1 & echo $! > %s", $cmd, "/tmp/job_$account.log", "/tmp/job_$account.pid"));
        echo "gkCrawling($num, 0)";
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