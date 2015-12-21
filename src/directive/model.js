Air.Module('direcitve.model', function(require){
  var directive = require('core.directive'),
      node      = require('utility.node'),
      util      = require('utility.util'),
      EVENTS    = require("core.event");

  // IE8
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }

  directive.signup('model', 'ng-model');

  var api = function(target, $scope){
      if(!node(target).hasAttribute(directive.key.model)){
        return;
      }
      var dataPath = target.getAttribute(directive.key.model)
                     .replace(/{{|}}/ig,'');
      // target.value = Air.NS(dataPath, $scope);
      beacon(target).on('input', function(){
        var target = this;
        new Function('$scope','target','$scope.' + dataPath + '= target.value')($scope, target)

        beacon($scope).on(EVENTS.DATA_CHANGE, $scope);
        // beacon(target).on(EVENTS.DATA_CHANGE, $scope);
      });

      var eventHandle = (function(target){

      })(target);


      beacon($scope).on(EVENTS.DATA_CHANGE, function(e, $scope){

        var value = Air.NS(dataPath, $scope);
        target.value = !util.isEmpty(value) ? value.trim ? value.trim() : value : "";
      });
  }
  return api;
})
