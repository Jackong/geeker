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
use src\common\util\Auth;
use src\common\util\Input;
use src\service\Crawler;

class Vcode {
    use Router;
    public function get($id) {
        //$uid = Auth::account();
        $account = Input::get('account');
        $password = Input::get('password');
        $damaApi = new \Dama2Api($account, $password);
        $result = $damaApi->get_result($id);
        if (!isset($result['ret'])
            || ($result['ret'] != 0 && $result['ret'] != '-303')) {
            Log::debug("$account|$password|$id|can not get the result of vcode" . json_encode($result));
            echo 'gkVCodeErr()';
            return;
        }
        if ($result['ret'] == '-303') {
            Log::debug("$account|$password|waiting vcode result|" . json_encode($result));
            echo "gkWaitVCode('$id')";
            return;
        }
        $code = $result['result'];
        echo "gkSend('$code')";
    }

    public function gets() {
        //$uid = Auth::account();
        $url = urldecode(Input::get('url'));
        $account = Input::get('account');
        $password = Input::get('password');
        $crawler = new Crawler('http://tieba.baidu.com/');
        $handler = new \src\service\tieba\VCode();
        Log::debug("tieba|vcode|$account|$url");
        $data = $crawler->crawl($url, $handler, false);
        if (is_null($data)) {
            Log::error("$account|$password|can not download vcode image|$url");
            echo 'gkVCode()';
            return;
        }

        $file = "/tmp/tieba_vcode_$account.jpeg";
        if (false === file_put_contents($file, $data)) {
            Log::error("$account|$password|can not save vcode image|$file|$url");
            echo "gkVCode()";
            return;
        }
        $damaApi = new \Dama2Api($account, $password);
        $result = $damaApi->decode($file, 42);
        if (!isset($result['ret']) || $result['ret'] != 0 || !isset($result['id'])) {
            Log::error("$account|$password|can not decode vcode|" . json_encode($result));
            echo 'gkVCodeErr()';
            return;
        }
        Log::debug("$account|$password|decode result|"  . json_encode($result));
        echo "gkWaitVCode('" . $result['id'] . "')";
    }
} 