<?php
/**
 * @author: Jackong
 * Date: 14-3-28
 * Time: 下午10:36
 */

namespace src\router\tieba;


use src\common\Router;

class Vcode {
    use Router;
    public function get($id) {
        $url = urldecode($id);
        $code = "puam";
        echo "gkSend('$code')";
    }
} 