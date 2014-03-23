<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午9:07
 */

namespace src\service\tmall\handler;


use src\common\Log;
use src\service\Handler;

class Comment extends Handler {
    protected function handling($data)
    {
        $comments = array();
        $data = '{' . $data . '}';
        $data = json_decode($data, true);
        if (is_null($data) || !isset($data['rateDetail']['rateList'])) {
            Log::error("Tmall comment not found");
            return $comments;
        }
        $data = $data['rateDetail'];
        if (isset($data['paginator']['lastPage']) && isset($data['paginator']['page'])) {
            $this->setPage($data['paginator']['lastPage'], $data['paginator']['page']);
        }
        foreach ($data['rateList'] as $comment) {
            if (!isset($comment['anony']) || $comment['anony']) {
                continue;
            }
            $comments[] = $comment['displayUserNick'];
        }

        return $comments;
    }

} 