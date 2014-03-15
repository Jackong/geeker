<?php
/**
 * @author: Jackong
 * Date: 14-3-14
 * Time: 下午6:08
 */

namespace src\service\taobao;


class Robot {
    private $cookie;
    public function __construct($cookie) {
        $this->cookie = $cookie;
    }

    public function exec($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch,CURLOPT_HEADER,0);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept-Encoding: gzip,deflate,sdch',
            'Accept-Language: zh-CN,zh;q=0.8,en-GB;q=0.6,en;q=0.4',
            'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36',
            'Accept: */*',
            'Referer: http://webwangwang.taobao.com/',
            'Connection: keep-alive',
            "Cookie: $this->cookie",
        ));
        $data = curl_exec($ch);

        curl_close($ch);

        return iconv("GBK", "UTF-8", trim($data));
    }
} 