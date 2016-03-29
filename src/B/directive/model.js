Air.Module('B.directive.model', function(require){
  var nodeUtil  = require('B.util.node'),
      util      = require('B.util.util'),
      EVENTS    = require("B.event.events");

  var attrName = 'b-model';

  var api = function(target, $scope){
      var activeModel = null;
      if(!nodeUtil(target).hasAttribute(attrName)){
        return;
      }
      var dataPath = target.getAttribute(attrName)
                     .replace(/{{|}}/ig,'');

      beacon(target).on('input', function(){
        var target = this;

        new Function('$scope','target','$scope.' + dataPath + '= target.value.trim()')($scope, target)
        activeModel = true;
        beacon($scope).on(EVENTS.DATA_CHANGE);
        activeModel = false;
      });

      beacon($scope).on(EVENTS.DATA_CHANGE, function(e){
        if(!activeModel){
          var value = util.getData(dataPath, $scope);
          target.value = !util.isEmpty(value) ? (value.trim ? value.trim() : value) : "";
        }
      });
  }
  return api;
})
