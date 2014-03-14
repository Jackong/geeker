<?php
/**
 * @author: Jackong
 * Date: 14-3-3
 * Time: 上午9:21
 */

namespace src\service\taobao;


class Crawler {
    public function crawl($url, Handler $handler) {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch,CURLOPT_HEADER,0);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);

        $data = curl_exec($ch);

        curl_close($ch);

        return $handler->handle(iconv("GBK", "UTF-8", trim($data)));
    }
} 