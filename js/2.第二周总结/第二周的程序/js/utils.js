// utils 这个库： 主要提供一些公有的工具方法
var utils = {
    /**
     * listToArray：类数组 转 数组
     * @param arg：类数组
     * @returns {Array}
     */
    listToArray: function listToArray(arg) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(arg);
        } catch (e) {
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i]);
            }
        }
        return ary;
    },
    /**
     * jsonParse :JSON格式的字符串转JSON格式的对象
     * @param str
     * @returns {Object}
     */
    jsonParse: function (str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }
};