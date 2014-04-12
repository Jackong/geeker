<?php
/**
 * @author: Jackong
 * Date: 14-4-11
 * Time: 下午6:56
 */

namespace src\router\qq;


use src\common\Log;
use src\common\Router;
use src\common\util\Input;

class Group {
    use Router;

    const IP = '183.61.32.184';

    public function gets()
    {
        $keyword = urldecode(Input::get('keyword'));
        $min = Input::get('min', '/^[0-9]+/', 0);
        $cookie = urldecode(Input::get('ck'));
        $page = Input::get('page', '/^[0-9]+/', 0);
        $token = Input::get('token');
        $data = $this->crawl('http://qun.qq.com/cgi-bin/group_search',
            array(
                'k' => $keyword,
                'p' => $page,
                'n' => 10,
                'c' => 1,
                'st' => 1,
                'bkn' => $token
            ),
            $cookie
        );
        $json = json_decode($data, true);
        if (is_null($json) || !isset($json['ec']) || $json['ec'] != 0) {
            Log::error("group|search|$data");
            echo 'geek.qGroup.error("拿不到Q群数据")';
            return;
        }
        $isEnd = $json['IsEnd'];
        $groups = array();
        foreach ($json['gList'] as $group) {
            if ($group['gMemNum'] < $min) {
                continue;
            }
            $group['gName'] = html_entity_decode($group['gName']);
            $groups[] = $group;
        }
        echo "geek.qGroup.searchCB($isEnd, " . $json['gTotal'] . ", " . json_encode($groups) . ")";
    }

    public function get($gc)
    {
        $cookie = urldecode(Input::get('ck'));
        $token = Input::get('token');
        $msg = Input::optional('msg');
        $data = $this->crawl('http://qun.qq.com/cgi-bin/add_group',
            array(
                'gc' => $gc,
                'msg' => $msg,
                'bkn' => $token,
            ),
            $cookie
        );
        $json = json_decode($data, true);
        if (is_null($json) || !isset($json['ec']) || $json['ec'] != 0 || !isset($json['result']) || $json['result'] != 1) {
            Log::trace("group|add|$data");
            echo "geek.qGroup.error('失败：${json['result']}')";
            return;
        }
        echo "geek.qGroup.addCB()";
    }

    private function crawl($url, $params, $cookie) {
        $post = '';
        foreach ($params as $key => $val) {
            $post .= "$key=$val&";
        }

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_HEADER,0);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1);

        curl_setopt($ch, CURLOPT_REFERER, 'http://qun.qq.com/fenlei.html');

        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36');

        curl_setopt($ch, CURLOPT_POST, 1);

        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);

        curl_setopt($ch, CURLOPT_COOKIE, $cookie);

        curl_setopt($ch, CURLOPT_HTTPHEADER,  array(
            'Host: qun.qq.com',
            'Origin: http://qun.qq.com',
            'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
            'X-FORWARDED-FOR:' . self::IP ,
            'CLIENT-IP:' . self::IP
        ));
        $data = curl_exec($ch);

        curl_close($ch);

        return trim($data);
    }

} 