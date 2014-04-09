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

    const FAILURE = 0;
    const OK = 1;
    const ADMIN = 2;

    public function update() {
        $account = Input::get('account');
        $password = Input::get('password');

        $ok = $this->updateStatus($account, $password, true);
        if (self::FAILURE === $ok) {
            header('Location: /qq');
            return;
        }
        Slim::getInstance()->setCookie('auth',
            json_encode(array(
                'account' => $account,
                'role' => $ok,
                'token' => md5("$account|$ok")
            )),
            '1 days',
            '/api/qq/'
        );

        if ($ok === self::OK) {
            header('Location: /qq/tools.html');
            return;
        }
        if ($ok === self::ADMIN) {
            header('Location: /qq/admin.html');
            return;
        }
    }

    public function del($id)
    {
        $password = Input::get('password');
        $ok = $this->updateStatus($id, $password, false);
        Slim::getInstance()->deleteCookie('auth');
        if (self::FAILURE === $ok) {
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
                'online',
                'admin',
                'account',
                'time'
            )
        );
        if (is_null($doc) || $doc['password'] != md5($password) || $doc['online'] || TIME >= $doc['expiration']) {
            Log::error("qq|update status|$account|$password|$online|${doc['online']}|${doc['expiration']}");
            return self::FAILURE;
        }
        unset($doc['_id']);
        $ok = $qq->update(
            array(
                'account' => $account
            ),
            $doc
        );
        if (!$ok) {
            return self::FAILURE;
        }
        if ($doc['admin']) {
            return  self::ADMIN;
        }
        return self::OK;
    }
} 