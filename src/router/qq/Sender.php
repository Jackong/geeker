<?php
/**
 * @author: Jackong
 * Date: 14-4-9
 * Time: 下午4:00
 */

namespace src\router\qq;


use Slim\Slim;
use src\common\Log;
use src\common\Router;
use src\common\util\Mongo;

class Sender {
    use Router;

    public function get($id)
    {

        $auth = json_decode(Slim::getInstance()->getCookie('auth'), true);
        if (is_null($auth) ||  md5("${auth['account']}|${auth['role']}") !== $auth['token']) {
            Log::error('auth|' . json_encode($auth));
            echo 'onError("未登录或账号过期")';
            return;
        }
        $qq = Mongo::collection('auth.qq');
        $doc = $qq->findOne(
            array(
                'account' => $auth['account']
            ),
            array(
                'online',
                'ip'
            )
        );
        if (is_null($doc) || !$doc['online'] || $doc['ip'] !== $auth['ip']) {
            Log::error('multi login|' . $auth['account'] . json_encode($doc) . "|" . $auth['ip']);
            echo 'onError("不支持多开")';
            return;
        }
        echo file_get_contents(PROJECT . '/view/js/platform/qq.js');
    }

} 