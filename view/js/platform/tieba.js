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

var gkCrawlBtn = newElement('input', {type:'button', onclick:'gkCrawl()', class: 'editor-submit-btn', value: '提取并发送'});
qing.q('left')[0].appendChild(gkCrawlBtn);
var tbMembers = [];

function gkCrawl() {
    var crawlerScript = document.createElement('script');
    crawlerScript.src = api + '/member/' + encodeURIComponent(qing.q('input-receiver')[0].value.replace(";", ""));
    qing.q('user-receiver-info-close')[0].click();
    gkContent = qelm.msgeditor.getTextArea('msgTextareaCon').value;
    head.appendChild(crawlerScript);
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
    var vcodeScript = newElement('script', {src: api + '/vcode/' + encodeURIComponent(qing.q('code-img')[0].src)});
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