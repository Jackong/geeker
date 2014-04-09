<?php
/**
 * @author: Jackong
 * Date: 14-4-9
 * Time: 下午1:43
 */

namespace src\router\qq;


use Slim\Slim;
use src\common\Log;
use src\common\Router;
use src\common\util\Input;
use src\common\util\Mongo;
use src\common\util\Output;

class Auth {
    use Router;

    public function update() {
        $account = Input::get('account');
        $password = Input::get('password');

        $ok = $this->updateStatus($account, $password, true);
        if (!$ok) {
            header('Location: /qq');
            return;
        }
        Slim::getInstance()->setCookie('auth',
            json_encode(array(
                'account' => $account
            )),
            '1 days',
            '/api/qq/'
        );
    }

    public function del($id)
    {
        $password = Input::get('password');
        $ok = $this->updateStatus($id, $password, false);
        Slim::getInstance()->deleteCookie('auth');
        if (!$ok) {
            Output::set('msg', '账号或密码错误或过期');
            return;
        }
        Output::set('msg', '退出成功');
    }

    private function updateStatus($account, $password, $online) {
        $qq = Mongo::collection('auth.qq');
        $doc = $qq->findOne(
            array(
                'account' => $account
            ),
            array(
                'password',
                'expiration',
                'online'
            )
        );
        if (is_null($doc) || $doc['password'] != md5($password) || $doc['online'] || TIME >= $doc['expiration']) {
            Log::error("qq|update status|$account|$password|$online|${doc['online']}|${doc['expiration']}");
            return false;
        }
        return $qq->update(
            array(
                'account' => $account
            ),
            array(
                'online' => $online
            )
        );
    }


} 