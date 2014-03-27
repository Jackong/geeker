<?php
/**
 * @author: Jackong
 * Date: 14-3-27
 * Time: 上午11:49
 */

namespace src\service\tieba;


use src\common\Log;
use src\service\Handler;

class Member extends Handler {
    private $page;

    public function page($page) {
        $this->page = $page;
    }

    protected function handling($data)
    {
        $members = array();
        if (!preg_match_all("/class=\"user_name\"\\stitle=\"(.+?)\"/", $data, $matches)) {
            Log::error("can not found member data");
            return $members;
        }

        $members = $matches[1];
        if (!preg_match("/class=\"tbui_pagination\\stbui_pagination_left\">共(.+?)页/", $data, $pageMatches)) {
            Log::error("can not found max page");
        }
        $this->setPage($pageMatches[1], $this->page);
        return $members;

    }

} 