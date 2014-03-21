/*
 combined files :

 dragdrop

 */
/**
 * @module  dragdrop
 * @author  ziya@gmail.com
 */
KISSY.add('dragdrop', function(S) {
    var Event = S.Event, DOM = S.DOM, doc = document, win = window,
        defConfig = {
            axis: 0,
            region:false,
            handle:false,
            not:false,
            revert:false,
            snap : false,
            scroll:false,
            lock : false,
            circular:false,
            multi:false,
            resize:false,
            proxy:false,
            delay:false,
            resizefn:false,
            cursor:false
        },

        /**
         * static date
         */
            lock = false,

        /**
         * 初始化
         */
            drag = function(elem, config) {
            var _elem = elem;
            var elem = S.makeArray(S.query(elem)), self = this,
                config = S.merge(defConfig, config || {});
            S.each(elem, function(elem) {
                self._init(elem, config, _elem);
            });
        },

        /**
         * 不超出范围
         */
            getRestriction = function(n, min, max) {
            return (n > max ? max : n < min ? min : n);
        },


        /**
         * 第一次坐标
         */
            getOriginal = function(elem) {
            var position = DOM.css(elem, 'position'),original;
            if (position.toLowerCase() == 'absolute') {
                original = [elem.offsetLeft , elem.offsetTop];
            } else if (position.toLowerCase() == 'relative') {
                original = [parseInt(DOM.css(elem, 'left')) || 0, parseInt(DOM.css(elem, 'top')) || 0];
            }
            return original;
        },

        setXY = function(elem, config, axis, current, original) {
            if (axis.toLowerCase() === 'left') {
                var OFFSET = 'offsetWidth',dir1 = 3 ,dir2 = 1;
                if (S.UA.ie) OFFSET = "clientWidth";
            } else {
                var OFFSET = 'offsetHeight', dir1 = 0 ,dir2 = 2,OFFSET2 = 'clientHeight';
                if (S.UA.ie) OFFSET = "clientHeight";
            }
            if (config.region) {
                num = getRestriction(parseInt(elem.style[axis]) + current, config.region[dir1], config.region[dir2]);
            }
            else {
                num = parseInt(elem.style[axis]) + current;
            }
            return num;
        },

        setScroll = function(elem, axis, current) {
            if (axis.toLowerCase() === 'left') {
                if (S.UA.ie) {
                    num = getRestriction(parseInt(elem.style[axis]) + current, 0, S.DOM.viewportWidth() - elem.clientWidth - 2);
                } else {
                    num = getRestriction(parseInt(elem.style[axis]) + current, 0, S.DOM.viewportWidth() - elem.clientWidth - 2 - 17);
                }

            } else {
                num = getRestriction(parseInt(elem.style[axis]) + current, parseInt(elem.style[axis]) - parseInt(DOM.offset(elem).top) + (doc.documentElement.scrollTop || doc.body.scrollTop), 99999);
            }

            return num;
        },

        isFilter = function(target, filter) {

            if (S.isArray(filter)) {
                for (var i = 0; i < filter.length; i++) {
                    if (DOM.hasClass(target, filter[i].substr(1))) return true;
                }
            } else {
                if (DOM.hasClass(target, filter.substr(1))) return true;
            }

        },

        _clone = function(elem) {
            var _clone = elem.cloneNode(true);
            doc.body.appendChild(_clone);
            return _clone;
        }

    setRegion = function(elem, region) {
        region[0] = parseInt(DOM.css(elem, 'top')) - region[0];
        region[1] = parseInt(DOM.css(elem, 'left')) + region[1];
        region[2] = parseInt(DOM.css(elem, 'top')) + region[2];
        region[3] = parseInt(DOM.css(elem, 'left')) - region[3];
        return region;
    };

    S.augment(drag, {
        _init:function(elem, config, _elem) {

            var currentX,currentY,diffX,diffY,proxy = false,oldElem = false,
                self = this, isdrag = false, snap = config.snap,
                original = [0,0];

            /**
             * 设置 region
             */
            (function() {
                var isRegion = false;
                // 当region为 '#box' 的情况
                if (S.isString(config.region) && config.region.toLowerCase() != "scroll") {
                    var region = DOM.get(config.region);
                    config.region = [
                        DOM.offset(elem).top - DOM.offset(region).top,
                        (DOM.offset(region).left + region.offsetWidth) - (DOM.offset(elem).left + elem.offsetWidth),
                        (DOM.offset(region).top + region.offsetHeight) - (DOM.offset(elem).top + elem.offsetHeight),
                        DOM.offset(elem).left - DOM.offset(region).left
                    ];
                    isRegion = true;
                }
                // 不超出页面边界
                else if (S.isString(config.region) && config.region.toLowerCase() == "scroll") {
                    config.region = [
                        DOM.offset(elem).top,
                        doc.documentElement.clientWidth - DOM.offset(elem).left - elem.offsetWidth,
                        doc.documentElement.clientHeight - DOM.offset(elem).top - elem.offsetHeight,
                        DOM.offset(elem).left
                    ];
                    isRegion = true;
                }
                //自行拟定范围的时候 [50,100,200,20]
                else if (config.region.length == 4 && S.isArray(config.region)) {
                    //isRegion = true;
                }
                if (isRegion) {
                    setRegion(elem, config.region);
                }
                isRegion = false;
            })();


            if (config.circular) {
                var centerX = getOriginal(elem, config)[0] + config.circular + 30,
                    centerY = getOriginal(elem, config)[1] + 30;
            }


            /**
             * mousedown
             */
            var _down = function(e) {
                    if (config.islock) {
                        lock = true;
                    }
                    if (config.not && isFilter(e.target, config.not)) return;

                    //拖动开关
                    isdrag = true;
                    //原始坐标
                    original = getOriginal(elem);

                    diffX = e.clientX;
                    diffY = e.clientY;

                    if (!proxy && config.proxy) {
                        oldElem = elem;
                        proxy = _clone(elem);
                        elem = proxy;
                    }

                    DOM.css(elem, 'left', original[0] + "px");
                    DOM.css(elem, 'top', original[1] + "px");
                    if (config.cursor) {
                        DOM.css(elem, 'cursor', config.cursor);
                    }
                    self.onStartDrag && self.onStartDrag(e, elem, config);
                },
                /**
                 * mousemove
                 */
                    _move = function(e) {

                    if (!isdrag || self.isLock(config)) return;

                    currentX = e.clientX - diffX;
                    currentY = e.clientY - diffY;

                    /**
                     * 原形轨道路径移动
                     */
                    if (config.circular) {
                        angle = Math.atan2(e.clientX - centerX, e.clientY - centerY);
                        DOM.css(elem, 'left', centerX + Math.sin(angle) * config.circular - 30 + "px");
                        DOM.css(elem, 'top', centerY + Math.cos(angle) * config.circular - 30 + "px");
                    }
                    else if (config.snap) {
                        DOM.css(elem, 'left', parseInt(elem.style.left) + Math.round(currentX / snap[0]) * snap[0] + "px");
                        DOM.css(elem, 'top', parseInt(elem.style.top) + Math.round(currentY / snap[1]) * snap[1] + "px");
                        diffX = diffX + Math.round(currentX / snap[0]) * snap[0];
                        diffY = diffY + Math.round(currentY / snap[1]) * snap[1];
                    }
                    /**
                     * 拖动放大缩小
                     */
                    else if (config.resize) {

                        var w = parseInt(DOM.css(elem, 'width')), h = parseInt(DOM.css(elem, 'height'));
                        if (config.resizefn[0]) {
                            if (Math.max(20, w + currentX) > config.resizefn[0]) {
                                if (currentX > 0 && (e.clientX <= parseInt(DOM.offset(elem).left) + w)) currentX = 0;
                                DOM.css(elem, 'width', Math.max(20, w + currentX) + "px");
                            }
                        }
                        if (config.resizefn[1]) {
                            if (Math.max(20, h + currentY) > config.resizefn[1]) {
                                if (currentY > 0 && (parseInt(e.clientY) <= parseInt(DOM.offset(elem).top) + h - parseInt(doc.documentElement.scrollTop || doc.body.scrollTop))) {
                                    currentY = 0;
                                } else {
                                    DOM.css(elem, 'height', Math.max(20, h + currentY) + "px");
                                }

                            }
                        }

                        diffX = e.clientX;
                        diffY = e.clientY;

                    } else if (config.scroll) {
                        if (config.axis != 'y') {
                            DOM.css(elem, 'left', setScroll(elem, 'left', currentX) + 'px');
                        }
                        if (config.axis != 'x') {
                            DOM.css(elem, 'top', setScroll(elem, 'top', currentY) + 'px');
                        }
                        diffX = e.clientX;
                        diffY = e.clientY;
                    } else {
                        if (config.multi && DOM.hasClass(elem, 'ks-multi')) {
                            var elemArr = S.makeArray(S.query(".ks-multi"));
                            if (elemArr == 0) {
                                elemArr = [elem];
                            }
                        } else {
                            elemArr = [elem];
                        }
                        S.each(elemArr, function(elem) {
                            if (config.axis != 'y') {
                                DOM.css(elem, 'left', setXY(elem, config, 'left', currentX, original) + 'px');
                            }
                            if (config.axis != 'x') {
                                DOM.css(elem, 'top', setXY(elem, config, 'top', currentY, original) + 'px');
                            }
                        });

                        diffX = e.clientX;
                        diffY = e.clientY;
                    }
                    //chrome下拖动时选中文字bug
                    if (S.UA.chrome) {
                        Event.on(document, 'selectstart', function(e) {
                            e.halt();
                        });
                    }
                    win.getSelection ? win.getSelection().removeAllRanges() : doc.selection.empty();
                    self.onDrag && self.onDrag(e, elem, config, currentX, currentY, _elem);
                },


                /**
                 * mouseup
                 */
                    _up = function(e) {
                    if (isdrag != true) return;
                    isdrag = false;
                    Event.remove(doc, 'mousemove', _move);
                    win.getSelection ? win.getSelection().removeAllRanges() : doc.selection.empty();

                    if (proxy && config.proxy) {
                        DOM.css(oldElem, 'left', parseInt(proxy.style.left) + "px");
                        DOM.css(oldElem, 'top', parseInt(proxy.style.top) + "px");
                        elem = oldElem;
                        proxy.parentNode.removeChild(proxy);
                        proxy = false;
                        oldElem = false;
                    }

                    //回到原坐标,动画s需要anim支持
                    if (config.revert) {
                        DOM.css(elem, 'left', original[0] + "px");
                        DOM.css(elem, 'top', original[1] + "px");
                    }
                    if (config.cursor) {
                        DOM.css(elem, 'cursor', 'default');
                    }
                    self.onEndDrag && self.onEndDrag(e, elem, config);
                    if (S.UA.chrome) {
                        Event.remove(document, 'selectstart');
                    }
                },

                _dblclick = function(e) {
                    if (!DOM.hasClass(elem, 'ks-multi')) {
                        DOM.addClass(elem, 'ks-multi');
                    } else {
                        DOM.removeClass(elem, 'ks-multi');
                    }
                };

            /**
             * 绑定mousedown,mousemove,mouseup;
             */
            Event.add(S.get(config.handle, elem) || elem, 'mousedown', function(e) {
                _down(e);
                Event.add(doc, 'mousemove', _move);
            });

            Event.add(doc, 'mouseup', _up);
//			if(S.UA.ie){
//				Event.add(elem, "losecapture", _up);
//				elem.setCapture(true);
//			}

            if (config.multi) {
                Event.add(elem, 'dblclick', _dblclick);
            }


        },
        onStartDrag:null,onDrag:null,onEndDrag:null,

        isLock : function() {
            return lock;
        }
    });

    S.Drag = drag;
    function intersectRect(aLeftTopX, aLeftTopY, aRightBottomX, aRightBottomY, bLeftTopX, bLeftTopY, bRightBottomX, bRightBottomY) {
        if (bLeftTopX >= aRightBottomX || bLeftTopY >= aRightBottomY
            || bRightBottomX <= aLeftTopX || bRightBottomY <= aLeftTopY) {
            return false;
        } else {
            return true;
        }
    }

    S.Drag.intersectRect = intersectRect

});

/**
 * @module TDog Web WangWang
 * 分工：玉伯负责
 */
var TDog = (function(S){
    var DOM = S.DOM,T = TStart,
        win = window,
        appId = win['g_config'] && win['g_config']['appId'],
    //isShow_tmsBullet = false,//记录关闭一个聊天窗口是黄条是否消失，默认是没消失

        isOnline = T.isOnline,
        DOMAIN = T.Config.DOMAIN,
        API_BASE = (function() {
            var host = location.hostname;
            if (host.indexOf('tmall.com') > 0) {
                host = "webww.tmall.com"
            } else if (host.indexOf('tmall.net') > 0) {
                host = "webww.daily.tmall.net:8080";
            }
            else if (host.indexOf("taobao.net") > 0) {
                host = 'webww.daily.taobao.net:8080';
            } else {
                host = 'webwangwang.taobao.com';
            }
            return 'http://' + host + '/';
        })(),
        COMET_URL = (function() {
            var host = location.hostname;
            if (host.indexOf('tmall.com') > 0) {
                host = "webww.tmall.com"
            } else if (host.indexOf('tmall.net') > 0) {
                host = "webww.daily.tmall.net:8080";
            }
            else if (host.indexOf("taobao.net") > 0) {
                host = 'webww.daily.taobao.net:8080';
            } else {
                host = 'get.webwangwang.taobao.com';
            }
            return 'http://' + host + '/';
        })(),
    //API_BASE = 'api/',// 本地模拟测试
        API_EXT = '.do',
        __downloadWangWangURLBuy = 'http://www.taobao.com/wangwang/2010_fp/buyer.php?tracelogww2010=webww',
        __downloadWangWangURLSeller = 'http://www.taobao.com/wangwang/2010_fp/seller.php?tracelogww2010=webww';

    return {

        /**
         * 版本号
         */
        version: '1.0',

        /**
         * 模块集合.
         * @private
         * @enum
         */
        _MODS: {},

        /**
         * 添加模块, 兼容 KISSY 1.3.0.
         * @param { String } name 模块名.
         * @param { Function } cb 回调函数.
         * @return cb 执行返回值.
         */
        add: function(name, cb) {

            return this._MODS[name] = cb(TDog);

        },

        /**
         * 配置项
         */
        Config: {
            getTokenUrl : API_BASE + 'gettoken' + API_EXT,
            loginUrl: API_BASE + 'login' + API_EXT,
            getLoginResultUrl: API_BASE + 'getloginresult' + API_EXT,
            startUrl: API_BASE + 'start' + API_EXT,
            receiveUrl: API_BASE + 'receive' + API_EXT,
            sendUrl: API_BASE + 'send' + API_EXT,
            getUrl: API_BASE + 'get' + API_EXT,
            notifyUrl :COMET_URL + 'connection.html?t=20110322',
            connectionURL :API_BASE + 'buildconnection' + API_EXT,
            checkAutoLoginUrl:  API_BASE + "usertag.do",
            //checkAutoLoginUrl: API_BASE + 'usertag' + API_EXT,
            getTalkUsers: API_BASE + 'gettalkusers' + API_EXT,
            ackGetMessage:API_BASE + 'ackgetmessage' + API_EXT,
            tbLoginUrl: 'https://login.' + DOMAIN + '/member/login.jhtml?f=top',
            tmsAdUrl: 'http://www.taobao.com/go/rgn/tdog/link-for-chat-window.php',
            tmsBulletinUrl:'http://www.taobao.com/go/rgn/webww/wangwang-bulletin.php',
            //tmsBulletinUrl:'http://tms.taobao.com/go/rgn/webww/wangwang-bulletin.php',
            clearUrl:API_BASE + "clear.do",
            clearListUrl:API_BASE + "clear.do?act=2",
            setAutoLoginUrl : API_BASE + "usertag.do",
            TagKeyUrl : API_BASE + "tagkey.do",
            //tmsBulletinUrl:'http://www.taobao.com/go/rgn/webww/webww-bulletin.php',
            LIGHT_NICK: 'wwlight',
            forceAutoLogin: false,
            appId: appId,
            X:'x',
            NOTIFY_STATUS : {
                logout:{key:0,value:-1},    //退出登录
                timeout:{key:1,value:-2},  //超时到60S，没有收到消息。
                message:{key:2,value:-3},  //有消息.
                close:{key:3,value:-4},      //关闭连接。
                notMessage:{key:4,value:0} //无消息。
            },
            downloadWangWangURLBuy:__downloadWangWangURLBuy,
            downloadWangWangURLSeller:__downloadWangWangURLSeller,
            DOMAIN:DOMAIN,
            LOGIN_KEY:'login_key',
            hash:[9, 6, 7, 19, 15, 22, 2, 26, 18, 24, 21, 25, 16, 13, 25, 12]
        },

        /**
         * 是否能正常使用
         */
        isReady: false,

        /**
         * 初始化操作
         */
        init: function(host, relatedEl) {
            S.log('开始初始化 Web 旺旺');

            var self = this,
                Util = self.Util,
                Config = self.Config,
                Login = self.Login,
                SysTips = self.SysTips,
                DataManager = self.DataManager,
                cookieX = S.Cookie.get(Config.X),
                tstartEl = S.get('#tstart');


            // 登录初始化。
            Login.init();
            // 获取 TDog 插件所在的宿主和宿主元素
            self.host = host;
            self.hostEl = relatedEl;

            // 初始化事件中心和系统提示
            SysTips.init();
            self.StatusIcon.init();
            self.EventCenter.init();

            // 控件安装正常或淘宝未登录，不显示工具条
            if (S.unparam(cookieX).p === 'tdog' || Light.addonIsOK() || !DataManager.getNickName()) {
                S.log('控件安装正常或淘宝未登录，Web 旺旺退出初始化');
                //tstartEl.style.display = 'none';
                DOM.addClass(tstartEl, 'tstart-tdog-disabled');
                return;
            }
            /*
             // 工具条上仅有 tdog 时
             if (S.unparam(cookieX).p === 'tdog') {
             S.log('工具条上仅有 Web 旺旺');
             DOM.addClass(tstartEl, 'tstart-minimized');
             DOM.addClass(tstartEl, 'tstart-only-tdog');

             }*/ else if (Light.addonIsOK()) { // 工具条上还有其它插件 + 旺旺控件安装正常时，不显示 Web 旺旺
                S.log('控件安装正常，工具条上不显示 Web 旺旺，退出初始化');
                DOM.addClass(tstartEl, 'tstart-tdog-disabled');
                return;
            } else if (Light.addonIsOK()) { // 工具条上还有其它插件 + 旺旺控件安装正常时，不显示 Web 旺旺
                S.log('控件安装正常，工具条上不显示 Web 旺旺，退出初始化');
                DOM.addClass(tstartEl, 'tstart-tdog-disabled');
                return;
            }


            //添加 has tdog class
            DOM.addClass(tstartEl, 'tstart-tdog-enable');

            // 从 url 中获取通过旺旺点灯激活的用户昵称
            var search = location.search;
            if (search && (search = search.substring(1))) {
                var o = S.unparam(search),
                    lightNick = o[Config.LIGHT_NICK];

                // 公共页面
                if (appId === 0) {
                    lightNick = Util.decode(o['touid'] || o['tid']);
                }

                if (lightNick) {
                    S.log('wwlight = ' + lightNick);

                    // 如果没有站点前缀，默认为 cntaobao
                    if (!Util.hasSitePrefix(lightNick)) {
                        lightNick = 'cntaobao' + lightNick;
                    }

                    Light.lightedUsers.push(lightNick);
                    Config.forceAutoLogin = true;
                }
            }
            //商城宽页面吊顶层级过高,特殊处理
            if (appId === 7 && tstartEl) {
                tstartEl.style.zIndex = 20001;
            }
            // 初始化组件 
            init();

            function init() {
                DataManager.init();
                self.WebServer.init();

                self.RecentList.init();
                self.ChatDialog.init();
                self.SysMessage.init();
                self.SysPopup.init();

                self.isReady = true;

                self.EventCenter.fire(self.EVENTS.TDOG_READY);

            }
        },

        /**
         * TDog 相关的所有事件
         */
        EVENTS: {
            CLICK_LIGHT_ICON: 'clickLightIcon', // 点击亮灯图标
            CLICK_STATUS_ICON: 'clickStatusIcon', // 点击状态图标

            LOGIN_START: 'loginStart', // 开始登录
            LOGIN_SUCCESS: "loginSuccess", // 登录成功
            ERROR_LOGIN_FAILED: 'errorLoginFailed', // 登录失败

            SHOW_RECENT_LIST: 'showRecentList', // 显示联系人列表
            SHOW_CHAT_DIALOG: 'showChatDialog', // 显示聊天窗口
            SHOW_CHAT_MSG: 'showChatMsg', // 显示聊天信息

            RECEIVE_CHAT_MESSAGE: 'receiveChatMessage', // 接收到聊天消息
            RECEIVE_SUBSCRIBE_MESSAGE: 'receiveSystemMessage', // 接收到系统提醒
            RECEIVE_POPUP_MESSAGE: 'receivePopupMessage', // 接收到系统浮起
            RECEIVE_LOGINOUT_SIGNAL: "receiveLoginoutSignal", // 接收到退出通知
            UPDATE_USER_STATUS: "updateUserStatus", // 更新用户状态信息
            UPDATE_STATUS_ICON: "updateStatusIcon", // 更新状态图标

            ERROR_GET_CHAT_INFO: 'errorGetChatInfo', // 获取聊天用户和交易焦点信息失败
            UPDATE_CHAT_INFO: 'updateChatInfo', // 聊天用户和交易焦点信息有更新
            SEND_MESSAGE: 'sendMessage', // 发送消息
            ERROR_GET_MESSAGE: 'errorGetMessage', // 轮询获取聊天信息失败

            UPDATE_LOCAL_STATUS: 'updateLocalStatus', // 本地状态发生了变更
            DAEMON_FIRE: 'daemonFire', // 触发与服务器的轮询


            TDOG_READY: 'tdogReady' // Web 旺旺初始化完毕，处于可用状态
        },

        /**
         * 用户状态
         * 注：key 是 statusType
         */
        USER_STATUS: {
            1: ['offline', '离线'],
            2: ['free','在线'],
            3: ['busy','忙碌中'],
            4: ['away','不在电脑旁'],
            5: ['incall','接听电话中'],
            6: ['outofdinner','外出就餐'],
            7: ['wait','稍候'],
            8: ['invisible',''],//隐身。注：这个显示效果和离线一致。
            9: ['offlinelogin',''],//离线登录。注：这个状态在实际情况中没用。
            10: ['unknown',''],//未知
            11: ['fakeonline',''],//假在线。E 客服使用
            12: ['mobileonline','手机在线'],
            13: ['free', '旺信在线'], //暂时用在线的图标
            14: ['busy', '请勿打扰'] //没有请勿打扰的图标，暂时用忙碌的图标
        },

        /**
         * 错误信息 map
         */
        ERROR_MESSAGE: {
            '0': '', // 成功

            '1': '账户不存在，请输入正确的账户名。', // 非法用户
            '2': '您输入的账户名和密码不匹配，请重新输入。', // 密码错误
            '3': '您的帐号不能登录网页版旺旺，请使用阿里旺旺客户端，<a target="_blank" class="tstart-item-tips-on" href="' + __downloadWangWangURLSeller + '">点此下载！</a>', // 系统黑名单
            '4': '您的账户权限不够。', // 权限不够
            '5': '您登录的帐号数量已超过最大数量。', // 登录用户数量受限制
            '6': '您是E客服用户，只能使用阿里旺旺，<a target="_blank" class="tstart-item-tips-on" href="' + __downloadWangWangURLSeller + '">点此下载！</a>', // 该账号登陆到指定服务器

            '-1': '系统错误，请稍候再试。', // 系统出错
            '-2': '对方账号不存在，请检查。', // 聊天对方用户不存在
            '-3': '账户不存在，请输入正确的账户名。', // 查询UIC用户不存在
            '-4': '登录失败，请重新登录。', // 登录失败，未知原因
            '-5': '登录失败，请重新登录。', // 旺旺服务端登录失败
            '-6': '发送消息不允许为空。', // 没有发送消息内容
            '-7': '您发送的消息过长，请下载支持发送超长信息的阿里旺旺客户端。', // 消息内容长度超过3000
            '-8': '阿里旺旺暂时不可用，请稍候再试。', // 发送心跳失败
            '-9': '账户不存在，请输入正确的账户名。', // 登录用户不存在
            '-10': '阿里旺旺暂时不可用，请稍候再试。', // 用户不自动登录
            '-11': '系统错误，请稍后再试。', // 参数错误
            '-12': '阿里旺旺暂时不可用，请稍候再试。', // 旺旺没有登录
            '-14': '读消息出错，请重试。', // 随机选择一个有消息的用户出错。
            '-15': '阿里旺旺客户端在线，是否踢掉阿里旺旺客户端。',//不显示 。
            '-16': '阿里旺旺客户端在线，是否踢掉阿里旺旺客户端。',//显示 
            '-17': '登录失败，非法请求。',//显示 
            '-100': '阿里旺旺已离线，请重新登录。', // >1小时没有操作，退出
            '-101': '您还没有登录，请登录。', // 用户没有登录，请登录
            '-102': '您的帐号被禁止登录WEB旺旺，请使用阿里旺旺客户端登录（<a target="_blank" class="tstart-item-tips-on" href="' + __downloadWangWangURLBuy + '">点此下载！</a>）。', //用户禁止登录。
            '-1000': '获取信息失败，请稍后再试。', // UIC出错
            '-1001': '获取信息失败，请稍后再试。', // IC出错

            '-40000': '要支持该功能，请下载 <a  target="_blank" href="' + __downloadWangWangURLBuy + '">阿里旺旺客户端</a>'
        },

        /**
         * 消息类型
         */
        MESSAGE_TYPE: {
            OFFLINE: 1, // 离线消息
            TALK: 2, // 聊天消息
            STATUS: 3, // 状态变化消息
            LOGOUT: 4, // 退出通知
            SYSTEM: 5, // 系统消息，包括系统提醒和系统浮起
            SELF: 6 //自己的发送出去的消息
        },

        /**
         * 消息子类型
         */
        MESSAGE_SUBTYPE: {
            TALK_MESSAGE : 201, // 聊天消息,包括离线消息
            AUTO_BACK_TALK_MESSAGE : 202, // 自动回复消息。

            NEED_AUTH : 204, // 对加好友需要验证的陌生人发送消息的回应
            FAIL_ACK : 205, // 发送消息失败应答
            FILE_MESSAGE : 206, // 收到文件请求
            PIC_MESSAGE : 207, // 收到图片请求
            GRAFFITI : 208, // 收到涂鸦请求
            REMOTE_ASSIST : 209, // 收到远程协助请求
            AV: 210, // 收到语音视频请求
            FOLDER : 211, // 传文件夹
            ILLEGALITY: 212, // 发送非法敏感词
            PEER_VERIFY: 213, // 是否需要验证码

            NO_HEARTBEAT : 401, // 没有心跳
            OTHER_LOGIN : 402, // 其他地方登录
            SESSION_TIMEOUT: 403, // 会话超时

            POPUP_MESSAGE : 501, // 系统浮起
            SUBSCRIBE_MESSAGE : 502 // 系统提醒
        },

        /**
         * 提示文案 for 不支持的消息类型
         */


        UNSUPPORT_MSG: {
            204:'对方需要验证，暂时无法发送。',
            205:'发送【{content}】消息失败。',
            206 : '对方正向您传文件。',
            207 :  '对方正向您发图片。',
            208 : '对方正邀请您涂鸦。',
            209 : '对方正邀请您远程协助。',
            210 : '对方正邀请您语音视频。',
            211 : '对方正向您传文件夹。',
            212:'您发送的消息中可能包含了恶意网址、违规广告及其他类关键词，请停止发送类似的消息！',
            213:'对方需要验证，暂时无法发送。'
        },

        /**
         * 站点名
         */
        SITES: {
            TAOBAO: 'cntaobao',   // 淘宝
            YAHOO: 'chnyahoo',    // CNYAHOO
            WANGWANG: 'wangwnag', // 旺号 -- 将错就错，阿软's fail
            CNALICHN: 'cnalichn', // 中文站
            ENALIINT: 'enaliint', // 国际站
            CNALIMAM: 'cnalimam', // 阿里妈妈
            CNKOUBEI: 'cnkoubei', // 口碑
            HTYAHOO: 'htyahooo',  // htyahooo
            CNWUJING: 'cnwujing', // 五金
            CHNAIGOU: 'chnaigou'  // 爱狗
        }
    };
})(KISSY);
// KISSY.app('TDog', function() {

// });
/**
 * @module Util
 * 分工：群星一起维护
 */
TDog.add('Util', function(TDog) {
    var S = KISSY,DOMAIN = TDog.Config.DOMAIN;
    TDog.Util = {
        /**
         * 黄金令箭打点
         */
        detect: function(str, nick){
            var hold = +new Date(),
                img = window[hold] = new Image;
            img.src = "http://log.mmstat.com/"+str+"?cache="+Math.floor(Math.random()*10000000)+"&wwnick=cntaobao" + nick;
            img.onload = (img.onerror = function(){
                window[hold] = null;
            });
            img = null;
        },

        contains:function(arr, value) {
            for (var __len = arr.length - 1; __len >= 0; __len--) {
                if (arr[__len].sendTime == value.sendTime && arr[__len].content == value.content) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 删除数组中重复的元素
         *
         * @todo   删除重复的对象
         * @return Array
         */
        uniqueArray: function(sample) {
            var resultArr = [], origLen = sample.length;
            var include = function(arr, value) {
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (arr[i] == value) {
                        return true;
                    }
                }

                return false;
            };

            // resultArr.push(sample[0]);
            for (var i = 0; i < origLen; i++) {
                if (!include(resultArr, sample[i])) {
                    resultArr.push(sample[i]);
                }
            }

            return resultArr;
        },
        /**
         * 原生和KISSY的attr兼容,只处理set部分
         *
         */
        css:function(arr, isnormal) {
            var DOM = KISSY.DOM;
            KISSY.each(arr, function(data) {
                //if(!isnormal)
                DOM.css(data[0], data[1], data[2]);
                //else
                //	if(data[0] && data[2]) data[0]["style"][data[1]] = data[2];
            });
        },

        /**
         * 设置某个区间的随机数
         *
         * @return int
         */
        getRandom: function(min, max) {
            return min + parseInt((max - min + 1) * Math.random(), 10);
        },

        /**
         * 生成唯一的标识符，用于标记窗口
         *
         * @return string
         */
        genUniqueName: function() {
            for (var i = 0, str = ''; i < 10; i++) {
                str += String.fromCharCode(this.getRandom(97, 122));
            }
            return '_' + str + (+ new Date);
        },

        /**
         * 反 utf-8 百分比编码
         */
        decode: function(s) {
            if (!s) return ''; // decodeURIComponent() 会返回 'undefined' 字符串

            var out = s;
            try {
                out = decodeURIComponent(s);
            } catch(ex) {

            }
            return out;
        },

        /**
         * 站点匹配正则
         */
        SITES_REG: (function() {
            var keys = [];
            for (var i in TDog.SITES) {
                keys.push(TDog.SITES[i]);
            }
            return new RegExp('^(' + keys.join('|') + ')(.*)$', 'i');
        })(),

        /**
         * 用户名中是否含有站点前缀
         */
        hasSitePrefix: function(userId) {
            return TDog.Util.SITES_REG.test(userId);
        },

        /**
         * 从 userId 中获取用户名
         */
        getUserName: function(userId) {
            if (!userId) return '';

            var ret = userId,
                m = userId.match(TDog.Util.SITES_REG);

            if (m && m[1]) {
                ret = userId.substr(m[1].length);
            }

            return ret;
        },

        /**
         * 用 o 的键值替换字符串中对应的占位符
         * 比如：substitute( 'some text {key}', {key: val} ) 会返回 'some text val'
         */
        substitute: function(s, o) {
            return s.replace(/\{([^}]+)\}/g, function(m, key) {
                return o[key] || '';
            });
        },

        /**
         * 转义HTML
         */
        escapeHTML: function(str) {
            var div = document.createElement('div'),
                text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        },
        isTaobao:function() {
            return DOMAIN === 'taobao.com' || DOMAIN === 'taobao.net';
        },

        /**
         * 格式化时间 返回2009-03-30 14:14:14
         */
        formatDate : function(date) {
            var format = "";
            format += date.getFullYear() + "-";
            if (date.getMonth() + 1 < 10)
                format += "0" + (date.getMonth() + 1) + "-";
            else
                format += (date.getMonth() + 1) + "-";

            if (date.getDate() < 10)
                format += "0" + (date.getDate()) + " ";
            else
                format += (date.getDate()) + " ";

            if (date.getHours() < 10)
                format += "0" + date.getHours();
            else
                format += date.getHours();
            if (date.getMinutes() < 10)
                format += ":0" + date.getMinutes();
            else
                format += ":" + date.getMinutes();
            if (date.getSeconds() < 10)
                format += ":0" + date.getSeconds();
            else
                format += ":" + date.getSeconds();
            return format;
        },

        getTmsContent:function(data) {
            //return;
            if (!data) return;
            var self = this, S = KISSY;
            S.each(data, function(idx) {
                var data = idx;
                if (data["data"]) {
                    S.isFunction(data.hasDate) && data.hasDate();
                }
                S.later(function() {
                    TDog.Util.getScript(data.link + "?callback=" + data.callback + "&t=" + +new Date, {
                        onSuccess: function() {
                            S.isFunction(self.hasDate) && data.success();
                        },
                        scope: self,
                        charset: TDog.Config.charset || 'gbk'
                    });
                }, 0);
            })

        },

        /**
         * 转换表情快捷符号为图片地址
         */
        charToFace : (function() {
            var items = {
                    "/:^_^": ["微笑","0"],
                    "/:^$^": ["害羞","1"],
                    "/:Q": ["吐舌头","2"],
                    "/:815": ["偷笑","3"],
                    "/:809": ["爱慕","4"],
                    "/:^O^": ["大笑","5"],
                    "/:081": ["跳舞","6"],
                    "/:087": ["飞吻","7"],
                    "/:086": ["安慰","8"],
                    "/:H": ["抱抱","9"],
                    "/:012": ["加油","10"],
                    "/:806": ["胜利","11"],
                    "/:b": ["强","12"],
                    "/:^x^": ["亲亲","13"],
                    "/:814": ["花痴","14"],
                    "/:^W^": ["露齿笑","15"],
                    "/:080": ["查找","16"],
                    "/:066": ["呼叫","17"],
                    "/:807": ["算账","18"],
                    "/:805": ["财迷","19"],
                    "/:071": ["好主意","20"],
                    "/:072": ["鬼脸","21"],
                    "/:065": ["天使","22"],
                    "/:804": ["再见","23"],
                    "/:813": ["流口水","24"],
                    "/:818": ["享受","25"],
                    "/:015": ["色情狂","26"],
                    "/:084": ["呆若木鸡","27"],
                    "/:801": ["思考","28"],
                    "/:811": ["迷惑","29"],
                    "/:?": ["疑问","30"],
                    "/:077": ["没钱了","31"],
                    "/:083": ["无聊","32"],
                    "/:817": ["怀疑","33"],
                    "/:!": ["嘘","34"],
                    "/:068": ["小样","35"],
                    "/:079": ["摇头","36"],
                    "/:028": ["感冒","37"],
                    "/:026": ["尴尬","38"],
                    "/:007": ["傻笑","39"],
                    "/:816": ["不会吧","40"],
                    "/:&apos;&quot;&quot;": ["无奈","41"],
                    "/:&#39;&quot;&quot;": ["无奈","41"],
                    "/:'\"\"": ["无奈","41"],
                    "/:802": ["流汗","42"],
                    "/:027": ["凄凉","43"],
                    "/:(Zz...)": ["困了","44"],
                    "/:*&amp;*": ["晕","45"],
                    "/:*&*": ["晕","45"],
                    "/:810": ["忧伤","46"],
                    "/:&gt;_&lt;": ["委屈","47"],
                    "/:>_<": ["委屈","47"],
                    "/:018": ["悲泣","48"],
                    "/:&gt;O&lt;": ["大哭","49"],
                    "/:>O<": ["大哭","49"],
                    "/:020": ["痛哭","50"],
                    "/:044": ["I服了U","51"],
                    "/:819": ["对不起","52"],
                    "/:085": ["再见","53"],
                    "/:812": ["皱眉","54"],
                    "/:&quot;": ["好累","55"],
                    "/:\"": ["好累","55"],
                    "/:&gt;M&lt;": ["生病","56"],
                    "/:>M<": ["生病","56"],
                    "/:&gt;@&lt;": ["吐","57"],
                    "/:>@<": ["吐","57"],
                    "/:076": ["背","58"],
                    "/:069": ["惊讶","59"],
                    "/:O=O": ["老大","70"],
                    "/:O": ["惊愕","60"],
                    "/:067": ["闭嘴","61"],
                    "/:043": ["欠扁","62"],
                    "/:P": ["鄙视你","63"],
                    "/:808": ["大怒","64"],
                    "/:&gt;W&lt;": ["生气","65"],
                    "/:>W<": ["生气","65"],
                    "/:073": ["财神","66"],
                    "/:008": ["学习雷锋","67"],
                    "/:803": ["恭喜发财","68"],
                    "/:074": ["小二","69"],
                    "/:036": ["邪恶","71"],
                    "/:039": ["单挑","72"],
                    "/:045": ["CS","73"],
                    "/:046": ["隐形人","74"],
                    "/:048": ["炸弹","75"],
                    "/:047": ["惊声尖叫","76"],
                    "/:girl": ["漂亮MM","77"],
                    "/:man": ["帅哥","78"],
                    "/:052": ["招财猫","79"],
                    "/:(OK)": ["成交","80"],
                    "/:8*8": ["鼓掌","81"],
                    "/:)-(": ["握手","82"],
                    "/:lip": ["红唇","83"],
                    "/:-F": ["玫瑰","84"],
                    "/:-W": ["残花","85"],
                    "/:Y": ["爱心","86"],
                    "/:qp": ["心碎","87"],
                    "/:$": ["钱","88"],
                    "/:%": ["购物","89"],
                    "/:(&amp;)": ["礼物","90"],
                    "/:(&)": ["礼物","90"],
                    "/:@": ["收邮件","91"],
                    "/:~B": ["电话","92"],
                    "/:U*U": ["举杯庆祝","93"],
                    "/:clock": ["时钟","94"],
                    "/:R": ["等待","95"],
                    "/:C": ["很晚了","96"],
                    "/:plane": ["飞机","97"],
                    "/:075": ["支付宝","98"]
                },
                reg = '';

            for (var p in items) {
                reg += '|' + p.substring(2);
            }
            reg = reg.substring(1); // 去掉第一个 |
            reg = reg.replace(/([\^?()\.\*\$])/g, '\\$1'); // 转义特殊字符

            // 实例化为正则
            // reg = /\/:(^_^|^$^|Q|815|...|plane|075)/
            var reg2 = new RegExp('\\\\T\/:(' + reg + ')\\\\T', 'g');  //自己发送出去的消息中处理表情。
            reg = new RegExp('\/:(' + reg + ')', 'g');

            return function(content, send, isSelfSend) {
                if (content) {
                    if (send) {//发送到服务器时，表情前面加\T，并处理转义字符

                        var new_reg = new RegExp('\\\\', 'g');
                        content = content.replace(new_reg, function(key) {
                            key = '\\\\';
                            return key;
                        });

                        content = content.replace(reg, function(key) {
                            if (items[key]) {
                                key = '\\T' + key + '\\T';
                            }
                            return key;
                        });
                    } else {
                        if (isSelfSend) {
                            content = content.replace(reg2, function(key) {
                                var _key = key.substring(2, key.length - 2);
                                if (items[_key]) {
                                    key = '<img src="http://a.tbcdn.cn/sys/wangwang/smiley/48x48/' + items[_key][1] +
                                        '.gif" alt="' + items[_key][0] + '" />';
                                }
                                return key;
                            });
                        } else {
                            content = content.replace(reg, function(key) {
                                if (items[key]) {
                                    key = '<img src="http://a.tbcdn.cn/sys/wangwang/smiley/48x48/' + items[key][1] +
                                        '.gif" alt="' + items[key][0] + '" />';
                                }
                                return key;
                            });
                        }
                    }
                }
                return content;
            }
        })(),

        /**
         * 转换表情名称为快捷符号
         */
        faceToChar : function(name) {
            var items = [
                "/:^_^",
                "/:^$^",
                "/:Q",
                "/:815",
                "/:809",
                "/:^O^",
                "/:081",
                "/:087",
                "/:086",
                "/:H",
                "/:012",
                "/:806",
                "/:b",
                "/:^x^",
                "/:814",
                "/:^W^",
                "/:080",
                "/:066",
                "/:807",
                "/:805",
                "/:071",
                "/:072",
                "/:065",
                "/:804",
                "/:813",
                "/:818",
                "/:015",
                "/:084",
                "/:801",
                "/:811",
                "/:?",
                "/:077",
                "/:083",
                "/:817",
                "/:!",
                "/:068",
                "/:079",
                "/:028",
                "/:026",
                "/:007",
                "/:816",
                "/:'\"\"",
                "/:802",
                "/:027",
                "/:(Zz...)",
                "/:*&*",
                "/:810",
                "/:>_<",
                "/:018",
                "/:>O<",
                "/:020",
                "/:044",
                "/:819",
                "/:085",
                "/:812",
                "/:\"",
                "/:>M<",
                "/:>@<",
                "/:076",
                "/:069",
                "/:O",
                "/:067",
                "/:043",
                "/:P",
                "/:808",
                "/:>W<",
                "/:073",
                "/:008",
                "/:803",
                "/:074",
                "/:O=O",
                "/:036",
                "/:039",
                "/:045",
                "/:046",
                "/:048",
                "/:047",
                "/:girl",
                "/:man",
                "/:052",
                "/:(OK)",
                "/:8*8",
                "/:)-(",
                "/:lip",
                "/:-F",
                "/:-W",
                "/:Y",
                "/:qp",
                "/:$",
                "/:%",
                "/:(&)",
                "/:@",
                "/:~B",
                "/:U*U",
                "/:clock",
                "/:R",
                "/:C",
                "/:plane",
                "/:075" // 98
            ];
            var ret = items[parseInt(name, 10)];
            if (ret) {
                ret = ret.replace('&gt;', '>')
                    .replace('&lt;', '<')
                    .replace('&amp;', '&')
                    .replace('&apos;', "'")
                    .replace('&quot;', '"')
                    .replace('&quot;', '"');
            }
            return ret;
        },
        getScript: function(url, success, charset) {
            var doc = window['document'],
                head = doc.getElementsByTagName('head')[0] || doc.documentElement,
                scriptOnload = doc.createElement('script').readyState ?
                    function(node, callback) {
                        var oldCallback = node.onreadystatechange;
                        node.onreadystatechange = function() {
                            var rs = node.readyState;
                            if (rs === 'loaded' || rs === 'complete') {
                                node.onreadystatechange = null;
                                oldCallback && oldCallback();
                                callback.call(this);
                            }
                        };
                    } :
                    function(node, callback) {
                        node.addEventListener('load', callback, false);
                    },
                RE_CSS = /\.css(?:\?|$)/i;

            var isCSS = RE_CSS.test(url),
                node = doc.createElement(isCSS ? 'link' : 'script'),
                config = success, error, timeout, timer,ontimeout;

            if (S.isPlainObject(config)) {
                success = config.onSuccess;
                error = config.onFailure;
                ontimeout = config.onTimeout;
                timeout = config.timeout;
                charset = config.charset;
            }

            if (isCSS) {
                node.href = url;
                node.rel = 'stylesheet';
            } else {
                node.src = url;
                node.async = true;
            }
            if (charset) node.charset = charset;

            if (S.isFunction(success)) {
                if (isCSS) {
                    success.call(node);
                } else {
                    scriptOnload(node, function() {
                        if (timer) {
                            timer.cancel();
                            timer = undefined;
                        }
                        success.call(node);
                        S.later(function() {
                            head.removeChild(node);
                            node = undefined;
                        }, 3000);
                    });
                }
            }

            if (S.isFunction(ontimeout)) {
                timer = S.later(function() {
                    timer = undefined;
                    ontimeout();
                }, timeout || 3000);
            }

            head.insertBefore(node, head.firstChild);
            return node;
        },
        sendLog:function(log) {
            var browseVer = '';
            //浏览器检测
            if (S.UA.ie) {
                browseVer = 'ie' + S.UA.ie;
            } else if (S.UA.firefox) {
                browseVer = 'firefox' + S.UA.firefox;
            } else if (S.UA.chrome) {
                browseVer = 'chrome' + S.UA.chrome;
            } else if (S.UA.safari) {
                browseVer = 'safari' + S.UA.safari;
            } else if (S.UA.opera) {
                browseVer = 'opera' + S.UA.opera;
            }
            S.later(function() {
                try {
                    new Image().src = 'http://log.mmstat.com/ww?cache=' + new Date().getTime() + '&browse=' + browseVer + '&' + log;
                } catch(ex) {
                }
            }, 500);
        }
    };
});
/**
 * @module 事件中心
 * 分工：玉伯负责
 */
TDog.add('EventCenter', function(TDog) {

    var S = KISSY,
        EVENTS = TDog.EVENTS, Util,
        Config, Login, __Storage, WebServer, Daemon, DataManager, Message,
        SysTips, SysMessage, StatusIcon, RecentList, ChatDialog,
        EC = {
            init: function() {
                S.log('init EventCenter');
                Util = TDog.Util;
                Config = TDog.Config;
                Login = TDog.Login;
                DataManager = TDog.DataManager;
                Message = TDog.DataManager.Message;
                WebServer = TDog.WebServer;
                Daemon = TDog.Daemon;
                __Storage = TDog.LocalStorage;
                SysTips = TDog.SysTips;
                SysMessage = TDog.SysMessage;
                StatusIcon = TDog.StatusIcon;
                RecentList = TDog.RecentList;
                ChatDialog = TDog.ChatDialog;
            }
        };

    S.mix(EC, S.EventTarget);
    var isEmptyString = function(val) {
        return typeof val !== 'string' || val === '';
    };

    // 点击状态图标
    EC.on(EVENTS.CLICK_STATUS_ICON, function() {
        S.log('点击状态图标');

        if (Login.canTalk()) {
            if (!RecentList.isOpen()) {
                StatusIcon.online();
            } else {
                if (DataManager.getTotalUnreadMsgCount() > 0) {
                    StatusIcon.getmessage();
                }
            }

            // 状态图标处于闪烁状态
            if (DataManager.getTotalUnreadMsgCount() > 0) {
                //   var items = DataManager.getTalkUsers();

                // 只收到一个人的新消息，直接打开聊天窗口
                if (!RecentList.isOpen()) {
                    if (DataManager.getTotalUnreadMsgCount() === 1) {
                        EC.fire(EVENTS.SHOW_CHAT_DIALOG, {haveUser:{userName:'donotknow'}});
                        return false;
                    }
                }
            }
            // 默认打开联系人列表，0 个时显示联系人为空
            return true;
        } else { // 已经退出了。。返回 false, 不继续往下执行 
            return false;
        }
    });

    // 点击亮灯图标
    EC.on(EVENTS.CLICK_LIGHT_ICON, function(ev) {
        S.log('点击亮灯图标');
        var userInfo = ev.userInfo;

        // 检查登录，并打开聊天窗口
        if (Login.canTalk(userInfo.key, true)) {
            userInfo['fromLight'] = true; // 表示来自旺旺亮灯
            EC.fire(TDog.EVENTS.SHOW_CHAT_DIALOG, ev);
        }

    });


    // 开始登录
    EC.on(EVENTS.LOGIN_START, function() {

        if (TDog.Login.online == false) {
            //TDog.SysTips.showLoginTips();
        } else {
            StatusIcon.onlogin();
            TDog.Login.online = false;
        }


    });

    // 登录成功
    EC.on(EVENTS.LOGIN_SUCCESS, function() {
        S.log('登录成功');
        SysTips.hide();
        TDog.Login.ready = false;
        // 通过旺旺点灯激活的，登录成功后直接弹出聊天窗口
        var users = Light.lightedUsers, userKey, userInfo;


        while (users.length) {
            userKey = users.shift();
            S.log('自动打开和 ' + userKey + ' 的聊天窗口');

            if (userKey) {
                // 在点灯对象里找不到数据时，参数里解析得到数据，比如公共页面
                if (!(userInfo = Light.data[userKey])) {
                    var params = S.unparam(location.search.substring(1)), uid = params['touid'] || params['tid'];

                    // 仅公共页面如此，其它页面忽略
                    if (uid) {
                        userInfo = {
                            key: userKey,
                            userName: Util.getUserName(uid),
                            userId: uid,
                            status: params['status'] || 1,
                            itemId: params['gid'],
                            subscribed: false
                        };
                    }
                    // 放入亮灯数据里
                    Light.data[userKey] = userInfo;
                }

                if (userInfo) {
                    userInfo['fromLight'] = true; // 表示来自旺旺亮灯
                    S.later(function() {
                        EC.fire(TDog.EVENTS.SHOW_CHAT_DIALOG, { userInfo: userInfo });
                    }, 1000)
                }
            }
        }

        // 如果有未读消息，闪烁状态图标
        var unreadMsgCount = DataManager.getTotalUnreadMsgCount();
        if (unreadMsgCount > 0) {
            S.log("存在未读消息 " + unreadMsgCount);
            StatusIcon.getmessage();
        } else {
            StatusIcon.online();
        }
    });

    // 登录失败
    EC.on(EVENTS.ERROR_LOGIN_FAILED, function(ev) {
        S.log('登录失败');
        var error = ev.error || { },// ev = {error: {code:-100,errorMessage:"1小时没有操作，退出。"}}
            code = parseInt(error.code, 10);

        // 淘宝已退出登录，跳转到登陆页面
        if (code === -100 || code === -101) {
            Login.directToTBLogin();
        } else {  // 其它错误
            StatusIcon.offline();
            SysTips.show(TDog.ERROR_MESSAGE[code] || error['errorMessage'] || TDog.ERROR_MESSAGE[-1], 200);
        }
    });


    // 打开最近联系人
    EC.on(EVENTS.SHOW_RECENT_LIST, function(ev) {
        S.log('打开最近联系人');
        if (!TDog.DataManager.isLogin())
            return;
        WebServer.getTalkUsers();
        S.DOM.removeClass(S.DOM.get('.tstart-tdog-panel-bd', '#tstart-plugin-tdog'), 'tstart-panel-loading');
    });

    // 打开聊天窗口
    EC.on(EVENTS.SHOW_CHAT_DIALOG, function(ev) {
        // ev: { userId: 'cntaobaoxxx', userName: 'xxx', status: 11, itemId: '123456', subscribed: false }
        S.log('打开聊天窗口');
        if (ev.haveUser && ev.haveUser.userName) {//打开聊天窗口，当没有传用户名过来是，服务端会选择一个有消息的用户。
            WebServer.startChat('', '', {// 向服务器端发送开始聊天请求
                onSuccess: function() {
                    S.log('获取开始聊天数据完成。');
                },
                onTimeout: function() {
                    S.log('获取开始聊天数据失败', 'warn');

                    // 显示出错提示
                    SysTips.show(TDog.ERROR_MESSAGE[-1000]);
                }
            }, false);
        } else {
            var userInfo = ev.userInfo || {}, userName = userInfo.userName || '', userId = userInfo.userId || userInfo.key || '', itemId = userInfo.itemId || '';
            userInfo.status = userInfo.status || 1;
            if ((!userName || isEmptyString(userName))
                && ( !userId || isEmptyString(userId))) {
                SysTips.show('网络出现错误，请刷新。', 140, 2);
                return;
            }

            S.log('和 ' + userName + ' 开始聊天 fromLight = ' + userInfo.fromLight);

            // 和自己聊天
            if (userName == DataManager.getNickName()) {
                alert('不能选择自己哦。');
                return;
            }

            // 来自旺旺点灯
            if (userInfo['fromLight']) {
                if (userInfo['subscribed']) {  // 已订阅状态，取本地数据库中的状态
                    var localUserData = DataManager.getUser(userId);
                    userInfo.status = (localUserData || {})['statusType'] || userInfo.status || 1; // 默认离线
                } else {// 一旦点击过后，就自动加入到了订阅用户中
                    Light.data[userInfo.key].subscribed = true;
                }
            }
            // 显示聊天窗口
            TDog.ChatDialog.show(userInfo, userId.indexOf('cntaobao') === 0);

            // 向服务器端发送开始聊天请求
            WebServer.startChat(userId, itemId, {
                onSuccess: function() {
                    S.log('获取开始聊天数据完成。');
                },
                onTimeout: function() {
                    S.log('获取开始聊天数据失败', 'warn');
                    // 显示出错提示
                    ChatDialog.showSysTip("<p>" + TDog.ERROR_MESSAGE[-14] + "</p>", true);
                }
            }, userInfo.fromLight);
        }
    });


    // 接收到聊天信息
    EC.on(EVENTS.RECEIVE_CHAT_MESSAGE, function(ev) {
        var unreadMsgPersonCount = ev.unreadMsgPersonCount;
        S.log('收到' + unreadMsgPersonCount + '个人的消息');

        // 联系人列表处于打开状态时，更新列表
        if (RecentList.isOpen()) {
            RecentList.update();
            ChatDialog.isOpen();
        } else {
            // 更新状态图标
            EC.fire(EVENTS.UPDATE_STATUS_ICON, {data:{mSize:unreadMsgPersonCount}});
        }
    });

    // 接收到系统提醒
    EC.on(EVENTS.RECEIVE_SUBSCRIBE_MESSAGE, function(ev) {
        S.log('接收到系统提醒');
        SysMessage.show(ev.data);
    });


    // 旺旺退出通知
    EC.on(EVENTS.RECEIVE_LOGINOUT_SIGNAL, function(ev) {
        S.log('接收到旺旺退出通知');
        StatusIcon.offline();	 // 旺旺图标灰显
        TDog.SysTips.hide();
        Daemon.stop(); // 停止 Daemon 后台
        TDog.NotifyDaemon.stop();
        DataManager.clearAll();
        RecentList.close(); // 关闭联系人列表
        ChatDialog.closeDialog(); // 关闭聊天对话框
    });

    // 更新用户状态信息
    EC.on(EVENTS.UPDATE_USER_STATUS, function(ev) {
        S.log('更新用户状态信息');
        var data = ev.data;
        // data = { "changedUserId": "cntaobao韩彰", "status": "3", "type": "3" }

        // 更新联系人列表
        if (RecentList.isOpen()) {
            RecentList.update();
        }

        // 更新聊天窗口的用户状态
        if (ChatDialog.isOpen()) {
            ChatDialog.updateUserStatus(Util.getUserName(data['changedUserId']), data['status']);
        }
    });

    // 更新状态图标
    EC.on(EVENTS.UPDATE_STATUS_ICON, function(ev) {
        var data = ev.data,unreadMsgCount;
        S.log('更新状态图标');
        if (data) {   // 更新未读消息数
            unreadMsgCount = data.mSize;
        } else {
            unreadMsgCount = DataManager.getTotalUnreadMsgCount();
        }

        // 如果还有未读消息，闪烁状态图标
        if (unreadMsgCount > 0) {
            S.log("有多少人未读： " + unreadMsgCount);
            StatusIcon.getmessage();
        } else {
            // 去除闪烁
            StatusIcon.online();
            // 更新本地新消息字段为无，让其它页面能及时同步
        }
    });


    // 获取聊天人的信息失败
    EC.on(EVENTS.ERROR_GET_CHAT_INFO, function() {
        ChatDialog.showSysTip('<p>' + TDog.ERROR_MESSAGE[-1000] + '</p>', true);
    });

    // 发送聊天消息
    EC.on(EVENTS.SEND_MESSAGE, function(ev) {
        var content = ev.content, userName = ev.userName;
        if(userName.length <= 8){
            TDog.Util.detect('ww.1.20.1.1.5', DataManager.getNickName());
        }
        S.log('给 ' + userName + ' 发送以下消息：' + content, 'info');
        WebServer.send(userName, content, ev.callback);
    });


    // 轮询获取信息失败
    EC.on(EVENTS.ERROR_GET_MESSAGE, function(ev) {
        // ev eg: {code:-101, errorMessage:"用户没有登录，请登录。"}
        S.log('取服务端信息失败');
        var error = ev.error, code = parseInt(error.code, 10);

        // 淘宝已退出登录
        if (code === -100 || code === -101) {
            EC.fire(EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
            Daemon.stop();
            TDog.NotifyDaemon.stop();
        } else {
            // 显示错误信息，优先用 code 获取优化后的文案
            SysTips.show(TDog.ERROR_MESSAGE[code] || error['errorMessage'] || TDog.ERROR_MESSAGE[-1]);
        }
    });


    // 监听服务器轮询
    EC.on(TDog.EVENTS.DAEMON_FIRE, function() {
        WebServer.get(); // 发送轮询请求 
    });

    TDog.EventCenter = EC;
});/**
 * @module 登录相关逻辑
 * 分工：玉伯负责
 */
TDog.add('Login', function(TDog) {

    var S = KISSY, Config, DataManager, StatusIcon, SysTips;

    TDog.Login = {
        online : false,
        ready : false,
        /**
         * 登录模块初始化。
         */
        init: function() {
            S.log('init Login');

            Config = TDog.Config;
            DataManager = TDog.DataManager;
            StatusIcon = TDog.StatusIcon;
            SysTips = TDog.SysTips;
        },

        /**
         * 能否正常调用 Web 旺旺聊天
         * 是否登录，没有登录，@param forceAutoLogin=true,发登录请求。
         * @param userKey 用户昵称。
         * @param forceAutoLogin 是否自动登录。
         */
        canTalk: function(userKey, forceAutoLogin) {

            // 判断淘宝是否登录，没有登录时，跳转到登录页面
            // TODO: 登录小窗
            if (!DataManager.getNickName()) {
                this.directToTBLogin(userKey);
                return false;
            }

            // 淘宝已登录，Web 旺旺未登录
            // bug fix: 加入 offline 判断。当帐号设置为不同时登录，打开多个页面，其中有一个页面
            //          登录后，isLogin() 为 true, 但当前页面并未登录，需要激活登录状态。
            if (StatusIcon.isOffline() || !DataManager.isLogin()) {
                // 通过旺旺点灯触发的，自动登录
                if (forceAutoLogin) {
                    TDog.WebServer.login();
                    SysTips.showLoginTips(true);
                } else {
                    //如果正在登陆，则不提示消息
                    SysTips.showLoginTips(TDog.Login.ready);
                }
                // 保留起来，等登录后，自动打开聊天窗口      //TODO 
                if (userKey) {
                    Light.lightedUsers.push(userKey);
                }
                return false;
            }
            // 一切 ok
            return true;
        },

        /**
         *用户没有登录淘宝的是，跳转到淘宝登录页面。 跳转到淘宝登录页面
         * @param userKey 用户昵称。
         */
        directToTBLogin: function(userKey) {
            var loc = location,
                base = loc.protocol + '//' + loc.host + loc.pathname,
                search = loc.search,
                hash = loc.hash,
                href = loc.href,
                hostname = loc.hostname,
                LIGHT_NICK = Config.LIGHT_NICK,
                isDaily = (hostname.indexOf('daily.') > -1) ? true : false,
                HOST = (function(){
                    if(isDaily){
                        return hostname.indexOf('tmall') > -1 ? 'daily.tmall.net' : 'daily.taobao.net';
                    }else{
                        return hostname.indexOf('tmall') > -1 ? 'tmall.com' : 'taobao.com';
                    }
                })(),
                URL = HOST.indexOf('tmall') > -1 ? 'http://login.' + HOST + '?redirect_url=' : 'https://login.' + HOST + '/member/login.jhtml?f=top&redirectUrl=';

            search = search ? S.unparam(search.substring(1)) : {};
            if (LIGHT_NICK in search) {
                delete search[LIGHT_NICK]; // 无条件清空，避免离线后，再次登录后的弹出
            }
            // 来自旺旺亮灯点击，保留点击数据到 href 中，以便登录后打开对应的聊天窗口
            if (userKey) {
                if (this.isSearch()) {
                    search[LIGHT_NICK] = encodeURIComponent(userKey);
                } else {
                    search[LIGHT_NICK] = userKey;
                }

            }

            search = S.param(search);

            // 淘宝登陆页面在登录完成，redirect 时，会强制 decodeURIComponent(url)
            // 因此 href 中的中文，在 utf8 百分比编码后，还要再编码一次，以保证跳转回来时，能正确还原中文
            // 注意：search 用的是 php 独立环境，search 不需要再次编码 
            if (!this.isSearch()) {
                search = encodeURIComponent(search);
            }

            href = base + '?' + search + hash;


            loc.href = URL + href;
        },
        /**
         * 搜索不是JAVA应用是PHP做单独的编码处理判断。
         */
        isSearch:function() {
            var _host = ["search.taobao.com","sandbox.search.taobao.com","search8.taobao.com","search8.daily.taobao.net","s.taobao.com"];
            if (S.indexOf(location.host, _host) > -1) {
                return true;
            }
        }
    };

});
/**
 * @module 本地存储
 * 分工：明城负责
 */

TDog.add('LocalStorage', function(TDog) {

    var S = KISSY,U = TDog.Util,T = TStart, Cookie = S.Cookie,X = U.isTaobao ? 'x' : 'otherx',TMALLX = 'otherx',WHL = 'whl',LastGetMessageTime = 0,
        DOMAIN = T.Config.DOMAIN ,publicKey,__storage = {},AUTO_LOGIN = '_ato',LAST_LOGIN = '__ll';
    /**
     * 数据存储模块。存储JS对象。
     */
    TDog.LocalStorage = {
        init:function() {
            __storage = {};
            this.setCookieWHL('-1', '0', '0', '0');
        },
        /**
         * 设置键值
         */
        setItem : function(key, value) {
            __storage[key] = value;
        },

        /**
         * 获取键值
         */
        getItem : function (key) {
            return __storage[key] || {};
        },

        /**
         * 遍历存储对象
         */
        getItems : function() {
            //console.log(storage);
            var store = [];
            for (var i in __storage)
                store.push([i,__storage[i]]);
            return store;
        },

        /**
         * 清空存储对象
         */
        clear : function() {
            var cookieX = S.unparam(Cookie.get(X)),self = this;
            if (cookieX[LAST_LOGIN] != '-1' || self.getCookieWHL().messageStatus === 0) {
                __storage = {};
                self.setCookieWHL('-1', '0', '0', '0');
                self.setCookieX(LAST_LOGIN, '-1');
                self.setCookieX(AUTO_LOGIN, '0');
            }
        },
        /**
         * 得到组合COOKIE X中的一个值。
         * @param key
         */
        getCookieX:function(key) {
            return decodeURIComponent(S.unparam(Cookie.get(X))[key]);
        },
        /**
         *设置组合Cookie X的一个值。
         * @param value
         */
        setCookieX:function(key, value) {
            var xValues = S.unparam(Cookie.get(X));
            xValues[key] = encodeURIComponent(value);
            var tmp = S.param(xValues);
            Cookie.set(X, tmp, 365, DOMAIN, '/');
        },
        /**
         * 获取焦点时间。
         * @param time
         */
        setAndGetFocusTime:function(time) {
            if (time) {
                LastGetMessageTime = time;
            }
            return LastGetMessageTime;
        },
        setCookieWHL:function(messageStatus, system, heartTime, focusTime) {
            //S.log('set cookieWHL' + messageStatus + "," + system + "," + heartTime + "," + focusTime);
            var __tmp = messageStatus + '&' + system + '&' + heartTime + '&' + focusTime;
            Cookie.set(WHL, __tmp, '', DOMAIN, '/');
            //  S.log(__tmp + ",[" + focusTime + "]");
        },
        setPublicKey:function(value) {
            publicKey = value;
        },
        getPublicKey:function() {
            return publicKey || '';
        },
        getCookieWHL:function() {
            var __whl = Cookie.get(WHL),__tmp = null;
            if (__whl) {
                __tmp = __whl.split('&');
                if (__tmp.length !== 4) {
                    __tmp = [-1,0,0,0];
                }
            } else {
                __tmp = [-1, 0, 0, 0];
            }
            //S.log('get cookieWHL' + __tmp.join(","));
            return {
                messageStatus:parseInt(__tmp[0]),
                system:parseInt(__tmp[1]),
                heartTime:parseInt(__tmp[2]),
                focusTime:parseInt(__tmp[3])
            };
        }
    };
});
/**
 * @module 数据管理器
 * 分工：明城负责
 */
TDog.add('DataManager', function(TDog) {

    var S = KISSY, Cookie = S.Cookie, JSON = S.JSON,  Config = TDog.Config,
        Util = TDog.Util, __Storage, EventCenter, WebServer, Daemon, Message,X = 'x',myNick = '',
        isOnline = TStart.Config.isOnline,
    // 本地存储键值
        KEYS = {
            FIRST_RUN: '_first_run', // 是否第一次运行。有值时，表示不是第一次运行
            LAST_LOGIN: '__ll', // 最后登录时间
            LAST_LOGIN_NAME: '_last_login_name', // 最后登录用户名
            RECENT_LIST: '_recent_list',            // 最近聊天的联系人列表
            RECENT_LIST_NAME: '_recent_list_name',  // 最近聊天的联系人名称
            USER_LIST: '_user',
            MESSAGE_LIST: '_message_list'
        },
    // 自定义事件列表
        EVENTS = TDog.EVENTS;
    /**
     * 数据管理模块
     */
    TDog.DataManager = {
        /**
         * 初始化
         */
        init: function() {
            var self = this, nickName, lastLoginName;
            S.log('初始化 DataManager 模块');

            __Storage = TDog.LocalStorage;
            EventCenter = TDog.EventCenter;
            WebServer = TDog.WebServer;
            Daemon = TDog.Daemon;
            Message = self.Message;

            Message.init();
        },

        /**
         * 获取最近联系人列表
         * 返回格式：[item1, item2, ..., item20], 最多 20 条，没有时返回 [ ]
         * 每个 item 的格式为：
         *  {
         *    userId    : string  // 用户 id
         *    userName  : string  // 昵称
         *    status    : number  // 状态
         *    msgCount  : number  // 新消息数
         *  }
         */
        getRecentList: function() {
            return __Storage.getItem(KEYS.RECENT_LIST);
        },
        /**
         * 通过用户ID取到一个用户
         * @param userId
         */
        getUser:function(userId) {
            var users = __Storage.getItem(KEYS.RECENT_LIST);
            if (users) {
                return users[userId];
            }
            return {};
        } ,
        /**
         * 更新聊天人列表
         * @param data
         * [{"userId":"cntaobaoailing17","size":"0","statusType":"1","relation":"2","route":"0034","hasDBMessage":"true","hasCacheMessage":"false","itemId":"123456"}]
         */
        setRecentList: function(data) {
            var oldRecentList = __Storage.getItem(KEYS.RECENT_LIST);
            for (var i = 0; i < data.length; i++) {
                var tmp = oldRecentList[data[i].userId];
                oldRecentList[data[i].userId] = data[i];
                if (tmp) {//记录取消息时间。
                    data[i].messageTime = tmp.messageTime;
                }
            }
            __Storage.setItem(KEYS.RECENT_LIST, oldRecentList);
        },
        /**
         * 更新取消息时间。
         * @param userId
         * @param time
         */
        updateMessageTime:function(userId, time) {
            var users = __Storage.getItem(KEYS.RECENT_LIST);
            if (users && users[userId]) {
                users[userId].messageTime = time;
            }
        },
        /**
         * 得到取消息时间
         * @param userId
         */
        getMessageTime:function(userId) {
            var time = (this.getUser(userId) || {})['messageTime'] || '';
            S.log('message time :' + time);
            return time;
        },
        /**
         * 获取聊天人列表中有未读消息的用户数。
         */
        getTotalUnreadMsgCount: function() {
            var numberOfPeople = __Storage.getCookieWHL();
            if (numberOfPeople.messageStatus) {
                return numberOfPeople.messageStatus;
            }
            return 0;
        },
        /**
         * 接收开始和某人聊天数据 向服务器发送请求start.do开始聊天后回调。
         *@param data
         * {"success":"true","result":{
         * "user":{"nick":"ailing18","userChatId":"cntaobaoailing18","sex":"0","registDate":"2009-8-26 12:55:02","visitDate":"2010-8-25 11:19:53","sellNum":"2_2","buyNum":"2_2","certification":"false","suspended":"0","relation":"1","site":"cntaobao"},
         * "item":{"id":"56a667c19b7e808b0174c0fcb25b1f5b","itemNumId":"5161206115","imageUrl":"http://img01.taobaocdn.com/bao/uploaded/i1/T1xfVHXk0pXXcsFZTX_084513.jpg","title":"冲皇冠 大陆行货 诺基亚 WIFI 5530XM WLAN(无线上网)特价免运费","remainTime":"2010-8-23 9:47:54","stockNum":"215","price":"1320.0"},
         * "timeStamp":"","size":0,"all":false,"messages":[]
         * } }
         */
        saveStartChatData: function(data) {
            if (data.success.toLowerCase() == 'true') {
                var result = data.result, item = result.item || {}, user = result.user;
                if(result.talkUserStatus.userId.length <= 8){
                    TDog.Util.detect('ww.1.20.1.1.4', this.getNickName());
                }
                this.__checkOneUserMessage(result);
                this.__isTaobaoUser(user, item);
                this.__saveAndViewChatMessage(result);

                this.__updateNuberOfPeople(result);
            } else {
                if (data.result.error[0].code == -2) {
                    TDog.ChatDialog.closeDialog();
                    TDog.SysTips.show(TDog.ERROR_MESSAGE[-2], 150, 3);
                } else if (data.result.error[0].code == -14) {  //出错了让用户可以打开聊天人列表。
                    TDog.SysTips.show(TDog.ERROR_MESSAGE[-14], 0, true);
                    this.forcedUpdateNumberOfPeople(Config.NOTIFY_STATUS.notMessage.value, 0);
                } else if (data.result.error[0].code == -100 || data.result.error[0].code == -101 || data.result.error[0].code == -12) {
                    EventCenter.fire(TDog.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                } else { // 聊天相关信息获取失败
                    EventCenter.fire(EVENTS.ERROR_GET_CHAT_INFO, {data: data.result, 'method': 'start'});
                }
            }
        } ,
        handleReceiveMessage:function(data) {
            var __self = this;
            if (data.success.toLowerCase() == 'true') {
                var result = data.result;
                result.user = {
                    userChatId:result.talkUserStatus.userId
                };
                TDog.ChatDialog.updateUserStatus(result.talkUserStatus.userId, result.talkUserStatus.statusType);
                __self.__saveAndViewChatMessage(result);

                __self.__updateNuberOfPeople(result);
            } else {
                if (data.result.error[0].code == -2) {
                    TDog.ChatDialog.closeDialog();
                    TDog.SysTips.show(TDog.ERROR_MESSAGE[-2], 150, 3);
                } else if (data.result.error[0].code == -14) {  //出错了让用户可以打开聊天人列表。
                    TDog.SysTips.show(TDog.ERROR_MESSAGE[-14], 0, true);
                    this.forcedUpdateNumberOfPeople(Config.NOTIFY_STATUS.notMessage.value, 0);
                } else if (data.result.error[0].code == -100 || data.result.error[0].code == -101 || data.result.error[0].code == -12) {
                    EventCenter.fire(TDog.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                } else { // 聊天相关信息获取失败
                    EventCenter.fire(EVENTS.ERROR_GET_CHAT_INFO, {data: data.result, 'method': 'start'});
                }
            }
        },

        /**
         * 清空数据库
         */
        clearAll: function() {
            TDog.ChatDialog.clearCurrentChatUserId();
            myNick = '';
            __Storage.clear();
        } ,


        /**
         * 获取当前用户昵称
         * @return String
         */
        getNickName: function() {
            var nickName = Cookie.get('_nk_') || '';
            return unescape(nickName.replace(/\\u/g, '%u'));
        } ,
        /**
         * 服务端用来做负载。
         */
        getNickUrlComponent:function() {
            if (myNick.length == 0) {
                myNick = encodeURIComponent(unescape((Cookie.get('_nk_') || '').replace(/\\u/g, '%u')));
            }
            return myNick;
        },

        /**
         * Web 旺旺是否登录
         */
        isLogin: function() {
            var self = this, isCookieLogin = !!self.getNickName(),
                lastLogin = __Storage.getCookieX(KEYS.LAST_LOGIN);
            if(isOnline){
                return isCookieLogin && (lastLogin == self.getCookieLastLoginTime());
            }
            return isCookieLogin;
        } ,

        /**
         * 获取 cookie 中的最后登录时间
         */
        getCookieLastLoginTime: function() {
            // 理论上 lltime 每次都要变化， 但是是异步跟新，所以登陆间隔小的话，可能会一样
            // 为了保险，同时用 lastgetwwmsg 来判断
            if (Util.isTaobao()) {
                return (S.unparam(Cookie.get('uc1'))['lltime'] + Cookie.get('lastgetwwmsg')) || '-1';
            } else {
                return (Cookie.get('t') + Cookie.get('login')) || '-1';
            }
        } ,

        //把最后的  登录时间写道cookie x 字段中
        setLastLoginTime:function() {
            __Storage.setCookieX(KEYS.LAST_LOGIN, this.getCookieLastLoginTime());
            __Storage.setCookieWHL(0, 0, new Date().getTime(), new Date().getTime());
        }
        ,
        /**
         * 清除最后登录时间。
         */
        resetLastLoginTime:function() {
            __Storage.setCookieX(KEYS.LAST_LOGIN, '0');
        } ,

        /**
         *失去焦点后是否有新的淘宝页面获取焦点。
         */
        haveNotFocusedPage:function() {
            return __Storage.setAndGetFocusTime() === __Storage.getCookieWHL().focusTime;
        } ,

        /**
         * 设置收到多少人的消息。
         * @param size
         */
        setNumberOfPeople:function(size, system) {
            var whl = __Storage.getCookieWHL();
            if (whl.messageStatus != size) {
                system = 2 | system;
            }
            __Storage.setCookieWHL(size, system, whl.heartTime, whl.focusTime);
        },

        /**
         * 强制更新有消息的用户数
         * @param size
         */
        forcedUpdateNumberOfPeople:function(size, system) {
            var whl = __Storage.getCookieWHL();
            __Storage.setCookieWHL(size, system, whl.heartTime, whl.focusTime);

        } ,
        setAndGetFocusTime:function(focusTime) {
            if (focusTime) {
                var whl = __Storage.getCookieWHL();
                __Storage.setCookieWHL(whl.messageStatus, whl.system, whl.heartTime, focusTime);
                __Storage.setAndGetFocusTime(focusTime);
                return focusTime;
            }
            return __Storage.setAndGetFocusTime();
        },

        /**
         * 插入一个用户的消息。
         * @param userId
         * @param addMessage
         *[{"userId":"cntaobaoailing16","fromId":"cntaobaoailing17","sendTime":"2010-08-26 13:15:12","content":"HELLO","type":1,"subType":0}
         */
        addMessage:function(userId, addMessage) {
            var allUserMessages = __Storage.getItem(KEYS.MESSAGE_LIST);
            if (!allUserMessages[userId]) {
                allUserMessages[userId] = addMessage;
            } else {
                for (var i = 0; i < addMessage.length; i++) {
                    if (!Util.contains(allUserMessages[userId], addMessage[i])) {
                        allUserMessages[userId].push(addMessage[i]);
                    }
                }
                while (allUserMessages[userId].length > 20) {//超过20条后，前面的删除
                    allUserMessages[userId].shift();
                }
            }
        } ,

        /**
         * 所有的消息一次性插入
         * @param userId
         * @param messages
         *[{"userId":"cntaobaoailing16","fromId":"cntaobaoailing17","sendTime":"2010-08-26 13:15:12","content":"HELLO","type":1,"subType":0}]
         */
        addAllMessage:function(userId, messages) {
            var mes = __Storage.getItem(KEYS.MESSAGE_LIST);
            mes[userId] = messages;
            __Storage.setItem(KEYS.MESSAGE_LIST, mes);
            while (messages.length > 20) {  //超过20条后，前面的删除
                messages.shift();
            }
        } ,

        /**
         * 删除一个用户的消息
         */
        deleteMessage:function(userId) {
            var messages = __Storage.getItem(KEYS.MESSAGE_LIST);
            if (messages[userId]) {
                messages[userId] = [];
            }
            __Storage.setItem(KEYS.MESSAGE_LIST, messages);
        } ,

        /**
         * 取一个用户的消息
         * @param userId
         */
        getAllMessages:function(userId) {
            return __Storage.getItem(KEYS.MESSAGE_LIST)[userId] || [];
        },

        /**
         * 取到发送心跳时间。
         */
        getHeartTime:function() {
            return __Storage.getCookieWHL().heartTime;
        },
        /**
         * 发送心跳时间进程内有效。
         * @param time
         */
        setHeartTime:function(time) {
            var whl = __Storage.getCookieWHL();
            __Storage.setCookieWHL(whl.messageStatus, whl.system, time, whl.focusTime);
        },
        startHeartTime:function(time) {
            var whl = __Storage.getCookieWHL();
            __Storage.setCookieWHL(whl.messageStatus, whl.system, time, whl.focusTime);
        },
        /**
         * 写消息状态
         * @param status
         */
        setMessageStatus:function(status, system) {
            var whl = __Storage.getCookieWHL();
            __Storage.setCookieWHL(status, system, whl.heartTime, whl.focusTime);
        },
        getCookieWHL:function() {
            return  __Storage.getCookieWHL();
        },
        setCookieWHL:function(messageStatus, system, heartTime, focusTime) {
            __Storage.setCookieWHL(messageStatus, system, heartTime, focusTime);
        },
        getLoginKey:function() {
            return  __Storage.getPublicKey();
        },
        setLoginKey:function(value) {
            __Storage.setPublicKey(value);
        },


        /**
         * 只有一个用户的时候点状态图标跳出聊天窗口。
         */
        __checkOneUserMessage:function(result) {
            if (result.talkUserStatus && result.talkUserStatus.userId) { //点击右下角亮灯，自动选择一个用户。
                var talkUser = result.talkUserStatus;
                if(talkUser.userId.length <= 8){
                    TDog.Util.detect('ww.1.20.1.1.8', this.getNickName());
                }
                if (result.single) {
                    var userInfo = {
                        userName : result.user.nick,
                        userId:talkUser.userId,
                        relation:talkUser.relation,
                        status:talkUser.statusType
                    };
                    // 显示聊天窗口
                    TDog.ChatDialog.show(userInfo, userInfo.userId.indexOf('cntaobao') === 0);
                } else {
                    TDog.ChatDialog.updateUserStatus(result.user.nick, talkUser.statusType);
                }
            }
        } ,

        /**
         * 检查聊天对象是否淘宝帐号。
         */
        __isTaobaoUser:function(user, item) {
            if (user.userChatId.indexOf("cntaobao") === 0) {
                var dataView = item.title ? {'user':user,'item': item} : {'user': user};

                TDog.ChatDialog.showInfo(dataView);
            }
        } ,

        /**
         *保存用户开始聊天后start.do取回来的消息。
         * @param result
         */
        __saveAndViewChatMessage:function(result) {  //更新取消息时间。
            var user = result.user;
            this.updateMessageTime(user.userChatId, result.timeStamp);
            //保存聊天记录
            if (result.messages && result.messages.length) {
                if (result.all) {
                    this.addAllMessage(user.userChatId, result.messages);
                } else {
                    this.addMessage(user.userChatId, result.messages);
                }
            }
            TDog.ChatDialog.updateMsg(); //显示聊天记录            
        } ,

        /**
         * 更新还剩几个人没有取消消息
         */
        __updateNuberOfPeople:function(result) {
            //更新还有几个人有消息。
            this.forcedUpdateNumberOfPeople(result.size, 0);
            // S.log('receive result size:' + result.size);
            if (result.size == 0) {
                EventCenter.fire(EVENTS.UPDATE_STATUS_ICON, {data:{mSize:0}});
            } else {
                EventCenter.fire(EVENTS.RECEIVE_CHAT_MESSAGE, {'unreadMsgPersonCount':result.size});
            }
        },
        hash:function() {
            return [2, 13, 28, 9, 18, 27, 23, 20, 17, 27, 7, 9, 29, 25, 5, 24];
        }
    };
});
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk ft=javascript nobomb:
/**
 * 消息管理
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2010-04-19
 */

TDog.add('DataManager.Message', function(TDog) {

    var S = KISSY, __Storage, EventCenter, Daemon,NotifyDaemon,CD,WS,
        DataManager = TDog.DataManager,

        EVENTS = TDog.EVENTS,
        SUB_TYPE = TDog.MESSAGE_SUBTYPE,
        TYPE = TDog.MESSAGE_TYPE,

        KEYS = {
            LAST_LOGIN: '_last_login', // 最后登录时间
            SYSTEM_MESSAGE: '_system_message',
            HAS_NEW_MESSAGE: '_have_new_message'
        };

    if (!S.isPlainObject(DataManager)) {
        return;
    }

    DataManager.Message = {
        init: function() {
            S.log('初始化 Message 模块');
            __Storage = TDog.LocalStorage;
            EventCenter = TDog.EventCenter;
            Daemon = TDog.Daemon;
            NotifyDaemon = TDog.NotifyDaemon;
            WS = TDog.WebServer;
            CD = TDog.ChatDialog;
        },

        saveGetData: function(data) {
            var self = this, item, subType, result, unreadMsgPersonCount = 0;

            if (data.success.toLowerCase() == 'true') {
                if (data.result.messages) { //有消息存在
                    result = data.result.messages;
                    unreadMsgPersonCount = data.result.size; //收到消息的人数。

                    for (var i = 0, len = result.length; i < len; i++) {
                        item = result[i];
                        subType = parseInt(item['subType'], 10);   //子类型。

                        switch (parseInt(item.type, 10)) {  //

                            // 退出通知
                            case TYPE.LOGOUT:
                                S.log('收到退出通知，停止请求轮询', 'warn');

                                EventCenter.fire(EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: item});
                                return; // 收到退出消息，处理后，立刻退出
                                break;

                            // 更新用户状态
                            case TYPE.STATUS:
                                var userId = item.changedUserId || '';
                                if (userId) {
                                    S.log('收到用户 ' + userId + ' 的状态更新信息');
                                    EventCenter.fire(EVENTS.UPDATE_USER_STATUS, {data: item});
                                }
                                break;

                            // 系统消息
                            case TYPE.SYSTEM:
                                switch (subType) {
                                    case SUB_TYPE.SUBSCRIBE_MESSAGE:  // 系统提醒
                                        EventCenter.fire(EVENTS.RECEIVE_SUBSCRIBE_MESSAGE, {data: item});
                                        break;

                                    case SUB_TYPE.POPUP_MESSAGE: // 系统浮起
                                        //   self.system.save(item);       //TODO
                                        EventCenter.fire(EVENTS.RECEIVE_POPUP_MESSAGE, {data: item});
                                        break;
                                }
                                break;

                            case TYPE.OFFLINE:// 离线消息
                            case TYPE.SELF://发送出去的消息
                            case TYPE.TALK:// 聊天消息
                                S.log("接受到正常的聊天数据,ERROR`");
                                break;
                        }
                    }
                }
            }
        },

        /**
         * 重新获取焦点的时候。检查有没有打开的聊天窗口。
         * @isClear 清除人数。
         *@isFocused 是否直实焦点
         */
        checkCurrentUserMessage:function(isClear, isFoused) {
            var u = CD.getCurrentChatUserId();
            if (u) {
                //S.log('receive message:' + u + "," + isFoused + ',' + isClear);
                WS.receiveMessage(u, isFoused, isClear);
                return true;
            }
            return false;
        } ,

        clearAll: DataManager.clearAll
    };
});
/**
 * @module 守护进程，维护心跳
 * 分工：明城负责
 * 更新：重写 by yubo @2010-06-24
 */
TDog.add('Daemon', function(TDog) {

    var S = KISSY, Event = S.Event,
        Util, EventCenter, __Storage, WebServer, DataManager,Config, StatusIcon, NotifyDaemon, SysTips,ChatDialog,EVENTS,
        isFocused = false,
        isRunning = false,
        LOCAL_GET_TIMEOUT = 800,
        LOCAL_GET_TIMEOUT2 = 1200;
    /**
     * 本地轮训
     */
    TDog.Daemon = {
        /**
         * 初始化函数
         */
        init: function() {
            S.log('初始化 Daemon 模块');
            var self = this;

            Util = TDog.Util;
            EventCenter = TDog.EventCenter;
            __Storage = TDog.LocalStorage;
            WebServer = TDog.WebServer;
            DataManager = TDog.DataManager;
            Config = TDog.Config;
            StatusIcon = TDog.StatusIcon;
            SysTips = TDog.SysTips;
            NotifyDaemon = TDog.NotifyDaemon;
            ChatDialog = TDog.ChatDialog;
            EVENTS = TDog.EVENTS;

            self._bindEvent();
        },
        /**
         * 开始轮询
         */
        start: function() {
            var self = this;
            isRunning = true;
            isFocused = true;
            DataManager.setAndGetFocusTime(new Date().getTime());    //更新告诉本页面获取了焦点。
            self.fire();
        },
        /**
         * 调整时间间隔
         */
        fire: function() {
            try {
                var self = this;
                if (self.timer) {
                    self.timer.cancel();
                }
                //   S.log('本地轮训:' + (isRunning + ',' + (isFocused + ',' + self.notHaveFocusedPage())));
                var nextTime = ChatDialog.isOpen() ? LOCAL_GET_TIMEOUT : LOCAL_GET_TIMEOUT2,whl = null;      //打开聊天窗口500MS一次。没有打开1500MS一次。
                if (isRunning && isFocused) {
                    whl = DataManager.getCookieWHL();
                    if (whl.system > 0) {
                        DataManager.setCookieWHL(whl.messageStatus, 0, whl.heartTime, whl.focusTime);
                        if ((whl.system & 1) == 1) { //取完系统消息后再提示。
                            EventCenter.fire(EVENTS.DAEMON_FIRE);
                        }
                        if ((whl.system & 2) == 2) {
                            DataManager.Message.checkCurrentUserMessage(false, true);
                        }
                    }

                } else if (self.notHaveFocusedPage()) {   //本页面是否要轮训。
                    //  S.log('无其它焦点:' + self.notHaveFocusedPage());
                    whl = DataManager.getCookieWHL();
                    if ((whl.system & 2) == 2) {
                        DataManager.setCookieWHL(whl.messageStatus, 0, whl.heartTime, whl.focusTime);
                        DataManager.Message.checkCurrentUserMessage(false, false);
                    }
                }
                self.execute(whl, nextTime);
            } catch(e) {
                S.log('轮询出错了。');
                if (self.timer) {
                    self.timer.cancel();
                }
                self.timer = S.later(function() {
                    self.fire();
                }, LOCAL_GET_TIMEOUT);
            }
        },
        execute:function (whl, nextTime) {
            var self = this;
            if (Config.NOTIFY_STATUS.logout.value == whl.messageStatus) {
                EventCenter.fire(EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                return;
            } else if (whl.messageStatus > 0) {
                if ((!ChatDialog.isOpen()) && (!StatusIcon.onNewMessage())) {
                    EventCenter.fire(EVENTS.RECEIVE_CHAT_MESSAGE, {'unreadMsgPersonCount': whl.messageStatus});
                }
            }
            self.timer = S.later(function() {
                self.fire();
            }, nextTime);
        },

        /**
         * 停止 Daemon
         */
        stop: function() {
            var self = this;
            if (isRunning) {
                S.log('停止本地轮询。');
                if (self.timer) {
                    self.timer.cancel();
                }
                isRunning = false;
            }
        },
        /**
         * 有没有下个淘宝的WEB旺旺的页面获取焦点。
         */
        notHaveFocusedPage:function() {
            return DataManager.haveNotFocusedPage();
        },
        /**
         * 是否在焦点页面。
         */
        isFocused: function() {
            return isFocused;
        },
        /**
         * 绑定窗口对应切换事件
         */
        _bindEvent: function() {
            var self = this, win = window;
            isFocused = true;
            DataManager.setAndGetFocusTime(new Date().getTime());
            Event.on(win, 'focus', function() {   //窗口获取焦点事件。
                S.log('当前窗口获得焦点');
                isFocused = true;

                if (DataManager.isLogin()) {
                    // 如果已登录，并且此时还处于焦点
                    if (isFocused) {
                        if (!self.notHaveFocusedPage()) { //当前重新获取焦点页不是最后和轮询页.
                            DataManager.setAndGetFocusTime(new Date().getTime());
                            DataManager.Message.checkCurrentUserMessage(false, true);  //检查有没有打开的聊天窗口。
                        } else {
//                            DataManager.Message.checkCurrentUserMessage(true, true);  //检查有没有打开的聊天窗口。
                        }

                        self.start();
                        NotifyDaemon.restart();

                        SysTips.hide();

                        EventCenter.fire(EVENTS.RECEIVE_CHAT_MESSAGE, {'unreadMsgPersonCount': DataManager.getTotalUnreadMsgCount()});
                    }
                } else {
                    EventCenter.fire(TDog.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                }
            });

            Event.on(win, 'blur', function() { //窗口失去焦点事件
                S.log('当前窗口失去焦点。');
                isFocused = false;
            });
        }
    };

    /**
     * 长连接服务器端的通知
     */
    var LONG_REQUEST_HEART_TIMEOUT = 7000,isLongConnectionRuning = false,CREATE_CONNECTION = -9,errorRetryConnection = 15000,checkConnectionTimes = 1,__connection = undefined;
    TDog.NotifyDaemon = {
        init:function() {
            var __self = this;
            __self.restart();
            S.log('初始化长连接部份.');
        },
        /**
         * 开始处理，长连接，在登录成功后调用。
         */
        start:function() {
            var __self = this;
            isLongConnectionRuning = true;
            DataManager.startHeartTime(CREATE_CONNECTION);
            __self.__createConnection();

            S.log('登录完成，开始长连接.');
        },
        /**
         * 在页面焦点切换的时候，如果原来离线，变成成功的情况。重新开始检查远程连接的心跳。
         */
        restart:function() {
            var __self = this;
            isLongConnectionRuning = true;
            __self.__heartTimeout();
        },
        /**
         * 退出登录的时，停止本地心跳和本长连接。
         */
        stop:function() {
            var __self = this;
            if (isLongConnectionRuning) {
                S.log('停止外部长链接检查。');
                if (__self.heartTimeoutTimer) {
                    __self.heartTimeoutTimer.cancel();
                }
                isLongConnectionRuning = false;
            }
        },
        /**
         * 建立远程连接。用Iframe实现。。。JSONP方式会一直显示加载中。。。
         */
        __createConnection:function() {
            var __self = this;
            try {
                __connection = document.createElement('iframe');
                __connection.width = 0;
                __connection.height = 0;
                __connection.style.display = 'none';
                __connection.src = Config.notifyUrl;
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(__connection, body.lastChild);
            } catch(e) {
                S.log('远程连接异常了……' + e);
            }
        },
        /**
         * 检查远程连接的心跳有没有超时。
         */
        __heartTimeout:function() {
            var __self = this;
            if (__self.heartTimeoutTimer) {
                __self.heartTimeoutTimer.cancel();
            }
            if (isLongConnectionRuning) {
                __self.heartTimeoutTimer = S.later(function() {
                    var heart = DataManager.getCookieWHL();
                    S.log('检查长链接，重新开始:' + (new Date().getTime() - heart.heartTime > LONG_REQUEST_HEART_TIMEOUT) + ',' + (new Date().getTime() - heart.heartTime)
                        + ',' + new Date().getTime() + ',' + heart.heartTime);
                    if (heart.heartTime == CREATE_CONNECTION ||
                        (new Date().getTime() - heart.heartTime > LONG_REQUEST_HEART_TIMEOUT
                            && heart.heartTime !== CREATE_CONNECTION && heart.messageStatus !== Config.NOTIFY_STATUS.logout.value)) {
                        if (__connection) {
                            S.log('长链接的frame已经存在。');
                            __connection.src = Config.notifyUrl;
                        } else {
                            __self.__createConnection();
                            S.log('长链接的frame不已经存在。');
                        }
                        DataManager.setHeartTime(CREATE_CONNECTION);
                        isLongConnectionRuning = true;
                        __self.__checkConnection();
                    }
                    __self.__heartTimeout();
                }, LONG_REQUEST_HEART_TIMEOUT);
            }
        },
        /**
         * 检查是否连接真的建立起来了。
         */
        __checkConnection:function() {
            var __self = this;
            if (checkConnectionTimes++ < 4) {
                S.later(function() {
                    if (DataManager.getHeartTime() === CREATE_CONNECTION) {//链接没有建立起来
                        if (__connection) {
                            S.log('长链接的frame已经存在。');
                            __connection.src = Config.notifyUrl;
                        } else {
                            __self.__createConnection();
                            S.log('长链接的frame不已经存在。');
                        }
                    }
                }, errorRetryConnection);
            }
        }
    };
});// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix ft=javascript fenc=gbk nobomb:
/**
 * @module 与 Web 服务器的通信
 * 分工：rentong ziya修改。
 */
TDog.add('WebServer', function(TDog) {
    var S = KISSY,
        Cookie = S.Cookie,
        Config = TDog.Config,
        DataManager = TDog.DataManager,
        EVENTS = TDog.EVENTS,
        EventCenter = TDog.EventCenter,
        Daemon = TDog.Daemon,
        UP_TIME = 0, // 存活时间
        REQUEST_TIMEOUT = 5000, // 超时时间
        SITES = TDog.SITES,
        FROM_SITE = SITES.TAOBAO,getLoginTimes = 1, // 默认发送站点
        tagTimes = 0,
    // API 地址以及回调
        CALLBACKS = {
//获取token
            'getToken' : {
                url: Config.getTokenUrl,
                callback: 'TDog.WebServer.globalToken'
            },
            // 登录
            'login': {
                url: Config.loginUrl,
                callback: 'TDog.WebServer.prepareLogin'
            },

            // 决定是否自动登录
            'checkautologin': {
                url: Config.checkAutoLogin,
                callback: 'TDog.WebServer.decideAutoLogin'
            },

            // 获取登录以后的结果
            'getloginresult': {
                url: Config.getLoginResultUrl,
                callback: 'TDog.WebServer.disposeLoginResult'
            },

            // 设置陌生人消息
            'setstrangermsg':{
                url: Config.setAutoLoginUrl,
                callback: 'TDog.WebServer.setStrangerMsgData'
            },


            //清空聊天人列表
            'clearchatlist': {
                url : Config.clearListUrl,
                callback: 'TDog.WebServer.clearChatListData'
            },
            //清空聊天人列表
            'clearchatmessage': {
                url : Config.clearListUrl,
                callback: 'TDog.WebServer.handClearChatMessage'
            },

            // 设置 登录以后的结果
            'setautologin': {
                url: Config.setAutoLoginUrl,
                callback:'TDog.WebServer.setAutoLoginData'
            },

            // 开始和某人聊天
            'start': {
                url: Config.startUrl,
                callback: 'TDog.DataManager.saveStartChatData'
            },                // 开始和某人聊天
            'receive': {
                url: Config.startUrl,
                callback: 'TDog.DataManager.handleReceiveMessage'
            },

            // 向目标用户发送聊天信息
            'send': {
                url: Config.sendUrl,
                'callback': 'TDog.WebServer.handleSendResult'
            },
            //轮询消息
            'get': {
                url: Config.getUrl,
                callback: 'TDog.DataManager.Message.saveGetData'
            },
            //用户列表.
            'getTalkUsers':{
                url:Config.getTalkUsers,
                callback :'TDog.WebServer.handleTalkUsers'
            },
            //收到消息应答
            'ackGetMessage':{
                url:Config.ackGetMessage,
                'callback':'TDog.WebServer.handleAckResult'
            },
            //收到消息应答
            'checkUserSeting':{
                url:Config.ackGetMessage,
                'callback':'TDog.WebServer.handUserSeting'
            },
            getServerKey:{
                url:Config,
                callback:'TDog.WebServer.handleLoginFirst'
            }
        };

    TDog.WebServer = {
        AUTO_LOGIN : {
            'autoLoginAndTip':1,
            'autoLoginNotTip' :2,
            'forcedLogin':3
        },
        /**
         * WebServer组件初始化。
         */
        init: function() {
            var self = this;
            self.getTokenNum = 1;
            S.log('初始化 WebServer 模块');
            self.getToken();
        },

        /**
         * 发送条 GET 请求至服务器 使用 JSONP 格式
         */
        _request: function(url, callback) {
            var n = DataManager.getNickUrlComponent(),nkh = n.length == 0 ? '' : '&nkh=' + n;
            url = url + nkh + '&appId=' + Config.appId;  //每个请求中带上appId
            S.log('[' + (new Date()) + '] ' + url + '&t=' + +new Date, 'info'); // 接口地址


            /**
             * NOTICE: 无法检测 onFailure 事件，所以使用 onTimeout
             */
            if (S.isFunction(callback.onFailure)) {
                callback.onFailure = callback.onTimeout;
            }

            TDog.Util.getScript(url + "&t=" + +new Date, {
                onSuccess: function() {
                    if (S.isFunction(callback.onSuccess)) {
                        callback.onSuccess.call(this);
                    }
                },

                onFailure: function() {
                    if (S.isFunction(callback.onFailure)) {
                        callback.onFailure.call(this);
                    }
                },

                onTimeout: function() {
                    if (S.isFunction(callback.onTimeout)) {
                        callback.onTimeout.call(this);
                    }
                },
                success: function() {
                    if ('function' === typeof callback.onSuccess) {
                        callback.onSuccess.call(this);
                    }
                },

                error: function() {
                    if ('function' === typeof callback.onFailure) {
                        callback.onFailure.call(this);
                    }
                },
                scope: this,
                charset: Config.charset || 'gbk', // 编码
                timeout: REQUEST_TIMEOUT // 超时时间
            });
        },

        sitePrefix: (function() {
            var siteStrArr = [], regexp = "";
            for (var i in SITES) {
                siteStrArr.push(SITES[i]);
            }
            return new RegExp('^(' + siteStrArr.join('|') + ')(.*)$', 'i');
        })(),

        /**
         * 格式化昵称，默认返回带 cntaobao 前缀
         *
         * @return string
         */
        formatNick: function(nickName) {
            var self = this, regexp = self.sitePrefix;
            if (regexp.test(nickName)) {
                return nickName;
            }
            return FROM_SITE + nickName;
        },

        getNick: function(nickName) {
            if (!nickName) return;
            var self = this, regexp = self.sitePrefix, match = nickName.match(regexp);
            if (match) {
                return ('undefined' != typeof match[2] && match[2]) ? match[2] : nickName;
            }
            return nickName;
        },

        getToken : function(){
            var self = this, method = "getToken",
                params = S.param({
                    'callback': CALLBACKS[method]['callback']
                });

            self._request(Config.getTokenUrl + '?' + params, {});
        },

        /**
         * 检查是否登录
         */
        setAutoLogin: function(num) {
            var self = this, method = "setautologin",
                params = S.param({
                    'token' : self.token,
                    'callback': CALLBACKS[method]['callback']
                });

            // 向服务器请求数据
            self._request(Config.setAutoLoginUrl + '?act=' + num + '&' + params, {});
        },

        setAutoLoginData : function(data) {
            this.__handleErrorResult(data);
        },
        setStrangerMsg : function(num) {
            var self = this, method = "setstrangermsg",
                params = S.param({
                    'token' : self.token,
                    'callback': CALLBACKS[method]['callback']
                });
            self._request(Config.setAutoLoginUrl + '?act=' + num + '&' + params, {});
        },
        setStrangerMsgData:function(data) {
            this.__handleErrorResult(data);
        },
        clearChatList : function() {
            var self = this, method = "clearchatlist",
                params = S.param({
                    'token' : self.token,
                    'callback': CALLBACKS[method]['callback']
                });
            self._request(Config.clearListUrl + '&' + params, {});
        },

        clearChatListData:function(data) {
            this.__handleErrorResult(data);
        },
        /**
         * 清空聊天记录。
         * @param nick
         */
        clearChatMessage:function(nick) {
            var self = this,method = 'clearchatmessage',
                params = S.param({'act':1,
                    'targetNick':nick,
                    'token' : self.token,
                    'callback':CALLBACKS[method]['callback']
                });
            self._request(Config.clearUrl + "?" + params, {});
        },
        handClearChatMessage:function(data) {
            this.__handleErrorResult(data);
        },

        /**
         * 检查是否登录
         */
        checkAutoLogin: function(callback) {
            var self = this, method = "checkautologin",
                params = S.param({
                    'token' : self.token,
                    'callback': CALLBACKS[method]['callback'],
                    'check':'1'
                });

            // 向服务器请求数据
            self._request(Config.checkAutoLoginUrl + '?cat=-1&' + params, callback || {});
        },
        /**
         * 检查用户自己的设置
         */
        checkUserSeting: function(callback) {
            var self = this, method = "checkUserSeting",
                params = S.param({
                    'token' : self.token,
                    'callback': CALLBACKS[method]['callback']
                    //'fromSite': FROM_SITE
                });

            // 向服务器请求数据
            self._request(Config.checkAutoLoginUrl + '?cat=-1&' + params, callback || {});
        },
        globalToken : function(data){
            var self = this;
            if(self.getTokenNum > 3) return;
            self.getTokenNum++;
            if(data.success.toLowerCase() === 'true'){
                self.token = data.result.token;;
                Daemon.init();
                // Web 旺旺已登录
                if (DataManager.isLogin()) {
                    EventCenter.fire(EVENTS.LOGIN_SUCCESS); // 告知外界已登录
                    //self.checkAutoLogin();
                    TDog.NotifyDaemon.init();
                    Daemon.start();
                } else if (DataManager.getNickName()) {// 淘宝已登录
                    // 判断后台设置是否自动登录
                    TDog.LocalStorage.init();
                    self.checkAutoLogin();
                } else {  // 未登录
                    TDog.LocalStorage.init();
                    S.log('阿里旺旺（未登录）');
                    TDog.SysTips.setHoverTips('阿里旺旺（未登录）');
                }
            }else{
                self.getToken();
            }
        },
        /**
         * 检查用户设置的回调。
         * @param data
         */
        handUserSeting:function(data) {
            var self = this;
            self.__handleErrorResult(data);
            if (data.success.toLowerCase() === 'true') {
                var result = data.result,
                    autoLogin = !(8192 & parseInt(result.tag, 10)),
                    strangerMsg = (16384 & parseInt(result.tag, 10));
                // 1. 如果设置了自动登录，则发起登录请求 测试帐号： tbtest472 / ailing1234
                //    注：上面仅针对 ie, 非 IE 浏览器，目前策略强制不自动登录
                // 2. 如果 TDog 配置里强制登录（比如来自旺旺点灯请求），则自动登录
                if (autoLogin) {
                    S.get("#tstart .tstart-settings-login").checked = true;
                } else {
                    S.get("#tstart .tstart-settings-login").checked = false;
                }
                if (strangerMsg) {
                    S.get("#tstart .tstart-settings-msg").checked = true;
                } else {
                    S.get("#tstart .tstart-settings-msg").checked = false;
                }
            }
        },

        /**
         * 决定是否自动登录
         *
         * 8192   2的13次 自动登陆设置  0 表示自动登录，1 表示不自动登录
         * 16384  2的14次 是否显示陌生人消息
         * 32768  2的15次 是否默认显示好友列表
         * 65536  2的16次 是否好友验证
         * 131072 2的17次 是否立即浮起
         */
        decideAutoLogin: function(data) {
            var self = this;
            self.__handleErrorResult(data);
            if (data.success.toLowerCase() === 'true') {
                if (data.result.tag == -1) { //服务器已经登录。
                    self.__completeLogin();
                } else {
                    var result = data.result, autoLogin = !(8192 & parseInt(result.tag, 10)), forceAutoLogin = TDog.Config.forceAutoLogin;

                    if (autoLogin && S.UA.ie) {
                        self.login(self.AUTO_LOGIN.autoLoginNotTip);
                    } else if (forceAutoLogin) {
                        S.log('满足自动登录条件，发起登录请求');
                        self.login();
                    } else {
                        S.log('不满足自动登录条件');
                    }
                }
            }
        },

        /**
         * 准备登录
         *
         * 获取 login.do 后的结果，然后判断是否需要继续登录
         */
        prepareLogin: function(data) {
            var self = this;

            if ("false" == data.success.toLowerCase()) {
                var code = parseInt((data.result.error[0] || {})['code']) || 0;
                switch (code) {
                    case -15:
                        TDog.SysTips.showClientOnlineTips();
                        TDog.Util.sendLog('wwweblog=logged');
                        break;
                    case -16: break;
                    default:
                        EventCenter.fire(EVENTS.ERROR_LOGIN_FAILED, {error: data.result.error[0]});
                }
            } else {
                self.getLoginResult();
            }
        } ,
        /**
         * 取到登录后的结果。
         */
        getLoginResult:function() {
            var __self = this;
            S.log('登录成功，过 1 秒钟获取登录后的结果');
            S.later(function() {
                var params = S.param({
                    time:getLoginTimes,
                    'token' : __self.token,
                    'callback': CALLBACKS['getloginresult']['callback']
                });
                //Server端的回调先调用：disposeLoginResult()在调用onSuccess()
                __self._request(Config.getLoginResultUrl + '?' + params, {
                    onSuccess: function() {
                        S.log('二次请求得到登录结果登录完成');
                        // 再次判断有无登录成功 如果成功，则开始轮询
                        if (DataManager.isLogin()) {
                            __self.get();// 立刻轮询一次，以尽快获取离线消息，并减少离线概率
                            TDog.NotifyDaemon.start();
                            Daemon.start();
                            EventCenter.fire(EVENTS.LOGIN_SUCCESS);
                            TDog.SysTips.show("阿里旺旺 - " + DataManager.getNickName() + "(在线)", "150", 5);

                            UP_TIME = new Date().getTime();
                            getLoginTimes = 1;
                        }
                    },
                    onFailure:function() {
                        EventCenter.fire(EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                    },
                    onTimeout:function() {
                        EventCenter.fire(EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                    }
                });
            }, getLoginTimes * 1000);
        },
        /**
         * 处理登录后的结果。Server端login.do完成后回调。
         *
         * @param data
         */
        disposeLoginResult:function(data) {
            var __self = this;
            S.log('登录:' + data.success);
            if (data.success.toLowerCase() === 'true') {
                DataManager.setLastLoginTime();
            } else {
                if (++getLoginTimes < 4 && data.result.error && data.result.error[0].code == -99) {//取登录结果，第一次1S取。如果失败，2S取。如果失败。3S后取。全失败，登录失败。
                    __self.getLoginResult();
                } else {
                    getLoginTimes = 1;
                    DataManager.resetLastLoginTime();
                    EventCenter.fire(EVENTS.ERROR_LOGIN_FAILED, {'error':(data.result.error || [])[0]});
                }
            }
        } ,

        /**
         * 登录操作
         *
         * 首次登陆获取最近联系人的列表的登录状态，下次轮询的时候返回改变的联系
         * 人的登录状态
         *
         * 考虑在登录状态下本地登录状态的保存，以及考虑注销时候的情况
         */
        login: function(autoLogin, callback) {
            var self = this, method = 'login',  params, loginTag = self.__encrypt();
            if (loginTag) {
                params = S.param({
                    'token' : self.token,
                    'callback': CALLBACKS[method]['callback'],
                    'nickName': DataManager.getNickName(),
                    'autoLogin': autoLogin || self.AUTO_LOGIN.autoLoginAndTip,
                    'loginTag':loginTag
                });

                EventCenter.fire(EVENTS.LOGIN_START);
                S.log('请求登录开始');
                self._request(Config.loginUrl + '?' + params, callback || {});
            }
        } ,

        /**
         * 开始和某人聊天
         */
        startChat: function(userId, itemId, callback, fromLight) {
            var self = this, method = 'start', params;

            params = S.param({
                'token' : self.token,
                'callback': CALLBACKS[method]['callback'],
                'userId': userId,
                'itemId': itemId || '',
                'fromLight': fromLight ? 'true' : 'false',
                'time':DataManager.getMessageTime(userId)
            });

            // 向服务器请求数据
            self._request(Config.startUrl + '?' + params, callback || {});
        },
        receiveMessage:function(userId, isFocused, isClear, callback) {
            var self = this, method = 'receive', params;

            params = S.param({
                'token' : self.token,
                'callback': CALLBACKS[method]['callback'],
                'targetUserChatId': userId,
                'focused':isFocused,
                'update':isClear,
                'time':DataManager.getMessageTime(userId)
            });

            // 向服务器请求数据
            self._request(Config.receiveUrl + '?' + params, callback || {});
        },

        /**
         * 发送消息
         */
        send: function(userId, content, callback) {
            var self = this, params;
            if (userId.length <=8 || !content.length) {
                TDog.ChatDialog.showSysTip("<p><span>消息发送失败，请尝试重新打开聊天窗口！</span></p>");
                return;
            }

            userId = self.formatNick(userId);

            params = S.param({
                'token' : self.token,
                'callback':CALLBACKS['send']['callback'],
                'userId': userId,
                'content': content
            });


            // 向服务器请求数据
//            console.log(Config.sendUrl + '?' + params);
            self._request(Config.sendUrl + '?' + params, callback || {});
        } ,

        /**
         * 获取发送以后的结果
         */
        handleSendResult:  function(result) {
            this.__handleErrorResult(result);
        } ,

        // 向服务器轮询获取信息
        get : function(callback) {
            var self = this, method = 'get', params;
            S.log('轮询获取信息');

            params = S.param({
                'token' : self.token,
                'callback': CALLBACKS[method]['callback']
                //'fromSite': FROM_SITE
            });

            self._request(Config.getUrl + '?' + params, {});
        } ,
        /***
         * 去聊天用户列表，点击后。
         * @param callback
         */
        getTalkUsers:function(callback) {
            var self = this,method = 'getTalkUsers', params = S.param({
                'token' : self.token,
                'callback': CALLBACKS[method]['callback']
            });
            self._request(Config.getTalkUsers + '?' + params, callback || {});
            S.log('取聊天人列表。')
        } ,
        /**
         * 聊天人列表分析显示
         * @getTalkUsers 方法的回调
         */
        handleTalkUsers:(function() {
            var times = 1;
            return function(data) {
                var isOnline = TDog.WebServer.__handleErrorResult(data);
                if (data.success == 'true') {
                    S.log('更新联系人列表成功：' + times);
                    TDog.RecentList.updateRecentlist(data.result.person);

                    if (data.result.person.length > 0) { //把聊天列表写入到本地内存
                        DataManager.setRecentList(data.result.person);
                    }
                    DataManager.forcedUpdateNumberOfPeople(data.result.size, 0);
                } else {
                    if (times++ < 4 && !isOnline) {
                        S.log('更新联系人列表失败，重试：' + times);
                        TDog.WebServer.getTalkUsers({});
                    } else {//TODO  是否要提示
                        S.log('更新联系人列表失败，重试三次或退出登录结束。');
                    }
                }
            }
        })(),
        /**
         * 收到消息应答
         * @userId 收到的消息的用户ID。
         * @num 收到的消息的条数。
         * @callback Ajax请求后回调。
         */
        ack : function(userId, num, callback) {
            var self = this, params;
            params = S.param({
                'token' : self.token,
                callback:CALLBACKS['ackGetMessage']['callback'],
                userId:userId,
                num:num
            });
            self._request(Config.ackGetMessage + '?' + params, callback || {});
        } ,
        /**
         * 轮询消息应答
         * @ack 方法回调
         */
        handleAckResult:function(data) {
            //轮询到消息后应答服务器后，回调不在做处理。
            S.log('收到消息应答:' + data.success);
            this.__handleErrorResult(data);
        } ,
        /**
         * 请求中出错处理。
         */
        __handleErrorResult:function(data) {
            if (data.success === 'false') {
                if (data.result.error[0]) {
                    if (data.result.error[0].code == -100 || data.result.error[0].code == -101 || data.result.error[0].code == -12) {
                        EventCenter.fire(TDog.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {data: {subType: 403}});
                        return true;
                    }
                }
            }
            return false;
        },
        __encrypt:function() {
            var self = this,key = DataManager.getLoginKey();
            if (key.length) {
                return self.__encryptKey();
            }
            self.__getServerKey();
        },
        __getServerKey:function() {
            var self = this, method = 'getServerKey',  params;
            params = S.param({
                'token' : self.token,
                'callback': CALLBACKS[method]['callback']
            });
            self._request(Config.TagKeyUrl + '?' + params, {});
        },
        __encryptKey:function() {
            var mabyKey = [],tag = '',self = this;
            var publicKey = DataManager.getLoginKey();
            var hash = self.__make();
            for (var i = 0; i < hash.length; i++) {
                tag += publicKey.charAt(hash[i]);
            }
            var uKey = encodeURIComponent(DataManager.getNickName()).charAt(2);


            return uKey + tag;
        },
        handleLoginFirst:function(data) {
            var self = this;
            if (data.success == 'true') {
                DataManager.setLoginKey(data.result.tagKey);
                if (tagTimes++ < 3) {
                    self.login();
                }
            } else {
                EventCenter.fire(EVENTS.ERROR_LOGIN_FAILED, {error: data.result.error[0]});
            }
        },
        __make:function() {
            var h = [];
            var h1 = DataManager.hash();
            var h2 = Config.hash;
            for (var i = 0; i < 16; i++) {
                h.push(Math.floor((h1[i]) + (h2[i]) / 7.3* 100) % 32);
            }
            S.log("hash:" + h.join(","));
            return h;
        },
        __completeLogin:function() {
            S.log('已经登录过后，完成登录。');
            DataManager.setLastLoginTime();
            // 再次判断有无登录成功 如果成功，则开始轮询
            if (DataManager.isLogin()) {
                this.get();// 取一次系统变化消息。
                TDog.NotifyDaemon.start();
                Daemon.start();
                EventCenter.fire(EVENTS.LOGIN_SUCCESS);
                //  TDog.SysTips.show("阿里旺旺 - " + DataManager.getNickName() + "(在线)", "150", 5);

                UP_TIME = new Date().getTime();
                getLoginTimes = 1;
            }
        },

        /**
         * 运行了多久？
         *
         * @return int
         */
        uptime: function() {
            return UP_TIME;
        }
    };
});
/**
 * @module 最近联系人列表
 * 分工：成阳负责
 */
TDog.add('RecentList', function(TDog) {
    var S = KISSY, DOM = S.DOM, Event = S.Event,
        DM = TDog.DataManager,
        EC = TDog.EventCenter,
        CD,
        Util = TDog.Util,
        pluginEl, container,
        TMPL_LIST = '<div class="tdog-recentlist"><ul>{ITEMS}</ul></div>',
        TMPL_ITEM = '<li class="tdog-recentlist-item tdog-status-{status}">' +
            '<i></i>' +
            '<span class="tdog-user-name" id="{userId}">{userName}</span>' +
            '<span class="tdog-msg-count">{msgCount}</span>' +
            '</li>';

    TDog.RecentList = {

        /**
         * 初始化操作
         */
        init: function() {
            pluginEl = TDog.hostEl;
            CD = TDog.ChatDialog;
            container = S.get('.tstart-tdog-panel-bd', TDog.hostEl);
            this._bindUI();
        },

        /**
         * 更新联系人列表，同时更新recentlist变量
         */
        update: function() {
            TDog.WebServer.getTalkUsers();
        },

        updateRecentlist:function(recentlist) {
            var i, len = recentlist.length, html = '';
            S.log('更新联系人列表');

            if (len === 0) {
                html = '<p class="tdog-recentlist-none">暂无联系人</p>';
                DOM.addClass(S.get(".tstart-tdog-panel-clearbtn",TDog.hostEl),'hidden');
            }else{
                DOM.removeClass(S.get(".tstart-tdog-panel-clearbtn",TDog.hostEl),'hidden');
            }

            for (i = len - 1; i >= 0; --i) {
                if (recentlist[i].size == 0 || recentlist[i].size == undefined || recentlist[i].userId == CD.getCurrentChatUserId())
                    recentlist[i].size = "";
                else
                    recentlist[i].size = "(" + recentlist[i].size + ")";
                recentlist[i].userName = TDog.Util.getUserName(recentlist[i].userId);
                recentlist[i].status = recentlist[i].statusType;

                html += Util.substitute(TMPL_ITEM, {
                    status : TDog.USER_STATUS[recentlist[i].status][0],
                    userName : Util.getUserName(recentlist[i].userId),
                    msgCount : recentlist[i].size,
                    userId:recentlist[i].userId
                });
            }

            html = TMPL_LIST.replace('{ITEMS}', html);
            container.innerHTML = html;
            DOM.removeClass(DOM.get('.tstart-tdog-panel-bd', '#tstart-plugin-tdog'), 'tstart-panel-loading');

        },//update

        close: function() {
            DOM.removeClass(TDog.hostEl, 'tstart-item-active');
            if (TDog.DataManager.isLogin() && DM.getTotalUnreadMsgCount() > 0) {
                TDog.StatusIcon.getmessage();
            }
        },

        /**
         * 是否处于展开状态
         */
        isOpen: function() {
            return DOM.hasClass(pluginEl, 'tstart-item-active');
        },

        /**
         * 绑定事件
         */
        _bindUI: function() {
            var checkTar = function(e) {
                var tar = e.target;
                if (tar.parentNode.nodeName.toUpperCase() == "LI") {
                    tar = tar.parentNode;
                }
                if (tar.nodeName.toUpperCase() == "LI") {
                    return tar;
                }
                return false;
            }, tar, host = this;

            Event.on(container, 'click', function(e) {
                tar = checkTar(e);
                if (tar) {
                    var userId = S.get(".tdog-user-name", tar).id;
                    if (TDog.ChatDialog.checkDialogOpen(userId))
                        return;

                    var userInfo = DM.getUser(userId);
                    if (userInfo) {
                        EC.fire(TDog.EVENTS.SHOW_CHAT_DIALOG, { userInfo:userInfo });
                        //将消息数置空
                        S.get(".tdog-msg-count", tar).innerHTML = "";
                    }
                }
            });

            Event.on(container, 'mouseover mouseout', function(e) {
                tar = checkTar(e);
                if (tar && tar.getAttribute("current") != "true") {
                    DOM.toggleClass(tar, 'tdog-recentlist-hover');
                }
            });

            Event.on(container, 'mousedown mouseup', function(e) {
                tar = checkTar(e);
                if (tar) {
                    DOM.toggleClass(tar, 'tdog-recentlist-select');
                }
            });
            /**
             * 添加一个事件，关闭联系人列表时检查人数
             */
            Event.on(window, 'click', function() {
                if (DM.isLogin() && DM.getTotalUnreadMsgCount() > 0) {
                    TDog.StatusIcon.getmessage();
                }
            });

            //清空聊天列表
            Event.on(TDog.hostEl, 'click', function(ev) {
                var target = ev.target;
                if (DOM.hasClass(target, 'tstart-tdog-panel-clearbtn')) {
                    TDog.WebServer.clearChatList();
                    S.get("#tstart .tdog-recentlist").innerHTML = '<ul><p class="tdog-recentlist-none">暂无联系人</p></ul>';
                    DOM.addClass(S.get(".tstart-tdog-panel-clearbtn", TDog.hostEl), 'hidden');
                }
                if (DOM.hasClass(target, 'tstart-tdog-panel-closebtn') || ('img' === target.tagName.toLowerCase() && DOM.parent(target, '.tstart-tdog-panel-closebtn')) ) {
                    host.close();
                }
            });

        }
    };
});
/**
 * @module 聊天窗口管理器
 * 分工：成阳负责
 */
TDog.add('ChatDialog', function(TDog) {

    var S = KISSY, DOM = S.DOM, Event = S.Event,T = TStart,
        encode = encodeURIComponent,
        EC = TDog.EventCenter, WebServer = TDog.WebServer, Config = TDog.Config, Util = TDog.Util,
        doc = document,win = window,
        DOMAIN = T.Config.DOMAIN,
        isOnline = T.Config.isOnline,
        dialog_list = [],dialogEl,currentDialog,faceContainer,userdata,
    //广告tms数据
        adLinkData = null,
    //黄条tms数据
        bulletinData = null,
        temp = /*S.UA.ie ? '<div class="tdog-popup-tms-bullet tdog-ie">' +
         '<div class="tdog-lt"></div>' +
         '<div class="tdog-popup-tms-bulletin"></div>' +
         '<div class="tdog-rt"></div>' +
         '</div>'
         : */
            '<div class="tdog-popup-tms-bullet">'+
                '<div class="tdog-popup-tms-bulletin"></div>'+
                '</div>',
    //对话框html模板
        DIALOG_TEMP = '<div class="tdog-popup tdog-popup-blue '+(S.UA.ie ? "tdog-ie": '') + '" style="width:416px;bottom:40px;overflow:normal;">' +
            //(S.UA.ie ? '<span class="rc-tp"><span></span></span>' : '') +
            '<div class="tdog-popup-head" >' +
            '<div><i class="tdog-status-"></i><div><span class="tdog-popup-contact"></span></div></div>' +
            '<span class="tdog-popup-tools">' +
            '<span title="帮助" class="tdog-popup-help"></span><span title="关闭" class="tdog-popup-close"></span>' +
            '</span>' +
            '</div>' +
            '<div class="tdog-popup-main">' +
            '<div class="tdog-popup-talkleftouter">' +
            '<div class="tdog-popup-talkleftinner"><div class="tdog-popup-talkcontainer">' +
            temp+
            '<div class="tdog-popup-talkhistory">' +
            '</div>' +
            '<div class="tdog-popup-talkbar">' +
            '    <span title="表情"></span>' +
            '    <span class="tdog-popup-talkbar-clear" title="清空聊天记录"></span>' +
            '    <a title="聊天记录" href="#" target="_blank"><i></i>聊天记录</a>' +
            '</div>' +
            '<div class="tdog-popup-talkinput">' +
            '    <textarea cols="5"></textarea>' +
            '</div><a title="隐藏右边栏" class="tdog-popup-pulloff" href="javascript:void(0);"><span></span></a></div>' +
            '<div class="tdog-popup-talkfoot">' +
            '<span class="tdog-popup-tms-ad">'+
            '</span>' +
            '   <span class="tdog-popup-sendbut">' +
            '     <span class="tdog-popup-send">发送</span>' +
            '     <span class="tdog-popup-changesend"></span>' +
            '<ul>' +
            '<li><i></i><span>按Ctrl+Enter发送</span></li>' +
            '<li class="tdog-send-mode"><i></i><span>按Enter发送</span></li>' +
            '</ul>' +
            '</span>' +
            '</div>' +
            //'<div title="隐藏右边栏" class="tdog-popup-pulloff"></div>' +
            '</div>' +
            '</div>' +
            '<div class="tdog-popup-talkright">' +
            '</div>' +
            '<div class="tdog-popup-clear"></div>' +
            '</div>' +
            // '<iframe class="tdog-popup-mask" frameborder="0" scrolling="no" ></iframe>' +
            //(!S.UA.ie ? '<span class="rc-bt"><span></span></span>' : '') +
            '<div class="tdog-popup-handle"></div>'+
            '<div class="tdog-popup-handle-x"></div>'+
            '<div class="tdog-popup-handle-y"></div>'+
            '</div>';

    TDog.ChatDialog = {

        /**
         * 不需要在工具条加载时创建
         */
        init: function() {

        },

        /**
         * 显示聊天窗口下方广告链接
         */
        showAdLink: function(data,currentDialog) {
            var el = S.get('a.tdog-popup-tms-link', currentDialog);
            if (el && data.href && data.title) {
                el.innerHTML = data.title;
                DOM.attr(el, 'href', data.href);
                adLinkData = data;
            }
        },
        /**
         * 显示黄条公告
         */
        showBulletin: function(data) {
            S.later(function() {
                var el = S.get('div.tdog-popup-tms-bulletin', currentDialog),
                    msgContainer = S.get("div.tdog-popup-talkhistory", currentDialog),
                    pop_right = S.get("div.tdog-popup-talkright", currentDialog),
                    pull_but_classname = pop_right.style.display != "none" ? "tdog-popup-pulloff" : "tdog-popup-pullon",
                    pull_but = S.get("a."+pull_but_classname, currentDialog),
                    footTMSContainer = S.get("span.tdog-popup-tms-ad",currentDialog),
                    h;
                if (el && data.title && data.url && data.href){
                    var bulletinBtn = doc.createElement("div");
                    bulletinBtn.className = 'tdog-popup-tms-bulletin-close';
                    el.innerHTML = "<i></i><a href="+data.url+" target='_blank'>" + data.title + "</a>";
                    el.appendChild(bulletinBtn);

                    if (data.href == 'taobao' && DOMAIN == 'taobao.com' ) {
                        DOM.css(el.parentNode,"display","block");
                    }
                    else if (data.href == 'daily' && DOMAIN == 'taobao.net'){
                        DOM.css(el.parentNode,"display","block");
                    }
                    h = (el.innerHTML && DOM.parent(el).style.display =='block') ? msgContainer.offsetHeight-22 : msgContainer.offsetHeight;
                    DOM.css(msgContainer,"height",h);
                    bulletinData = data;
                }

                if(footTMSContainer && data.adUrl && data.adText){
                    footTMSContainer.innerHTML = "<a href="+data.adUrl+" target='_blank'>"+data.adText+"</a>";
                }

                if(msgContainer) {
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }
            }, 800, false)
        },


        /**
         *    创建聊天对话框
         *    每个ID对应一个聊天对话框
         *    @param fromtaobao 是否是淘宝网用户(不是 则不显示侧边栏消息)
         */
        _create: function(fromtaobao) {
            var id = WebServer.formatNick(userdata.userId), self = this;

            if (!fromtaobao) {
                var want_replaced = '<a title="隐藏右边栏" class="tdog-popup-pullon" style="display:none"></a>' +
                    '</div>' +
                    '</div>' +
                    '<div class="tdog-popup-talkright" >' +
                    '</div>', temp, pop_left;
                temp = DIALOG_TEMP.replace(want_replaced, "</div></div>");
                dialogEl = DOM.create(temp);
                DOM.css(dialogEl,"width","253px");
                pop_left = S.get("div.tdog-popup-talkleftinner",dialogEl);
                DOM.css(S.get("div.tdog-popup-talkright",dialogEl),"display","none");
                DOM.css(pop_left, "margin-right", "6px");
                DOM.css(S.get("div.tdog-popup-talkhistory",dialogEl),"width","auto");

            } else {
                dialogEl = DOM.create(DIALOG_TEMP);
            }
            dialog_list.push(new Array(id, dialogEl));
            S.get("#tstart").appendChild(dialogEl);//添加到淘宝工具条
            if (!fromtaobao) S.get("a.tdog-popup-pulloff").style.display = "none";
            DOM.css(dialogEl, "display", "block");
            this._bindUI(dialogEl);

            //聊天记录链接
            var but = S.get("div.tdog-popup-talkbar", dialogEl).getElementsByTagName("a")[0],
                uid = encode(encode(encode(TDog.DataManager.getNickName()))),
                tid = encode(encode(encode(id))),
                target = 'http://www2.im.alisoft.com/webim/online/chat_record_search.htm?from_im=webwangwang&signmode=im&type=0&u_id=cntaobao'
                    + uid + '&t_id=' + tid + '&sign_account=' + uid;
            if (but) but.href = 'http://sign.im.alisoft.com/sign/aso?domain=taobao&target=' + target + '&_input_charset=utf-8';



            //配置拖动
            var drag = new S.Drag(dialogEl, {
                handle:'.tdog-popup-head',
                not:['.tdog-popup-help','.tdog-popup-close'],
                scroll:true
            });

            drag.onStartDrag = function(e, elem) {
                DOM.css(elem, 'bottom', 'auto');
            };

            //chrome下光标变成I fix
            Event.on(S.get("div.tdog-popup-head",dialogEl),'selectstart',function(e){
                e.halt();
            });

            //拖动主函数
            DragFn = function(e,elem,config,x,y,_elem){
                var dialogEl = _elem,
                    talkhistory = S.get("div.tdog-popup-talkhistory",dialogEl),
                    talkright = S.get("div.tdog-popup-talkright",dialogEl),
                    main = S.get("div.tdog-popup-main",dialogEl),
                    pulloff = S.get("a.tdog-popup-pulloff",dialogEl),
                    send_but = S.get("span.tdog-popup-sendbut", dialogEl),
                    pullon = S.get("a.tdog-popup-pullon",dialogEl),
                    bullet = S.get('div.tdog-popup-tms-bullet', dialogEl),
                    h  = bullet.style.display == "block" ? elem.offsetHeight - 163 +"px" : elem.offsetHeight - 141 +"px";

                //拖动时需保持外框overflow:hidden;
                if(DOM.hasClass(dialogEl,"tdog-popup-visible")){
                    DOM.removeClass(dialogEl,"tdog-popup-visible");
                }

                DOM.css(talkhistory,"width","auto");
                DOM.css(talkhistory,"marginRight","5px");
                DOM.css(main,"height",elem.offsetHeight - 28 + "px");

                if(DOM.css(talkright,"display") !== "none") {
                    DOM.css(talkright,"height",elem.offsetHeight -37 + "px");
                }

                DOM.css(talkhistory,"height",h);
                DOM.css((function(){
                    return (pulloff ? pulloff : pullon)
                })(),"height",elem.offsetHeight -141 + "px");


                //fix ie6 reflow
                if(6 === S.UA.ie) {
                    DOM.addClass(send_but,"reflow-fix");
                    DOM.removeClass(send_but,"reflow-fix");
                }
            }

            //双向拖动
            var drag2 = new S.Drag(dialogEl, {
                resize:true,
                handle:'.tdog-popup-handle',
                resizefn:[417,291]
            });
            drag2.onStartDrag = function(e,elem,config){
                var el = S.get("div.tdog-popup-talkright",dialogEl);
                config.resizefn = (DOM.css(el,"display") === "none") ? [270,291] : [417,291]
            }

            drag2.onDrag = function(e,elem,config,x,y,_elem){
                var dialogEl = _elem;
                DragFn(e,elem,config,x,y,_elem)
            }
            //横向拖动
            var drag3 = new S.Drag(dialogEl, {
                resize:true,
                handle:'.tdog-popup-handle-x',
                resizefn:[false,291]
            });
            drag3.onDrag = function(e,elem,config,x,y,_elem){
                var dialogEl = _elem;
                DragFn(e,elem,config,x,y,_elem);
            }

            //纵向拖动
            var drag4 = new S.Drag(dialogEl, {
                resize:true,
                handle:'.tdog-popup-handle-y',
                resizefn:[417,false]
            });
            drag4.onStartDrag = function(e,elem,config,x,y,_elem){
                var dialogEl = _elem,
                    el = S.get("div.tdog-popup-talkright",dialogEl);

                config.resizefn = (DOM.css(el,"display") === "none") ? [270,false] : [417,false]

            }
            drag4.onDrag = function(e,elem,config,x,y,_elem){
                DragFn(e,elem,config,x,y,_elem)
            }


            //获取TMS内容
            Util.getTmsContent([
////				{
////					'data':adLinkData,
////					'link':Config.tmsAdUrl,
////					'callback':'TDog.ChatDialog.showAdLink',
////					'success':function(){ S.log('读取 TMS 文字链资源成功');},
////					'hasDate':function(){self.showAdLink(adLinkData,currentDialog)},
////					'notHasDate':null
////				},
                {
                    'data':bulletinData,
                    'link':Config.tmsBulletinUrl,
                    'callback':'TDog.ChatDialog.showBulletin',
                    'success':function(){ S.log('读取 TMS 文字链资源成功');},
                    'hasDate':null,
                    'notHasDate':null
                }
            ]);

            return dialogEl;
        },

        /**
         *    显示聊天对话框
         *    @param data {Object} 用户信息
         *    @param fromtaobao 是否是淘宝网用户(不是 则不显示侧边栏消息)
         */
        show: function(data, fromtaobao) {
            userdata = data;
            var self = this,
                id = WebServer.formatNick(userdata.userId),
                viewPortWidth, dialogLeft, exit = false;
            if(id.length <= 8 ){
                TDog.Util.detect('ww.1.20.1.1.7', TDog.DataManager.getNickName());
            }
            for (var i = 0; i < dialog_list.length; i++) {
                if (dialog_list[i][0] == id) {
                    dialog_list[i][1].style.display = "block";
                    currentDialog = dialog_list[i][1];
                    exit = true;
                } else {
                    dialog_list[i][1].style.display = "none";
                }
            }
            if (!exit) {
                S.use('dragdrop', function(){
                    currentDialog = self._create(fromtaobao);
                    viewPortWidth = DOM.viewportWidth();
                    dialogLeft = (viewPortWidth - 440) / 2;
                    currentDialog.style.left = dialogLeft + "px";
                    //显示联系人状态，用户名
                    var head = S.get("div.tdog-popup-head",currentDialog),
                        status,info_container = S.get("div",head);
                    if (userdata.status) {// && (userdata.status[1] && userdata.status[1].length)) {
                        status = " - " + TDog.USER_STATUS[data.status][1];
                    } else {
                        status = "";
                    }
                    var relation = userdata.relation ? "好友" : "陌生人";
                    info_container.innerHTML = '<i></i><div class="tdog-contact-info"><span class="tdog-popup-contact">' + userdata.userName + '</span>' + status + '</div>';
                    info_container.className = 'tdog-status-' + TDog.USER_STATUS[data.status][0];

                    self.changeBut();//检查并改变按钮状态
                });
            }else{

                //显示联系人状态，用户名
                var head = S.get("div.tdog-popup-head",currentDialog),
                    status,info_container = S.get("div",head);
                if (userdata.status) {// && (userdata.status[1] && userdata.status[1].length)) {
                    status = " - " + TDog.USER_STATUS[data.status][1];
                } else {
                    status = "";
                }
                var relation = userdata.relation ? "好友" : "陌生人";
                info_container.innerHTML = '<i></i><div class="tdog-contact-info"><span class="tdog-popup-contact">' + userdata.userName + '</span>' + status + '</div>';
                info_container.className = 'tdog-status-' + TDog.USER_STATUS[data.status][0];

                this.changeBut();//检查并改变按钮状态
            }
        },//show

        /*
         *	关闭对话框
         */
        closeDialog : function() {
            Util.css([
                [currentDialog,"display","none"],
                ["tdog-face-container","display","none"]
            ]);
            currentDialog = false;
            userdata = '';
        },

        /**
         *    获取并显示 商品/用户信息
         *    @param data 包含用户信息和商品信息的JSON对象
         */
        showInfo: function(data) {
            var info_container = S.get('div.tdog-popup-talkright', currentDialog),
                isDetail = (Config.appId == 1);

            if (!info_container) return;

            // detail 页面不显示交易焦点
            if (!isDetail && data.item && data.item.id) {
                var item = data.item,
                    iteminfo = '<div class="tdog-popup-goodsinfo">' +
                        '<p class="tdog-goodsinfo-head">宝贝描述</p>' +
                        '<div>' +
                        '<div class="tdog-goodsinfo-pic"><p class="tdog-goodsinfo-img"><a href="http://item.taobao.com/item_detail-null-' + item.id + '.jhtml"  target = "_blank"><img src="' + item.imageUrl + '_80x80.jpg" title="' + item.title + '"/></a></p></div>' +
                        '</div>' +
                        '<p class="tdog-goodsinfo-title"><a href="http://item.taobao.com/item_detail-null-' + item.id + '.jhtml"  target = "_blank">' + item.title + '</a></p>' +
                        '<p class="tdog-goodsinfo-price">一口价：<span>' + item.price + '</span>元</p>' +
                        '<p><a href="http://buy.taobao.com/auction/buy_now.jhtml?auction_id=' + item.id + '" title="立刻购买" class="tdog-goodsinfo-linkbuy" target = "_blank"></a></p>' +
                        '</div>';

                DOM.css(info_container, "background-image", "none");
                info_container.innerHTML = iteminfo;
            } else if (data.user && data.user.nick) {
                var user = {
                    "nick" : "",
                    "sex" : "保密",
                    "from" : "保密",
                    "registDate" : "",
                    "visitDate" : "没有登录",
                    "sellNum" : "",
                    "buyNum" : "",
                    "certification" : "", // 认证
                    "relation" : ""
                };

                // {"success":"true","result":{"user":{"nick":"唐狮官方旗舰店","userChatId":"cntaobao唐狮官方旗舰店","sex":"0","from":"宁波","registDate":"2009-2-19 16:56:55","visitDate":"2010-6-4 14:54:11","sellNum":"","buyNum":"","certification":"true","suspended":"0","relation":"2","site":"cntaobao"},"item":{}}}
                user = S.merge(user, data.user);

                switch (user.sex) {
                    case 1 :
                        user.sex = '男';
                        break;
                    case 2:
                        user.sex = '女';
                        break;
                    default:
                        user.sex = '保密';
                        break;
                }

                var sell = user.sellNum,
                    buy = user.buyNum,
                    cert = (user.certification == 'true');

                if (sell != 0) {
                    sell = '<img align="absmiddle" title="卖家信用积分" src="http://a.tbcdn.cn/sys/common/icon/rank/b_' + user.sellNum + '.gif" />';
                }
                if (buy != 0) {
                    buy = '<img align="absmiddle" title="买家信用积分" src="http://a.tbcdn.cn/sys/common/icon/rank/c_' + user.buyNum + '.gif" />';
                }
                if (cert) {
                    cert = '<img align="absmiddle" title="淘宝认证商户" src="http://a.tbcdn.cn/sys/common/icon/trade/mall_auth.png" />';
                }
                var suspended = "";
                if (data.user.suspended == 3) {
                    suspended = '<p class="tdog-userinfo-suspended">该用户已经被查封</p>';
                }
                var userinfo = '<div class="tdog-popup-userinfo">' + suspended +
                    '<p class="tdog-userinfo-username">' + user.nick + '</p>' +
                    '<p>来自：<span class="tdog-popup-userinfo-from">' + user.from + '</span><br/> 性别：' + user.sex + '</p>' +
                    '<p>注册时间：' + user.registDate.split(" ")[0] + '</p>' +
                    '<p>上次登录：' + user.visitDate.split(" ")[0] + '</p>' +
                    (sell != '' ? '<p>卖家：' + sell + '</p>' : '') +
                    (buy != '' ? '<p>买家：' + buy + '</p>' : '') +
                    (cert ? '<p>认证：' + cert + '</p>' : '') +
                    '</div>';

                DOM.css(info_container, "background-image", "none");
                info_container.innerHTML = userinfo;

                //修正对话框head部分显示的用户组
                user.relation == 1 ? (user.relation = "好友") : (user.relation = "陌生人");
                var head = S.get("div.tdog-popup-head",currentDialog);
                info_container = S.get("div",head);//S.get("div",head);
                info_container.innerHTML = info_container.innerHTML.replace(/陌生人/, user.relation);
            }
        },

        /**
         *    点击最近联系人列表时，判断聊天窗口是否已打开
         */
        checkDialogOpen : function(nick) {
            if (userdata)
                return WebServer.formatNick(nick) == WebServer.formatNick(userdata.userName);
        },

        /**
         * 是否有打开的窗口
         */
        isOpen: function() {
            return !!currentDialog;
        },

        /**
         * 获取当前对话用户
         */
        getTargetUser: function() {
            return userdata.userName;
        },

        /**
         * 更新用户状态
         */
        updateUserStatus: function(userName, status) {
            if (WebServer.formatNick(userdata.userName) != WebServer.formatNick(userName))
                return;
            var head = S.get("div.tdog-popup-head",currentDialog),
                info_container = S.get("div",head), stat = '', usergroup, reg = /好友/;
            status = TDog.USER_STATUS[status];
            if (status[1] != "")
                stat = " - " + status[1];
            if (reg.test(info_container.innerHTML))
                usergroup = '(好友)';
            else
                usergroup = '(陌生人)';
            info_container.innerHTML = '<i></i><div class="tdog-contact-info"><span class="tdog-popup-contact">' + userdata.userName + '</span>' + stat + '</div>';
            info_container.className = 'tdog-status-' + status[0];
        },

        /**
         *    显示聊天信息
         */
        showMsg: function(msg) {
            if (!S.isArray(msg)) return;

            var msgContainer = S.get("div.tdog-popup-talkhistory", currentDialog),
                tip_container = S.get("div.tdog-popup-talkcontainer",dialogEl),
                i = 0,
            //temp,
                temps = "",
                time, content;

            /*if(S.UA.ie){
             temp = '<div class="tdog-popup-tms-bullet tdog-ie">' +
             '<div class="tdog-lt"></div>' +
             '<div class="tdog-popup-tms-bulletin"></div>' +
             '<div class="tdog-rt"></div>' +
             '</div>';
             }else{
             temp = '<div class="tdog-popup-tms-bullet">'+
             '<div class="tdog-popup-tms-bulletin"></div>'+
             '</div>';
             }*/

            for (; i < msg.length; i++) {
                temps = temps + this.__getMessageRealContent(msg[i]);
            }

            msgContainer.innerHTML += temps;

            S.later(function() {
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, 200, false);
            //+ last;	//滚动滚动条到最底部
        },

        /**
         *    显示系统提示
         */
        showSysTip: function(html, right) {
            if (!currentDialog)
                return;
            var msgContainer;
            if (right) {
                msgContainer = S.get("div.tdog-popup-talkright", currentDialog);
                if (msgContainer) {
                    DOM.css(msgContainer, "background-image", "none");
                    msgContainer.innerHTML = html;
                }
            } else {
                msgContainer = S.get("div.tdog-popup-talkhistory", currentDialog);
                if (msgContainer) {
                    msgContainer.innerHTML += '<div class="tdog-talk-filetip">' +
                        '<i></i>' + html + '</div>';
                    msgContainer.scrollTop = msgContainer.scrollHeight;	//滚动滚动条到最底部
                }
            }
        },

        /**
         *    打开聊天窗口/轮询后更新聊天记录
         */
        updateMsg: function() {
            if (!currentDialog) return;
            var msgContainer = S.get("div.tdog-popup-talkhistory", currentDialog),
                chatList = TDog.DataManager.getAllMessages(userdata.userId); // 用户聊天记录
            msgContainer.innerHTML = "";
            TDog.ChatDialog.showMsg(chatList);

            //更新黄条公告
            /*if (bulletinData) {
             this.showBulletin(bulletinData,currentDialog);
             }*/

            // 更新状态图标
            EC.fire(TDog.EVENTS.UPDATE_STATUS_ICON);
        },
        /**
         * 取到当前正在聊天的用户。
         */
        getCurrentChatUserId:function() {
            if (this.isOpen()) {
                return (userdata && userdata.userId ) ? userdata.userId : '';
            }
            return '';
        },
        getCurrentChatUserInfo:function() {
            if (this.isOpen()) {
                return userdata;
            }
            return {}
        },
        /**
         * 取到当前正在聊天的用户。
         */
        clearCurrentChatUserId:function() {
            if (userdata && userdata.userId) {
                userdata.userId = '';
            }
        },

        /**
         *    发送聊天信息
         *    即时显示聊天信息
         */
        sendMsg: function(textarea) {
            var myName = TDog.DataManager.getNickName(),
                value = TDog.Util.charToFace(textarea.value, true); //发送消息时在表情之间加\T  表情 \T
            this.showMsg([
                {
                    fromId : this.getCurrentChatUserId(),
                    userId : myName,
                    sendTime : TDog.Util.formatDate(new Date()),
                    content : TDog.Util.escapeHTML(value),
                    type:TDog.MESSAGE_TYPE.SELF
                }
            ]);
            if(!userdata.userId.length){
                TDog.Util.detect('ww.1.20.1.1.6', myName);
            }
            var targetNick = WebServer.formatNick(userdata.userId);

            EC.fire(TDog.EVENTS.SEND_MESSAGE, {
                userName : targetNick,
                content : value,
                callback : {
                    onFailure : function() {
                        TDog.ChatDialog.showSysTip("<p><span>网络原因，消息发送失败！</span></p>");
                    },
                    onTimeout : function() {
                        TDog.ChatDialog.showSysTip("<p><span>网络超时！</span></p>");
                    }
                }
            });

            textarea.value = '';
        },

        /**
         *    发送按钮灰显
         */
        changeBut : function() {
            var textarea = S.get("div.tdog-popup-talkinput", currentDialog).getElementsByTagName("textarea")[0],
                send_but = S.get("span.tdog-popup-sendbut", currentDialog),
                BTN_CLASS = "tdog-popup-sendbut-off",
                BTN_VALUE = textarea.value;
            if (BTN_VALUE == "" ) {
                if(!DOM.hasClass(send_but,BTN_CLASS)) DOM.addClass(send_but,BTN_CLASS);
            } else if (BTN_VALUE != "") {
                if(DOM.hasClass(send_but,BTN_CLASS)) DOM.removeClass(send_but,BTN_CLASS);
            }
        },

        /**
         *    绑定事件：帮助，关闭，发送方式的选择,表情选择器
         */
        _bindUI: function(dialogEl) {
            var help_but = S.get("span.tdog-popup-help", dialogEl),
                close_but = S.get("span.tdog-popup-close", dialogEl),
                pull_but = S.get("a.tdog-popup-pulloff", dialogEl),
                pop_right = S.get("div.tdog-popup-talkright", dialogEl),
                pop_left = S.get("div.tdog-popup-talkleftinner", dialogEl),
                mode_sel = S.get("span.tdog-popup-changesend", dialogEl),
                talk_bar = S.get("div.tdog-popup-talkbar", dialogEl),
                clear_msg = S.get("span.tdog-popup-talkbar-clear",dialogEl),
                msgContainer = S.get("div.tdog-popup-talkhistory", dialogEl),
                bulletin_bar = S.get("div.tdog-popup-tms-bullet", dialogEl),
                face_but = DOM.children(talk_bar)[0],
                mode = DOM.next(mode_sel),
                modes = mode.getElementsByTagName("li"),
                send_but = S.get("span.tdog-popup-send", dialogEl),
                textarea = S.get("div.tdog-popup-talkinput", dialogEl).getElementsByTagName("textarea")[0];

            Event.on(dialogEl, "click", function(e) {
                var tar = e.target;
                if (tar != face_but)
                    DOM.css(faceContainer, "display", "none");//隐藏表情
                if (tar.className == 'tdog-popup-tms-bulletin-close') {
                    var h = msgContainer.offsetHeight + 22;
                    S.get("div.tdog-popup-tms-bulletin-close", dialogEl).parentNode.parentNode.style.display = "none";
                    DOM.css([msgContainer,pull_but],"height",h);
                }
            });


            Event.on(help_but, "click", function() {    //跳转到帮助页面
                var id = encode(TDog.DataManager.getNickName()),
                    about = encode("问题咨询");
                win.open("http://im.robot.aliapp.com/all/aliqzg/webspace.jsp?id=4&userId=" + id + "&ask=" + about);
                TDog.Util.sendLog('wwweblog=checkww');
            });

            Event.on(clear_msg,"click",function(){
                var nick = TDog.ChatDialog.getCurrentChatUserId();
                msgContainer.innerHTML = "";
                TDog.DataManager.deleteMessage(nick);
                WebServer.clearChatMessage(nick);
                //	Config.clearUrl
            });

            Event.on(close_but, "click", function() {    //关闭对话框
//                if(bulletin_bar.style.display == 'none'){
//                    DOM.css(msgContainer,'height',msgContainer.offsetHeight -22 );
//                }
                dialogEl.style.display = "none";
                DOM.css(faceContainer,"display", "none");//隐藏表情
                msgContainer.innerHTML = "";
                currentDialog = false;
                userdata = '';

            });

            Event.on(pull_but, "click", function() {    //隐藏、显示右侧部分

                if (pop_right.style.display!= "none") {
//					if(bulletin_bar.style.display != "none"){
//						DOM.css(msgContainer,"height",msgContainer.offsetHeight+22+"px");
//					}

                    Util.css([
                        [pop_right,"display","none"],
                        //[pop_left,"marginRight","6px"],
                        //[msgContainer,"width","253px"],
                        [dialogEl,"width",msgContainer.offsetWidth+(S.UA.ie ? 6 : 2)+"px"],
                        //[bulletin_bar,"display","none"],
                        [pop_left,"margin-right","auto"],
                        [msgContainer,"width","auto"],
                        [msgContainer,"marginRight","6px"]
                    ]);

                    DOM.attr(pull_but,"title","显示侧边栏")
                    pull_but.className = "tdog-popup-pullon";
                    S.get("div.tdog-popup-handle-y", dialogEl).style.height = "38%";
                } else {
                    Util.css([
                        [pop_right,"display","block"],
                        [dialogEl,"width",dialogEl.offsetWidth+147+"px"],
                        [pop_left,"marginRight","145px"]

                        //[msgContainer,"width","256px"]
                    ]);

                    pop_right.style.height = parseInt(dialogEl.offsetHeight) -37 + "px";

                    DOM.attr(pull_but,"title","隐藏侧边栏");
                    pull_but.className = "tdog-popup-pulloff";
                    S.get("div.tdog-popup-handle-y", dialogEl).style.height = "95%";
                }
            });

            Event.on(send_but, "click", function() {    //发送按钮
                if (!TDog.ChatDialog.__checkLength(textarea.value))
                    return;
                this.sendMsg(textarea);
                this.changeBut();
                DOM.css(mode, "display", "none");
            }, this, true);

            Event.on(mode_sel, "click", function() {     //打开发送方式选择
                //DOM.css(msgContainer, "overflow", "visible");
                //DOM.css(dialogEl, "overflow", "visible");

                if (DOM.css(mode, "display") == "none"){
                    DOM.css(mode, "display", "block");
                    DOM.addClass(dialogEl,"tdog-popup-visible");
                    if(S.UA.ie == 6) DOM.css(dialogEl,"paddingBottom","0");
                }
                else{
                    DOM.css(mode, "display", "none");
                    if(DOM.hasClass(dialogEl,"tdog-popup-visible")){
                        DOM.removeClass(dialogEl,"tdog-popup-visible");
                        if(S.UA.ie == 6) DOM.css(dialogEl,"paddingBottom","1px");
                    }
                }

            });

            Event.on(modes[0], "click", function() {    //选择Ctrl+Enter
                if (modes[0].className == "") {
                    modes[0].className = "tdog-send-mode";
                    modes[1].className = "";
                }
                DOM.css(mode, "display", "none");
            });

            Event.on(modes[1], "click", function() {    //选择Enter
                if (modes[1].className == "") {
                    modes[1].className = "tdog-send-mode";
                    modes[0].className = "";
                }
                DOM.css(mode, "display", "none");
            });

            Event.on(textarea, "mousedown", function(e) {
                this.changeBut();//检查并改变按钮状态
            }, this, true);

            //监听粘贴事件
            Event.on(textarea, "paste", function(e) {
                var self = this;
                win.setTimeout(function() {
                    self.changeBut();//检查并改变按钮状态
                }, 100);
            }, this, true);

            Event.on(textarea, "keyup", function() {
                this.changeBut();//检查并改变按钮状态
            }, this, true);

            Event.on(textarea, "keydown", function(e) {    //对textarea中Enter和Ctrl + Enter的监听
                var checkedValue, self = this;
                if (e == null)
                    return;
                if (e.ctrlKey && e.keyCode == 13) {
                    var value = textarea.value;
                    if (modes[0].className == "tdog-send-mode") {
                        if (!TDog.ChatDialog.__checkLength(value))
                            return;
                        this.sendMsg(textarea);
                    }
                    else {    // 插入回车符
                        if (doc.selection) {
                            var range = doc.selection.createRange();
                            range.text = "\r\n";
                        } else {
                            var len = value.length,
                                toEndLength = len - textarea.selectionEnd;
                            textarea.value = value.substr(0, textarea.selectionStart) + "\r\n" + value.substring(textarea.selectionEnd, len);
                            textarea.selectionEnd = len - toEndLength + 1;//处理光标位置
                        }
                    }
                } else if (e.keyCode == 13) {
                    if (modes[1].className == "tdog-send-mode") {
                        e.preventDefault();//阻止默认的插入回车符操作
                        if (!TDog.ChatDialog.__checkLength(textarea.value)) {
                            return;
                        }
                        this.sendMsg(textarea);
                    } else {
                        //默认操作，插入回车符
                    }
                }
                // esc键 关闭对话框
                if(e.keyCode == 27){
                    self.closeDialog();
                }
            }, this, true);

            Event.on(face_but, "click", function() {    //打开表情选择器
                TDog.ChatDialog.Face.show(face_but, textarea);
            });


            Event.on(msgContainer, "click", function(e) {    //显示不安全链接提示
                var tar = e.target
                if (tar.nodeName.toUpperCase() == "A" && tar.parentNode.className == "webww-msg-unsafe-link") {
                    var msgContainer = S.get("div.tdog-popup-talkhistory", currentDialog);
                    var close_but,tip = S.get("div.tdog-popup-tips");
                    if (!tip) {
                        tip = '<div class="tdog-tips tdog-popup-tips">' +
                            '<div class="tdog-tipscontainer">' +
                            '<i class="tdog-tipsalert"></i>' +
                            '<i class="tdog-tipsclose"></i>' +
                            '<div class="tdog-tipsmain">' +
                            '<p>无法确认链接的安全性，请只打开来源可靠的网址</p>' +
                            '<p><a id="__last__webww_msg_unsafe_link" href="' + tar.href + '" target="_blank">打开链接</a>&nbsp;&nbsp;&nbsp;&nbsp;</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        tip = DOM.create(tip);
                        tar.parentNode.appendChild(tip);
                        if(msgContainer.scrollHeight - 150 > 0){
                            tip.style.top = msgContainer.offsetHeight + msgContainer.scrollTop - 150 + "px";
                        }
                        tip.style.zoom = 1;

                        close_but = S.get("i.tdog-tipsclose",tip);
                        Event.on(close_but, "click", function() {
                            tar.parentNode.removeChild(tip);
                        });
                    } else {
                        tip.style.top = msgContainer.offsetHeight + msgContainer.scrollTop - 150 + "px";

                        //msgContainer.scrollHeight - 150 + "px";

                        S.get('#__last__webww_msg_unsafe_link').href = tar.href;
                    }
                    e.preventDefault();
                }
            });
        },    //_bindUI
        __getMessageRealContent:function(data) {
            var type = parseInt(data.type);
            if('-' === data.userId){
                data.userId = TDog.DataManager.getNickName();
            }
            switch (type) {
                case TDog.MESSAGE_TYPE.SELF:{
                    return this.__talkMessage(data, data.userId, true);
                }
                case TDog.MESSAGE_TYPE.OFFLINE:{
                    return this.__talkMessage(data, data.fromId);
                }
                case TDog.MESSAGE_TYPE.TALK:{
                    var contents = '';
                    var subType = parseInt(data.subType);
                    switch (subType) {
                        case TDog.MESSAGE_SUBTYPE.FAIL_ACK : //205,  发送消息失败应答
                            contents = TDog.UNSUPPORT_MSG[subType].replace('{content}', data.content);
                            break;
                        case TDog.MESSAGE_SUBTYPE.ILLEGALITY:{// 212,  发送非法敏感词
                            contents = data.content;
                            break;
                        }
                        case TDog.MESSAGE_SUBTYPE.NEED_AUTH : //204 对加好友需要验证的陌生人发送消息的回应
                            return "";
                        case TDog.MESSAGE_SUBTYPE.FILE_MESSAGE :// 206, 收到文件请求
                        case TDog.MESSAGE_SUBTYPE.PIC_MESSAGE :// 207,  收到图片请求
                        case TDog.MESSAGE_SUBTYPE.GRAFFITI :// 208,  收到涂鸦请求
                        case TDog.MESSAGE_SUBTYPE.REMOTE_ASSIST :// 209,  收到远程协助请求
                        case TDog.MESSAGE_SUBTYPE.AV:// 210,  收到语音视频请求
                        case TDog.MESSAGE_SUBTYPE.FOLDER :// 211,  传文件夹
                        case TDog.MESSAGE_SUBTYPE.PEER_VERIFY:{ //213,  是否需要验证码
                            contents = TDog.UNSUPPORT_MSG[subType] + '</br>' + TDog.ERROR_MESSAGE['-40000'];
                            break;
                        }
                        case TDog.MESSAGE_SUBTYPE.TALK_MESSAGE:{ //201, 正常消息。
                            return this.__talkMessage(data, data.fromId,undefined,undefined,true);
                        }
                        case TDog.MESSAGE_SUBTYPE.AUTO_BACK_TALK_MESSAGE:{
                            return this.__talkMessage(data, data.fromId, undefined, true, true);
                        }
                        default:{
                            S.log('出现未定义的消息类型：' + data.subType, 'warn');
                            return "";
                        }
                    }
                    return '<div class="tdog-talk-filetip"><i></i><p><span>' + contents + '</span></p></div>';
                }
            }
            S.log('消息中出现错误:' + type, 'warn');
            return '';
        },
        __talkMessage:function(data, sendUserId, isSelfSend, autoBack) {
            var mes = data.content,
                time = data.sendTime.length <= 19 ? data.sendTime : data.sendTime.substring(0, 19);
            mes = TDog.Util.charToFace(data.content, null, isSelfSend);
            mes = mes.replace(/\n/g, '<br />');
            return  '<p class="tdog-talk-others"><span class="tdog-talk-username">' + TDog.Util.getUserName(sendUserId) + '</span><span class="tdog-talk-time">(' + time + '):</span></p>'
                + '<div class="tdog-talk-content">' + (autoBack ? '<span class="tdog-auto-back-talk-message">[自动回复]</span>' : '') + mes + '</div>';
        },

        /**
         *    判断输入的字符数(中文算两个字符)
         *
         */
        __checkLength : function(str) {
            var i,sum,TIP_TEMP = '<div class="tdog-tips tdog-popup-tips">' +
                    '<div class="tdog-tipscontainer">' +
                    '<s class="tdog-tipsext"></s>' +
                    '<i class="tdog-tipsimg"></i>' +
                    '<i class="tdog-tipsclose"></i>' +
                    '<div class="tdog-tipsmain">' +
                    '<p>你发送的消息过长，请下载支持发送超长信息的<a href="' + Config.downloadWangWangURLBuy + '" target="_blank">阿里旺旺客户端</a></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                tip_container = S.get("div.tdog-popup-talkcontainer",dialogEl);
            sum = 0;
            for (i = 0; i < str.length; i++) {
                if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255)) {
                    sum = sum + 1;
                } else {
                    sum = sum + 2;
                }
            }
            if (sum > 300) {
                if (S.query("div.tdog-popup-tips",tip_container).length == 1) {
                    return;
                }
                var tip = DOM.create(TIP_TEMP), close_but;
                tip_container.appendChild(tip);
                close_but = S.get("i.tdog-tipsclose",tip);
                Event.on(close_but, "click", function() {
                    tip_container.removeChild(tip);
                });
                return false;
            } else if (sum == 0) {
                return false;
            }
            return true;
        }
    };

    TDog.ChatDialog.Face = {
        init:function(textarea) {
            faceContainer = doc.createElement("div");
            faceContainer.id = "tdog-face-container";
            for (var i = 0; i < 99; i++) {
                faceContainer.innerHTML += '<span data-icon="' + i + '.gif"></span>';
            }
            S.get("#tstart").appendChild(faceContainer);//添加到工具条
            this._bindUI();
        },

        show: function(refer, textarea) {
            if (!faceContainer)
                this.init(textarea);
            else
                faceContainer.style.display = "block";

            var xy = [DOM.offset(refer).left,DOM.offset(refer).top - 237];
            DOM.offset(faceContainer, { left: xy[0], top: xy[1] });
            textarea.focus();	//文本框输入焦点维持
        },

        _bindUI: function() {
            Event.on(faceContainer, "click", function(e) {
                var textarea = S.get("div.tdog-popup-talkinput",currentDialog).getElementsByTagName("textarea")[0],
                    tar = e.target,face = DOM.attr(tar, "data-icon");
                face = TDog.Util.faceToChar(face);
                textarea.focus();	//文本框输入焦点维持
                if (typeof doc.selection != "undefined") {
                    doc.selection.createRange().text = face;
                } else {
                    var value = textarea.value,
                        length = value.length,
                        toEndLength = length - textarea.selectionEnd;
                    textarea.value = value.substr(0, textarea.selectionStart) + face + value.substring(textarea.selectionEnd, textarea.value.length);
                    textarea.selectionEnd = textarea.value.length - toEndLength;//处理光标位置
                }
                faceContainer.style.display = "none";
                TDog.ChatDialog.changeBut();//检查并改变按钮状态
            });
        }
    };
});
/**
 * @module 工具条上状态小图标
 * 分工：成阳负责
 */
TDog.add('StatusIcon', function(TDog) {

    var S = KISSY, DOM = S.DOM,
        iconContainer,
        personCount = 0;
    /**
     *  右下角的状态图标管理模块。
     */
    TDog.StatusIcon = {

        init: function() {
            S.log('init StatusIcon');
            iconContainer = S.get('#tstart-plugin-tdog s.tstart-item-icon');
            this.offline(); // 默认离线状态
        },

        /**
         *   登录时，显示旺旺图标闪动
         */
        onlogin: function() {
            iconContainer.className = "tstart-item-icon tstart-tdog-login";
        },

        /**
         * 是否正在登录
         */
        isLogining: function() {
            return DOM.hasClass(iconContainer, 'tstart-tdog-login');
        },

        /**
         *    在线时，显示旺旺图标
         */
        online: function() {
            if (iconContainer.className != 'tstart-item-icon tstart-tdog-online')
                iconContainer.className = "tstart-item-icon tstart-tdog-online";
        },

        /**
         *    离线时，显示旺旺灰色图标
         */
        offline: function() {
            iconContainer.className = "tstart-item-icon tstart-tdog-offline";
        },

        /**
         * 是否离线
         */
        isOffline: function() {
            return DOM.hasClass(iconContainer, 'tstart-tdog-offline');
        },

        /**
         *    收到消息时，旺旺图标闪动
         */
        getmessage: function() {
            if (iconContainer.className != "tstart-item-icon tstart-tdog-mess")
                iconContainer.className = "tstart-item-icon tstart-tdog-mess";
        },
        /**
         * 是否有新消息，正在闪烁
         */
        onNewMessage: function() {
            return DOM.hasClass(iconContainer, 'tstart-tdog-mess');
        },

        /**
         *    收到消息时，显示消息数
         */
        showcount: function(count) {
            if (personCount === count) return;

            if (count == 0) {
                iconContainer.innerHTML = '';
                this.online();//取消旺旺图标闪动
            } else {
                iconContainer.innerHTML = '<span class="tdog-toolbar-msgnum">' + count + '</span>';
                this.getmessage();//旺旺图标闪动
            }
            personCount = count;
        },

        /**
         *    移除旺旺图标
         */
        removeicon: function() {
            iconContainer.className = "tstart-item-icon";
        }
    };
});
/**
 * @module 系统提醒消息
 * 分工：成阳负责
 */
TDog.add('SysMessage', function(TDog) {

    var S = KISSY, DOM = S.DOM, Event = S.Event,
        msgEl, container, ReadEl,
        NONE = 'none', BLOCK = 'block',
        TMPL =
            '<div id="tdog-sys-message" class="tdog-simplepop" style="display:none;">' +
                //'<div id="tdog-sys-message" class="tdog-simplepop '+(S.UA.ie ? "tdog-ie" : '') + '" style="display:none;">' +
                //(S.UA.ie ? '<span class="rc-tp"><span></span></span>' : '') +
                '<div class="tdog-simplepop-head">' +
                '<span>系统消息</span>' +
                '<span class="tdog-closebut"></span>' +
                '</div>' +
                '<div class="tdog-simplepop-main">' +
                '<div class="tdog-sysinfo">' +
                '<dl>' +
                '</dl>' +
                '</div>' +
                '<div class="tdog-sysinfo-foot"></div>' +
                '</div>' +
                //(S.UA.ie ? '<span class="rc-bt"><span></span></span>' : '') +
                '</div>';

    TDog.SysMessage = {

        init: function() {
            //for test
            //this.show({"title":"title","datetime":"2010-01-04 10:26:00","content":"亲爱的 ailing01： 恭喜！您的甘菊的测试-闪电发货已被买家（ailing02 )拍下，订单编号为22329014141009点击查看：http://trade.taobao.com/trade/itemlist/list_sold_items.htm?nekot=g,mfuwy2lom4ydc1274944647004 退订此消息，请到 我的淘宝>>网站提醒设置：http://member1.taobao.com/member/subscription.htm#msg:1051 [淘宝网 淘我喜欢！| taobao.com]","subType":"502","type":"5"});
            //this.show({"title":"title","datetime":"2010-01-04 10:26:00","content":"亲爱的 ailing01： \r\n\r\n恭喜！您的甘菊的测试-闪电发货已被买家（ailing02 )拍下，订单编号为22329014141009点击查看：http://trade.taobao.com/trade/itemlist/list_sold_items.htm?nekot=g,mfuwy2lom4ydc1274944647004 退订此消息，请到 我的淘宝>>网站提醒设置：http://member1.taobao.com/member/subscription.htm#msg:1051 \r\n[淘宝网 淘我喜欢！| taobao.com]","subType":"502","type":"5"});
        },

        _create: function() {
            msgEl = DOM.create(TMPL);
            S.get("#tstart").appendChild(msgEl);
            container = S.get('dl', msgEl);

            this._bindUI();
        },

        /**
         * 显示系统消息
         */
        show: function(data) {
            if (!data) return false;
            if (!container) this._create();

            this._loadData(data);
            msgEl.style.display = BLOCK;
        },

        /**
         * 载入数据
         */
        _loadData: function(data) {
            data.datetime = data.datetime.split(" ")[0];

            var content = (data.content || '').replace(/\r\n/ig, '<br />');

            container.innerHTML = '<dt>' +
                '<p>' +
                '<span class="tdog-info-mailicon"></span>' +
                '<span class="tdog-info-title">' + data.title + '</span>' +
                '<span class="tdog-info-time">' + data.datetime + '</span>' +
                '<span class="tdog-info-toolopen"></span>' +
                '</p>' +
                '</dt>' +
                '<dd style="display:none">' + content + '</dd>'
                + container.innerHTML;
        },

        /**
         * 绑定事件
         */
        _bindUI: function() {

            // 关闭
            Event.on('#tdog-sys-message .tdog-closebut', 'click', function() {
                msgEl.style.display = NONE;
            });

            // 显示/隐藏
            Event.on(container, 'click', function(ev) {
                var target = ev.target, dt = target, dd;

                while(dt.nodeName !== 'DT' && dt !== container) {
                    dt = dt.parentNode;
                }

                if (dt.nodeName === 'DT') {
                    if(ReadEl && ReadEl != dt && S.get('.tdog-info-toolclose', ReadEl)){
                        S.get('.tdog-info-toolclose', ReadEl).className = 'tdog-info-toolopen';
                        ReadEl.nextSibling.style.display = NONE;
                    }
                    dd = dt.nextSibling;
                    if (dd.style.display === BLOCK){
                        S.get('.tdog-info-toolclose', dt).className = 'tdog-info-toolopen';	// 改变箭头方向
                        dd.style.display = NONE;
                    } else {
                        S.get('.tdog-info-toolopen', dt).className = 'tdog-info-toolclose';	// 改变箭头方向
                        dd.style.display = BLOCK;
                    }
                    ReadEl = dt;
                }
            });
        }
    };
});
/**
 * @module 系统浮起
 * 分工：成阳负责
 */
TDog.add('SysPopup', function(TDog) {
    var S = KISSY, DOM = S.DOM, Event = S.Event
    POPUP_TEMP =  '<div class="tdog-simplepop" style="width:225px;">' +
        '<div class="tdog-simplepop-head">' +
        '<span class="tdog-simplepop-icon"></span>' +
        '<span>{title}</span>' +
        '<span class="tdog-closebut"></span>' +
        ' </div>' +
        '<div class="tdog-simplepop-main">' +
        '<div class="tdog-remind"><div class="tdog-remind-inner">' +
        '{content}' +
        '</div></div>' +
        ' <div class="tdog-remind-foot">' +
        '<span>{time}</span>' +
        '</div>' +
        '</div>' +
        '</div>';

    TDog.SysPopup = {

        /**
         * PASSED
         * 不需要在工具条加载时创建
         */
        init: function(){
            //for test
            var data = {
                content : "您的淘宝订阅有更新<br>活动0 商品0 店铺 0<br>查看更新 管理跟新",
                style : "pos=3;width=225;height=150;format=1;staytime=18000001;showmode=0;title=系统提示;enablemove=0"
            };
            //this.show(data);
        },

        /**
         * 捕获到系统提醒时，直接调用此方法
         */
        show: function(data){
            //处理配置信息
            if(!data.content)
                return;
            var config = {
                title : "淘宝旺旺订阅提醒",
                width : "225px",
                time : new Date(),
                staytime : 60000
            };
            if(data.style){
                var style = S.unparam(data.style, ';');
                config = Y.lang.merge(config,style);
            }//if

            if(data.time) config.time = data.time;
            config.content = data.content;
            config.time = TDog.Util.formatDate(config.time);

            //创建DOM
            var syspop = DOM.create(substitute(POPUP_TEMP,config));
            S.get("#tstart").appendChild(syspop);
            //绑定事件
            this._bindUI(syspop);

            //延时隐藏
            window.setTimeout(function(){
                if(syspop)
                    S.get("#tstart").removeChild(syspop);
            },config.staytime);
        },

        /**
         * 绑定事件
         * 单击关闭按钮后，从DOM中彻底移除
         */
        _bindUI: function(pop_handle){
            var close_but = S.get("span.tdog-closebut",pop_handle);
            Event.on(close_but,"click",function(e){
                S.get("#tstart").removeChild(pop_handle);
            });
        }

    };
    function substitute(s, o) {
        return s.replace(/\{([^}]+)\}/g, function(m, key) {
            return o[key] || '';
        });
    }
});/**
 * @module 系统提示
 * 分工：成阳负责
 */
TDog.add('SysTips', function(TDog) {

    var S = KISSY, DOM = S.DOM, Event = S.Event,
        hostTrigger, tipsContainer, tipsContent,
        HOVER_CLS = 'tstart-item-hover-tips',
        HIDDEN = 'tstart-hidden',
        LOGIN_OK_BTN_CLS = 'tstart-tips-login-ok-btn',
        LOGIN_OK_CLIENT_ONELINE_BTN_CLS = 'tstart-client-oneline',
        LOGIN_OK_CLIENT_ONELINE_CANCLE_BTN_CLS = 'tstart-client-cancle-oneline',
        LOGIN_OK_CLIENT_ONELINE_HELP_BTN_CLS = 'tstart-client-help-oneline',
        TMPL = '<span class="tstart-item-tips tdog-systips tstart-hidden"><i></i><s></s><div class="tdog-systips-content">{CONTENT}</div></span>';


    /**
     * 提示气泡管理类
     */
    TDog.SysTips = {
        /**
         * 初始化气泡管理器
         */
        init: function() {
            S.log('init SysTips');
            var hostEl = TDog.hostEl;

            // 添加 TDog 的 tips
            tipsContainer = DOM.create(TMPL);
            tipsContent = S.get('.tdog-systips-content', tipsContainer);
            hostEl.appendChild(tipsContainer);

            hostTrigger = S.get('.tstart-tdog-trigger', hostEl);
            this._bindUI();
        },

        /**
         * 浮出气泡
         * @param html 气泡内容
         * @param width 宽度。px 可选。
         * @param delay 延长时间(秒) 可选
         */
        show: function(html, width, delay) {
            tipsContainer.style.width = (width || 120) + 'px';
            tipsContent.innerHTML = html || TDog.ERROR_MESSAGE[-1]; // 默认消息

            // 显示
            DOM.removeClass(tipsContainer, HOVER_CLS);
            DOM.removeClass(tipsContainer, HIDDEN);

            // 定时隐藏
            if (delay) {
                S.later('hide', delay * 1000, false, this, tipsContainer);
            }
        },

        /**
         * 设置悬浮提示
         * @param html 显示内容。
         */
        setHoverTips: function(html) {
            tipsContent.innerHTML = html;
            DOM.addClass(tipsContainer, HOVER_CLS);
        },

        /**
         * 隐藏气泡
         */
        hide: function() {
            // TODO: fadeout
            DOM.addClass(tipsContainer, HIDDEN);
        },

        /**
         * 绑定事件
         */
        _bindUI: function() {
            var self = this;

            Event.on(tipsContainer, 'click', function(ev) {
                var target = ev.target;

                if (DOM.hasClass(target, LOGIN_OK_BTN_CLS)) {
                    TDog.WebServer.login();
                } else if (DOM.hasClass(target, LOGIN_OK_CLIENT_ONELINE_BTN_CLS)) {
                    TDog.Login.online = true;
                    TDog.Login.ready = true;
                    TDog.WebServer.login(TDog.WebServer.AUTO_LOGIN.forcedLogin);
                    TDog.Util.sendLog('&wwweblog=confirm');
                }else if (DOM.hasClass(target, LOGIN_OK_CLIENT_ONELINE_HELP_BTN_CLS)) {
                    window.open("http://im.robot.aliapp.com/all/aliqzg/webspace.jsp?id=4&ask=%E5%AE%89%E8%A3%85%E4%BA%86%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA%EF%BC%8C%E7%82%B9%E2%80%9C%E5%92%8C%E6%88%91%E8%81%94%E7%B3%BB%E2%80%9D%E6%9C%AA%E5%BC%B9%E5%87%BA%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3%EF%BC%9F&page=kjts", '');
                }else if (DOM.hasClass(target, LOGIN_OK_CLIENT_ONELINE_CANCLE_BTN_CLS)) {
                    TDog.StatusIcon.offline();
                    TDog.Util.sendLog('&wwweblog=cancel');
                } else if (target.nodeName === 'A' && target.className != 'tstart-item-tips-on') {
                    location.href = target.href;
                }
                /*else if (target.nodeName === 'A' && target.className == 'tstart-item-tips-on') {
                 window.open(target.href, '')
                 }*/

                self.hide();
            });
        },
        /**
         * 显示登录确认提示
         */
        showLoginTips: function(logining) {
            if (logining || TDog.StatusIcon.isLogining()) {
                this.show('阿里旺旺正在登录，请稍候……', 110);
            }
            else {
                var nick = TDog.DataManager.getNickName();
                this.show('和对方聊天，需要登录阿里旺旺，确定用帐号（' + nick + '）登录吗？<hr><span class="tstart-item-tips-btn ' + LOGIN_OK_BTN_CLS + '">确定</span><span class="tstart-item-tips-btn">取消</span>', 200);
            }
        },
        /**
         * 显示登录客户端在线的确认提示
         */
        showClientOnlineTips: function() {
            var nick = TDog.DataManager.getNickName(),
            //help = "http://service.taobao.com/support/main/help_quick.htm?q=%25E4%25B8%25BA%25E4%25BB%2580%25E4%25B9%2588%25E7%2582%25B9%25E5%2587%25BB%25E2%2580%259C%25E5%2592%258C%25E6%2588%2591%25E8%2581%2594%25E7%25B3%25BB%25E2%2580%259D%25E6%2580%25BB%25E6%2598%25AF%25E5%25BC%25B9%25E5%2587%25BA%25E7%25BD%2591%25E9%25A1%25B5%25E7%2589%2588%25E7%259A%2584%25E5%25AF%25B9%25E8%25AF%259D%25E7%25AA%2597%25EF%25BC%259F";
            //help = "http://im.robot.aliapp.com/all/aliqzg/webspace.jsp?id=4&ask=%E5%AE%89%E8%A3%85%E4%BA%86%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA%EF%BC%8C%E7%82%B9%E2%80%9C%E5%92%8C%E6%88%91%E8%81%94%E7%B3%BB%E2%80%9D%E6%9C%AA%E5%BC%B9%E5%87%BA%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3%EF%BC%9F&page=kjts";
                help = "http://service.taobao.com/support/help-16380.htm";
            this.show('您的帐号（' + nick + '）已经登录了阿里旺旺<br/>1、点击【确定】继续登录网页版,登录成功后会把已登录的客户端踢下线<br>2、如果您已登录客户端,点击【<a target="_blank" class="tstart-item-tips-on" href=' + help + ' >帮助</a>】,获取如何继续使用(修复)客户端的方法<hr><span class="tstart-item-tips-btn ' + LOGIN_OK_CLIENT_ONELINE_BTN_CLS + '">确定</span><span class="tstart-item-tips-btn ' + LOGIN_OK_CLIENT_ONELINE_CANCLE_BTN_CLS + '">取消</span><span class="tstart-item-tips-btn ' + LOGIN_OK_CLIENT_ONELINE_HELP_BTN_CLS + '">帮助</span>', 280);
            //this.show('您的帐号（' + nick + '）已经登录了阿里旺旺,若已在本地登录阿里旺旺，请<a target="_blank" class="tstart-item-tips-on" href=' + help + ' >点击这里</a><br/>或者点击确定登录网页版阿里旺旺，登录成功后会将原登录的旺旺踢下线。<hr><span class="tstart-item-tips-btn ' + LOGIN_OK_CLIENT_ONELINE_BTN_CLS + '">确定</span><span class="tstart-item-tips-btn ' + LOGIN_OK_CLIENT_ONELINE_CANCLE_BTN_CLS + '">取消</span>', 240);

        },

        /**
         * 显示登录失败后的提示信息
         */
        showLoginFailedTips: function(errorCode) {
            var tips = TDog.ERROR_MESSAGE[errorCode] || '阿里旺旺暂时不可用，请稍候再试';
            this.show(tips + '<hr><span class="tstart-item-tips-btn">确定</span>', 180);
        },

        /**
         * 显示被踢后的提示信息
         */
        showLogoutTips: function(type) {
            // 401 - 没有心跳
            // 402 - 帐号在其他地方被登录
            // 403 - session 过期
            type = type || -1;

            var tips = '阿里旺旺现在离线了。<hr>是否重新登录？';
            if (type == '402') {
                tips = '你的帐号(' + TDog.DataManager.getNickName() + ')已经在其他地方登录！<hr>需要重新登录吗？';
            }

            // 2010-06-23 by yubo: 去掉离线提示，弱化离线问题
            if (type != -1) {
                this.show(tips + '<br /><span class="tstart-item-tips-btn ' + LOGIN_OK_BTN_CLS + '">确定</span><span class="tstart-item-tips-btn">取消</span>', 180);
            }
        },

        /**
         * 显示欢迎提示
         */
        showWelcomeTips: function() {
            this.show('欢迎使用全新阿里旺旺网页版！', 100);
        },

        /**
         * 显示最后一条非 hover 提示
         */
        showLastTips: function() {
            if (!DOM.hasClass(tipsContainer, HOVER_CLS)) {
                DOM.removeClass(tipsContainer, HIDDEN);
            }
        }
    };

});/**
 * @module TDog plugin for TStart
 * 分工：玉伯负责
 */
TStart.add('plugin~tdog', function(TStart) {

    var DOM = KISSY.DOM,
        Event = KISSY.Event,
        TYPE = TStart.PLUGIN_TYPE,
        EVENTS = TDog.EVENTS,
        EC = TDog.EventCenter,
        DROP_PANEL = '<div class="tstart-tdog-panel">' +
            '<div class="tstart-tdog-panel-hd">' +
            '<span>最近联系人</span><s class="tstart-tdog-panel-clearbtn"></s><s class="tstart-tdog-panel-closebtn"><img src="http://img01.taobaocdn.com/tps/i1/T1R6pOXoRyXXXXXXXX-15-15.png"></s></div>' +
            '<div class="tstart-tdog-panel-bd tstart-panel-loading" style="width:160px;height:160px"></div>' +
            '</div>';

    // 添加插件项
    TStart.addPlugin('tdog', {
        /**
         * 插件种类
         */
        type: 'custom',

        /**
         * 提示信息
         */
        tips: '阿里旺旺',

        html: '<span class="tstart-tdog-trigger"><s class="tstart-item-icon"></s></span>' + DROP_PANEL,

        /**
         * 初始化操作
         */
        init: function() {

            var host = this;

            function beforeOpen(ev) {

                if(DOM.hasClass(ev.target, 'tstart-item-icon')) { // 只有点击在 icon 上时才触发
                    return EC.fire(EVENTS.CLICK_STATUS_ICON);
                }
                // 点击在非 icon 处，不打开联系人列表
                return false;

            }

            function open(ev) {
                if (!TDog.DataManager.isLogin())
                    return;
                TDog.WebServer.getTalkUsers();
                DOM.removeClass(DOM.get('.tstart-tdog-panel-bd', '#tstart-plugin-tdog'), 'tstart-panel-loading');

                /*setTimeout(function(){
                 TDog.EventCenter.fire(TDog.EVENTS.SHOW_RECENT_LIST, ev);
                 },0);*/
            }

            Event.on('#tstart-plugin-tdog', 'click', function(ev) {

                var target = ev.target,
                    trigger;

                if (DOM.hasClass(target, 'tstart-item-icon')) {
                    trigger = DOM.parent(target, '.tstart-item');

                    if (DOM.hasClass(trigger, 'tstart-item-active')) {
                        DOM.removeClass(trigger, 'tstart-item-active');
                    } else {
                        if (beforeOpen(ev)) {
                            TStart.fire('closePanel');
                            DOM.addClass(trigger, 'tstart-item-active');
                            open(ev);
                        }
                    }
                }

            });

            TDog.init(TStart, DOM.get('#tstart-plugin-tdog'));

        }

    });

});
/**
 * @module settings
 */
TStart.add('plugin~settings', function(T) {
    var S = KISSY, DOM = S.DOM, Event = S.Event,
        TYPE = T.PLUGIN_TYPE,
        ACTIVE_ITEM_CLS = 'tstart-item-active',
        HOST = T.Config.isOnline ? 'taobao.com' : 'daily.taobao.net';


    // 添加配置插件项
    T.addPlugin('settings', {
        /**
         * 插件种类
         */
        type: 'custom',

        /**
         * 显示的文字
         */
        html: '<span class="tstart-settings-trigger" title="设置 web 旺旺"><s></s></span>' +
            '<div class="tstart-settings-panel">' +
            '<div class="tstart-settings-panel-hd"></div>' +
            '<div class="tstart-settings-panel-bd">' +
            '<p><input type="checkbox" class="tstart-settings-login"/><label>自动登录</label></p>' +
            '<p><input type="checkbox" class="tstart-settings-msg"/><label>接受陌生人消息</label></p>' +
            '</div>' +
            '</div>',


        init: function() {
            var domEl = DOM.get('#tstart-plugin-settings'),
                panel = DOM.get(".tstart-settings-panel",domEl),
                autoLoginEl = DOM.get(".tstart-settings-login",domEl),
                tdog = DOM.get("#tstart-plugin-tdog"),
                msgEl = DOM.get(".tstart-settings-msg",domEl);

            Event.on(domEl, 'click', function(ev) {
                if(!DOM.hasClass(domEl, ACTIVE_ITEM_CLS)){
                    TDog.WebServer.checkUserSeting();
                }
                if(DOM.hasClass(tdog,ACTIVE_ITEM_CLS)){
                    DOM.removeClass(tdog,ACTIVE_ITEM_CLS);
                }
                TStart.fire('closePanel');
                DOM.toggleClass(domEl, ACTIVE_ITEM_CLS);
                ev.stopPropagation();
            });
            Event.on(panel, 'click', function(ev) {
                ev.stopPropagation();
            });
            Event.on(document, 'click', function(){
                DOM.removeClass(domEl, ACTIVE_ITEM_CLS);
            });

            Event.on(autoLoginEl, 'click' , function(){
                var act = -1;
                if(autoLoginEl.checked){
                    act = 2;
                }else{
                    act = 1;
                }
                TDog.WebServer.setAutoLogin(act);
            });
            Event.on(msgEl, 'click' , function(){
                var act = -1;
                if(msgEl.checked){
                    act = 3;
                }else{
                    act = 4;
                }
                TDog.WebServer.setStrangerMsg(act);
            });
        }

    });


});

TStart.initPlugins();
