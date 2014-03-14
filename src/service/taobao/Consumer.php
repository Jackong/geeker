<?php
/**
 * @author: Jackong
 * Date: 14-3-6
 * Time: 上午9:04
 */

namespace src\service\taobao;


abstract class Consumer {

    protected $sender;

    public function __construct(Sender $sender) {
        $this->sender = $sender;
    }

    public abstract function consume($items);
} 