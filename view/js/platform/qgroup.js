/**
 * Created by daisy on 14-4-11.
 */

var geek = {
    qGroup: {
        page: 0,
        msg: '',
        keyword: '',
        min: 0,
        token: '',
        api: 'http://geeker.duapp.com/api',
        logger: null,
        groups: [],
        idx: 0,
        isEnd: false,
        isPause: false,
        progress: 0,
        total: 0,
        searchResult: null,
        init: function () {
            var modelList = document.getElementsByClassName('model-list')[0];
            modelList.innerHTML = "<li>" +
                "<input id='gkKeyword' type='text' placeholder='搜群关键词'> " +
                "<input id='gkMin' type='text' placeholder='群成员人数不少于N人'>" +
                "<input id='gkMsg' type='text' placeholder='入群验证信息'>" +
                "<button onclick='geek.qGroup.start()'>开始</button>" +
                "<button onclick='geek.qGroup.pause()'>暂停</button>" +
                "<button onclick='geek.qGroup.resume()'>继续</button>" +
                "<p id='gkSearchResult'></p>" +
                "</li>" +
                "<li>" +
                "<h4>加群情况</h4>" +
                "<textarea id='gkLog' rows='8' cols='38'></textarea>" +
                "</li>";
        },
        start: function() {
            var keyword = document.getElementById('gkKeyword').value;
            keyword = keyword.trim();
            var min = document.getElementById('gkMin').value;
            min = min.trim();
            if (keyword.length <= 0) {
                alert('麻烦输下关键词');
                return;
            }
            if (min.length <= 0 || isNaN(parseInt(min))) {
                alert('麻烦输下群成员人数');
                return;
            }
            this.min = min;
            this.keyword = keyword;
            this.msg = document.getElementById('gkMsg').value;
            this.token = $.getCSRFToken();
            this.logger = document.getElementById('gkLog');
            this.searchResult = document.getElementById('gkSearchResult');
            this.search();
        },
        pause: function() {
            this.isPause = true;
        },
        resume: function() {
            if (!this.isPause) {
                return;
            }
            this.isPause = false;
            this.add();
        },
        search: function () {
            if (this.isEnd) {
                alert('完成');
                return;
            }
            var searchScript = document.createElement('script');
            searchScript.src = this.api + '/qq/group?' +
                'keyword=' + encodeURIComponent(this.keyword) +
                '&token=' + this.token +
                '&min=' + this.min +
                '&page=' + this.page +
                '&ck=' + encodeURIComponent(document.cookie);
            head.appendChild(searchScript);
        },
        add: function () {
            if (this.isPause) {
                return;
            }
            if (this.idx >= this.groups.length) {
                this.search();
                return;
            }
            var group = this.groups[this.idx];
            this.log(group.gName +
                '[' + group.gMemNum +
                '/' + group.gMaxMem +
                ']');
            var addScript = document.createElement('script');
            addScript.src = this.api + '/qq/group/' + group.gc +
                '?token=' + this.token +
                '&msg=' + this.msg +
                '&ck=' + encodeURIComponent(document.cookie);
            head.appendChild(addScript);
        },
        searchCB: function (isEnd, total, groups) {
            this.total = total;
            this.groups = groups;
            this.idx = 0;
            this.isEnd = (isEnd == 1);
            this.page++;
            this.add();
        },
        addCB: function() {
            this.log('：成功\n');
            this.progress++;
            this.searchResult.innerHTML = '加群进度（符合要求/搜索结果）：' + this.progress + '/' + this.total;
            var _self = this;
            setTimeout(function() {
                _self.idx++;
                _self.add();
            }, 10000);
        },
        error: function (msg) {
            this.log(' ' + msg + '\n');
        },
        log: function(msg) {
            this.logger.value += msg;
        }
    }
};
geek.qGroup.init();