$(function(){
    var $win=$(window);
    var timer=null;
    var $aBtn=$("input").eq(0);
    var flag=false;
    console.log($aBtn);

    // 给浏览器绑定滚轮事件
    $win.on("scroll",computedDisplay);
    function computedDisplay(){
        if(flag){
            window.clearInterval(timer);
        }
        flag=true;
        if($win.scrollTop()>=$win.height()){
            // 令toTop的按钮显示
            $aBtn.css("display","block");
        }else{
            // 令toTop的按钮隐藏
            $aBtn.css("display","none");
        }
    }

    $aBtn.click(function(){
        var target=$win.scrollTop();
        var duration=2000;
        var interval=100;
        var step=target/duration*interval;
        timer=window.setInterval(function(){
            flag=false;
            target-=step;
            if(target<=0){
                window.clearInterval(timer);
                return;
            }
            $win.scrollTop(target);
        },interval);
    })
});