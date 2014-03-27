<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午2:35
 */

if ($argc < 5) {
    die("usage: $argv[0] <account> <recent> <trade> <url>\n");
}
require_once __DIR__ . "/../../../../view/env.php";

$account = $argv[1];
$recent = $argv[2];
$trade = $argv[3];
$url = $argv[4];
$url .= "&s=0&json=on";


$buyer = new \src\service\taobao\handler\Buyer();
$buyer->recent($recent);

$handler = new \src\service\taobao\handler\Item($buyer);
$handler->minTradeNum($trade);

$crawler = new \src\service\Crawler('http://www.tmall.com/');
$page = 1;

$redis = \src\common\util\Redis::select('ww');
do {
    $num = ($page - 1) * 96;
    $url = preg_replace("/(&s=[0-9]+&)/", "&s=$num&", $url);
    \src\common\Log::debug("buyer|$page|$url");
    $users = $crawler->crawl($url, $handler);
    $redis->multi();
    foreach ($users as $user) {
        $redis->sAdd($account, $user);
    }
    $redis->exec();
    ++$page;
} while($handler->nextPage() && $page <= 3);

echo "count:" . $redis->sCard($account), "\n";