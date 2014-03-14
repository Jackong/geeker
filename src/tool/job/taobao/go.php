<?php
/**
 * @author: Jackong
 * Date: 14-3-4
 * Time: 下午12:42
 */

if ($argc < 2) {
    die("usage: <The url of the item list>\n");
}

require_once __DIR__ . "/env.php";

$url = $argv[1];
$url = "$url&json=on";



$crawler = new src\service\taobao\Crawler();
//jerkong
$cookie = 'cna=TW5/C+kOlR4CAbc+xAyKk0TR; w=f3169a3daa030fe5ea94a584badfaa62; uc2=wuf=http%3A%2F%2Ftwebmail.mail.163.com%2Fjs5%2Fread%2Freadhtml.jsp%3Fssid%3Da1j35CnJmDI50TFY3MH5RBCQNsd%252f0VKpSxQDsGnwunI%253d%26mid%3D61%3A1tbiPR0-vk9o966cIwABsh%26color%3D003399%26preventSetRead%3Don; l=%E9%80%86%E9%BB%8Ek::1394027138788::11; tlut=UoLVYfLGCaQRZQ%3D%3D; lzstat_uv=15301418613433182239|1201994@3058783@2966542@2798379@2043323@3045821; lzstat_ss=2678133944_0_1393972416_1201994|3905163679_1_1393973500_3058783|1413836074_0_1394054046_2966542|896271659_0_1394054046_2798379|2664719262_0_1394054046_2043323|2617496854_0_1394054047_3045821; ali_ab=183.62.196.10.1393053386723.1; _tb_token_=efe838357883b; ck1=; v=0; uc3=nk2=rqNqlbLx0t9uow%3D%3D&id2=UUjQmpirESMSQg%3D%3D&vt3=F8dHqRBkD6DXObZ3Ye4%3D&lg2=U%2BGCWk%2F75gdr5Q%3D%3D; existShop=MTM5NDAyNjU1NA%3D%3D; lgc=%5Cu63A8%5Cu5E7F%5Cu80050001; tracknick=%5Cu63A8%5Cu5E7F%5Cu80050001; sg=127; cookie2=9b5949cf90645451646ef0c32d5fd5f4; cookie1=UNRjWksRyOccF5uEEI6SAlwDAc3VSOLUkgAmYDvYAVs%3D; unb=2012108112; t=e9215b5088b7a4e48da3fb64c71ef152; _cc_=UIHiLt3xSw%3D%3D; tg=5; _l_g_=Ug%3D%3D; _nk_=%5Cu63A8%5Cu5E7F%5Cu80050001; cookie17=UUjQmpirESMSQg%3D%3D; mt=ci=0_1&cyk=0_0; x=e%3D1%26p%3D*%26s%3D0%26c%3D1%26f%3D0%26g%3D0%26t%3D0%26__ll%3D1393981498undefined%26_ato%3D0; uc1="cbu=1&lltime=1393981498&cookie14=UoLVYfLGC0JTkw%3D%3D&existShop=false&cookie16=UIHiLt3xCS3yM2h4eKHS9lpEOw%3D%3D&cookie21=VFC%2FuZ9aiKCbhSSUYnXD&tag=7&cookie15=WqG3DMC9VAQiUQ%3D%3D"; whl=0%260%261394026594130%261394026596144';
//niliK
$cookie = 'cna=TW5/C+kOlR4CAbc+xAyKk0TR; w=f3169a3daa030fe5ea94a584badfaa62; ali_ab=183.62.196.10.1393053386723.1; ck1=; l=%E9%80%86%E9%BB%8Ek::1393942727932::11; _tb_token_=efe838357883b; v=0; uc3=nk2=py6GFRE%3D&id2=Vv7Ko1CFjmU8&vt3=F8dHqRBnLPSIPpA7iyQ%3D&lg2=WqG3DMC9VAQiUQ%3D%3D; existShop=MTM5Mzk0MjEzMw%3D%3D; lgc=%5Cu9006%5Cu9ECEk; tracknick=%5Cu9006%5Cu9ECEk; sg=k27; cookie2=9b5949cf90645451646ef0c32d5fd5f4; mt=np=&ci=6_1&cyk=0_0; cookie1=U7enNRDbLSdAyd6%2B3%2BBfgRv0d6EzjGCYMiTREauOWuQ%3D; unb=503407172; t=e9215b5088b7a4e48da3fb64c71ef152; _cc_=UtASsssmfA%3D%3D; tg=0; _l_g_=Ug%3D%3D; _nk_=%5Cu9006%5Cu9ECEk; cookie17=Vv7Ko1CFjmU8; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; uc1="lltime=1393938737&cookie14=UoLVZqA22CA2uA%3D%3D&existShop=true&cookie16=VT5L2FSpNgq6fDudInPRgavC%2BQ%3D%3D&cookie21=Vq8l%2BKCLiv0MyZ1zjQnMQw%3D%3D&tag=1&cookie15=WqG3DMC9VAQiUQ%3D%3D"; whl=7%260%261393942213106%261393942198014';
$sender = new src\service\taobao\Sender($cookie);
$consumer = new src\service\taobao\consumer\Commenter($sender);
$handler = new src\service\taobao\handler\Item($consumer);

$page = 1;
do {
    $num = ($page - 1) * 96;
    $url = preg_replace("/(&s=[0-9]+&)/", "&s=$num&", $url);
    echo $url, "\n";
    $crawler->crawl($url, $handler);
    ++$page;
} while(false);//$handler->next());
