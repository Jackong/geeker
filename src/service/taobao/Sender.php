<?php
/**
 * @author: Jackong
 * Date: 14-3-4
 * Time: 下午1:34
 */

namespace src\service\taobao;


class Sender {

    private $robot;

    public function __construct($cookie) {
        $this->robot = new Robot($cookie);
    }

    public function send($nick, $msg) {
        return $this->robot->exec("http://webwangwang.taobao.com/send.do?userId=cntaobao$nick&content=$msg");
    }
}