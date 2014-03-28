<?php
/**
 * @author: Jackong
 * Date: 14-3-28
 * Time: 下午9:36
 */

namespace src\service\tieba;


use src\common\Log;
use src\service\Handler;

class Main extends Handler{
    protected function handling($data)
    {
        $result = array(
            'ok' => false
        );
        if (!preg_match("/id=\"member_name_link\"\\shref=\"(.+?)\"/", $data, $urlMatches)) {
            Log::error('member_name_url not found');
            return $result;
        }
        $result['url'] = 'http://tieba.baidu.com' . $urlMatches[1];

        if (!preg_match("/\"member_num\":(.+?),/", $data, $numMatches)) {
            Log::error('member_num not found');
            return $result;
        }
        $result['num'] = $numMatches[1];
        $result['ok'] = true;
        return $result;
    }

} 