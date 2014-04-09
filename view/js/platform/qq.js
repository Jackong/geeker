/**
 * Created by daisy on 14-4-9.
 */
var geek = {
    content: '',
    send2users: function(members) {
        var idx = 0;
        var _self = this;
        setInterval(function() {
            if (idx >= members.length) {
                return;
            }
            var member = members[idx];
            var uin = member.getAttribute('uin');
            member.click();
            var input = document.getElementById('chatBox_inputBox_' + uin);
            input.children[0].children[0].innerHTML = _self.content;
            setTimeout(function() {
                document.getElementById('chatBox_sendMsgButton_' + uin).click();
                document.getElementById('chatBox_closeButton_' + uin).click();
            }, 700);
            idx++;
        }, 1000);
    },
    expandMembers: function(group) {
        var _self = this;
        var gid = group.getAttribute('gid');
        if (!document.getElementById('check_group_' + gid).checked) {
            return;
        }
        group.click();
        document.getElementById('chatBox_sideBar_trigger_' + gid).click();
        setTimeout(function() {
            var categories = document.getElementById('chatBox_groupMember_mainArea_' + gid).children;
            for (var idx = 0; idx < categories.length; idx++) {
                var category = categories[idx];
                if (!category || typeof category == 'undefine') {
                    continue;
                }
                var members = category.children;
                console.log(gid + ':' + category.id + ':' + members.length);
                _self.send2users(members);
            }
        }, 1000);
    },

    groups: function() {
        document.getElementById('EQQ_TabGroupList').click();
        return document.getElementById('EQQ_groupListInner').children;
    },

    send2members: function(groups) {
        var gidx = 0;
        var _self = this;
        setInterval(function() {
            if (gidx >= groups.length) {
                return;
            }
            var group = groups[gidx];
            _self.expandMembers(group);
            gidx++;
        }, 1000);
    },

    send2groups: function(groups) {
        var gidx = 0;
        var _self = this;
        setInterval(function() {
            if (gidx >= groups.length) {
                return;
            }
            var group = groups[gidx];
            var gid = group.getAttribute('gid');
            if (!document.getElementById('check_group_' + gid).checked) {
                gidx++;
                return;
            }
            group.click();
            document.getElementById('chatBox_inputBox_' + gid).children[0].children[0].innerHTML = _self.content;
            setTimeout(function() {
                document.getElementById('chatBox_sendMsgButton_' + gid).click();
                document.getElementById('chatBox_closeButton_' + gid).click();
            }, 700);
            gidx++;
        }, 1000);
    },
    send2friends: function(clazz) {
        for (var idx = 0; idx < clazz.length; idx++) {
            var category = clazz[idx];
            if (!category || typeof category == 'undefine') {
                continue;
            }
            var friends = category.children;
            console.log(category.id + ':' + friends.length);
            this.send2users(friends);
        }
    },
    send2classes: function(classes) {
        for (var idx = 0; idx < classes.length; idx+=2) {
            var clazz = classes[idx];
            if (!clazz.children[0].checked) {
                continue;
            }
            clazz.click();
            this.send2friends(classes[idx + 1].children);
        }
    },
    insertCheckbox4group: function(groups) {
        for (var idx = 0; idx < groups.length; idx++) {
            var group = groups[idx];
            var gid = group.getAttribute('gid');
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'check_group_' + gid;
            group.insertBefore(checkbox, group.children[0]);
        }
    },
    classes: function() {
        return document.getElementById('EQQ_buddyList').children;
    },
    insertCheckbox4class: function(classes) {
        for (var idx = 0; idx < classes.length; idx+=2) {
            var clazz = classes[idx];
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.setAttribute('class', 'EQQ_listClassHeadIcon');
            clazz.insertBefore(checkbox, clazz.children[0]);
        }
    },
    isInited: false,
    init: function() {
        if (this.isInited) {
            return;
        }
        var groups = this.groups();
        if (groups.length <= 0) {
            alert('麻烦加个群再用');
            return;
        }
        var group = groups[0];
        var gid = group.getAttribute('gid');
        group.click();
        this.insertCheckbox4group(groups);
        var classes = this.classes();
        this.insertCheckbox4class(classes);
        var _self = this;
        setTimeout(function() {
            document.getElementById('chatBox_inputBox_' + gid).children[0].children[0].innerHTML = '输入你要发送的内容＝>勾选你要发送的群或分组＝>点击下列按钮发送消息';
            var sendBtn = document.getElementById('chatBox_sendMsgButton_' + gid);

            var groupSendBtn = document.createElement('a');
            groupSendBtn.href = '#';
            groupSendBtn.setAttribute('class', 'chatBox_sendMsgButton');
            groupSendBtn.innerHTML = '发 群';
            groupSendBtn.setAttribute('onclick', 'geek.sendGroups()');

            sendBtn.parentElement.appendChild(groupSendBtn);

            var membersSendBtn = document.createElement('a');
            membersSendBtn.href = '#';
            membersSendBtn.setAttribute('class', 'chatBox_sendMsgButton');
            membersSendBtn.innerHTML = '私聊群成员';
            membersSendBtn.setAttribute('onclick', 'geek.sendMembers()');

            sendBtn.parentElement.appendChild(membersSendBtn);

            var classSendBtn = document.createElement('a');
            classSendBtn.href = '#';
            classSendBtn.setAttribute('class', 'chatBox_sendMsgButton');
            classSendBtn.innerHTML = '发 组';
            classSendBtn.setAttribute('onclick', 'geek.sendFriends()');

            sendBtn.parentElement.appendChild(classSendBtn);
            _self.isInited = true;
        }, 1000)
    },
    getContent: function() {
        var group = this.groups()[0];
        this.content = document.getElementById('chatBox_inputBox_' + group.getAttribute('gid')).children[0].children[0].innerHTML;
    },
    sendGroups: function() {
        this.getContent();
        var groups = this.groups();
        this.send2groups(groups);
    },
    sendMembers: function() {
        this.getContent();
        var groups = this.groups();
        this.send2members(groups);
    },
    sendFriends: function() {
        this.getContent();
        var classes = this.classes();
        this.send2classes(classes);
    }
};