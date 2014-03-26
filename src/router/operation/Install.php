<?php
/**
 * @author: Jackong
 * Date: 14-3-26
 * Time: 下午5:11
 */

namespace src\router\operation;


use src\common\util\Auth;
use src\common\util\Output;

class Install {
    public function get($id) {
        if ('jack' != Auth::account()) {
            return;
        }
        exec("sh " . PROJECT . "/install.sh >/dev/null 2>&1", $output);
        Output::set('output', $output);
    }
} 