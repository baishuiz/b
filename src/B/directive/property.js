Air.Module('B.directive.property', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-property';
  var api = function(target, $scope) {
    var hasPropertyAttr = node(target).hasAttribute(attribute);
    hasPropertyAttr && setProperty(target, $scope);
  }

  function setProperty(target, $scope){
    var ruleStr = target.getAttribute(attribute);
    var propertyList = getPropertyList(ruleStr);
    for (var i = 0; i < propertyList.length; i++) {
      var activeProperty = propertyList[i];
      bindValue(activeProperty, target, $scope);
    }
  }

  function bindValue(activeProperty, target, $scope){
    beacon($scope).on(EVENTS.DATA_CHANGE, function(){
      var value = util.getData(activeProperty.dataPath, $scope);
      target[activeProperty.name] = value;
    });
  }

   function getPropertyList(ruleStr){
     var reg = /(\w+)\s*:\s*(\S+?\b)/g
     var result = [];
     ruleStr.replace(reg, function(matchRule, propertyName, dataPath){
       var item = {
         name : propertyName,
         dataPath : dataPath
       }
       result.push(item);
     })
     return result;
   }



  return api;
});
