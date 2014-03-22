<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午3:54
 */

namespace src\service\taobao\handler;


use src\common\Log;
use src\service\taobao\Crawler;
use src\service\taobao\Handler;

class Buyer extends Handler {
    /**
     * @var Comment
     */
    private $comment;
    private $crawler;

    public function __construct(Handler $handler = null)
    {
        parent::__construct($handler);
        $this->comment = new Comment();
        $this->crawler = new Crawler();
    }

    protected function handling($items)
    {
        $comments = array();
        foreach ($items as $item) {
            if (!isset($item['sellerId'])  || !isset($item['itemId']) || !isset($item['commend']) || $item['commend'] <= 50) {
                continue;
            }
            $sellerId = $item['sellerId'];
            $itemId = $item['itemId'];
            Log::trace("buyer|$sellerId|$itemId");
            $page = 1;
            do {
                $url = "http://rate.taobao.com/feedRateList.htm?userNumId=$sellerId&auctionNumId=$itemId&currentPageNum=$page&orderType=sort_weight&showContent=1";
                $comments = array_merge($comments, $this->crawler->crawl($url, $this->comment));
                ++$page;
            } while ($this->comment->nextPage() && $page < 5);
        }
        return $comments;
    }

} 