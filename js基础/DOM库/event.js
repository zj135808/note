function bind(curEle,eventType,eventFn){
    if("addEventListener" in curEle){
        curEle.addEventListener(eventType,eventFn,false);
        return;
    }
    var tmpFn=function(){
        eventFn.call(curEle);
    };
    tmpFn.name=eventFn;
    if(!curELe["myBind"+eventType]){
        curELe["myBind"+eventType]=[];
    }
    var ary=curELe["myBind"+eventType];
    for(var i=0;i<ary.length;i++){
        var cur=ary[i];
        if(cur.name===eventFn){
            return;
        }
    }
    ary.push(tmpFn);
    curEle.attachEvent("on"+eventType,tmpFn);
}
function unbind(curEle,eventType,eventFn){
    if("removeEventListener" in curEle){
        curEle.removeEventListener(eventType,eventFn,false);
        return;
    }
    var ary=curEle["myBind"+eventFn];
    for(var i=0;i<ary.length;i++){
        var cur=ary[i];
        if(eventFn===cur.name){
            ary.splice(i,1);
            curEle.detachEvent("on"+eventType,cur);
        }
    }
}
function on(curEle,eventType,eventFn){
    if(!curEle["myEvent"+eventType]){
        curEle["myEvent"+eventType]=[];
    }
    var ary=curEle["myEvent"+eventType];
    for(var i=0;i<ary.length;i++){
        if(ary[i]===eventFn){
            return;
        }
    }
    ary.push(eventFn);
    bind(curEle,eventType,run);
}
function run(e){
    e=e||window.event;
    if(!e.target){
        e.target= e.srcElement;
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
        e.stopPropagation=function(){
            e.cancelBubble=true;
        };
        e.preventDefault=function(){
            e.returnValue=false;
        }
    }
    var ary=this["myEvent"+ e.type];
    for(var i=0;i<ary.length;i++){
        ary[i].call(this,e);
    }
}
function off(curEle,eventType,eventFn){
    var ary=curEle["myEvent"+eventType];
    for(var i=0;i<ary.length;i++){
        if(eventFn===ary[i]){
            ary.splice(i,1);
        }
    }
}