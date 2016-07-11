$(function(){
    var $win=$(window);
    var timer=null;
    var $aBtn=$("input").eq(0);
    console.log($aBtn);

    // 给浏览器绑定滚轮事件
    $win.on("scroll",computedDisplay);
    function computedDisplay(){
        if($win.scrollTop()>=$win.height()){
            // 令toTop的按钮显示
            $aBtn.css("display","block");
        }else{
            // 令toTop的按钮隐藏
            $aBtn.css("display","none");
        }
    }

    $aBtn.click(function(){
        $aBtn.css("display","none");
        // 解除滚轮事件
        $win.off("scroll");
        var target=$win.scrollTop();
        var duration=1000;
        var interval=10;
        var step=target/duration*interval;
        timer=window.setInterval(function(){
            target-=step;
            if(target<=0){
                window.clearInterval(timer);
                $win.on("scroll",computedDisplay);
                return
            }
            $win.scrollTop(target);
        },interval);
    })
});