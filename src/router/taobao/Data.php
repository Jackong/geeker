<?php
/**
 * @author: Jackong
 * Date: 14-3-15
 * Time: 下午3:48
 */

namespace src\router\taobao;


use src\common\Router;

class Data {
    use Router;
    public function get($id) {
        echo "$id(" . json_encode(array(
                'users' => array('jackingchain'),
                'msg' => 'hahaxx,jack',
            )) . ");";
    }
}