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

        $minTrade = Input::get('minTrade', "/^[0-9]{1,5}$/", 100);
        $maxTrade = Input::get('maxTrade', "/^[0-9]{1,7}$/", 0);
        if ($minTrade > $maxTrade && $maxTrade != 0) {
            return;
        }

        $minComment = Input::get('minComment', "/^[0-9]{1,5}$/", 10);
        $maxComment = Input::get('maxComment', "/^[0-9]{1,7}$/", 0);
        if ($minComment > $maxComment && $maxComment != 0) {
            return;
        }

        $minDate = Input::get('minDate', "/^[0-9]{1,2}$/", 0);
        $maxDate = Input::get('maxDate', "/^[0-9]{1,2}$/", 1);
        if ($minDate > $maxDate) {
            return;
        }

        $buyer = new \src\service\taobao\handler\Buyer();
        $buyer->dateRange($minDate, $maxDate);

        $handler = new Item($buyer);

        $handler->tradeRange($minTrade, $maxTrade)
            ->commendRange($minComment, $maxComment);

        $users = array();
        $crawler = new Crawler();
        $page = 1;
        do {
            $num = ($page - 1) * 96;
            $url = preg_replace("/(&s=[0-9]+&)/", "&s=$num&", $url);
            Log::debug("buyer|$id|$page|$msg|$url");
            $users = array_merge($users, $crawler->crawl($url, $handler));
            ++$page;
        } while($handler->nextPage() && $page <= 2);
        //$users = array($users[0], $users[1]);
        echo "send(" . json_encode(array(
                'code' => true,
                'users' => array_values(array_unique($users)),
                'msg' => $msg,
        )) . ");";
    }
} 