<?php
/**
 * @author: Jackong
 * Date: 14-3-3
 * Time: 上午9:21
 */

namespace src\service;

class Crawler {
    public function crawl($url, Handler $handler, $conv = true) {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch,CURLOPT_HEADER,0);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);

        curl_setopt($ch, CURLOPT_REFERER, 'http://www.tmall.com/');

        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36');

        $data = curl_exec($ch);

        curl_close($ch);

        $data = trim($data);
        $data = $conv ? iconv("GBK", "UTF-8", $data) : $data;
        return $handler->handle($data);
    }
} 