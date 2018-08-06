Air.Module('B.util.util', function (require) {
    var nodeUtil = require('B.util.node');
    var Util = (function () {
        function Util() {
        }
        Util.isEmpty = function (obj) {
            if (obj == null) {
                return true;
            }
            var isObject = beacon.utility.isType(obj, 'Object');
            var isArray = beacon.utility.isType(obj, 'Array');
            if (!isObject && !isArray) {
                return false;
            }
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        };
        ;
        Util.enums = function (keys) {
            var result = {};
            for (var i = keys.length - 1; i >= 0; i--) {
                result[keys[i]] = keys[i];
            }
            ;
            return result;
        };
        ;
        Util.getData = function (pathString, root) {
            var rootParent = root.parent;
            var nsPath = pathString.split("."), ns = root || window || {}, root = ns;
            for (var i = 0, len = nsPath.length; i < len; i++) {
                if (!ns || (ns[nsPath[i]] === undefined)) {
                    return rootParent && Util.getData(pathString, rootParent);
                }
                else {
                    ns = ns[nsPath[i]];
                }
            }
            ;
            return ns;
        };
        Util.trim = function (str) {
            str = str || '';
            return str.trim ? str.trim() : str.replace(/^\s+|\s+^/, '');
        };
        ;
        Util.isHTML = function (node) {
            return node ? node.nodeType === nodeUtil.type.HTML : false;
        };
        return Util;
    }());
    ;
    return Util;
});
