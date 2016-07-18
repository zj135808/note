/**
 * Created by jie on 2016/6/28.
 */
var utils = (function () {
    var flag = "getComputedStyle" in window;
    function rnd(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            n = n + m;
            m = n - m;
            n = n - m;
        }
        return Math.round(Math.random() * (m - n) + n);
    }
    function listToArray(likeAry) {
        var ary = [];
        if (flag) {
            return Array.prototype.slice.call(likeAry);
        }
        for (var i = 0; i < likeAry.length; i++) {
            ary.push(likeAry[i]);
        }
        return ary;
    }
    function jsonParse(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }
    function win(attr, value) {
        if (typeof  value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = document.body[attr] = value;
    }
    function offset(curEle) {
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        var par = curEle.offsetParent;
        while (par) {
            if (navigator.userAgent.indexOf("MSIE 8") === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }
    function getByClass(strClass, curEle) {
        curEle = curEle || document;
        if ("getComputedStyle" in window) {
            return Array.prototype.slice.call(curEle.getElementsByClassName(strClass));
        }
        var aryClass = strClass.replace(/(^ +)|( +$)/g, "").split(/\s+/g);
        var nodeList = curEle.getElementsByTagName("*");
        var ary = [];
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var bOk = true;
            for (var k = 0; k < aryClass.length; k++) {
                var curClass = aryClass[k];
                var reg = new RegExp('(^| +)' + curClass + '( +|$)');
                if (!reg.test(curNode.className)) {
                    bOk = false;
                    break;
                }
            }
            if (bOk) {
                ary[ary.length] = curNode;
            }
        }
        return ary;
    }
    function hasClass(curEle, cName) {
        cName = cName.replace(/(^ +)|( +$)/g, "");
        var reg = new RegExp("\\b" + cName + "\\b");
        return reg.test(curEle.className);
    }
    function addClass(curEle, strClass) {
        var ary = strClass.replace(/(^ +)|( +$)/g, "").split(/\s+/g);
        for (var i = 0; i < ary.length; i++) {
            var curClass = ary[i];
            if (!this.hasClass(curEle, curClass)) {
                curEle.className += " " + curClass
            }
        }
    }
    function removeClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, "").split(/\s+/);
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            var reg = new RegExp("(^| +)" + curClass + "( +|$)");
            if (this.hasClass(curEle, curClass)) {
                curEle.className = curEle.className.replace(reg, " ").replace(/(^ +)|( +$)/g, "");
            }
        }
    }
    function getCss(curEle, attr) {
        var value, reg;
        if (flag) {
            value = window.getComputedStyle(curEle, false)[attr];
        } else {
            if (attr === "opacity") {
                value = curEle.currentStyle.filter;
                reg = /^alpha\(opacity[=:](\d+)\)$/gi;
                return reg.test(value) ? RegExp.$1 / 100 : 1;
            } else {
                value = curEle.currentStyle[attr];
            }
        }
        reg = /^([+-])?\d+(\.\d+)?(px|pt|rem|em)$/;
        return reg.test(value) ? parseFloat(value) : value;
    }
    function setCss(curEle, attr, value) {
        if (attr === "float") {
            curEle.style.styleFloat = value;
            curEle.style.cssFloat = value;
            return;
        }
        if (attr === "opacity") {
            curEle.style.opacity = value;
            curEle.style.filter = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /(width|height|top|bottom|right|left|((margin|padding)-(top|right|bottom|laft)?))/;
        if (reg.test(attr)) {
            value = parseFloat(value) + "px";
        }
        curEle.style[attr] = value;
    }
    function setGroupCss(curEle, options) {
        for (var attr in options) {
            this.setCss(curEle, attr, options[attr]);
        }
    }
    function css(curEle) {
        var arg2 = arguments[1];
        if (typeof  arg2 === "string") {  // 获取 或 设置
            var arg3 = arguments[2];
            if (typeof arg3 === "undefined") {
                return this.getCss(curEle, arg2);
            } else {
                this.setCss(curEle, arg2, arg3);
            }
        }
        if (arg2 instanceof Object) {
            this.setGroupCss(curEle, arg2);
        }
    }
    function getChildren(curEle,tag) {
        /*if (flag) {
            return this.listToArray(curEle.children);
        }*/
        var ary = [];
        var nodeList = curEle.childNodes;
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeType === 1) {
                if(typeof  tag !== "undefined"){
                    if(nodeList[i].tagName.toLowerCase()===tag){
                        ary[ary.length]=nodeList[i];
                    }
                }else{
                    ary[ary.length]=nodeList[i];
                }
            }
        }
        return ary;
    }
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var prev = curEle.previousSibling;
        while (prev && prev.nodeType !== 1) {
            prev = prev.previousSibling;
        }
        return prev;
    }
    function prevAll(curELe) {
        var ary = [];
        var prev = this.prev(curELe);
        while (prev) {
            ary.unshift(prev);
            prev = this.prev(prev);
        }
        return ary;
    }
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var next = curEle.nextSibling;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    }
    function nextAll(curEle) {
        var ary = [];
        var nextEle = this.next(curEle);
        while (nextEle) {
            ary.unshift(nextEle);
            nextEle = this.next(nextEle);
        }
        return ary;
    }
    function sibling(curEle) {
        var preEle = this.prev(curEle);
        var nextEle = this.next(curEle);
        var ary = [];
        if (preEle) ary.push(preEle);
        if (nextEle) ary.push(nextEle);
        return ary;
    }
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }
    function firstChild(curEle) {
        return this.getChildren(curEle)[0];
    }
    function lastChild(curEle) {
        var childs = this.getChildren(curEle);
        return childs[childs.length - 1];
    }
    function index(curEle) {
        return this.prevAll(curEle).length;
    }
    function appendChild(parent, newEle) {
        parent.appendChild(newEle);
    }
    function prependChild(parent, newEle) {
        var firstChild = this.firstChild(parent);
        if (firstChild) {
            parent.insertBefore(newEle, firstChild);
        } else {
            parent.appendChild(newEle);
        }
    }
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }
    function insertAfter(newEle,oldEle) {
        var nextEle=this.next(oldEle);
        if(nextEle){
            oldEle.parentNode.insertBefore(newEle,nextEle);
        }else{
            oldEle.parentNode.appendChild(newEle);
        }

    }
    return {
        // rnd 兼容版的求一定范围的随机数 n，m
        rnd: rnd,
        // 类数组转数组
        listToArray: listToArray,
        // json格式字符串转json对象
        jsonParse: jsonParse,
        // 获取浏览器的属性，兼容版
        win: win,
        // 获取某个元素距离body的左距离和上距离
        offset: offset,
        // 通过class名获取元素，getElementsByClassName兼容版
        getByClass: getByClass,
        // 判断一个元素中是否有传递的class名
        hasClass: hasClass ,
        // 给某个元素添加class名，可以传递字符串
        addClass: addClass,
        // removeClass：删除某个元素的class名
        removeClass: removeClass,
        // 获取某个css属性的值
        getCss: getCss,
        // setCss:设置样式
        setCss: setCss,
        // 给某个元素设置一组的属性
        setGroupCss: setGroupCss,
        // css方法集合
        css: css,
        //getChildren  获取当前元素下的所有子元素
        getChildren: getChildren,
        // prev  获取上一个哥哥元素节点
        prev: prev,
        // prevAll 获取当前元素的所有哥哥元素节点
        prevAll: prevAll,
        // next 获取下一个弟弟元素节点
        next: next,
        //nextAll 获取所有的弟弟元素节点
        nextAll: nextAll,
        // sibling 获取当前元素的相邻元素，包括哥哥节点和弟弟节点
        sibling: sibling,
        // siblings 获取当前元素的兄弟节点，所有的哥哥元素节点+所有的弟弟元素节点
        siblings: siblings,
        // firstChild 当前元素的第一个子元素
        firstChild: firstChild,
        // lastChild 当前元素的最后一个子元素
        lastChild: lastChild,
        // index  获取当前元素的索引
        index: index,
        //appendChild  把新元素插入到当前容器的最后面
        appendChild: appendChild,
        //prependChild  把新元素插入到当前容器的最开始
        prependChild: prependChild,
        // insertBefore   将newEle插入到oldEle的前面
        insertBefore: insertBefore,
        //insertAfter 把新元素插入到指定元素弟弟元素的前面
        insertAfter: insertAfter
    }
})();