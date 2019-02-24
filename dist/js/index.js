var root = window.player;
var dataList = [];
var len;
var audio = root.audioManager;
var control;
var timer;

function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        success:function(data){
            // console.log(data);
            dataList = data;
            len = data.length;
            control = new root.controlIndex(len);
            bindEvent();
            bindTouch();
            root.playList.renderList(data);
            $('body').trigger('play:change',0)
        },
        error:function(){
            console.log("error");
        }
    })
}

function bindTouch(){
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    $('.slider').on('touchstart',function(){
        root.pro.stop();
    }).on('touchmove',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >= 0 && per <= 1){
            root.pro.update(per);
        }
    }).on('touchend',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >= 0 && per <= 1){
            // console.log(control);
            var duration = dataList[control.index].duration;
            var curTime = per * duration;
            // 跳转到歌曲时间
            audio.playTo(curTime);
            // 标记当前音乐为播放
            $('.play').addClass('playing');
            audio.status = 'play';

            root.pro.start(per);
        }
    })
};

function bindEvent (){
    $('body').on('play:change',function(e,index){
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        if(audio.status == 'play'){
            audio.play();
            root.pro.start();
            rotated(0);
        }
        root.pro.renderAllTime(dataList[index].duration);
    })
    $('.prev').on('click',function(){
        var i = control.prev();
        $('body').trigger('play:change',i)
        if(audio.status == 'play'){
            root.pro.start(0);
        }else{
            root.pro.update(0);
        }
        // audio.getAudio(dataList[i].audio);
        // root.render(dataList[i]);
        // if(audio.status == 'play'){
        //     audio.play();
        // }
    });
    $('.next').on('click',function(){
        var i = control.next();
        $('body').trigger('play:change',i)
        if(audio.status == 'play'){
            root.pro.start(0);
        }else{
            root.pro.update(0);
        }
        // audio.getAudio(dataList[i].audio);
        // root.render(dataList[i]);
        // if(audio.status == 'play'){
        //     audio.play();
        // }
    });

    $('.play').on('click',function(){
        // console.log(audio);
        if(audio.status == 'pause'){
            audio.play();
            var deg = Number($('.img-box').attr('data-deg'));
            root.pro.start();
            rotated(deg);
        }else{
            audio.pause();
            root.pro.stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    });

    $('.list').on('click',function(){
        root.playList.show(control);
    })

}

function rotated(deg){
    clearInterval(timer);
    timer = setInterval(function(){
        deg += 0.2;
        $('.img-box').attr('data-deg',deg)
        $('.img-box').css({
            'transform':'rotateZ('+ deg + 'deg)',
            'transtion':'all 1s ease-in',
        })
    },20)
}
getData("../mock/data.json");  

// 信息加图片渲染到页面上；
// 点击按钮
// 播放 暂停  切歌
// 进度条的运动与拖拽
// 图片旋转
// 列表切歌