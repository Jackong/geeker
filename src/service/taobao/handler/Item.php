<?php
/**
 * @author: Jackong
 * Date: 14-3-4
 * Time: 下午1:24
 */

namespace src\service\taobao\handler;


use src\common\Log;
use src\service\taobao\Handler;

class Item extends Handler {

    public function handling($data) {
        $data = json_decode($data, true);
        if (is_null($data) || !isset($data['status']) || !isset($data['status']['code']) || $data['status']['code'] != 200) {
            Log::error('Bad data');
            return array();
        }
        if (isset($data['page'])) {
            $this->setPage($data['page']['totalPage'], $data['page']['currentPage']);
        }
        if (is_null($data['mallItemList'])) {
            $data['mallItemList'] = array();
        }
        if (is_null($data['itemList'])) {
            $data['itemList'] = array();
        }
        return array_merge($data['mallItemList'], $data['itemList']);
    }
}

/*
  {
    "image": "http://img02.taobaocdn.com/bao/uploaded/i2/T1A6KSFu4cXXXXXXXX_!!0-item_pic.jpg",
    "tip": "金粉世家2014春季时尚女包新款大包单肩手提包韩版潮流女士包包邮",
    "title": "金粉世家2014春季时尚女包新款大包单肩手提包韩版潮流女士包包邮",
    "price": "298.00",
    "currentPrice": "199.00",
    "vipPrice": "",
    "unitPrice": null,
    "unit": null,
    "isVirtual": "0",
    "ship": "0.0",
    "tradeNum": "14536",
    "nick": "金粉世家箱包旗舰店",
    "sellerId": "733424290",
    "guarantee": "0",
    "itemId": "23374884730",
    "isLimitPromotion": "0",
    "loc": "广东广州",
    "storeLink": "http://store.taobao.com/shop/view_shop.htm?user_number_id=733424290&ssid=r11",
    "href": "http://detail.tmall.com/item.htm?id=23374884730&source=dou",
    "commend": "33682",
    "commendHref": "http://detail.tmall.com/item.htm?id=23374884730&source=dou&on_comment=1",
    "multipic": "1",
    "spm": "d11",
    "sellerSpm": "d21",
    "source": "doufu",
    "icon": {
      "all": [
        {
          "id": "tmall"
        },
        {
          "id": "credit"
        }
      ]
    },
    "sameItemInfo": null,
    "similar": null,
    "ratesum": "15",
    "ratesumImg": null,
    "goodRate": null,
    "dsrScore": "4.83"
  }
 */