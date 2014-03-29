<?php
/**
 * @author: Jackong
 * Date: 14-3-29
 * Time: 上午9:28
 */

namespace src\service\tieba;


use src\service\Handler;

class VCode extends Handler{
    protected function handling($data)
    {
        return false === $data ? null : $data;
    }

} 