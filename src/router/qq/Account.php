<?php
/**
 * @author: Jackong
 * Date: 14-4-9
 * Time: 下午3:08
 */

namespace src\router\qq;


use Slim\Slim;
use src\common\Router;
use src\common\util\Input;
use src\common\util\Mongo;
use src\common\util\Output;

class Account {
    use Router;

    public function create()
    {
        if (!$this->isAdmin()) {
            Output::set('ok', false);
            Output::set('msg', '没有权限');
            return;
        }
        $account = Input::get('account');
        $password = Input::get('password');
        $expiration = Input::get('expiration', '/^[0-9]{10}$/');
        $qq = Mongo::collection('auth.qq');
        $doc = $qq->findOne(array(
            'account' => $account
        ));
        if (!is_null($doc)) {
            Output::set('ok', false);
            Output::set('msg', '账号已存在');
            return;
        }

        $qq->insert(array(
            'account' => $account,
            'password' => md5($password),
            'admin' => false,
            'online' => false,
            'expiration' => $expiration,
            'time' => TIME
        ));
        Output::set('ok', true);
    }

    public function gets()
    {
        if (!$this->isAdmin()) {
            Output::set('ok', false);
            Output::set('msg', '没有权限');
            return;
        }
        $qq = Mongo::collection('auth.qq');
        $cursor = $qq->find();
        $users = array();
        foreach ($cursor as $doc) {
            $users[] = array(
                'account' => $doc['account'],
                'expiration' => date("Y-m-d H:i:s", $doc['expiration'])
            );
        }

        Output::set('ok', true);
        Output::set('users', $users);
    }

    public function del($id)
    {
        if (!$this->isAdmin()) {
            Output::set('ok', false);
            return;
        }
        $qq = Mongo::collection('auth.qq');
        $ok = $qq->remove(array(
            'account' => $id
        ));
        Output::set('ok', $ok);
    }

    private function isAdmin() {
        $auth = json_decode(Slim::getInstance()->getCookie('auth'), true);
        if (is_null($auth) || md5("${auth['account']}|${auth['role']}") !== $auth['token'] || $auth['role'] !== 2) {
            return false;
        }
        return true;
    }

} 