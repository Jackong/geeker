<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 下午2:10
 */

namespace src\service\ali;


use src\common\util\Mongo;

class WangWang {

    public static function update($uid, $obj) {
        $collection = Mongo::collection('ww.account');
        $collection->update(
            array(
                'uid' => $uid,
            ),
            array(
                '$addToSet' => array(
                    'accounts' => $obj
                ),
            ),
            array(
                'upsert' => true,
            )
        );
    }

    public static function del($uid, $account) {
        $collection = Mongo::collection('ww.account');
        $collection->update(
            array(
                'uid' => $uid
            ),
            array(
                '$pull' => array(
                    'accounts' => array(
                        'account' => $account
                    )
                )
            )
        );
    }
} 