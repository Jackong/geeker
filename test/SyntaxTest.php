<?php
/**
 * @author: Jackong
 * Date: 14-3-25
 * Time: 下午3:22
 */

namespace test;


class SyntaxTest extends \PHPUnit_Framework_TestCase {

    public function testDate()
    {
        $time = str_replace(array("年", "月", "日"),"/", "2014年03月25日 12:59");
        $time = strtotime($time);
        $time2 = strtotime("2014/03/25/ 12:59");
        echo $time, "\n";
        echo $time2, "\n";
    }
}
 