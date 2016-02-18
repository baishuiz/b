Air.Module('direcitve.model', function(require){
  var directive = require('core.directive'),
      node      = require('utility.node'),
      util      = require('utility.util'),
      EVENTS    = require("core.event");

  directive.signup('model', 'ng-model');

  var api = function(target, $scope){
      var activeModel = null;
      if(!node(target).hasAttribute(directive.key.model)){
        return;
      }
      var dataPath = target.getAttribute(directive.key.model)
                     .replace(/{{|}}/ig,'');
      // target.value = Air.NS(dataPath, $scope);
      beacon(target).on('input', function(){
        var target = this;
        // target.value = target.value.trim();
        new Function('$scope','target','$scope.' + dataPath + '= target.value.trim()')($scope, target)
        activeModel = true;
        beacon($scope).on(EVENTS.DATA_CHANGE);
        activeModel = false;
        // beacon(target).on(EVENTS.DATA_CHANGE, $scope);
      });

      var eventHandle = (function(target){

      })(target);


      beacon($scope).on(EVENTS.DATA_CHANGE, function(e){
        if(!activeModel){
          var value = Air.NS(dataPath, $scope);
          target.value = !util.isEmpty(value) ? (value.trim ? value.trim() : value) : "";
        }
      });
  }
  return api;
})
