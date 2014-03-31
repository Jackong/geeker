<?php
/**
 * @author: Jackong
 * Date: 14-3-27
 * Time: 上午11:33
 */

namespace src\router\tieba;


use src\common\Log;
use src\common\Router;
use src\common\util\Auth;
use src\common\util\Input;
use src\service\Crawler;
use src\service\tieba\Main;

class Member {
    use Router;
    public function get($id) {
        $account = Auth::account();
        $page = Input::get('page', '/^[0-9]+/');
        $tbUrl = "http://tieba.baidu.com/f?ie=utf-8&kw=$id";

        $crawler = new Crawler('http://tieba.baidu.com/');

        $main = new Main();
        Log::debug("tieba|main|$account|$tbUrl");
        $data = $crawler->crawl($tbUrl, $main);
        if (!$data['ok']) {
            return;
        }
        $num = $data['num'];
        $url = $data['url'];

        $handler = new \src\service\tieba\Member();
        \src\common\Log::debug("tieba|member|$account|$page|$url");
        $handler->page($page);
        $members = $crawler->crawl("$url&pn=$page", $handler);
        $membersJson = json_encode($members);
        echo "gkSendMembers($num, $membersJson)";
    }
} 