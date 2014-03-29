<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 上午9:13
 */

namespace src\router\user;


use src\common\Router;
use src\common\util\Auth;
use src\common\util\Input;
use src\common\util\Mongo;

class Account {
    use Router;
    public function update() {
        $for = Input::get('for', '/^(signin|signup)$/');
        $platform = Input::get('platform', '/^(tieba|taobao)$/');
        $account = Input::get('account');
        $password = Input::get('password');
        $collection = Mongo::collection('geeker.account');
        $doc = $collection->findOne(array(
                'account' => $account,
            ),
            array(
                'password'
            )
        );
        if ($for == 'signup') {
            if (Auth::account() != 'jack') {
                header('Location: /sign/in.html');
                return;
            }
            if (!is_null($doc)) {
                header('Location: /sign/up.html');
                return;
            }
            $collection->insert(array(
                'account' => $account,
                'password' => md5($password),
                'platform' => $platform,
                'time' => TIME
            ));
            header('Location: /sign/up.html?ok=1');
            return;
        } else {
            if ($account == 'jack' && $password == '7geeker7') {
                Auth::auth($account, "/$platform");
                header("Location: /$platform");
            } elseif (is_null($doc) || $doc['password'] != md5($password)) {
                header('Location: /sign/in.html');
                return;
            }
        }
        Auth::auth($account, "/$platform");
        header("Location: /$platform");
    }

} 