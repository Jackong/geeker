qing.registNS("msg.msgpublish.Form");
msg.msgpublish.Form = (function () {
    var l = msgDomain.passport + "/v2/?reggetcodestr&tpl=qing&app=stelyg&apiver=v3&class=reg&echoback=msg.home.editor.changeVerifyCode&tt=";
    var u = {vcodeClass: "input-verifycode", receiverClass: "input-receiver", codestringId: "msgvcode", submitBtnId: "buttonSubmit", lengthShowId: "modEditorLength", textSize: 1000, submitLoadingId: "submitLoading", receiver: ""};
    var d;
    var w = 0;
    var s = false;
    var p = null;
    var m = null;
    var n = null;
    var t = null;
    var a = "/msg/writing/submit/msg";
    var v = function (z) {
        m = qing.q(u.vcodeClass)[0];
        n = qing.q(u.receiverClass)[0];
        t = qing.g(u.codestringId);
        qing.extend(u, z);
        x();
        q();
        f();
        b()
    };
    var x = function () {
        msg.msgpublish.receiverInput.initialize({inputId: "modReceiverInput", receiver: u.receiver})
    };
    var q = function () {
        qelm.msgeditor.initialize("msgTextareaCon", {textareaname: "msgcontent", labelText: "输入私信内容"});
        var z = qelm.msgeditor.getToolbar("msgTextareaCon", "face");
        var B = qing.dom.getPosition(z).left;
        var A = qing.dom.getPosition(z).top + z.offsetHeight + 7;
        qelm.msgeditor.initToolbar("msgTextareaCon", "face", {left: B, top: A});
        p = qelm.msgeditor.getTextArea("msgTextareaCon");
        qing.each(["keypress", "keyup", "change", "paste", "cut", "click", "input", "focus"], function (C) {
            qing.on(p, C, function (D) {
                setTimeout(y, 10)
            })
        })
    };
    var y = function () {
        var z = k();
        e(z);
        c(z);
        i(z);
        w = z
    };
    var c = function (z) {
        if (z == 0 && w > 0 && w <= u.textSize) {
            qing.dom.addClass(u.submitBtnId, "disable")
        } else {
            if (z > u.textSize && w <= u.textSize) {
                qing.dom.addClass(u.submitBtnId, "disable")
            } else {
                if (w == 0 && z > 0 && z <= u.textSize) {
                    qing.dom.removeClass(u.submitBtnId, "disable")
                } else {
                    if (w > u.textSize && z <= u.textSize && z > 0) {
                        qing.dom.removeClass(u.submitBtnId, "disable")
                    }
                }
            }
        }
    };
    var f = function () {
        var A = qing.q("input-verifycode")[0];
        var z = qing.dom.query(".con-verifycode .verifycode")[0];
        qing.on(A, "focus", function () {
            if (qing.dom.hasClass(z, "hide")) {
                o();
                var B = qing.dom.query(".isclear", z)[0];
                qing.on(B, "click", function (C) {
                    qing.event.preventDefault(C);
                    var D = new Date();
                    baidu.sio.callByServer(l + D.getTime(), "msg.msgpublish.Form.changeVerifyCode")
                })
            }
        });
        qing.on(A, "keydown", function (B) {
            var C = qing.event.getKeyCode(B);
            if (C == 13) {
                r()
            }
        })
    };
    var o = function () {
        var z = new Date();
        baidu.sio.callByServer(l + z.getTime(), "msg.msgpublish.Form.changeVerifyCode")
    };
    var j = function (B) {
        var E = B.data.verifyStr || "";
        qing.g("msgvcode").value = E;
        var A = new Date();
        var C = qing.dom.query(".con-verifycode .verifycode")[0];
        var z = qing.dom.query("img", C)[0];
        var D = msgDomain.passport + "/cgi-bin/genimage?" + E + "&t=" + A.getTime();
        z.src = "";
        z.src = D;
        qing.dom.removeClass(C, "hide")
    };
    var b = function () {
        qing.on(u.submitBtnId, "mouseover", function () {
            if (!qing.dom.hasClass(this, "sending") && !qing.dom.hasClass(this, "disable")) {
                qing.dom.addClass(this, "hover")
            }
        });
        qing.on(u.submitBtnId, "mouseout", function () {
            if (!qing.dom.hasClass(this, "sending") && !qing.dom.hasClass(this, "disable")) {
                qing.dom.removeClass(this, "hover")
            }
        });
        qing.on(u.submitBtnId, "click", function () {
            if (!qing.dom.hasClass(this, "sending") && !qing.dom.hasClass(this, "disable")) {
                r()
            }
        })
    };
    var k = function () {
        return p.value.length
    };
    var e = function (z) {
        if (z > u.textSize) {
            qing.g(u.lengthShowId).innerHTML = "<span class='count-red'>" + z + "</span>/" + u.textSize
        } else {
            qing.g(u.lengthShowId).innerHTML = "<span class='count'>" + z + "</span>/" + u.textSize
        }
    };
    var i = function (z) {
        if (z > u.textSize) {
            qing.dom.addClass(p, "input-content-error")
        } else {
            qing.dom.removeClass(p, "input-content-error")
        }
    };
    var r = function () {
        if (s) {
            return
        }
        var z = k();
        msg.msgpublish.receiverInput.updateReceiver();
        if (n.value == "") {
            qui.showError("请输入私信收件人");
            return
        }
        if (z < 1) {
            p.focus();
            qui.showError("请输入私信内容");
            return
        }
        if (z > u.textSize) {
            p.focus();
            qui.showError("私信内容不能超过" + u.textSize + "字符");
            return
        }
        if (m.value == "") {
            qui.showError("请输入验证码");
            return
        }
        qing.un(u.submitBtnId, "click");
        qing.dom.removeClass(u.submitBtnId, "hover");
        qing.dom.addClass(u.submitBtnId, "sending");
        qing.g(u.submitBtnId).value = "发送中";
        qing.g(u.submitLoadingId).style.display = "block";
        g();
        s = true
    };
    var h = function () {
        qui.confirm("抱歉，您只能发送百度域的链接，如需发送站外链接，请先绑定密保手机", {title: "发送失败", confirmText: "绑定手机", fn: function (z) {
            if (z === "yes") {
                var A;
                qing.sio.callByBrowser("http://passport.baidu.com/passApi/js/uni_armorwidget_wrapper.js?v=89264873.js", function () {
                    A = passport.pop.ArmorWidget("bindmobile", {token: bindPhoneToken, title: "绑定手机", msg: "", auth_title: "绑定手机", auth_msg: "为了保证您的帐号安全，绑定手机前请先进行安全验证", onSubmitSuccess: function (B, C) {
                        r()
                    }, onSubmitFail: function () {
                    }});
                    A.show()
                })
            } else {
                if (z === "no") {
                } else {
                }
            }
        }})
    };
    var g = function () {
        qing.ajax.request(a, {method: "post", noCache: true, data: {msgcontent: p.value, vcode: m.value, msgvcode: t.value, msgreceiver: n.value}, onsuccess: function (A) {
            p.value = "";
            var z = msgDomain.msg + "/msg/home#first";
            qing.dom.query(".con-submit")[0].style.display = "none";
            qui.showSuccess("发送成功", function () {
                window.location = z
            })
        }, onerror: function (z) {
            qext.fn.judgeLogout(z.errorNo);
            qing.dom.removeClass(u.submitBtnId, "sending");
            qing.g(u.submitBtnId).value = "发送";
            qing.g(u.submitLoadingId).style.display = "none";
            qing.on(u.submitBtnId, "click", function () {
                r()
            });
            s = false;
            if (z.errorNo == 40000) {
                h()
            } else {
                qui.showError(z.errorMsg)
            }
            o()
        }, onexception: function (z) {
            qui.showSuccess("发送成功", function () {
                window.location = msgDomain.msg + "/msg/home#first"
            })
        }})
    };
    return{initialize: v, changeVerifyCode: j}
})();
var T, baidu = T = baidu || {version: "1.5.2.2"};
baidu.guid = "$BAIDU$";
baidu.$$ = window[baidu.guid] = window[baidu.guid] || {global: {}};
baidu.ui = baidu.ui || {version: "1.3.9"};
baidu.ui.getUI = function (h) {
    var h = h.split("-"), e = baidu.ui, f = h.length, g = 0;
    for (; g < f; g++) {
        e = e[h[g].charAt(0).toUpperCase() + h[g].slice(1)]
    }
    return e
};
baidu.ui.create = function (c, d) {
    if (baidu.lang.isString(c)) {
        c = baidu.ui.getUI(c)
    }
    return new c(d)
};
baidu.ui.Base = {id: "", getId: function (e) {
    var f = this, d;
    d = "tangram-" + f.uiType + "--" + (f.id ? f.id : f.guid);
    return e ? d + "-" + e : d
}, getClass: function (e) {
    var g = this, h = g.classPrefix, f = g.skin;
    if (e) {
        h += "-" + e;
        f += "-" + e
    }
    if (g.skin) {
        h += " " + f
    }
    return h
}, getMain: function () {
    return baidu.g(this.mainId)
}, getBody: function () {
    return baidu.g(this.getId())
}, uiType: "", getCallRef: function () {
    return"window['$BAIDU$']._instances['" + this.guid + "']"
}, getCallString: function (g) {
    var h = 0, e = Array.prototype.slice.call(arguments, 1), f = e.length;
    for (; h < f; h++) {
        if (typeof e[h] == "string") {
            e[h] = "'" + e[h] + "'"
        }
    }
    return this.getCallRef() + "." + g + "(" + e.join(",") + ");"
}, on: function (e, d, f) {
    baidu.on(e, d, f);
    this.addEventListener("ondispose", function () {
        baidu.un(e, d, f)
    })
}, renderMain: function (e) {
    var g = this, h = 0, f;
    if (g.getMain()) {
        return
    }
    e = baidu.g(e);
    if (!e) {
        e = document.createElement("div");
        document.body.appendChild(e);
        e.style.position = "absolute";
        e.className = g.getClass("main")
    }
    if (!e.id) {
        e.id = g.getId("main")
    }
    g.mainId = e.id;
    e.setAttribute("data-guid", g.guid);
    return e
}, dispose: function () {
    this.dispatchEvent("dispose");
    baidu.lang.Class.prototype.dispose.call(this)
}};
baidu.ui.createUI = function (p, i) {
    i = i || {};
    var l = i.superClass || baidu.lang.Class, m = l == baidu.lang.Class ? 1 : 0, o, q, k = function (b, c) {
        var a = this;
        b = b || {};
        l.call(a, !m ? b : (b.guid || ""), true);
        baidu.object.extend(a, k.options);
        baidu.object.extend(a, b);
        a.classPrefix = a.classPrefix || "tangram-" + a.uiType.toLowerCase();
        for (o in baidu.ui.behavior) {
            if (typeof a[o] != "undefined" && a[o]) {
                baidu.object.extend(a, baidu.ui.behavior[o]);
                if (baidu.lang.isFunction(a[o])) {
                    a.addEventListener("onload", function () {
                        baidu.ui.behavior[o].call(a[o].apply(a))
                    })
                } else {
                    baidu.ui.behavior[o].call(a)
                }
            }
        }
        p.apply(a, arguments);
        for (o = 0, q = k._addons.length; o < q; o++) {
            k._addons[o](a)
        }
        if (b.parent && a.setParent) {
            a.setParent(b.parent)
        }
        if (!c && b.autoRender) {
            a.render(b.element)
        }
    }, r = function () {
    };
    r.prototype = l.prototype;
    var n = k.prototype = new r();
    for (o in baidu.ui.Base) {
        n[o] = baidu.ui.Base[o]
    }
    k.extend = function (a) {
        for (o in a) {
            k.prototype[o] = a[o]
        }
        return k
    };
    k._addons = [];
    k.register = function (a) {
        if (typeof a == "function") {
            k._addons.push(a)
        }
    };
    k.options = {};
    return k
};
baidu.ui.get = function (d) {
    var c;
    if (baidu.lang.isString(d)) {
        return baidu.lang.instance(d)
    } else {
        do {
            if (!d || d.nodeType == 9) {
                return null
            }
            if (c = baidu.dom.getAttr(d, "data-guid")) {
                return baidu.lang.instance(c)
            }
        } while ((d = d.parentNode) != document.body)
    }
};
baidu.ui.Suggestion = baidu.ui.createUI(function (d) {
    var c = this;
    c.addEventListener("onload", function () {
        c.on(document, "mousedown", c.documentMousedownHandler);
        c.on(window, "blur", c.windowBlurHandler)
    });
    c.documentMousedownHandler = c._getDocumentMousedownHandler();
    c.windowBlurHandler = c._getWindowBlurHandler();
    c.enableIndex = [];
    c.currentIndex = -1
}).extend({uiType: "suggestion", onbeforepick: new Function, onpick: new Function, onconfirm: new Function, onhighlight: new Function, onshow: new Function, onhide: new Function, getData: function () {
    return[]
}, prependHTML: "", appendHTML: "", currentData: {}, tplDOM: "<div id='#{0}' class='#{1}' style='position:relative; top:0px; left:0px'></div>", tplPrependAppend: "<div id='#{0}' class='#{1}'>#{2}</div>", tplBody: '<table cellspacing="0" cellpadding="2"><tbody>#{0}</tbody></table>', tplRow: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}" class="#{6}">#{1}</td></tr>', getString: function () {
    var b = this;
    return baidu.format(b.tplDOM, b.getId(), b.getClass(), b.guid)
}, render: function (f) {
    var d = this, e, f = baidu.g(f);
    if (d.getMain() || !f) {
        return
    }
    if (f.id) {
        d.targetId = f.id
    } else {
        d.targetId = f.id = d.getId("input")
    }
    e = d.renderMain();
    e.style.display = "none";
    e.innerHTML = d.getString();
    this.dispatchEvent("onload")
}, _isShowing: function () {
    var c = this, d = c.getMain();
    return d && d.style.display != "none"
}, pick: function (g) {
    var i = this, f = i.currentData, h = f && typeof g == "number" && typeof f[g] != "undefined" ? f[g].value : g, j = {data: {item: h == g ? {value: g, content: g} : f[g], index: g}};
    if (i.dispatchEvent("onbeforepick", j)) {
        i.dispatchEvent("onpick", j)
    }
}, show: function (i, j, l) {
    var g = 0, h = j.length, k = this;
    if (i != k.getTargetValue()) {
        return
    }
    k.enableIndex = [];
    k.currentIndex = -1;
    if (h == 0 && !l) {
        k.hide()
    } else {
        k.currentData = [];
        for (; g < h; g++) {
            if (typeof j[g].value != "undefined") {
                k.currentData.push(j[g])
            } else {
                k.currentData.push({value: j[g], content: j[g]})
            }
            if (typeof j[g]["disable"] == "undefined" || j[g]["disable"] == false) {
                k.enableIndex.push(g)
            }
        }
        k.getBody().innerHTML = k._getBodyString();
        k.getMain().style.display = "block";
        k.dispatchEvent("onshow")
    }
}, hide: function () {
    var h = this;
    if (!h._isShowing()) {
        return
    }
    if (h.currentIndex >= 0 && h.holdHighLight) {
        var i = h.currentData, f = -1;
        for (var j = 0, g = i.length; j < g; j++) {
            if (typeof i[j].disable == "undefined" || i[j].disable == false) {
                f++;
                if (f == h.currentIndex) {
                    h.pick(j)
                }
            }
        }
    }
    h.getMain().style.display = "none";
    h.dispatchEvent("onhide")
}, highLight: function (f) {
    var h = this, g = h.enableIndex, e = null;
    if (!h._isEnable(f)) {
        return
    }
    h.currentIndex >= 0 && h._clearHighLight();
    e = h._getItem(f);
    baidu.addClass(e, h.getClass("current"));
    h.currentIndex = baidu.array.indexOf(g, f);
    h.dispatchEvent("onhighlight", {index: f, data: h.getDataByIndex(f)})
}, clearHighLight: function () {
    var f = this, e = f.currentIndex, d = f.enableIndex[e];
    f._clearHighLight() && f.dispatchEvent("onclearhighlight", {index: d, data: f.getDataByIndex(d)})
}, _clearHighLight: function () {
    var h = this, f = h.currentIndex, g = h.enableIndex, e = null;
    if (f >= 0) {
        e = h._getItem(g[f]);
        baidu.removeClass(e, h.getClass("current"));
        h.currentIndex = -1;
        return true
    }
    return false
}, confirm: function (e, f) {
    var d = this;
    if (f != "keyboard") {
        if (!d._isEnable(e)) {
            return
        }
    }
    d.pick(e);
    d.dispatchEvent("onconfirm", {data: d.getDataByIndex(e) || e, source: f});
    d.currentIndex = -1;
    d.hide()
}, getDataByIndex: function (b) {
    return{item: this.currentData[b], index: b}
}, getTargetValue: function () {
    return this.getTarget().value
}, getTarget: function () {
    return baidu.g(this.targetId)
}, _getItem: function (b) {
    return baidu.g(this.getId("item" + b))
}, _getBodyString: function () {
    var k = this, l = "", m = [], j = k.currentData, i = j.length, n = 0;

    function h(a) {
        return baidu.format(k.tplPrependAppend, k.getId(a), k.getClass(a), k[a + "HTML"])
    }

    l += h("prepend");
    for (; n < i; n++) {
        m.push(baidu.format(k.tplRow, k.getId("item" + n), j[n].content, k.getCallRef() + "._itemOver(event, " + n + ")", k.getCallRef() + "._itemOut(event, " + n + ")", k.getCallRef() + "._itemDown(event, " + n + ")", k.getCallRef() + "._itemClick(event, " + n + ")", (typeof j[n]["disable"] == "undefined" || j[n]["disable"] == false) ? "" : k.getClass("disable")))
    }
    l += baidu.format(k.tplBody, m.join(""));
    l += h("append");
    return l
}, _itemOver: function (f, e) {
    var d = this;
    baidu.event.stop(f || window.event);
    d._isEnable(e) && d.highLight(e);
    d.dispatchEvent("onmouseoveritem", {index: e, data: d.getDataByIndex(e)})
}, _itemOut: function (f, e) {
    var d = this;
    baidu.event.stop(f || window.event);
    if (!d.holdHighLight) {
        d._isEnable(e) && d.clearHighLight()
    }
    d.dispatchEvent("onmouseoutitem", {index: e, data: d.getDataByIndex(e)})
}, _itemDown: function (f, e) {
    var d = this;
    baidu.event.stop(f || window.event);
    d.dispatchEvent("onmousedownitem", {index: e, data: d.getDataByIndex(e)})
}, _itemClick: function (f, e) {
    var d = this;
    baidu.event.stop(f || window.event);
    d.dispatchEvent("onitemclick", {index: e, data: d.getDataByIndex(e)});
    d._isEnable(e) && d.confirm(e, "mouse")
}, _isEnable: function (d) {
    var c = this;
    return baidu.array.contains(c.enableIndex, d)
}, _getDocumentMousedownHandler: function () {
    var b = this;
    return function (e) {
        e = e || window.event;
        var a = e.target || e.srcElement, f = baidu.ui.get(a);
        if (a == b.getTarget() || (f && f.uiType == b.uiType)) {
            return
        }
        b.hide()
    }
}, _getWindowBlurHandler: function () {
    var b = this;
    return function () {
        b.hide()
    }
}, dispose: function () {
    var b = this;
    b.dispatchEvent("dispose");
    baidu.dom.remove(b.mainId);
    baidu.lang.Class.prototype.dispose.call(this)
}});
baidu.ui.behavior = baidu.ui.behavior || {};
(function () {
    var b = baidu.ui.behavior.coverable = function () {
    };
    b.Coverable_isShowing = false;
    b.Coverable_iframe;
    b.Coverable_container;
    b.Coverable_iframeContainer;
    b.Coverable_show = function () {
        var i = this;
        if (i.Coverable_iframe) {
            i.Coverable_update();
            baidu.setStyle(i.Coverable_iframe, "display", "block");
            return
        }
        var k = i.coverableOptions || {}, n = i.Coverable_container = k.container || i.getMain(), l = k.opacity || "0", m = k.color || "", j = i.Coverable_iframe = document.createElement("iframe"), a = i.Coverable_iframeContainer = document.createElement("div");
        baidu.dom.children(n).length > 0 ? baidu.dom.insertBefore(a, n.firstChild) : n.appendChild(a);
        baidu.setStyles(a, {position: "absolute", top: "0px", left: "0px"});
        baidu.dom.setBorderBoxSize(a, {width: n.offsetWidth, height: n.offsetHeight});
        baidu.dom.setBorderBoxSize(j, {width: a.offsetWidth});
        baidu.dom.setStyles(j, {zIndex: -1, display: "block", border: 0, backgroundColor: m, filter: "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=" + l + ")"});
        a.appendChild(j);
        j.src = "javascript:void(0)";
        j.frameBorder = "0";
        j.scrolling = "no";
        j.height = "97%";
        i.Coverable_isShowing = true
    };
    b.Coverable_hide = function () {
        var d = this, a = d.Coverable_iframe;
        if (!d.Coverable_isShowing) {
            return
        }
        baidu.setStyle(a, "display", "none");
        d.Coverable_isShowing = false
    };
    b.Coverable_update = function (i) {
        var g = this, i = i || {}, j = g.Coverable_container, a = g.Coverable_iframeContainer, h = g.Coverable_iframe;
        baidu.dom.setBorderBoxSize(a, {width: j.offsetWidth, height: j.offsetHeight});
        baidu.dom.setBorderBoxSize(h, baidu.extend({width: baidu.getStyle(a, "width")}, i))
    }
})();
baidu.extend(baidu.ui.Suggestion.prototype, {coverable: true, coverableOptions: {}});
baidu.ui.Suggestion.register(function (b) {
    if (b.coverable) {
        b.addEventListener("onshow", function () {
            b.Coverable_show()
        });
        b.addEventListener("onhide", function () {
            b.Coverable_hide()
        })
    }
});
baidu.ui.Suggestion.extend({setData: function (g, h, e) {
    var f = this;
    f.dataCache[g] = h;
    if (!e) {
        f.show(g, f.dataCache[g])
    }
}});
baidu.ui.Suggestion.register(function (b) {
    b.dataCache = {}, b.addEventListener("onneeddata", function (f, e) {
        var a = b.dataCache;
        if (typeof a[e] == "undefined") {
            b.getData(e)
        } else {
            b.show(e, a[e])
        }
    })
});
(function () {
    var c = baidu.ui.behavior.posable = function () {
    };
    c.setPosition = function (a, h, i) {
        h = baidu.g(h) || this.getMain();
        i = i || {};
        var b = this, j = [h, a, i];
        b.__execPosFn(h, "_positionByCoordinate", i.once, j)
    };
    c._positionByCoordinate = function (F, b, a, D) {
        b = b || [0, 0];
        a = a || {};
        var u = this, t = {}, w = baidu.page.getViewHeight(), s = baidu.page.getViewWidth(), z = baidu.page.getScrollLeft(), B = baidu.page.getScrollTop(), C = F.offsetWidth, A = F.offsetHeight, E = F.offsetParent, v = (!E || E == document.body) ? {left: 0, top: 0} : baidu.dom.getPosition(E);
        a.position = (typeof a.position !== "undefined") ? a.position.toLowerCase() : "bottomright";
        b = d(b || [0, 0]);
        a.offset = d(a.offset || [0, 0]);
        b.x += (a.position.indexOf("right") >= 0 ? (b.width || 0) : 0);
        b.y += (a.position.indexOf("bottom") >= 0 ? (b.height || 0) : 0);
        t.left = b.x + a.offset.x - v.left;
        t.top = b.y + a.offset.y - v.top;
        switch (a.insideScreen) {
            case"surround":
                t.left += t.left < z ? C + (b.width || 0) : ((t.left + C) > (z + s) ? -C - (b.width || 0) : 0);
                t.top += t.top < B ? A + (b.height || 0) : ((t.top + A) > (B + w) ? -A - (b.height || 0) : 0);
                break;
            case"fix":
                t.left = Math.max(0 - parseFloat(baidu.dom.getStyle(F, "marginLeft")) || 0, Math.min(t.left, baidu.page.getViewWidth() - C - v.left));
                t.top = Math.max(0 - parseFloat(baidu.dom.getStyle(F, "marginTop")) || 0, Math.min(t.top, baidu.page.getViewHeight() - A - v.top));
                break;
            case"verge":
                var x = {width: (a.position.indexOf("right") > -1 ? b.width : 0), height: (a.position.indexOf("bottom") > -1 ? b.height : 0)}, y = {width: (a.position.indexOf("bottom") > -1 ? b.width : 0), height: (a.position.indexOf("right") > -1 ? b.height : 0)};
                t.left -= (a.position.indexOf("right") >= 0 ? (b.width || 0) : 0);
                t.top -= (a.position.indexOf("bottom") >= 0 ? (b.height || 0) : 0);
                t.left += t.left + x.width + C - z > s - v.left ? y.width - C : x.width;
                t.top += t.top + x.height + A - B > w - v.top ? y.height - A : x.height;
                break
        }
        baidu.dom.setPosition(F, t);
        if (!D && (w != baidu.page.getViewHeight() || s != baidu.page.getViewWidth())) {
            u._positionByCoordinate(F, b, {}, true)
        }
        D || u.dispatchEvent("onpositionupdate")
    };
    c.__execPosFn = function (i, a, h, j) {
        var b = this;
        if (typeof h == "undefined" || !h) {
            baidu.event.on(baidu.dom.getWindow(i), "resize", baidu.fn.bind.apply(b, [a, b].concat([].slice.call(j))))
        }
        b[a].apply(b, j)
    };
    function d(a) {
        a.x = a[0] || a.x || a.left || 0;
        a.y = a[1] || a.y || a.top || 0;
        return a
    }
})();
baidu.ui.Suggestion.extend({posable: true, fixWidth: true, getWindowResizeHandler: function () {
    var b = this;
    return function () {
        b.adjustPosition(true)
    }
}, adjustPosition: function (g) {
    var k = this, j = k.getTarget(), l, h = k.getMain(), i;
    if (!k._isShowing() && g) {
        return
    }
    l = baidu.dom.getPosition(j), i = {top: (l.top + j.offsetHeight - 1), left: l.left, width: j.offsetWidth};
    i = typeof k.view == "function" ? k.view(i) : i;
    k.setPosition([i.left, i.top], null, {once: true});
    baidu.dom.setOuterWidth(h, i.width)
}});
baidu.ui.Suggestion.register(function (b) {
    b.windowResizeHandler = b.getWindowResizeHandler();
    b.addEventListener("onload", function () {
        b.adjustPosition();
        if (b.fixWidth) {
            b.fixWidthTimer = setInterval(function () {
                var a = b.getMain(), d = b.getTarget();
                if (a.offsetWidth != 0 && d && d.offsetWidth != a.offsetWidth) {
                    b.adjustPosition();
                    a.style.display = "block"
                }
            }, 100)
        }
        b.on(window, "resize", b.windowResizeHandler)
    });
    b.addEventListener("onshow", function () {
        b.adjustPosition()
    });
    b.addEventListener("ondispose", function () {
        clearInterval(b.fixWidthTimer)
    })
});
baidu.ui.Suggestion.register(function (n) {
    var k, p = "", l, o, i = false, m = false;

    function j() {
        setTimeout(function () {
            l = n.getTarget().value
        }, 20)
    }

    n.addEventListener("onload", function () {
        k = this.getTarget();
        j();
        n.on(window, "onload", j);
        n.targetKeydownHandler = n.getTargetKeydownHandler();
        n.on(k, "keydown", n.targetKeydownHandler);
        k.setAttribute("autocomplete", "off");
        n.circleTimer = setInterval(function () {
            if (m) {
                return
            }
            if (baidu.g(k) == null) {
                n.dispose()
            }
            var a = k.value;
            if (a == p && a != "" && a != l && a != o) {
                if (n.requestTimer == 0) {
                    n.requestTimer = setTimeout(function () {
                        n.dispatchEvent("onneeddata", a)
                    }, 100)
                }
            } else {
                clearTimeout(n.requestTimer);
                n.requestTimer = 0;
                if (a == "" && p != "") {
                    o = "";
                    n.hide()
                }
                p = a;
                if (a != o) {
                    n.defaultIptValue = a
                }
                if (l != k.value) {
                    l = ""
                }
            }
        }, 10);
        n.on(k, "beforedeactivate", n.beforedeactivateHandler)
    });
    n.addEventListener("onitemclick", function () {
        m = false;
        n.defaultIptValue = p = n.getTargetValue()
    });
    n.addEventListener("onpick", function (a) {
        if (i) {
            k.blur()
        }
        k.value = o = a.data.item.value;
        if (i) {
            k.focus()
        }
    });
    n.addEventListener("onmousedownitem", function (a) {
        i = true;
        m = true;
        setTimeout(function () {
            m = false;
            i = false
        }, 500)
    });
    n.addEventListener("ondispose", function () {
        clearInterval(n.circleTimer)
    })
});
baidu.ui.Suggestion.extend({beforedeactivateHandler: function () {
    return function () {
        if (mousedownView) {
            window.event.cancelBubble = true;
            window.event.returnValue = false
        }
    }
}, getTargetKeydownHandler: function () {
    var c = this;

    function d(f) {
        if (!c._isShowing()) {
            c.dispatchEvent("onneeddata", c.getTargetValue());
            return
        }
        var a = c.enableIndex, b = c.currentIndex;
        if (a.length == 0) {
            return
        }
        if (f) {
            switch (b) {
                case -1:
                    b = a.length - 1;
                    c.pick(a[b]);
                    c.highLight(a[b]);
                    break;
                case 0:
                    b = -1;
                    c.pick(c.defaultIptValue);
                    c.clearHighLight();
                    break;
                default:
                    b--;
                    c.pick(a[b]);
                    c.highLight(a[b]);
                    break
            }
        } else {
            switch (b) {
                case -1:
                    b = 0;
                    c.pick(a[b]);
                    c.highLight(a[b]);
                    break;
                case a.length - 1:
                    b = -1;
                    c.pick(c.defaultIptValue);
                    c.clearHighLight();
                    break;
                default:
                    b++;
                    c.pick(a[b]);
                    c.highLight(a[b]);
                    break
            }
        }
        c.currentIndex = b
    }

    return function (a) {
        var e = false, b;
        a = a || window.event;
        switch (a.keyCode) {
            case 27:
                c.hide();
                break;
            case 13:
                baidu.event.stop(a);
            case 9:
                if (c.currentIndex != -1) {
                    baidu.event.stop(a)
                }
                c.confirm(c.currentIndex == -1 ? c.getTarget().value : c.enableIndex[c.currentIndex], "keyboard");
                break;
            case 38:
                e = true;
            case 40:
                baidu.event.stop(a);
                d(e);
                break;
            case 186:
            case 188:
            case 190:
                baidu.event.stop(a);
                c.confirm(c.getTarget().value, "keyboard");
                break;
            default:
                c.currentIndex = -1
        }
    }
}, defaultIptValue: ""});
T.undope = true;
qing.registNS("msg.msgpublish.receiverInput");
(function (p) {
    var o, w, l, u, e, A, d, C;
    var q = "/msg/writing/data/friends";
    var r = function () {
        qing.on(w, "click", function () {
            l.focus()
        });
        qing.on(l, "keydown", function (F) {
            var D = qing.event.getKeyCode(F);
            var E = {"13": "回车", "186": "分号", "32": "空格", "9": "TAB", "188": "逗号", "190": "英文句号"};
            if (D == 9 && l.value.length == 0) {
                return
            }
            if (E[D] && !A) {
                qing.event.stop(F);
                j(l.value)
            } else {
                if (D == 8) {
                    if (!l.value) {
                        a()
                    }
                }
            }
        });
        qing.each(["blur"], function (D) {
            qing.on(l, D, function () {
                u = setTimeout(function () {
                    j(l.value);
                    z(false);
                    b()
                }, 200)
            })
        });
        qing.each(["keypress", "keyup", "keydown", "focus", "paste", "change"], function (D) {
            qing.on(l, D, function () {
                l.size = qing.string.getByteLength(l.value) + 1;
                u && clearTimeout(u);
                z(true);
                b("focus")
            })
        });
        qing.on(w, "mouseover", function () {
            qing.dom.addClass(w, "input-box-hover")
        });
        qing.on(w, "mouseout", function () {
            qing.dom.removeClass(w, "input-box-hover")
        });
        qing.on(C, "click", function () {
            l.focus()
        })
    };
    var b = function (D) {
        if (c().length > 0 || l.value.length > 0) {
            C.style.display = "none"
        } else {
            C.style.display = "block";
            if (D == "focus") {
                qing.dom.addClass(C, "focus")
            } else {
                qing.dom.removeClass(C, "focus")
            }
        }
    };
    var z = function (D) {
        if (D) {
            qing.addClass(w, "active")
        } else {
            qing.removeClass(w, "active")
        }
    };
    var a = function (E) {
        if (!E) {
            var D = qing.q("user-receiver-info", w);
            if (D.length > 0) {
                E = D[D.length - 1]
            }
        }
        E && qing.dom.remove(E);
        n();
        k()
    };
    var t = function () {
        w = qing.dom.create("div", {className: o.className});
        qing.dom.addClass(w, "user-container clearfix");
        w.appendChild(v());
        qing.dom.setStyles(o, {display: "none"});
        qing.dom.insertAfter(w, o)
    };
    var s = ['<div class="sugg-con clearfix#{lastCls}">', '<div class="sugg-portrait">#{portrait}</div>', '<div class="sugg-username">#{username}</div>', "</div>"];
    var y = function () {
        e = new baidu.ui.Suggestion({getData: function (G) {
            var D = x();
            if (D.length == 0) {
                return
            }
            var F = [];
            baidu.array.each(D, function (K, I) {
                var H = K.split(",");
                var M = H[0];
                var L = H[1];
                if (G && M.toLowerCase().indexOf(G.toLowerCase()) != -1) {
                    if (F.length < 7 && !g(K)) {
                        var J = s.join("");
                        J = J.replace(/#{portrait}/g, '<img src="' + msgDomain.portrait + "/" + L + '.jpg" class="border-radius-2 portrait24" data-src="' + L + '" alt="' + M + '"/>');
                        J = J.replace(/#{username}/g, M);
                        F.push(J)
                    }
                }
            });
            for (var E = 0; E < F.length; E++) {
                if (E == 0) {
                    F[E] = F[E].replace(/#{lastCls}/g, " sugg-con-first")
                } else {
                    if (E == F.length - 1) {
                        F[E] = F[E].replace(/#{lastCls}/g, " sugg-con-last")
                    } else {
                        F[E] = F[E].replace(/#{lastCls}/g, "")
                    }
                }
            }
            this.show(G, F);
            this.highLight(0)
        }, onbeforepick: function (D) {
            var E = document.createElement("div");
            E.innerHTML = D.data.item.content;
            D.data.item.content = D.data.item.value = baidu.dom.getText(E)
        }, onconfirm: function (D) {
            var E = D.data.item ? D.data.item.value : l.value;
            E && j(E)
        }, view: function (D) {
            if (qing.browser.ie > 7) {
                D.top = D.top + 8
            } else {
                D.top = D.top + 1
            }
            D.width = 163;
            return D
        }, onshow: function () {
            A = true
        }, onhide: function () {
            A = false
        }});
        e.render(l);
        x()
    };
    var x = function () {
        if (d) {
            return d
        } else {
            tmpList = [];
            qing.ajax.request(q, {method: "get", noCache: true, data: {}, onsuccess: function (D) {
                if (D && D[0]) {
                    var E = D[0].msgFriendList;
                    qing.each(E, function (F) {
                        F && tmpList.push(F.uname + "," + F.portrait)
                    });
                    tmpList.sort();
                    d = tmpList
                }
            }, onerror: function (D) {
                qext.fn.judgeLogout(D.errorNo)
            }, onfailure: function () {
            }});
            return[]
        }
    };
    var g = function (E) {
        var D = ";" + c();
        return D.indexOf(";" + E + ";") > -1
    };
    var v = function () {
        var D = qing.dom.create("div", {className: "user-input-box"});
        l = qing.dom.create("input", {className: "user-input-input", maxLength: 14, type: "text"});
        D.appendChild(l);
        return D
    };
    var j = function (E) {
        E = E.replace(/[<>\/\\\'\"]/g, "");
        if (E.length == 0) {
            return
        }
        if (qing.q("user-receiver-info", w).length >= 5) {
            qui.showError("收件人最多为5人");
            return
        }
        n();
        var D = f(E);
        if (!i(E)) {
            qing.dom.insertBefore(D, l)
        }
        k()
    };
    var i = function (D) {
        var E = new RegExp("^" + D + ";|;" + D + ";");
        return E.test(c())
    };
    var n = function () {
        l.value = "";
        l.size = 1
    };
    var f = function (D) {
        var F = qing.dom.create("div", {className: "user-receiver-info"});
        var E = qing.dom.create("span", {className: "user-receiver-info-name"});
        E.innerHTML = D;
        var G = qing.dom.create("a", {className: "user-receiver-info-close", href: "#", onclick: "return false;"});
        F.appendChild(E);
        F.appendChild(G);
        qing.on(G, "click", function () {
            a(F)
        });
        return F
    };
    var k = function () {
        var D = qing.q("user-receiver-info-name", w);
        var E = "";
        qing.each(D, function (F) {
            E += F.innerHTML + ";"
        });
        o.value = E;
        b()
    };
    var c = function () {
        return o.value
    };
    var m = function (D) {
        var E = D + ";" + c();
        qing.each(E.split(";"), function (F) {
            F = qext.fn.subByte(F, 14);
            j(F)
        });
        b()
    };
    var B = function (D) {
        var F = D.inputId || "modReceiverInput";
        var E = D.receiver || "";
        o = qing.g(F);
        C = qing.g("modReceiverLabel");
        t();
        b();
        r();
        m(E)
    };
    var h = function () {
        j(l.value)
    };
    p.initialize = B;
    p.getReceiverNames = c;
    p.updateReceiver = h
})(msg.msgpublish.receiverInput);