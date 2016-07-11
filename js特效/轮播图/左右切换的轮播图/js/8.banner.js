/*
 * 2.关于普通函数改成构造函数的思路
 *  1）把全局变量都变成私有属性--私有属性都在构造函数里
 *  2）把全局函数都变成公有方法--prototype上
 *  3）如果给prototype={}，注意constructor指向
 *  4）init：初始化函数；这里面放的就是函数调用的思路
 *      1.getData
 *      2.bind
 *      3.lazyImg
 *      4.clearInterval(autoTimer);
 *        autoTimer=setInterval(autoMove,interval);
 *      5.bannerTip;
 *      6.移入移出 overOut
 *      7.handleChange
 *      8.leftRight左右按钮切换
 *  5)改this；
* */
function Banner(curEle,ajaxUrl,interval,effect){
    this.oBox=document.getElementById(curEle);
    this.oBoxInner=this.oBox.getElementsByTagName("div")[0];
    this.aDiv=this.oBoxInner.getElementsByTagName("div");
    this.aImg=this.oBoxInner.getElementsByTagName("img");
    this.oUl=this.oBox.getElementsByTagName("ul")[0];
    this.aLi=this.oUl.getElementsByTagName("li");
    this.aBtn=this.oBox.getElementsByTagName("a");
    this.ajaxUrl=ajaxUrl;
    this.interval=interval;
    this.effect=effect;
    this.data=null;
    this.autoTimer=null;
    this.count=0;
    this.init();
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        this.getData();
        this.bind();
        window.setInterval(function(){
            _this.lazyLoad();
        },500);
        window.clearInterval(this.autoTimer);
        this.autoTimer=setInterval(function(){
            _this.autoMove();
        },_this.interval);
        this.mouseMove();
        this.handleChange();
        this.leftRight();
    },
    getData:function (){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open("get",_this.ajaxUrl+"?="+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
        console.log(this.data);
    },
    bind:function (){
        var str1="";  // 进行图片数据绑定
        var str2="";  //  进行焦点即li数据绑定
        for(var i=0;i<this.data.length;i++){
            str1+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            str2+=i===0?'<li class="bg"></li>':'<li></li>';
        }
        str1+='<div><img realImg="'+this.data[0].imgSrc+'" alt=""/></div>';
        this.oBoxInner.innerHTML=str1;
        this.oUl.innerHTML=str2;
        utils.css(this.oBoxInner,"width",utils.css(this.aDiv[0],"width")*this.aDiv.length);
    },
    lazyLoad:function (){
        var _this=this;
        for(var i=0;i<_this.aImg.length;i++){
            var tmpImg=new Image;
            tmpImg.index=i;
            tmpImg.src=_this.aImg[i].getAttribute("realImg");
            tmpImg.onload=function(){
                _this.aImg[this.index].src=this.src;
            }
        }
    },
    autoMove:function (){
        if(this.count>=this.aLi.length){
            this.count=0;
            utils.css(this.oBoxInner,"left",0);
        }
        this.count++;
        myAnimate(this.oBoxInner,{left:-this.count*1000},500,this.effect);
        this.bannerTip();
    },
    bannerTip:function (){
        var tmpCount=this.count===this.aLi.length?0:this.count;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i===tmpCount?"bg":"";
        }
    },
    mouseMove:function (){
        var _this=this;
        _this.oBox.onmouseover=function(){
            window.clearInterval(_this.autoTimer);
            _this.aBtn[0].style.display=_this.aBtn[1].style.display="block";
        };
        _this.oBox.onmouseout=function(){
            _this.autoTimer=setInterval(function(){
                _this.autoMove();
            },2000);
            _this.aBtn[0].style.display=_this.aBtn[1].style.display="none";
        };
    },
    handleChange:function (){
        var _this=this;
        for(var i=0;i<_this.aLi.length;i++){
            (function(index){
                _this.aLi[index].onclick=function(){
                    _this.count=index;
                    myAnimate(_this.oBoxInner,{left:-_this.count*1000},500);
                    _this.bannerTip();
                }
            })(i);
        }
    },
    leftRight:function (){
        var _this=this;
        _this.aBtn[1].onclick=function(){
            _this.autoMove();
        };
        _this.aBtn[0].onclick=function(){
            if(_this.count<=0){
                _this.count=_this.aLi.length;
                utils.css(_this.oBoxInner,"left",-_this.count*1000);
            }
            _this.count--;
            myAnimate(_this.oBoxInner,{left:-_this.count*1000},500);
            _this.bannerTip();
        }
    }
};