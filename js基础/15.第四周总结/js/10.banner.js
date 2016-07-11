function Banner(idName,interval){
    this.oBox=document.getElementById(idName);
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBoxInner.getElementsByTagName('div');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oBox.getElementsByTagName('li');
    this.oBtnLeft=this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight=this.oBox.getElementsByTagName('a')[1];
    this.autoTimer=null;
    this.step=0;
    this.interval=interval||1000;
    this.init();//初始化函数init中都是函数调用的思路
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        //获取数据
        this.getData();
        //绑定数据
        this.bind();
        //延迟加载
        this.lazyImg();
        //自动轮播
        clearInterval(this.autoTimer);
        this.autoTimer=setInterval(function(){
            _this.autoMove();//焦点轮播在autoMove里的setBanner里调用
        },this.interval);
        //鼠标移入移出
        this.overOut();
        //点击焦点切换
        this.handleChange();
        //左右按钮切换
        this.leftRight();
    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt?='+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send()
    },
    bind:function(){
        var str1='';
        var str2='';
        for(var i=0; i<this.data.length; i++){
            str1+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            str2+=i==0?'<li class="bg"></li>':'<li></li>';
        }
        this.oBoxInner.innerHTML=str1;
        this.oUl.innerHTML=str2;
    },
    lazyImg:function (){
        var _this=this;
        for(var i=0; i<this.aImg.length; i++){
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=_this.aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                    _this.aImg[index].src=this.src;
                    utils.css(_this.aDiv[0],'zIndex',1);
                    myAnimate(_this.aDiv[0],{opacity:1},500);
                }

            })(i);
        }
    },
    autoMove:function(){
        if(this.step>=this.aDiv.length-1){
            this.step=-1;
        }
        this.step++;
        this.setBanner();
    },
    setBanner:function(){
        for(var i=0; i<this.aDiv.length; i++){
            var curEle=this.aDiv[i];
            if(i===this.step){
                utils.css(curEle,'zIndex',1);
                myAnimate(curEle,{opacity:1},500,function(){
                    var siblings=utils.siblings(this);
                    for(var j=0; j<siblings.length; j++){
                        utils.css(siblings[j],'opacity',0)
                    }
                })
            }else{
                utils.css(curEle,'zIndex',0);
            }
        }
        this.bannerTip();
    },
    bannerTip:function(){
        for(var i=0; i<this.aLi.length; i++){
            this.aLi[i].className=i===this.step?'bg':'';
        }
    },
    overOut:function(){
        var _this=this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.autoTimer);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display='block';
        };
        this.oBox.onmouseout=function(){
            _this.autoTimer=setInterval(function(){
                _this.autoMove();
            },_this.interval);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display='none';
        }
    },
    handleChange:function(){
        var _this=this;
        for(var i=0; i<this.aLi.length; i++){
            (function(index){
                _this.aLi[index].onclick=function(){
                    _this.step=index;
                    _this.setBanner();
                }
            })(i);
        }
    },
    leftRight:function(){
        var _this=this;
        this.oBtnRight.onclick=function(){
            _this.autoMove();
        };
        this.oBtnLeft.onclick=function(){
            if(_this.step<=0){
                _this.step=_this.aDiv.length;
            }
            _this.step--;
            _this.setBanner();
        }
    }
};