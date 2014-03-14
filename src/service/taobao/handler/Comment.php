<?php
/**
 * @author: Jackong
 * Date: 14-3-7
 * Time: 上午8:40
 */

namespace src\service\taobao\handler;


use src\service\taobao\Handler;

class Comment extends Handler {
    public function handling($data)
    {
        $data = trim($data, "()");
        $data = json_decode($data, true);
        if (!isset($data['comments'])) {
            return false;
        }
        if (isset($data['maxPage']) && isset($data['currentPageNum'])) {
            $this->setPage($data['maxPage'], $data['currentPageNum']);
        }
        $this->consumer->consume($data['comments']);
        return true;
    }

}