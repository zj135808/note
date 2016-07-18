function Fade_fadeIn(id,ajaxUrl,interval){
    this.$box=$("#"+id);
    this.$boxInner=this.$box.children("div").eq(0);
    this.$aDiv=null;
    this.$aImg=null;
    this.$oUl=this.$box.find("ul").eq(0);
    this.$aLi=null;
    this.$aBtnL=this.$box.children(".left");
    this.$aBtnR=$(".right");
    this.data=null;
    this.autoTimer=null;
    this.interval=interval;
    this.ajaxUrl=ajaxUrl;
    this.count=0;
    this.init();
}
Fade_fadeIn.prototype={
    constructor:Fade_fadeIn,
    init:function(){
        var _this=this;
        this.getData();
        this.bind();
        this.$aDiv=this.$boxInner.children();
        this.$aImg=this.$box.find("img");
        this.$aLi=this.$oUl.children();
        this.lazyLoad();
        window.clearInterval(this.autoTimer);
        this.autoTimer=window.setInterval(function(){
            _this.autoMove();
        },this.interval);
        this.mouseMove();
        this.handleChange();
        this.leftRight();
    },
    getData:function(){
        var _this=this;
        $.ajax({
            url:_this.ajaxUrl,
            type:"get",
            async:false,
            dataType:"json",
            success:function(val){
                _this.data=val;
            }
        });
        console.log(this.data);
    },
    bind:function(){
        var str1="";
        var str2="";
        $.each($(this.data),function(index,item){
            str1+='<div><img realImg="'+item.imgSrc+'" alt=""/></div>';
            str2+=index===0?'<li class="bg"></li>':'<li></li>';
        });
        this.$boxInner.html(str1);
        this.$oUl.html(str2);
    },
    lazyLoad:function(){
        var _this=this;
        $.each(_this.$aImg,function(index,item){
            var tmpImg=new Image;
            tmpImg.src=$(item).attr("realImg");
            tmpImg.onload=function(){
                $(item).attr("src",this.src);
            }
        });
        var $div0=_this.$aDiv.eq(0);
        $div0.css("zIndex",1);
        $div0.stop().animate({opacity:1},500);
    },
    autoMove:function(){
        if(this.count>=this.$aDiv.length-1){
            this.count=-1;
        }
        this.count++;
        this.setBanner();
    },
    setBanner:function(){
        var _this=this;
        $.each(_this.$aDiv,function(index,item){
            if(index===_this.count){
                $(item).css("zIndex",1);
                $(item).stop().animate({opacity:1},500,function(){
                    $(this).siblings().css("opacity",0);
                })
            }else{
                $(item).css("zIndex",0);
            }
        });
        this.bannerTip();
    },
    bannerTip:function(){
        var _this=this;
        $.each(_this.$aLi,function(index,item){
            /*item.className=index===_this.count?"bg":"";*/
            index===_this.count?$(item).addClass("bg"):$(item).removeClass("bg");
        })
    },
    mouseMove:function(){
        var _this=this;
        _this.$box.mouseover(function(){
            window.clearInterval(_this.autoTimer);
            _this.$aBtnL.css("display","block");
            _this.$aBtnR.css("display","block");
        });
        _this.$box.mouseout(function(){
            _this.autoTimer=window.setInterval(function(){
                _this.autoMove();
            },_this.interval);
            _this.$aBtnL.css("display","none");
            _this.$aBtnR.css("display","none");
        })
    },
    handleChange:function(){
        var _this=this;
        $.each(_this.$aLi,function(index,item){
            $(item).click(function(){
                _this.count=index;
                _this.setBanner();
            })
        })
    },
    leftRight:function(){
        var _this=this;
        _this.$aBtnR.click(function(){
            _this.autoMove();
        });
        _this.$aBtnL.click(function(){
            if( _this.count<=0){
                _this.count= _this.$aLi.length;
            }
            _this.count--;
            _this.setBanner();
        });
    }
};