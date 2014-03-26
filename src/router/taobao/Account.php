<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 上午9:01
 */

namespace src\router\taobao;


use src\common\Router;
use src\common\util\Auth;
use src\common\util\Input;
use src\common\util\Mongo;
use src\common\util\Output;

class Account {
    use Router;
    public function gets() {
        $collection = Mongo::collection('ww.account');
        $cursor = $collection->find(
            array(
                'uid' => Auth::account()
            )
        );
        $accounts = array();
        foreach ($cursor as $doc) {
            $accounts[] = array(
                'account' => $doc['account'],
                'password' => $doc['password']
            );
        }
        Output::set('accounts', $accounts);
    }

    public function update() {
        $account = Input::get('account');
        $password = Input::get('password');
        $uid = Auth::account();
        $collection = Mongo::collection('ww.account');
        $doc = $collection->findOne(array(
            'uid' => $uid,
            'account' => $account
        ));
        $ok = true;
        if (!is_null($doc)) {
            Output::set('msg', '账号已经存在');
            $ok = false;
        }
        $collection->update(
            array(
                'uid' => $uid,
                'account' => $account,
            ),
            array(
                'uid' => $uid,
                'account' => $account,
                'password' => $password,
            ),
            array('upsert' => true)
        );
        Output::set('code', $ok);
    }

    public function del($account) {
        $collection = Mongo::collection('ww.account');
        $collection->remove(array(
            'uid' => Auth::account(),
            'account' => $account,
        ));
        Output::set('code', true);
    }
} 