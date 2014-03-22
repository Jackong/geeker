<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午3:41
 */

namespace src\service\taobao\handler;


use src\service\taobao\Handler;

class Seller extends Handler {
    protected function handling($items)
    {
        $users = array();
        foreach ($items as $item) {
            $users[] = $item['nick'];
        }
        return $users;
    }
}