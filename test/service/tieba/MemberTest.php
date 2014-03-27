<?php
/**
 * @author: Jackong
 * Date: 14-3-27
 * Time: 上午11:56
 */

namespace test\service\tieba;


class MemberTest extends \PHPUnit_Framework_TestCase {

    public function testPattern()
    {
        $data = <<<EOF

<!DOCTYPE html><!--STATUS OK--><html><head><meta charset="gbk"><meta furl="tieba.baidu.com/f?kw=%CE%E4%BB%EA" fname="武魂"><title>本吧会员_武魂吧</title><script>void function(k,l,e,n,i,m,a){k.alogObjectName=i,k[i]=k[i]||function(){(k[i].q=k[i].q||[]).push(arguments)},k[i].l=k[i].l||+new Date,m=l.createElement(e),m.asyn=1,m.src=n,a=l.getElementsByTagName(e)[0],a.parentNode.insertBefore(m,a)}(window,document,"script","http://img.baidu.com/hunter/alog/alog.min.js","alog");(function(){window.PDC={mark:function(d,c){alog("speed.set",d,c||+new Date);alog.fire&&alog.fire("mark")},init:function(b){alog("speed.set","options",b)},view_start:function(){return},tti:function(){return},page_ready:function(){return}}})();void function(d,c){var f,b="Other";(f=/\b(safari|firefox|chrome|opera)\b.*?(\d+)/i.exec(c))&&(b=f[1]),(f=/MSIE ([0-9]*)/.exec(c))&&(b="IE"+f[1]),!/^IE/.test(b)&&(f=/trident\/.* rv:([\w]+)?/i.exec(c))&&(b="IE"+f[1]),/(M?QQBrowser)\/([0-9.]*)/.test(c)&&(b="QQ Browser"),/SE 2.X MetaSr/.test(c)&&(b="Sogou Explorer");var a=!1;d.onerror=function(i,h,j,k){var g=!0;return !h&&/^script error/i.test(i)&&(a?g=!1:a=!0),g&&alog("exception.send","exception",{msg:i,js:h,ln:j,col:k,browser:b}),!1}}(window,navigator.userAgent);</script><link rel="apple-touch-icon" href="http://tb2.bdstatic.com/tb/wap/img/touch.png" /><!--[if lt IE 9]><script>(function(){    var tags = ['header','footer','figure','figcaption','details','summary','hgroup','nav','aside','article','section','mark','abbr','meter','output','progress','time','video','audio','canvas','dialog'];    for(var i=tags.length - 1;i>-1;i--){ document.createElement(tags[i]);}})();</script><![endif]--><style>header,footer,section,article,aside,nav,figure{display:block;margin:0;padding:0;border:0;}</style><link rel="shortcut icon" href="http://static.tieba.baidu.com/tb/favicon.ico" />
<link rel="stylesheet" href="http://tb1.bdstatic.com/??tb/static-common/style/tb_ui_ed7c03ee.css,tb/static-common/style/tb_common_d5b9a34.css" />
<link rel="stylesheet" href="http://tb1.bdstatic.com/??tb/static-bawu/layout/single_column/single_column_b0d1fa53.css,/tb/_/scroll_panel_0f0d82f4.css,/tb/_/head_skin_5f082ae.css,/tb/_/medal_b86a5b0.css,/tb/_/forum_card_1a74030.css,tb/static-bawu/widget/nav/nav_1e3ae0cd.css,tb/static-bawu/widget/member/member_2d898517.css,/tb/_/pagination_6e3428e0.css,tb/static-bawu/widget/aside_float_btns/aside_float_btns_4820639e.css,/tb/_/padstyle_f62f0e6.css,/tb/_/top_banner_552e0dd.css,/tb/_/mobile_tip_6de08d3.css,/tb/_/poptip_f81e5f1.css,/tb/_/search_dialog_911a0201.css,/tb/_/search_bright_918d1a5c.css,/tb/_/userbar_bright_style_66a0b91.css,/tb/_/suggestion_bright_style_67b6051.css,tb/static-bawu/template/head/head_ed71fd41.css,tb/static-bawu/template/listMember/listMember_deaab06d.css" />
<script>var PageData = {'tbs'  : "",'product' : "forum-info",'page' : "listMemberInfo", 'user' : {"is_login":true,"id":851277962,"name":"JackongChange","portrait":"8a784a61636b6f6e674368616e6765bd32","email":"jac***@gmail.com","mobilephone":"158*****412","no_un":0,"name_show":"JackongChange","identity":0,"itieba_id":417414682,"like_forums":[],"user_forum_list":{"info":[]},"tbs":"ec0494f8cc49e63e1395891580"}};PageData.user.name_url = "JackongChange";var Env = {};Env.server_time = 1395891580000;var Tbs = {"common":""};PageData.search_what = "";function resizePic_temp(o,Mw,Mh,need_margin,callback){var _Mw=Mw || 120;var _Mh=Mh || 120;var need_resize = false; var _image = new Image();_image.src = o.src;function getRightWH(Rw, Rh, Mw, Mh){var index=0, _Rw=Rw, _Rh=Rh;if(Rw>Mw) index+=1;if(Rh>Mh) index+=2;switch(index){case 1:_Rw = Mw;_Rh = Rh * Mw / Rw;case 2:_Rh = Mh;_Rw = Rw * Mh / Rh;case 3:_Rh = (Rh / Mh > Rw / Mw) ? Mh : Rh * Mw / Rw;_Rw = (Rh / Mh > Rw / Mw) ? Rw * Mh / Rh : Mw}if(index != 0){need_resize = true;}return [_Rw, _Rh]}var wh = getRightWH(_image.width, _image.height, _Mw,_Mh);o.style.width = wh[0] + 'px';o.style.height = wh[1]+'px';if(typeof callback=='function'){callback.apply(this, arguments);}o.style.visibility = 'visible';if(need_margin == true){o.style.marginTop = (Mh - parseInt(wh[1])) / 2 + 'px';}_image = null;return need_resize}function cutPic(o, l, need_margin){var image = new Image();image.src = o.src;var w = image.width;var h = image.height;if(w >= h && h >= l){w = w / h * l;h = l;var left = Math.round((w - h)/2);var right = Math.round(w - h - left);o.style.marginLeft = (-1*left)+'px';o.style.marginRight = (-1*right)+'px';}else if(h > w && w >= l){h = h / w * l;w = l;}if(h< l && need_margin){o.style.marginTop = (l - h) / 2 + 'px';}o.style.width = w + 'px';o.style.height = h + 'px';o.style.visibility = 'visible';}</script></head><script> alog('speed.set', 'ht',new Date);</script><body><div id="local_flash_cnt"></div><div class="wrap1"><div class="wrap2"><div id="head" class=" search_bright clearfix" style="">
		<div class="search_top clearfix" >
				<a title="到贴吧首页" href="/" class="search_logo"  style=""></a>
				<div class="search_nav j_search_nav" style="">
			<a param="word" href="http://news.baidu.com/ns?cl=2&amp;rn=20&amp;tn=news&amp;">新闻</a>
			<a param="wd" href="http://www.baidu.com/s?cl=3&amp;">网页</a>
			<b>贴吧</b>
			<a param="word" href="http://zhidao.baidu.com/q?ct=17&amp;pn=0&amp;tn=ikaslist&amp;rn=10&amp;">知道</a>
			<a param="key" href="http://music.baidu.com/search?fr=tieba&">音乐</a>
			<a param="word" href="http://image.baidu.com/i?tn=baiduimage&amp;ct=201326592&amp;lm=-1&amp;cl=2&amp;">图片</a>
			<a param="word" href="http://v.baidu.com/v?ct=301989888&amp;rn=20&amp;pn=0&amp;db=0&amp;s=21&amp;">视频</a>
			<a param="word" href="http://map.baidu.com/m?fr=map006&amp;">地图</a>
			<a href="http://baike.baidu.com/" param="searchword/?pic=1&fr=tieba&word" >百科</a>
			<a href="http://wenku.baidu.com/search?fr=tieba&lm=0&od=0&" param="word" target="_blank">文库</a>
		</div>
	</div>
	<div class="search_main_wrap">
		<div class="search_main clearfix">
			<div class="search_form">
				<a id="search_logo_small" class="" title="到贴吧首页" href="/"></a>
								<form name="f1" class="clearfix j_search_form" action="/f" id="tb_header_search_form">					<input class="search_ipt search_inp_border j_search_input tb_header_search_input" name="kw1" value="" type="text" autocomplete="off" size="42" tabindex="1" id="wd1" maxlength="100" x-webkit-grammar="builtin:search" x-webkit-speech="true"/>
					<input autocomplete="off" type="hidden" name="kw" value="" id="wd2" />
					<span class="search_btn_wrap search_btn_enter_ba_wrap">
                        <a class="search_btn search_btn_enter_ba j_enter_ba" href="#" onclick="return false;" onmousedown="this.className+=' search_btn_down'" onmouseout="this.className=this.className.replace('search_btn_down','')">进入贴吧</a>
                    </span>
                    <span class="search_btn_wrap">
                        <a class="search_btn j_search_post" href="#" onclick="return false;" onmousedown="this.className+=' search_btn_down'" onmouseout="this.className=this.className.replace('search_btn_down','')">全吧搜索</a>
                    </span>
					<a class="senior-search-link" href="http://tieba.baidu.com/f/search/adv">高级搜索</a>
									</form>
								<p style="display:none;" class="switch_radios">					<input type="radio" class="nowtb" name="tb" id="nowtb"><label for="nowtb">吧内搜索</label>
					<input type="radio" class="searchtb" name="tb" id="searchtb"><label for="searchtb">搜贴</label>
					<input type="radio" class="authortb" name="tb" id="authortb"><label for="authortb">搜人</label>
					<input type="radio" class="jointb" checked="checked" name="tb" id="jointb"><label for="jointb">进吧</label>
					<input type="radio" class="searchtag" name="tb" id="searchtag" style="display:none;"><label for="searchtag" style="display:none;">搜标签</label>
				</p>

			</div>
		</div>
	</div>
	    </div>

<script>
PageData = PageData || {};
PageData.forum = {"is_key_op":true,"mgr_num":2,"forum_name":"\u6b66\u9b42","forum_id":9642,"member_num":53485,"post_num":2979355,"first_class":"\u6e38\u620f","second_class":"\u5ba2\u6237\u7aef\u7f51\u6e38","name":"\u6b66\u9b42"};
PageData.user.balv = {"is_firstlike":0,"has_liked":0,"level_id":1,"cur_score":0,"score_left":5,"levelup_score":5,"level_name":null};
PageData.forum.name_url = "%CE%E4%BB%EA";
PageData.forum.id = "9642";
PageData.user.name_url = "JackongChange";
PageData.tbs = 'ec0494f8cc49e63e1395891580';
PageData.staticDomain = "http://static.tieba.baidu.com/";
</script>
<div id="container" class="container_wrap clearfix forum_info_wrap">
<div class="card_top clearfix " ><a class="head_skin_btn"></a><div class="card_title ">        <a class="card_title_fname" title="" href="/f?kw=%CE%E4%BB%EA">            武魂吧</a>                            <a href="#" onclick="return false" class="focus_btn islike_focus" id="j_head_focus_btn" style="margin-top:2px;"></a>                <span class="card_num "><span class="card_numLabel">关注：</span><span class="card_menNum" >53,485</span><span class="card_numLabel">贴子：</span><span class="card_infoNum" >2,979,355</span></span>        </div>        <p class="card_slogan">武魂吧希望各位武魂玩家能在这交流游戏心得</p>    <div class="card_head"><a href="/f?kw=%CE%E4%BB%EA"><img class="card_head_img" src="http://m.tiebaimg.com/timg?wapp&amp;quality=80&amp;size=b150_150&amp;subsize=20480&amp;cut_x=0&amp;cut_w=0&amp;cut_y=0&amp;cut_h=0&amp;sec=1369815402&amp;srctrace&amp;di=f1dc510381ad5c834b4d5e3426259564&amp;wh_rate=null&amp;src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb21bb051f8198618140733214bed2e738ad4e6d7.jpg" /></a></div><div class="card_info"><ul class="forum_dir_info bottom_list clearfix"><li>                </li><li><span class="dir_text">目录：</span></li><li>                <a target="_blank" href="/f/fdir?fd=游戏&sd=客户端网游">客户端网游</a>                </li></ul></div></div><div id="forumInfo_nav_wrap" class="forumInfo_nav_wrap">
<ul class="forumInfo_nav_list">
<li>
<div class="tbnav_tab_inner">
<p class="space">
<a class="nav_detailsInfo" href="/bawu2/platform/detailsInfo?word=%CE%E4%BB%EA">本吧详情</a>
</p>
</div>
</li>
<li>
<div class="tbnav_tab_inner">
<p class="space">
<a class="nav_listBawuTeamInfo" href="/bawu2/platform/listBawuTeamInfo?word=%CE%E4%BB%EA">吧务团队</a>
</p>
</div>
</li>
<li>
<div class="tbnav_tab_inner">
<p class="space">
<a class="nav_listCandidateInfo" href="/bawu2/platform/listCandidateInfo?word=%CE%E4%BB%EA">吧务候选</a>
</p>
</div>
</li>
<li class="focus">
<div class="tbnav_tab_inner">
<p>
<a class="nav_listMemberInfo" href="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA">本吧会员</a>
</p>
</div>
</li>
</ul>
<div class="search_internal_wrap j_search_internal">
<form class="j_search_internal_form">
<input class="search_internal_input j_search_internal_input" value="" type="text"/>
<div class="search_internal_placeholder j_search_internal_placeholder">吧内搜索</div>
<input class="search_internal_btn" type="submit" />
</form>
</div>
</div>
<div class="forum_info_section member_wrap clearfix">
<h1 class="forum_info_title clearfix">
<span class="cut_line"></span>
<span class="text">
混蛋er（53485人）
</span>
</h1>
<span class="member first_row">
<a href="/home/main?un=%D7%ED%B0%AE_%B6%AF%C2%FE%C3%D4" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/6520d7edb0ae5fb6afc2fec3d43914" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%D7%ED%B0%AE_%B6%AF%C2%FE%C3%D4" class="user_name" title="醉爱_动漫迷">醉爱_动漫迷</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=lolita%D0%A1%C3%C8%C4%EF" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/c46a6c6f6c697461d0a1c3c8c4ef892c" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=lolita%D0%A1%C3%C8%C4%EF" class="user_name" title="lolita小萌娘">lolita小萌娘</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=%BB%FA%D6%C7%B5%C4%CD%F5%D0%A1%B6%FE" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/ae3cbbfad6c7b5c4cdf5d0a1b6fef63e" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%BB%FA%D6%C7%B5%C4%CD%F5%D0%A1%B6%FE" class="user_name" title="机智的王小二">机智的王小二</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=zhangjiehwt126" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/61d37a68616e676a69656877743132366906" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=zhangjiehwt126" class="user_name" title="zhangjiehwt126">zhangjiehwt126</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=shenjie198948" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/ea9f7368656e6a6965313938393438b035" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=shenjie198948" class="user_name" title="shenjie198948">shenjie198948</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=%CA%A8%D7%D3%BB%A8%C2%E4%D6%D5%CA%C7%C9%CB" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/e5f5caa8d7d3bba8c2e4d6d5cac7c9cb323f" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%CA%A8%D7%D3%BB%A8%C2%E4%D6%D5%CA%C7%C9%CB" class="user_name" title="狮子花落终是伤">狮子花落终是伤</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=qqmakk123" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/2c8e71716d616b6b313233e603" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=qqmakk123" class="user_name" title="qqmakk123">qqmakk123</a><span class="forum_level lv4"></span>
</div>
</span>
<span class="member first_row">
<a href="/home/main?un=%CA%A8%D7%D3%C0%CF%B8%DF" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/863dcaa8d7d3c0cfb8df4c2b" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%CA%A8%D7%D3%C0%CF%B8%DF" class="user_name" title="狮子老高">狮子老高</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=aa449651268" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/9a6a61613434393635313236382c39" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=aa449651268" class="user_name" title="aa449651268">aa449651268</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%DF%B1%C9%F1%D7%E5%EC%E1%C4%BE" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/0db9dfb1c9f1d7e5ece1c4bed630" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%DF%B1%C9%F1%D7%E5%EC%E1%C4%BE" class="user_name" title="弑神族灬木">弑神族灬木</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=Wander_%D4%B5" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/e4cd57616e6465725fd4b5ea1c" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=Wander_%D4%B5" class="user_name" title="Wander_缘">Wander_缘</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%B6%A1%B5%C2%CF%E9310" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/a0deb6a1b5c2cfe9333130b322" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%B6%A1%B5%C2%CF%E9310" class="user_name" title="丁德祥310">丁德祥310</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%E8%AA%C4%EA%D8%BCAbout" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/f7b1e8aac4ead8bc41626f7574ce33" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%E8%AA%C4%EA%D8%BCAbout" class="user_name" title="瑾年丶About">瑾年丶About</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%CE%C2%C8%E1%B5%C4%B1%B3%BA%F3%D8%BCDd" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/c88ccec2c8e1b5c4b1b3baf3d8bc44648f2f" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%CE%C2%C8%E1%B5%C4%B1%B3%BA%F3%D8%BCDd" class="user_name" title="温柔的背后丶Dd">温柔的背后丶Dd</a><span class="forum_level lv3"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%C1%F4%CF%C2%C4%E3%B5%C4%D2%F5%C4%B1%A1%AD" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/6163c1f4cfc2c4e3b5c4d2f5c4b1a1adc517" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%C1%F4%CF%C2%C4%E3%B5%C4%D2%F5%C4%B1%A1%AD" class="user_name" title="留下你的阴谋…">留下你的阴谋…</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%D0%A1%B0%B22U" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/d298d0a1b0b232554316" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%D0%A1%B0%B22U" class="user_name" title="小安2U">小安2U</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%CB%B9%CE%C4%C7%DD%CA%DE%CA%DE%CA%DE%CA%DE" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/8b39cbb9cec4c7ddcadecadecadecadee427" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%CB%B9%CE%C4%C7%DD%CA%DE%CA%DE%CA%DE%CA%DE" class="user_name" title="斯文禽兽兽兽兽">斯文禽兽兽兽兽</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=ln%B6%AB%D7%D3" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/e6086c6eb6abd7d38b3b" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=ln%B6%AB%D7%D3" class="user_name" title="ln东子">ln东子</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=tom%B3%D4%C1%CBjerry" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/df26746f6db3d4c1cb6a657272799b2b" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=tom%B3%D4%C1%CBjerry" class="user_name" title="tom吃了jerry">tom吃了jerry</a><span class="forum_level lv2"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%BB%FD%C4%BE%BF%B5" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/76bcbbfdc4bebfb58c43" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%BB%FD%C4%BE%BF%B5" class="user_name" title="积木康">积木康</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%BC%D3q719054795" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/bf6dbcd371373139303534373935612b" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%BC%D3q719054795" class="user_name" title="加q719054795">加q719054795</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%D2%E0%BE%C3%D2%E0%BE%C9%BA%C3" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/3f2bd2e0bec3d2e0bec9bac38843" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%D2%E0%BE%C3%D2%E0%BE%C9%BA%C3" class="user_name" title="亦久亦旧好">亦久亦旧好</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=%BE%FD%BC%D2%D0%A1%C7%B3" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/c247befdbcd2d0a1c7b38843" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=%BE%FD%BC%D2%D0%A1%C7%B3" class="user_name" title="君家小浅">君家小浅</a><span class="forum_level lv1"></span>
</div>
</span>
<span class="member ">
<a href="/home/main?un=Defoliationo" class="avatar"><img src="http://tb.himg.baidu.com/sys/portrait/item/989e4465666f6c696174696f6e6f623b" alt="头像"></a>
<div class="name_wrap">
<a href="/home/main?un=Defoliationo" class="user_name" title="Defoliationo">Defoliationo</a><span class="forum_level lv2"></span>
</div>
</span>
</div>
<div class="tbui_pagination tbui_pagination_left">共2229页<ul><li class="active"><span>1</span></li><li><a href="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA&pn=2">2</a></li><li><a href="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA&pn=3">3</a></li><li><a href="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA&pn=4">4</a></li><li><a href="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA&pn=5">5</a></li><li><a href="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA&pn=2">&gt;</a></li></ul><input class="pagination_input" type="text" name="pn" /><a data-url="/bawu2/platform/listMemberInfo?word=%CE%E4%BB%EA" href="#" class="ui_btn ui_btn_s" onclick="var \$btn = $(this); $.tb.location.setHref(\$btn.data('url') + '&pn=' + \$btn.prev().val()); return false;"><span><em>跳转</em></span></a></div></div>

<div id="footer" class="footer">                                                                                                      <span>&copy;2014 Baidu</span><a pv_code="0" href="/tb/eula.html" target="_blank">贴吧协议</a><span>|</span><a pv_code="0" href="http://tieba.baidu.com/tb/system.html" target="_blank">吧主制度</a><span>|</span><a class="ueg_feedback-link" data-site="feedbackLink"  pv_code="0" href="http://tieba.baidu.com/f?ie=utf-8&kw=%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88%E5%90%A7" target="_blank">意见反馈</a><span>|</span><a pv_code="0" href="/tb/zt/declare/" target="_blank">网络谣言警示</a></div> </div></div><script>PageUnitData={"search_input_tip":"\u8f93\u5165\u4f60\u611f\u5174\u8da3\u7684\u4e1c\u4e1c"};</script>
<script>var _JSSTAMP = {"common\/component\/upload\/upload.js":"\/tb\/_\/upload_35ec123.js","common\/component\/word_limit\/word_limit.js":"\/tb\/_\/word_limit_d162df6b.js","common\/widget\/image_uploader_manager\/image_uploader_manager.js":"\/tb\/_\/image_uploader_manager_250070ee.js","common\/component\/image_flash_editor\/image_flash_editor.js":"\/tb\/_\/image_flash_editor_14f61c21.js","bawu\/component\/thread\/thread.js":"thread_1f100987.js","bawu\/component\/picture_rotation\/picture_rotation.js":"picture_rotation_6f570c72.js","common\/widget\/search_handler\/search_handler.js":"\/tb\/_\/search_handler_1651a2c9.js","common\/widget\/search_dialog\/search_dialog.js":"\/tb\/_\/search_dialog_ac2ad5e1.js","common\/component\/search_handler\/search_handler.js":"\/tb\/_\/search_handler_22a660d1.js","common\/component\/interest_smiley\/interest_smiley.js":"\/tb\/_\/interest_smiley_5c196d01.js","common\/widget\/card\/card.js":"\/tb\/_\/card_859bf9d6.js","common\/widget\/audio_player\/audio_player.js":"\/tb\/_\/audio_player_a54e0896.js","common\/component\/card\/card.js":"\/tb\/_\/card_e323f2c6.js","common\/component\/js_pager\/js_pager.js":"\/tb\/_\/js_pager_805c9cdd.js","common\/component\/image_uploader\/image_uploader.js":"\/tb\/_\/image_uploader_be874e80.js","common\/widget\/image_uploader_manager\/uploader_flash.js":"\/tb\/_\/uploader_flash_406d878a.js","common\/widget\/image_uploader_manager\/uploader_html5.js":"\/tb\/_\/uploader_html5_478559d5.js","common\/component\/image_clipper\/image_clipper.js":"\/tb\/_\/image_clipper_b0c498f9.js","common\/component\/image_uploader_manager\/image_uploader_manager.js":"\/tb\/_\/image_uploader_manager_5fcd5ee7.js","common\/component\/image_uploader_manager\/uploader_flash.js":"\/tb\/_\/uploader_flash_93104665.js","common\/component\/image_uploader_manager\/uploader_html5.js":"\/tb\/_\/uploader_html5_57853579.js","common\/component\/image_exif\/image_exif.js":"\/tb\/_\/image_exif_0bd01ba7.js","common\/component\/captcha\/captcha.js":"\/tb\/_\/captcha_4372dcbb.js","common\/component\/image_water\/image_water.js":"\/tb\/_\/image_water_cc5f4cbe.js","common\/component\/image_water\/water_flash.js":"\/tb\/_\/water_flash_36762161.js","common\/component\/image_water\/water_html5.js":"\/tb\/_\/water_html5_c64e7810.js","common\/component\/suggestion\/action.js":"\/tb\/_\/action_070989c5.js","common\/component\/image_htmlx_editor\/filter_loader.js":"\/tb\/_\/filter_loader_dbc39c2d.js","common\/component\/image_htmlx_editor\/filter_worker.js":"\/tb\/_\/filter_worker_5008496c.js","common\/component\/image_htmlx_editor\/image_htmlx_editor.js":"\/tb\/_\/image_htmlx_editor_e85cdabe.js","common\/component\/image_htmlx_editor\/clip_resize.js":"\/tb\/_\/clip_resize_553528aa.js","common\/component\/sketchpad\/sketchpad_core.js":"\/tb\/_\/sketchpad_core_a150a062.js","common\/component\/sketchpad\/sketchpad.js":"\/tb\/_\/sketchpad_1526d88a.js","common\/component\/captcha_meizhi\/captcha_meizhi.js":"\/tb\/_\/captcha_meizhi_ec604d2f.js","common\/component\/captcha_dialog\/captcha_dialog.js":"\/tb\/_\/captcha_dialog_ee06131b.js","common\/component\/postor_service\/postor_service.js":"\/tb\/_\/postor_service_2ac2f356.js","common\/component\/scroll_panel\/scroll_panel.js":"\/tb\/_\/scroll_panel_6bcc3d38.js","common\/component\/suggestion\/suggestion.js":"\/tb\/_\/suggestion_b25ba839.js","common\/component\/toolbar\/toolbar.js":"\/tb\/_\/toolbar_cf7e441d.js","common\/component\/sketchpad_dialog\/sketchpad_dialog.js":"\/tb\/_\/sketchpad_dialog_ce8863e7.js","common\/component\/tabs\/tabs.js":"\/tb\/_\/tabs_b4690774.js","common\/widget\/aside_float_bar\/aside_float_bar.js":"\/tb\/_\/aside_float_bar_3098d186.js","common\/component\/editor_pic\/editor_pic.js":"\/tb\/_\/editor_pic_0396eada.js","common\/component\/editor_video\/editor_video.js":"\/tb\/_\/editor_video_68c7e0c3.js","common\/component\/editor_smiley\/editor_smiley.js":"\/tb\/_\/editor_smiley_c853b1f0.js","common\/component\/editor_music\/editor_music.js":"\/tb\/_\/editor_music_7eb733e8.js","common\/component\/editor_sketchpad\/editor_sketchpad.js":"\/tb\/_\/editor_sketchpad_644df4ca.js","common\/component\/area_select\/area_select.js":"\/tb\/_\/area_select_a08b59c6.js","common\/component\/follower\/follower.js":"\/tb\/_\/follower_ac4aad60.js","common\/widget\/image_viewer\/data_interface.js":"\/tb\/_\/data_interface_b1346d18.js","common\/widget\/image_viewer\/image_nav_item.js":"\/tb\/_\/image_nav_item_019a359f.js","common\/widget\/image_viewer\/image_pager.js":"\/tb\/_\/image_pager_eaa41cde.js","common\/widget\/image_viewer\/scroll_pannel.js":"\/tb\/_\/scroll_pannel_c78a84e9.js","common\/widget\/image_viewer\/image_postor.js":"\/tb\/_\/image_postor_1cf5efe4.js","common\/widget\/block_user\/block_user.js":"\/tb\/_\/block_user_aeb7514.js","common\/widget\/image_viewer\/hint.js":"\/tb\/_\/hint_917a1d21.js","common\/widget\/image_viewer\/image_original.js":"\/tb\/_\/image_original_06acefe3.js","common\/widget\/image_viewer\/image_nav.js":"\/tb\/_\/image_nav_f766196f.js","common\/widget\/image_viewer\/image_comments.js":"\/tb\/_\/image_comments_6ed9cfd7.js","common\/widget\/image_viewer\/dropdown_list.js":"\/tb\/_\/dropdown_list_07d708ec.js","common\/widget\/image_viewer\/tb_fav.js":"\/tb\/_\/tb_fav_c1deb00a.js","common\/widget\/image_viewer\/games.js":"\/tb\/_\/games_30cff05b.js","common\/widget\/image_viewer\/image_thumbnail.js":"\/tb\/_\/image_thumbnail_39ee4326.js","common\/widget\/image_viewer\/image_preloader.js":"\/tb\/_\/image_preloader_18cebce5.js","common\/widget\/image_viewer\/full_screen_manager.js":"\/tb\/_\/full_screen_manager_6d4b339c.js","common\/component\/htmlx_img_filter\/loader.js":"\/tb\/_\/loader_8b5ca927.js","common\/component\/htmlx_img_filter\/worker.js":"\/tb\/_\/worker_8fb4596b.js","common\/component\/htmlx_img_clip\/resize.js":"\/tb\/_\/resize_c6722538.js","common\/component\/image_previewer\/image_previewer.js":"\/tb\/_\/image_previewer_ee8440f3.js","common\/component\/image_editor\/image_editor.js":"\/tb\/_\/image_editor_76d26aae.js","common\/component\/image_previewer_list\/image_previewer_list.js":"\/tb\/_\/image_previewer_list_31ec5fe7.js","common\/component\/image_previewer_rotate\/image_previewer_rotate.js":"\/tb\/_\/image_previewer_rotate_a35ffbb3.js","common\/component\/image_uploader_queue\/image_uploader_queue.js":"\/tb\/_\/image_uploader_queue_71ca8cfb.js","common\/component\/image_editor\/image_cliper.js":"\/tb\/_\/image_cliper_1955b83f.js","common\/component\/image_editor\/image_transformer.js":"\/tb\/_\/image_transformer_a610529a.js","common\/component\/image_progress_bar\/image_progress_bar.js":"\/tb\/_\/image_progress_bar_e53fd1a1.js","common\/component\/editor_music\/editor_music_helper.js":"\/tb\/_\/editor_music_helper_80b0c284.js","common\/component\/editor_video\/editor_urlvideo.js":"\/tb\/_\/editor_urlvideo_a081888b.js","common\/component\/editor_video\/editor_localvideo.js":"\/tb\/_\/editor_localvideo_63a41cd4.js","common\/component\/editor_pic\/editorpic_upload.js":"\/tb\/_\/editorpic_upload_adebccf4.js","common\/widget\/editor_pic_meizhi\/editor_pic_meizhi_upload.js":"\/tb\/_\/editor_pic_meizhi_upload_05e89aa6.js","common\/widget\/scroll_panel\/scroll_panel.js":"\/tb\/_\/scroll_panel_f4c2767e.js","common\/component\/post_service\/post_result_handler_manager.js":"\/tb\/_\/post_result_handler_manager_4e02c7e2.js","common\/widget\/post_service\/post_result_handler_manager.js":"\/tb\/_\/post_result_handler_manager_078b6d44.js","common\/widget\/post_service\/post_service.js":"\/tb\/_\/post_service_a74f116c.js","common\/widget\/word_limit\/word_limit.js":"\/tb\/_\/word_limit_6aedac09.js","common\/widget\/post_prefix\/post_prefix.js":"\/tb\/_\/post_prefix_37995ad3.js","common\/widget\/post_signature\/post_signature.js":"\/tb\/_\/post_signature_9d073754.js","common\/widget\/mouse_pwd\/mouse_pwd.js":"\/tb\/_\/mouse_pwd_ac483688.js","common\/component\/attachment_uploader\/attachment_item_ui.js":"\/tb\/_\/attachment_item_ui_e11fe281.js","common\/component\/attachment_uploader\/attachment_uploader_ui.js":"\/tb\/_\/attachment_uploader_ui_1137f81e.js","common\/component\/slide_select\/slide_select.js":"\/tb\/_\/slide_select_d2e90f23.js","common\/component\/post_props\/post_props.js":"\/tb\/_\/post_props_2e6d1056.js","common\/component\/attachment_uploader\/attachment_uploader.js":"\/tb\/_\/attachment_uploader_1b2101ea.js","common\/component\/picture_album_selector\/picture_album_selector.js":"\/tb\/_\/picture_album_selector_f58e7669.js","common\/component\/picture_selector\/picture_selector.js":"\/tb\/_\/picture_selector_42a0bd24.js","common\/component\/picture_uploader\/picture_uploader.js":"\/tb\/_\/picture_uploader_65d7e023.js","common\/component\/picture_web_selector\/picture_web_selector.js":"\/tb\/_\/picture_web_selector_3656e998.js","common\/component\/scrawl\/scrawl.js":"\/tb\/_\/scrawl_b1e71d96.js","common\/component\/ueditor_emotion\/ueditor_emotion.js":"\/tb\/_\/ueditor_emotion_5bb43902.js","common\/component\/ueditor_music\/ueditor_music.js":"\/tb\/_\/ueditor_music_fd645e54.js","common\/component\/ueditor_video\/ueditor_video.js":"\/tb\/_\/ueditor_video_30556272.js","common\/component\/colorful\/colorful.js":"\/tb\/_\/colorful_c701de9f.js","common\/component\/custom_emotion\/custom_emotion.js":"\/tb\/_\/custom_emotion_12254806.js","common\/component\/post_bubble\/post_bubble.js":"\/tb\/_\/post_bubble_1a5b2176.js","common\/component\/post_service\/post_service.js":"\/tb\/_\/post_service_5a806d51.js","common\/component\/placeholder\/placeholder.js":"\/tb\/_\/placeholder_a49c3c6f.js","common\/component\/ueditor_music\/ueditor_music_search.js":"\/tb\/_\/ueditor_music_search_9d781790.js","common\/component\/ueditor_music\/ueditor_music_helper.js":"\/tb\/_\/ueditor_music_helper_d9f35de9.js","common\/component\/ueditor_video\/ueditor_urlvideo.js":"\/tb\/_\/ueditor_urlvideo_948991ea.js","common\/component\/ueditor_video\/ueditor_localvideo.js":"\/tb\/_\/ueditor_localvideo_c8f2d48b.js"};</script><script src="http://tb1.bdstatic.com/??tb/static-common/lib/tb_lib_391dd68.js,tb/static-common/ui/common_logic_v2_f11c6807.js,/tb/_/ban_ef811b28.js"></script>
<script src="http://tb1.bdstatic.com/tb/static-common/js/tb_ui_f12bd081.js"></script>
<script src="http://tb1.bdstatic.com/??/tb/_/scroll_panel_f4c2767e.js,/tb/_/captcha_dialog_ee06131b.js,/tb/_/captcha_payment_b7320d8.js,/tb/_/head_skin_f56640d.js,/tb/_/medal_bed507a.js,/tb/_/forum_card_9912060.js,/tb/_/browser_statistics_63937e3.js,/tb/_/top_banner_1b235d8.js,/tb/_/footer_90a426c.js,/tb/_/mobile_tip_01f550d.js,/tb/_/poptip_e705974.js,/tb/_/search_handler_1651a2c9.js,/tb/_/search_dialog_ac2ad5e1.js,/tb/_/search_bright_3d20860b.js"></script>
<script>window.modDiscardTemplate={};</script>
<script>
_.Module.use('common/widget/search_bright',[$('#head'),{style:'bright',theme:'2', forumName:'', searchFixed:''}]);
</script>
<script>_.Module.use('frs/widget/forum_card');    _.Module.use('frs/widget/forum_card/focus_btn',[{"islike":"0"}]);_.Module.use('frs/widget/headSkin',[{"forum_id":"9642","forum_name":"","skin_used_id":"","skin_end_time":"","user_scores":""}]);</script><script>
_.Module.use('common/widget/tbnav_bright', [$('#forumInfo_nav_wrap'),{jq_search:$('#forumInfo_nav_wrap').find('.j_search_internal'),forumName:'武魂'}]);
</script>
<script>
_.Module.use("common/widget/AsideFloatBar",[{
buttons: [
"top"
]
}]);
</script>
<script>if (typeof(PageData) !== "undefined" && typeof(PageData.user) !== "undefined") {  TbCom.defaultLogicInit(PageData.user, PageData.product || "");}</script><script>_.Module.use('common/widget/footer',null, function(){});</script><script type="text/javascript">_.Module.use('common/widget/MobileTip',[]);</script><script type="text/javascript">alog && alog("speed.set", "drt",+new Date);</script><script>void function(g,a){function i(m,n,l){l=l||15;var o=new Date();o.setTime(new Date().getTime()+l*1000);a.cookie=m+"="+escape(n)+";path=/;expires="+o.toGMTString()}function h(m){var l=a.cookie.match(new RegExp("(^| )"+m+"=([^;]*)(;|$)"));if(l!=null){return unescape(l[2])}return null}function c(l){if(g.attachEvent){g.attachEvent("onload",l,false)}else{if(g.addEventListener){g.addEventListener("load",l)}}}function e(){var m=alog.tracker&&alog.tracker("speed").get("options")||{};var q=m.random=Math.random();alog("set","alias",{speed:m.js_path||"http://static.tieba.baidu.com/tb/pms/wpo_alog_speed.js"});var p=m.special_pages||[];var l=[];for(var n=0;n<p.length;n++){var o=p[n];if(q<o.sample){l.push(o.id)}}if(l.length){alog("speed.set","special_id","["+l+"]")}if(q<=m.sample||l.length){alog("speed.set","send",true);if(m.product_id&&m.page_id){alog("require","speed")}}}function b(){var l=h("PMS_JT");if(l){i("PMS_JT","",-1);try{l=eval(l);}catch(e){l={};}if(!l.r||a.referrer.replace(/#.*/,"")==l.r){alog("speed.set","wt",l.s)}}}b();var f=false;function d(){alog.on&&alog.on("mark",function(p){var n=alog.tracker&&alog.tracker("speed").get("options")||{};f=true;if(n&&n.custom_metrics&&n.custom_metrics.constructor==Array){var m=n.custom_metrics;var l=alog.tracker("speed").fields;for(var o=0;o<m.length;o++){if(!l||!l.hasOwnProperty(m[o])){f=false;break}}}f&&e()})}c(function(){d();alog("speed.set","lt",+new Date);alog.fire&&alog.fire("mark")});function k(n,m){var l=0;if((m.nodeName||m.tagName).toLowerCase()===n.toLowerCase()){return m}while(m=m.parentNode){l++;if((m.nodeName||m.tagName).toLowerCase()===n.toLowerCase()){return m}if(l>=4){return null}}return null}function j(l){if(a.attachEvent){a.attachEvent("onclick",l)}else{a.addEventListener("click",l,false)}}j(function(n){var n=n||window.event;var m=n.target||n.srcElement;var o=k("a",m);if(o){var l=o.getAttribute("href");if(!/^#|javascript:/.test(l)){i("PMS_JT",'({"s":'+(+new Date)+',"r":"'+document.URL.replace(/#.*/,"")+'"})')}}})}(window,document);</script></body></html>
EOF;

        if (preg_match_all("/class=\"user_name\"\\stitle=\"(.+?)\"/", $data, $matches)) {
            var_export($matches[1]);
        }

        if (preg_match("/class=\"tbui_pagination\\stbui_pagination_left\">共(.+?)页/", $data, $pageMatches)) {
            var_export($pageMatches[1]);
        }
    }
}
 