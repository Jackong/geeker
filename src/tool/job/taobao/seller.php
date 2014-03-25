<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午1:04
 */
if ($argc < 3) {
    die("usage: $argv[0] url maxPage\n");
}
require_once __DIR__ . "/../../../../view/env.php";

$url = $argv[1];
$url .= "&s=0&json=on";

$maxPage = $argv[2];

$handler = new \src\service\taobao\handler\Item(new \src\service\taobao\handler\Seller());
$handler->minTradeNum(100);

$users = array();
$crawler = new \src\service\Crawler();
$page = 1;
do {
    $num = ($page - 1) * 96;
    $url = preg_replace("/(&s=[0-9]+&)/", "&s=$num&", $url);
    \src\common\Log::debug("crawl|$page|$url");
    $users = array_merge($users, $crawler->crawl($url, $handler));
    ++$page;
} while($handler->nextPage() && $page <= $maxPage);

echo "count:" . count(array_values(array_unique($users))), "\n";