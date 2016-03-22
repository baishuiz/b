Air.Module('B.util.util', function() {
  var util = {
    isEmpty: function(obj) {
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
    },

    enums: function(keys) {
      var result = {};
      for (var i = keys.length - 1; i >= 0; i--) {
        result[keys[i]] = keys[i];
      };
      return result;
    }
  };
  return util;
});
