<?php
/**
 * @author: Jackong
 * Date: 14-3-13
 * Time: 上午9:07
 */

namespace test\common;


use src\common\Log;

class LogTest extends \PHPUnit_Framework_TestCase {

    public function testLog()
    {
        Log::instance()->info('xxx');
    }
}
 