(function () {
    var roles = [], // 游戏玩家
        total, // 游戏玩家人数
        num, // 动作玩家人数
        count = 0; // 一盘游戏的回合次数

    // 事件绑定
    $('#btn-start').click(function () {
        nextScene(0, 1, 1000);
    });

    $('#num-okay').click(function () {

        var $insertPlace = $('#name-okay'),
            $input_role;

        total = num = parseInt($('#role-num').val());

        if (!num) {
            alert('不要乱搞！！');
            return;
        } else if (num > 8) {
            alert('不要乱搞！！哪来那么多人');
            return;
        } else if (num === 1) {
            alert('不要乱搞！！你自己跟自己玩啊');
            return;
        }

        for (var i = 0; i < num; i++) {
            $input_role = $('<div><label class="tip">角色' + (i + 1) + '</label><input class="input role' + (i + 1) + '"></div>');
            $input_role.insertBefore($insertPlace);
        }

        nextScene(1, 2);
    });

    $('#name-okay').click(function () {

        var role,
            $trForLiving,
            $trForRecord;

        for (var j = 0; j < num; j++) {

            var checkName = $('.role' + (j + 1)).val();

            if (!checkName) {
                alert('不要乱搞，有无名氏');
                return;
            }
        }

        for (var i = 0; i < num; i++) {

            var name = $('.role' + (i + 1)).val();

            role = {};
            role.name = name; // 玩家名称
            role.index = i; // 玩家索引
            role.winTimes = 0; // 获胜次数
            role.living = 1; // 1表示活着，0表示阵亡

            roles.push(role);

            // 初始化记录列表
            $trForRecord = $('<tr><td>' + name + '</td><td>0</td><td>0%</td></tr>');
            $trForRecord.appendTo($('.data'));

            // 初始化玩家列表
            $trForLiving = $('<tr><td>' + name + '</td><td><span class="remove-role" data-index="' + i + '">&times;</span></td></tr>')
            $trForLiving.appendTo($('.role-info'));
        }

        nextScene(2, 3);
        doCount(doSort);
    });

    $('.scene2').on('change', 'input', function () {

        var $currentInput = $(this),
            $inputs = $(this).parent().siblings().find('input'),
            value = $(this).val();

        $inputs.each(function () {
            if (value === $(this).val() && value!== '') {
                alert('搞事情，名字不能相同');
                $currentInput.val('');
            }
        });
    });

    $('#next').click(function () {
        doCount(decideWinner);
    });

    $('.sort').click(function () {
       doCount(doSort);
    });

    $('#show-record').click(function () {
        $('.record').show(1000);
        return false;
    });

    $('.record').click(function () {
        $(this).hide(1000);
    });

    $('body').on('keydown', function () {
        var keyCode = event.keyCode;
        if ($('.scene3').css('display')!=='none'){
            if (keyCode === 13 || keyCode === 40 || keyCode === 32) {
                $('.next').click();
            }
        }else if($('.scene1').css('display')!=='none'){
            if (keyCode === 13 || keyCode === 40 || keyCode === 32) {
                $('#num-okay').click();
            }
        }else if($('.scene0').css('display')!=='none'){
            if (keyCode === 13 || keyCode === 40 || keyCode === 32) {
                $('#btn-start').click();
            }
        }
    });

    $('.restart').click(function () {

        var $recordTr;

        // 初始化角色状态
        roles.forEach(function (item) {
            item.winTimes = 0;
            item.living = 1;
        });

        num = total; // 活动人数为总人数
        count = 0; // 初始化回合次数

        // 初始化记录表格
        for (var i = 0; i < total; i++) {
            $recordTr = $('.data').find('tr').eq(i);
            $recordTr.find('td').eq(1).text(0);
            $recordTr.find('td').eq(2).text('0%');
        }

        $('.win').empty(); // 初始化胜者记录
        $('.role-info tr').css({'opacity': '1'}); // 初始化玩家名单

        doCount(doSort);
    });

    $('.role-info').on('click', '.remove-role', function () {
        var $tr = $(this).parent().parent(),
            index = $(this).data('index'),
            deadRole = roles[index];

        $tr.css({'opacity': 0.2});

        deadRole.living = 0;
        num--;

        console.log('num:' + num);

        if (num === 1) {
            alert('游戏结束');
            $('.restart').click();
        }
    });

    // 倒计时动画函数
    function doCount(callback) {

        var $counter = $('.counter'), //计数板
            $countDivs = $counter.find('div'),
            $div1 = $countDivs.eq(0),
            $div2 = $countDivs.eq(1),
            $div3 = $countDivs.eq(2);

        count++;

        $('.win').empty();

        $div1.fadeIn(200, function () {
            $div1.fadeOut(100);
            $div2.fadeIn(200, function () {
                $div2.fadeOut(100);
                $div3.fadeIn(200, function () {
                    $div3.fadeOut(100);
                    callback();
                })
            })
        })
    }

    // 决定获胜者的算法
    function decideWinner() {

        var winnerAmount = 0,
            candidates = [],
            winnerNames = [],
            winnerNum;

        while (winnerAmount >= num || winnerAmount <= 0) {
            winnerAmount = Math.floor(Math.random() * 10);
        }

        for (var i = 0; i < total; i++) {
            if (roles[i].living === 1) {
                candidates.push({index: i, value: Math.random()})
            }
        }

        candidates.sort(function (a, b) {
            return a.value - b.value;
        });

        candidates.reverse();

        console.log(candidates);

        for (var j = 0; j < winnerAmount; j++) {
            winnerNum = candidates[j].index;
            roles[winnerNum].winTimes++;
            winnerNames.push(roles[winnerNum].name);
        }

        renderByDecide(winnerNames);
        changeRecord();
    }

    function doSort() {
        var candidates = [],
            names = [],
            number;

        for (var i = 0; i < total; i++) {
            if (roles[i].living === 1) {
                candidates.push({index: i, value: Math.random()})
            }
        }

        candidates.sort(function (a, b) {
            return a.value - b.value;
        });

        candidates.reverse();

        for (var j = 0; j < num; j++) {
            number = candidates[j].index;
            names.push(roles[number].name);
        }

        renderByDecide(names);
    }

    // 改变游戏记录
    function changeRecord() {

        var $RecordTr, number;

        for (var i = 0; i < total; i++) {
            if (roles[i].living === 1) {
                $RecordTr = $('.data').find('tr').eq(i);

                $RecordTr.find('td').eq(1).text(roles[i].winTimes); // 填写获胜次数

                number = roles[i].winTimes / count * 100;
                $RecordTr.find('td').eq(2).text(number.toFixed(2) + '%'); // 填写获胜概率
            }
        }
    }

    // 根据决策渲染获胜者
    function renderByDecide(winnerNames) {

        var $win = $('.win');

        $win.empty();

        for (var i = 0; i < winnerNames.length; i++) {
            var $winnerLabel = $('<div class="success">' + winnerNames[i] + '</div>');
            $winnerLabel.appendTo($win);
        }
    }

    // 下一幕
    function nextScene(preNum, nextNum, fadeTime) {

        var time = fadeTime || 300,
            $preScene = $('.scene' + preNum),
            $nextScene = $('.scene' + nextNum);

        $preScene.fadeOut(time, function () {
            $nextScene.fadeIn(time);
        })
    }

})();