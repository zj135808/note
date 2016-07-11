/*
* 渐隐渐现版轮播图
*
* 思路：
* 1）数据获取及解析
* 2）数据绑定，使用字符串拼接的方式进行数据绑定
* 3）数据懒加载
* 4）开启一个定时器，使其进行渐隐渐现的图片轮播，使下一张图片进行显示的原理
*   a）首先提高需要显示图片的层级，即改变图片的index值，并且令其它图片的index值为0
*   b）改变需要显示图片的透明度，是其透明度为1，并且令其它图片的透明度为0
*   c）可以使用move函数使当前显示图片的透明度由0变为1，并且在move函数执行后，调用回调函数，回调函数中
*      可令其它的图片的透明为0
*   d）如果当前图片显示的为最后一张，即count=aDiv.length-1，那么在下一次进行变换前，令count=-1;
* 5）使焦点根据图片进行切换，将焦点与图片可以使用count连接起来
*    count=0时，第一个焦点点亮
*    count=1时，第二个焦点点亮
*    count=2时，第三个焦点点亮
*    count=3时，第四个焦点点亮
* 6）鼠标移入：清除定时器，左右按钮显示
*    鼠标移出：开启定时器，左右按钮隐藏
* 7）点击焦点时进行图片切换
* 8）点击左右按钮进行图片切换
*
* */
(function(){
    var oBox=document.getElementById("box");
    var oBoxInner=oBox.getElementsByTagName("div")[0];
    var aDiv=oBoxInner.getElementsByTagName("div");
    var aImg=oBoxInner.getElementsByTagName("img");
    var oUl=oBox.getElementsByTagName("ul")[0];
    var aLi=oUl.getElementsByTagName("li");
    var aBtnLeft=oBox.getElementsByTagName("a")[0];
    var aBtnRight=oBox.getElementsByTagName("a")[1];
    var data=null;
    var count=0;
    var timer=null;
    var interval=2000;

    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open("get","json/data.txt",false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
    }

    bind();
    function bind(){
        var str1="";
        var str2="";
        for(var i=0;i<data.length;i++){
            str1+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>';
            str2+=i===0?'<li class="bg"></li>':'<li></li>';
        }
        oBoxInner.innerHTML=str1;
        oUl.innerHTML=str2;
        utils.css(aDiv[0],{
            index:1,
            opacity:1
        });
    }

    window.setTimeout(lazyLoad,200);
    function lazyLoad(){
        for(var i=0;i<aImg.length;i++){
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=aImg[index].getAttribute("realImg");
                tmpImg.onload=function(){
                    aImg[index].src=this.src;
                }
            })(i);
        }
    }

    window.clearInterval(timer);
    timer=window.setInterval(autoMove,interval);
    function autoMove(){
        if(count>=aDiv.length-1){
            count=-1;
        }
        count++;
        setBanner();
    }
    function setBanner(){
        for(var i=0;i<aDiv.length;i++){
            var curEle=aDiv[i];
            if(i===count){
                utils.css(curEle,"zIndex",1);
                myAnimate(curEle,{opacity:1},500,function(){
                   var siblings=utils.siblings(this);
                    for(var j=0;j<siblings.length;j++){
                        utils.css(siblings[j],"opacity",0);
                    }
                });
                continue;
            }
            utils.css(curEle,"zIndex",0);
        }
        bannerTip();
    }

    function bannerTip(){
        for(var i=0;i<aLi.length;i++){
         aLi[i].className=i===count?"bg":"";
        }
    }

    mouseMove();
    function mouseMove(){
        oBox.onmouseover=function(){
            window.clearInterval(timer);
            aBtnRight.style.display=aBtnLeft.style.display="block";
        };
        oBox.onmouseout=function(){
            timer=setInterval(autoMove,interval);
            aBtnRight.style.display=aBtnLeft.style.display="none";
        };
    }

    handleChange();
    function handleChange(){
        for(var i=0;i<aLi.length;i++){
            (function(index){
                aLi[index].onclick=function(){
                    count=index;
                    setBanner();
                }
            })(i);
        }
    }

    leftRight();
    function leftRight(){
        aBtnRight.onclick=autoMove;
        aBtnLeft.onclick=function(){
            if(count<=0){
                count=aDiv.length;
            }
            count--;
            setBanner();
        }
    }

})();