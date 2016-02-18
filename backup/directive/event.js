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

    var cmd = target.getAttribute(directive.key.event);

    var cmdList = cmd.split(";")

    for (var i = 0; i < cmdList.length; i++) {
      bind(cmdList[i], i);
    };


    function bind(cmd, eventIndex){
      var eventName = cmd.match(/^\s*(\w+)\s+/)[1];

      beacon(target).on(eventName, function (e){
          //var eventCMD = this.getAttribute(directive.key.event).split(/\s/);
          var cmd = target.getAttribute(directive.key.event);
          var cmdList = cmd.split(";")
          var handleStr = cmdList[eventIndex].replace(eventName,'')
          var eventHandle = handleStr.replace(reg,'').replace(/\s/g,'');
          var eventParam = handleStr.match(reg)[2]
          var params = eval("["+eventParam+"]");
          params.unshift(e);
          this.$index = $scope.$index;
          var scope = $scope.$parentScope || $scope;
          scope.$event[eventHandle].apply(this, params);
          beacon(scope).on(EVENTS.DATA_CHANGE, scope);
      });
    }


  }

  return api;
})
