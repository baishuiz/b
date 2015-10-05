Air.Module('direcitve.event', function(require){
  var directive = require('core.directive'),
      node      = require('utility.node'),
      EVENTS    = require("core.event");

  directive.signup('event', 'ng-event');
  var reg = /(\((.*?)\))/;
  var api = function(target, $scope){
    if(!node(target).hasAttribute(directive.key.event)){
      return;
    }

    var eventCMD = target.getAttribute(directive.key.event).split(/\s/);
    var eventName = eventCMD[0];
    var eventHandle = eventCMD[1].replace(reg,'');
    var eventParam = eventCMD[1].match(reg)[2]

    beacon(target).on(eventName, function (){
        $scope.$event[eventHandle].apply(this, eval("["+eventParam+"]"));
        beacon.on(EVENTS.DATA_CHANGE, $scope);
    });

    beacon({target:target, scope:$scope, eventName:eventName, eventHandle:eventHandle})
    .on(EVENTS.DATA_CHANGE, function(e, $scope){
      if(this.scope !== $scope) {
        return;
      }
    });
  }

  return api;
})
