<?php
/**
 * @author: Jackong
 * Date: 14-3-7
 * Time: 上午8:40
 */

namespace src\service\taobao\handler;


use src\common\Log;
use src\service\Handler;

class Comment extends Handler {
    public function handling($data)
    {
        $comments = array();
        $data = trim($data, "()");
        $data = json_decode($data, true);
        if (is_null($data) || !isset($data['comments'])) {
            Log::error('Taobao comment not found');
            return $comments;
        }
        if (isset($data['maxPage']) && isset($data['currentPageNum'])) {
            $this->setPage($data['maxPage'], $data['currentPageNum']);
        }
        foreach ($data['comments'] as $comment) {
            if (!isset($comment['user']) || !isset($comment['user']['anony']) || $comment['user']['anony']) {
                continue;
            }
            $comments[] = $comment['user']['nick'];
        }

        return $comments;
    }

}