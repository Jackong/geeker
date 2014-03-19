/*
* YY开放平台JavaScript SDK
* @create date 2012-01-06
* @modify data 2013-12-16
* @version 1.19 
* ............................................................................
* ............................................................................
* yy open platform client javascript sdk 
* 广州欢聚时代科技有限公司 版权所有 (c) 2005-2014 DuoWan.com [多玩游戏]

******************************************************************************
* 更多开发资料请参考open.yy.com文档中心
*******************************************************************************/

//(function() {
var yy_e_api_call_error = 0xF230; //十进制值62000  Api调用错误，错误的函数名称，错误的调用格式会返回此错误。
var yy_e_api_param_error = 0xF231; //十进制值62001 Api调用参数错误，错误的参数个数和类型，会触发此错误。
var yy_e_api_return_format_error = 0xF232; //十进制值62002 Api调用返回值格式错误。
var yy_e_api_not_exist = 0xF233; //十进制值62003 Api不存在或者此YY版本下没有实现。
//------------------------------IYYCommon------------------------------------------------------------------------
/**
* IYYCommon 接口。
* @class 公共功能原型类，提供比如事件的侦听，取消侦听等公共功能。
* @constructor
*/
function IYYCommon() {
    /**
    * 保存事件侦听函数的对象，事件的类型作为eventsMap的key, key为事件唯一描述字符串，具体事件key 值，在每个接口有单独定义。
    * @field
    * @private
    */
    this.eventsMap = {};
};

/**
* 增加侦听事件。
* @param {string} eventType 事件的类型key，比如: IYY.ACTIVE,IYYChannel.CHANNEL_INFO_CHANGED
* @param {function} listenerFunc 事件的侦听函数。
*/
IYYCommon.prototype.addEventListener = function (eventType, listenerFunc) {
    if (arguments.length !== 2 || typeof (eventType) !== "string" || typeof (listenerFunc) !== "function") {
        throw "addEventListener param error";
    }
    if (this.eventsMap[eventType] === null || this.eventsMap[eventType] === undefined || this.eventsMap[eventType].length === 0) {
        this.eventsMap[eventType] = [listenerFunc];
        //第一次侦听，打开侦听订阅
        switch (eventType) {
            case IYY.ACTIVE:
                callExternal("SubscribeYYEvent", eventType, true);
                break;
            case IYYAudio.RECORD_ERR:
            case IYYAudio.RECORD_FINISHED:
                callExternal("SubscribeAudioEvent", eventType, true);
                break;
            case IYYChannel.CHANNEL_INFO_CHANGED:
            case IYYChannel.FOCUS_CHANNEL_CHANGED:
            case IYYChannel.SUB_CHANNEL_ADD:
            case IYYChannel.SUB_CHANNEL_DEL:
            case IYYChannel.USER_ENTER_CHANNEL:
            case IYYChannel.USER_LEAVE_CHANNEL:
                callExternal("SubscribeChannelEvent", eventType, true);
                break;
            case IYYChannelAppMsg.APP_LINK_CLICKED:
            case IYYChannelAppMsg.APP_LINK_EX_CLICKED:
                callExternal("SubscribeAppMsgEvent", eventType, true);
                break;
            case IYYChannelChat.CHAT:
            case IYYChannelChat.CHAT_FROM:
                callExternal("SubscribeChannelChatEvent", eventType, true);
                break;
            case IYYChannelMicList.USER_JOIN:
            case IYYChannelMicList.USER_LEAVE:
            case IYYChannelMicList.USER_MOVE:
            case IYYChannelMicList.CLEAR:
            case IYYChannelMicList.USER_LINKED:
            case IYYChannelMicList.USER_UNLINKED:
            case IYYChannelMicList.MODE_CHANGED:
            case IYYChannelMicList.CONTROLLED:
            case IYYChannelMicList.RELEASED:
            case IYYChannelMicList.DISABLE_JOIN:
            case IYYChannelMicList.ENABLE_JOIN:
            case IYYChannelMicList.TIME_CHANGED:
            case IYYChannelMicList.SPEAKING_STATE_CHANGED:
            case IYYChannelMicList.NOTIFICATION:
                callExternal("SubscribeMicListEvent", eventType, true);
                break;
            case IYYChannelUserListPopMenu.CLICKED:
                callExternal("SubscribePopMenuEvent", eventType, true);
                break;
            case IYYNet.RECV:
            case IYYNet.CLOSED:
                callExternal("SubscribeNetEvent", eventType, true);
                break;
            case IYYUser.USER_INFO_CHANGED:
                callExternal("SubscribeUserEvent", eventType, true);
                break;
            case IYYTempAudioSession.USER_ENTER_ROOM:
            case IYYTempAudioSession.USER_LEAVE_ROOM:
            case IYYTempAudioSession.SPEAKER_CHANGED:
                callExternal("SubscribeTempAudioSessionEvent", eventType, true);
                break;
            case IYYFinance.BUY_RESPONSE:
            case IYYFinance.BUY_GIFTS_RESPONSE:
                callExternal("SubscribeFinanceEvent", eventType, true);
                break;
            case IYYVideo.CAMERA_STATUS:
            case IYYVideo.PUBLISH_STATUS:
            case IYYVideo.SUBSCRIBE_STATUS:
                callExternal("SubscribeVideoEvent", eventType, true);
                break;
            default:
        }

    }
    else {
        for (var i = 0; i < this.eventsMap[eventType].length; i++) {
            if (this.eventsMap[eventType][i] === listenerFunc) {//是否已经存在
                return;//同一事件同一个函数只能侦听一次
            }
        }
        this.eventsMap[eventType].push(listenerFunc);
    }

};

/**
* 删除侦听事件。即删除指定事件的所有侦听函数。
* @param {string} eventType 事件的类型。
* @param {function} listenerFunc 要删除的事件的侦听函数。
*/
IYYCommon.prototype.removeEventListener = function (eventType, listenerFunc) {
    if (this.eventsMap[eventType] !== null && this.eventsMap[eventType] !== undefined) {
        if (arguments.length === 1 && typeof (eventType) === "string") {
            this.eventsMap[eventType] = []; //如果设置为null，dispatch时容易报错
        }
        else if (arguments.length === 2 && typeof (eventType) === "string" && typeof (listenerFunc) === "function") {
            for (var i = this.eventsMap[eventType].length - 1; i >= 0; i--) {
                if (this.eventsMap[eventType][i] === listenerFunc) {
                    this.eventsMap[eventType].splice(i, 1);//去掉侦听函数
                }
            }
        }
        else {
            throw "removeEventListener param error ";
        }

        //取消侦听功能
        if (this.eventsMap[eventType].length === 0) {
            switch (eventType) {
                case IYY.ACTIVE:
                    callExternal("SubscribeYYEvent", eventType, false);
                    break;
                case IYYAudio.RECORD_ERR:
                case IYYAudio.RECORD_FINISHED:
                    callExternal("SubscribeAudioEvent", eventType, false);
                    break;
                case IYYChannel.CHANNEL_INFO_CHANGED:
                case IYYChannel.FOCUS_CHANNEL_CHANGED:
                case IYYChannel.SUB_CHANNEL_ADD:
                case IYYChannel.SUB_CHANNEL_DEL:
                case IYYChannel.USER_ENTER_CHANNEL:
                case IYYChannel.USER_LEAVE_CHANNEL:
                    callExternal("SubscribeChannelEvent", eventType, false);
                    break;
                case IYYChannelAppMsg.APP_LINK_CLICKED:
                case IYYChannelAppMsg.APP_LINK_EX_CLICKED:
                    callExternal("SubscribeAppMsgEvent", eventType, false);
                    break;
                case IYYChannelChat.CHAT:
                case IYYChannelChat.CHAT_FROM:
                    callExternal("SubscribeChannelChatEvent", eventType, false);
                    break;
                case IYYChannelMicList.USER_JOIN:
                case IYYChannelMicList.USER_LEAVE:
                case IYYChannelMicList.USER_MOVE:
                case IYYChannelMicList.CLEAR:
                case IYYChannelMicList.USER_LINKED:
                case IYYChannelMicList.USER_UNLINKED:
                case IYYChannelMicList.MODE_CHANGED:
                case IYYChannelMicList.CONTROLLED:
                case IYYChannelMicList.RELEASED:
                case IYYChannelMicList.DISABLE_JOIN:
                case IYYChannelMicList.ENABLE_JOIN:
                case IYYChannelMicList.TIME_CHANGED:
                case IYYChannelMicList.SPEAKING_STATE_CHANGED:
                case IYYChannelMicList.NOTIFICATION:
                    callExternal("SubscribeMicListEvent", eventType, false);
                    break;
                case IYYChannelUserListPopMenu.CLICKED:
                    callExternal("SubscribePopMenuEvent", eventType, false);
                    break;
                case IYYNet.RECV:
                case IYYNet.CLOSED:
                    callExternal("SubscribeNetEvent", eventType, false);
                    break;
                case IYYUser.USER_INFO_CHANGED:
                    callExternal("SubscribeUserEvent", eventType, false);
                    break;
                case IYYTempAudioSession.USER_ENTER_ROOM:
                case IYYTempAudioSession.USER_LEAVE_ROOM:
                case IYYTempAudioSession.SPEAKER_CHANGED:
                    callExternal("SubscribeTempAudioSessionEvent", eventType, false);
                    break;
                case IYYFinance.BUY_RESPONSE:
                case IYYFinance.BUY_GIFTS_RESPONSE:
                    callExternal("SubscribeFinanceEvent", eventType, false);
                    break;
                case IYYVideo.CAMERA_STATUS:
                case IYYVideo.PUBLISH_STATUS:
                case IYYVideo.SUBSCRIBE_STATUS:
                    callExternal("SubscribeVideoEvent", eventType, false);
                    break;
                default:
            }
        }

    }
};

/**
* 触发事件，注意：此接口，在外部不要调用，外部调用此函数触发的事件，为无效事件
* @param {String} eventType 事件类型。 
* @param {String} eventData 事件数据。 
* @private
*/
IYYCommon.prototype.dispatchEvent = function(eventType, eventData) {
    //触发事件
    if (this.eventsMap[eventType] === null || this.eventsMap[eventType] === undefined) return;
    for (var i = 0; i < this.eventsMap[eventType].length; i++) {
        switch (arguments.length) {
            case 1:
                this.eventsMap[eventType][i](); //不需要信息的事件
                break;
            case 2:
                this.eventsMap[eventType][i](eventData);
                break;
            default:
        }
    }
};
//--------------------------------------set debug mode-----------------------
//设置为true时，会在id为txtConsole的textarea文本框中输出调试信息
var debugMode = false;

//--------------------------------------IYY----------------------------------
/**
* IYY 构造函数。
* @extends IYYCommon
* @class yy接口入口，获取到yy的其他接口和方法。
* @constructor
*/
function IYY() {
    /**
    * 获取语音接口。
    * @field
    * @type IYYAudio
    * @see IYYAudio   
    */
    this.audio = new IYYAudio();

    /**
    * 获取频道接口。
    * @field
    * @type IYYChannel
    * @see IYYChannel   
    */
    this.channel = new IYYChannel();

    /**
    * 获取简单存储接口。  
    * @field
    * @type IYYCloud
    * @see IYYCloud
    */
    this.cloud = new IYYCloud();

    /**
    * 获取财务接口。  
    * @field
    * @type IYYFinance
    * @see IYYFinance
    */
    this.finance = new IYYFinance();

    /**
    * 获取IM接口。
    * @field
    * @type IYYIM
    * @see IYYIM    
    */
    this.im = new IYYIM();

    /**
    * 获取网络接口。
    * @field
    * @type IYYNet
    * @see IYYNet
    */
    this.net = new IYYNet();

    /**
    * 获取安全接口。
    * @field
    * @type IYYSecurity
    * @see IYYSecurity
    */
    this.security = new IYYSecurity();

    /**
    * 获取当前用户信息。
    * @field
    * @see IYYUser
    * @type IYYUser
    */
    this.user = new IYYUser();

    /**
    * 获取临时语音接口。
    * @field
    * @see IYYTempAudioSession
    * @type IYYTempAudioSession
    */
    this.tempAudioSession = new IYYTempAudioSession();
    /**
    * 获取应用互动接口。
    * @field
    * @see IYYInteraction
    * @type IYYInteraction
    */
    this.interaction = new IYYInteraction();

    /**
    * 获取视频直播接口。
    * @field
    * @see IYYVideo
    * @type IYYVideo
    * @private
    */
    this.video = new IYYVideo();


    var result = callExternal("IYY_GetVersion");
    var ver;//;= new YYVersion();
    if (result.ret === 0) {
        ver = { ret: 0, majorVersion: result.main_version, minorVersion: result.sub_version };
    } else {
        ver = result;
    }

    /**
    * 获取YY API的版本，是一个Object对象:
    * @field
    * @example
    * 版本对象包括属性如下:
    * <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。
    * <b>majorVersion</b>: Number类型 主版本号
    * <b>minorVersion</b>: Number类型 次版本号
    * @example
    * 成功的返回值示例:{ ret:0, majorVersion:1, minorVersion:13 }
    * 失败的返回值示例:{ ret:984832}
    * @type Object
    */
    this.version = ver;
    var retv = callExternal("IYYEx_GetYYVersion");

    /**
    * 获取YY客户端的版本信息。返回YY的版本,是一个Object对象。
    * @field
    * @example
    * 版本对象包括属性如下:
    * <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。
    * <b>version</b>: String类型 YY客户端主版本信息。发布版本典型的版本格式为"YY 4.17.0.3",注意空格。获取失败时返回空字符串。
    * @example
    * 成功的返回值示例:{ ret:0, version:"YY 4.17.0.3" }
    * 失败的返回值示例:{ ret:984832}
    * @type Object
    */
    this.yyVersion = retv;
    
    /**
    * 设置flash对象的Id，能够根据此Id获得flash对象，调用flash中的方法。设置后YY的回调事件才能转发给flash。
    * @field
    * @type String
    */
    this.flashId = "";



    //关闭所有事件，提高效率
    
    try
    {
        callExternal("SubscribeAudioEvent","ALL", false);
        callExternal("SubscribeAppMsgEvent","ALL", false);
        callExternal("SubscribeChannelEvent","ALL", false);
        callExternal("SubscribeYYEvent","ALL", false);
        callExternal("SubscribeMicListEvent","ALL", false);
        callExternal("SubscribeUserEvent","ALL", false);
        callExternal("SubscribeNetEvent","ALL", false);
        callExternal("SubscribePopMenuEvent","ALL", false);
        callExternal("SubscribeTempAudioSessionEvent", "ALL", false);
        callExternal("SubscribeFinanceEvent", "ALL", false);
        callExternal("SubscribeChannelChatEvent", "ALL", false);
        callExternal("SubscribeVideoEvent", "ALL", false);
    } catch (ex) {
        yytrace("xxxSubscribe Event Errorxxxx");
    }
};

IYY.prototype = new IYYCommon();
/**
* 获取应用的展现方式。
* @returns 返回应用展现方式，是Object对象格式，具体属性如下：<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。 <br/>
* <b>mode</b>: String类型 应用的展现方式。其中<br/>
* SubWindow=公告，应用在公告区域展现。<br/>
* PopWindow=弹窗，应用弹出一个窗口展现。<br/>
* FullTemplate=全模板，在频道窗口右侧展现，会隐藏公屏聊天区域。<br/>
* EmbedTemplate=半模板，应用在频道窗口中间位置展现，保留公屏聊天区域。<br/>
* TabPage=tab页，应用在一个新Tab页中展现。<br/>
* <br/>
* @example 
* 使用示例:
* var result=yy.getWebAppShowMode();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML="应用展现模式为 mode="+result.mode;
* }
* else
* {
*     document.getElementById("txtLog").innerHTML="获取出错，错误码ret="+result.ret;
* }
* 成功的返回值示例:{ ret:0,mode:"PopWindow"}
* 失败的返回值示例:{ ret:984832}
* @type Object
*/
IYY.prototype.getWebAppShowMode = function () {
    var result = callExternal("IYYEx_GetWebAppShowMode");
    if (result.ret == 0) {
        return { ret: 0, mode: result.mode };
    }
    else {
        return result;
    }
};

/**
* 应用激活事件。当应用运行时，应用图标在应用盒子或者其他应用入口被点击时产生的事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.activeCode: Number类型，正整数，表示点击的来源，0=点击来源于应用盒子图标。
*
* @example
* 使用示例：
* yy.addEventListener(IYY.ACTIVE,onActive);
*
* function onActive(eventData)
* {
*    document.getElementById("txtLog").innerHTML="点击来源："+eventData.activeCode;
* }
*/
IYY.ACTIVE = "YY_ACTIVE";

//------------------------------IYYAudio------------------------------

/**
* IYYAudio 构造函数。
* @extends IYYCommon
* @class 语音控制接口，提供处理YY的音频信息，比如录音的控制等。
* @constructor
*/
function IYYAudio() {

};

IYYAudio.prototype = new IYYCommon();
/**
* 开始录音
* @param {String} fileName 指定录音文件的文件名，不需要路径。
* 格式为MP3，会录制到固定的路径中，如果两次录音指定了同一个文件，第二次的会被覆盖。不指定文件名的话系统会使用默认名称。
* @returns 返回调用是否成功，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @example
* 使用示例：
* var result=yy.audio.starRecord();
* 成功的返回值示例:{ ret:0}
* 失败的返回值示例:{ ret:984832}
* @type Object
*/
IYYAudio.prototype.startRecord = function(fileName) {
    var result;
    if (arguments.length === 0) {
        result = callExternal("IAudio_StartRecord");
    }
    else if (arguments.length > 1) {
        return { ret: yy_e_api_param_error }; //出错，参数错误
    }
    else {
        if (typeof (fileName) !== "string") return { ret: yy_e_api_param_error };
        result = callExternal("IAudio_StartRecord",fileName);
    }
    return result;
};
/**
* 停止录音
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYAudio.prototype.stopRecord = function() {
    var result = callExternal("IAudio_StopRecord");
    return result;
};

/**
* 打开卡拉ok效果,即播放伴奏。<br>
* 权限规则如下：<br>
* OW,VP，MA 在当前的频道内，在任何模式下都可以开启和关闭卡拉OK功能。
* CA,CA2 在当前频道内拥有管理权限的子频道内可以开启和关闭卡拉OK功能。
* VIP，G，R，U必须在自由模式下或者麦序模式下到首位麦序的时候可以开启和关闭卡拉OK功能。
* 字母代表的意义如下：<br>
* 游客(U),临时嘉宾(G),嘉宾(VIP),会员(R),二级子频道管理员(CA2),子频道管理员(CA),全频道管理员(MA),频道总管理(VP),频道所有者(OW)<br>
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYAudio.prototype.openKaraoke = function() {
    var result = callExternal("IAudio_OpenKaraoke");
    return result;
};
/**
* 关闭卡拉ok效果,,即停止伴奏。权限规则和openKaraoke方法相同。
* @see #openKaraoke
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYAudio.prototype.closeKaraoke = function() {
    var result = callExternal("IAudio_CloseKaraoke");
    return result;
};

/**
* 开启混响效果。
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYAudio.prototype.enableAudioMixing = function () {
    var result = callExternal("IAudio_EnableAudioMixing");
    return result;
};
/**
* 关闭混响效果。
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYAudio.prototype.disableAudioMixing = function () {
    var result = callExternal("IAudio_DisableAudioMixing");
    return result;
};

/**
* 设置伴奏播放器路径。
* @param {String} filePathName 指定播放器的路径和文件名。
* @returns 返回操作结果，是Object对象格式，具体属性如下：<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。 <br/>
* <b>originPlayerPath</b>: String类型 为原来的播放器路径。<br/>
* <b>originSoftwareMixEnable</b>: Boolean类型 为原来是否使用软件卡拉ok混音。<br/>
* @example 
* 使用示例:
* var result=yy.audio.setKaraokePlayerPath("c:\aaa\bb.exe");
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML="设置完成,原来路径="+result.originPlayerPath+" 原来混音状态="+result.originSoftwareMixEnable;
* }
* else
* {
*     document.getElementById("txtLog").innerHTML="设置出错，错误码ret="+result.ret;
* }
* 成功的返回值示例:{ ret:0,originPlayerPath:"C:\\Program Files\\StormII\\Storm.exe",originSoftwareMixEnable:false}
* 失败的返回值示例:{ ret:984832}
* @type Object
*/
IYYAudio.prototype.setKaraokePlayerPath = function (filePathName) {
    if (arguments.length != 1) return { ret: yy_e_api_param_error }; //出错，参数错误
    if (typeof (filePathName) !== "string") return { ret: yy_e_api_param_error };
    var result = callExternal("IAudio_SetKaraokePlayerPath", filePathName);
    if (result.ret == 0) {
        return { ret: 0, originPlayerPath: result.origin_player_path, originSoftwareMixEnable: result.origin_software_mix_enable };
    } else {
        return result;
    }
};

/**
* 恢复伴奏播放器路径。如果上一次设置的时候保存了原始的播放器路径等信息，可以调用此方法恢复。
* @param {String} filePathName 原来的播放器的路径和文件名。
* @param {Boolean} mixEnable 原来是否使用软件卡拉ok混音。
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYAudio.prototype.resetKaraokePlayerPath = function (filePathName,mixEnable) {
    if (arguments.length != 2) return { ret: yy_e_api_param_error }; //出错，参数错误
    if (typeof (filePathName) !== "string") return { ret: yy_e_api_param_error };
    if (typeof (mixEnable) !== "boolean") return { ret: yy_e_api_param_error };
    var result = callExternal("IAudio_ResetKaraokePlayerPath", filePathName, mixEnable);
    return result;
};


/**
* 音频录音出错事件。录音出错的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.errCode: Number类型，整数，录音出错代码。
*
* @example
* 使用示例：
* yy.audio.addEventListener(IYYAudio.RECORD_ERR,onRecordError);
*
* function onRecordError(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.errCode;
* }
*/
IYYAudio.RECORD_ERR = "YY_RECORD_ERR";


/**
* 音频录音完成事件。录音完成的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.result: Number类型，表示录音结果的整数。 0=录音正确，非0值表示录音过程中有错误。
* eventData.fileName: String类型 录音文件的路径和文件名 。
*
* @example
* 使用示例：
* yy.audio.addEventListener(IYYAudio.RECORD_FINISHED,onRecordFinish);
*
* function onRecordFinish(eventData)
* {
*    if(eventData.result==0)
*    {
*       document.getElementById("txtLog").innerHTML="录好的文件在："+eventData.fileName;
*    }
* }
*/
IYYAudio.RECORD_FINISHED = "YY_RECORD_FINISHED";

//-------------------------------------IYYChannel-----------------------------------
/**
* IYYChannel 构造函数。
* @extends IYYCommon
* @class 频道接口，提供对频道的操作和交互。
* @constructor
*/
function IYYChannel() {

    /**
    * 获取用户菜单接口。
    * @type IYYChannelUserListPopMenu
    * @see IYYChannelUserListPopMenu    
    * @field
    */
    this.userListPopMenu = new IYYChannelUserListPopMenu();
    /**
    * 获取麦序接口。
    * @type IYYChannelMicList
    * @see IYYChannelMicList
    * @field
    */
    this.micList = new IYYChannelMicList();
    /**
    * 获取频道应用消息接口。
    * @type IYYChannelAppMsg
    * @see IYYChannelAppMsg
    * @field
    */
    this.appMsg = new IYYChannelAppMsg();

    /**
    * 获取频道用户控制接口。
    * @type IYYChannelUserController
    * @see IYYChannelUserController
    * @field
    */
    this.userController = new IYYChannelUserController();
    
    /**
    * 获取接待频道接口。
    * @type IYYReceptionChannel
    * @see IYYReceptionChannel
    * @field
    */
    this.receptionChannel = new IYYReceptionChannel();    
    
    /**
    * 获取频道 tab页接口。
    * @type IYYChannelTabPage
    * @see IYYChannelTabPage
    * @field
    */
    this.tabPage = new IYYChannelTabPage();

    /*
    * 获取公屏聊天和私聊接口。
    * @type IYYChannelChat
    * @see IYYChannelChat
    */
    this.chat = new IYYChannelChat();

};

IYYChannel.prototype = new IYYCommon();

/**
* 获取当前所在的大频道信息
* @returns 返回当前频道信息,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>longId</b>: Number类型 频道的长位Id。<br/>
* <b>shortId</b>: Number类型 频道的短位Id，如果没有，同长位Id一致。<br/>
* <b>name</b>: String类型 频道的名称。<br/>
* <b>userCount</b>: Number类型 所在子频道用户数量。<br/>
* <b>totalUserCount</b>: Number类型 大频道全部用户数量。<br/>
* <b>channelType</b>: Number类型 游戏=0 娱乐=1 其他=2 教育=3。<br/>
* <b>channelPoints</b>: Number类型 频道的积分。<br/>
* @type Object
* @example 
* 使用示例:
* var cInfo=yy.channel.getCurrentChannelInfo();
* 成功的返回值示例:{ ret:0,longId:88995544,shortId:1234,name:"我的测试频道",userCount:9,totalUserCount:25,channelType:0,channelPoints:4958}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannel.prototype.getCurrentChannelInfo = function() {
    var result = callExternal("IChannel_GetCurrentChannelInfo");
    if (result.ret === 0) {
        return parseChannelInfo(result);
    }
    else {
        return result;
    }
};

/**
* 获取当前所在的子频道信息
* @returns 返回当前子频道信息,是一个Object对象。返回信息格式同getCurrentChannelInfo一致。
* @type Object
* @see #getCurrentChannelInfo
*/
IYYChannel.prototype.getCurrentSubChannelInfo = function() {
    var result = callExternal("IChannel_GetCurrentSubChannelInfo");
    if (result.ret === 0) {

        return parseChannelInfo(result);
    }
    else {
        return result;
    }
};

/**
* 获取当前大频道中，指定的子频道或者根频道的频道信息。
* @returns 返回指定频道信息,是一个Object对象。返回信息格式同getCurrentChannelInfo一致。
* @param {Number} cid 指定的频道的id <b>是频道的长位Id</b> 。
* @type Object
* @see #getCurrentChannelInfo    
* 
*/
IYYChannel.prototype.getChannelInfo = function(cid) {
    if (arguments.length !== 1) return null;
    if (typeof cid !== "number" || isNaN(cid)) return null;
    var result = callExternal("IChannel_GetChannelInfo", cid);
    if (result.ret === 0) {
        return parseChannelInfo(result);
    }
    else {
        return result;
    }
};


/**
* 获取当前根频道id。
* @returns 返回当前根频道的频道长位id，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>cid</b>: Number类型 当前频道根频道的长位Id。<br/>
* @type Object
* @example 
* 使用示例:
* var result=yy.channel.getRootChannelId();
* if(result.ret==0)
* {
*   document.getElementById("txtLog").innerHTML="根频道Id="+result.cid;
* }
* 成功的返回值示例:{ ret:0,cid:88995544}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannel.prototype.getRootChannelId = function() {
    var result = callExternal("IChannel_GetRootChannelId");
    if (result.ret === 0) {
        return { ret: 0, cid: result.long_id };
    }
    else {
        return result;

    }
};


/**
* 获取指定频道的所有子频道的id。
* @param {Number} cid 指定频道的的长位id,必须是在当前大频道中的一个频道。 
* @returns 返回所有子频道的长位id。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>cids</b>: Array类型 回所有子频道的长位id,id保存在一个数组中<br/>
* @type Object
* @example 
* 使用示例:
* var result=yy.channel.getSubChannelIds(45467889);
* if(result.ret==0)
* {
*   document.getElementById("txtLog").innerHTML="所有子频道Id为"+result.cids;
* }
* 成功的返回值示例:{ ret:0,cids:[88995544,99898888,33334445]}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannel.prototype.getSubChannelIds = function(cid) {
    if (arguments.length !== 1) return [];
    if (typeof cid !== "number" || isNaN(cid)) return [];
    var result = callExternal("IChannel_GetSubChannelIds", cid);
    if (result.ret === 0) {
        return { ret: 0, cids: result.ids.concat() };
    }
    else {
        return [];
    }
};

/**
* 获取指定频道的用户的uid。<b>频道超过200人时只随机获取200人</b>
* @param {Number} cid 指定频道的的长位id,必须是在当前大频道中的一个频道。 
* @returns 返回在该频道中前200个用户uid。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>userList</b>: Array类型 返回在该频道中前200个用户uid,uid保存在一个数组中。<br/>
* @type Object
* @example 
* 使用示例:
* var result=yy.channel.getUserList(45467889);
* if(result.ret==0)
* {
*   document.getElementById("txtLog").innerHTML="在45467889频道中的用户为："+result.userList;
* }
* 成功的返回值示例:{ ret:0,userList:[1234444,2234455,3311344]}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannel.prototype.getUserList = function (cid) {
    if (arguments.length !== 1) return [];
    if (typeof cid !== "number" || isNaN(cid)) return [];
    var result = callExternal("IChannelUserList_GetUserList", cid);
    if (result.ret === 0) {
        return { ret: 0, userList: result.list.concat() };
    }
    else {
        return result;
    }
};

/**
* 获取频道风格。用来判断是普通频道风格还是精彩世界风格。
* @returns 返回频道风格，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>style</b>: Number类型 当前频道频道风格,0=普通频道，1=精彩世界。<br/>
* @type Object
* @example 
* 使用示例:
* var result=yy.channel.getChannelStyle();
* if(result.ret==0)
* {
*   document.getElementById("txtLog").innerHTML="频道风格: "+ (result.style == 0 ? "普通频道" : "精彩世界");
* }
* 成功的返回值示例:{ ret:0,cid:88995544}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannel.prototype.getChannelStyle=function() {
    return callExternal("IChannel_GetChannelStyle");
};
/**
* 当前频道信息变化事件。用户<b>当前</b>所在的频道(子频道或者根频道)信息变化时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData: Object类型 是YYChannelInfo对象，保存频道的新信息。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.CHANNEL_INFO_CHANGED,onChannelInfoChanged);
*
* function onChannelInfoChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="发生变化的频道号："+eventData.longId+" 名称为："+eventData.name;
* }
*/
IYYChannel.CHANNEL_INFO_CHANGED = "YY_CHANNEL_INFO_CHANGED";

/**
* 切换频道事件。用户在大频道中切换频道的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.departedId: Number类型 离开的频道的长位id。
* eventData.nowId: Number类型 进入的频道的长位id。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.FOCUS_CHANNEL_CHANGED,onFocusChanged);
*
* function onFocusChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="离开："+eventData.departedId+" 进入了"+eventData.nowId;
* }
*/
IYYChannel.FOCUS_CHANNEL_CHANGED = "YY_FOCUS_CHANNEL_CHANGED";


/**
* 子频道增加事件。子频道创建的时候会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.cid: Number类型 增加的子频道的长位id。
* eventData.pcid: Number类型 增加到哪个频道下，长位id。
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.SUB_CHANNEL_ADD,onChannelAdd);
*
* function onChannelAdd(eventData)
* {
*     document.getElementById("txtLog").innerHTML="新的频道"+eventData.cid+"位于"+eventData.pcid+"下面";
* }
*/
IYYChannel.SUB_CHANNEL_ADD = "YY_SUB_CHANNEL_ADD";

/**
* 子频道删除事件。子频道被删除时触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.cid: Number类型 被删除的子频道长位id。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.SUB_CHANNEL_DEL,onChannelDel);
*
* function onChannelDel(eventData)
* {
*     document.getElementById("txtLog").innerHTML="被删除的子频道："+eventData.cid;
* }
*/
IYYChannel.SUB_CHANNEL_DEL = "YY_SUB_CHANNEL_DEL";

/**
* 用户进入当前大频道事件。当用户进入当前大频道中任一频道就会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 进入频道的用户uid。
* eventData.cid: Number类型 进入时，所在的那个频道的长位id。  
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.USER_ENTER_CHANNEL,onUserEnter);
*
* function onUserEnter(eventData)
* {
*     document.getElementById("txtLog").innerHTML="有新用户"+eventData.uid+"进入到"+eventData.cid+"频道";
* }
*/
IYYChannel.USER_ENTER_CHANNEL = "YY_USER_ENTER_CHANNEL";


/**
* 用户离开当前大频道事件。当有用户离开当前大频道就会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 离开频道的用户uid。
* eventData.cid: Number类型 离开大频道时所处的频道的长位id。
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.USER_LEAVE_CHANNEL,onUserLeave);
*
* function onUserLeave(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开了"+eventData.cid+"频道";
* }
*/
IYYChannel.USER_LEAVE_CHANNEL = "YY_USER_LEAVE_CHANNEL";


//-------------------------------------IYYChannelAppMsg-----------------------------------
/**
* IYYChannelAppMsg 构造函数
* @extends IYYCommon
* @class 频道应用消息接口，提供频道的应用消息发送和响应等操作，应用消息出现在应用盒子的应用消息选项卡中和公告栏下方。
* @constructor
*/
function IYYChannelAppMsg() {
};

IYYChannelAppMsg.prototype = new IYYCommon();


/**
* 发送应用消息到子频道。所有该子频道在线用户才能收到。
* @param {Number} subChannelId 子频道长位id。    
* @param {String} msg 消息内容，最大长度200字节。
* @param {Number} linkstart 内容中超链接开始位置，必须为正整数。
* @param {Number} linkend 内容中超链接结束位置，必须为正整数。    
* @param {Number} token  设置token，消息标记，必须为正整数。  
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelAppMsg.prototype.sendMsgToSubChannel = function(subChannelId, msg, linkstart, linkend, token) {
    if (arguments.length !== 5) return { ret: yy_e_api_param_error };
    if (typeof subChannelId !== "number" || typeof msg !== "string" || typeof linkstart !== "number" || typeof linkend !== "number" || typeof token !== "number") return { ret: yy_e_api_param_error };
    if (isNaN(subChannelId) || isNaN(linkstart) || isNaN(linkend) || isNaN(token)) return { ret: yy_e_api_param_error };
    msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IChannelAppMsg_SendMsgToSubChannel", subChannelId, msg, linkstart, linkend, token);
    return result;
};


/**
* 发送应用消息给指定用户。用户必须在同一大频道中，且必须在线才能收到。
* @param {Array} userList 存有目标用户uid的数组。    
* @param {String} msg 消息内容 最大长度200字节。
* @param {Number} linkstart 内容中超链接开始位置，必须为正整数。
* @param {Number} linkend 内容中超链接结束位置，必须为正整数。    
* @param {Number} token  设置token，消息标记，必须为正整数。 
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelAppMsg.prototype.sendMsgToUsers = function(userList, msg, linkstart, linkend, token) {
    if (arguments.length !== 5) return { ret: yy_e_api_param_error };
    if (!(userList instanceof Array) || typeof msg !== "string" || typeof linkstart !== "number" || typeof linkend !== "number" || typeof token !== "number") return { ret: yy_e_api_param_error };
    if (isNaN(linkstart) || isNaN(linkend) || isNaN(token)) return { ret: yy_e_api_param_error };
    msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IChannelAppMsg_SendMsgToUsers", userList, msg, linkstart, linkend, token);
    return result;
};

/**
* 发送应用消息到子频道。所有该子频道在线用户才能收到。可以发送包含多个链接的消息。
* @param {Number} subChannelId 子频道长位id。    
* @param {Number} token  设置token，消息标记，必须为正整数。  
* @param {String} key  消息的认证key，根据消息内容和应用Id计算出的key，应用通过审核后，可以在open.yy.com获取。  
* @param {Array} textData  包含文字信息的数组，数组每个元素是json对象，示例如下。<br>
* [{ text: "嘎嘎鱼", type: 2, userData: 87639876 }, { text: "邀请全部子频道的人一起玩", type: 1 }, { text: "猜骰子", type: 2, userData: 105620}]<br>
* 数组中每个元素的格式:<br>
* text： 文字信息<br>
* type： 是普通文字还是链接文字，1=普通文字 2=链接文字 其他值无效<br>
* userData： 如果是链接文字,userData保存链接自定义数据，是一个正整数，点击链接的时候可以得到此数据，如果是普通文字可以没有此属性<br>
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelAppMsg.prototype.sendMsgToSubChannelEx = function(subChannelId, token, key, textData) {
    if (arguments.length !== 4) return { ret: yy_e_api_param_error };
    if (typeof subChannelId !== "number" || typeof token !== "number" || typeof key !== "string" || !(textData instanceof Array)) return { ret: yy_e_api_param_error };
    if (isNaN(subChannelId) || isNaN(token)) return { ret: yy_e_api_param_error };

    var textString = "";
    var sp = "";
    for (var i = 0; i < textData.length; i++) {
        var dtString = "{";
        if (textData[i].text === null || textData[i].text === undefined || typeof textData[i].text !== "string") {
            return { ret: yy_e_api_param_error };
        }
        else {
            var msg = textData[i].text;
            msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
            msg = msg.replace(/\"/g, "\\\""); //替换双引号
            dtString = dtString + "\"text\":\"" + msg + "\"";
        }
        if (textData[i].type === null || textData[i].type === undefined || typeof textData[i].type !== "number") {
            return { ret: yy_e_api_param_error };
        }
        else {
            dtString = dtString + ",\"type\":" + textData[i].type;
        }
        if (textData[i].userData === null || textData[i].userData === undefined) {
            if (textData[i].type === 2) return { ret: yy_e_api_param_error };
            dtString = dtString + "}";
        }
        else {
            if (typeof textData[i].userData !== "number") return { ret: yy_e_api_param_error };
            dtString = dtString + ",\"userData\":" + textData[i].userData + "}";
        }

        textString = textString + sp + dtString;
        sp = ",";
    }
    var result = callExternal("IChannelAppMsg_SendMsgToSubChannelEx", subChannelId, token, key, "[" + textString + "]");
    return result;
};


/**
* 发送应用消息给指定用户。用户必须在同一大频道中，且必须在线才能收到。可以发送包含多个链接的消息。
* @param {Array} userList 存有目标用户uid的数组。    
* @param {Number} token  设置token，消息标记，必须为正整数。 
* @param {String} key  消息的认证key，根据消息内容和应用Id计算出的key，应用通过审核后，可以在open.yy.com获取。 
* @param {Array} textData  包含文字信息的数组，数组每个元素是json对象。格式同sendMsgToSubChannelEx。
* @see #sendMsgToSubChannelEx
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelAppMsg.prototype.sendMsgToUsersEx = function(userList, token, key, textData) {
    if (arguments.length !== 4) return { ret: yy_e_api_param_error };
    if (!(userList instanceof Array) || typeof token !== "number" || typeof key !== "string" || !(textData instanceof Array)) return { ret: yy_e_api_param_error };
    if (isNaN(token)) return { ret: yy_e_api_param_error };
    var textString = "";
    var sp = "";
    for (var i = 0; i < textData.length; i++) {
        var dtString = "{";
        //----
        if (textData[i].text === null || textData[i].text === undefined || typeof textData[i].text !== "string") {
            return { ret: yy_e_api_param_error };
        }
        else {
            var msg = textData[i].text;
            msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
            msg = msg.replace(/\"/g, "\\\""); //替换双引号
            dtString = dtString + "\"text\":\"" + msg + "\"";
        }
        //----
        if (textData[i].type === null || textData[i].type === undefined || typeof textData[i].type !== "number") {
            return { ret: yy_e_api_param_error };
        }
        else {
            dtString = dtString + ",\"type\":" + textData[i].type;
        }
        //----
        if (textData[i].userData === null || textData[i].userData === undefined) {
            if (textData[i].type === 2) return { ret: yy_e_api_param_error };
            dtString = dtString + "}";
        }
        else {
            if (typeof textData[i].userData !== "number") return { ret: yy_e_api_param_error };
            dtString = dtString + ",\"userData\":" + textData[i].userData + "}";
        }

        textString = textString + sp + dtString;
        sp = ",";
    }

    var result = callExternal("IChannelAppMsg_SendMsgToUsersEx", userList, token, key, "[" + textString + "]");
    return result;
};

/**
* 应用消息链接点击事件。应用消息中的超链接被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.token: Number类型，发送消息的时候设置的token,可以用来判断哪一条消息被点击。
* @example
* 使用示例：
* yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_CLICKED,onLinkClicked);
*
* function onLinkClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="消息的Token="+eventData.token;
* }
*/
IYYChannelAppMsg.APP_LINK_CLICKED = "YY_APP_LINK_CLICKED";

/**
* 应用消息链接点击事件。应用消息中的超链接被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.token: Number类型，发送消息的时候设置的token,可以用来判断哪一条消息被点击。
* eventData.userData: Number类型，发送消息的时候链接里设置的userData值。
* @example
* 使用示例：
* yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_EX_CLICKED,onLinkExClicked);
*
* function onLinkExClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="消息的Token="+eventData.token+" userData="+eventData.userData;
* }
*/
IYYChannelAppMsg.APP_LINK_EX_CLICKED = "YY_APP_LINK_EX_CLICKED";
//-------------------------------IYYChannelChat-------------------------------

/**
* IYYChannelChat 构造函数。
* @extends IYYCommon
* @class 公屏聊天和私聊接口。接受公屏聊天消息和私聊消息。
* @constructor
*/
function IYYChannelChat() {
};

IYYChannelChat.prototype = new IYYCommon();

/**
* 在频道中收到公屏聊天消息。当有用户在公屏上输入聊天信息的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型，发送公屏消息的用户的uid。
* eventData.msg: String类型，发送公屏消息的文字内容。
* @example
* 使用示例：
* yy.channel.chat.addEventListener(IYYChannelChat.CHAT,onChannelChat);
*
* function onChannelChat(eventData)
* {
*     document.getElementById("txtLog").innerHTML="收到来自uid="+eventData.uid+"的公屏聊天消息msg="+eventData.msg;
* }
*/
IYYChannelChat.CHAT = "YY_CHANNEL_CHAT";

/**
* 在频道中收到私聊消息。当收到其他用户发送过来的私聊消息的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型，发送私聊消息的用户的uid。
* eventData.msg: String类型，发送私聊消息的文字内容。
* @example
* 使用示例：
* yy.channel.chat.addEventListener(IYYChannelChat.CHAT_FROM,onChannelChatFrom);
*
* function onChannelChatFrom(eventData)
* {
*     document.getElementById("txtLog").innerHTML="收到来自uid="+eventData.uid+"的私聊消息msg="+eventData.msg;
* }
*/
IYYChannelChat.CHAT_FROM = "YY_CHANNEL_CHAT_FROM";
//-------------------------------IYYReceptionChannel-------------------------------
/**
* IYYReceptionChannel 构造函数。
* @extends IYYCommon
* @class 接待频道接口，提供获取，设置，取消接待频道等功能。
* @constructor
*/
function IYYReceptionChannel() {
};

IYYReceptionChannel.prototype = new IYYCommon();


/**
* 设置接待频道。某些情况下需要等待几秒才生效。
* @param {Number} cid 频道的长位id。
* @returns 返回调用是否成功,是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYReceptionChannel.prototype.setReceptionChannel = function(cid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof cid !== "number" || isNaN(cid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IReceptionChannel_SetReceptionChannel", cid);
    return result;
};

/**
* 获取接待频道。
* @returns 返回接待频道信息，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>cid</b>: Number类型 接待频道的长位Id。如果为0，表示当前没有设置接待频道<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.receptionChannel.getReceptionChannel();
* if(result.ret==0)
* {
*    if(result.cid==0)
*    {
*        document.getElementById("txtLog").innerHTML = "尚未设置接待频道";
*    }
*    else
*    {
*        document.getElementById("txtLog").innerHTML = "接待频道Id：" + result.cid;
*    }
* }
*   
* 成功的返回值示例:{ ret:0,cid:88995544}
* 失败的返回值示例:{ ret:984832}

*/
IYYReceptionChannel.prototype.getReceptionChannel = function () {
    var result = callExternal("IReceptionChannel_GetReceptionChannel");
    if (result.ret == 0) {
        return { ret: 0, cid: result.channel_id };
    }
    else {
        return result;
    }
};
/**
* 反设置接待频道，移除接待频道。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYReceptionChannel.prototype.unSetReceptionChannel = function() {
    var result = callExternal("IReceptionChannel_UnSetReceptionChannel");
    return result;
};


//-------------------------------IYYChannelMicList-------------------------------
/**
* IYYChannelMicList 构造函数。
* @extends IYYCommon
* @class 麦序接口，提供麦序的信息和相关事件。

* @constructor
*/
function IYYChannelMicList() {
};

IYYChannelMicList.prototype = new IYYCommon();


/**
* 获取麦序用户列表。
* @returns 返回麦序中所有用户的uid。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>micList</b>: Array类型 返回麦序中所有用户的uid，uid保存在一个数组中。<br/>
* @type Object
* @example 
* 使用示例:
* var result=yy.channel.micList.getMicList();
* if(result.ret==0)
* {
*   document.getElementById("txtLog").innerHTML="在麦序中的用户为："+result.micList;
* }
* 成功的返回值示例:{ ret:0,micList:[1234444,2234455,3311344]}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelMicList.prototype.getMicList = function() {
    var result = callExternal("IChannelMicList_GetMicList");
    if (result.ret === 0) {
        return { ret: 0, micList: result.mic_list.concat() };
    }
    else {
        return result;
    }
};

/**
* 加入麦序。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.joinMicList = function() {
    var result = callExternal("IChannelMicList_JoinMicList");
    return result;
};
/**
* 离开麦序。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.leaveMicList = function() {
    var result = callExternal("IChannelMicList_LeaveMicList");
    return result;
};

/**
* 拉人上麦。需要的权限跟YY客户端一致。
* @param {Number} uid 被拉用户的uid。    
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.pullUserToMicList = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_PullUserToMicList", uid);
    return result;
};
/**
* 踢人下麦。需要的权限跟YY客户端一致。
* @param {Number} uid 被踢用户的uid。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.kickMicListUser = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_KickMicListUser", uid);
    return result;
};

/**
* 清空麦序。需要的权限跟YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.clearMicList = function() {
    var result = callExternal("IChannelMicList_ClearMicList");
    return result;
};

/**
* 将用户调整到2号麦序。需要的权限跟YY客户端一致。
* @param {Number} uid 被移动用户的uid。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.moveUserToTop = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_MoveUserToTop", uid);
    return result;
};


/**
* 获取连麦用户列表。
* @returns 返回连麦中的所有用户的uid。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>linkedMicList</b>: Array类型 uid保存在一个数组中。无人连麦时返回空数组。<br/>
* @type Object
* @example 
* 使用示例:
* var result=yy.channel.micList.linkedMicList();
* if(result.ret==0)
* {
*   document.getElementById("txtLog").innerHTML="在连麦中的用户为："+result.linkedMicList;
* }
* 成功的返回值示例:{ ret:0,linkedMicList:[1234444,2234455,3311344]}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelMicList.prototype.getLinkedMicList = function () {
    var result = callExternal("IChannelMicList_GetLinkedMicList");
    if (result.ret === 0) {
        return { ret: 0, linkedMicList: result.linked_mic_list.concat() };
    }
    else {
        return result;
    }
};

/**
* 将用户加入到连麦列表。需要在麦序模式才有效，需要有频道管理员及以上权限才能调用成功。
* @param {Number} uid 被连麦用户的uid。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.linkMicToTheQueueHead = function (uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_LinkMicToTheQueueHead", uid);
    return result;
};

/**
* 将用户移出连麦列表。需要在麦序模式才有效，需要有频道管理员及以上权限才能调用成功。
* @param {Number} uid 移出连麦的用户的uid。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.removeFromLinkedMicList = function (uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_RemoveFromLinkedMicList", uid);
    return result;
};

/**
* 获得频道模式。
* @returns 返回当前频道模式，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>cid</b>: Number类型 返回频道模式 ，0=自由模式，1=主席模式，2=麦序模式<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.micList.getMicListMode();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "当前频道模式：" + result.mode;
* }
*   
* 成功的返回值示例:{ ret:0,mode:2}
* 失败的返回值示例:{ ret:984832}
* @type Object
*/
IYYChannelMicList.prototype.getMicListMode = function () {
    var result = callExternal("IChannelMicList_GetMicListMode");
    if (result.ret == 0) {
        return { ret: 0, mode: result.mode };
    } else {
        return result;
    }

};
/**
* 设置频道模式。需要有管理员及以上权限，两次调用需要有一定的时间间隔。
* @param {Number} mode 频道模式，0=自由模式，1=主席模式，2=麦序模式，其它值无效。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.setMicListMode = function (mode) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof mode !== "number" || isNaN(mode)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_SetMicListMode",mode);
    return result
};

/**
* 将麦序上指定的用户上移一位。麦序模式下有效，需要有管理员及以上权限，规则和权限同YY客户端一致。
* @param {Number} uid 被上移的用户uid。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.moveUpOnePosition = function (uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_MoveUpOnePosition",uid);
    return result;
};

/**
* 将麦序上指定的用户下移一位。麦序模式下有效，需要有管理员及以上权限，规则和权限同YY客户端一致。
* @param {Number} uid 被下移的用户uid。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.moveDownOnePosition = function (uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelMicList_MoveDownOnePosition",uid);
    return result;
};

/**
* 获取麦首的麦序时间，返回为秒数。
* @returns 返回麦首的麦序时间，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>seconds</b>: Number类型 返回麦首的麦序剩余时间，单位为秒<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.micList.getFirstMicSeconds();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "麦首麦序时间剩余：" + result.seconds;
* }
*   
* 成功的返回值示例:{ ret:0,seconds:248}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelMicList.prototype.getFirstMicSeconds = function () {
    var result = callExternal("IChannelMicList_GetFirstMicSeconds");
    if (result.ret == 0) {
        return { ret: 0, seconds: result.seconds };
    } else {
        return result;
    }
};

/**
* 麦首麦序时间加倍。需要有管理员及以上权限，规则和权限同YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.doubleFirstMicSeconds = function () {
    var result = callExternal("IChannelMicList_DoubleFirstMicSeconds");
    return result;
};

/**
* 开麦，即允许用户加入麦序。需要有管理员及以上权限，规则和权限同YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.enableJoinMicList = function () {
    var result = callExternal("IChannelMicList_EnableJoinMicList");
    return result;
};

/**
* 禁麦，即禁止用户加入麦序。需要有管理员及以上权限，规则和权限同YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.disableJoinMicList = function () {
    var result = callExternal("IChannelMicList_DisableJoinMicList");
    return result;
};

/**
* 控麦，即禁止麦首用户说话，麦序时间暂停，管理员除外。需要有管理员及以上权限，规则和权限同YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.controlMicList = function () {
    var result = callExternal("IChannelMicList_ControlMic");
    return result;
};               
/**
* 放麦，即允许麦首用户说话，麦序时间继续。需要有管理员及以上权限，规则和权限同YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.releaseMicList = function () {
    var result = callExternal("IChannelMicList_ReleaseMic");
    return result;
};

/**
* 查询当前是否是开麦状态。
* @returns 返回开麦状态，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>enabled</b>: Boolean类型 是否开麦，true=开麦，false=禁麦。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.micList.isJoinMicListEnabled();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "麦首麦序时间剩余：" + result.enabled;
* }
*   
* 成功的返回值示例:{ ret:0,enabled:true}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelMicList.prototype.isJoinMicListEnabled = function () {
    var result = callExternal("IChannelMicList_IsJoinMicListEnabled");
    if (result.ret == 0) {
        return { ret: 0, enabled: result.enabled };
    } else {
        return result;
    }
};

/**
* 查询当前是否是控麦状态。
* @returns 返回控麦状态，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>controlled</b>: Boolean类型 当前是否控麦，true=控麦，false=放麦。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.micList.isMicListControlled();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "麦首麦序时间剩余：" + result.controlled;
* }
*   
* 成功的返回值示例:{ ret:0,controlled:true}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelMicList.prototype.isMicListControlled = function () {
    var result = callExternal("IChannelMicList_IsMicListControlled");
    if (result.ret == 0) {
        return { ret: 0, controlled: result.controlled };
    } else {
        return result;
    }
};

/**
* 发送麦序提醒给2号麦用户，上麦后只能向用户发送一次。需要有管理员及以上权限，规则和权限同YY客户端一致。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelMicList.prototype.sendMicListNotification = function () {
    var result = callExternal("IChannelMicList_SendMicListNotification");
    return result;
};

/**
* 控麦事件。管理员控麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.adminUid: Number类型 执行控麦操作的管理员的uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.CONTROLLED,onMicControlled);
*
* function onMicControlled(eventData)
* {
*     document.getElementById("txtLog").innerHTML="管理员"+eventData.adminUid+"执行了控麦操作";
* }
*/
IYYChannelMicList.CONTROLLED = "YY_MICLIST_CONTROLLED";

/**
* 放麦事件。管理员放麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.adminUid: Number类型 执行放麦操作的管理员的uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.RELEASED,onMicReleased);
*
* function onMicReleased(eventData)
* {
*     document.getElementById("txtLog").innerHTML="管理员"+eventData.adminUid+"执行了放麦操作";
* }
*/
IYYChannelMicList.RELEASED = "YY_MICLIST_RELEASED";

/**
* 禁麦事件。管理员禁麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.adminUid: Number类型 执行禁麦操作的管理员的uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.DISABLE_JOIN,onMicDisableJoin);
*
* function onMicDisableJoin(eventData)
* {
*     document.getElementById("txtLog").innerHTML="管理员"+eventData.adminUid+"执行了禁麦操作";
* }
*/
IYYChannelMicList.DISABLE_JOIN = "YY_MICLIST_DISABLE_JOIN";

/**
* 开麦事件。管理员开麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.adminUid: Number类型 执行开麦操作的管理员的uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.ENABLE_JOIN,onMicEnableJoin);
*
* function onMicEnableJoin(eventData)
* {
*     document.getElementById("txtLog").innerHTML="管理员"+eventData.adminUid+"执行了开麦操作";
* }
*/
IYYChannelMicList.ENABLE_JOIN = "YY_MICLIST_ENABLE_JOIN";

/**
* 麦首麦序时间变化事件。管理员修改麦首麦序时间的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.adminUid: Number类型 执行麦序时间加倍操作的管理员的uid。
* eventData.uid: Number类型 麦首的用户uid。
* eventData.seconds: Number类型 变化后的麦序时间，单位为秒。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.TIME_CHANGED,onMicTimeChanged);
*
* function onMicTimeChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="管理员"+eventData.adminUid+"修改麦首"+eventData.uid+"的麦序时间为"+eventData.seconds+"秒";
* }
*/
IYYChannelMicList.TIME_CHANGED = "YY_MICLIST_TIME_CHANGED";

/**
* 用户说话状态变化事件。用户开始说话和停止说话时会触发，同频道界面用户名前的绿点变化一致。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 说话的用户uid。
* eventData.speaking: Boolean类型 true=开始说话，false=停止说话
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.SPEAKING_STATE_CHANGED,onSpeakingStateChanged);
*
* function onSpeakingStateChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"说话状态:"+eventData.speaking;
* }
*/
IYYChannelMicList.SPEAKING_STATE_CHANGED = "YY_MICLIST_SPEAKING_STATE_CHANGED";

/**
* 收到麦序提醒事件。当处在麦序第二位的时候才能收到此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.adminUid: Number类型 发送提醒的管理员的uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.NOTIFICATION,onRecvNotification);
*
* function onRecvNotification(eventData)
* {
*     document.getElementById("txtLog").innerHTML="收到来自"+eventData.adminUid+"的麦序提醒";
* }
*/
IYYChannelMicList.NOTIFICATION = "YY_MICLIST_NOTIFICATION";


/**
* 麦序用户增加事件。当有用户加入到麦序时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 加入的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_JOIN,onUserJoin);
*
* function onUserJoin(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"加入到了麦序中";
* }
*/
IYYChannelMicList.USER_JOIN = "YY_MICLIST_USER_JOIN";


/**
* 麦序用户离开事件。当有用户离开麦序时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 离开的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_LEAVE,onUserLeave);
*
* function onUserLeave(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开麦序了";
* }
*/
IYYChannelMicList.USER_LEAVE = "YY_MICLIST_USER_LEAVE";


/**
* 麦序用户移动事件。麦序用户发生位置调整的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.moveId: Number类型 麦序中发生移动的用户uid。
* eventData.toAfterId: Number类型 移动到哪个用户后面，用户无法移动到第一个。   
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_MOVE,onUserMove);
*
* function onUserMove(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"移动到"+eventData.toAfterId+"后面";
* }
*/
IYYChannelMicList.USER_MOVE = "YY_MICLIST_USER_MOVE";


/**
* 麦序用户清除事件。麦序用户全部被清除的时候会触发。
* @field
* @example
* 侦听函数格式: function(){    } 
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.CLEAR,onUserClear);
*
* function onUserClear()
* {
*     document.getElementById("txtLog").innerHTML="麦序用户被清除";
* }
*/
IYYChannelMicList.CLEAR = "YY_MICLIST_CLEAR";

/**
* 用户加入连麦列表事件。当有新的用户连麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 新加入连麦的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_LINKED,onUserLinked);
*
* function onUserLinked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"加入连麦";
* }
*/
IYYChannelMicList.USER_LINKED = "YY_MICLIST_USER_MIC_LINKED";


/**
* 用户移出连麦列表事件。当有用户移出连麦的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: Number类型 被移出连麦的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_UNLINKED,onUserUnlinked);
*
* function onUserUnlinked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"移出连麦";
* }
*/
IYYChannelMicList.USER_UNLINKED = "YY_MICLIST_USER_MIC_UNLINKED";

/**
* 频道模式变化事件。当频道模式发生变化的时候触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.mode: Number类型 当前的频道模式 0=自由模式，1=主席模式，2=麦序模式。
* @example
* 使用示例： 
* yy.channel.micList.addEventListener(IYYChannelMicList.MODE_CHANGED,onModeChanged);
*
* function onModeChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="当前频道模式="+eventData.mode;
* }
*/
IYYChannelMicList.MODE_CHANGED = "YY_MICLIST_MODE_CHANGE";
//-------------------------------IYYChannelUserController-------------------------------
/**
* IYYChannelUserController 构造函数。
* @extends IYYCommon
* @class 频道用户控制接口。
* @constructor
*/
function IYYChannelUserController() {

};

IYYChannelUserController.prototype = new IYYCommon();

/**
* 允许频道用户文字聊天。权限规则和disableMsg方法相同。
* @see #disableMsg
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserController.prototype.enableMsg = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_EnableMsg", uid);
    return result;
};

/**
* 禁止频道用户文字聊天。
* 权限规则如下<br>
* OW:可以允许和禁止频道内任何其他成员语音，文字。包括（VP MA CA CA2 R VIP G U)。<br>
* VP：可以允许和禁止频道内任何其他成员语音，文字。 除了（OW，VP）。<br>
* MA：可以允许和禁止频道内任何其他成员语音，文字。 除了（OW，VP,MA）。<br>
* CA：可以允许和禁止相对应有管理权限的子频道内的语音，文字。包括（ CA2 R VIP G U）。<br>
* CA2：可以允许和禁止相对应有管理权限的子频道内的语音，文字。包括（ R VIP G U）。<br>
* R VIP G U 均无任何权限操作。<br>
* 字母代表的意义如下：<br>
* 游客(U),临时嘉宾(G),嘉宾(VIP),会员(R),二级子频道管理员(CA2),子频道管理员(CA),全频道管理员(MA),频道总管理(VP),频道所有者(OW)
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see #enableMsg
*/
IYYChannelUserController.prototype.disableMsg = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_DisableMsg", uid);
    return result;
};
/**
* 允许频道用户语音聊天。权限规则和disableMsg方法相同。
* @see #disableMsg
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserController.prototype.enableSpeak = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_EnableSpeak", uid);
    return result;
};
/**
* 禁止频道用户语音聊天。权限规则和disableMsg方法相同。
* @see #disableMsg
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserController.prototype.disableSpeak = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_DisableSpeak", uid);
    return result;
};
/**
* 查询指定用户是否允许文字聊天。
* @param {Number} uid 被查询的用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回查询结果，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>enabled</b>: Boolean类型 true=用户允许文字聊天，false=用户已被禁止文字聊天。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.userController.isMsgEnabled(435345);
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = result.enabled?"用户可以文字聊天": "用户被禁止文字聊天";
* }
*   
* 成功的返回值示例:{ ret:0,enabled:true}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelUserController.prototype.isMsgEnabled = function (uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_IsMsgEnabled", uid);
    if (result.ret == 0) {
        return { ret: 0, enabled: result.enabled };
    }
    else {
        return result;
    }
};
/**
* 查询指定用户是否允许语音聊天。
* @param {Number} uid 被查询的用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回查询结果，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>enabled</b>: Boolean类型 true=用户允许语音聊天，false=用户已被禁止语音聊天。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.userController.isSpeakEnabled(435345);
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = result.enabled?"用户可以语音聊天": "用户被禁止语音聊天";
* }
*   
* 成功的返回值示例:{ ret:0,enabled:true}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelUserController.prototype.isSpeakEnabled = function (uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_IsSpeakEnabled", uid);
    if (result.ret == 0) {
        return { ret: 0, enabled: result.enabled };
    }
    else {
        return result;
    }
};
/**
* 进子频道。
* @param {Number} cid 子频道长位id,必须是在当前大频道中的一个频道。 
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserController.prototype.jumpToSubChannel = function(cid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof cid !== "number" || isNaN(cid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_JumpToSubChannel", cid);
    return result;
};
/**
* 拉人进子频道。<br>
* 权限规则如下<br>
* OW：可以调度频道内任何成员,包括（VP MA CA CA2 R VIP G U)。<br>
* VP：可以调度频道内除OW以外的任何成员，包括（VP MA CA1 CA2 R VIP G U)。<br>
* MA：可以调度频道内除了OW，VP以外的任何成员，包括（MA CA CA2 R VIP G U)。<br>
* CA:可以调度相对应有管理权限的1级子频道内的成员，（OW，VP,MA）除外。<br>
* CA2：可以调度相对应有管理权限的2级子频道内的成员，（OW，VP,MA，CA1）除外。<br>
* R VIP G U 均无任何权限操作。<br>
* 字母代表的意义如下：<br>
* 游客(U),临时嘉宾(G),嘉宾(VIP),会员(R),二级子频道管理员(CA2),子频道管理员(CA),全频道管理员(MA),频道总管理(VP),频道所有者(OW)<br>
* @param {Number} uid 被拉的用户的uid。
* @param {Number} cid 子频道长位id,必须是当前大频道中的一个频道。 
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserController.prototype.pullToSubChannel = function(uid, cid) {
    if (arguments.length !== 2) return { ret: yy_e_api_param_error };
    if (typeof cid !== "number" || typeof uid !== "number" || isNaN(uid) || isNaN(cid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_PullToSubChannel", uid, cid);
    return result;
};

/**
* 获取用户所在子频道ID。该用户必须在当前大频道中。
* @returns 返回用户所在的频道信息，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>cid</b>: Number类型 用户所在子频道长位Id<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.channel.userController.getUserSubChannelId(435345);
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "用户当前在" + result.cid+"频道";
* }
*   
* 成功的返回值示例:{ ret:0,cid:88548884}
* 失败的返回值示例:{ ret:984832}
*/
IYYChannelUserController.prototype.getUserSubChannelId = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_GetUserSubChannelId", uid);
    if (result.ret === 0) {
        return { ret: 0, cid: result.cid };
    }
    else {
        return result;
    }

};

/**
* 设置马甲。发起设置用户和被设置用户必须同时在线且在同一个大频道，发起者需要有管理员马甲，具体规则和权限同YY客户端一致。
* @param {Number} cid 用户所在的频道id。如果用户在子频道，需要传子频道id。
* @param {Number} uid 用户的uid。 
* @param {Number} role 用户的角色(马甲)数值。可以设置的马甲的数值如下：  <br>
*   游客(U)  白马 25 <br>
*   临时嘉宾(G) 浅绿色马甲 66 <br>
*   嘉宾(VIP)  绿马 88 <br>
*   会员(R)  蓝马 100 <br>
*   二级子频道管理员(CA2)  粉马 150 <br>
*   子频道管理员(CA) 红马 175 <br>
*   全频道管理员(MA)  黄马 200 <br>
*   频道总管理(VP) 橙马 230 <br>
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserController.prototype.setUserRole = function(cid, uid, role) {
    if (arguments.length !== 3) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid) || typeof cid !== "number" || isNaN(cid) || typeof role !== "number" || isNaN(role)) return { ret: yy_e_api_param_error };
    var result = callExternal("IChannelUserController_SetUserRole", cid, uid, role);
    return result;
};
//-------------------------------IYYChannelUserListPopMenu-------------------------------
/**
* IYYChannelUserListPopMenu 构造函数。
* @extends IYYCommon
* @class 频道右键菜单接口。频道用户列表右键菜单设置和取消， 和对应的菜单事件设置 。
* @constructor
*/
function IYYChannelUserListPopMenu() {

};

IYYChannelUserListPopMenu.prototype = new IYYCommon();


/**
* 设置大频道用户列表右键菜单，可以增加一个菜单项，一个应用只可以增加一个菜单项。
* @param {String} menuText 菜单上的文字,字符串最大长度20字节。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserListPopMenu.prototype.setPopMenu = function(menuText) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof menuText !== "string") return { ret: yy_e_api_param_error };
    menuText = menuText.replace(/\\/g, "\\\\"); //替换斜杠
    menuText = menuText.replace(/\"/g, "\\\""); //替换双引号    
    var result = callExternal("IChannelUserListPopMenu_SetPopMenu", menuText);
    return result;
};


/**
* 去掉右键菜单增加项。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelUserListPopMenu.prototype.unSetPopMenu = function() {
    var result = callExternal("IChannelUserListPopMenu_UnSetPopMenu");
    return result;
};


/**
* 用户点击菜单项事件。当用户列表右键菜单项被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.uid: Number类型 被选中的用户的uid。
* eventData.cid: Number类型 当前的频道长位id。    
* @example
* 使用示例：
* yy.channel.userListPopMenu.addEventListener(IYYChannelUserListPopMenu.CLICKED,onClicked);
*
* function onClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"菜单被点击,当前频道"+eventData.cid;
* }
*/

IYYChannelUserListPopMenu.CLICKED = "YY_POP_MENU_CLICKED";

//-------------------------------IYYChannelTabPage-------------------------------
/**
* IYYChannelTabPage 构造函数。
* @extends IYYCommon
* @class 频道tab页控制接口 。
* @constructor
*/
function IYYChannelTabPage() {

};

IYYChannelTabPage.prototype = new IYYCommon();
/**
* 显示应用所在的tabpage窗口。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYChannelTabPage.prototype.selectTabPage = function() {
    var result = callExternal("IChannelTabPage_SelectTabPage");
    return result;
};
//-------------------------------IYYCloud-----------------------------

/**
* IYYCloud 构造函数。
* @extends IYYCommon
* @class 简单存储接口。提供简单的简单存储数据服务，包括增，删，改，查的基本操作，除了 频道所有者(OW紫马)和 频道总管理(VP橙马)可以删除和修改所有数据之外，其他用户只能删除和修改自己的数据，每个用户都可以查询所有数据。
* @constructor
*/
function IYYCloud() {

};


IYYCloud.prototype = new IYYCommon();

//----------常量----------



/**
* 增加数据。<b>注意:同一个用户在一个应用中两次保存之间需要间隔1秒</b>。
* @param {Number} int1 要保存的数据，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {Number} int2 要保存的数据，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {String} str 要保存的数据。    
* @returns 返回调用是否成功,是一个Object对象,具体属性如下<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>key</b>: String类型 返回码 增加成功后返回数据的key。key可以唯一标识一条数据<br/>
* @example 
* var result=yy.cloud.addData(11,22,"hello yy");
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML=result.ret;
* }
* 成功时返回数据key值和返回码0,例如 {ret:0,key:"000000004f55d48f"}。
* 失败时返回错误代码，例如{"ret":5}
* @type Object
*/
IYYCloud.prototype.addData = function(int1, int2, str) {
    if (arguments.length === 0 || arguments.length > 3) return { ret: yy_e_api_param_error };
    if (typeof int1 !== "number" || typeof int2 !== "number" || typeof str !== "string" || isNaN(int1) || isNaN(int2)) return { ret: yy_e_api_param_error };
    str = str.replace(/\\/g, "\\\\"); //替换斜杠
    str = str.replace(/\"/g, "\\\""); //替换双引号
    var result;
    switch (arguments.length) {
        case 1:
            result= callExternal("ICloud_AddData", 0, 0, arguments[0]);
            break;
        case 2:
            result= callExternal("ICloud_AddData", arguments[0], 0, arguments[1]);
            break;
        case 3:
            result= callExternal("ICloud_AddData", arguments[0], arguments[1], arguments[2]);
            break;
        default:
    }
    if (result.ret == 0) {
        return { ret: 0, key: result.key };
    } else {
        return result;
    }
};


/**
* 修改数据。
* @param {Number} int1 被修改的数据的新值，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {Number} int2 被修改的数据的新值，32位无符号整数,范围[0,4294967295]，超出范围返回错误码12。 
* @param {String} str 被修改的数据的新值。          
* @param {Array} filter 过滤器数组，保存YYCloudFilter对象数组，找到要修改的数据。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see YYCloudFilter
*/
IYYCloud.prototype.updateData = function(int1, int2, str, filter) {
    if (arguments.length !== 4) return { ret: yy_e_api_param_error };
    if (typeof int1 !== "number" || typeof int2 !== "number" || typeof str !== "string" || !(filter instanceof Array) || isNaN(int1) || isNaN(int2)) return { ret: yy_e_api_param_error };
    var filterString = "";
    var sp = "";
    str = str.replace(/\\/g, "\\\\"); //替换斜杠
    str = str.replace(/\"/g, "\\\""); //替换双引号
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_UpdateData", int1, int2, str, filterString);
    return result;
};


/**
* 删除数据。
* @param {Array} filter 过滤器数组,即删除的条件。保存YYCloudFilter对象数组。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see YYCloudFilter
*/
IYYCloud.prototype.deleteData = function(filter) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (!(filter instanceof Array)) return { ret: yy_e_api_param_error };
    var filterString = "";
    var sp = "";
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_DeleteData", filterString);
    return result;
};





/**
* 查询数据。
* @param {Array} filter 过滤器数组，查询的条件。数组中为YYCloudFilter对象。没有查到数据或查询出错时返回空数组。    
* @returns 返回查询结果,是一个Object对象,具体属性如下<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>data</b>: Array类型 查询结果,保存在数组中。数组的元素为Object对象。<br/>
* 每个数据的属性如下：<br/>
* <b>key</b>: String类型 数据的键值。<br/>
* <b>createTime</b>: String类型 数据创建的时间。<br/>
* <b>updateTime</b>: String类型 数据更新的时间。<br/>
* <b>creatorUid</b>: Number类型 数据创建者的uid。<br/>
* <b>intValue1</b>: Number类型 int字段数据，32位无符号整数,范围[0,4294967295]。<br/>
* <b>intValue2</b>: Number类型 int字段数据，32位无符号整数,范围[0,4294967295]。<br/>
* <b>stringValue</b>: String类型 string字段数据。<br/>
* @example 
* //查询某一时间段内的数据
* var dt = new Date();
* var filterTime = new YYCloudFilter();
* filterTime.field = YYCloudFilter.EField.CREATE_TIME;
* filterTime.op = YYCloudFilter.EFilterOperator.GREATER;
* filterTime.value = Math.ceil(dt.getTime() / 1000 - 600);
* filterTime.condition = YYCloudFilter.EFilterCondition.NONE;
* var result = yy.cloud.queryData([filterTime]);
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML="查询到数据个数:"+result.data.length;
* }
* 成功时返回数据,示例如下
*{ret:0,data:[
*  {key:"4f55d3d7",createTime:"2012-03-06 17:07:35",updateTime:"2012-03-06 17:07:35",creatorUid:1710881282,intValue1:1,intValue2:100,stringValue:"你好，简单存储！hello cloud"},
*  {key:"4f55d48f",createTime:"2012-03-06 17:10:39",updateTime:"2012-03-06 17:10:39",creatorUid:1710881282,intValue1:1,intValue2:100,stringValue:"可存可取"},
*  {key:"4f55d57d",createTime:"2012-03-06 17:14:37",updateTime:"2012-03-06 17:14:37",creatorUid:1710881282,intValue1:1,intValue2:100,stringValue:"this is test"}
*]} 
* 成功时但没有查询到数据，格式如下* {"ret":0,"data":[]}
* 失败时返回错误代码，例如{"ret":5}
* @type Object
* @see YYCloudFilter
*/
IYYCloud.prototype.queryData = function(filter) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (!(filter instanceof Array)) return { ret: yy_e_api_param_error };
    var filterString = "";
    var sp = "";
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_QueryData", filterString);
    if (result.ret === 0) {
        return { ret: 0, data: parseCloudDataList(result.data) };
    }
    else {

        return result;
    }
};
//-----------------------------------IYYFinance---------------------------

/**
* IYYFinance 构造函数
* @extends IYYCommon
* @class 财务接口。提供Y币扣费请求和赠送开放平台礼物接口。
* @constructor
*/
function IYYFinance() {
};

IYYFinance.prototype = new IYYCommon();


/**
* 发送扣费请求。某些参数需要从应用服务器获取。
* @param {String} sn 请求流水号，从您的应用服务器获取,请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} serverId 您的应用服务器的Id，您可以有多个应用服务器，请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} money 扣费数量，最小单位为0.01Y币，也就是1分钱。 例如 参数100表示付费1Y币。
* @param {Number} moneyType 目前10表示Y币 未来会支持其他种类货币。
* @param {String} token 该次消费请求的token，从应用服务器获取,请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} mode 调用的方式，0=真实扣费，1=测试扣费，其他值无效。测试时连接测试支付服务器。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=发送请求成功，仅仅表示发送请求成功，不表示扣费成功，非0值参考错误代码。是否扣费成功请参考IYYFinance.BUY_RESPONSE事件。<br/>
* @type Object 
*/
IYYFinance.prototype.buy = function (sn, serverId, money, moneyType, token, mode) {
    if (arguments.length < 5 || arguments.length > 6) return { ret: yy_e_api_param_error };
    if (typeof sn !== "string" || typeof serverId !== "number" || typeof money !== "number" || typeof moneyType !== "number" || typeof token !== "string") return { ret: yy_e_api_param_error };
    if (mode === null || mode === undefined || mode === void 0) mode = 0;
    //yytrace("SDK:"+money + "  " + Math.floor(money));
    //if (money != Math.floor(money)) return { ret: yy_e_api_param_error };
    //老版本用老接口，新版本用新接口
    yytrace("yyversion:"+(yy.version.majorVersion * 100 + yy.version.minorVersion));
    if ((yy.version.majorVersion * 100 + yy.version.minorVersion) < 113) {
        var result = callExternal("IFinance_Buy", sn, serverId, money, moneyType, token, mode);
        return result;
    }
    else {
        return yy.finance.buyByYuan(sn, serverId, money / 100, moneyType, token, mode);
    }
};
/**
* 以元为单位发送扣费请求。某些参数需要从应用服务器获取。
* @param {String} sn 请求流水号，从您的应用服务器获取,请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} serverId 您的应用服务器的Id，您可以有多个应用服务器，请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} money 扣费数量，最小单位为0.01Y币，也就是1分钱。 <b>例如 参数1.14表示付费1.14Y币。</b>
* @param {Number} moneyType 目前10表示Y币 未来会支持其他种类货币。
* @param {String} token 该次消费请求的token，从应用服务器获取,请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} mode 调用的方式，0=真实扣费，1=测试扣费，其他值无效。测试时连接测试支付服务器。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=发送请求成功，仅仅表示发送请求成功，不表示扣费成功，非0值参考错误代码。是否扣费成功请参考IYYFinance.BUY_RESPONSE事件。<br/>
* @type Object 
*/
IYYFinance.prototype.buyByYuan = function (sn, serverId, money, moneyType, token, mode) {
    //if ((money * 100) != Math.floor(money * 100)) return { ret: yy_e_api_param_error };
    if (arguments.length < 5 || arguments.length > 6) return { ret: yy_e_api_param_error };
    if (typeof sn !== "string" || typeof serverId !== "number" || typeof money !== "number" || typeof moneyType !== "number" || typeof token !== "string") return { ret: yy_e_api_param_error };
    if (mode === null || mode === undefined || mode === void 0) mode = 0;
    var result = callExternal("IFinance_BuyByYuan", sn, serverId, money, moneyType, token, mode);
    return result;
};
/**
* 发送赠送礼物请求。某些参数需要从应用服务器获取。
* @param {String} sn 请求流水号，从您的应用服务器获取,请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} serverId 您的应用服务器的Id，您可以有多个应用服务器，请参考open.yy.com上文档中心的支付流程介绍。
* @param {Number} toUid 礼物接受者的uid，如果自己购买则填0。
* @param {Number} giftId 赠送礼物的Id。
* @param {Number} giftCount 赠送礼物的数量。
* @param {Number} moneyType 目前10表示Y币 未来会支持其他种类货币。
* @param {String} token 该次消费请求的token，从应用服务器获取,请参考open.yy.com上的支付流程介绍。
* @param {Number} mode 调用的方式，0=真实赠送，1=测试赠送，其他值无效。测试时连接测试支付服务器。
* @returns 仅仅表示发送请求成功，不表示扣费成功，0=发送请求成功，非0值参考错误代码。是否扣费成功请参考IYYFinance.BUY_GIFTS_RESPONSE事件。
* @type Object 
*/
IYYFinance.prototype.buyGifts = function (sn, serverId, toUid, giftId, giftCount, moneyType, token, mode) {
    if (arguments.length < 7 || arguments.length > 8) return { ret: yy_e_api_param_error };
    if (typeof toUid !== "number" || typeof sn !== "string" || typeof serverId !== "number" || typeof giftId !== "number" || typeof giftCount !== "number" || typeof moneyType !== "number" || typeof token !== "string") return { ret: yy_e_api_param_error };
    if (mode === null || mode === undefined || mode === void 0) mode = 0;
    var result = callExternal("IFinance_BuyGifts", toUid, sn, serverId, giftId, giftCount, moneyType, token, mode);
    return result;
};

/**
* 弹出充值Y币的页面。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYFinance.prototype.recharge=function()
{
	var result = callExternal("IFinance_Recharge");
    return result;
};



/**
* 扣费的响应事件。发送扣费请求后服务器返回结果时会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.sn: String类型 请求流水号。
* eventData.mode: Number类型 0=真实扣费，1=测试扣费。
* eventData.ret: Number类型 请求的结果。数值代表意义为：
* 1=正常处理 20=等待用户确认,可能会弹窗 25=非法token 3=该应用不允许扣费 -32=该用户Y币+佣金总额不足 255=失败，原因未知

* @example
* 使用示例：
* yy.finance.addEventListener(IYYFinance.BUY_RESPONSE,onBuyResponse);
*
* function onBuyResponse(eventData)
* {
*     document.getElementById("txtLog").innerHTML="流水号:"+eventData.sn+" 结果:"+eventData.ret+" 模式:"+eventData.mode;
* }
*/
IYYFinance.BUY_RESPONSE = "YY_BUY_RESPONSE";

/**
* 赠送开放平台礼物的响应事件。发送赠送礼物请求后服务器返回结果时会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.sn: String类型 请求流水号。
* eventData.mode: Number类型 0=真实扣费，1=测试扣费。
* eventData.ret: Number类型 请求的结果。数值代表意义为：
* 1=正常处理 20=等待用户确认,可能会弹窗 25=非法token 3=该应用不允许扣费 -32=该用户Y币+佣金总额不足 255=失败，原因未知
* @example
* 使用示例：
* yy.finance.addEventListener(IYYFinance.BUY_GIFTS_RESPONSE,onBuyGiftsResponse);
*
* function onBuyGiftsResponse(eventData)
* {
*     document.getElementById("txtLog").innerHTML="流水号:"+eventData.sn+" 结果:"+eventData.ret+" 模式:"+eventData.mode;
* }
*/
IYYFinance.BUY_GIFTS_RESPONSE = "YY_BUY_GIFTS_RESPONSE";

//-----------------------------------IYYIM---------------------------
/**
* IYYIM 构造函数
* @extends IYYCommon
* @class 聊天接口。提供弹出聊天对话框，弹出添加好友对话框等功能。
* @constructor
*/
function IYYIM() {
};

IYYIM.prototype = new IYYCommon();


/**
* 给指定用户发送聊天消息， 调用后会弹出聊天对话框，需要用户点击确认才发送。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @param {String} msg 等待发送的聊天的内容,最大长度40个字节。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object 
*/
IYYIM.prototype.chatTo = function(uid, msg) {
    if (arguments.length !== 2) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid) || typeof msg !== "string") return { ret: yy_e_api_param_error };
    msg = msg.replace(/\\/g, "\\\\"); //替换斜杠
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IIM_ChatTo", uid, msg);
    return result;
};


/**
* 判断指定的用户是否是好友。
* @param {Number} uid 指定用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回是否是好友，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>isFriend</b>: Boolean类型 是否是好友 ，true=是好友 false=不是好友<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.im.isFriend(3454365);
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "和用户3454365关系：" + result.isFriend?"好友:"非好友";
* }
*   
* 成功的返回值示例:{ ret:0,isFriend:true}
* 失败的返回值示例:{ ret:984832}
*/
IYYIM.prototype.isFriend = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IIM_IsFriend", uid);
    if (result.ret === 0) {
        return { ret: 0, isFriend: result.is_friend };
    }
    else {
        return result;
    }
};


/**
* 弹出添加好友对话框，用户确认才开始添加。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYIM.prototype.addFriend = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IIM_AddFriend", uid);
    return result;
};

/**
* 获取我所有好友的uid信息。
* @returns 返回所有好友的uid，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>buddyList</b>: Array类型 所有好友的uid ,uid保存在一个数组中 ，没有好友返回空数组<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.im.getAllBuddyList();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "我的好友个数：" + result.buddyList.length;
*     document.getElementById("txtLog").innerHTML = "<br/>我的好友为：" + result.buddyList;
* }
*   
* 成功的返回值示例:{ ret:0,isFriend:true}
* 失败的返回值示例:{ ret:984832}

*/
IYYIM.prototype.getAllBuddyList = function () {
    var result = callExternal("IIM_GetAllBuddyList");
    if (result.ret == 0) {
        return { ret: 0, buddyList: result.list };
    }
    else {
        return result;
    }
};

/**
* 获取我指定的好友的详细信息。目前只能返回uid，YY号和昵称这三个信息。好友不在线也可以取到信息。
* @param {Number} uid 要查询的好友的uid。
* @returns 返回好友的信息，是Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>uid</b>: Number类型 好友的uid<br/>
* <b>imId</b>: Number类型 好友的YY号<br/>
* <b>name</b>: String类型 好友的昵称<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.im.getIMUserInfo(43465465);
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "好友的uid：" + result.uid;
*     document.getElementById("txtLog").innerHTML = "<br/>好友的昵称：" + result.name;
*     document.getElementById("txtLog").innerHTML = "<br/>好友的YY号：" + result.imId;
* }
*   
* 成功的返回值示例:{ ret:0,uid:12345678,imId:987654321,name:"美羊羊"} 
* 失败的返回值示例:{ ret:984832}
*/
IYYIM.prototype.getIMUserInfo = function (uid) {
    if (arguments.length !== 1) return null;
    if (typeof uid !== "number" || isNaN(uid)) return null;
    var result = callExternal("IIM_GetIMUserInfo", uid);
    if (result.ret === 0) {
        return { ret: 0, uid: result.uid, imId: result.imid, name: unescape(result.nick_name) };
    }
    else {
        return result;
    }
};
//------------------------------IYYInteraction------------------------------
/**
* IYYInteraction 构造函数。
* @extends IYYCommon
* @class 应用互动接口。能够提供邀请者的信息。
* @constructor
*/
function IYYInteraction() {
}
IYYInteraction.prototype = new IYYCommon();

/**
* 获取邀请者uid,只有在被邀请启动应用才能获取成功。
* @returns 邀请者信息，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>inviterUid</b>: Number类型 邀请者的uid,如果没有邀请者inviterUid=0 <br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.interaction.getInviter();
* if (result.inviterUid == 0) {
*     document.getElementById("txtLog").innerHTML = "没有邀请者";
* } else {
*     document.getElementById("txtLog").innerHTML = "邀请者uid=" + result.inviterUid;
* }
* 成功的返回值示例:{ ret:0,inviterUid:435345} ,{ ret:0,inviterUid:0}
* 失败的返回值示例:{ ret:984832}
*/
IYYInteraction.prototype.getInviter = function () {
    var result = callExternal("IInteraction_GetInviter");
    if (result.ret == 0) {
        return { ret: 0, inviterUid: result.inviter_id };
    }
    else {
        return result;
    }
};

/**
* 发送邀请。可以邀请当前所在子频道的所有人或者邀请指定用户。
* @param {Number} inviteType 邀请的类型，1=邀请子频道所有人(子频道人数大于50调用无效)，2=邀请指定用户(将会打开窗口来选择用户列表)，其他值无效。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYInteraction.prototype.invite = function (inviteType) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (inviteType === 1 || inviteType === 2) {
        var result = callExternal("IInteraction_Invite", inviteType);
        return result;
    }
    else {
        return { ret: yy_e_api_param_error };
    }
};
/**
* 获取应用交互启动参数。当应用通过网页的链接或者应用消息启动时，可以获取启动时设置的参数。
* @returns 返回参数信息,是一个Object对象，具体属性如下。
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>runParams</b>: String类型 启动参数信息 <br/>
* @example 
* 使用示例：
* var result=yy.interaction.getRunParams();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "启动参数=" + result.runParams;
* }
* <b>通过应用消息启动应用</b>：
* 返回启动参数的格式为{ret:0,runParams:"{\"cookie\":8888,\"user_data\":0}"}，其中cookie的值是在发送应用消息的时候设置的token值。
* 
*
* <b>通过应用飞机票或者网页链接启动应用</b>：
* 典型飞机票链接格式如下yy://pd-[sid=43670710&appid=100901&userData=hellobabby] 
* 其中sid是频道id，appid是应用id，userData就是启动参数，是一个字符串。
* 示例的应用飞机票返回的启动参数为{ret:0,runParams:"hellobabby"}
*
* <b>通过其他方式启动应用</b>
* 返回空字符串。{ret:0,runParams:""}
* @type String
*/
IYYInteraction.prototype.getRunParams = function () {
    var result = callExternal("IInteraction_GetRunParams");
    if (result.ret === 0) {
        return { ret: 0, runParams: result.run_params };
    }
    else {
        return result;
    }
};

/**
* 生成当前应用的飞机票。
* @param {Number} subChannelId 应用所在子频道的长位id。
* @param {Boolean} isJump 运行飞机票时是否跳频道,如果false表示本频道有应用的话，不跳频道。
* @returns 返回参数信息,是一个Object对象，具体属性如下。
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>appTicket</b>: String类型 飞机票信息 <br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.interaction.createAppTicket(478555775,false);
* if (result.ret == 0) {
*     document.getElementById("txtLog").innerHTML = "飞机票信息:"+result.appTicket;
* }
* 成功的返回值示例:{ ret:0,appTicket:"yy://open-[sid=43671710&appid=114369&appn=SDK测试&uid=249267551&mid=0352292]/[SDK测试]"}
* 失败的返回值示例:{ ret:984832}
*/
IYYInteraction.prototype.createAppTicket = function (subChannelId, isJump) {
    var result = callExternal("IInteraction_CreateAppTicket", subChannelId, isJump);
    if (result.ret === 0) {
        return { ret: 0, appTicket: result.app_ticket };
    }
    else {
        return result;
    }
};


//------------------------------IYYNet------------------------------
/**
* IYYNet 构造函数。
* @extends IYYCommon
* @class 网络通讯接口。提供广播数据和接收广播数据的功能。
* @constructor
*/
function IYYNet() {

};

IYYNet.prototype = new IYYCommon();

/**
* 子频道数据广播，包括自己。<b>两次广播需要间隔20毫秒,否则广播数据可能会丢失。</b>
* @param {Number} sub_channel_id 子频道的长位id。
* @param {String} data 要广播的数据,最大长度2048个字节。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYNet.prototype.broadcastSubChannel = function(sub_channel_id, data) {
    if (arguments.length !== 2) return { ret: yy_e_api_param_error };
    if (typeof sub_channel_id !== "number" || isNaN(sub_channel_id) || typeof data !== "string") return { ret: yy_e_api_param_error };
    var result = callExternal("INet_BroadCastSubChannel", sub_channel_id, encodeURI(data));
    return result;
};

/**
* 全频道数据广播，包括自己。<b>两次广播需要间隔20毫秒,否则广播数据可能会丢失。</b>
* @param {String} data 要广播的数据。最大长度2048个字节。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYNet.prototype.broadcastAllChannel = function(data) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof data !== "string") return { ret: yy_e_api_param_error };
    var result = callExternal("INet_BroadCastAllChannel", encodeURI(data));
    return result;
};

/**
* 广播给指定用户。<b>两次广播需要间隔20毫秒,否则广播数据可能会丢失。</b>
* @param {Array} u_array 接收广播的用户uid，保存在一个数组中,用户个数必须小于等于100。 
* @param {String} data 要广播的数据。最大长度2048个字节。  
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYNet.prototype.broadcastToUsers = function(data, u_array) {
    if (arguments.length !== 2) return { ret: yy_e_api_param_error };
    if (typeof data !== "string" || !(u_array instanceof Array)) return { ret: yy_e_api_param_error };
    var result = callExternal("INet_BroadCastToUsers", encodeURI(data), u_array);
    return result;
};

/**
* 收到频道广播消息事件。 收到广播消息后触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.data: String类型  接收到的数据。
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.RECV,onRecv);
*
* function onRecv(eventData)
* {
*     document.getElementById("txtLog").innerHTML="接收到"+eventData.data;
* }
*/
IYYNet.RECV = "YY_RECV";

/**
* 收到网络断开事件。点击关闭应用按钮的时候会触发，收到此消息2秒后，应用会被关闭。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.result: Number类型  基于何种原因断开了连接，请参考错误代码。result=983064时表示点击了关闭应用按钮，即将断开连接;
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.CLOSED,onClosed);
*
* function onClosed(eventData)
* {
*     document.getElementById("txtLog").innerHTML="关闭原因:"+eventData.result;
* }
*/
IYYNet.CLOSED = "YY_NET_CLOSED";


//------------------------------IYYSecurity------------------------------
/**
* IYYSecurity 构造函数。
* @extends IYYCommon
* @class 安全接口。提供获取安全认证信息等功能。
*/
function IYYSecurity() {

};


IYYSecurity.prototype = new IYYCommon();
/**
* 获取当前用户安全认证令牌。
* @returns 返回令牌字符信息，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>token</b>: Number类型 令牌字符<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.security.getToken();
* if (result.ret == 0) {
*   document.getElementById("txtLog").innerHTML = "token="+result.token;
* }
* else
* {
*   document.getElementById("txtLog").innerHTML ="无法得到Token,错误码ret="+result.ret;
* }
* 成功的返回值示例:{ ret:0,token:"b9b8b4e4d0e107b3c7bd74bc48a6e28f0b1a0d61"}
* 失败的返回值示例:{ ret:984832}
*/
IYYSecurity.prototype.getToken = function () {
    var result = callExternal("ISecurity_GetToken");
    if (result.ret === 0) {
        return { ret: 0, token: result.token };
    }
    else {
        return result;
    }
};

/**
* 进行举报。当发现需要举报内容时，调用此Api会弹出举报窗口。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYSecurity.prototype.reportAbuse = function() {
    var result = callExternal("ISecurity_ReportAbuse");
    return result;
};

/**
* 截屏进行举报。当发现需要举报内容时，调用此Api会弹出举报窗口。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYSecurity.prototype.reportScreenshot = function () {
    var result = callExternal("ISecurity_ReportScreenshot");
    return result;
};


/**
* 敏感词检查。检查字符串中是否包含敏感词。
* @param {String} words 等待检查的字符串。
* @returns 返回是否包含敏感词，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>pass</b>: Boolean类型 true=检查通过,不包含敏感词，false=包含敏感词<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.security.keywordFilter("Hello");
* if (result.ret == 0) {
*   document.getElementById("txtLog").innerHTML = result.pass?"不包含敏感词":"含有敏感词";
* }
* else
* {
*   document.getElementById("txtLog").innerHTML ="无法检查,错误码ret="+result.ret;
* }
* 成功的返回值示例:{ ret:0,pass:true}
* 失败的返回值示例:{ ret:984832}
*/
IYYSecurity.prototype.keywordFilter = function (words) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof words !== "string") return { ret: yy_e_api_param_error };
    var result = callExternal("ISecurity_KeywordFilter",words);
    if (result.ret == 0) {
        return { ret: 0, pass: result.pass };
    } else {
        return result;
    }
};
//------------------------------IYYTempAudioSession------------------------------
/**
* IYYTempAudioSession 构造函数。
* @extends IYYCommon
* @class 临时语音接口。提供创建房间、加入房间、离开房间以及在房间语音聊天的功能.通过此接口可以跟其他用户建立临时语音聊天通道。<b>注意：用户同一时刻只能在一个房间进行语音聊天</b>
* <b>所以在同一个YY上面，同一时刻，最多只有一个应用在使用临时语音。</b>
*/
function IYYTempAudioSession() {
}

IYYTempAudioSession.prototype = new IYYCommon();
/**
* 创建一个临时语音房间。创建后用户自动进入该房间。在应用的生命周期内，同一个用户只能创建一个房间,第二次调用此函数会返回已经创建的房间的rid。房间中能够发言的人数有限，先要先得，目前暂定为5人。
* @returns 返回创建的房间的rid，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>rid</b>: Number类型 创建的房间的id<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.tempAudioSession.createRoom();
* if (result.ret == 0) {
*   document.getElementById("txtLog").innerHTML = "创建房间成功 rid="+result.rid;
* }
* else
* {
*   document.getElementById("txtLog").innerHTML ="创建房间失败,错误码ret="+result.ret;
* }
* 成功的返回值示例:{ ret:0,rid:3445566}
* 失败的返回值示例:{ ret:984832}
*/
IYYTempAudioSession.prototype.createRoom = function() {
    var result = callExternal("ITempAudioSession_CreateRoom");
    if (result.ret === 0) {
        return { ret: 0, rid: result.room_id };
    }
    else {
        return result;
    }
};
/**
* 进入一个房间。刚进入时，能听到其他人的语音，但自己暂时不能发言。如果已经在某个房间中，需要调用leaveRoom退出这个房间调用,才能进入另外一个房间。
* @param {Number} rid 要进入的房间的rid。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see #leaveRoom
*/
IYYTempAudioSession.prototype.enterRoom = function(rid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (isNaN(rid) || typeof rid !== "number") return { ret: yy_e_api_param_error };
    var result = callExternal("ITempAudioSession_EnterRoom", rid);
    return result;
};
/**
* 离开房间。如果房间人数为0，服务器过一段时间后会销毁这个房间。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYTempAudioSession.prototype.leaveRoom = function() {
    var result = callExternal("ITempAudioSession_LeaveRoom");
    return result;
};
/**
* 开始语音聊天。调用成功后，自己可以在房间中发言。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYTempAudioSession.prototype.startSpeak = function() {
    var result = callExternal("ITempAudioSession_StartSpeak");
    return result;
};
/**
* 禁止语音聊天。调用成功后，自己不能在房间中发言。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYTempAudioSession.prototype.stopSpeak = function() {
    var result = callExternal("ITempAudioSession_StopSpeak");
    return result;
};

/**
* 设置临时语音房间音量。
* @param {Number} vol  0至100的整数，0为静音。房间创建后，初始音量是100。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYTempAudioSession.prototype.setVolume = function(vol) {
    var result = callExternal("ITempAudioSession_SetVolume",vol);
    return result;
};

/**
* 获取临时语音房间音量。
* @returns 返回临时语音房间音量，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>volume</b>: Number类型 返回[0,100]的整数，房间创建后，初始音量是100。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.tempAudioSession.getVolume();
* if (result.ret == 0) {
*   document.getElementById("txtLog").innerHTML = "当前房间的音量 volume="+result.volume;
* }
* else
* {
*   document.getElementById("txtLog").innerHTML ="无法获取音量,错误码ret="+result.ret;
* }
* 成功的返回值示例:{ ret:0,volume:100}
* 失败的返回值示例:{ ret:36866}
*/
IYYTempAudioSession.prototype.getVolume = function () {
    var result = callExternal("ITempAudioSession_GetVolume");
    if (result.ret == 0) {
        return { ret: 0, volume: result.volume };
    } else {
        return result;
    }
};

/**
* 正在使用临时语音的应用的AppId，可以用来查询临时语音的占用情况。一个YY上同时只能有一个应用在使用临时语音。
* @returns 返回占用临时语音的应用的AppId信息，是一个Object对象，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>ownerAppId</b>: Number类型 占用临时语音的应用的AppId。如果值为0表示没有应用在占用。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.tempAudioSession.getOwner();
* if (result.ret == 0) {
*   document.getElementById("txtLog").innerHTML =(result.ownerAppId==0)?"没有应用在使用": "正在使用临时语音的应用AppId= "+result.ownerAppId;
* }
* 成功的返回值示例:{ ret:0,ownerAppId:100901}
* 失败的返回值示例:{ ret:984832}
*/
IYYTempAudioSession.prototype.getOwner = function() {
    var result = callExternal("ITempAudioSession_GetOwner");
    if (result.ret == 0) {
        return { ret: 0, ownerAppId: result.owner };
    } else {
        return result;
    }
};
/**
* 用户进入房间事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.rid: Number类型  进入的房间的rid。
* eventData.uid: Number类型  进入房间的用户的uid。
* @example
* 使用示例：
* yy.tempAudioSession.addEventListener(IYYTempAudioSession.USER_ENTER_ROOM,onUserEnterRoom);
*
* function onUserEnterRoom(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"进入了房间"+eventData.rid;
* }
*/
IYYTempAudioSession.USER_ENTER_ROOM = "YY_TEMP_AUDIO_SESSION_USER_ENTER";

/**
* 用户离开房间事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.rid: Number类型  离开的房间的rid。
* eventData.uid: Number类型  离开房间的用户的uid。
* @example
* 使用示例：
* yy.tempAudioSession.addEventListener(IYYTempAudioSession.USER_LEAVE_ROOM,onUserLeaveRoom);
*
* function onUserLeaveRoom(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开了房间"+eventData.rid;
* }
*/
IYYTempAudioSession.USER_LEAVE_ROOM = "YY_TEMP_AUDIO_SESSION_USER_LEAVE";

/**
* 说话人数变化事件。当临时语音房间的说话人数发生变化时触发，即当有人调用startSpeak或stopSpeak成功时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.speakerList: Array类型  当前房间可以说话的人的uid。
* @example
* 使用示例：
* yy.tempAudioSession.addEventListener(IYYTempAudioSession.SPEAKER_CHANGED,onSpeakerChanged);
*
* function onSpeakerChanged(eventData)
* {
*     document.getElementById("txtSpeakerEventLog").innerHTML += "说话人数变化:["+eventData.speakerList.toString()+"]<br/>";
* }
*/
IYYTempAudioSession.SPEAKER_CHANGED = "YY_TEMP_AUDIO_SESSION_SPEAKER_CHANGED";






//--------------------------------------IYYUser----------------------------------
/**
* IYYUser 构造函数。
* @extends IYYCommon
* @class 用户信息接口。提供获取用户的信息，接收用户信息变化事件等功能。
*/
function IYYUser() {

};


IYYUser.prototype = new IYYCommon();

/**
* 获取当前用户的信息。
* @returns 返回当前用户信息,是一个Object对象。具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>uid</b>: Number类型 用户的uid,唯一标识id。<br/>
* <b>imId</b>: Number类型 用户的YY号。<br/>
* <b>level</b>: String类型 用户的等级。<br/>
* <b>name</b>: Number类型 用户的名称。<br/>
* <b>role</b>: Number类型 用户的马甲 对应的信息如下：<br/>
* 无效角色 0 <br/>
* 未知用户 灰马 20 <br/>
* 游客(U) 白马 25 <br/>
* 临时嘉宾(G) 浅绿色马甲 66 <br/>
* 嘉宾(VIP) 绿马 88 <br/>
* 会员(R) 蓝马 100 <br/>
* 二级子频道管理员(CA2) 粉马 150 <br/>
* 子频道管理员(CA) 红马 175 <br/>
* 全频道管理员(MA) 黄马 200 <br/>
* 频道总管理(VP) 橙马 230 <br/>
* 频道所有者(OW) 紫马 255 <br/>
* 客服 300 <br/>
* 歪歪官方人员 黑马 1000 。<br/>
* <b>sex</b>: Number类型 用户的性别  0=女 1=男 。<br/>
* <b>sign</b>: String类型 用户的签名。<br/>
* <b>vip</b>: Boolean类型 是否是会员trur=会员，false=非会员。<br/>
* <b>vipLevel</b>: Number类型 游会员的等级。<br/>
* <b>points</b>: Number类型 用户的个人积分。<br/>
* <b>contribution</b>: Number类型 用户对当前频道的贡献值。<br/>

* @type Object
* @example
* 使用示例：
* var userInfo = yy.user.getCurrentUserInfo();
* 成功的返回值示例:{ ret:0,uid:249267551,name:"美羊羊",vip:false,points:4125,imId:293451745,sex:0,sign:"很困了想睡觉",level:128,role:25,vipLevel:0,contribution:0}
* 失败的返回值示例:{ ret:984832}

*/
IYYUser.prototype.getCurrentUserInfo = function() {
    var result = callExternal("IUser_GetCurrnetUserInfo");
    if (result.ret === 0) {
        return parseUserInfo(result);
    }
    else {
        return result;
    }
};


/**
* 获取指定的用户的信息。指定的用户必须在当前大频道中。
* @returns 返回指定用户信息,是一个Object对象。返回信息的格式同getCurrentUserInfo接口一致。
* @param {Number} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type Object
* @see #getCurrentUserInfo
*/
IYYUser.prototype.getUserInfo = function(uid) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof uid !== "number" || isNaN(uid)) return { ret: yy_e_api_param_error };
    var result = callExternal("IUser_GetUserInfo", uid);
    if (result.ret === 0) {
        return parseUserInfo(result);
    }
    else {
        return result;
    }
};

/**
* 修改用户昵称。调用此接口修改自己的昵称。两次调用必须间隔1秒以上。
* @param {String} newName 用户的新昵称，用户昵称需要符合相关要求。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYUser.prototype.rename = function(newName) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof newName !== "string") return { ret: yy_e_api_param_error };
    var result = callExternal("IUserEx_Rename", newName);
    return result;
};


/**
* 当前用户信息变更事件。当前用户昵称，性别，签名,马甲修改的时候会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData: Object类型 变化后的用户信息。
* @example
* 使用示例：
* yy.user.addEventListener(IYYUser.USER_INFO_CHANGED,onChange);
*
* function onChange(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.name+ "的信息发生了变化";
* }
* @see #getCurrentChannelInfo
*/
IYYUser.USER_INFO_CHANGED = "YY_USER_INFO_CHANGED";


//-----------------------------------------------IYYVideo-----------------------------

/**
* IYYVideo 构造函数。
* @extends IYYCommon
* @class 提供视频直播相关功能，所有方法需要调用lock后才能使用。应用需要认证才能使用视频功能，具体请联系YY开放平台。
*/
function IYYVideo() {

};

IYYVideo.prototype = new IYYCommon();

/**
* 获取当前计算机摄像头名称列表。
* @returns 返回摄像头列表，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>cameras</b>: Array类型 摄像头名称列表。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.video.getCameraList();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "本机摄像头为:" + result.cameras;
* }
*   
* 成功的返回值示例:{ ret:0,cameras:["camera1","camera2"]}
* 失败的返回值示例:{ ret:984832}
*/
IYYVideo.prototype.getCameraList = function () {

    var result = callExternal("IVideo_GetCameraList");
    if (result.ret == 0) {
        return { ret: 0, cameras: result.cameras.concat() }
    }
    else {
        return result;
    }

};

/**
* 开始视频直播。缺省的分辨率360x240
* @param {Number} cameraIndex 视频摄像头的索引。索引必须是有效的非负整数，如果计算机上有多个摄像头，索引分别为0,1,2...以此类推。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see #setVideoWindow_640x480 #setVideoWindow_480x360
*/
IYYVideo.prototype.startPublish = function (cameraIndex) {
    if (arguments.length !== 1) return { ret: yy_e_api_param_error };
    if (typeof cameraIndex !== "number" || isNaN(cameraIndex)) return { ret: yy_e_api_param_error };
    var result = callExternal("IVideo_StartPublish", cameraIndex);
    return result;
};

/**
* 结束视频直播。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.stopPublish = function () {
    var result = callExternal("IVideo_StopPublish");
    return result;
};


/**
* 调整视频窗口的大小和位置。
* @param {Number} x 指定窗口位置的x值</b> 。
* @param {Number} y 指定窗口位置的y值</b> 。
* @param {Number} width 指定窗口的宽度 。
* @param {Number} height 指定窗口的高度 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.setVideoWindowPosition = function (x, y, width, height) {
    if (arguments.length !== 4) return { ret: yy_e_api_param_error };
    if (typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number") return { ret: yy_e_api_param_error };
    var result = callExternal("IVideo_SetVideoWindowPosition", x, y, width, height);
    return result;
};

/**
* 调整主播直播视频窗口的大小和位置。
* @param {Number} x 指定窗口位置的x值</b> 。
* @param {Number} y 指定窗口位置的y值</b> 。
* @param {Number} width 指定窗口的宽度 。
* @param {Number} height 指定窗口的高度 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.setPublishVideoWindowPosition = function (x, y, width, height) {
    if (arguments.length !== 4) return { ret: yy_e_api_param_error };
    if (typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number") return { ret: yy_e_api_param_error };
    var result = callExternal("IVideo_SetPublishVideoWindowPosition", x, y, width, height);
    return result;
};

/**
* 调整指定主播的视频订阅窗口的大小和位置。订阅多个视频的时候，可以对指定主播的视频窗口进行单独调整。
* @param {Number} x 指定窗口位置的x值</b> 。
* @param {Number} y 指定窗口位置的y值</b> 。
* @param {Number} width 指定窗口的宽度 。
* @param {Number} height 指定窗口的高度 。
* @param {Number} uid 指定主播的uid 。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.setSubscribeVideoWindowPosition = function (x, y, width, height, uid) {
    if (arguments.length !== 5) return { ret: yy_e_api_param_error };
    if (typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number" || typeof uid !== "number") return { ret: yy_e_api_param_error };
    var result = callExternal("IVideo_SetSubscribeVideoWindowPosition", x, y, width, height, uid);
    return result;
};

/**
* 锁定视频直播。锁定后才能调用视频直播的其他API，同时当前YY的其他应用无法调用视频直播。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.lock = function () {
    var result = callExternal("IVideo_Lock");
    return result;
}

/**
* 解锁视频直播，使其他应用可以使用摄像头视频。所有参数(例如直播分辨率)变为缺省值。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.unlock = function () {
    var result = callExternal("IVideo_Unlock");
    return result;
}

/**
* 获取当前子频道的正在直播的主播列表。
* @returns 返回主播uid列表，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* <b>publishList</b>: Array类型 主播uid列表。<br/>
* @type Object
* @example 
* 使用示例:
* var result = yy.video.getPublishUsers();
* if(result.ret==0)
* {
*     document.getElementById("txtLog").innerHTML = "正在直播的主播有:" + result.publishList;
* }
*   
* 成功的返回值示例:{ ret:0,publishList:[909011223,909085545]}
* 失败的返回值示例:{ ret:984832}
*/
IYYVideo.prototype.getPublishUsers = function () {
    var result = callExternal("IVideo_GetPublishUsers");
    if (result.ret == 0) {
        return { ret: 0, publishList: result.user_list.concat() };
    }
    else {
        return result;
    }
}
/**
* 开始视频订阅，即收看指定主播的直播。如果已经订阅了一个直播，需要先停止后才能订阅新的直播。
* @param {Number} uid 主播的uid，主播即开播视频直播的人，getPublishUsers以获取当前正在直播的主播。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see #stopSubscribeVideo #getPublishUsers
*/
IYYVideo.prototype.startSubscribeVideo = function (uid) {
    var result = callExternal("IVideo_StartSubscribeVideo",uid);
    return result;
}

/**
* 停止视频订阅，即关闭正在收看的视频。有效的主播uid才能停止订阅。
* @param {Number} uid 要停止订阅的主播的uid，主播即开播视频直播的人，getPublishUsers以获取当前正在直播的主播。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
* @see #startSubscribeVideo #getPublishUsers
*/
IYYVideo.prototype.stopSubscribeVideo = function (uid) {
    var result = callExternal("IVideo_StopSubscribeVideo", uid);
    return result;
}

/**
* 设置发起直播时的视频属性。启用重新开始直播才生效。
* @param {Number} key 视频属性Id。
* @param {Number} value 属性值。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.setProperty = function (key, value) {
    if (arguments.length !== 2) return { ret: yy_e_api_param_error };
    if (typeof key !== "number" || typeof value !== "number") return { ret: yy_e_api_param_error };
    var result = callExternal("IVideo_SetProperty", key, value);
    return result;
}

/**
* 设置直播的视频分辨率为640x480，需要重新开始直播才生效。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.setPublishVideo_640x480 = function () {
    var result;
    var errRes = 0;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.CUR_BITRATE_LD_PID, 500 * 1000);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.MIN_BITRATE_LD_PID, 333 * 1000);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.MAX_BITRATE_LD_PID, 666 * 1000);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.RESOLUTION_PID, IYYVideo.RatioAttr.RATIO_TRY_640x480);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.ENC_PICTURE_RATIO_PID, IYYVideo.PictureRatioAttr.RESOLUTION_RATIO_4x3);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.TRY_USING_2_THREAD_PID, 1);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.QUALITY_DELAY_MODE_PID, IYYVideo.QualityDelayMode.HIGHT_QUALITY_MODE);
    if (result.ret != 0) errRes = result.ret;
    return { ret: errRes };
    
}

/**
* 设置直播的视频分辨率为480x360，需要重新开始直播才生效。
* @returns 返回调用是否成功，具体属性如下。<br/>
* <b>ret</b>: Number类型 返回码 0=成功，非0值失败，具体请参考错误代码。<br/>
* @type Object
*/
IYYVideo.prototype.setPublishVideo_480x360 = function () {
    var result;
    var errRes = 0;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.CUR_BITRATE_LD_PID, 300 * 1000);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.MIN_BITRATE_LD_PID, 200 * 1000);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.MAX_BITRATE_LD_PID, 400 * 1000);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.RESOLUTION_PID, IYYVideo.RatioAttr.RATIO_TRY_480x360);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.ENC_PICTURE_RATIO_PID, IYYVideo.PictureRatioAttr.RESOLUTION_RATIO_4x3);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.TRY_USING_2_THREAD_PID, 1);
    if (result.ret != 0) errRes = result.ret;
    result = yy.video.setProperty(IYYVideo.ConfigAttr.QUALITY_DELAY_MODE_PID, IYYVideo.QualityDelayMode.HIGHT_QUALITY_MODE);
    if (result.ret != 0) errRes = result.ret;
    return { ret: errRes };
}

/**
* 主播直播结果事件。主播开始直播后，根据此事件判断直播是否是成功的。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.status: Number类型 直播结果 0=成功开始直播，1=直播失败
* @example
* 使用示例：
* yy.video.addEventListener(IYYVideo.PUBLISH_STATUS,onPublishChange);
*
* function onPublishChange(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.status==0?"成功开始直播":"直播未成功";
* }
*/
IYYVideo.PUBLISH_STATUS = "YY_VIDEO_PUBLISH_STATUS";


/**
* 摄像头状态变化事件。通知主播摄像头状态发生变化。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.status: Number类型 摄像头状态 0=摄像头就绪，1=摄像头就绪暂不可用（被别的程序占用），2=摄像头无法支持
* @example
* 使用示例：
* yy.video.addEventListener(IYYVideo.CAMERA_STATUS,onCameraChange);
*
* function onCameraChange(eventData)
* {
*    document.getElementById("txtLog").innerHTML=(eventData.status==0)?"摄像头正常":"摄像头失效";
* }
*/
IYYVideo.CAMERA_STATUS = "YY_VIDEO_CAMERA_STATUS";

/**
* 主播直播状态变化事件。当当前子频道有主播直播状态发生变化会触发，即主播开始直播或者结束直播的时候都会通知子频道中侦听此事件的用户。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.uid: Number类型 直播状态发生变化的主播的uid。
* eventData.status: Number类型 主播状态 0=主播开始直播，1=主播结束直播
* @example
* 使用示例：
* yy.video.addEventListener(IYYVideo.SUBSCRIBE_STATUS,onSubscribeChange);
*
* function onSubscribeChange(eventData)
* {
*    document.getElementById("txtLog").innerHTML="主播"+eventData.uid+(eventData.status==0?"开始直播了":"停止直播了");
* }
*/
IYYVideo.SUBSCRIBE_STATUS = "YY_VIDEO_SUBSCRIBE_STATUS";


/**
* 视频编码属性。
* @field
* @example
* IYYVideo.ConfigAttr.RESOLUTION_PID 4 分辨率
* IYYVideo.ConfigAttr.TRY_USING_2_THREAD_PID 5 是否开启双线程，值为布尔值
* IYYVideo.ConfigAttr.CUR_BITRATE_LD_PID 7 当前码率 
* IYYVideo.ConfigAttr.MIN_BITRATE_LD_PID 8 码率最小值
* IYYVideo.ConfigAttr.MAX_BITRATE_LD_PID 9 码率最大值
* IYYVideo.ConfigAttr.ENC_PICTURE_RATIO_PID 17 编码画面比例
* IYYVideo.ConfigAttr.QUALITY_DELAY_MODE_PID 18 画质/延时模式选择
*/
IYYVideo.ConfigAttr =
{
    //!分辨率
    RESOLUTION_PID: 4,
    //!是否开启双线程，值为布尔值
    TRY_USING_2_THREAD_PID: 5,
    //!当前码率 
    CUR_BITRATE_LD_PID: 7,
    //!码率最小值
    MIN_BITRATE_LD_PID: 8,
    //!码率最大值
    MAX_BITRATE_LD_PID: 9,
    //!编码画面比例
    ENC_PICTURE_RATIO_PID: 17,
    //!画质/延时模式选择
    QUALITY_DELAY_MODE_PID: 18
}

/**
* 视频分辨率常量值。
* @field
* @example
* IYYVideo.RatioAtrr.RATIO_TRY_640x480 0 640x480分辨率
* IYYVideo.RatioAttr.RATIO_TRY_480x360 6 480x360分辨率
*/
IYYVideo.RatioAttr =
{
    //!640x480分辨率
    RATIO_TRY_640x480: 0,
    //!480x360分辨率
    RATIO_TRY_480x360: 6
}

/**
* 画面比例常量值。
* @field
* @example
* IYYVideo.PictureRatioAttr.RESOLUTION_RATIO_4x3 1 按4：3比例
*/
IYYVideo.PictureRatioAttr =
{
    //!按4：3比例
    RESOLUTION_RATIO_4x3: 1,
}

/**
* 画质/延时模式常量值。
* @field
* @example
* IYYVideo.QualityDelayMode.HIGHT_QUALITY_MODE 1 高质模式
*/
IYYVideo.QualityDelayMode =
{
    //!高质模式
    HIGHT_QUALITY_MODE: 1,
}

/**
* 调用YY平台提供的接口
* @private
*/
function callExternal() {

    try {
        if (debugMode) {//打印出日志
            var strArgu = "(";
            var sp = "";
            for (var i = 1; i < arguments.length; i++) {
                switch (typeof arguments[i]) {
                    case "string":
                        strArgu += sp + "'" + arguments[i] + "'";
                        break;
                    case "number":
                        strArgu += sp + arguments[i];
                        break;
                    case "boolean":
                        strArgu += sp + arguments[i];
                        break;
                    case "object":
                        if (arguments[i] instanceof Array) {
                            strArgu += sp + "'[" + arguments[i].toString() + "]'";
                        }
                        else
                            strArgu += sp + arguments[i].toString();
                        break;    
                    default:
                        strArgu += sp + arguments[i].toString();
                }

                sp = ","
            }
            strArgu += ");"
            var runCode = "window.external." + arguments[0] + strArgu;
            yytrace(runCode);        
        }
        
        var ret = "{ \"ret\": 62003 }";//如果api不存在，返回错误代码
        var yyexternal = window.external;
        switch (arguments[0]) {

            case "IYY_GetVersion":
                ret = yyexternal.IYY_GetVersion();
                break;
            case "IYYEx_GetYYVersion":
                ret = yyexternal.IYYEx_GetYYVersion();
                break;
            case "IYYEx_GetWebAppShowMode":
                ret = yyexternal.IYYEx_GetWebAppShowMode();
                break;
            case "IAudio_StartRecord":
                if (arguments.length === 1) {
                    ret = yyexternal.IAudio_StartRecord("");
                }
                else {
                    ret = yyexternal.IAudio_StartRecord(arguments[1]);
                }
                break;
            case "IAudio_StopRecord":
                ret = yyexternal.IAudio_StopRecord();
                break;
            case "IAudio_OpenKaraoke":
                ret = yyexternal.IAudio_OpenKaraoke();
                break;
            case "IAudio_CloseKaraoke":
                ret = yyexternal.IAudio_CloseKaraoke();
                break;
            case "IAudio_EnableAudioMixing":
                ret = yyexternal.IAudio_EnableAudioMixing();
                break;
            case "IAudio_DisableAudioMixing":
                ret = yyexternal.IAudio_DisableAudioMixing();
                break;
            case "IAudio_SetKaraokePlayerPath":
                ret = yyexternal.IAudio_SetKaraokePlayerPath(arguments[1]);
                break;
            case "IAudio_ResetKaraokePlayerPath":
                ret = yyexternal.IAudio_ResetKaraokePlayerPath(arguments[1],arguments[2]);
                break;
            case "IChannel_GetCurrentChannelInfo":
                ret = yyexternal.IChannel_GetCurrentChannelInfo();
                break;
            case "IChannel_GetCurrentSubChannelInfo":
                ret = yyexternal.IChannel_GetCurrentSubChannelInfo();
                break;
            case "IChannel_GetChannelInfo":
                ret = yyexternal.IChannel_GetChannelInfo(arguments[1]);

                break;
            case "IChannel_GetRootChannelId":
                ret = yyexternal.IChannel_GetRootChannelId();
                break;
            case "IChannel_GetSubChannelIds":
                ret = yyexternal.IChannel_GetSubChannelIds(arguments[1]);
                break;
            case "IChannelUserList_GetUserList":
                ret = yyexternal.IChannelUserList_GetUserList(arguments[1]);
                break;
            case "IChannel_GetChannelStyle":
                ret = yyexternal.IChannel_GetChannelStyle();
                break;
            case "IChannelAppMsg_SendMsgToSubChannel":
                ret = yyexternal.IChannelAppMsg_SendMsgToSubChannel(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                break;
            case "IChannelAppMsg_SendMsgToUsers":

                ret = yyexternal.IChannelAppMsg_SendMsgToUsers("[" + arguments[1].toString() + "]", arguments[2], arguments[3], arguments[4], arguments[5]);
                break;
            case "IChannelAppMsg_SendMsgToSubChannelEx":
                ret = yyexternal.IChannelAppMsg_SendMsgToSubChannelEx(arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
            case "IChannelAppMsg_SendMsgToUsersEx":
                ret = yyexternal.IChannelAppMsg_SendMsgToUsersEx("[" + arguments[1].toString() + "]", arguments[2], arguments[3], arguments[4]);
                break;
            case "IChannelMicList_GetMicList":
                ret = yyexternal.IChannelMicList_GetMicList();
                break;
            case "IChannelMicList_JoinMicList":
                ret = yyexternal.IChannelMicList_JoinMicList();
                break;
            case "IChannelMicList_LeaveMicList":
                ret = yyexternal.IChannelMicList_LeaveMicList();
                break;
            case "IChannelMicList_PullUserToMicList":
                ret = yyexternal.IChannelMicList_PullUserToMicList(arguments[1]);
                break;
            case "IChannelMicList_KickMicListUser":
                ret = yyexternal.IChannelMicList_KickMicListUser(arguments[1]);
                break;
            case "IChannelMicList_MoveUserToTop":
                ret = yyexternal.IChannelMicList_MoveUserToTop(arguments[1]);
                break;
            case "IChannelMicList_ClearMicList":
                ret = yyexternal.IChannelMicList_ClearMicList();
                break;
            case "IChannelMicList_GetLinkedMicList":
                ret = yyexternal.IChannelMicList_GetLinkedMicList();
                break;
            case "IChannelMicList_LinkMicToTheQueueHead":
                ret = yyexternal.IChannelMicList_LinkMicToTheQueueHead(arguments[1]);
                break;
            case "IChannelMicList_RemoveFromLinkedMicList":
                ret = yyexternal.IChannelMicList_RemoveFromLinkedMicList(arguments[1]);
                break;
            case "IChannelMicList_GetMicListMode":
                ret = yyexternal.IChannelMicList_GetMicListMode();
                break;
            case "IChannelMicList_SetMicListMode":
                ret = yyexternal.IChannelMicList_SetMicListMode(arguments[1]);
                break;  

            case "IChannelMicList_MoveUpOnePosition":
                ret = yyexternal.IChannelMicList_MoveUpOnePosition(arguments[1]);
                break;
            case "IChannelMicList_MoveDownOnePosition":
                ret = yyexternal.IChannelMicList_MoveDownOnePosition(arguments[1]);
                break;  
            case "IChannelMicList_GetFirstMicSeconds":
                ret = yyexternal.IChannelMicList_GetFirstMicSeconds();
                break;
            case "IChannelMicList_DoubleFirstMicSeconds":
                ret = yyexternal.IChannelMicList_DoubleFirstMicSeconds();
                break;  
            case "IChannelMicList_EnableJoinMicList":
                ret = yyexternal.IChannelMicList_EnableJoinMicList();
                break;
            case "IChannelMicList_DisableJoinMicList":
                ret = yyexternal.IChannelMicList_DisableJoinMicList();
                break;  
            case "IChannelMicList_ControlMic":
                ret = yyexternal.IChannelMicList_ControlMic();
                break;
            case "IChannelMicList_ReleaseMic":
                ret = yyexternal.IChannelMicList_ReleaseMic();
                break;                                                  
            case "IChannelMicList_IsJoinMicListEnabled":
                ret = yyexternal.IChannelMicList_IsJoinMicListEnabled();
                break;                  
            case "IChannelMicList_IsMicListControlled":
                ret = yyexternal.IChannelMicList_IsMicListControlled();
                break;                  
            case "IChannelMicList_SendMicListNotification":
                ret = yyexternal.IChannelMicList_SendMicListNotification();
                break;  
                                
            case "IChannelUserController_EnableMsg":
                ret = yyexternal.IChannelUserController_EnableMsg(arguments[1]);
                break;
            case "IChannelUserController_DisableMsg":
                ret = yyexternal.IChannelUserController_DisableMsg(arguments[1]);
                break;
            case "IChannelUserController_EnableSpeak":
                ret = yyexternal.IChannelUserController_EnableSpeak(arguments[1]);
                break;
            case "IChannelUserController_DisableSpeak":
                ret = yyexternal.IChannelUserController_DisableSpeak(arguments[1]);
                break;
            case "IChannelUserController_IsMsgEnabled":
                ret = yyexternal.IChannelUserController_IsMsgEnabled(arguments[1]);
                break;
            case "IChannelUserController_IsSpeakEnabled":
                ret = yyexternal.IChannelUserController_IsSpeakEnabled(arguments[1]);
                break;
            case "IChannelUserController_JumpToSubChannel":
                ret = yyexternal.IChannelUserController_JumpToSubChannel(arguments[1]);
                break;
            case "IChannelUserController_PullToSubChannel":
                ret = yyexternal.IChannelUserController_PullToSubChannel(arguments[1], arguments[2]);
                break;
            case "IChannelUserController_GetUserSubChannelId":
                ret = yyexternal.IChannelUserController_GetUserSubChannelId(arguments[1]);
                break;
            case "IChannelUserController_SetUserRole":
                ret = yyexternal.IChannelUserController_SetUserRole(arguments[1], arguments[2], arguments[3]);
                break;
            case "IReceptionChannel_SetReceptionChannel":
                ret = yyexternal.IReceptionChannel_SetReceptionChannel(arguments[1]);
                break;
            case "IReceptionChannel_GetReceptionChannel":
                ret = yyexternal.IReceptionChannel_GetReceptionChannel();
                break;
            case "IReceptionChannel_UnSetReceptionChannel":
                ret = yyexternal.IReceptionChannel_UnSetReceptionChannel();
                break;
            case "IChannelUserListPopMenu_SetPopMenu":
                ret = yyexternal.IChannelUserListPopMenu_SetPopMenu(arguments[1]);
                break;
            case "IChannelUserListPopMenu_UnSetPopMenu":
                ret = yyexternal.IChannelUserListPopMenu_UnSetPopMenu();
                break;
            case "IChannelTabPage_SelectTabPage":
                ret = yyexternal.IChannelTabPage_SelectTabPage();
                break;
            case "ICloud_AddData":
                ret = yyexternal.ICloud_AddData(arguments[1], arguments[2], arguments[3]);
                break;
            case "ICloud_UpdateData":
                ret = yyexternal.ICloud_UpdateData(arguments[1], arguments[2], arguments[3], "[" + arguments[4] + "]");
                break;
            case "ICloud_DeleteData":
                ret = yyexternal.ICloud_DeleteData("[" + arguments[1] + "]");
                break;
            case "ICloud_QueryData":
                ret = yyexternal.ICloud_QueryData("[" + arguments[1] + "]");
                break;
            case "IFinance_Buy":
                ret = yyexternal.IFinance_Buy(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                break;
            case "IFinance_BuyByYuan":
                ret = yyexternal.IFinance_BuyByYuan(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                break;
            case "IFinance_BuyGifts":
                ret = yyexternal.IFinance_BuyGifts(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                break;
            case "IFinance_Recharge":
                ret=yyexternal.IFinance_Recharge();
                break;
            case "IIM_ChatTo":
                ret = yyexternal.IIM_ChatTo(arguments[1], arguments[2]);
                break;
            case "IIM_IsFriend":
                ret = yyexternal.IIM_IsFriend(arguments[1]);
                break;
            case "IIM_AddFriend":
                ret = yyexternal.IIM_AddFriend(arguments[1]);
                break;
            case "IIM_GetIMUserInfo":
                ret = yyexternal.IIM_GetIMUserInfo(arguments[1]);
                break;
            case "IIM_GetAllBuddyList":
                ret = yyexternal.IIM_GetAllBuddyList();
                break;
            case "IInteraction_GetInviter":
                ret = yyexternal.IInteraction_GetInviter();
                break;
            case "IInteraction_Invite":
                ret = yyexternal.IInteraction_Invite(arguments[1]);
                break;
            case "IInteraction_GetRunParams":
                ret = yyexternal.IInteraction_GetRunParams();
                break;
            case "IInteraction_CreateAppTicket":
                ret = yyexternal.IInteraction_CreateAppTicket(arguments[1], arguments[2]);
                break;
            case "IInteraction_Follow":
                ret = yyexternal.IInteraction_Follow(arguments[1]);
                break;
            case "IInteraction_UnFollow":
                ret = yyexternal.IInteraction_UnFollow(arguments[1]);
                break;
            case "IInteraction_GetFansCount":
                ret = yyexternal.IInteraction_GetFansCount();
                break;
            case "IInteraction_IsFans":
                ret = yyexternal.IInteraction_IsFans(arguments[1]);
                break;
            case "INet_BroadCastSubChannel":
                ret = yyexternal.INet_BroadCastSubChannel(arguments[1], arguments[2]);
                break;
            case "INet_BroadCastAllChannel":
                ret = yyexternal.INet_BroadCastAllChannel(arguments[1]);
                break;
            case "INet_BroadCastToUsers":
                ret = yyexternal.INet_BroadCastToUsers(arguments[1], "[" + arguments[2].toString() + "]");
                break;
            case "ISecurity_GetToken":
                ret = yyexternal.ISecurity_GetToken();
                break;
            case "ISecurity_ReportAbuse":
                ret = yyexternal.ISecurity_ReportAbuse();
                break;
            case "ISecurity_ReportScreenshot":
                ret = yyexternal.ISecurity_ReportScreenshot();
                break;
            case "ISecurity_KeywordFilter":
                ret = yyexternal.ISecurity_KeywordFilter(arguments[1]);
                break;
            case "ITempAudioSession_CreateRoom":
                ret = yyexternal.ITempAudioSession_CreateRoom();
                break;
            case "ITempAudioSession_EnterRoom":
                ret = yyexternal.ITempAudioSession_EnterRoom(arguments[1]);
                break;
            case "ITempAudioSession_LeaveRoom":
                ret = yyexternal.ITempAudioSession_LeaveRoom();
                break;
            case "ITempAudioSession_StartSpeak":
                ret = yyexternal.ITempAudioSession_StartSpeak();
                break;
            case "ITempAudioSession_StopSpeak":
                ret = yyexternal.ITempAudioSession_StopSpeak();
                break;
                
            case "ITempAudioSession_SetVolume":
                ret = yyexternal.ITempAudioSession_SetVolume(arguments[1]);
                break;
            case "ITempAudioSession_GetVolume":
                ret = yyexternal.ITempAudioSession_GetVolume();
                break;    
            case "ITempAudioSession_GetOwner":
                ret = yyexternal.ITempAudioSession_GetOwner();
                break;   
                                            
            case "IUser_GetCurrnetUserInfo":
                ret = yyexternal.IUser_GetCurrnetUserInfo();
                break;
            case "IUser_GetUserInfo":
                ret = yyexternal.IUser_GetUserInfo(arguments[1]);
                break;
            case "IUserEx_Rename":
                ret = yyexternal.IUserEx_Rename(arguments[1]);
                break;
            case "IVideo_GetCameraList":
                ret = yyexternal.IVideo_GetCameraList();
                break;
            case "IVideo_StartPublish":
                ret = yyexternal.IVideo_StartPublish(arguments[1]);
                break;
            case "IVideo_StopPublish":
                ret = yyexternal.IVideo_StopPublish();
                break;
            case "IVideo_SetVideoWindowPosition":
                ret = yyexternal.IVideo_SetVideoWindowPosition(arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
            case "IVideo_SetPublishVideoWindowPosition":
                ret = yyexternal.IVideo_SetPublishVideoWindowPosition(arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
            case "IVideo_SetSubscribeVideoWindowPosition":
                ret = yyexternal.IVideo_SetSubscribeVideoWindowPosition(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                break;
            case "IVideo_Lock":
                ret = yyexternal.IVideo_Lock();
                break;
            case "IVideo_Unlock":
                ret = yyexternal.IVideo_Unlock();
                break;
            case "IVideo_GetPublishUsers":
                ret = yyexternal.IVideo_GetPublishUsers();
                break;
            case "IVideo_StartSubscribeVideo":
                ret = yyexternal.IVideo_StartSubscribeVideo(arguments[1]);
                break;
            case "IVideo_StopSubscribeVideo":
                ret = yyexternal.IVideo_StopSubscribeVideo(arguments[1]);
                break;
            case "IVideo_SetProperty":
                ret = yyexternal.IVideo_SetProperty(arguments[1], arguments[2]);
                break;
            case "SubscribeYYEvent":
                ret = yyexternal.SubscribeYYEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeAudioEvent":
                ret = yyexternal.SubscribeAudioEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeChannelEvent":
                ret = yyexternal.SubscribeChannelEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeAppMsgEvent":
                ret = yyexternal.SubscribeAppMsgEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeMicListEvent":
                ret = yyexternal.SubscribeMicListEvent(arguments[1], arguments[2]);
                break;
            case "SubscribePopMenuEvent":
                ret = yyexternal.SubscribePopMenuEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeNetEvent":
                ret = yyexternal.SubscribeNetEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeUserEvent":
                ret = yyexternal.SubscribeUserEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeTempAudioSessionEvent":
                ret = yyexternal.SubscribeTempAudioSessionEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeFinanceEvent":
                ret = yyexternal.SubscribeFinanceEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeChannelChatEvent":
                ret = yyexternal.SubscribeChannelChatEvent(arguments[1], arguments[2]);
                break;
            case "SubscribeVideoEvent":
                ret = yyexternal.SubscribeVideoEvent(arguments[1], arguments[2]);
                break;
            default:

                //ret = eval(runCode);


        }
        yytrace(ret); //打印返回值
        //返回值转json
        try {
            var retJson = eval("(" + ret + ")");
        } catch (exjson) {
            throw "返回值转json出错:"+exjson.message;
        }


        //如果无ret字段
        if (typeof (retJson.ret) !== "number") throw "NO_RET";

        //暂时停止统计
        //statisticApiCall(arguments[0], retJson);

        //escape中文，防止flashplayer bug
        switch (arguments[0]) {

            case "IChannel_GetChannelInfo":
            case "IChannel_GetCurrentSubChannelInfo":
            case "IChannel_GetCurrentChannelInfo":
                retJson.name = escape(retJson.name);
                break;
            case "IUser_GetCurrnetUserInfo":
            case "IUser_GetUserInfo":
                retJson.name = escape(retJson.name);
                retJson.sign = escape(retJson.sign);
                break;
            case "IIM_GetIMUserInfo":
                retJson.nick_name = escape(retJson.nick_name);
                break;
            default:
        }
        
        return retJson;

        

    } catch (ex) {
        //E_NOINTERFACE api不存在 62003
        //E_INVALIDARG api调用参数错误62001
        //E_FAIL api调用失败  62000
        yytrace("错误! 原因[" + ex.name + "] "+ex.number+":" + ex.message);
        if (ex === "NO_RET") return { ret: yy_e_api_return_format_error, message: "返回信息没有ret属性" };
        else if (ex.number === -2146827858) return { ret: yy_e_api_not_exist, message: "api不存在! 原因:[" + ex.number + "]" + ex.message };
        else if (ex.number === -2146828283) return { ret: yy_e_api_param_error, message: "api调用参数错误! 原因:[" + ex.number + "]" + ex.message };
        else return { ret: yy_e_api_call_error, message: "api调用失败! 原因:[" + ex.number + "]" + ex.message };
    }


}
var yyTraceMaxLine = 256;
var yyTraceData = [];
var yyConsole = null;
/**
* 输出debug信息到控制台
* @private
*/
function yytrace(msg) {

    try {
        if (!debugMode) return;
        if (yyConsole == null) {
            yyConsole = document.getElementById("txtConsole");
        }
        if (yyConsole != null) {
            if (yyTraceData.length >= yyTraceMaxLine) {
                yyTraceData.pop();
            }
            yyTraceData.unshift(msg);
            yyConsole.innerText = yyTraceData.join("\n");
        }
    } catch (exLog) {
        throw "打印日志错误！" + exLog + exLog.message;
    }
}


//创建api对象，供调用所有api，全局变量。
window["yy"] = new IYY();

//})(); //保存到命名空间中


//---------------------------------------------------------数据类-----------------------------------------------------------------



/**
* 构造函数。
* @class 简单存储条件过滤器，保存查询条件。
*/
function YYCloudFilter() {
    /**
    * 对哪个字段进行过滤。
    * @field
    * @type Number
    */
    this.field = 0;
    /**
    * 操作符，比如大于小于等。
    * @field
    * @type Number
    */
    this.op = 0;
    /**
    * 字段数值。
    * @field
    * @type Object
    */
    this.value = null;
    /**
    * 和其他filter的关系。
    * @field
    * @type Number
    */
    this.condition = 0;
}
/**
* 简单存储的字段表示常量。
* @field
* @example
* YYCloudFilter.EField.NONE 0 无效字段
* YYCloudFilter.EField.UNIQUE_KEY 1 唯一键 字段
* YYCloudFilter.EField.USER_ID 2 uid字段
* YYCloudFilter.EField.EXTERNAL_VALUE1 3 扩展int1 字段
* YYCloudFilter.EField.EXTERNAL_VALUE2 4 扩展int2 字段
* YYCloudFilter.EField.CREATE_TIME 5 创建时间
* YYCloudFilter.EField.UPDATE_TIME 6 更新时间
*/
YYCloudFilter.EField =
{
    //!无效字段
    NONE: 0,
    //!key 唯一键 字段
    UNIQUE_KEY: 1,
    //!uid 字段
    USER_ID: 2,
    //!扩展int1 字段
    EXTERNAL_VALUE1: 3,
    //!扩展int2 字段
    EXTERNAL_VALUE2: 4,
    //!创建时间
    CREATE_TIME: 5,
    //!更新时间
    UPDATE_TIME: 6
};

/**
* 简单存储的操作符常量。
* @field
* @example
* YYCloudFilter.EFilterOperator.NONE 0 无效操作
* YYCloudFilter.EFilterOperator.EQ 1 等于
* YYCloudFilter.EFilterOperator.GE 2 大于等于
* YYCloudFilter.EFilterOperator.LE 3 小于等于
* YYCloudFilter.EFilterOperator.GREATER 4 大于
* YYCloudFilter.EFilterOperator.LESS 5 小于
*/
YYCloudFilter.EFilterOperator =
{
    //! 无效操作
    NONE: 0,
    //! = 等于
    EQ: 1,
    //! >= 大于等于
    GE: 2,
    //! <= 小于等于	
    LE: 3,
    //! = 大于
    GREATER: 4,
    //! < 小于
    LESS: 5
};

/**
* 简单存储的条件运算常量。
* @field
* @example
* YYCloudFilter.EFilterCondition.NONE 0 无效条件
* YYCloudFilter.EFilterCondition.AND  1 条件 与 and 
* YYCloudFilter.EFilterCondition.OR 2 条件 或 or
*/
YYCloudFilter.EFilterCondition =
{
    //!无效条件
    NONE: 0,
    //! 条件 与 and 
    AND: 1,
    //! 条件 或 or
    OR: 2
};

/**
* @private
*/
YYCloudFilter.prototype.toString = function() {
    switch (this.field) {
        case YYCloudFilter.EField.EXTERNAL_VALUE1, YYCloudFilter.EField.EXTERNAL_VALUE2:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":" + this.value + ",\"condition\":" + this.condition + "}";
        case YYCloudFilter.EField.UNIQUE_KEY:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":\"" + this.value + "\",\"condition\":" + this.condition + "}";
        default:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":" + this.value + ",\"condition\":" + this.condition + "}";
    }


};



//---------------------------------------下面为回调函数------------------------------------------------------------------------------------------------
//---------------------------------------下面为回调函数------------------------------------------------------------------------------------------------
//---------------------------------------下面为回调函数------------------------------------------------------------------------------------------------


/**
* 运行时，应用图标被点击事件。
* @private
*/
function IYY_OnActive(activeCode) {
    if (debugMode) {
        yytrace(IYY.ACTIVE + ":" + activeCode);
    }
    yy.dispatchEvent(IYY.ACTIVE, { activeCode: activeCode });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IYY_OnActive(activeCode);
    }
}


//-----------------------语音设备更换[Event]----------------------
/**
* 录音错误事件。
* @param {Number} err_code 录音错误代码，参考错误代码表。
* @private
*/
function IAudioEvent_OnRecordErr(err_code) {
    if (debugMode) {
        yytrace(IYYAudio.RECORD_ERR + ":" + err_code);
    }
    yy.audio.dispatchEvent(IYYAudio.RECORD_ERR, { errCode: err_code });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IAudioEvent_OnRecordErr(err_code);
    }
}


/**
* 录音完成事件。
* @param {String} info 录音完成信息。
* @example 
* 返回参数示例: {result:0,file_name:"abcd"} 
* result 录音是否成功 0成功，非0值失败。
* file_name 录音文件的名称，不带没有扩展名和路径。
* @private
*/
function IAudioEvent_OnRecordFinished(info) {
    if (debugMode) {
        yytrace(IYYAudio.RECORD_FINISHED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.audio.dispatchEvent(IYYAudio.RECORD_FINISHED, { result: retJson.result, fileName: retJson.file_name });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IAudioEvent_OnRecordFinished(retJson);
    }
}

//-----------------------频道信息获取回调接口 [Event]----------------------
/**
* 子频道跳转事件。
* @param {String} info 频道跳转信息，是一个可以转成Json的字符串。
* @example
* 返回参数示例: {departed_id:15488855,now_id:85526655}
* departed_id 原来子频道id。
* now_id 现在子频道id。
* @private
*/

function IChannelEvent_OnFocusChannelChannged(info) {
    if (debugMode) {
        yytrace(IYYChannel.FOCUS_CHANNEL_CHANGED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.FOCUS_CHANNEL_CHANGED, { departedId: retJson.departed_id, nowId: retJson.now_id });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelEvent_OnFocusChannelChannged(retJson);
    }
}

/**
* 当前频道信息改变事件。
* @param {String} info 改变后的频道信息，是一个可以转成Json的字符串。
* @example
* 返回参数示例: 
*
* {"ret":0,"long_id":51285414,"short_id":6048,"name":"月光酒吧"}
*
* ret 返回码 
* long_id 频道长位id
* short_id 频道短位id
* name 频道名称id
* @private
*/
function IChannelEvent_OnChannelInfoChannged(info) {
    if (debugMode) {
        yytrace(IYYChannel.CHANNEL_INFO_CHANGED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.CHANNEL_INFO_CHANGED, parseChannelInfo(retJson));
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelEvent_OnChannelInfoChannged(retJson);
    }
}





/**
* 删除子频道时产生事件。
* @param {Number} cid 被删除的子频道长位id。
* @private
*/
function IChannelEvent_OnSubChannelDel(cid) {
    if (debugMode) {
        yytrace(IYYChannel.SUB_CHANNEL_DEL + ":" + cid);
    }
    yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_DEL, { cid: cid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelEvent_OnSubChannelDel(cid);
    }
}


/**
* 添加子频道时产生事件。
* @param {String} info 频道添加的信息，是一个可以转成Json的字符串。
* @example 
* 返回参数示例: {cid:15488855,pcid:85526655} 
* cid 增加的子频道长位id。
* pcid 增加到哪个父频道下，长位id。
* @private
*/
function IChannelEvent_OnSubChannelAdd(info) {
    if (debugMode) {
        yytrace(IYYChannel.SUB_CHANNEL_ADD + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_ADD, { cid: retJson.cid, pcid: retJson.pcid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelEvent_OnSubChannelAdd(retJson);
    }
}
/**

* 用户进入大频道事件，子频道之间跳转不会触发此事件。
* @param {String} info 用户加入频道的信息
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 进入的用户的uid。
* cid 进入时进入到大频道中的哪个频道。
* @private
*/
function IChannelEvent_OnUserEnterChannel(info) {
    if (debugMode) {
        yytrace(IYYChannel.USER_ENTER_CHANNEL + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.USER_ENTER_CHANNEL, { uid: retJson.uid, cid: retJson.cid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelEvent_OnUserEnterChannel(retJson);
    }
}

/**
* 用户离开大频道事件，子频道之间跳转不会触发此事件。
* @param {String} info 用户离开频道的信息
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 离开的用户的uid。
* cid 离开大频道时所处的频道。
* @private
*/
function IChannelEvent_OnUserLeaveChannel(info) {
    if (debugMode) {
        yytrace(IYYChannel.USER_LEAVE_CHANNEL + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.dispatchEvent(IYYChannel.USER_LEAVE_CHANNEL, { uid: retJson.uid, cid: retJson.cid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelEvent_OnUserLeaveChannel(retJson);
    }
}



///
//------------------------频道用户列表右键菜单事件通知 [Event]
///
/**
* 频道用户列表右键菜单项被点击事件。
* @param {String} info 点击用户的信息。
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 被点中的用户uid。
* cid 当前所在的频道。
* @private
*/
function IChannelUserPopMenuEvent_OnClicked(info) {
    if (debugMode) {
        yytrace(IYYChannelUserListPopMenu.CLICKED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.userListPopMenu.dispatchEvent(IYYChannelUserListPopMenu.CLICKED, { uid: retJson.uid, cid: retJson.cid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelUserPopMenuEvent_OnClicked(retJson);
    }
}

///
//------------------------网络状态回调 [Event]
///


/**
* 连接成功的事件。
* @param {Number} result 0成功，非0值失败。
* @private
*/
/*
function INetEvent_OnConnected(result) {
yy.net.dispatchEvent(IYYNet.CONNECTED, { result: result });
}*/


/**
* 连接断开后事件。
* @param {Number} result 0:主动断开, 其他错误参考错误代码表
* @private
*/

function INetEvent_OnClosed(result) {
    if (debugMode) {
        yytrace(IYYNet.CLOSED + ":" + result);
    }
    yy.net.dispatchEvent(IYYNet.CLOSED, { result: result });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).INetEvent_OnClosed(result);
    }
}


/**
* 收到广播数据包事件。
* @param {Object} data 收到数据
* @private
*/
function INetEvent_OnRecv(data) {
    if (debugMode) {
        yytrace(IYYNet.RECV + ":" + data);
    }
    yy.net.dispatchEvent(IYYNet.RECV, { data: decodeURI(data) });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).INetEvent_OnRecv(data);
    }
}


///
//------------------------------------------频道应用信息链接事件 [Event]
///


/**
* 应用消息中的链接被点击事件。
* @param {Number} token 消息标记，区分不同的消息。
* @private
*/
function IChannelAppLinkEvent_OnAppLinkClicked(token) {
    if (debugMode) {
        yytrace(IYYChannelAppMsg.APP_LINK_CLICKED + ":" + token);
    }
    yy.channel.appMsg.dispatchEvent(IYYChannelAppMsg.APP_LINK_CLICKED, { token: token });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelAppLinkEvent_OnAppLinkClicked(token);
    }
}
/**
* @private
*/
function IChannelAppLinkEvent_OnAppLinkExClicked(token, userData) {
    if (debugMode) {
        yytrace(IYYChannelAppMsg.APP_LINK_EX_CLICKED + ":" + token + " " + userData);
    }
    yy.channel.appMsg.dispatchEvent(IYYChannelAppMsg.APP_LINK_EX_CLICKED, { token: token, userData: userData });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelAppLinkEvent_OnAppLinkExClicked(token, userData);
    }
}

///
//------------------------------------------麦序相关接口事件
///

//麦序列表发生改变


/**
* 用户加入到麦序事件。
* @param {uid} 加入到麦序的用户uid。
* @private
*/
function IMicListEvent_OnUserJoin(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_JOIN + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_JOIN, { uid: uid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IMicListEvent_OnUserJoin(uid);
    }
}
/**
* 用户离开麦序事件。
* @param {Number} uid 离开麦序的用户uid。
* @private
*/
function IMicListEvent_OnUserLeave(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_LEAVE + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_LEAVE, { uid: uid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IMicListEvent_OnUserLeave(uid);
    }
}
/**
* 用户在麦序中的位置发生变化事件，同一子频道的用户会收到。
* @example 
* 返回参数示例: {move_id:905488855,to_after_id:905477756} 
* move_id:发生移动的id。
* to_after_id:移动到那个用户后面。
* @private
*/
function IMicListEvent_OnUserMove(info) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_MOVE + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_MOVE, { moveId: retJson.move_id, toAfterId: retJson.to_after_id });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IMicListEvent_OnUserMove(retJson);
    }
}

/**
* 麦序被清除事件。
* @private
*/
function IMicListEvent_OnClear() {
    if (debugMode) {
        yytrace(IYYChannelMicList.CLEAR);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.CLEAR);
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IMicListEvent_OnClear();
    }
}
/**
* @private
*/
function IChannelMicList_OnUserMicLinked(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_LINKED + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_LINKED, { uid: uid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnUserMicLinked(uid);
    }
}
/**
* @private
*/
function IChannelMicList_OnUserMicUnlinked(uid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.USER_UNLINKED + ":" + uid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_UNLINKED, { uid: uid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnUserMicUnlinked(uid);
    }
}
/**
* @private
*/
function IChannelMicList_OnMicListModeChanged(mode) {
    if (debugMode) {
        yytrace(IYYChannelMicList.MODE_CHANGED + ":" + mode);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.MODE_CHANGED, { mode: mode });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnMicListModeChanged(mode);
    }
}
//-------------------

/**
* @private
*/
function IChannelMicList_OnMicListControlled(adminUid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.CONTROLLED + ":" + adminUid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.CONTROLLED, { adminUid: adminUid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnMicListControlled(adminUid);
    }
}
/**
* @private
*/
function IChannelMicList_OnMicListReleased(adminUid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.RELEASED + ":" + adminUid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.RELEASED, { adminUid: adminUid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnMicListReleased(adminUid);
    }
}
/**
* @private
*/
function IChannelMicList_OnDisableJoinMicList(adminUid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.DISABLE_JOIN + ":" + adminUid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.DISABLE_JOIN, { adminUid: adminUid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnDisableJoinMicList(adminUid);
    }
}
/**
* @private
*/
function IChannelMicList_OnEnableJoinMicList(adminUid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.ENABLE_JOIN + ":" + adminUid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.ENABLE_JOIN, { adminUid: adminUid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnEnableJoinMicList(adminUid);
    }
}
/**
* @private
*/
function IChannelMicList_OnMicListTimeChanged(adminUid,uid,seconds) {
    if (debugMode) {
        yytrace(IYYChannelMicList.TIME_CHANGED +":adminUid="+adminUid+" uid="+uid+ " seconds=" + seconds);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.TIME_CHANGED, { adminUid: adminUid, uid: uid, seconds: seconds });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnMicListTimeChanged(adminUid, uid, seconds);
    }
}
/**
* @private
*/
function IChannelMicList_OnSpeakingStateChanged(uid, speaking) {
    if (debugMode) {
        yytrace(IYYChannelMicList.SPEAKING_STATE_CHANGED + ":" + uid + " " + speaking);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.SPEAKING_STATE_CHANGED, { uid: uid, speaking: speaking });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnSpeakingStateChanged(uid, speaking);
    }
}
/**
* @private
*/
function IChannelMicList_OnMicListNotification(adminUid) {
    if (debugMode) {
        yytrace(IYYChannelMicList.NOTIFICATION + ":" + adminUid);
    }
    yy.channel.micList.dispatchEvent(IYYChannelMicList.NOTIFICATION, { adminUid: adminUid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelMicList_OnMicListNotification(adminUid);
    }
}
//----------------------------用户事件回调------------------------------------------
/**
* 用户信息改变事件，得到改变后的用户信息。
* @param {String} info 改变后的用户信息,是一个可以转成Json的字符串。
* @private
*/
function IUserEvent_OnUserInfoChanged(info) {
    if (debugMode) {
        yytrace(IYYUser.USER_INFO_CHANGED+":"+info);
    }
    var retJson = eval("(" + info + ")");
    yy.user.dispatchEvent(IYYUser.USER_INFO_CHANGED, parseUserInfo(retJson));
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IUserEvent_OnUserInfoChanged(retJson);
    }
}

/**
* 转换频道信息格式。频道信息完整的时候使用
* @private
*/
function parseChannelInfo(info) {
    var cinfo = {};//= new YYChannelInfo();
    cinfo.ret = 0;
    cinfo.longId = info.long_id;
    cinfo.shortId = info.short_id;
    cinfo.name = unescape(info.name);
    cinfo.userCount = info.user_count;
    cinfo.totalUserCount = info.total_user_count;
    cinfo.channelType = info.channel_type;
    cinfo.channelPoints = info.channel_points;
    return cinfo;
}

/**
* 转换用户信息格式。用户信息完整的时候使用
* @private
*/
function parseUserInfo(info) {
    var userInfo = {};// new YYUserInfo();
    userInfo.ret = 0;
    userInfo.uid = info.uid;
    userInfo.name = unescape(info.name);
    userInfo.imId = info.imid;
    userInfo.role = info.role;
    userInfo.points = info.points;
    userInfo.level = info.level;
    userInfo.sex = info.sex;
    userInfo.sign = unescape(info.sign);
    userInfo.vip = info.vip;
    userInfo.vipLevel = info.vip_level;
    userInfo.contribution = info.contribution;
    return userInfo;
}
/**
* 转换用户信息格式。
* @private
*/
function parseCloudDataList(data) {
    var dataArray = [];
    for (var i = 0; i < data.length; i++) {
        var dt = {};
        dt.key = data[i].key;
        dt.createTime = data[i].create_time;
        dt.updateTime = data[i].update_time;
        dt.creatorUid = data[i].creator_uid;
        dt.intValue1 = data[i].int1;
        dt.intValue2 = data[i].int2;
        dt.stringValue = data[i].str;
        dataArray.push(dt);
    }

    return dataArray;
}
//----------------------------临时语音事件回调------------------------------------------
/**
* 用户进入房间。
* @private
*/
function ITempAudioSession_OnUserEnterRoom(info) {
    if (debugMode) {
        yytrace(IYYTempAudioSession.USER_ENTER_ROOM + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.tempAudioSession.dispatchEvent(IYYTempAudioSession.USER_ENTER_ROOM, { rid: retJson.rid, uid: retJson.uid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).ITempAudioSession_OnUserEnterRoom(retJson);
    }
}
/**
* 用户离开房间。
* @private
*/
function ITempAudioSession_OnUserLeaveRoom(info) {
    if (debugMode) {
        yytrace(IYYTempAudioSession.USER_LEAVE_ROOM + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.tempAudioSession.dispatchEvent(IYYTempAudioSession.USER_LEAVE_ROOM, { rid: retJson.rid, uid: retJson.uid });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).ITempAudioSession_OnUserLeaveRoom(retJson);
    }
}


function ITempAudioSession_OnSpeakerChanged(info) {
    if (debugMode) {
        yytrace(IYYTempAudioSession.SPEAKER_CHANGED + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.tempAudioSession.dispatchEvent(IYYTempAudioSession.SPEAKER_CHANGED, { speakerList: retJson.speaker_list.concat() });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).ITempAudioSession_OnSpeakerChanged(retJson);
    }
}
//----------------------------财务接口回调------------------------------------------
/**
* @private
*/
function IFinanceEvent_OnBuyResponse(info) {
    if (debugMode) {
        yytrace(IYYFinance.BUY_RESPONSE + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.finance.dispatchEvent(IYYFinance.BUY_RESPONSE, { sn: retJson.sn, ret: retJson.ret, mode: retJson.mode });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IFinanceEvent_OnBuyResponse(retJson);
    }
}
/**
* @private
*/
function IFinanceEvent_OnBuyGiftsResponse(info) {
    if (debugMode) {
        yytrace(IYYFinance.BUY_GIFTS_RESPONSE + ":" + info);
    }
    var retJson = eval("(" + info + ")");
    yy.finance.dispatchEvent(IYYFinance.BUY_GIFTS_RESPONSE, { sn: retJson.sn, ret: retJson.ret, mode: retJson.mode });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IFinanceEvent_OnBuyGiftsResponse(retJson);
    }
}
//----------------------------公屏回调------------------------------------------

/**
* @private
*/
function IChannelChat_OnChat(uid, msg) {
    if (debugMode) {
        yytrace(IYYChannelChat.CHAT + ":uid=" + uid + " msg=" + msg);
    }
    yy.channel.chat.dispatchEvent(IYYChannelChat.CHAT, { uid: uid, msg: msg });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelChat_OnChat(uid, msg);
    }
}
/**
* @private
*/
function IChannelChat_OnChatFrom(uid, msg) {
    if (debugMode) {
        yytrace(IYYChannelChat.CHAT_FROM + ":uid=" + uid + " msg=" + msg);
    }
    yy.channel.chat.dispatchEvent(IYYChannelChat.CHAT_FROM, { uid: uid, msg: msg });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IChannelChat_OnChatFrom(uid, msg);
    }
}

//----------------------------视频接口回调------------------------------------------
/**
* @private
*/
function IVideo_OnPublishStatus(status) {
    if (debugMode) {
        yytrace(IYYVideo.PUBLISH_STATUS + " status=" + status);
    }
    yy.video.dispatchEvent(IYYVideo.PUBLISH_STATUS, { status: status });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IVideo_OnPublishStatus(status);
    }
}
/**
* @private
*/
function IVideo_OnCameraStatus(status) {
    if (debugMode) {
        yytrace(IYYVideo.CAMERA_STATUS + " status=" + status);
    }
    yy.video.dispatchEvent(IYYVideo.CAMERA_STATUS, { status: status });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IVideo_OnCameraStatus(status);
    }
}
/**
* @private
*/
function IVideo_OnSubscribeStatus(uid, status) {
    if (debugMode) {
        yytrace(IYYVideo.SUBSCRIBE_STATUS + ":uid=" + uid + " status=" + status);
    }
    yy.video.dispatchEvent(IYYVideo.SUBSCRIBE_STATUS, { uid: uid, status: status });
    if (typeof (yy.flashId) === "string" && yy.flashId !== "") {
        document.getElementById(yy.flashId).IVideo_OnSubscribeStatus(uid, status);
    }
}



//调用数据统计
/*
var yyapi_call_stat = null;
var yyapi_call_stat_buff = [];
var yyapi_call_stat_cid = 0;
var yyapi_call_stat_uid = 0;
var yyapi_call_stat_handle = 0;

var yyapi_call_stat_handle = setInterval(function () {
    //yytrace("***************************** stat init......");
    if (document.body != null) {
        yyapi_call_stat = document.createElement("img");
        yyapi_call_stat.id = "imgYYCallStat";
        yyapi_call_stat.style.position = "absolute";
        yyapi_call_stat.style.width = "50px";
        yyapi_call_stat.style.height = "50px";
        yyapi_call_stat.style.backgroundColor = "#FF0000";
        yyapi_call_stat.style.left = "300px";
        yyapi_call_stat.style.top = "0px";
        yyapi_call_stat.style.display = "none";
        var result = yy.channel.getRootChannelId();
        yyapi_call_stat_cid = result.ret == 0 ? result.cid : 0;
        result = yy.user.getCurrentUserInfo();
        yyapi_call_stat_uid = result.ret == 0 ? result.uid : 0;
        document.body.appendChild(yyapi_call_stat);
        clearInterval(yyapi_call_stat_handle);
        //yytrace("************************** stat init finish");
        while (yyapi_call_stat_buff.length > 0) {
            var tmp = yyapi_call_stat_buff.pop();
            yyapi_call_stat.src = "http://ylog.hiido.com/c.gif?" + tmp;
            //yytrace("buffer:" + yyapi_call_stat.src);
        }
       
    }
}, 1000);


function statisticApiCall(apiName,result)
{
    var apiId = 0;
    switch (apiName) {
        case "ISecurity_GetToken":
            apiId = 9001;
            break;
        case "ITempAudioSession_CreateRoom":
            apiId = 1001;
            break;
        case "ITempAudioSession_EnterRoom":
            apiId = 1002;
            break;
        case "ITempAudioSession_LeaveRoom":
            apiId = 1003;
            break;
        case "IFinance_Buy":
            apiId = 501;
            break;
        case "IFinance_BuyByYuan":
            apiId = 502;
            break;
        case "IFinance_BuyGifts":
            apiId = 503;
            break;
        case "IInteraction_Invite":
            apiId = 7001;
            break;
        case "INet_BroadCastAllChannel":
            apiId = 8001;
            break;
        case "INet_BroadCastSubChannel":
            apiId = 8002;
            break;
        case "INet_BroadCastToUsers":
            apiId = 8003;
            break;
        default:

    }

    if (apiId == 0) return;
    var param = "act=webopenapi&type=0&appid=0&api_id=" + apiId + "&sid=" + yyapi_call_stat_cid + "&uid=" + yyapi_call_stat_uid + "&count=1&return=" + result.ret + "&desc=0";
    if (yyapi_call_stat == null) {
        yyapi_call_stat_buff.push(param);
        return;//初始化未完成
    }

    yyapi_call_stat.src = "http://ylog.hiido.com/c.gif?" + param;
    //yytrace(yyapi_call_stat.src);
    

}
*/