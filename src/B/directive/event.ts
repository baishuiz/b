Air.Module('B.directive.event', function(require:any){
  var node      = require('B.util.node'),
      EVENTS    = require('B.event.events');

  // window.statsEvents || (window.statsEvents = {});
  // statsEvents.USER_ACTION = EVENTS.USER_ACTION;

  var attribute = 'b-event';
  // var reg = /(\((.*?)\))/;
  var reg = /\((.*)\)/;
  var api = function(target:any, $scope:any){
    if(!node(target).hasAttribute(attribute)){
      return;
    }

    var cmd = target.getAttribute(attribute);
    var cmdList = cmd.split(";")

    for (var i = 0; i < cmdList.length; i++) {
      bind(cmdList[i], i);
    };

    function getParentScope($scope:any) {
      // if ($scope.parent) {
      //   return getParentScope($scope.parent);
      // }
      return $scope;
    }

    function bind(cmd:any, eventIndex:any){
      var eventName = cmd.match(/^\s*(\w+)\s+/)[1];

      beacon(target).on(eventName, function (e:any){
        var cmd = target.getAttribute(attribute);
        var cmdList = cmd.split(";")
        var handleStr = cmdList[eventIndex].replace(eventName,'')
        var eventHandleName = handleStr.replace(reg,'').replace(/\s/g,'');
        var eventParam = handleStr.match(reg)[1]
        var params = eval("["+eventParam+"]");
        params.unshift(e);
        this.$index = $scope.$index;

        var scope = getParentScope($scope);
        var eventHandle = ($scope.$event && $scope.$event[eventHandleName]) ||
                          (scope.$event && scope.$event[eventHandleName]);
        eventHandle && eventHandle.apply(this, params);
        beacon(scope).on(EVENTS.DATA_CHANGE, scope);

        // 触发采集埋点数据事件
        // var viewName = getViewName(target);
        // beacon.on(statsEvents.USER_ACTION, [location.href, eventHandleName, viewName]);
      });
    }

    // function getViewName(target) {
    //   if (!target.parentElement) {
    //     return '';
    //   } else if (target.parentElement.nodeName === 'VIEW'){
    //     return target.parentElement.getAttribute('name');
    //   } else {
    //     return getViewName(target.parentElement);
    //   }
    // }

  };

  return api;
})
