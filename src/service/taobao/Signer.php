<?php
/**
 * @author: Jackong
 * Date: 14-3-14
 * Time: 下午6:12
 */

namespace src\service\taobao;


class Signer {
    private $robot;

    public function __construct($cookie) {
        $this->robot = new Robot($cookie);
    }

    public function login() {
        return $this->robot->exec("http://webwangwang.taobao.com/login.do?token=989289e0fd92b67e2933da4e08a96f01&nickName=%E9%80%86%E9%BB%8Ek&autoLogin=3&loginTag=908D38CF34F5835DA&nkh=%E9%80%86%E9%BB%8Ek&appId=0&t=1394790689174");
    }
} 