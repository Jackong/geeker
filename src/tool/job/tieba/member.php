<?php
/**
 * @author: Jackong
 * Date: 14-3-27
 * Time: 下午1:59
 */

if ($argc < 3) {
    die("usage: $argv[0] <account> <url>\n");
}
require_once __DIR__ . "/../../../../view/env.php";

$start = time();
$account = $argv[1];
$url = $argv[2];
$handler = new \src\service\tieba\Member();
$crawler = new \src\service\Crawler('http://tieba.baidu.com/');
$members = array();
$page = 1;
$redis = \src\common\util\Redis::select('tieba');
if ($redis->get("flag.$account")) {
    \src\common\Log::error("tieba member is crawling|$account|$url");
    return;
}
$redis->set("flag.$account", true, 600);
$redis->del($account);
$redis->close();
do {
    \src\common\Log::debug("tieba|member|$account|$page|$url");
    $handler->page($page);
    $members = array_merge($members, $crawler->crawl("$url&pn=$page", $handler));
    $page++;
} while($handler->nextPage());

$members = array_unique($members);
$redis = \src\common\util\Redis::select('tieba');
$redis->multi();
foreach ($members as $member) {
    $redis->rPush($account, $member);
}
$redis->exec();
$redis->expire($account, 86400);
$redis->del("flag.$account");
$redis->close();
\src\common\Log::trace("time used: " . (time() - $start));


