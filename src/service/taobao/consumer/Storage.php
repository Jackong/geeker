<?php
/**
 * @author: Jackong
 * Date: 14-3-6
 * Time: 上午9:11
 */

namespace src\service\taobao\consumer;


use src\service\taobao\Consumer;

class Storage extends Consumer{
    public function consume($items)
    {
        file_put_contents(PROJECT . "/items.json", json_encode($items));
    }
} 