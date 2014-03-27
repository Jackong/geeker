_.Module.define({path: "common/widget/browserStatistics", sub: {initial: function () {
    var e = $.cookie("activelevel");
    (!e || "" == e) && this._sendActive()
}, _detectOS: function () {
    var e = navigator.userAgent, a = "Win32" == navigator.platform || "Windows" == navigator.platform, i = "Mac68K" == navigator.platform || "MacPPC" == navigator.platform || "Macintosh" == navigator.platform || "MacIntel" == navigator.platform;
    if (i)return"Mac";
    var t = "X11" == navigator.platform && !a && !i;
    if (t)return"Unix";
    var n = String(navigator.platform).indexOf("Linux") > -1;
    if (n)return"Linux";
    if (a) {
        var o = e.indexOf("Windows NT 5.0") > -1 || e.indexOf("Windows 2000") > -1;
        if (o)return"Win2000";
        var r = e.indexOf("Windows NT 5.1") > -1 || e.indexOf("Windows XP") > -1;
        if (r)return"WinXP";
        var s = e.indexOf("Windows NT 5.2") > -1 || e.indexOf("Windows 2003") > -1;
        if (s)return"Win2003";
        var s = e.indexOf("Windows NT 6.0") > -1 || e.indexOf("Windows Vista") > -1;
        if (s)return"WinVista";
        var s = e.indexOf("Windows NT 6.1") > -1 || e.indexOf("Windows 7") > -1;
        if (s)return"Win7"
    }
    return"other"
}, _sendActive: function () {
    var e = this;
    $.ajax({url: "/activelevel/add", data: {os: e._detectOS().toLowerCase(), psh: window.screen.height, psw: window.screen.width, psl: window.screenLeft, pst: window.screenTop, psx: window.screenX, psy: window.screenY, psah: window.screen.availHeight, psaw: window.screen.availWidth, psal: window.screen.availLeft, psat: window.screen.availTop, pscd: window.screen.colorDepth, pspd: window.screen.pixelDepth, fid: PageData.forum.forum_id}, dataType: "json", type: "POST", success: function (e) {
        if (e && 0 == e.errno) {
            var a = e.expire / 86400;
            a && $.cookie("activelevel", 1, {expires: a})
        }
    }})
}, _showpop: function (e) {
    if ("1" == e) {
        var a = $.dialog.open("<div class='black_cookie_tip'>亲爱的贴吧用户：为避免盗号、隐私泄露等问题，确保账号安全，请您更换更安全的浏览器。我们即将停止支持有安全隐患的浏览器对贴吧的访问。<br/>推荐安装<a href='http://liulanqi.baidu.com/' target='_blank'>百度浏览器</a> <a href='http://www.baidu.com/s?tn=baiduhome_pg&ie=utf-8&bs=IE&f=8&rsv_bp=1&rsv_spt=1&wd=IE10&rsv_sug3=2&rsv_sug=0&rsv_sug1=2&rsv_sug4=78&inputT=1008' target='_blank'>IE</a> <a href='http://chrome.google.com/' target='_blank'>Chrome</a>等安全浏览器。<br/>另外推荐下载<a href='http://c.tieba.baidu.com/c/s/download/pc' target='_blank'>手机客户端</a>或直接手机浏览器访问（tieba.baidu.com），随时随地给您更好更安全的贴吧体验！<a title='关闭' class='black_cookie_dlg_close j_black_cookie_dlg_close' href='#'>&nbsp;</a></div>", {modal: !1, showTitle: !1, width: 980, fixed: !0, autoCenter: !0});
        $(a.element[0]).find(".dialogJcontent").css("background-color", "#ffffe3"), $(a.element[0]).find(".j_black_cookie_dlg_close").click(function () {
            a.close()
        });
        var i = ($(window).width() - 990) / 2;
        a.setPosition(i, 0)
    } else var a = $.dialog.open("<div class='black_cookie_pop'>亲爱的贴吧用户：为避免盗号、隐私泄露等问题，确保账号安全，我们已<span class='black_cookie_red'>停止支持</span>有安全隐患的浏览器对贴吧的访问。请您<span class='black_cookie_red'>更换更安全的浏览器</span>后继续贴吧之旅。推荐安装<a href='http://liulanqi.baidu.com/' target='_blank'>百度浏览器</a> <a href='http://www.baidu.com/s?tn=baiduhome_pg&ie=utf-8&bs=IE&f=8&rsv_bp=1&rsv_spt=1&wd=IE10&rsv_sug3=2&rsv_sug=0&rsv_sug1=2&rsv_sug4=78&inputT=1008' target='_blank'>IE</a> <a href='http://chrome.google.com/' target='_blank'>Chrome</a>等安全浏览器。<br/>另外推荐下载<a href='http://c.tieba.baidu.com/c/s/download/pc' target='_blank'>手机客户端</a>或直接手机浏览器访问（tieba.baidu.com），随时随地给您更好更安全的贴吧体验！</div>", {title: "贴吧安全警告", closeable: !1, draggable: !1, escable: !1, width: 600})
}}});
_.Module.define({path: "common/widget/top_banner", sub: {_jq_container: null, _cookie_key: "top_banner_close", _show: function () {
    this._jq_container.show(), this._moveUserBar(!0), $.stats.sendRequest("fr=tb0_forum&st_mod=top_banner&st_type=show"), this._jq_container.find(".j_top_banner_img").click(function () {
        $.stats.sendRequest("fr=tb0_forum&st_mod=top_banner&st_type=click")
    })
}, _hide: function () {
    this._jq_container.hide(), this._moveUserBar(!1)
}, _moveUserBar: function (e) {
    e ? $("head").append('<style id="top_banner_pos">body #com_userbar{top:32px;} body .ui_bubble_wrap{top:50px;}</style>') : $("#top_banner_pos").remove()
}, _bindEvents: function () {
    var e = this;
    e._jq_container.find(".j_top_banner_close").click(function () {
        $.cookie(e._cookie_key, 1, {expires: 1}), e._hide(), $.stats.sendRequest("fr=tb0_forum&st_mod=top_banner&st_type=close")
    })
}, initial: function () {
    this._jq_container = $("#top_banner");
    var e = $.cookie(this._cookie_key);
    1 != e && (this._show(), this._bindEvents())
}}});
_.Module.define({path: "common/widget/footer", requires: [], sub: {initial: function () {
    this._handleEvents()
}, _handleEvents: function () {
    var i = $("#btnFroceToPad");
    i.bind("click", function () {
        $.cookie("tb_device", null), url = window.location.href.toString(), -1 !== url.indexOf("kw") && -1 === url.indexOf("ie=utf-8") && (url += -1 !== url.indexOf("?") ? "&ie=utf-8" : "?ie=utf-8"), window.location.href = url
    })
}}});
_.Module.define({path: "common/widget/MobileTip", sub: {initial: function () {
    function i() {
        $("#tbMobileTip").remove(), $.cookie("mobile_tip_closed", "1", {expires: 1})
    }

    var e = "1" == $.cookie("wap_skipped"), o = "1" == $.cookie("mobile_tip_closed");
    if (e && !o) {
        var t = "http://wapp.baidu.com/", l = ["<div id='tbMobileTip' class='tb_mobile_tip'>", "<div class='tb_mobile_tip_title'>手机浏览时建议您：</div>", "<div class='tb_mobile_tip_content'>直接<a href='#{link}' class='ui_text_link'>访问手机贴吧</a>，签到经验更多，浏览体验更好！</div>", "<div class='tb_mobile_tip_close'></div>", "</div>"].join(""), b = $($.tb.format(l, {link: t}));
        b.find(".tb_mobile_tip_close").bind("click", i).bind("touch", i), $(".wrap1").before(b)
    }
}}});
_.Module.define({path: "common/widget/poptip", sub: {_cookieKey: "poptip_0", initial: function (o) {
    o = o || {};
    var e = $("#common_poptip_html").html(), i = /pv_code=.?(\d+).?/.exec(e);
    null != i && (this._cookieKey = "poptip_" + i[1]), this._isShowed(this._cookieKey) || this._show(e, o)
}, _show: function (o, e) {
    var i = this, t = {content: o, arrow_dir: "up", bubble_css: {top: 20, right: 20, width: null != e.width ? e.width : 228}, arrow_pos: {right: 15}, wrap: $("body"), closeBtn: !0, arrowReq: !1}, n = new UiBubbleTipBase(t);
    n.bind("onclose", function () {
        i._setShowed(i._cookieKey), n.closeBubble()
    }), n.showBubble()
}, _setShowed: function (o) {
    $.cookie(o, 1, {expires: 30})
}, _isShowed: function (o) {
    return null != $.cookie(o)
}}});
_.Module.define({path: "common/widget/search_handler", sub: {_staticUrl: {no_key: "http://tieba.baidu.com/", "\u8d34\u5427\u6295\u8bc9": "http://tieba.baidu.com/tousu/new", "\u5e16\u5427\u6295\u8bc9": "http://tieba.baidu.com/tousu/new", tiebatousu: "http://tieba.baidu.com/tousu/new", "\u8d34\u5427\u6295\u8bc9\u5427": "http://tieba.baidu.com/tousu/new", "\u8d34\u5427\u6295\u8bc9\u4e2d\u5fc3": "http://tieba.baidu.com/tousu/new", "\u6295\u8bc9\u4e2d\u5fc3": "http://tieba.baidu.com/tousu/new", "\u6295\u8bc9": "http://tieba.baidu.com/tousu/new", "\u8d34\u5427\u4e3e\u62a5": "http://tieba.baidu.com/tousu/new", "\u77e5\u9053\u6295\u8bc9": "http://tousu.baidu.com/zhidao", "\u7a7a\u95f4\u6295\u8bc9": "http://tousu.baidu.com/hi", "\u767e\u79d1\u6295\u8bc9": "http://tousu.baidu.com/baike", zhidaotousu: "http://tousu.baidu.com/zhidao", kongjiantousu: "http://tousu.baidu.com/hi", baiketousu: "http://tousu.baidu.com/baike"}, _sendStatistics: function (b, a) {
    $.stats.sendRequest("st_mod=search&search_type=" + b)
}, initial: function () {
}, toStaticUrl: function (b) {
    var a = b.toLowerCase();
    if (this._staticUrl.hasOwnProperty(a)) {
        $.tb.location.setHref(this._staticUrl[a]);
        return false
    }
}, enterBa: function (a, b) {
    if (a == "") {
        $.tb.location.setHref(this._staticUrl.no_key);
        return false
    }
    this.toStaticUrl(a);
    var d = [];
    if (a.indexOf("\uff1a") != -1) {
        d = a.split("\uff1a")
    } else {
        d = a.split(":")
    }
    if (d.length == 2) {
        if (d[0] == "\u6807\u7b7e") {
            this._sendStatistics("tagsearch", a);
            $.tb.location.setHref("/f/search/fm?ie=utf-8&tag=" + encodeURIComponent(d[1]));
            return false
        } else {
            if (d[0].indexOf("\u5427\u5185") != -1) {
                var c = d[0].split("\u5427\u5185")[0];
                if (c) {
                    this._sendStatistics("baneisearch", a);
                    $.tb.location.setHref("/f/search/res?ie=utf-8&kw=" + encodeURIComponent(c) + "&qw=" + encodeURIComponent(d[1]));
                    return false
                }
            }
        }
    }
    if (PageData.search_what && b != "fromBtn") {
        if (PageData.search_what == "composite") {
            this._sendStatistics("compositesearch", a);
            $.tb.location.setHref("/f/search/res?ie=utf-8&qw=" + encodeURIComponent(a));
            return false
        } else {
            if (PageData.search_what == "forum") {
                this._sendStatistics("forumsearch", a);
                $.tb.location.setHref("/f/search/fm?ie=utf-8&qw=" + encodeURIComponent(a));
                return false
            }
        }
    }
    this._sendStatistics("enterba&from=search", a);
    $.tb.location.setHref("/f?ie=utf-8&kw=" + encodeURIComponent(a));
    return false
}, searchPost: function (a) {
    if (!window.history_search_post) {
        if (PageData.user.is_login) {
            $.tb.post("/f/search/addWord", {word: a}, function (b) {
                if (b.no == 0) {
                    window.history_search_post = false
                }
            })
        }
        window.history_search_post = true
    }
    this._sendStatistics("postsearch", a);
    setTimeout(function () {
        $.tb.location.setHref("/f/search/res?ie=utf-8&qw=" + encodeURIComponent(a))
    }, 100);
    return false
}, searchPostInBa: function (c, a) {
    var b = "/f/search/res?ie=utf-8&kw=" + encodeURIComponent(a) + "&qw=" + encodeURIComponent(c);
    if (!window.history_search_post) {
        if (PageData.user.is_login) {
            $.tb.post("/f/search/addWord", {word: c}, function (d) {
                if (d.no == 0) {
                    window.history_search_post = false
                }
            })
        }
        window.history_search_post = true
    }
    this._sendStatistics("baneisearch", c);
    setTimeout(function () {
        $.tb.location.setHref(b)
    }, 100);
    return false
}, searchPeople: function (a) {
    this._sendStatistics("peoplesearch", a);
    $.tb.location.setHref("/f/search/sure?ie=utf-8&only_user=1&qw=" + encodeURIComponent(a));
    return false
}, searchTag: function (a) {
    this._sendStatistics("tagsearch", a);
    $.tb.location.setHref("/f/search/fm?ie=utf-8&tag=" + encodeURIComponent(a));
    return false
}, searchForum: function (b) {
    var a = "/f/search/fm?ie=UTF-8&";
    if (b.indexOf("\u6807\u7b7e\uff1a") != -1) {
        b = b.substr(b.indexOf("\u6807\u7b7e\uff1a") + 3);
        a = a + "tag=" + encodeURIComponent(b)
    } else {
        if (b.indexOf("\u6807\u7b7e:") != -1) {
            b = b.substr(b.indexOf("\u6807\u7b7e:") + 3);
            a = a + "tag=" + encodeURIComponent(b)
        } else {
            a = a + "qw=" + encodeURIComponent(b)
        }
    }
    $.tb.location.setHref(a);
    return false
}}});
_.Module.define({path: "common/widget/search_dialog", requires: ["common/widget/search_handler"], sub: {_DLG_ID: "tb_header_search_dlg", _options: {defaultType: "post", style: null, forumName: null, page: null}, _searchHandler: null, _jq_wrap: null, _jq_input: null, _jq_form: null, initial: function (a) {
    $.extend(this._options, a);
    this._initOptPage();
    this._searchHandler = this.use("common/widget/search_handler");
    this._initDlg()
}, _initOptPage: function () {
    if (this._options.page == null) {
        if (/^\w+:\/\/[^\/]+\/(index\.html?)|(i\/\d+)/.test($.tb.location.getHref())) {
            this._options.page = "index"
        } else {
            if (/^\w+:\/\/[^\/]+\/tb\/picture\/(index\.html?)/.test($.tb.location.getHref())) {
                this._options.page = "picture_index"
            } else {
                if (PageData.product == "itieba3") {
                    this._options.page = "itieba"
                }
            }
        }
    }
}, _initDlg: function () {
    var a = this._createDlgHtml();
    new $.dialog({html: a, title: "\u8bf7\u8f93\u5165\u60a8\u8981\u627e\u7684\u5185\u5bb9", width: 482});
    this._jq_wrap = $("#" + this._DLG_ID);
    this._jq_input = this._jq_wrap.find(".j_kw");
    this._jq_form = this._jq_wrap.find(".j_form");
    this._bindEvents()
}, _bindEvents: function () {
    var a = this;
    a._jq_form.bind("submit", function () {
        a.submit();
        return false
    });
    a._jq_input.focus()
}, _formSubmitHandler: function () {
    var a = this._getSearchType(), b = this._jq_input.val();
    return this.handleSubmit(a, b)
}, submit: function () {
    var a = this.getSearchWord();
    switch (this._options.defaultType) {
        case"post":
            this._searchHandler.searchPost(a);
            break;
        case"benba":
            this._searchHandler.searchPostInBa(a, this._options.forumName);
            break
    }
    return false
}, getSearchWord: function () {
    var a = this._jq_input.val();
    a = a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "");
    return a
}, _getSearchType: function () {
    var b = CommonSearch.SearchConfig.searchTypes.tieba;
    var a = this._jq_wrap.find("input:checked").tbattr("class");
    var d = CommonSearch.SearchConfig.radioClasses;
    for (var c in d) {
        if (d[c] == a) {
            b = CommonSearch.SearchConfig.searchTypes[c];
            break
        }
    }
    return b
}, _createDlgHtml: function () {
    var a = '<div id="' + this._DLG_ID + '" class="search_dialog_bright"><form name="f1" class="j_form"  action="/f"><input autocomplete="off" size="42" tabindex="1" name="kw" class="j_kw s_ipt tb_header_search_input" maxlength="100" /><span class="s_btn_wr">';
    if (this._options.defaultType === "post") {
        a += '<input type="submit" value="\u8d34\u5427\u641c\u7d22" class="j_submit s_btn" onmousedown="this.className=\'s_btn s_btn_h\'" onmouseout="this.className=\'s_btn\'" /></span></form>'
    } else {
        a += '<input type="submit" value="\u5427\u5185\u641c\u7d22" class="j_submit s_btn" onmousedown="this.className=\'s_btn s_btn_h\'" onmouseout="this.className=\'s_btn\'" /></span></form>'
    }
    a += "</div>";
    return a
}}});
_.Module.define({path: "common/widget/search_bright", requires: ["common/widget/search_handler", "common/widget/search_dialog"], sub: {_jq_wrap: null, _jq_input: null, _jq_input_box: null, _jq_form: null, _options: {defaultType: "tieba", style: "", forumName: "", page: null}, _tip: null, _searchHandler: null, _switchRadios: {}, _radioClasses: {tieba: "jointb", itieba: "authortb", post: "searchtb", benba: "nowtb", tag: "searchtag", forum: "searchforum"}, _searchTypes: {tieba: 1, itieba: 2, post: 3, benba: 4, tag: 5, forum: 6}, _searchFixed: null, initial: function (b, a) {
    this._jq_wrap = b;
    this._jq_form = b.find(".j_search_form");
    this._jq_input = b.find("#wd2");
    this._jq_input_box = b.find(".j_search_input");
    this._tip = PageUnit.load("search_input_tip");
    this._searchFixed = a.searchFixed;
    PageData.searchFixed = this._searchFixed;
    $.extend(this._options, a);
    this._initOptPage();
    this._searchHandler = this.use("common/widget/search_handler");
    this._setSwitchRadios();
    this._setDefaultType();
    this._setSearchType(this._options.defaultType);
    this._initPlaceholder();
    this._bindEvents();
    if ($.browser.msie && parseInt($.browser.version) <= 7) {
        return false
    }
    this._searchScrollFixed()
}, _setSwitchRadios: function () {
    var a = this;
    for (var b in this._searchTypes) {
        this._switchRadios[b] = a._jq_wrap.find(".switch_radios ." + a._radioClasses[b] + ":first")
    }
}, _setDefaultType: function () {
    var a = $.tb.location.getHref();
    if (a.indexOf("/f/search/fm") != -1) {
        this._options.defaultType = "forum"
    } else {
        if (a.indexOf("/f/search/res") != -1) {
            this._options.defaultType = "post"
        } else {
            if (a.indexOf("/f/search/sure") != -1) {
                this._options.defaultType = "itieba"
            }
        }
    }
    if (this._options.style == "bright_3") {
        this._options.defaultType = "benba"
    }
}, _getSearchType: function () {
    var b = null;
    if (this._options.theme && this._options.theme == "bright_pb") {
        b = this._searchTypes.benba;
        return b
    } else {
        b = this._searchTypes.tieba
    }
    for (var c in this._switchRadios) {
        var a = this._switchRadios[c];
        if (!a.tbattr("checked")) {
            continue
        }
        b = this._searchTypes[c];
        break
    }
    return b
}, _setSearchType: function (a) {
    if (a in this._switchRadios) {
        if (this._searchTypes[a] == "2") {
            this._switchRadios.tieba.tbattr("checked", false)
        }
        this._switchRadios[a].tbattr("checked", true)
    }
}, _bindEvents: function () {
    var a = this;
    this._jq_wrap.find(".j_search_nav a").click(function () {
        a._changeProduct($(this))
    });
    this._jq_form.submit(function () {
        if (a._options.style == "bright_3" || a._options.style == "bright_4") {
            a.handleSubmit(a._getSearchType(), a.getSearchWord())
        } else {
            a.submit()
        }
        return false
    });
    this._jq_wrap.find(".j_enter_ba").click(function () {
        a.submit("fromBtn");
        return false
    });
    this._jq_wrap.find(".j_search_post").click(function () {
        if (a._options.style == "bright_3" || a._options.style == "bright_4") {
            a.handleSubmit(a._getSearchType(), a.getSearchWord())
        } else {
            a._searchPost()
        }
        return false
    });
    this._jq_wrap.find(".j_benba_search").click(function () {
        if (a._options.theme == "bright_pb") {
            a.handleSubmit(a._getSearchType(), a.getSearchWord())
        }
    });
    this._jq_input_box.bind("webkitspeechchange", function () {
        a.submit()
    });
    if ($.browser.webkit) {
        this._jq_input_box.click(function () {
            this.select()
        })
    } else {
        this._jq_input_box.focus(function () {
            this.select()
        })
    }
}, submit: function (b) {
    var a = this.getSearchWord();
    if ($("#searchtag").tbattr("checked")) {
        this._searchHandler.searchTag(a)
    } else {
        this._searchHandler.enterBa(a, b)
    }
    return false
}, handleSubmit: function (c, a) {
    var b = true;
    switch (c) {
        case this._searchTypes.tieba:
            b = this._searchHandler.enterBa(a);
            break;
        case this._searchTypes.itieba:
            b = this._searchHandler.searchPeople(a);
            break;
        case this._searchTypes.post:
            b = this._searchHandler.searchPost(a);
            break;
        case this._searchTypes.benba:
            b = this._searchHandler.searchPostInBa(a, this._options.forumName);
            break;
        case this._searchTypes.tag:
            b = this._searchHandler.searchTag(a);
            break;
        case this._searchTypes.forum:
            b = this._searchHandler.searchForum(a);
            break;
        default:
            b = true;
            break
    }
    return b
}, _initOptPage: function () {
    if (this._options.page == null) {
        if (/^\w+:\/\/[^\/]+\/(index\.html?)|(i\/\d+)/.test($.tb.location.getHref())) {
            this._options.page = "index"
        } else {
            if (/^\w+:\/\/[^\/]+\/tb\/picture\/(index\.html?)/.test($.tb.location.getHref())) {
                this._options.page = "picture_index"
            } else {
                if (PageData.product == "itieba3") {
                    this._options.page = "itieba"
                }
            }
        }
    }
}, _changeProduct: function (i) {
    var k = this.getSearchWord();
    var a = $.tb.unescapeHTML(i.tbattr("href"));
    var h = $.tb.unescapeHTML(i.tbattr("param"));
    if (k == "") {
        var f = a.match(/^(\w+:\/\/[^\/]+)/i);
        var b = a.match(/fr=[^&]+/i);
        var c = [];
        var d = "";
        if (b != null && b.length > 0) {
            c.push(b[0])
        }
        if (c.length > 0) {
            d = "/?" + c.join("&")
        }
        i.tbattr("href", f && f[1] + d)
    } else {
        if (h != null && h != "") {
            if (a.indexOf("www.baidu.com") >= 0) {
                var g = "fr=tb01000&";
                if ($.tb.location.getHref().match("ftype=guide")) {
                    g = "fr=tb01se0&"
                }
                var j = a.indexOf("fr=");
                if (j > -1) {
                    i.tbattr("href", a.substring(0, index) + g)
                } else {
                    i.tbattr("href", a + g)
                }
            }
            var e = i.tbattr("ie");
            if (e != null && e.match(/utf-?8/gi) != null) {
                k = encodeURIComponent(k)
            } else {
                k = k.replace(/\%/gi, "%25").replace(/&/gi, "%26").replace(/\+/gi, "%2B").replace(/[\ \u3000]/gi, "%20").replace(/\//gi, "%2F").replace(/\#/gi, "%23").replace(/\=/gi, "%3D")
            }
            var j = a.indexOf(h + "=");
            if (j > -1) {
                i.tbattr("href", a.substring(0, j) + h + "=" + k)
            } else {
                i.tbattr("href", a + h + "=" + k)
            }
        }
    }
}, _searchPost: function () {
    var a = this.getSearchWord();
    var b = $.extend({}, this._options);
    b.defaultType = "post";
    if (a == "") {
        this.use("common/widget/search_dialog", b)
    } else {
        this._searchHandler.searchPost(a)
    }
}, _initPlaceholder: function () {
    var a = this;
    if ($.inArray(a._options.page, ["index", "picture_index", "itieba"])) {
        if (a._tip == "0") {
            _.Module.use("common/widget/Placeholder", [a._jq_input_box, a._tip, {color: "#bbb", "font-size": "13px"}])
        }
    } else {
        a._jq_input.bind("mousedown focus", function () {
            if (a._jq_input.val() === a._tip) {
                a._jq_input.val("");
                a._jq_input_box.val("")
            }
        })
    }
}, _voiceInput: function () {
    var b = this.getSearchWord();
    var a = b.indexOf(this._tip);
    if (a === 0) {
        b = b.slice(this._tip.length);
        this._jq_input.val(b);
        this._jq_input_box.val(b)
    }
    this.submit()
}, getSearchWord: function () {
    return this._jq_input_box.val()
}, isDefaultTip: function () {
    return(this._jq_input_box.val() === this._tip && this._jq_input_box.hasClass("s_ipt_tip")) || this._jq_input_box.val() === ""
}, _searchScrollFixed: function () {
    var b = this;
    if (!this._searchFixed) {
        return
    }
    var d = $("#head").find(".search_main");
    var a = $(".search_main").offset().top;
    var c = false;
    $(window).scroll(function () {
        setTimeout(function () {
            var e = $(window).scrollTop();
            if (e > a) {
                if (c) {
                    return
                }
                $(".senior-search-link").css({visibility: "hidden"});
                d.addClass("search_main_fixed").hide();
                d.fadeIn(500);
                d.find(".search_form").addClass("search_form_fixed");
                d.find(".search_ipt").addClass("search_ipt_fixed");
                d.find(".search_btn").addClass("search_btn_fixed");
                d.find(".search_btn_enter_ba").addClass("search_btn_enter_ba_fixed");
                d.find("#search_logo_small").addClass("search_logo_fixed");
                d.find("#tb_header_search_form").addClass("j_search_form_fixed");
                $("#search_logo_small").addClass("search_logo_fixed");
                $("#tb_header_search_form").addClass("j_search_form_fixed");
                c = true
            } else {
                if (!c) {
                    return
                }
                $(".senior-search-link").css({visibility: "visible"});
                $("#search_baidu_promote").show();
                $("#search_button_wrapper").show();
                d.removeClass("search_main_fixed");
                d.find(".search_form").removeClass("search_form_fixed");
                d.find(".search_ipt").removeClass("search_ipt_fixed");
                d.find(".search_btn").removeClass("search_btn_fixed");
                d.find(".search_btn_enter_ba").removeClass("search_btn_enter_ba_fixed");
                d.find("#search_logo_small").removeClass("search_logo_fixed");
                d.find("#tb_header_search_form").removeClass("j_search_form_fixed");
                c = false
            }
            b._fixUserbar(c)
        }, 1)
    })
}, _fixUserbar: function (d) {
    var b = $("#head .search_form");
    var a = $("#com_userbar");
    var c = a.children("ul");
    if (d) {
        c.children().hide();
        c.find(".u_tbmall").show();
        c.find(".u_tbmall").next("li.split").show();
        c.find(".u_tshow").show();
        b.append(a).css({position: "relative"})
    } else {
        c.children().show();
        $("body").append(a);
        b.css({position: ""})
    }
}}});
_.Module.define({path: "common/component/Card", requires: [], sub: {_option: {}, _j_card: null, _open_timer: null, _close_timer: null, _is_show: false, _is_first_show: true, _default_option: {content: "", arrow_dir: "down", arrow_pos: {}, card_css: {width: 170, "z-index": 1001}, arrow_req: true, auto_positon: false, event_target: null, offset: {x: 0, y: 0}, card_leave_display: false, card_hover_show: true, card_leave_hide: false, attr: "", wrap: $("body")}, initial: function (b) {
    var a = this;
    a._option = $.extend(true, {}, a._default_option, b);
    this._buildCard()
}, _buildCard: function () {
    var c = this._option;
    var a = this._genericTpl();
    var b = c.wrap;
    this._j_card = $(a);
    this._j_card.find(".j_content").html(c.content);
    b.append(this._j_card);
    delete c.card_css["height"];
    this._j_card.css(c.card_css);
    c.card_css.height = this._j_card.find(".j_content").outerHeight(true);
    this._arrow = this._j_card.find(".j_ui_white_arrow");
    if (c.arrow_pos.left === undefined) {
        this._arrow_left = c.card_css.width / 2 - 10;
        this._arrow.css({left: this._arrow_left})
    }
    this._arrow.css(c.arrow_pos);
    if (!c.arrow_req) {
        this._j_card.find(".j_ui_white_arrow").hide()
    }
    if (c.auto_positon) {
        this._autoPosition()
    }
}, _autoPosition: function () {
    var h = this._option;
    var k = {}, f = $(window).height(), l = $(window).width(), e = $(document).scrollLeft(), b = $(document).scrollTop(), a = h.event_target.innerWidth(), c = h.event_target.innerHeight(), d = "";
    var n = {x: h.event_target.offset().left - h.card_css.width / 2 + (h.event_target.outerWidth(true)) / 2, y: h.event_target.offset().top - h.card_css.height - 10, width: this._j_card.innerWidth(), height: this._j_card.innerHeight() + this._arrow.innerHeight()};
    k.left = n.x;
    k.top = n.y;
    var g = h.arrow_pos.left || this._arrow_left;
    var j = 15;
    var m = l;
    if (l < $(document).width()) {
        m = $(document).width()
    }
    var i = m - (h.card_css.width + j);
    if (k.left < j) {
        g += k.left - j;
        k.left = j
    } else {
        if (k.left > i) {
            g += k.left - i;
            k.left = i
        }
    }
    if (k.top < b) {
        d = "up";
        k.top += c + (n.height || 0);
        k.top -= h.offset.y
    } else {
        k.top += ((k.top + c) > (b + f) ? -c - (n.height || 0) : 0);
        d = "down";
        k.top += h.offset.y
    }
    this._arrow.removeClass("ui_white_down").removeClass("ui_white_up").addClass("ui_white_" + d).css({left: g});
    this._j_card.css(k)
}, _genericTpl: function () {
    var a = this._option.attr;
    var c = this._option.arrow_dir;
    var b = ['<div class="ui_card_wrap" ' + a + ' style="visibility: hidden">', '<div class="j_content ui_card_content ">', "</div>", '<span class="j_ui_white_arrow arrow ui_white_' + c + '"></span>', "</div>"].join("");
    return b
}, showCard: function (b) {
    var a = this;
    if (a._close_timer) {
        clearTimeout(a._close_timer)
    }
    if (b && b.type == "delayShow") {
        if (a._open_timer) {
            clearTimeout(a._open_timer)
        }
        a._open_timer = setTimeout(function () {
            a._showCardDo()
        }, b.time)
    } else {
        a._showCardDo()
    }
}, closeCard: function (b) {
    var a = this;
    if (a._open_timer) {
        clearTimeout(a._open_timer)
    }
    if (b && b.type == "delayClose") {
        a._close_timer = setTimeout(function () {
            a._closeCardDo()
        }, b.time)
    } else {
        a._closeCardDo()
    }
}, hideCard: function (b) {
    var a = this;
    if (a._open_timer) {
        clearTimeout(a._open_timer)
    }
    if (b && b.type == "delayHide") {
        a._close_timer = setTimeout(function () {
            a._hideCardDo()
        }, b.time)
    } else {
        a._hideCardDo()
    }
}, _showCardDo: function () {
    var a = this;
    if (a._is_first_show) {
        this._j_card.bind("mouseenter", function () {
            if (a._option.card_hover_show) {
                a._is_show = true
            }
        });
        this._j_card.bind("mouseleave", function () {
            if (a._option.card_leave_display) {
                return false
            }
            a._is_show = false;
            if (a._option.card_leave_hide) {
                a.hideCard()
            } else {
                a.closeCard()
            }
        });
        a._is_first_show = false
    }
    this._j_card.css({visibility: "visible"})
}, _closeCardDo: function () {
    var a = this;
    if (this._j_card && !this._is_show) {
        a._j_card.remove()
    }
}, _hideCardDo: function () {
    var a = this;
    if (this._j_card && !this._is_show) {
        a._j_card.css({visibility: "hidden"})
    }
}, setContent: function (a) {
    var c = this._option;
    if (this._j_card !== null) {
        var b = this._j_card.find(".j_content");
        b.html(a);
        c.card_css.height = b.outerHeight(true);
        this._j_card.css({height: c.card_css.height});
        if (c.auto_positon) {
            this._autoPosition()
        }
    }
}}});
_.Module.define({path: "encourage/component/meizhi_vote", requires: ["common/component/Card"], sub: {_visit_card: null, _vote_card: null, _visit_card_ajax: null, _vote_button: null, _visit_card_option: {width: 280, height: 237}, _special_visit_card_option: {width: 280, height: 210}, initial: function () {
    this._wrap = $("body"), this._is_meizhi = PageData.user.is_login && PageData.user.meizhi_level >= 0 ? !0 : !1, this.bindEvents()
}, bindEvents: function () {
    var t = this;
    this._wrap.delegate(".j_meizhi_vip", "mouseenter", function () {
        return t.buildVisitCard(this), !1
    }), this._wrap.delegate(".j_meizhi_vip", "mouseleave", function () {
        return t._visit_card_ajax && t._visit_card_ajax.abort(), t._visit_card && t._visit_card.closeCard({type: "delayClose", time: 200}), t._visit_card = null, !1
    }), this._wrap.delegate(".j_meizhi_vote", "click", function (e) {
        return t._vote_card && (t._vote_card.closeCard(), t._vote_card = null, t._vote_button == e.target) ? (e.preventDefault(), !1) : (t.buildVoteCard(this), t._vote_button = e.target, e.preventDefault(), void 0)
    })
}, buildVoteCard: function (t) {
    var e = this, i = $(t).getData(), a = i.user_id;
    $.ajax({type: "post", url: "/encourage/get/meizhi/panel", data: {user_id: a}, dataType: "json"}).success(function (i) {
        if (0 == i.no) {
            var o = i.data, n = e.buildVoteBtnGroup(o.can_vote, a, o.vote_count), s = $(t), _ = s.offset().left - 140 + s.outerWidth(!0) / 2, d = s.offset().top - 64 - 12;
            e._vote_card && (e._vote_card.closeCard(), e._vote_card = null), e._vote_card = e.use("common/component/Card", {content: n, card_css: {top: d, left: _, width: 280, height: 64}, attr: "id='meizhi_vote_card'", wrap: $("body")}), e.bindVoteCardEvent()
        }
    })
}, bindVoteCardEvent: function () {
    var t = this;
    t._vote_card.showCard(), t._vote_card._j_card.delegate(".j_vote_button", "click", function () {
        $.stats.track("frs_btn", "meizhi_vote"), t.vote(this)
    })
}, vote: function (t) {
    var e = this, i = $(t), a = i.getData(), o = a.vote_type, n = "/encourage/post/meizhi/checkvcode", s = "/encourage/post/meizhi/getvcode";
    _.Module.use("common/component/PostorServiceMeizhi", [], function (t) {
        t.postHandler({data: {content: "", tbs: PageData.tbs, fid: PageData.forum.id || PageData.forum.forum_id, kw: PageData.forum.name, uid: a.user_id, scid: PageData.user.id || 0, vtype: o, ie: "utf-8", vcode: ""}, checkUrl: n, vCodeUrl: s, url: "/encourage/post/meizhi/vote", type: "vote", success: function (t) {
            var a = t, n = $('<img class="add_one_icon" src="/tb/static-encourage/img/meizhi/add_one.gif">');
            n.appendTo(i).animate({top: "-=20", opacity: 0}, 1e3);
            var s = e.cutVoteCount(a.vote_count[o]);
            s = s ? s : 1, i.find(".j_vote_count").text(s);
            var _ = i.parent();
            _.find(".j_vote_text").addClass("vote_text_small"), _.find(".j_vote_count").removeClass("hide"), _.siblings(".j_vote_tip").text("投票成功，对该用户每四小时只能投票一次。"), _.addClass("disabled").find(".j_vote_button").removeClass("j_vote_button"), 1 == a.hasCheckVcode && e._msgDialog(), $.stats.track("vote_succ", "meizhi_vote")
        }})
    })
}, _msgDialog: function () {
    var t = {image: '<img style="border:none;" src="http://static.tieba.baidu.com/tb/img/messageFace.gif">', subMessage: "投票成功", message: "", dialogSet: {width: 410, height: 50, title: "发起投票"}}, e = '<div style="margin: 0px 30px 0px 30px;font-size:14px;line-height:20px;text-align:left;font-family: "宋体";"><table style="width:90%"><tbody><tr><td width="60">' + t.image + '</td><td valign="middle" style="font-size:20px;line-height:22px;font-family: "黑体";">' + t.subMessage + "</td></tr></tbody></table>" + t.message + "</div>";
    $.dialog.alert(e, t.dialogSet)
}, buildVisitCard: function (t) {
    var e = this, i = $(t).parent().getData(), a = i.user_id;
    this._visit_card_ajax && this._visit_card_ajax.abort(), this._visit_card_ajax = $.ajax({type: "post", url: "/encourage/get/meizhi/panel", data: {user_id: a, type: 1}, dataType: "json"}).success(function (i) {
        if (0 == i.no) {
            var o = i.data, n = o.level - 1 ? o.level - 1 : "", s = e.calPercent(o.vote_count), _ = "/i/sys/jump?un=" + encodeURIComponent(o.uname) + "&ie=utf-8", d = o.group_info.has_group, v = d ? '<span class="group_icon" title="快到裙里来">&nbsp;</span>' : "", c = d ? '<div class="clearfix"><span style="display:inline;float:left;">Ta的群组：</span><a class="group_name" href="/group/index?id=' + o.group_info.group_id + '" target = "_blank" >' + o.group_info.group_name + "</a></div>" : "", r = ["<a href=" + _ + ' title="头像" class="meizhi_avatar" target="_blank"><img src="' + o.avatar + '"></a>', '<div class="meizhi_corner"></div>', '<div class="meizhi_info">', '<h1 class="clearfix"><a class="name" href=' + _ + ' title="名字" target="_blank">' + o.uname + "</a>" + v + "</h1>", c, '<div>等级：<span class="level">MVP' + n + "</span></div>", '<div>所在吧：<span class="forum_name">' + o.forum_name + "吧</span></div>", "</div>", '<p><a href = "/p/' + o.thread_id + '" target = "_blank" >看看Ta的认证贴>>></a></p>', "<p>已投票比例：</p>", '<div class="meizhi_vote_weight_wrap">', '<span class="vote_weight_meizhi" style="width:' + s.meizhi_orign_percent + '%">' + s.meizhi_need_percent + "</span>", '<span class="vote_weight_weiniang" style="width:' + s.weiniang_orign_percent + '%;">' + s.weiniang_need_percent + "</span>", '<span class="vote_weight_renyao" style="width:' + s.renyao_orign_percent + '%;">' + s.renyao_need_percent + "</span>", "</div>"].join(""), l = e._is_meizhi;
            l || (r += o.can_vote ? '<p class="j_vote_tip">投出无节操的真诚一票！</p>' : "<p>投票成功，对该用户每四小时只能投票一次。</p>"), r += e.buildVoteBtnGroup(o.can_vote, a, o.vote_count), r += e.addTip(o, l);
            var u = $(t), p = l ? e._special_visit_card_option : e._visit_card_option;
            e._visit_card && (e._visit_card.closeCard(), e._visit_card = null), e._visit_card = e.use("common/component/Card", {content: r, card_css: {width: p.width, height: p.height}, auto_positon: !0, event_target: u, attr: "id='meizhi_visit_card'", wrap: $("body")}), e.bindVisitCardEvent()
        }
    })
}, addTip: function (t, e) {
    var i;
    return i = e ? '<p class="level_up_tip"><span class="level_up_tip_title">完成度:</span>获得' + t.exp_value + "点经验、" + t.levelup_left + "张妹纸票后升级</p>" : '<a class="meizhi_card_tip" href="http://tieba.baidu.com/tb/zt/meizhi/index.html" target="_blank">什么是妹纸认证系统>></a>'
}, calPercent: function (t) {
    var e = t.meizhi + t.weiniang + t.renyao, i = Math.round(t.meizhi / e * 100), a = Math.round(t.weiniang / e * 100), o = 100 - i - a, n = 10, s = i > n ? i + "%" : "", _ = a > n ? a + "%" : "", d = o > n ? o + "%" : "";
    $.browser.msie && $.browser.version < 8 && (i > 30 ? i -= 1 : a > 30 ? a -= 1 : o > 30 && (o -= 1));
    var v = {meizhi_orign_percent: i, weiniang_orign_percent: a, renyao_orign_percent: o, meizhi_need_percent: s, weiniang_need_percent: _, renyao_need_percent: d};
    return v
}, buildVoteBtnGroup: function (t, e, i) {
    var a;
    if (this._is_meizhi)a = ['<div class="meizhi_vote_button_wrap meizhi_disabled">', '<div class="vote_button vote_button_meizhi">', '<div class="vote_text vote_text_small">妹纸</div>', '<div class="vote_count">' + this.cutVoteCount(i.meizhi) + "</div>", "</div>", '<span class="btn_split"></span>', '<div class="vote_button vote_button_weiniang">', '<div class="vote_text vote_text_small">伪娘</div>', '<div class="vote_count">' + this.cutVoteCount(i.weiniang) + "</div>", "</div>", '<span class="btn_split"></span>', '<div class="vote_button vote_button_renyao">', '<div class="vote_text vote_text_small">人妖</div>', '<div class="vote_count">' + this.cutVoteCount(i.renyao) + "</div>", "</div>", "</div>"].join(""); else if (t) {
        var o = {user_id: e, vote_type: "meizhi"}, n = {user_id: e, vote_type: "weiniang"}, s = {user_id: e, vote_type: "renyao"};
        a = ['<div class="meizhi_vote_button_wrap">', '<div class="j_vote_button vote_button vote_button_meizhi"' + $.tb.dataField(o) + ">", '<div class="vote_text j_vote_text">妹纸</div>', '<div class="vote_count j_vote_count hide">' + this.cutVoteCount(i.meizhi) + "</div>", "</div>", '<div class="j_vote_button vote_button vote_button_weiniang"' + $.tb.dataField(n) + ">", '<div class="vote_text j_vote_text">伪娘</div>', '<div class="vote_count j_vote_count hide">' + this.cutVoteCount(i.weiniang) + "</div>", "</div>", '<div class="j_vote_button vote_button vote_button_renyao"' + $.tb.dataField(s) + ">", '<div class="vote_text j_vote_text">人妖</div>', '<div class="vote_count j_vote_count hide">' + this.cutVoteCount(i.renyao) + "</div>", "</div>", "</div>"].join("")
    } else a = ['<div class="meizhi_vote_button_wrap disabled">', '<div class="vote_button vote_button_meizhi">', '<div class="vote_text vote_text_small">妹纸</div>', '<div class="vote_count">' + this.cutVoteCount(i.meizhi) + "</div>", "</div>", '<div class="vote_button vote_button_weiniang">', '<div class="vote_text vote_text_small">伪娘</div>', '<div class="vote_count">' + this.cutVoteCount(i.weiniang) + "</div>", "</div>", '<div class="vote_button vote_button_renyao">', '<div class="vote_text vote_text_small">人妖</div>', '<div class="vote_count">' + this.cutVoteCount(i.renyao) + "</div>", "</div>", "</div>"].join("");
    return a
}, cutVoteCount: function (t) {
    return t > 9999 ? "9999+" : t
}, bindVisitCardEvent: function () {
    var t = this;
    this._visit_card.showCard({type: "delayShow", time: 200}), this._visit_card._j_card.delegate(".j_vote_button", "click", function () {
        $.stats.track("card_btn", "meizhi_vote"), t.vote(this)
    })
}}});
;
var Thread_add_result = {resultNo: 0, fid: "", tid: "", vid: "", sign: "", bdauditreason: 0, bdQueryWordEnc: "", autoMsg: "", is_login: 0, init: function (e) {
    if (Thread_add_result && e.data && "object" == typeof e.data)for (var a in e.data)Thread_add_result[a] = e.data[a];
    Thread_add_result.resultNo = e.no
}, isNeedWaitForCheck: function () {
    var e = !1;
    switch (this.resultNo) {
        case 9:
        case 20:
        case 23:
            e = !0
    }
    return e
}, isNeedBindPhone: function () {
    return 4010 == this.resultNo
}, Action_FocusTitle: "focusTitle", Action_FocusContent: "focusContent", Action_ClearYZM: "clearYZM", Action_FocusUrl: "focusUrl", Action_GoToHead: "goToHead", Action_FlushAndGoToHead: "flushAndGoToHead", getActionType: function () {
    var e = "";
    switch (this.resultNo) {
        case 10:
        case 14:
        case 501:
        case 15:
        case 36:
        case 41:
        case 42:
        case 43:
        case 46:
        case 9001:
        case 10010:
        case 10011:
        case 10012:
        case 10013:
        case 220012:
        case 220015:
        case 220035:
        case 2130001:
        case 2130007:
        case 2130008:
        case 2130009:
        case 2130011:
        case 2130012:
        case 2130014:
        case 2130005:
            e = this.Action_FocusContent;
            break;
        case 11:
        case 20:
            e = this.Action_FocusTitle;
            break;
        case 17:
        case 0:
            e = this.Action_FlushAndGoToHead;
            break;
        case 22:
        case 9:
        case 23:
        case 119:
        case 44:
        case 100:
        case 703:
        case 704:
        case 705:
            e = this.Action_GoToHead;
            break;
        case 38:
        case 39:
        case 40:
            e = this.Action_ClearYZM;
            break;
        case 1120:
        case 1121:
            e = this.Action_FocusUrl
    }
    return e
}, getMessage: function () {
    var e = "", a = null;
    if (this.resultNo >= 901 && this.resultNo <= 950)return Thread_add_result.autoMsg;
    switch (null == a && (a = PageData.forum ? PageData.forum.id : null), null == a && (a = PageData.forum_id), null == a && (a = PageData.forumID), this.resultNo) {
        case 10:
            e = "贴子内容包含太少的文字";
            break;
        case 11:
            e = "贴子标题和内容太长";
            break;
        case 12:
            e = null != a ? "操作失败，您的账号因违规操作而被封禁&nbsp;&nbsp;<a href='/pmc/main' target=\"_blank\">查看封禁信息</a>" : "操作失败";
            break;
        case 13:
            e = null != a ? "操作失败，您的网络地址由于非法操作被封<br/><a href='/upc/userinfo?fid=" + a + '\' target="_blank">查看封禁信息</a>' : "您的网络地址由于非法操作被封 ";
            break;
        case 14:
            e = "您发布的贴子已经存在";
            break;
        case 501:
        case 15:
            e = "请不要发表含有不适当内容的留言<br>请不要发表广告贴";
            break;
        case 16:
            e = "对不起，您所输入的贴吧不存在。由于系统升级维护，新建贴吧功能暂停，希望得到您的谅解！";
            break;
        case 19:
        case 200:
        case 201:
        case 202:
            e = "您的用户名或者密码填写有误，请确认后再发表";
            break;
        case 20:
            e = "您发表的贴子的标题或正文包含太少的文字，请修改后再发表";
            break;
        case 17:
            e = "本吧当前只能浏览，不能发贴！";
            break;
        case 18:
        case 21:
            e = "其他未知原因";
            break;
        case 22:
            e = "您发表的贴子已经成功提交，由于特殊原因我们需要核实该贴内容是否含有不良信息，我们会在10分钟内确认，请您耐心等待！";
            break;
        case 9:
            e = this.getCheckMessage(this.bdauditreason);
            break;
        case 33:
            e = 1 == Thread_add_result.is_login ? "您发贴太快了:) 请稍后再发" : "您发贴速度太快了。为了减少恶意灌水和广告贴，系统对匿名发贴进行严格的控制，登录用户不受影响";
            break;
        case 34:
            e = 1 == Thread_add_result.is_login ? "您说话太快了:) 请先停下来喝杯茶吧，或者可以去别的吧看看哦，一定会发现还有您感兴趣的话题" : "您发贴速度太快了。为了减少恶意灌水和广告帖，系统对匿名发贴进行严格的控制，登录用户不受影响";
            break;
        case 220034:
            e = "您说话太快了:) 请先停下来喝杯茶吧，或者可以去别的吧看看哦，一定会发现还有您感兴趣的话题";
            break;
        case 220035:
            e = "亲，已@不少人了，以免打搅更多人，歇一会吧~";
            break;
        case 35:
            e = 1 == Thread_add_result.is_login ? "亲，已@不少人了，以免打搅更多人，歇一会吧~" : "您发贴速度太快了。为了减少恶意灌水和广告贴，系统对匿名发贴进行严格的控制，登录用户不受影响";
            break;
        case 36:
            e = "请不要发广告贴！";
            break;
        case 37:
            e = "您已尝试提交多次了，请返回后刷新页面，方可重新发贴";
            break;
        case 38:
            e = "验证码超时，请重新输入";
            break;
        case 39:
            e = "由于您多次输错验证码，请您返回后刷新页面，方可重新发贴";
            break;
        case 40:
            e = "验证码输入错误，请您返回后重新输入";
            break;
        case 41:
            e = "您的贴子可能包含不合适的内容，请您确定后再提交";
            break;
        case 42:
            e = "您的发贴行为被系统认为有发广告嫌疑，请您稍后再发";
            break;
        case 43:
            e = "您的发贴行为或贴子内容有广告或不合适的特征，请您确定后再发送";
            break;
        case 23:
            e = "您的贴子已经成功提交，但需要系统审核通过后才能建立贴吧";
            break;
        case 119:
            e = "对不起，本主题的回复数已经达到上限，感谢您的参与，欢迎您浏览本吧的其它主题";
            break;
        case 1120:
            e = "抱歉，您输入的图片、视频链接地址错误，您可以点击<a href='http://www.baidu.com/search/post_img.html' target='_blank'>查看相关帮助</a>或返回修改";
            break;
        case 1121:
            e = "抱歉，视频服务升级中，您暂时无法发表带有视频的贴子，给您带来的不便请原谅";
            break;
        case 44:
            e = "对不起，本吧暂时限制部分用户发表主题贴子，您可以浏览或回复本吧其它内容，给您带来不便希望得到您的谅解。";
            break;
        case 100:
            e = "对不起，本吧暂时限制部分用户使用完整的贴吧功能，您可以浏览本吧其它内容，给您带来不便希望得到您的谅解。";
            break;
        case 701:
            e = "为了减少恶意灌水和广告帖，本吧不允许未登录用户发贴，登录用户不受影响，给您带来的不便深表歉意";
            break;
        case 702:
            e = "为了减少恶意灌水和广告帖，本吧限制部分用户发贴，给您带来的不便深表歉意";
            break;
        case 703:
            e = "为了减少恶意灌水和广告帖，本吧被设置为仅本吧会员才能发贴，给您带来的不便深表歉意。<a href='/f?kw=" + this.bdQueryWordEnc + "#1' target=_blank>点此申请加入</a>本吧会员";
            break;
        case 704:
            e = "为了减少恶意灌水和广告帖，本吧被设置为仅本吧管理团队才能发贴，给您带来的不便深表歉意";
            break;
        case 705:
            e = "本吧当前只能浏览，不能发贴！";
            break;
        case 706:
            e = "抱歉，本贴暂时无法回复。";
            break;
        case 45:
            e = "抱歉，您提交的贴吧名称含特殊字符，目前无法创建，推荐您使用汉字、字母或数字作为贴吧名称";
            break;
        case 46:
            e = "抱歉，您的贴子过长，无法正常提交。建议您精简或分段后重新提交，谢谢!";
            break;
        case 800:
            break;
        case 801:
            break;
        case 802:
            break;
        case 803:
            break;
        case 804:
            break;
        case 805:
            break;
        case 806:
            break;
        case 807:
            break;
        case 808:
            break;
        case 809:
            break;
        case 814:
            break;
        case 815:
            e = "抱歉，您已退出登录或未购买音乐道具，请刷新页面重试";
            break;
        case 900:
            e = "为抵御挖坟危害，本吧吧主已放出贴吧神兽--超级静止蛙，本贴暂时无法回复。";
            break;
        case 961:
            e = "发贴失败，您输入的图片地址有错误，请检查更正后再次发布：）";
            break;
        case 9001:
            e = "由于匿名状态或本吧设置，无法发表带有图片的主题。";
            break;
        case 2100:
            e = "内容含有高级字体效果，保持连续签到就能使用哦~~";
            break;
        case 4010:
            e = "您的账号存在安全风险暂不能发贴，请先进行手机绑定后再发贴吧。";
            break;
        case 9e3:
            e = "您还没有用户名，不能在本吧发贴。请先填写用户名。";
            break;
        case 10010:
            e = "您的性别无法进行妹纸认证</br><a style = 'font-size:12px;' href = 'http://www.baidu.com/p/setting/profile/basic' target ='_blank'>去修改我的性别>><a>";
            break;
        case 10012:
            e = "请上传至少一张图片。";
            break;
        case 10013:
            e = "您发往的吧未开通妹纸认证功能。";
            break;
        case 2130001:
            e = "请不要给非妹纸用户投票。";
            break;
        case 2130007:
            e = "您的账号已被封禁。";
            break;
        case 2130008:
            e = "您已经给该用户投过票。";
            break;
        case 2130009:
            e = "投票失败。";
            break;
        case 2130005:
            e = "您已经发起过妹纸认证贴</br><a href='/p/" + Thread_add_result.thread_id + "' target = '_blank' >http://tieba.baidu.com/p/" + Thread_add_result.thread_id + "</a>";
            break;
        case 2130011:
            e = "妹纸认证用户之间不能相互投票。";
            break;
        case 220012:
            e = "您的账号已被封禁。";
            break;
        case 220013:
            e = "您的IP已被封禁。";
            break;
        case 225001:
            e = "您的账号禁止贴条。";
            break;
        case 220015:
            e = "您输入的内容含有敏感信息。";
            break;
        case 219e4:
            e = "<p>抱歉您没有贴条道具了不能发布贴条信息。</p><p>PS：发贴,回贴,参加活动都有机会获得贴条道具。</p>";
            break;
        case 2130012:
            e = "不能给自己投票。";
            break;
        case 2130014:
            e = "不能给男性用户投票";
            break;
        case 2190001:
            e = "您说话太快啦，请休息一下。";
            break;
        case 2190002:
            e = "抱歉，每10分钟只能抢一次贴条。";
            break;
        case 2190003:
            e = "<p>真遗憾~您没有抢到贴条道具。</p><p>PS：等级越高获得道具几率越高哦！</p>";
            break;
        case 2190004:
            e = "服务器忙，请稍后重试";
            break;
        case 2190005:
            e = "您的账号已被封禁。";
            break;
        case 2190006:
            e = "贴条内容不能为空。";
            break;
        case 2190007:
            e = "贴条内容过长。";
            break;
        case 2190008:
            e = "今天的道具被抢完啦，明天继续加油！";
            break;
        default:
            e = "未知错误。"
    }
    return e
}, getCheckMessage: function (e) {
    var a = "";
    switch (e) {
        case-61:
            a = "您的贴子已经成功提交，但为了保证贴子质量，本吧所发的贴子待系统审核通过后才能显示，请您耐心等待";
            break;
        case-62:
            a = "您的贴子已经成功提交，但为了保证贴子质量，本吧贴图的贴子需要审核通过后才能显示，请您耐心等待";
            break;
        case-74:
        case-75:
        case-60:
            a = "您发表的贴子已经成功提交，但系统需要核实该贴子内容是否含有不良信息，贴子在审核通过后才能显示，请您耐心等待";
            break;
        case-70:
            a = "您的贴子已经成功提交，但为了控制广告贴，需要通过审核后才能发布。登陆署名发贴不受此限制。";
            break;
        case-71:
            a = "您发表的帖子太长了。为了防止灌水，需系统审核后才能显示，请稍后查看";
            break;
        default:
            a = "您发表的贴子已经成功提交，但系统需要核实该贴子内容是否含有不良信息，贴子在审核通过后才能显示，请您耐心等待"
    }
    return a
}};
_.Module.define({path: "common/component/JsPager", sub: {_cfg: {}, _amount: 0, _center_pos: 0, _jwrapper: null, _isNew: true, _page_template: {normal: '<a href="#url#" index="#page#" #special#>#page#</a>', current: "<span #special#>#page#</span>", prev: '<a href="#url#" index="#page#" #special#>\u4e0a\u4e00\u9875</a>', next: '<a href="#url#" index="#page#" #special#>\u4e0b\u4e00\u9875</a>', head: '<a href="#url#" index="#page#" #special#>\u9996\u9875</a>', tail: '<a href="#url#" index="#page#" #special#>\u5c3e\u9875</a>', prev_disable: '<a href="#url#" index="#page#" #special#>\u4e0a\u4e00\u9875</a>', next_disable: '<a href="#url#" index="#page#" #special#>\u4e0b\u4e00\u9875</a>', head_disable: '<a href="#url#" index="#page#" #special#>\u9996\u9875</a>', tail_disable: '<a href="#url#" index="#page#" #special#>\u5c3e\u9875</a>', status: '<span #special#><span class="js_pager_idx">#page#</span>/<span class="js_pager_total">#total#</span></span>'}, _default_cfg: {container: $("body"), amount: 10, current: 1, total: 10, mode: 0, url: "##", openInNew: false, showStatus: false, statusPos: "head", showDisableItem: false, template: {}, classname: {wrapper: "tbui_js_pager", normal: "", current: "current", prev: "prev", next: "next", head: "head", tail: "tail", status: "status", prev_disable: "prev_disable", next_disable: "next_disable", head_disable: "head_disable", tail_disable: "tail_disable"}}, initial: function (c) {
    var b = this;
    if (b._isNew) {
        b._cfg = $.extend({}, b._default_cfg, c);
        var a = b._cfg;
        a.template = $.extend({}, b._page_template, a.template);
        a.amount = parseInt(a.amount);
        a.current = parseInt(a.current);
        a.total = parseInt(a.total);
        b._amount = a.total > a.amount ? a.amount : a.total;
        b._center_pos = parseInt((b._amount + 1) / 2)
    } else {
        b._cfg = $.extend(b._cfg, c)
    }
    if (b._amount <= 1) {
        return
    }
    b._render();
    b._isNew = false
}, _render: function () {
    var j = this;
    var g = j._cfg;
    var f = [], e = "";
    if (g.showStatus && g.statusPos === "head") {
        f.push(j._generateHtml("status", g.current, g.total))
    }
    if (g.current > 1) {
        f.push(j._generateHtml("head", 1));
        f.push(j._generateHtml("prev", g.current - 1))
    } else {
        if (g.showDisableItem) {
            f.push(j._generateHtml("head_disable", 1));
            f.push(j._generateHtml("prev_disable", g.current - 1))
        }
    }
    if (j._amount) {
        var a, c, b, h;
        a = g.current - parseInt((j._amount - 1) / 2);
        c = g.current + j._center_pos;
        if (a < 1) {
            b = 1 - a;
            a = 1;
            c = c + b;
            c = c > g.total ? g.total : c
        } else {
            if (c > g.total) {
                b = c - g.total;
                c = g.total;
                a = a - b;
                a = a < 1 ? 1 : a
            }
        }
        for (var d = a; d <= c; d++) {
            h = d == g.current ? "current" : "normal";
            f.push(j._generateHtml(h, d))
        }
    }
    if (g.current < g.total) {
        f.push(j._generateHtml("next", g.current + 1));
        f.push(j._generateHtml("tail", g.total))
    } else {
        if (g.showDisableItem) {
            f.push(j._generateHtml("next_disable", g.current + 1));
            f.push(j._generateHtml("tail_disable", g.total))
        }
    }
    if (g.showStatus && g.statusPos === "tail") {
        f.push(j._generateHtml("status", g.current, g.total))
    }
    e = f.join("");
    if (j._isNew) {
        j._jwrapper = $("<div>", {"class": g.classname.wrapper});
        j._jwrapper.bind("click", function (i) {
            if (i.target.nodeName == "A") {
                if ($(i.target).attr("ok") !== "0") {
                    j.trigger("pageChange", parseInt($(i.target).attr("index")))
                }
                if (g.mode == 0) {
                    return false
                }
            }
        });
        var k = typeof g.container == "string" ? $("#" + g.container) : $(g.container);
        k.empty();
        k.append(this._jwrapper)
    }
    j._jwrapper.html(e)
}, _generateHtml: function (e, f, d) {
    var c = "";
    var a = this._cfg;
    c = a.template[e];
    c = c.replace(/#page#/g, f);
    c = c.replace(/#url#/g, a.url.replace(/\{page\}/g, f));
    if (typeof d !== "undefined") {
        c = c.replace(/#total#/g, d)
    }
    var b = "";
    if (a.classname[e]) {
        b += 'class="' + a.classname[e] + '"'
    }
    if (a.openInNew) {
        b += " target=_blank"
    }
    if (e.indexOf("disable") !== -1) {
        b += ' ok="0"'
    }
    c = c.replace(/#special#/, b);
    return c
}}});
_.Module.define({path: "ihome/widget/Skin", requires: ["common/component/JsPager"], sub: {_dialog: null, _bgid: "", _options: [
    {id: "1130009", title: "春暖花开"},
    {id: "1130008", title: "昆明加油"},
    {id: "1130007", title: "星你的吻"},
    {id: "1130006", title: "情人节快乐"},
    {id: "1130005", title: "马上发财"},
    {id: "1130003", title: "西部牛仔"},
    {id: "1130002", title: "元旦快乐"},
    {id: "1130001", title: "圣诞背景"},
    {id: "1130004", title: "土豪金"},
    {id: "1001", title: "海之梦"},
    {id: "1002", title: "千山雪"},
    {id: "1003", title: "长天一色"},
    {id: "1004", title: "银汉迢迢"},
    {id: "1005", title: "春意浓"},
    {id: "1006", title: "出水芙蓉"},
    {id: "1007", title: "白色飞羽"},
    {id: "1008", title: "寥落星河"},
    {id: "1009", title: "廊桥遗梦"},
    {id: "1010", title: "接天莲叶"},
    {id: "1011", title: "雪山日出"},
    {id: "1012", title: "原野晨曦"},
    {id: "1013", title: "三叶草"},
    {id: "1014", title: "层林尽染"},
    {id: "1015", title: "水墨荷花"}
], initial: function (i) {
    this.dataObj = i, this._setDefaultSkin(), this._bindEvents()
}, _setDefaultSkin: function () {
    var i = this.dataObj.bg_id;
    i && (i >= 1001 && 1016 >= i || i >= 1130001 && 1130009 >= i) || (this.dataObj.bg_id = "1001"), this._setSkin(this.dataObj.bg_id)
}, _setSkin: function (i) {
    var t = ["http://tb1.bdstatic.com/tb/static-ihome/skins/skin_", i, ".css?v=", PageUnit.load("skin_version")].join(""), s = $("#css_skin");
    0 == s.size() ? $('<link id="css_skin" href="' + t + '" rel="stylesheet">').appendTo("head") : s.tbattr("href", t);
    var n = $("body"), e = n.tbattr("class");
    e = e ? e.replace(/skin_\d+/g, "") : "", n.tbattr("class", e), n.addClass("skin_" + i), this._bgid = i
}, _bindEvents: function () {
    var i = this;
    $("#headinfo_wrap").on("click", ".btn_editbg", function () {
        var t = i._options.slice(0, 8);
        return i._initSkinList(t), i.pageTotal = Math.ceil(i._options.length / 8), i.pageTotal > 1 && i._initPager(), !1
    })
}, _initSkinList: function () {
    var i = this, t = new Array;
    t.push('<div id="skin_setting" class="skin_setting">'), t.push('<ul class="skin_list"></ul>'), t.push('<ul class="skin_pager"></ul>'), t.push('<div class="skin_btns">'), t.push('<a class="ui_btn ui_btn_m btn_bg_save" href="#"><span><em>保存</em></span></a>'), t.push('<a class="ui_btn ui_btn_sub_m btn_bg_cancel" href="#"><span><em>取消</em></span></a>'), t.push("</div>"), t.push("</div>"), i._dialog = new $.dialog({html: t.join(""), title: "背景设置", width: 478, height: 245}), this._bindDialogEvents(), this._updateSkinList(this._options.slice(0, 8))
}, _bindDialogEvents: function () {
    var i = this;
    $("#skin_setting .skin_list").on("click", ".skin_canset", function () {
        return i._setSkin($(this).data("bgid")), !1
    }), $("#skin_setting").on("click", ".btn_bg_save", function () {
        return $.tb.post("/home/post/setbg", {bg_id: i._bgid, tbs: i.dataObj.tbs}, function (t) {
            t ? 0 == t.no ? $.tb.location.reload() : 210009 == t.no ? i._showErrorDialog("成功分享您的个人中心”足迹”后可用") : i._showErrorDialog("设置背景失败") : i._showErrorDialog("设置背景失败")
        }), !1
    }), $("#skin_setting").on("click", ".btn_bg_cancel", function () {
        return i._dialog.close(), !1
    }), i._dialog.bind("onclose", function () {
        i._setDefaultSkin()
    })
}, _showErrorDialog: function (i) {
    var t = new $.dialog({width: 300, height: 40, html: '<p style="text-align:center;font-size:14px;line-height:30px;">' + i + "</p>"}), s = setTimeout(function () {
        t.close(), clearTimeout(s)
    }, 1500)
}, _updateSkinList: function (i, t) {
    var s = $("#skin_setting .skin_list"), n = $("#skin_setting .skin_pager");
    s.html(this._getSkinListHtml(i)), t && 1 != t && t != this.pageTotal ? n.css({width: 30 * this.pageTotal + 214 + "px"}) : n.css({width: 30 * this.pageTotal + 107 + "px"})
}, _initPager: function () {
    var i = this, t = i.use("common/component/JsPager", {container: $("#skin_setting .skin_pager"), current: 1, amount: 8, total: i.pageTotal});
    t.bind("pageChange", function (s, n) {
        var e = i._options.slice(8 * (n - 1), 8 * (n - 1) + 8);
        i._updateSkinList(e, n), t.initial({current: n})
    })
}, _getSkinListHtml: function (i) {
    for (var t = new Array, s = !1, n = 0; n < i.length; n++)t.push("<li>"), "113" != i[n].id.substring(0, 3) || this.dataObj.props && this.dataObj.props[i[n].id] && this.dataObj.props[i[n].id].end_time > Env.server_time / 1e3 ? (s = !1, t.push('<a class="skin_canset" href="#" style="background:url(/tb/static-ihome/img/thum_' + i[n].id + '.jpg) no-repeat;" class="skin_item_' + i[n].id + '" data-bgid="' + i[n].id + '">')) : (t.push('<a target="_blank" href="/tbmall/propslist?category=113" style="background:url(/tb/static-ihome/img/thum_' + i[n].id + '.jpg) no-repeat;" class="skin_item_' + i[n].id + '" data-bgid="' + i[n].id + '">'), s = !0), t.push('<span class="skin_title">' + i[n].title + "</span>"), s ? t.push('<span class="skin_angleicon skin_buy"></span>') : i[n].isnew ? t.push('<span class="skin_angleicon skin_new"></span>') : i[n].isfree && t.push('<span class="skin_angleicon skin_free"></span>'), t.push("</a>"), t.push("</li>");
    return t.join("")
}}});
_.Module.define({path: "ihome/widget/Headinfo", sub: {initial: function (i) {
    this.dataObj = i, this._bindEvents()
}, _bindEvents: function () {
}}});
_.Module.define({path: "props/component/PropsApi", requires: ["common/component/JsPager"], sub: {initial: function (t) {
    this.dataObj = t, this.initOptions(), this.bindEvents()
}, initOptions: function () {
    this.titleMap = {"1070001_0": "他们对我使用了“魔拜”", "1070001_1": "他们对贴使用了“魔拜”", "1070002_0": "他们对我使用了“魔蛋”", "1070002_1": "他们对贴使用了“魔蛋”"}, this.urlMap = {0: "/tbmall/getUserAppraise", 1: "/tbmall/getPostAppraise"}
}, bindEvents: function () {
    var t = this, i = t.dataObj;
    $(".props_item_tail").live("click", function () {
        return t.propsData = {props_id: $(this).data("propsid"), props_type: i.props_type}, "0" == i.props_type && (t.propsData.user_id = $(this).data("userid"), t.propsData.user_sex = $(this).data("usersex")), "1" == i.props_type && (t.propsData.post_id = $(this).data("postid")), t.initPager = !0, t.showDialog(), !1
    })
}, getAttrsHtml: function (t) {
    for (var i = null, s = [], a = "", p = ["user_id", "user_sex", "post_id", "props_id"], e = 0; e < p.length; e++)i = p[e], t[i] && (a = "data-" + i.replace(/_/, "") + '="' + t[i] + '"', s.push(a));
    return s.join(" ")
}, showUI: function (t) {
    for (var i = [], s = t.props || {}, a = null, p = 0, e = ["1070001", "1070002"], r = 0; r < e.length; r++)t.props_id = e[r], a = s[e[r]], a && (i.push('<li class="props_item_split"><span class="userinfo_split"></span></li>'), i.push('<li class="props_item props_item_' + e[r] + '">'), i.push('<a href="#" ' + this.getAttrsHtml(t) + ' class="props_item_tail">'), i.push('<span class="props_item_icon"></span>'), i.push('<span class="props_item_plus">' + String.fromCharCode(215) + "</span>"), i.push('<span class="props_item_num">' + a.num + "</span></li>"), i.push("</a>"), p++);
    p > 0 && t.wrap.html(i.join(""))
}, showDialog: function () {
    this.initDialogData(), this.initDialogUI(), this.showOrUpdateList()
}, initDialogData: function () {
    var t = this.propsData, i = t.props_id + "_" + t.props_type, s = this.titleMap[i];
    if (t.user_id !== PageData.user.id) {
        var a = t.user_sex;
        s = s.replace(/我/, a)
    }
    this.dialogTitle = s, this.dataurl = this.urlMap[t.props_type], this.pn = 0, this.pageSize = 10, this.pageCount = 8
}, initDialogUI: function () {
    var t = this;
    this.$wrap = $('<div class="props_userlist_wrap"></div>'), this.$userlist = $('<div class="props_userlist_main"></div>'), this.$wrap.append(this.$userlist), this.dialog = new $.dialog({title: t.dialogTitle, width: 554, height: 340, show: !1, html: this.$wrap})
}, showOrUpdateList: function () {
    var t = this, i = t.propsData, s = {props_id: i.props_id, look_user_id: i.user_id || "", post_id: i.post_id || "", pn: t.pn, c: t.pageSize};
    $.tb.get(t.dataurl, s, function (i) {
        i && 0 == i.no ? (t.list = i.data.list, t.updateList(), t.initPager && i.data.total > 1 && (t.initPager = !1, t.total = Math.ceil(i.data.total / t.pageSize), t.buildPager()), t.dialog.show()) : t.showErrorDialog()
    })
}, showErrorDialog: function () {
    new $.dialog({title: "提示", width: 300, height: 50, html: '<p style="text-align:center;font-size:14px;line-height:40px;">网络错误，请重试</p>'})
}, buildPager: function () {
    var t = $('<div class="props_userlist_pager"></div>');
    this.$wrap.append(t);
    var i = this, s = this.use("common/component/JsPager", {container: t, current: 1, amount: i.pageCount, total: i.total});
    s.bind("pageChange", function (t, a) {
        s.initial({current: a}), i.pn = a, i.showOrUpdateList()
    }), this.pager = s
}, updateList: function () {
    var t = this.list, i = [], s = null;
    i.push('<ul class="props_userlist">');
    for (var a = 0; a < t.length; a++)s = t[a], i.push('<li class="userlist_item">'), i.push('<a class="userlist_head" href="/home/main?id=' + s.portrait + '&fr=props" target="_blank"><img src="http://tb.himg.baidu.com/sys/portrait/item/' + s.portrait + '"/></a>'), i.push('<a class="userlist_name" href="/home/main?id=' + s.portrait + '&fr=props" target="_blank">' + s.user_name + "</a>"), i.push('<p class="userlist_time">' + this.getShowtime(s.create_time) + "</p>"), i.push("</li>");
    i.push("</ul>"), this.$userlist.html(i.join(""))
}, getShowtime: function (t) {
    t *= 1e3;
    var i = new Date($.dateFormat(new Date(Env.server_time), "yyyy-MM-dd 00:00:00")).getTime();
    return t = t > i ? $.dateFormat(new Date(t), "HH:mm") : $.dateFormat(new Date(t), "yyyy-MM-dd")
}}});
_.Module.define({path: "props/widget/Residual", requires: [], sub: {initial: function (i) {
    this.dataObj = i, this.initOptions()
}, initOptions: function () {
    this.options = {1070001: "worship", 1070002: "egg"}
}, getResidualKey: function (i) {
    for (var e = i.props || {}, s = null, n = "", t = ["1070002", "1070001"], a = 0; a < t.length; a++)if (s = e[t[a]], s && s.num > 0 && s.end_time > Env.server_time / 1e3) {
        n = this.options[t[a]];
        break
    }
    return n
}, showUI: function (i) {
    var e = i.wrap, s = "", n = null, t = i.key || this.getResidualKey(i);
    t && (s = "residual_wrap residual_wrap_" + t, n = e.find(".residual_wrap"), n[0] ? n.removeClass().addClass(s) : (n = $('<div class="' + s + '"></div>'), e.append(n)))
}}});
_.Module.define({path: "ihome/widget/Interaction", sub: {initial: function (n) {
    n ? (this.dataObj = n, this._bindEvents()) : this._bindFloatEvents()
}, _resetDataObj: function (n) {
    this.dataObj = n
}, _follow: function (n, o) {
    var t = this;
    if (!PageData.user.is_login)return TbCom.process("User", "buildLoginFrame"), !1;
    if (PageData.user.no_un)return TbCom.process("User", "buildUnameFrame"), !1;
    var e = t._addLoading(n, 0);
    $.tb.post("/home/post/follow", {un: o.un, tbs: o.tbs}, function (o) {
        o ? 0 == o.no ? t._clearLoading(n, e, 0) : 1130036 == o.no ? t._showError("此用户禁止被关注", n, 0) : 2260001 == o.no ? t._showError("操作太频繁，请歇歇！", n, 0) : t._showError("关注失败", n, 0) : t._showError("关注失败", n, 0)
    })
}, _showError: function (n, o, t) {
    var e = new $.dialog({html: '<p style="text-align:center">' + n + "<p>", width: 300, height: 30});
    e.bind("onclose", function () {
        var n = 1 == t ? "btn_concern_done" : "btn_concern";
        o.text("").removeClass().addClass(n)
    })
}, _addLoading: function (n, o) {
    var t = $("<span></span>"), e = "", r = 0, a = [".", "..", "..."], i = ["关注中", "取消中"], s = setInterval(function () {
        e = a[r++ % 3], t.text(e)
    }, 400);
    return n.removeClass().addClass("btn_concern_loading" + o).text(i[o]).append(t), s
}, _clearLoading: function (n, o, t) {
    var e = 1 == t ? "btn_concern" : "btn_concern_done";
    n.text("").removeClass().addClass(e), clearInterval(o)
}, _unfollow: function (n, o) {
    var t = this;
    if (!PageData.user.is_login)return TbCom.process("User", "buildLoginFrame"), !1;
    if (PageData.user.no_un)return TbCom.process("User", "buildUnameFrame"), !1;
    var e = t._addLoading(n, 1);
    $.tb.post("/home/post/unfollow", {un: o.un, tbs: o.tbs}, function (o) {
        o && 0 == o.no ? t._clearLoading(n, e, 1) : 2260001 == o.no ? t._showError("操作太频繁，请歇歇！", n, 0) : t._showError("取消关注失败", n, 1)
    })
}, _bindEvents: function () {
    var n = this;
    $("#userinfo_wrap").delegate(".btn_concern", "click", function () {
        return n._follow($(this), n.dataObj), !1
    }), $("#userinfo_wrap").delegate(".btn_concern_done", "click", function () {
        return n._unfollow($(this), n.dataObj), !1
    })
}, _bindFloatEvents: function () {
    var n = this;
    $("body").delegate(".card_headinfo_wrap .btn_concern", "click", function () {
        return n._follow($(this), n.dataObj), !1
    }), $("body").delegate(".card_headinfo_wrap .btn_concern_done", "click", function () {
        return n._unfollow($(this), n.dataObj), !1
    })
}}});
_.Module.define({path: "ihome/widget/MonthIcon", sub: {iconTitle: {201401: "摩羯座", 201402: "水瓶座", 201403: "双鱼座", 201404: "白羊座", 201405: "金牛座", 201406: "双子座", 201407: "巨蟹座", 201408: "狮子座", 201409: "处女座", 201410: "天秤座", 201411: "天蝎座", 201412: "射手座"}, initial: function () {
}, getMonthIcon: function (n, t) {
    t = t || 1;
    for (var i = '<div class="month_icon_theme_' + t + '">', o = "", e = 201401; 201406 >= e; e++)o = n && n[e] ? " month_icon_" + e : " month_icon_gray_" + e, i += '<a href="/tbmall/monthicon" target="_blank" title="' + this.iconTitle[e] + '" class="' + o + '"></a>';
    return i += "</div>"
}}});
_.Module.define({path: "common/widget/Card", requires: [], sub: {_option: {}, _j_card: null, _open_timer: null, _close_timer: null, _is_show: false, _is_first_show: true, _default_option: {content: "", arrow_dir: "down", arrow_pos: {}, card_css: {width: 170, "z-index": 1001}, arrow_req: true, auto_positon: false, event_target: null, offset: {x: 0, y: 0}, card_leave_display: false, card_hover_show: true, card_leave_hide: false, attr: "", wrap: $("body")}, initial: function (b) {
    var a = this;
    a._option = $.extend(true, {}, a._default_option, b);
    this._buildCard()
}, _buildCard: function () {
    var c = this._option;
    var a = this._genericTpl();
    var b = c.wrap;
    this._j_card = $(a);
    this._j_card.find(".j_content").html(c.content);
    b.append(this._j_card);
    delete c.card_css["height"];
    this._j_card.css(c.card_css);
    c.card_css.height = this._j_card.find(".j_content").outerHeight(true);
    this._arrow = this._j_card.find(".j_ui_white_arrow");
    if (c.arrow_pos.left === undefined) {
        this._arrow_left = c.card_css.width / 2 - 10;
        this._arrow.css({left: this._arrow_left})
    }
    this._arrow.css(c.arrow_pos);
    if (!c.arrow_req) {
        this._j_card.find(".j_ui_white_arrow").hide()
    }
    if (c.auto_positon) {
        this._autoPosition()
    }
}, _autoPosition: function () {
    var h = this._option;
    var k = {}, f = $(window).height(), l = $(window).width(), e = $(document).scrollLeft(), b = $(document).scrollTop(), a = h.event_target.innerWidth(), c = h.event_target.innerHeight(), d = "";
    var n = {x: h.event_target.offset().left - h.card_css.width / 2 + (h.event_target.outerWidth(true)) / 2, y: h.event_target.offset().top - h.card_css.height - 10, width: this._j_card.innerWidth(), height: this._j_card.innerHeight() + this._arrow.innerHeight()};
    k.left = n.x;
    k.top = n.y;
    var g = h.arrow_pos.left || this._arrow_left;
    var j = 15;
    var m = l;
    if (l < $(document).width()) {
        m = $(document).width()
    }
    var i = m - (h.card_css.width + j);
    if (k.left < j) {
        g += k.left - j;
        k.left = j
    } else {
        if (k.left > i) {
            g += k.left - i;
            k.left = i
        }
    }
    if (k.top < b) {
        d = "up";
        k.top += c + (n.height || 0);
        k.top -= h.offset.y
    } else {
        k.top += ((k.top + c) > (b + f) ? -c - (n.height || 0) : 0);
        d = "down";
        k.top += h.offset.y
    }
    this._arrow.removeClass("ui_white_down").removeClass("ui_white_up").addClass("ui_white_" + d).css({left: g});
    this._j_card.css(k)
}, _genericTpl: function () {
    var a = this._option.attr;
    var c = this._option.arrow_dir;
    var b = ['<div class="ui_card_wrap" ' + a + ' style="visibility: hidden">', '<div class="j_content ui_card_content ">', "</div>", '<span class="j_ui_white_arrow arrow ui_white_' + c + '"></span>', "</div>"].join("");
    return b
}, showCard: function (b) {
    var a = this;
    if (a._close_timer) {
        clearTimeout(a._close_timer)
    }
    if (b && b.type == "delayShow") {
        if (a._open_timer) {
            clearTimeout(a._open_timer)
        }
        a._open_timer = setTimeout(function () {
            a._showCardDo()
        }, b.time)
    } else {
        a._showCardDo()
    }
}, closeCard: function (b) {
    var a = this;
    if (a._open_timer) {
        clearTimeout(a._open_timer)
    }
    if (b && b.type == "delayClose") {
        a._close_timer = setTimeout(function () {
            a._closeCardDo()
        }, b.time)
    } else {
        a._closeCardDo()
    }
}, hideCard: function (b) {
    var a = this;
    if (a._open_timer) {
        clearTimeout(a._open_timer)
    }
    if (b && b.type == "delayHide") {
        a._close_timer = setTimeout(function () {
            a._hideCardDo()
        }, b.time)
    } else {
        a._hideCardDo()
    }
}, _showCardDo: function () {
    var a = this;
    if (a._is_first_show) {
        this._j_card.bind("mouseenter", function () {
            if (a._option.card_hover_show) {
                a._is_show = true
            }
        });
        this._j_card.bind("mouseleave", function () {
            if (a._option.card_leave_display) {
                return false
            }
            a._is_show = false;
            if (a._option.card_leave_hide) {
                a.hideCard()
            } else {
                a.closeCard()
            }
        });
        a._is_first_show = false
    }
    this._j_card.css({visibility: "visible"})
}, _closeCardDo: function () {
    var a = this;
    if (this._j_card && !this._is_show) {
        a._j_card.remove()
    }
}, _hideCardDo: function () {
    var a = this;
    if (this._j_card && !this._is_show) {
        a._j_card.css({visibility: "hidden"})
    }
}, setContent: function (a) {
    var c = this._option;
    if (this._j_card !== null) {
        var b = this._j_card.find(".j_content");
        b.html(a);
        c.card_css.height = b.outerHeight(true);
        this._j_card.css({height: c.card_css.height});
        if (c.auto_positon) {
            this._autoPosition()
        }
    }
}}});
_.Module.define({path: "common/widget/MemberApi", sub: {initial: function () {
}, getMemberNameClass: function (b) {
    var a = "";
    if (b && b.level && b.level["end_time"] > Env.server_time / 1000) {
        a = " vip_red "
    }
    return a
}}});
_.Module.define({path: "ihome/widget/Userinfo", requires: ["props/component/PropsApi", "props/widget/Residual"], sub: {portraitRoot: {MIDDLE: "http://himg.baidu.com/sys/portraitm/item/", LARGE: "http://himg.baidu.com/sys/portraitl/item/"}, initial: function (t) {
    this.user = t.user, this.scoreInfo = $(".userinfo_scores_num"), this.scoreTip = null, this.showAppraise(), this.bindEvent()
}, showAppraise: function () {
    this.propsApi = this.use("props/component/PropsApi", {props_type: "0"}), this.residual = this.use("props/widget/Residual"), this.propsApi.showUI({wrap: $("ul.userinfo_appraise"), props: this.user.appraise || {}, user_id: this.user.user_id, user_sex: this.user.personal_pronouns}), this.residual.showUI({wrap: $("#userinfo_wrap .userinfo_left_head"), props: this.user.appraise || {}})
}, bindEvent: function () {
    var t = this;
    this.scoreInfo.bind("mouseenter",function () {
        return t.hasLevel() ? void 0 : (t.showScoreTip(), !1)
    }).bind("mouseleave", function () {
        return t.scoreTip && t.scoreTip.closeCard({type: "delayClose", time: 200}), t.scoreTip = null, !1
    }), $("#j_userhead").on("click", function () {
        var i = $(this).data("sign"), e = t.portraitRoot.LARGE + i, o = new $.modal({show: !0}), s = $('<div id="hd_avatar" />').appendTo("body"), r = function () {
            o.remove(), s.remove()
        };
        t.preLoadImg(e, function (e, o) {
            var a, n = e, p = o;
            240 >= n && 240 >= p ? (a = "hd_avatar_240", e = 240, o = 240) : (a = "hd_avatar_480", e = 480, o = 480), s.css({marginLeft: -(e / 2), marginTop: -(o / 2)}).tbattr("class", a);
            var h = ['<div class="hd_avatar_in">', "</div>", '<img id="hd_avatar_img" class="hd_avatar_img" style="margin-left: -' + n / 2 + "px; margin-top: -" + p / 2 + 'px;" width="' + n + 'px" height="' + p + 'px" src="' + t.portraitRoot.MIDDLE + i + '" />', '<a href="javascript:;" class="hd_avatar_close j_hd_avatar_close" />'].join("");
            $(h).appendTo(s), s.find(".j_hd_avatar_close").on("click", r)
        }, function () {
            var e = s.find("#hd_avatar_img");
            e[0] && s.find("#hd_avatar_img").tbattr("src", t.portraitRoot.LARGE + i)
        }), o.bind("click", r)
    })
}, showScoreTip: function () {
    var t = this, i = this.scoreInfo.offset();
    content = ['<div class="show_score_tip">', "<p>T豆上限：8000</p>", '<p><a href="/tbmall/getTdou" target="_blank">>>什么是T豆上限？</a></p>', "</div>"].join(""), _.Module.use("common/widget/Card", {content: content, card_css: {top: i.top - 58, left: i.left - 87, width: 192, height: 50}}, function (i) {
        t.scoreTip = i, i.showCard()
    })
}, preLoadImg: function (t, i, e) {
    var o = new Image;
    o.src = t;
    var s = function () {
        (o.width > 0 || o.height > 0) && (i(o.width, o.height), clearInterval(r), o.complete && e(o.width, o.height))
    }, r = setInterval(s, 20);
    o.complete ? e(o.width, o.height) : o.onload = function () {
        e(o.width, o.height), o.onload = null
    }
}, hasLevel: function () {
    var t = Math.floor((new Date).getTime() / 1e3);
    return this.user.medal_endtime > t
}}});
window.__discarding && __discarding("props/component/residual"), _.Module.define({path: "props/component/Residual", requires: [], sub: {initial: function (i) {
    this.dataObj = i, this.initOptions()
}, initOptions: function () {
    this.options = {1070001: "worship", 1070002: "egg"}
}, getResidualKey: function (i) {
    for (var e = i.props || {}, n = null, s = "", t = ["1070002", "1070001"], a = 0; a < t.length; a++)if (n = e[t[a]], n && n.num > 0 && n.end_time > Env.server_time / 1e3) {
        s = this.options[t[a]];
        break
    }
    return s
}, showUI: function (i) {
    var e = i.wrap, n = "", s = null, t = i.key || this.getResidualKey(i);
    t && (n = "residual_wrap residual_wrap_" + t, s = e.find(".residual_wrap"), s[0] ? s.removeClass().addClass(n) : (s = $('<div class="' + n + '"></div>'), e.append(s)))
}}});
_.Module.define({path: "props/component/Guide", sub: {initial: function () {
}, initMagicGuide: function () {
    var i = $.cookie("PROPS_MAGIC_GUIDE");
    i || ($.cookie("PROPS_MAGIC_GUIDE", "true", {expires: 30}), this.showMagicGuide())
}, showMagicGuide: function (i) {
    this.propsId = i, this.builGuideUI(), this.buildGuideEvents(), this.initGuideFlash()
}, initPreviewUI: function () {
    this.builGuideUI(), this.buildGuideEvents()
}, builGuideUI: function () {
    this.$mask = new $.modal({show: !0});
    var i = $('<div class="guide_wrap"></div>'), e = $('<div class="guide_content"></div>'), s = $('<a href="#" class="guide_close"></a>');
    i.append(e).append(s), $("body").append(i), i.css({"z-index": $.getzIndex()}), this.$guideWrap = i, this.$guideContent = e, this.$guideClose = s
}, buildGuideEvents: function () {
    var i = this;
    this.$mask.bind("click", function () {
        i.closeGuide()
    }), this.$guideClose.bind("click", function () {
        return i.closeGuide(), !1
    })
}, closeGuide: function () {
    this.$guideWrap.remove(), this.$mask.remove()
}, initGuideFlash: function () {
    this.buildFlashUI(), this.buildFlashEvents()
}, buildFlashUI: function () {
    {
        var i = this, e = "1070002" == this.propsId ? "egg" : "worship", s = "/tb/static-props/swf/guide_" + e + ".swf?t=140112";
        new $.swf(s, {container: i.$guideContent, width: 980, height: 600, params: {wmode: "transparent"}})
    }
    this.$guideWrap.addClass("guide_wrap_magic")
}, buildFlashEvents: function () {
    var i = this, e = {};
    e.finishPlay = function () {
        i.closeGuide()
    }, window.MagicProps = e
}}});
window.__discarding && __discarding("props/component/magic_props"), _.Module.define({path: "props/component/MagicProps", requires: ["props/component/Residual", "props/component/Guide"], sub: {initial: function (t) {
    this.$wrap = t.wrap, this.dataObj = t.propsData, this.visible = !1, this.initOptions(), this.loadComponent(), this.buildProps()
}, initOptions: function () {
    this.propsOptions = {1070001: {key: "worship", name: "魔拜", flashOptions: {width: 320, height: 390, marginLeft: 0, marginTop: 0}}, 1070002: {key: "egg", name: "魔蛋", flashOptions: {width: 900, height: 600, marginLeft: 384, marginTop: 70}}}, this.mallurl = "/tbmall/propslist?category=107", this.poolSize = 5;
    var t = window.navigator.userAgent.match(/chrome/i);
    this.page = t ? $(document.body) : $(document.documentElement)
}, loadComponent: function () {
    this.residual = this.use("props/component/Residual"), this.guide = this.use("props/component/Guide")
}, buildProps: function () {
    this.initPropsData(), this.propsList.length > 0 && (this.visible = !0, this.initPropsUI(), this.bindPropsEvents())
}, initPropsData: function () {
    for (var t = this.dataObj.owner || {}, i = null, a = null, s = [], e = {}, o = ["1070001", "1070002"], r = 0; r < o.length; r++)a = o[r], i = {id: a, count: t[a] && t[a].left_num || 0}, $.extend(i, this.propsOptions[a]), s.push(i), e[a] = i;
    this.propsList = s, this.propsMap = e
}, initPropsUI: function () {
    for (var t = this, i = $('<ul class="tbui_aside_props_list clearfix" id="tbui_aside_props_list"></ul>'), a = new Array, s = null, e = 0; e < t.propsList.length; e++)s = t.propsList[e], a.push('<li class="props_item props_item_' + s.id + '">'), s.count > 0 ? a.push('<a class="j_props_btn props_item_btn" href="#" data-id="' + s.id + '"><img src="/tb/static-props/img/props/' + s.key + '.png"/></a>') : a.push('<a class="props_item_btn" target="_blank" href="' + t.mallurl + '" data-id="' + s.id + '"><img src="/tb/static-props/img/props/' + s.key + '.png"/><span class="props_buy_icon"></span></a>'), a.push('<p class="props_item_title">'), a.push("<span>" + s.name + "</span>"), s.count > 0 && (a.push('<span class="props_item_sign">' + String.fromCharCode(215) + "</span>"), a.push('<span class="props_item_num">' + s.count + "</span>")), a.push("</p>"), a.push("</li>");
    i.html(a.join("")), i.hide().appendTo(t.$wrap), t.$propsList = i
}, bindPropsEvents: function () {
    var t = this;
    t.$wrap.delayhover({enterDelay: 300, leaveDelay: 700, mouseenter: function () {
        t.$propsList.fadeIn(), t.guide.initMagicGuide()
    }, mouseleave: function () {
        t.$propsList.fadeOut()
    }}).children("a").click(function (t) {
        t.preventDefault(), t.stopPropagation()
    }), t.$propsList.delegate(".j_props_btn", "click", function () {
        var i = $(this).data("id"), a = t.propsMap[i];
        return t.propsObj = a, a.count > 0 && ("pb" == PageData.product ? t.buildPostArea() : "ihome" == PageData.product && t.buildIhomeArea(), t.buildMask(), t.initFlashCallbacks()), !1
    })
}, buildIhomeArea: function () {
    var t = {jdom: $("div.userinfo_wrap"), userId: this.dataObj.home_user_id, propsData: this.dataObj.home_user_props, propsType: 0}, i = $("#headinfo_wrap"), a = i.offset().left, s = i.offset().top, e = a + i.width(), o = {marginLeft: a, marginRight: e, marginTop: s, marginBottom: $("body").height() - 28};
    $.extend(t, o), this.limitArea = o, this.areaList = [t]
}, buildPostArea: function () {
    for (var t = $("#j_p_postlist"), i = t.find(".l_post"), a = null, s = null, e = [], o = t.offset().left, r = t.offset().top, p = o + t.width(), n = 0; n < i.length; n++)a = $(i[n]), s = a.getData(), this.doPostItem(a, s, o, p, e);
    var l = {marginLeft: o, marginRight: p, marginTop: r, marginBottom: r + t.height()};
    this.limitArea = l, this.areaList = e
}, doPostItem: function (t, i, a, s, e) {
    var o = null, r = null, p = null, n = t.offset().top, l = n + t.height(), h = {userId: i.author.id, postId: i.content.id, propsData: i.content.props, marginTop: n, marginBottom: l};
    r = {}, o = t.find(".d_author"), r.jdom = o, r.marginRight = a + 130, r.marginLeft = a, $.extend(r, h), e.push(r), p = {}, o = t.find(".d_post_content_main"), p.jdom = o, p.marginRight = s, p.marginLeft = a + 130, $.extend(p, h), e.push(p)
}, buildMask: function () {
    this.flashPool = [], this.currScrollTop = 0, this.currAreaObj = null, this.initMask(), this.setMaskPosition(0, 0, 0, 0), this.bindMaskEvents()
}, initMask: function () {
    var t = $('<div class="mask_layer mask_top"></div>'), i = $('<div class="mask_layer mask_right"></div>'), a = $('<div class="mask_layer mask_bottom"></div>'), s = $('<div class="mask_layer mask_left"></div>'), e = $('<div class="mask_layer light_area"></div>'), o = $('<div id="mask_wrap" class="mask_wrap mouse_' + this.propsObj.key + '"></div>');
    o.append(t).append(i).append(a).append(s).append(e).css({"z-index": $.getzIndex()}), $("body").append(o), this.$maskWrap = o, this.maskMap = {topMask: t, rightMask: i, bottomMask: a, leftMask: s, lightArea: e}
}, setMaskPosition: function (t, i, a, s) {
    var e = this.maskMap;
    e.topMask.css({height: i}), e.rightMask.css({left: t + a, top: i, width: $("body").width() - (t + a), height: s}), e.bottomMask.css({top: i + s, height: $("body").height() - (i + s)}), e.leftMask.css({top: i, width: t, height: s}), e.lightArea.css({left: t, top: i, width: a, height: s})
}, bindMaskEvents: function () {
    var t = this;
    $("body").bind("contextmenu", function () {
        return!1
    }), $(document).bind("keydown", function (i) {
        if (27 == i.which && null != t.$maskWrap) {
            if (t.disabledMove)return!1;
            t.clear()
        }
    }), t.$maskWrap.mousedown(function (i) {
        if (3 == i.which) {
            if (t.disabledMove)return!1;
            t.clear()
        }
        return!1
    });
    var i = 50, a = $("body").width() - i, s = 0;
    t.$maskWrap.mousemove(function (i) {
        if (t.$bulletLayer || (t.$bulletLayer = t.buildBulletLayer(), t.$maskWrap.append(t.$bulletLayer)), s = i.pageX, s > a && (s = a), t.$bulletLayer.css({left: s, top: i.pageY}), t.disabledMove)return!1;
        var e = null, o = t.limitArea;
        if (t.isInArea = i.pageX >= o.marginLeft && i.pageX <= o.marginRight && i.pageY >= o.marginTop && i.pageY <= o.marginBottom ? !0 : !1, t.isInArea)for (var r = 0; r < t.areaList.length; r++)e = t.areaList[r], i.pageX >= e.marginLeft && i.pageX <= e.marginRight && i.pageY >= e.marginTop && i.pageY <= e.marginBottom && (t.setMaskPosition(e.marginLeft, e.marginTop, e.marginRight - e.marginLeft, e.marginBottom - e.marginTop), e.propsType = r % 2, t.areaObj = e); else t.setMaskPosition(0, 0, 0, 0)
    })
}, buildBulletLayer: function () {
    var t = this, i = $('<div class="bullet_layer"><span class="bullet_layer_tip">右键取消</span></div>');
    return i.click(function () {
        t.isInArea ? t.propsObj.count > 0 ? t.flashPool.length <= t.poolSize && (t.updatePosition(), t.post()) : t.showTomallDialog() : t.clear()
    }), i
}, clear: function () {
    this.clearPool(), this.$maskWrap.remove(), this.$maskWrap = null, this.$bulletLayer = null, setTimeout(function () {
        $("body").unbind("contextmenu")
    }, 300)
}, post: function () {
    var t = this, i = "/tbmall/post/useAppraiseProps", a = {props_id: t.propsObj.id, target_user_id: t.areaObj.userId || "", type: t.areaObj.propsType, post_id: t.areaObj.postId || "", tbs: PageData.tbs};
    $.tb.post(i, a, function (i) {
        i && 0 == i.no && t.updatePage()
    })
}, updatePage: function () {
    var t = this.propsObj.id, i = ".props_item_" + t;
    this.updatePropsBtnNum(t, i), ("ihome" == PageData.product || "1" == this.areaObj.propsType) && this.updatePostAreaNum(t, i)
}, updatePropsBtnNum: function (t, i) {
    var a = $("#tbui_aside_props_list " + i), s = this.propsObj.count - 1;
    s = s > 0 ? s : 0, this.propsObj.count = s, s > 0 ? a.find(".props_item_num").text(s) : (a.find(".props_item_btn").removeClass("j_props_btn").tbattr("target", "_blank").tbattr("href", this.mallurl).append('<span class="props_buy_icon"></span>'), a.find(".props_item_sign").remove(), a.find(".props_item_num").remove())
}, updatePostAreaNum: function (t, i) {
    var a = this.areaObj.propsData || {};
    a[t] || (this.areaObj.propsData = {}, this.areaObj.propsData[t] = {num: 0});
    var s = this.areaObj.propsData[t].num + 1;
    s = s > 0 ? s : 0, this.areaObj.propsData[t].num = s;
    var e = this.areaObj.jdom.find("ul.props_appraise_wrap"), o = e.find(i);
    o[0] ? o.find(".props_item_num").text(s) : (htmlArr = [], htmlArr.push('<li class="props_item props_item_split"><span class="userinfo_split"></span></li>'), htmlArr.push('<li class="props_item props_item_' + t + '">'), htmlArr.push('<a href="#" data-postid="' + (this.areaObj.postId || "") + '" data-id="' + t + '" class="props_item_icon"></a>'), htmlArr.push('<span class="props_item_plus">' + String.fromCharCode(215) + "</span>"), htmlArr.push('<span class="props_item_num">' + s + "</span></li>"), "1070001" == t ? e.prepend($(htmlArr.join(""))) : "1070002" == t && e.append($(htmlArr.join(""))))
}, updatePosition: function () {
    var t = this, i = this.propsOptions[this.propsObj.id].flashOptions, a = ($(window).height() - i.height) / 2;
    a = 150 > a ? 150 : a;
    var s = this.areaObj.jdom.offset().top - a;
    this.disabledMove = !0;
    var e = $(window).scrollTop();
    0 == e || e != this.currScrollTop || this.currAreaObj && this.currAreaObj.marginTop != this.areaObj.marginTop ? (this.currAreaObj = this.areaObj, this.currScrollTop = e, t.page.animate({scrollTop: s}, 300, "swing", function () {
        t.buildFlash(s)
    })) : t.buildFlash(s)
}, buildFlash: function (t) {
    var i = this, a = 0, s = 0, e = $('<div class="props_flash_wrap"></div>'), o = this.propsOptions[this.propsObj.id].flashOptions, r = ($(window).width() - o.width) / 2, p = t + o.marginTop;
    r = r > 0 ? r : 0, p = p > 0 ? p : 0, "0" == i.areaObj.propsType && "1070002" == i.propsObj.id && ("ihome" == PageData.product ? (a = 100, s = -15) : (a = 60, s = -20), r = r - (r + o.marginLeft - i.areaObj.jdom.offset().left) + a, p += s), e.css({width: o.width, height: o.height, left: r, top: p, "z-index": $.getzIndex()});
    {
        var n = "/tb/static-props/swf/" + this.propsObj.key + ".swf?t=140107";
        new $.swf(n, {container: e, width: o.width, height: o.height, params: {wmode: "transparent"}})
    }
    i.flashPool.push(e), i.$maskWrap.append(e), i.topzIndex = $.getzIndex(), i.$bulletLayer.css({"z-index": i.topzIndex})
}, buildPlusOne: function () {
    var t = this, i = "plusone_" + this.propsObj.key;
    $.browser.msie && 6 == $.browser.version && (i += "_png8"), i = "/tb/static-props/img/" + i + ".png";
    var a = $('<div class="props_plusone"><img src="' + i + '"/></div>'), s = 0, e = 0;
    "ihome" == PageData.product ? (s = t.areaObj.marginLeft + 70, e = t.areaObj.marginTop + 300) : (s = t.areaObj.marginLeft + (t.areaObj.marginRight - t.areaObj.marginLeft) / 2 - 18, e = t.areaObj.marginTop + 100), a.css({left: s, top: e, "z-index": t.topzIndex + 1}), t.$maskWrap.append(a), a.animate({top: "-=100px", opacity: .8}, 800, "swing", function () {
        a.remove()
    })
}, clearPool: function () {
    for (var t = this, i = t.flashPool, a = null, s = 0; s < i.length; s++)a = i.shift(), a.remove();
    t.disabledMove = !1
}, initFlashCallbacks: function () {
    var t = this, i = {}, a = null;
    i.finishPlay = function () {
        if (t.flashPool.length > 0) {
            t.buildPlusOne();
            var i = t.flashPool.shift();
            i.remove(), t.flashPool.length <= 0 && (t.disabledMove = !1, "0" == t.areaObj.propsType && ("ihome" == PageData.product ? a = t.areaObj.jdom.find(".userinfo_left") : "pb" == PageData.product && (a = t.areaObj.jdom.find(".icon_relative")), t.residual.showUI({wrap: a, key: t.propsObj.key})))
        }
    }, window.MagicProps = i
}, showTomallDialog: function () {
    var t = this, i = new $.dialog({title: "提示", html: '<div class="props_buy_dialog"><p class="buy_dialog_content">你目前没有可用的道具了，快去商城购买吧</p><a class="buy_dialog_link" target="_blank" href="' + t.mallurl + '">去购买>></a><div>', width: 400, height: 80});
    i.element.find(".buy_dialog_link").on("click", function () {
        t.clear(), setTimeout(function () {
            t.showBuyDialog(t.mallurl)
        }, 200)
    })
}, showBuyDialog: function (t) {
    var i = '<p class="buy_txt">道具购买成功后即可使用！</p><div class="buy_dialog_btns"><a href="#" class="ui_btn ui_btn_m btn_success"><span><em>购买成功</em></span></a><a href="#{href}" target="_blank"  class="ui_btn ui_btn_sub_m btn_failure"><span><em>购买失败，重新购买</em></span></a></div>', a = new $.dialog({title: "提示", html: $.tb.format(i, {href: $.tb.unescapeHTML(t)}), width: 400, height: 80});
    a.bind("onclose", function () {
        $.tb.location.reload()
    }), a.element.find(".btn_success").on("click", function (t) {
        t.preventDefault(), $.tb.location.reload()
    })
}}});
_.Module.define({path: "props/widget/Feedback", requires: [], sub: {initial: function (t) {
    this.dataObj = t, this.initOptions(), this.initCallbacks(), this.initData(), this.play()
}, initOptions: function () {
    this.options = {1070001: {id: "1070001", key: "worship", name: "膜拜", flashOptions: {width: 250, height: 220, marginLeft: 120, marginTop: 95}}, 1070002: {id: "1070002", key: "egg", name: "臭鸡蛋", flashOptions: {width: 410, height: 260, marginLeft: 195, marginTop: 30}}}
}, initData: function () {
    for (var t = this.dataObj.appraise || {}, i = null, e = null, a = [], n = ["1070001", "1070002"], s = 0; s < n.length; s++)i = t[n[s]], i && i.notice > 0 && (e = this.options[n[s]], $.extend(e, i), a.push(e));
    this.playList = a
}, play: function () {
    var t = this.playList;
    t.length > 0 && (t.sort(function (t, i) {
        return i.notice != t.notice ? i.notice - t.notice : parseInt(i.id) - parseInt(t.id)
    }), this.index = 0, this.buildFlash(), this.clearNotice())
}, buildFlash: function () {
    if (this.index < this.playList.length) {
        var t = $('<div class="props_flash_wrap"></div>');
        $("body").append(t);
        var i = this.playList[this.index], e = this.getFlashData(i);
        t.css({width: e.width, height: e.height, left: e.marginLeft, top: e.marginTop, "z-index": e.zindex});
        {
            var a = "/tb/static-props/swf/" + e.feedbackName + "?t=0101";
            new $.swf(a, {id: "props_flash_content", name: "props_flash_content", container: t, width: e.width, height: e.height, params: {wmode: "transparent"}})
        }
        i.wrap = t
    }
}, getFlashData: function (t) {
    var i = t.flashOptions, e = 0, a = 0, n = 0, s = 0, o = PageData.product;
    switch (o) {
        case"pb":
        case"frs":
            n = 40, e = $("#user_info").offset().left, a = $("#user_info").offset().top;
            break;
        case"ihome":
            n = 92, e = $("#userinfo_wrap").offset().left, a = $("#userinfo_wrap").offset().top;
            break;
        case"index":
            n = 45, e = $("div.user-wraper").offset().left, a = $("div.user-wraper").offset().top
    }
    e = e - i.marginLeft + n, a = a - i.marginTop + s;
    var r = t.notice > 1 ? "more" : "single";
    return feedbackName = "feedback_" + t.key + "_" + r + ".swf", {key: t.key, feedbackName: feedbackName, width: i.width, height: i.height, marginLeft: e, marginTop: a, zindex: $.getzIndex()}
}, clearNotice: function () {
    var t = "/tbmall/post/clearAppraiseNotice", i = {type: 0, tbs: PageData.tbs};
    $.tb.post(t, i, function (t) {
        t && 0 == t.no
    })
}, initCallbacks: function () {
    var t = this, i = {};
    i.finishPlay = function () {
        t.playList[t.index].wrap.remove(), t.index++, t.buildFlash()
    }, window.MagicProps = i
}}});
_.Module.define({path: "ihome/widget/Guide", sub: {initial: function () {
    PageData.user.is_login && this._buildDialog()
}, _buildDialog: function () {
    var i = $.cookie("IHOME_HD_TIP"), s = $.cookie("HD_TIPS_HAD");
    s || i || ($.cookie("IHOME_HD_TIP", 1, {expires: 1}), this._buildTip(), this._bindEvents())
}, _buildTip: function () {
    var i = [];
    i.push('<div id="tips_wrap" class="tips_wrap">'), i.push('<div class="tips_btns">'), i.push('<a class="tips_btn" target="_blank" href="/tb/zt/hd.html"></a>'), i.push('<a class="tips_btn tips_btn_last" target="_blank" href="/home/profile?ie=utf-8&un=' + encodeURIComponent(PageData.user.name) + '"></a>'), i.push("</div>"), i.push('<div class="tips_img"><img src="/tb/static-ihome/img/hd_tips_png24.png"/></div>'), i.push('<div class="tips_close">' + String.fromCharCode(215) + "</div>"), i.push("</div>"), this.modal = new $.modal({show: !0});
    $(i.join("")).css({"z-index": $.getzIndex()}).appendTo($("body"))
}, _bindEvents: function () {
    var i = this;
    $("#tips_wrap .tips_close").on("click", function () {
        $("#tips_wrap").remove(), i.modal.remove()
    })
}}});
_.Module.define({path: "spage/component/Popframe", requires: [], sub: {defaultConfig: {top: 0, left: 0, width: "auto", height: "auto", clsName: "", html: "", wrap: "body"}, initial: function () {
}, createFrame: function (e) {
    var o = this, t = $('<div style="position:absolute;z-index:1000;"></div>');
    return o._config = $.extend(o.defaultConfig, e), t.css({top: o._config.top, left: o._config.left, width: o._config.width, height: o._config.height}).addClass(o._config.clsName).html(o._config.html).appendTo(o._config.wrap), e.isForumDir && o.correctFramePosition(), t
}, correctFramePosition: function () {
    var e = $(".d-up-frame"), o = $(window).height(), t = e.height(), i = $(".f-d-item-hover").offset().top, c = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
    if (i >= c) {
        var n = i + t - (c + o);
        n > 0 && (o > t ? e.css("top", e.css("top").replace(/[^-\d\.]/g, "") - n) : e.css("top", e.css("top").replace(/[^-\d\.]/g, "") - 0 + c - i))
    } else e.css("top", e.css("top").replace(/[^-\d\.]/g, "") - 0 + c - i)
}}});
_.Module.define({path: "ihome/widget/tenYearsGroup", requires: [], sub: {initial: function (e) {
    var r = this;
    r.tenyear = e.tenyear, r.user = e.user, $(".share").on("click", function () {
        $.stats.track("单场景分享量", "个人中心tab页", "ihome", "view");
        var e = $(this).parent().siblings(".show_img"), r = e.parent().find(".btn > .share").tbattr("data-text"), t = (e.find("img").tbattr("src"), ""), a = $(this).tbattr("data-share").split("|"), n = "{" + a[0] + "," + a[1] + "}";
        return n = $.parseJSON(n.replace(/&quot;/g, '"').replace(/&lt;(br\/?)&gt;/g, "<$1>")), $("#share_loadding").css({display: "block"}), $.ajax({type: "POST", url: "/tenyear/getpic", data: "model=" + n.model + "&ie=utf-8&text=" + encodeURIComponent(n.text) + "&tbs=" + PageData.user.tbs, dataType: "json", success: function (e) {
            $("#share_loadding").css({display: "none"}), t = '{"text":"' + r + '","pic":"' + e.pic_url + '","url":"http://tieba.baidu.com/home/zuji"}', $("#bdshare").tbattr("data", t).find(".bds_more").trigger("click"), $("#bdshare .bds_more").trigger("mouseover").trigger("mouseenter")
        }, error: function () {
            $("#share_loadding").css({display: "none"}), new $.dialog({html: "服务器可能太忙了，请再试试吧~", title: "未知错误", draggable: !1, modal: !1})
        }}), !1
    }), $("#shareToOut").on("click", function () {
        return r._shareToOutCB(), !1
    }), $(".square .play").on("click", function () {
        var e = $(this).parent().parent().index();
        return $.cookie("currentShow", e, {expires: 999}), $.tb.location.setHref("/home/zuji"), !1
    })
}, _shareToOutCB: function () {
    var e = this, r = e._getStr().join("|");
    $("#share_loadding").css({display: "block"}), $.ajax({type: "POST", url: "/tenyear/getbigpic", data: "model=2&ie=utf-8&text=" + encodeURIComponent(r) + "&tbs=" + PageData.user.tbs, dataType: "json", success: function (e) {
        $("#share_loadding").css({display: "none"}), _shareInfo = '{"text":"一入贴吧深似海，从此节操喂度娘。还记得大明湖畔的那个TA吗？重温你的#贴吧足迹#，那些褪色的青春梦，普通得不能再普通，玩贴吧的你肯定懂。","pic":"' + e.pic_url + '","url":"http://tieba.baidu.com/home/zuji"}', $("#bdshare").tbattr("data", _shareInfo).find(".bds_more").trigger("click"), $("#bdshare .bds_more").trigger("mouseover").trigger("mouseenter")
    }, error: function () {
        $("#share_loadding").css({display: "none"}), new $.dialog({html: "服务器可能太忙了，请再试试吧~", title: "未知错误", draggable: !1, modal: !1})
    }})
}, _getStr: function () {
    var e = this, r = [], t = "", a = null;
    if (e.tenyear.reg_time ? (e.tenyear.reg_time.time && (t += "一入贴吧深似海，从此节操是路人。<br/>", a = new Date(e.tenyear.reg_time.time.replace(/-/g, "/")), t += "{" + a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日}，懵懂小白的你来到了百度贴吧<br/>从此开始了快乐的人森。贴吧十年，你已经见证了他{" + e.tenyear.reg_time.year + "年}的成长。<br/>"), t += e.tenyear.reg_time.year < 3 && e.tenyear.reg_time.year >= 0 ? "你们也许还不够熟悉，<br/>但是互相陪伴，<br/>已经成了习惯。" : e.tenyear.reg_time && e.tenyear.reg_time.year >= 3 && e.tenyear.reg_time.year < 7 ? "一起积累了太多回忆，<br/>悄然回首，<br/>才发现已经携手走了那么远的路。<br/>" : "七年之痒，<br/>也没有斩断你们的联系，<br/>或许你已把他当成了随时可以回来的家。") : t += "你来到贴吧的那一天，<br/>山峦摇动，<br/>沧海为之变色，<br/>时光静止在了二次元，<br/>电光火石间，<br/>开启了你传奇的贴吧人森。", r.push(t), t = "", a = null, e.tenyear.first_like_froum && e.tenyear.first_like_froum.forum_name ? (t += "亲爱的你，还记得大明湖畔的<br/>{" + e.tenyear.first_like_froum.forum_name + "}吗？<br/>", a = new Date(e.tenyear.first_like_froum.in_time.replace(/-/g, "/")), t += "{" + a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日}，<br/>你羞涩地对他按下了那个{我喜欢/关注}按钮。") : t += "是“万花丛中过，片叶不沾身”，<br/>还是“弱水三千，只取一瓢饮”，<br/>你始终未曾按下那个代表爱的宣告的按钮。<br/>", r.push(t), t = "", a = null, e.tenyear.first_time && e.tenyear.first_time.create_time ? (a = new Date(e.tenyear.first_time.create_time.replace(/-/g, "/")), t += "{" + a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日}，<br/>你在{" + e.tenyear.first_time.forum_name + "吧}发了第一个贴子<br/>", t += e.tenyear.first_time.first_replyme ? "当时是否战战兢兢，<br/>莫急莫急，<br/>专业2楼党{" + e.tenyear.first_time.first_replyme + "}<br/>迫不及待第一个回复了你的贴子。<br/>" : "人生总有遗憾，<br/>即使没人回复，<br/>心底仍记得最初的美好。") : t += "也曾踌躇满志，<br/>最终却欲言又止，<br/>第一贴不远，<br/>就在明天。", r.push(t), t = "", a = null, e.tenyear.first_time && e.tenyear.first_time.reply_to_user ? (a = new Date(e.tenyear.first_time.reply_create_time.replace(/-/g, "/")), t += "{" + a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日},<br/>", t += e.tenyear.first_time.reply_title >= 18 ? "在{" + $.subByte(e.tenyear.first_time.reply_title, 48, "...") + "}<br/>" : "在{" + e.tenyear.first_time.reply_title + "}<br/>", t += "也许是被卤煮的文字触动，<br/>也许只是为了挽尊，<br/>你第一次回复了吧友{" + e.tenyear.first_time.reply_to_user + "}的贴子") : t += "你是贴吧沉默的大多数，<br/>不发一言<br/>只是沉静地注视<br/>一页一页<br/>如同穿越了一整座城市", r.push(t), t = "", a = null, t += e.tenyear.user_count && e.tenyear.user_count.good_num ? "恰同学少年，意气风发才气高。<br/>埋头贴吧数载，您已经有{" + e.tenyear.user_count.good_num + "}篇贴子，<br/>经过众吧友火眼金睛，获得交口称赞，<br/>认真出品，必属精品。" : "每个贴子背后都有辛酸挫折，<br/>之所以活得洒脱是因为懂得取舍，<br/>无所谓精品，<br/>贴吧仍有你的传说。", r.push(t), t = "", a = null, t += e.tenyear.data_reply_count ? "慧眼识英才，<br/>火钳刘明来。<br/>{" + e.tenyear.data_reply_count + "}个火红火红的热贴中留下了你的足迹，<br/>他火了，<br/>你也就火了" : "热贴，只是一群人的孤单，<br/>灯火阑珊处，<br/>佳人共剪烛。", r.push(t), t = "", a = null, t += e.tenyear.data_2_lou_count ? "神秘的二楼，<br/>多少人为其争抢得头破血流，<br/>你冲锋陷阵，<br/>只为博她一笑，<br/>一共获得{" + e.tenyear.data_2_lou_count + "}次的2楼女神回眸。" : "女神之美，<br/>可远观不可亵玩焉。<br/>你不争不抢，看她一眼足矣。", r.push(t), t = "", a = null, t += e.tenyear.data_thread_pic_count ? "贴吧有神，其名度娘。<br/>度娘之奇，奇于吞楼不知何为也。<br/>以图镇之，保此楼扶摇而上九万楼也。<br/>截止到度娘十年纪，你已镇楼{" + e.tenyear.data_thread_pic_count + "}次" : "贴吧有神，其名度娘。<br/>度娘之奇，奇于吞楼不知何为也。<br/>镇楼0次，无图亦无谓，<br/>既吞之，则补之。", r.push(t), t = "", a = null, t += e.tenyear.most_like_froum ? "守护一个吧如同经营一个家，<br/>从最初的懵懂到如今的成熟，<br/>风风雨雨中（水水更健康中），<br/>在{" + e.tenyear.most_like_froum.forum_name + "吧}的这个大家庭里，<br/>你已经是{" + e.tenyear.most_like_froum.level_id + "}级的前辈了。" : "你习惯了浪迹天涯<br/>习惯了一个人遮风挡雨，<br/>偌大贴吧，<br/>有一个港湾正在等着你靠岸。", r.push(t), t = "", a = null, e.tenyear.user_count && e.tenyear.user_count.thread_num) {
        var n = e.tenyear.user_count.thread_num + e.tenyear.user_count.post_num;
        t += "贴吧十年编年史之{" + e.user.name + "}传记书<br/>累积到现在，您在贴吧总共发贴{" + n + "}篇，<br/>其中回贴数{" + e.tenyear.user_count.post_num + "}篇<br/>按贴吧常理“我不会告诉你这就是标准的十五字”推算", t += e.tenyear.user_count.word_num < 1e3 ? "寥寥不到{" + e.tenyear.user_count.word_desc + "}字，<br/>相当于{" + e.tenyear.user_count.word_desc1 + "}的《儿歌三百首》。" : e.tenyear.user_count.word_num < 5e4 ? "已经有了{" + e.tenyear.user_count.word_num + "}字，<br/>相当于{" + e.tenyear.user_count.word_desc1 + "}的《儿歌三百首》。" : "已经有了{" + e.tenyear.user_count.word_num + "}字，<br/>相当于{" + e.tenyear.user_count.word_desc1 + "}史记。"
    } else t += "贴吧十年编年史之" + e.tenyear.uid + "传记书<br/>皑皑如雪的白纸，<br/>你还未想好如何着笔，<br/>斟词酌句，细细思量，<br/>你是什么样，<br/>你的世界就是什么样。<br/>";
    return r.push(t), t = "", a = null, r
}}});
_.Module.define({path: "common/widget/ScrollPanel", sub: {dom: null, $content: null, $scrollBar: null, $scrollButton: null, _hasScroll: false, _scrollStep: 50, _scrollTop: 0, _maxHeight: 0, initial: function (a) {
    this._buildUI(a);
    this._bindEvents(a);
    $(a.container).append(this.dom);
    this.setHeight(a.height || 100);
    if (a.content) {
        this.setContent(a.content)
    }
    if (a.scrollBarShow) {
        this.bind("onScrollBarShow", a.scrollBarShow)
    }
    if (a.scrollBarHide) {
        this.bind("onScrollBarHide", a.scrollBarHide)
    }
}, _buildUI: function (b) {
    var a = this, c = {left: 0, top: 0};
    this.dom = $('<div class="tbui_scroll_panel"></div>');
    this.dom.html(['<div class="tbui_panel_content j_panel_content clearfix"><ul></ul></div>', '<div class="tbui_scroll_bar j_scroll_bar">', '<div class="tbui_scroll_button j_scroll_button">&nbsp;</div>', "</div>"].join(""));
    this.$content = this.dom.find(".j_panel_content:first");
    this.$scrollBar = this.dom.find(".j_scroll_bar:first");
    this.$scrollButton = this.dom.find(".j_scroll_button:first");
    if (b.padding) {
        this.$content.css("padding", b.padding)
    }
}, _bindEvents: function (b) {
    var a = this, c = a.$content.get(0);
    this.$scrollButton.on("drag", function (d, e) {
        if (!e) {
            return
        }
        var f = e.position;
        c.scrollTop = f.top / a.$content.height() * c.scrollHeight
    });
    this.$content.mousewheel(function (d, e) {
        d.preventDefault();
        d.stopPropagation();
        if (!a._hasScroll) {
            return
        }
        a.scrollTopTo(a._scrollTop - e * a._scrollStep)
    })
}, scrollTopTo: function (c) {
    var a = this, b = a.$content.get(0);
    var c = Math.max(Math.min(c, b.scrollHeight - a.$content.height()), 0);
    if (c == a._scrollTop) {
        return
    }
    a._scrollTop = c;
    a.$content.stop();
    a.$content.scrollTop(a._scrollTop);
    a._resizeScroll()
}, setHeight: function (a) {
    this._maxHeight = a;
    this._resizeHeight();
    this._resizeScroll();
    this.$scrollButton.draggable({containment: "parent"})
}, setContent: function (a) {
    this.$content.html(a);
    this.$content.get(0).scrollTop = this._scrollTop = 0;
    this._resizeHeight();
    this._resizeScroll()
}, appendContent: function (a) {
    this.$content.append(a);
    this._resizeHeight();
    this.scrollTopTo(20000)
}, clearContent: function () {
    this.setContent("")
}, _resizeHeight: function () {
    this.$content.css("height", "");
    var b = this.$content.get(0), c = b.scrollHeight, a = Math.min(c, this._maxHeight);
    this.$content.css("height", a)
}, _resizeScroll: function () {
    var c = this.$content.get(0), d = c.scrollHeight, b = c.scrollTop, a = this.$content.innerHeight();
    if (d <= a) {
        this.$scrollBar.hide();
        this.dom.addClass("tbui_no_scroll_bar");
        this.trigger("onScrollBarHide");
        this._hasScroll = false
    } else {
        this.$scrollBar.show();
        this.$scrollBar.height(a);
        this.$scrollButton.height(a / d * a);
        this.$scrollButton.css("top", b / d * a);
        this.trigger("onScrollBarShow");
        this._hasScroll = true
    }
}}});
_.Module.define({path: "common/component/OftenVisitingForum", requires: [], sub: {initial: function (e) {
    this._forumNums = e.forumNums, this._likedForums = e.likedForums, this._likeForumWrapper = e.likeForumWrapper, this._moreForum = e.moreForum, this._addMoreForum = e.addMoreForum, this._itbs = e.itbs
}, showOftenForum: function () {
    var e = this;
    $.JsLoadManager.use("http://static.tieba.baidu.com/tb/cms/itieba/oftenforum_jsdata.js", function () {
        e._setDialog = new $.dialog({width: 700, html: e._getAddForumContent(), title: "添加常逛的吧", draggable: !1, fixed: !1}), e._setDialog.bind("onclose", function () {
            e.sign_card && e.sign_card._j_card.hide()
        }), e._bindDialogEvent()
    })
}, _bindDialogEvent: function () {
    var e = this, i = this._setDialog.element;
    this._scroll_forum = i.find(".ordered_col"), i.find(".dialogJcontent").css("padding", "0"), i.delegate(".s_add_btn", "click", function (i) {
        i.preventDefault(), e._addLikeForum($("#s_add_inp").val().trim(), !0)
    }), this._scroll_forum.delegate("a", "click", function (i) {
        i.preventDefault(), "1" == $(this).data("likeflag") ? e._showConfirmDelConcernForumTip($(this)) : e._deleteLikedForum($(this))
    }), i.find(".l_add").delegate("a", "click",function (i) {
        i.preventDefault(), e._changeLikedForum($(this))
    }).delegate(".icon_addEd", "mouseover mouseout", function (i) {
        e._showUnlikeTip(i)
    }), i.tbattr("alog-alias", "like_dialog"), e._checkScroll()
}, _checkScroll: function () {
    var e = this._scroll_forum;
    e.innerHeight() > 90 ? e.addClass("scrollYOver") : e.removeClass("scrollYOver")
}, _addLikeForum: function (e, i, a) {
    var t = this;
    if (i && e.length <= 0)$("#s_add_tip").html("请输入吧名~"); else {
        var d = "/i/submit/add_user_favoforum?_t=" + (new Date).getTime(), o = {ie: "utf-8", kw: e, tbs: this._itbs};
        $.post(d, o, function (e) {
            o = $.parseJSON(e), o && (0 == o.error_no ? t._addLikeForumSuc(a, o.ret.add_forum[0]) : t._addLikeForumFail(a, o.error_no, o._info))
        })
    }
}, _addLikeForumSuc: function (e, i) {
    var a = this;
    if (e) {
        var t = '<div class="j_success_tiplayer success_tiplayer"><span class="success_tiptext">已成功添加</span></div>';
        $(e).prepend(t), $(e).find(".j_success_tiplayer").animate({top: "-32px", height: "29px"}, 100), $(e).find(".j_success_tiplayer").delay(2e3).animate({top: "-45px", height: "0"}, {duration: 80, complete: function () {
            $(e).find(".j_success_tiplayer").remove()
        }}), e.addClass("icon_addEd").tbattr("data-type", 1)
    } else $("#s_add_tip").text("添加成功").removeClass("like_fail").addClass("like_succ"), setTimeout(function () {
        $("#s_add_tip").text("").removeClass("like_succ")
    }, 3e3), a._setDialog.element.find("a[data-fid=" + i.forum_id + "]").addClass("icon_addEd");
    a._likedForumInfo[i.forum_id] = i, a._likedForums.unshift(i);
    var d = '<a data-fid="' + i.forum_id + '" data-likeflag="' + i.is_like + '" data-fname="' + i.forum_name + '" data-type="' + i.forum_type + '" href="#">' + i.forum_name.subByte(10, "") + "吧</a>";
    a._setDialog.element.find(".ordered_col").prepend(d);
    var o = a._likedForums.length;
    a._likeForumWrapper.trigger("addForum", [i, o])
}, _addLikeForumFail: function (e, i, a) {
    var t = "", d = this;
    switch (i) {
        case 29:
            t = "该吧找不到，请输入其他吧试试~";
            break;
        case 10:
            t = "你还未填写用户名，请点击页面右上角个人中心填写用户名~";
            break;
        case 36:
            t = "该吧已在【我爱逛的贴吧】列表里！";
            break;
        default:
            t = a
    }
    e ? d._showAlert(t) : ($("#s_add_tip").text(t).removeClass("like_succ").addClass("like_fail"), setTimeout(function () {
        $("#s_add_tip").text("").removeClass("like_fail")
    }, 3e3))
}, _deleteLikedForum: function (e) {
    var i = this, a = (e.tbattr("data-fid"), e.tbattr("data-fname")), t = e.tbattr("data-type"), d = "/i/submit/del_concernforum?stamp=" + (new Date).getTime(), o = e.tbattr("data-likeflag"), s = {tbs: this._itbs, fname: a, forum_type: t, is_like: o, ie: "utf-8"};
    $.post(d, s, function (a) {
        s = $.parseJSON(a), s && 0 == s.error_no ? i._delLikeForumSuc(e) : i._showAlert("删除失败")
    })
}, _delLikeForumSuc: function (e) {
    var i = e.tbattr("data-fid"), a = this._setDialog.element;
    this._likedForumInfo[i] && delete this._likedForumInfo[i];
    for (var t = this._likedForums, d = 0; d < t.length; d++)t[d].forum_id == i && this._likedForums.splice(d, 1);
    a.find(".icon_addEd[data-fid=" + i + "]").removeClass("icon_addEd").find(".j_unliketip").remove(), a.find(".ordered_col").find("a[data-fid=" + i + "]").remove(), this._checkScroll();
    var o = this._likedForums[this._forumNums - 1], s = this._likedForums.length;
    this._likeForumWrapper.trigger("delForum", [i, o, s])
}, _changeLikedForum: function (e) {
    var i = this, a = e.tbattr("data-fname");
    e.hasClass("icon_addEd") ? i._deleteLikedForum(e) : i._addLikeForum(a, !1, e)
}, _showAlert: function (e) {
    var i = '<div style="padding:20px 20px; text-align:center; line-height:20px;font-size:13px;">' + e + "</div>";
    $.dialog.open(i, {title: "操作失败", width: 380})
}, _getAddForumContent: function () {
    if (ofJSData) {
        var e = this;
        e._likedForumInfo = {};
        var i = ofJSData.featTieba.data.feat, a = ofJSData.catagTieba.data.feat, t = this._likedForums, d = t.length, o = "", s = 0;
        if (o += '<div class="l_col ordered_col like_col often_forum clearfix" alog-group="like_col">', d > 0)for (var r = 0; d > r; r++) {
            s = t[r];
            var n = s.level_id ? "1" : "0";
            -1 != s.forum_id && (e._likedForumInfo[s.forum_id] = s, o += '<a href="#" data-type="' + s.forum_type + '" title="' + ($.tb.getByteLength(s.forum_name) > 10 ? s.forum_name : "") + '"data-likeflag="' + n + '" data-fname="' + s.forum_name + '" data-fid="' + s.forum_id + '">' + s.forum_name.subByte(10, "..") + "吧</a>")
        }
        o += "</div>", o += '<div class="like_col s_add clearfix"  alog-group="like_add"><div class="s_add_left">吧名称:</div><div class="s_add_right"><input type="text" id="s_add_inp" class="s_add_inp"><a class="s_add_btn round_extral_for_btn" href="#">添加</a></div><span class="s_add_tip" id="s_add_tip">添加爱逛的吧，时刻关注最新动态</span></div>', o += '<div class="l_add l_like" alog-group="like_jingxuan"><div class="layer_hd"><span>贴吧精选</span></div><div class="l_col add_col add_col_top clearfix">';
        for (var l = i.length, r = 0; l > r; r++)s = i[r], o += '<a href="#" data-fname="' + s.name + '" data-fid="' + s.id + '" ' + (e._likedForumInfo[s.id] ? 'class="icon_addEd" data-type="' + e._likedForumInfo[s.id].forum_type + '"' : "") + ">" + s.name.subByte(12, "..") + "</a>";
        o += '</div><div class="layer_hd"><span>分类精选</span></div><div class="l_col add_col  clearfix">', l = a.length;
        for (var r = 0; l > r; r++) {
            o += '<div class="l_class"><span>' + a[r].catag + "</span>";
            for (var _ = a[r].items, c = _.length, u = 0; c > u && !(u >= 5); u++)s = _[u], o += '<a href="#" data-fname="' + s.name + '" data-fid="' + s.id + '" ' + (e._likedForumInfo[s.id] ? 'class="icon_addEd" data-type="' + e._likedForumInfo[s.id].forum_type + '"' : "") + ">" + s.name.subByte(12, "..") + "</a>";
            o += "</div>"
        }
        return o += "</div>"
    }
}, _showUnlikeTip: function (e) {
    var i = '<div class="j_unliketip unliketip"><span class="unliketip_text">点击取消</span></div>';
    e = e || window.event;
    var a = e.target || e.srcElement;
    "mouseover" === e.type ? ($(a).prepend(i), $(a).find(".j_unliketip").stop(!0, !0).animate({top: "-32px", height: "35px"}, 100)) : $(a).find(".j_unliketip").stop(!0, !0).animate({top: "-40px", height: "0"}, {duration: 80, complete: function () {
        $(a).find(".j_unliketip").remove()
    }})
}, _showConfirmDelConcernForumTip: function (e) {
    var i = this;
    e = e || window.event, $("body").find("#tb_card_confirm_del").remove();
    var a = '<div class="confirmJ"><div class="confirmWrapper"><div class="confirmJContent"><span>删除后，也会同步取消对该吧的关注！</span></div><div class="confirmJAnswers"> <a href="#" class="ui_btn ui_btn_s btn_extral"><span><em>确定</em></span></a> <a href="#" class="ui_btn ui_btn_sub_s"> <span><em>取消</em></span></a></div></div></div>', t = $(e).offset().top + 29, d = $(e).offset().left - 34;
    _.Module.use("common/component/Card", [
        {content: a, arrow_dir: "up", card_css: {width: 250, top: t, left: d}, attr: 'id="tb_card_confirm_del"', card_leave_hide: !0}
    ], function (a) {
        i.sign_card = a, i._bindConfirmDelEvent(e), a.showCard()
    })
}, _bindConfirmDelEvent: function (e) {
    var i = this;
    $(".confirmJAnswers .ui_btn_s").on("click", function (a) {
        a.preventDefault(), i.sign_card && i.sign_card._j_card.hide(), i._deleteLikedForum(e)
    }), $(".confirmJAnswers .ui_btn_sub_s").on("click", function (e) {
        e.preventDefault(), i.sign_card && i.sign_card._j_card.hide()
    })
}}});
_.Module.define({path: "ihome/widget/forumGroup", requires: ["spage/component/Popframe", "common/widget/ScrollPanel", "common/component/OftenVisitingForum"], sub: {initial: function (e) {
    this._forumStart = 7, this._forumArr = e.forumArr, this.popFrame = this.use("spage/component/Popframe"), this._isMine = e.ihome.is_mine, this._itb_tbs = e.user.itb_tbs, this._likeForumWrapper = $("#forum_group_wrap"), this._isIe6 = $.browser.msie && 6 == $.browser.version ? !0 : !1, this._showMoreBtn = this._likeForumWrapper.find(".j_show_more_forum"), this._addMoreBtn = this._likeForumWrapper.find(".j_add_more_forum"), this._bindEvents(), this._timmer = null, this._oftenVisitingForum = this.use("common/component/OftenVisitingForum", {forumNums: this._forumStart, likedForums: this._forumArr, likeForumWrapper: this._likeForumWrapper, moreForum: this._showMoreBtn, addMoreForum: this._addMoreBtn, itbs: this._itb_tbs})
}, _bindEvents: function () {
    var e = this;
    e._showMoreBtn.click(function () {
        e.moreForumFrame ? e._showMoreBtn.hasClass("more-hover") ? (e._showMoreBtn.removeClass("more-hover"), e._showMoreBtn.find(".j_text").text("展开"), e.moreForumFrame && e.moreForumFrame.hide()) : (e._showMoreBtn.addClass("more-hover"), e._showMoreBtn.find(".j_text").text("收起"), e._isIe6 || $("div.j_panel_content").empty().html(e._fillAlwaysForum()), e.moreForumFrame.show()) : (e._showMoreBtn.find(".j_text").text("收起"), e._moreAlwaysForum($(this)), e._isIe6 || e.use("common/widget/ScrollPanel", {container: "#forumscontainer", height: 180, content: e._fillAlwaysForum()}), $("#alwayforum-wraper").on("click", "a.j_add_more_forum", function (r) {
            r.preventDefault(), e._oftenVisitingForum.showOftenForum()
        }))
    }), e._addMoreBtn.bind("click", function (r) {
        r.preventDefault(), e._oftenVisitingForum.showOftenForum()
    }), e._likeForumWrapper.bind("addForum", function (r, o) {
        var t = $(this).find("a");
        t.length == e._forumStart && $(t.get(e._forumStart - 1)).remove();
        var i = o.is_sign ? "sign" : "unsign", s = "lv";
        s += o.level_id ? o.level_id : "";
        var m = '<a data-fid="' + o.forum_id + '" target="_blank" class="u-f-item ' + i + '" title="' + o.forum_name + '"  href="/f?kw=' + encodeURIComponent(o.forum_name) + '&fr=home&fp=0&ie=utf-8">' + o.forum_name.subByte(10, "") + '<span class="forum_level ' + s + '"></span></a>';
        $(this).prepend(m)
    }), e._likeForumWrapper.bind("delForum", function (r, o, t, i) {
        var s = $(this).find("a[data-fid=" + o + "]");
        if (0 !== s.length && (s.remove(), i > e._forumStart)) {
            var m = t.is_sign ? "sign" : "unsign", n = "lv";
            n += t.level_id ? t.level_id : "";
            var a = '<a data-fid="' + t.forum_id + '" target="_blank" class="u-f-item ' + m + '" title="' + t.forum_name + '"  href="/f?kw=' + encodeURIComponent(t.forum_name) + '&fr=home&fp=0&ie=utf-8">' + t.forum_name.subByte(10, "") + '<span class="forum_level ' + n + '"></span></a>';
            $(this).append(a)
        }
    })
}, _moreAlwaysForum: function (e) {
    var r, o, t, i = this, s = "", m = e, n = this._showMoreBtn.offset();
    m.addClass("more-hover"), r = n.top + e.height(), o = n.left, t = 190, s += '<div id="alwayforum-wraper">', s += '<div class="always-forum-item clearfix" id="forumscontainer">', this._isIe6 && (s += this._fillAlwaysForum()), s += "</div>", s += "</div>", this.moreForumFrame = this.popFrame.createFrame({top: $.browser.msie ? r - 2 : r - 1, left: o - 535, width: 715, height: $.browser.msie ? t - 1 : t + 1, clsName: "pop-up-frame", html: s, wrap: "body"}), $(document).keyup(function (e) {
        27 == e.keyCode && (m.removeClass("more-hover"), i._showMoreBtn.find(".j_text").text("展开"), i.moreForumFrame && i.moreForumFrame.hide())
    })
}, _fillAlwaysForum: function () {
    for (var e, r, o, t = "", i = this._forumStart, s = this._forumArr.length; s > i; i++)e = this._forumArr[i], r = e.is_sign ? "sign" : "unsign", o = "lv", o += e.level_id ? e.level_id : "", t += '<a data-fid="' + e.forum_id + '" title="' + e.forum_name + '" locate="like_forums#ihome_v1" target="_blank" class="u-f-item ' + r + '" href="/f?kw=' + encodeURIComponent(e.forum_name) + '&fr=home&fp=0&ie=utf-8">' + e.forum_name.subByte(10, "") + (e.honor ? '<span class="cut_line">|</span><span class="honor">' + e.honor + "</span>" : "") + '<span class="forum_level ' + o + '"></span></a>';
    return this._isMine && (t += '<a href="#" title="点击添加常逛的吧" class="u-f-item add-more-forum j_add_more_forum"></a>'), t
}}});