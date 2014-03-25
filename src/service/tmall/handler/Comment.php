<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午9:07
 */

namespace src\service\tmall\handler;


use src\common\Log;
use src\service\Handler;

class Comment extends Handler {
    private $minDate = 0;

    public function minDate($min) {
        $this->minDate = $min;
    }

    protected function handling($data)
    {
        $comments = array();
        $data = '{' . $data . '}';
        $data = json_decode($data, true);
        if (is_null($data) || !isset($data['rateDetail']['rateList'])) {
            Log::error("Tmall comment not found");
            return $comments;
        }
        $data = $data['rateDetail'];
        if (isset($data['paginator']['lastPage']) && isset($data['paginator']['page'])) {
            $this->setPage($data['paginator']['lastPage'], $data['paginator']['page']);
        }
        foreach ($data['rateList'] as $comment) {
            if (!isset($comment['anony']) || $comment['anony']) {
                continue;
            }
            $time = strtotime($comment['rateDate']);
            if ($time < $this->minDate) {
                continue;
            }
            $comments[] = $comment['displayUserNick'];
        }

        return $comments;
    }

}
/*
    {
      "aliMallSeller": false,
      "anony": false,
      "appendComment": "",
      "attributes": "",
      "auctionSku": "颜色分类:金属灰",
      "buyCount": 1,
      "cmsSource": "天猫",
      "displayRatePic": "b_red_2.gif",
      "displayRateSum": 39,
      "displayUserLink": "http://jianghu.taobao.com/u/MTkzMDM1NDMxNw==/front.htm",
      "displayUserNick": "林万霖11",
      "displayUserNumId": 1930354317,
      "displayUserRateLink": "",
      "dsr": 0,
      "fromMall": true,
      "fromMemory": 0,
      "id": 211016063895,
      "pics": "",
      "position": "",
      "rateContent": "超快物流 值",
      "rateDate": "2014-03-25 12:46:17",
      "reply": "",
      "serviceRateContent": "",
      "tamllSweetLevel": 0,
      "tmallSweetPic": "",
      "useful": true,
      "userInfo": "",
      "userVipLevel": 0,
      "userVipPic": ""
    }
*/