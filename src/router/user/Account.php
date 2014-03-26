<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 上午9:13
 */

namespace src\router\user;


use Slim\Slim;
use src\common\Router;
use src\common\util\Auth;
use src\common\util\Input;
use src\common\util\Mongo;
use src\common\util\Output;

class Account {
    use Router;
    public function update() {
        $for = Input::get('for', '/^(signin|signup)$/');
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
            if (!is_null($doc)) {
                header('Location: /');
                return;
            }
            $collection->insert(array(
                'account' => $account,
                'password' => md5($password),
                'time' => TIME
            ));
        } else {
            if (is_null($doc) || $doc['password'] != md5($password)) {
                header('Location: /');
                return;
            }
        }
        Auth::auth($account);
        header('Location: /taobao');
    }

} 