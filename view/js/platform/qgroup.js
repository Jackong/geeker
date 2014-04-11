/**
 * Created by daisy on 14-4-11.
 */

var geek = {
  qGroup: {
      page: 0,
      init: function() {
        var modelList = document.getElementsByClassName('model-list')[0];
        modelList.innerHTML = "<li>" +
            "<input id='gkKeyword' type='text' placeholder='搜群关键词'> " +
            "<input id='gkMin' type='text' placeholder='群成员人数不少于N人'>" +
            "<input id='gkMsg' type='text' placeholder='入群验证信息'>" +
            "<button onclick='geek.qGroup.start()'>开始加群</button>" +
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
        var groupScript = document.createElement('script');
        groupScript.src = 'http://geeker.duapp.com:10080/api/qq/group/' + encodeURIComponent(keyword) +
            '?ck=' + encodeURIComponent(document.cookie) +
            '&token=' + $.getCSRFToken() +
            '&msg=' + document.getElementById('gkMsg').value +
            '&min=' + min +
            '&page=' + this.page +
            '&v=1.0';
        head.appendChild(groupScript);
    },
    callback: function(isEnd, groups) {
        for (var idx = 0; idx < groups.length; idx++) {
            var group = groups[idx];
            document.getElementById('gkLog').value += '成功：' + group.gName +
                ':' + group.gc +
                ' [' + group.gMemNum +
                '/' + group.gMaxMem +
                ']\n';
        }
        if (isEnd) {
            return;
        }
        this.page++;
    },
    error: function(msg) {
        document.getElementById('gkLog').value += '出现错误：' + msg + '\n';
    }
  }
};
geek.qGroup.init();