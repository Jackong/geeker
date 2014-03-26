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
use src\service\ali\WangWang;

class Account {
    use Router;

    public function gets() {
        $cb = Input::optional('cb');
        $collection = Mongo::collection('ww.account');
        $doc = $collection->findOne(
            array(
                'uid' => Auth::account(),
            )
        );
        $accounts = array();
        if (!is_null($doc) && is_array($doc['accounts'])) {
            foreach ($doc['accounts'] as  $item) {
                $accounts[] = array(
                    'account' => $item['account'],
                    'password' => $item['password'],
                );
            }
        }

        if (is_null($cb)) {
            Output::set('accounts', $accounts);
        } else {
            echo "$cb(" . json_encode($accounts) . ")";
        }
    }

    public function update() {
        $account = Input::get('account');
        $password = Input::get('password');
        $uid = Auth::account();
        WangWang::del($uid, $account);
        WangWang::update($uid, array(
            'account' => $account,
            'password' => $password,
        ));
        Output::set('code', true);
    }

    public function del($account) {
        WangWang::del(Auth::account(), $account);
        Output::set('code', true);
    }
} 