<?php
/**
 * @author: Jackong
 * Date: 14-3-7
 * Time: 上午8:40
 */

namespace src\service\taobao\handler;


use src\common\Log;
use src\service\Handler;

class Comment extends Handler {
    private $minDate = 0;

    public function minDate($min) {
        $this->minDate = $min;
    }

    public function handling($data)
    {
        $comments = array();
        $data = trim($data, "()");
        $data = json_decode($data, true);
        if (is_null($data) || !isset($data['comments'])) {
            Log::error('Taobao comment not found');
            return $comments;
        }
        if (isset($data['maxPage']) && isset($data['currentPageNum'])) {
            $this->setPage($data['maxPage'], $data['currentPageNum']);
        }
        foreach ($data['comments'] as $comment) {
            if (!isset($comment['user']) || !isset($comment['user']['anony']) || $comment['user']['anony']) {
                continue;
            }
            $time = strtotime(str_replace(array("年", "月", "日"), "/", $comment['date']));
            if ($time < $this->minDate) {
                continue;
            }
            $comments[] = $comment['user']['nick'];
        }

        return $comments;
    }

}

/*
    {
      "append": null,
      "appendCanExplainable": false,
      "appendList": [],
      "auction": {
        "aucNumId": "14096836199",
        "auctionPic": "http://img.taobaocdn.com/bao/uploaded/i4/T1ssCzFExeXXXXXXXX_!!0-item_pic.jpg_40x40.jpg",
        "link": "http://trade.taobao.com/trade/detail/trade_snap.htm?trade_id=574564423494124",
        "sku": "颜色分类:42寸LED（超窄边）电影版  套餐类型:官方标配",
        "thumbnail": "",
        "title": "42寸LED液晶电视 55寸LED电视 32寸LED液晶电视 安卓网络电视"
      },
      "award": "",
      "bidPriceMoney": {
        "amount": 1750,
        "cent": 175000,
        "centFactor": 100,
        "currency": {
          "currencyCode": "CNY",
          "defaultFractionDigits": 2,
          "symbol": "￥"
        },
        "currencyCode": "CNY",
        "displayUnit": "元"
      },
      "buyAmount": 1,
      "content": "好评！",
      "date": "2014年03月25日 12:59",
      "dayAfterConfirm": 0,
      "enableSNS": false,
      "from": "",
      "lastModifyFrom": 0,
      "payTime": {
        "date": 18,
        "day": 2,
        "hours": 10,
        "minutes": 1,
        "month": 2,
        "seconds": 38,
        "time": 1395108098000,
        "timezoneOffset": -480,
        "year": 114
      },
      "photos": [],
      "promotionType": "",
      "propertiesAvg": "5.0",
      "rate": "1",
      "rateId": 211032961197,
      "raterType": 0,
      "reply": null,
      "shareInfo": {
        "lastReplyTime": "",
        "pic": 0,
        "reply": 0,
        "share": false,
        "userNumIdBase64": ""
      },
      "showCuIcon": false,
      "showDepositIcon": false,
      "spuRatting": [
        {
          "desc": "非常清晰",
          "name": "清晰度",
          "value": "5"
        },
        {
          "desc": "非常方便",
          "name": "操作方便",
          "value": "5"
        },
        {
          "desc": "非常高，物超所值",
          "name": "性价比",
          "value": "5"
        },
        {
          "desc": "非常漂亮大气",
          "name": "外观",
          "value": "5"
        }
      ],
      "status": 0,
      "tag": "",
      "useful": 0,
      "user": {
        "anony": false,
        "avatar": "http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=278912441&width=40&height=40&type=sns",
        "displayRatePic": "b_red_3.gif",
        "nick": "yangshuxiang3668",
        "nickUrl": "http://my.taobao.com/UvCc4OFHyMmQY",
        "rank": 43,
        "rankUrl": "http://rate.taobao.com/rate.htm?user_id=278912441&rater=1",
        "userId": "278912441",
        "vip": "",
        "vipLevel": 2
      },
      "validscore": 1
    }

 */