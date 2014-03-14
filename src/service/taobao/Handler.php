<?php
/**
 * @author: Jackong
 * Date: 14-3-3
 * Time: 上午9:09
 */

namespace src\service\taobao;


abstract class Handler {
    /**
     * @var Consumer
     */
    protected $consumer;
    private $next = false;

    public function __construct(Consumer $consumer) {
        $this->consumer = $consumer;
    }

    public function handle($data) {
        $this->next = false;
        return $this->handling($data);
    }

    protected abstract function handling($data);

    protected function setPage($max, $current) {
        $this->next = $max > $current;
    }

    public function next() {
        return $this->next;
    }
}