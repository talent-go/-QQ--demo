(function($,root){
    //进度条模块  渲染左右时间  更新进度条
    var duration;
    var frameId;
    var lastPer = 0;
    var startTime;
    function renderAllTime(time){
        duration = time;
        lastPer = 0;
        time = formatime(time);
        $('.all-time').html(time);
    }

    // 处理时间格式的函数
    function formatime(t){
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        m = m < 10? '0'+ m : m;
        s = s < 10? '0'+ s : s;
        return m + ':' + s;
    }

    //渲染左侧时间
    function start(p){
        lastPer = p === undefined ? lastPer : p; 
        startTime = new Date().getTime();

        function frame(){
            var cueTime = new Date().getTime();
            var per =lastPer + (cueTime - startTime) / (duration*1000);
            update(per);
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    // 跟新html
    function update(p){
        if(p >= 0 && p < 1){
            time = p * duration;
            time = formatime(time);
            $('.cur-time').html(time);
            var perX = ( p - 1 )* 100 + '%';
            $('.pro-top').css({
                transform:'translateX('+ perX +')'
            })
        }
        var endTime = $('.all-time').html();
        if(time == endTime){
            $('.next').trigger("click");
        }
    }

    // 停止更新
    function stop(){
        var stopTime = new Date().getTime();
        lastPer =lastPer + (stopTime - startTime)  /(duration * 1000);
        cancelAnimationFrame(frameId);
    }
    root.pro = {
        renderAllTime:renderAllTime,
        start:start,
        stop:stop,
        update:update,
    }
})(window.Zepto,window.player || (window.player = {}))