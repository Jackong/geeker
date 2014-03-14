<?php
/**
 * @author: Jackong
 * Date: 14-3-6
 * Time: 上午9:05
 */

namespace src\service\taobao\consumer;


use src\service\taobao\Consumer;
use src\service\taobao\Crawler;
use src\service\taobao\handler\Comment;
use src\service\taobao\Sender;

class Commenter extends Consumer {
    private $crawler;
    private $handler;
    public function __construct(Sender $sender)
    {
        parent::__construct($sender);
        $this->crawler = new Crawler();
        $this->handler = new Comment(new Storage($this->sender));
    }

    public function consume($items)
    {
        foreach ($items as $item) {
            if (!isset($item['sellerId'])  || !isset($item['itemId']) || !isset($item['commend']) || $item['commend'] <= 50) {
                continue;
            }
            $sellerId = $item['sellerId'];
            $itemId = $item['itemId'];
            echo "$sellerId:$itemId:\n";
            $page = 1;
            do {
                $url = "http://rate.taobao.com/feedRateList.htm?userNumId=$sellerId&auctionNumId=$itemId&currentPageNum=$page&orderType=sort_weight&showContent=1";
                $this->crawler->crawl($url, $this->handler);
                ++$page;
            } while ($this->handler->next());
            echo "page:", $page - 1, "\n";
        }
    }

} 