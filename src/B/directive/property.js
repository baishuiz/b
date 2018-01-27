Air.Module('B.directive.property', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-property';
  var api = function(target, scopeStructure, watchData) {
    var hasPropertyAttr = node(target).hasAttribute(attribute);
    hasPropertyAttr && setProperty(target, scopeStructure, watchData);
  }

  function setProperty(target, scopeStructure, watchData) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.name;
    var attrNode = target.getAttributeNode(attribute);

    var ruleStr = target.getAttribute(attribute);
    var propertyList = getPropertyList(ruleStr);

    for (var i = 0; i < propertyList.length; i++) {
      var activeProperty = propertyList[i];
      (function(dataPath, name){
        // 设置初始值
        var value = util.getData(dataPath, $scope);
        if (value !== undefined) {
          target[name] = value;
        }
        


        beacon($scope).on(EVENTS.DATA_CHANGE, function(){
          var value = util.getData(dataPath, $scope);
          target[name] = value;
        });

        // var bindPath = '{{' + dataPath + '}}';
          // watchData(bindPath, attrNode, scopeIndex, function() {
          //   var value = util.getData(dataPath, $scope);
          //   target[name] = value;
          // });

      })(activeProperty.dataPath, activeProperty.name);
    }
  }

  function getPropertyList(ruleStr) {
    var reg = /(\w+)\s*:\s*([^,}\s]+)/g
    var result = [];
    ruleStr.replace(reg, function(matchRule, propertyName, dataPath) {
      var item = {
        name: propertyName,
        dataPath: dataPath
      }
      result.push(item);
    })
    return result;
  }



  return api;
});
