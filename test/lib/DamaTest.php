<?php
/**
 * @author: Jackong
 * Date: 14-3-29
 * Time: 上午9:22
 */

namespace test\lib;

require PROJECT . '/src/lib/dama2Lib/Dama2CurlApi.php';
class DamaTest extends \PHPUnit_Framework_TestCase {

    public function testLocalFile()
    {
        $api = new \Dama2Api('dama753951', 'zzz753951');
        $result = $api->decode(PROJECT . "/view/img/genimage.jpeg", 42);
        var_export($result);
        $this->assertEquals(0, $result['ret']);
        $this->assertTrue(isset($result['id']));
        $result = $api->get_result($result['id']);
        var_export($result);
        $this->assertEquals(0, $result['ret']);
        $this->assertEquals('QDE4', $result['result']);
    }
}
 