<?php
/**
 * @author: Jackong
 * Date: 14-3-14
 * Time: 下午6:03
 */

namespace src\router\taobao;


use src\common\Log;
use src\common\Router;
use src\common\util\Input;
use src\common\util\Output;
use src\service\taobao\Sender;
use src\service\taobao\Signer;

class Cookie {
    use Router;
    public function gets() {
        $cookie = Input::get('cookie');
        $cookie .= "; cookie2=989289e0fd92b67e2933da4e08a96f01; cookie17=Vv7Ko1CFjmU8; cookie1=U7enNRDbLSdAyd6%2B3%2BBfgRv0d6EzjGCYMiTREauOWuQ%3D";
        $good = 'lzstat_uv=3416161510135484264|3201199@2945730@2948565@2798379@2043323@3045821@2185014@2618227@2789526@3334277@3208243@3393252@2581762@3316018; l=%E9%80%86%E9%BB%8Ek::1394504388006::11; cna=QuihCwSQywoCAXFVKsZlmjxc; ali_ab=113.85.42.198.1394277595216.2; wwwtaobaocom_user_from=https%3A%2F%2Fwww.google.com.hk%2F; ck1=; v=0; uc3=nk2=py6GFRE%3D&id2=Vv7Ko1CFjmU8&vt3=F8dHqREroU69OnX41V8%3D&lg2=VFC%2FuZ9ayeYq2g%3D%3D; existShop=MTM5NDc5NjU3MQ%3D%3D; lgc=%5Cu9006%5Cu9ECEk; tracknick=%5Cu9006%5Cu9ECEk; sg=k27; cookie2=989289e0fd92b67e2933da4e08a96f01; mt=np=&ci=0_0&cyk=0_0; cookie1=U7enNRDbLSdAyd6%2B3%2BBfgRv0d6EzjGCYMiTREauOWuQ%3D; unb=503407172; t=d7d14592cf751260158dfdb9b57ec5ee; _cc_=V32FPkk%2Fhw%3D%3D; tg=0; _l_g_=Ug%3D%3D; _nk_=%5Cu9006%5Cu9ECEk; cookie17=Vv7Ko1CFjmU8; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; uc1="lltime=1394793309&cookie14=UoLVYfW8OIdjfw%3D%3D&existShop=true&cookie16=UIHiLt3xCS3yM2h4eKHS9lpEOw%3D%3D&cookie21=WqG3DMC9Edo1SB5NB6Qtng%3D%3D&tag=1&cookie15=URm48syIIVrSKA%3D%3D"; whl=0%260%261394796654288%261394796643733';
        $signer = new Sender($cookie);
        Log::trace($signer->send("jackingchain", "hi,jack"));
        $cookies = $this->cookie2map($cookie);
        $goods = $this->cookie2map($good);
        foreach ($goods as $key => $value) {
            if (!isset($cookies[$key])) {
                Output::set($key, array('good' => $value, 'bad' =>  null));
            }
        }

    }

    public function get($id) {
        Output::set('id', $id);
    }

    private function cookie2map($cookies) {
        $map = array();
        $cookies = explode('; ', $cookies);
        foreach ($cookies as $cookie) {
            list($key, $value) = explode('=', $cookie);
            $map[$key] = $value;
        }
        return $map;
    }
} 