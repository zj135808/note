/*
* 完整版轮播图实现思路
*
* 1、首先需要获取数据
* 2、绑定数据，这里采用的绑定方式为字符串拼接
* 3、进行图片懒加载
* 4、实现图片自动播放：多创建了一张图片，那么此时图片的顺序为 1 2 3 4 1
*   在轮播完第四张图片之后，再令最后的 1 进行运动，运动结束瞬间改变oBoxInner的left值为0
*   之后再进行轮播
* 5、改变焦点的颜色，我们已经通过设置一个全局的变量count来实现图片的轮播，这里颜色的改变
*    可以通过count的值来进行判断，当count为1时，第1个焦点有颜色，当count为2时，第3个
*    焦点有颜色，当count为3时，第4个焦点有颜色，当count为4时，第0个焦点有颜色
* 6、实现鼠标移入，幻灯片停止轮播，并且显示左右按钮；鼠标移出，幻灯片开始轮播，隐藏左右
*    按钮
* 7、点击焦点进行图片切换，这里切换时还是需要通过控制count的值来实现图片的切换,
*   核心思想：点击每个按钮的时候，把这个按钮的索引做为step，用过step去运动改变left
* 8、点击左右实现图图片切换，如果是点击右边，那么可以直接调用autoMove函数，如果点击
*    左边，那么需要让count--，如果此时count==0，那么瞬间改变oBoxInner的left值为
*    aLi.length，此时就相当于瞬间跳转到最后一张和第一章一样的图片上
*
* */
(function(){
    var oBox=document.getElementById("box");
    var oBoxInner=oBox.getElementsByTagName("div")[0];
    var aDiv=oBoxInner.getElementsByTagName("div");
    var aImg=oBoxInner.getElementsByTagName("img");
    var oUl=oBox.getElementsByTagName("ul")[0];
    var aLi=oUl.getElementsByTagName("li");
    var aBtn=oBox.getElementsByTagName("a");
    var data=null;
    var autoTimer=null;
    var count=0;

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
        var str1="";  // 进行图片数据绑定
        var str2="";  //  进行焦点即li数据绑定
        for(var i=0;i<data.length;i++){
            str1+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>';
            str2+=i===0?'<li class="bg"></li>':'<li></li>';
        }
        str1+='<div><img realImg="'+data[0].imgSrc+'" alt=""/></div>';
        oBoxInner.innerHTML=str1;
        oUl.innerHTML=str2;
        utils.css(oBoxInner,"width",utils.css(aDiv[0],"width")*aDiv.length);
    }

    window.setInterval(lazyLoad,500);
    function lazyLoad(){
        for(var i=0;i<aImg.length;i++){
            var tmpImg=new Image;
            tmpImg.index=i;
            tmpImg.src=aImg[i].getAttribute("realImg");
            tmpImg.onload=function(){
                aImg[this.index].src=this.src;
            }
        }
    }

    window.clearInterval(autoTimer);
    autoTimer=setInterval(autoMove,2000);
    function autoMove(){
        if(count>=aLi.length){
            count=0;
            utils.css(oBoxInner,"left",0);
        }
        count++;
        myAnimate(oBoxInner,{left:-count*1000},500);
        bannerTip();
    }

    function bannerTip(){
        var tmpCount=count===aLi.length?0:count;
        for(var i=0;i<aLi.length;i++){
            aLi[i].className=i===tmpCount?"bg":"";
        }
    }

    mouseMove();
    function mouseMove(){
        oBox.onmouseover=function(){
            window.clearInterval(autoTimer);
            aBtn[0].style.display=aBtn[1].style.display="block";
        };
        oBox.onmouseout=function(){
            autoTimer=setInterval(autoMove,2000);
            aBtn[0].style.display=aBtn[1].style.display="none";
        };
    }

    handleChange();
    function handleChange(){
        for(var i=0;i<aLi.length;i++){
            (function(index){
                aLi[index].onclick=function(){
                    count=index;
                    myAnimate(oBoxInner,{left:-count*1000},500);
                    bannerTip();
                }
            })(i);
        }
    }

    leftRight();
    function leftRight(){
        aBtn[1].onclick=autoMove;
        aBtn[0].onclick=function(){
            if(count<=0){
                count=aLi.length;
                utils.css(oBoxInner,"left",-count*1000);
            }
            count--;
            myAnimate(oBoxInner,{left:-count*1000},500);
            bannerTip();
        }
    }

})();
