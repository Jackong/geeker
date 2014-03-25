<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午1:04
 */
if ($argc < 4) {
    die("usage: $argv[0] <account> <trade> <url>\n");
}
require_once __DIR__ . "/../../../../view/env.php";

$account = $argv[1];
$trade = $argv[2];
$url = $argv[3];
$url .= "&s=0&json=on";

$handler = new \src\service\taobao\handler\Item(new \src\service\taobao\handler\Seller());
$handler->minTradeNum(100);

$redis = \src\common\util\Redis::select('ww');
$crawler = new \src\service\Crawler();
$page = 1;
do {
    $num = ($page - 1) * 96;
    $url = preg_replace("/(&s=[0-9]+&)/", "&s=$num&", $url);
    \src\common\Log::debug("seller|$page|$url");
    $users = $crawler->crawl($url, $handler);
    $redis->multi();
    foreach ($users as $user) {
        $redis->sAdd($account, $user);
    }
    $redis->exec();
    ++$page;
} while($handler->nextPage() && $page <= 3);

echo "count:" . $redis->sCard($account), "\n";