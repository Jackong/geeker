<?php
/**
 * @author: Jackong
 * Date: 14-3-22
 * Time: 下午2:46
 */

namespace src\router\taobao;


use src\common\Log;
use src\common\Router;
use src\common\util\Input;
use src\service\Crawler;
use src\service\taobao\handler\Item;

class Buyer {
    use Router;
    public function get($id) {
        $password = Input::get('password');
        if ($id !== 'geeker' || $password !== 'daisy') {
            return;
        }
        $url = urldecode(Input::get('url'));
        if (false === strpos($url, 'http://list.taobao.com/itemlist')) {
            return;
        }
        $url .= '&s=0&json=on';
        $msg = iconv("GBK", "UTF-8", Input::get('msg'));

        $minTrade = Input::get('trade', "/^[0-9]{1,2}$/", 10);

        $recent = Input::get('recent', "/^[0-9]{1,2}$/", 0);

        $buyer = new \src\service\taobao\handler\Buyer();
        $buyer->recent($recent);

        $handler = new Item($buyer);

        $handler->minTradeNum($minTrade);

        $users = array();
        $crawler = new Crawler();
        $page = 1;
        do {
            $num = ($page - 1) * 96;
            $url = preg_replace("/(&s=[0-9]+&)/", "&s=$num&", $url);
            Log::debug("buyer|$id|$page|$msg|$url");
            $users = array_merge($users, $crawler->crawl($url, $handler));
            ++$page;
        } while($handler->nextPage() && $page <= 1);
        $users = array($users[0], $users[1]);
        echo "send(" . json_encode(array(
                'code' => true,
                'users' => array_values(array_unique($users)),
                'msg' => $msg,
        )) . ");";
    }
} 