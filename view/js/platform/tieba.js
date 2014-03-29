/**
 * Created by daisy on 14-3-28.
 */

function newElement(tag, attrs, inner) {
    var element = document.createElement(tag);
    for (var attr in attrs) {
        element.setAttribute(attr, attrs[attr]);
    }
    if (inner) {
        element.innerHTML = inner;
    }
    return element;
}
var api = 'http://geeker.duapp.com:10080/api/tieba';
var tips = qing.g('modReceiverLabel');
tips.innerHTML = '请输入要提取的贴吧名';
var gkContent = '';

qing.g('buttonSubmit').setAttribute('hidden', 'true');
var gkCrawlBtn = newElement('input', {type:'button', onclick:'gkCrawl()', class: 'editor-submit-btn', value: '提取并发送'});
qing.q('left')[0].appendChild(gkCrawlBtn);
var tbMembers = [];
var damaAccount, damaPassword;
gkDamaInput();

function gkDamaInput() {
    qing.q('mod-friends-tips-content')[0].innerHTML = '充值卡：ed227bbe38e2d4cdb779697c3294ed99';
    var account = newElement('input', {id: 'damaAccount', type: 'text', placeholder: '打码账号'});
    var password = newElement('input', {id: 'damaPassword', type: 'text', placeholder: '打码密码'});
    var friendTips = qing.q('mod-friends-tips')[0];
    friendTips.appendChild(account);
    friendTips.appendChild(password);
}

function gkCrawl() {
    damaAccount = qing.g('damaAccount').value;
    damaPassword = qing.g('damaPassword').value;
    var crawlerScript = document.createElement('script');
    crawlerScript.src = api + '/member/' + encodeURIComponent(qing.q('input-receiver')[0].value.replace(";", ""));
    qing.q('user-receiver-info-close')[0].click();
    gkContent = qelm.msgeditor.getTextArea('msgTextareaCon').value;
    head.appendChild(crawlerScript);
    document.getElementsByName('vcode')[0].focus();
}

function gkMembers() {
    var finishScript = document.createElement('script');
    finishScript.src = api + '/member?cb=gkFinish';
    head.appendChild(finishScript);
}

function gkWait() {
    setTimeout(function() {
        gkMembers();
    }, 3000);
}

function gkFinish(members) {
    tbMembers = members;
    gkContinue();
}

function gkCrawling(num, idx) {
    idx++;
    if (idx > num) {
        gkMembers();
        return;
    }
    setTimeout(function() {
        tips.innerHTML = '正在提取：' + idx + '/' + num;
        gkCrawling(num, idx);
    }, 40);
}



function gkVCode() {
    var vcodeScript = newElement('script', {
        src: api + '/vcode?account=' + damaAccount
            + '&password=' + damaPassword
            + '&url=' + encodeURIComponent(qing.q('code-img')[0].src)
    });
    head.appendChild(vcodeScript);
}

function gkContinue() {
    var leng = tbMembers.length;
    if (leng <= 0) {
        return;
    }
    var closeLength = qing.q('user-receiver-info-close').length;
    for (var jdx = 0; jdx < closeLength; jdx++) {
        qing.q('user-receiver-info-close')[0].click();
    }
    var counter = leng > 4 ? 4 : leng;
    for (var idx = 0; idx < counter; idx++) {
        qing.q('user-input-input')[0].value = tbMembers.pop();
        msg.msgpublish.receiverInput.updateReceiver();
    }
    gkVCode();
}

function gkWaitVCode(vCodeId) {
    setTimeout(function() {
        var vCodeIdScript = newElement('script', {
            src: api + '/vcode/' + vCodeId
                + '?account=' + damaAccount
                + '&password=' + damaPassword
        });
    }, 2000);
}

function gkSend(code) {
    qing.ajax.request('/msg/writing/submit/msg',
        {
            method: 'post',
            noCache: true,
            data: {
                msgcontent: gkContent,
                vcode: code,
                msgvcode: qing.g('msgvcode').value,
                msgreceiver: qing.q('input-receiver')[0].value},
            onsuccess: function (A) {
                qing.dom.query('.con-submit')[0].style.display = 'none';
                qui.showSuccess('发送成功', function () {
                    gkContinue();
                })
            },
            onerror: function (z) {
                qext.fn.judgeLogout(z.errorNo);
                qing.dom.removeClass(u.submitBtnId, 'sending');
                qing.g(u.submitBtnId).value = '发送';
                qing.g(u.submitLoadingId).style.display = 'none';
                qing.on(u.submitBtnId, 'click', function () {

                });
                if (z.errorNo == 40000) {
                } else {
                    qui.showError(z.errorMsg);
                    if (z.errorNo == 3014) {
                        qing.q('isclear')[0].click();
                        gkVCode();
                    }
                }
            },
            onexception: function (z) {
                qui.showSuccess('发送成功', function () {
                    gkContinue();
                });
        }});
}

function gkVCodeErr() {
    alert('验证码系统出错，请联系相关人员');
}