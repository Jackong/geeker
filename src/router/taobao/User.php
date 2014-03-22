<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午2:46
 */

namespace src\router\taobao;


use src\common\Router;
use src\common\util\Input;

class User {
    use Router;
    public function get($id) {
        $password = Input::get('password');
        $url = urldecode(Input::get('url'));
        $receiver = Input::get('receiver');
        $msg = iconv("GBK", "UTF-8", Input::get('msg'));

        echo "send(" . json_encode(array(
                'code' => true,
                'users' => array('jackingchain'),
                'msg' => $msg,
            )) . ");";
    }
} 