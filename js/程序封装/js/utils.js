/**
 * Created by jie on 2016/6/24.
 */

var utils = {
    listToArray: function listToArray(likeAry) {
        var ary = [];
        try {
            return Array.prototype.slice.call(likeAry);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary.push(likeAry[i]);
            }
        }
        return ary;
    },
    jsonParse: function jsonParse(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }
};