Air.Module('direcitve.module', function(require){
  var directive = require('core.directive'),
      node      = require('utility.node'),
      util      = require('utility.util'),
      EVENTS    = require("core.event");

  directive.signup('module', 'ng-module');

  var api = function(target, $scope){
      if(!node(target).hasAttribute(directive.key.module)){
        return;
      }
      var dataPath = target.getAttribute(directive.key.module)
                     .replace(/{{|}}/ig,'');
      // target.value = Air.NS(dataPath, $scope);
      beacon(target).on('input', function(){
        var target = this;
        new Function('$scope','target','$scope.' + dataPath + '= target.value')($scope, target)

        beacon.on(EVENTS.DATA_CHANGE, $scope);
      });

      beacon({target:target, scope:$scope}).on(EVENTS.DATA_CHANGE, function(e, $scope){
        if(this.scope !== $scope) {
          return;
        }
        var value = Air.NS(dataPath, $scope);
        this.target.value = !util.isEmpty(value) ? value : "";
      });
  }
  return api;
})
