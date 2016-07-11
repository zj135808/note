$(function(){
    var $box=$("#box");
    var $boxInner=$box.children(".banner").eq(0);
    var $aDiv=null;
    var $aImg=null;
    var $oUl=$box.find("ul").eq(0);
    var $aLi=null;
    var $aBtnL=$box.children(".left");
    var $aBtnR=$(".right");
    var data=null;
    var autoTimer=null;
    var interval=2000;
    var count=0;

    // 数据获取即解析
    getData();
    function getData(){
        $.ajax({
            url:"json/data.txt",
            type:"get",
            async:false,
            dataType:"json",
            success:function(val){
                data=val;
            }
        });
        console.log(data);
    }

    // 数据绑定
    bind();
    function bind(){
        var str1="";
        var str2="";
        $.each($(data),function(index,item){
            str1+='<div><img realImg="'+item.imgSrc+'" alt=""/></div>';
            str2+=index===0?'<li class="bg"></li>':'<li></li>';
        });
        $boxInner.html(str1);
        $oUl.html(str2);
    }

    $aDiv=$boxInner.children();
    $aImg=$box.find("img");
    $aLi=$oUl.children();

    // 图片加载
    lazyLoad();
    function lazyLoad(){
        $.each($aImg,function(index,item){
            var tmpImg=new Image;
            tmpImg.src=$(item).attr("realImg");
            tmpImg.onload=function(){
                $(item).attr("src",this.src);
                $div0=$aDiv.eq(0);
                $div0.css("zIndex",1);
                $div0.stop().animate({opacity:1},500);
            }
        })
    }

    //令图片进行轮播
    window.clearInterval(autoTimer);
    autoTimer=window.setInterval(autoMove,interval);
    function autoMove(){
        if(count>=$aDiv.length-1){
            count=-1;
        }
        count++;
        setBanner();
    }
    function setBanner(){
        $.each($aDiv,function(index,item){
           if(index===count){
               $(item).css("zIndex",1);
               $(item).stop().animate({opacity:1},500,function(){
                   $(this).siblings().css("opacity",0);
               })
           }else{
               $(item).css("zIndex",0);
           }
        });
        bannerTip()
    }

    // 焦点变化
    function bannerTip(){
        $.each($aLi,function(index,item){
            /*item.className=index===count?"bg":"";*/
            index===count?$(item).addClass("bg"):$(item).removeClass("bg");
        })
    }

    // 鼠标移入，轮播停止，移出，轮播继续
    mouseMove();
    function mouseMove(){
        $box.mouseover(function(){
            window.clearInterval(autoTimer);
            $aBtnL.css("display","block");
            $aBtnR.css("display","block");
        });
        $box.mouseout(function(){
            autoTimer=window.setInterval(autoMove,interval);
            $aBtnL.css("display","none");
            $aBtnR.css("display","none");
        })
    }

    // 点击焦点进行切换
    handleChange();
    function handleChange(){
        $.each($aLi,function(index,item){
            $(item).click(function(){
                count=index;
                setBanner();
            })
        })
    }

    // 点击左右按钮进行切花
    leftRight();
    function leftRight(){
        $aBtnR.click(function(){
            autoMove();
        });
        $aBtnL.click(function(){
            if(count<=0){
                count=$aLi.length;
            }
           count--;
            setBanner();
        });
    }

});