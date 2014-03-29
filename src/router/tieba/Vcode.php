<?php
/**
 * @author: Jackong
 * Date: 14-3-28
 * Time: 下午10:36
 */

namespace src\router\tieba;

require PROJECT . '/src/lib/dama2Lib/Dama2CurlApi.php';
use src\common\Log;
use src\common\Router;
use src\common\util\Input;

class Vcode {
    use Router;
    public function get($id) {
        $account = Input::get('account');
        $password = Input::get('password');
        $damaApi = new \Dama2Api($account, $password);
        $result = $damaApi->get_result($id);
        Log::debug("$account|$password|" . json_encode($result));
        if (!isset($result['ret'])
            || ($result['ret'] != 0 && $result['ret'] != '-303')
            || !isset($result['result'])) {
            echo 'gkVCodeErr()';
            return;
        }
        if ($result['ret'] == '-303') {
            echo 'gkVCode()';
            return;
        }
        $code = $result['result'];
        echo "gkSend('$code')";
    }

    public function gets() {
        $url = Input::get('url');
        $account = Input::get('account');
        $password = Input::get('password');
        $damaApi = new \Dama2Api($account, $password);
        $result = $damaApi->decode_url($url, 42);
        Log::debug("$account|$password|" . json_encode($result));
        if (!isset($result['ret']) || $result['ret'] != 0 || !isset($result['id'])) {
            echo 'gkVCodeErr()';
            return;
        }
        $this->get($result['id']);
    }
} 