<?php
/**
 * @author: Jackong
 * Date: 14-3-6
 * Time: 上午9:06
 */

namespace src\service\taobao\consumer;


use src\service\taobao\Consumer;

class Seller extends Consumer {
    public function consume($items)
    {
        $count = 0;
        foreach ($items as $item) {
            $str = $this->sender->send($item['nick'],  $count . "您好");
            $result = json_decode($str, true);
            if (!is_null($result) && isset($result['success']) && $result['success'] && isset($result['result']['send']) && $result['result']['send']) {
            echo "${item['nick']}:";
                echo "ok\n";
                $count++;
                sleep(7);
                continue;
            }
            echo "failed:$str\n";
            break;
        }
        echo $count, "\n";
    }

} 