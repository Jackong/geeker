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
var api = 'http://geeker.duapp.com/api/tieba';
var tips = qing.g('modReceiverLabel');
tips.innerHTML = '请输入要提取的贴吧名';
var gkContent = '';
var gkSentCounter = 0;
var gkTotal = 0;
var gkTiebaName;
var tbMembers = [];
var damaAccount, damaPassword;
var gkPage = 1;

gkInit();

function gkInit() {
    qing.g('buttonSubmit').setAttribute('hidden', 'true');
    var gkCrawlBtn = newElement('input', {type:'button', onclick:'gkCrawl()', class: 'editor-submit-btn', value: '提取并发送'});
    qing.q('left')[0].appendChild(gkCrawlBtn);

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
    gkTiebaName = qing.q('input-receiver')[0].value.replace(";", "");
    qing.q('user-receiver-info-close')[0].click();
    gkContent = qelm.msgeditor.getTextArea('msgTextareaCon').value;
    document.getElementsByName('vcode')[0].focus();
    gkCrawlPage();
}

function gkCrawlPage() {
    var crawlerScript = document.createElement('script');
    crawlerScript.src = api + '/member/' + encodeURIComponent(gkTiebaName) + '?page=' + gkPage;
    head.appendChild(crawlerScript);
}

function gkSendMembers(total, members) {
    if (members.length <= 0) {
        gkCrawlPage();
        return;
    }
    gkPage++;
    tbMembers = tbMembers.concat(members);
    gkTotal = total;
    gkContinue();
}

function gkContinue() {
    if (gkSentCounter >= gkTotal) {
        alert("发送完成，结果：" + gkSentCounter + '/' + gkTotal);
        return;
    }
    var leng = tbMembers.length;
    if (leng < 5 && gkSentCounter + leng < gkTotal) {
        gkCrawlPage();
        return;
    }

    var closeLength = qing.q('user-receiver-info-close').length;
    for (var jdx = 0; jdx < closeLength; jdx++) {
        qing.q('user-receiver-info-close')[0].click();
    }

    var counter = leng > 5 ? 5 : leng;
    for (var idx = 0; idx < counter; idx++) {
        qing.q('user-input-input')[0].value = tbMembers.pop();
        msg.msgpublish.receiverInput.updateReceiver();
    }
    gkVCode();
}

function gkVCode() {
    var vCodeScript = newElement('script', {
        src: api + '/vcode?account=' + damaAccount
            + '&password=' + damaPassword
            + '&url=' + encodeURIComponent(qing.q('code-img')[0].src)
    });
    head.appendChild(vCodeScript);
}

function gkWaitVCode(vCodeId) {
    setTimeout(function() {
        var vCodeIdScript = newElement('script', {
            src: api + '/vcode/' + vCodeId
                + '?account=' + damaAccount
                + '&password=' + damaPassword
        });
        head.appendChild(vCodeIdScript);
    }, 2000);
}

function gkSend(code) {
    var msgvcode = qing.g('msgvcode').value;
    qing.q('isclear')[0].click();
    qing.ajax.request('/msg/writing/submit/msg',
        {
            method: 'post',
            noCache: true,
            data: {
                msgcontent: gkContent,
                vcode: code,
                msgvcode: msgvcode,
                msgreceiver: qing.q('input-receiver')[0].value},
            onsuccess: function (A) {
                gkSentCounter += 5;
                gkSentCounter = gkSentCounter > gkTotal ? gkTotal : gkSentCounter;
                qui.showSuccess('发送成功：' + gkSentCounter + '/' + gkTotal, function () {
                    gkContinue();
                })
            },
            onerror: function (z) {
                if (z.errorNo == '3014') {
                }
                gkVCode();
                qui.showError(z.errorMsg);
            },
            onexception: function (z) {
                gkSentCounter += 5;
                gkSentCounter = gkSentCounter > gkTotal ? gkTotal : gkSentCounter;
                qui.showSuccess('发送成功：' + gkSentCounter + '/' + gkTotal, function () {
                    gkContinue();
                })
            }
        });
}

function gkVCodeError(code, msg) {
    alert('打码工具出错啦:' + code + ':' + msg);
}