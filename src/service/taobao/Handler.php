<?php
/**
 * @author: Jackong
 * Date: 14-3-3
 * Time: 上午9:09
 */

namespace src\service\taobao;


abstract class Handler {
    private $nextPage = false;
    /**
     * @var Handler
     */
    private $handler;

    public function __construct(Handler $handler = null) {
        $this->handler = $handler;
    }

    public function handle($data) {
        $this->nextPage = false;
        $data = $this->handling($data);
        if (is_null($this->handler)) {
            return $data;
        }
        return $this->handler->handle($data);
    }

    protected abstract function handling($data);

    protected function setPage($max, $current) {
        $this->nextPage = $max > $current;
    }

    public function nextPage() {
        return $this->nextPage;
    }
}