<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午3:54
 */

namespace src\service\taobao\handler;


use src\common\Log;
use src\service\Crawler;
use src\service\Handler;

class Buyer extends Handler {
    /**
     * @var \src\service\taobao\handler\Comment
     */
    private $tbComment;
    /**
     * @var \src\service\tmall\handler\Comment
     */
    private $tmComment;
    private $crawler;

    public function __construct(Handler $handler = null)
    {
        parent::__construct($handler);
        $this->tbComment = new \src\service\taobao\handler\Comment();
        $this->tmComment = new \src\service\tmall\handler\Comment();
        $this->crawler = new Crawler();
    }

    protected function handling($items)
    {
        $comments = array();
        foreach ($items['tmall'] as $item) {
            if (!isset($item['sellerId'])  || !isset($item['itemId']) || !isset($item['commend']) || $item['commend'] <= 50) {
                continue;
            }
            $itemId = $item['itemId'];
            $sellerId = $item['sellerId'];
            $page = 1;
            do {
                $url = "http://rate.tmall.com/list_detail_rate.htm?itemId=$itemId&sellerId=$sellerId&order=1&currentPage=$page";
                Log::trace("buyer|tmall|$sellerId|$itemId|$page|$url");
                $comments = array_merge($comments, $this->crawler->crawl($url, $this->tmComment));
                ++$page;
            } while ($this->tmComment->nextPage() && $page < 3);
        }

        foreach ($items['taobao'] as $item) {
            if (!isset($item['sellerId'])  || !isset($item['itemId']) || !isset($item['commend']) || $item['commend'] <= 50) {
                continue;
            }
            $sellerId = $item['sellerId'];
            $itemId = $item['itemId'];
            $page = 1;
            do {
                $url = "http://rate.taobao.com/feedRateList.htm?userNumId=$sellerId&auctionNumId=$itemId&currentPageNum=$page&orderType=feedbackdate";
                Log::trace("buyer|taobao|$sellerId|$itemId|$page|$url");
                $comments = array_merge($comments, $this->crawler->crawl($url, $this->tbComment));
                ++$page;
            } while ($this->tbComment->nextPage() && $page < 3);
        }
        return $comments;
    }

} 