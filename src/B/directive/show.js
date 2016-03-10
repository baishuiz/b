Air.Module('B.directive.show', function(require){
  var node      = require('B.util.node'),
      EVENTS    = require('B.event.events'),
      util      = require('B.util.util');

  var attribute = 'b-show';
  var api = function(target, $scope){
    var isShowElement = node(target).hasAttribute(attribute);
    isShowElement && processShowElement(target, $scope);
  }

  function processShowElement(target, $scope){
    beacon($scope).on(EVENTS.DATA_CHANGE, watchElement);
    function watchElement(){
      var dataPath = target.getAttribute(attribute);
      var displayStatus = Air.NS(dataPath, $scope);
      displayStatus = util.isEmpty(displayStatus) ? false : displayStatus;
      displayStatus ? show(target) : hide(target);
    }
  }

  function show(target){
    // TODO 判断display值
    target.style.display = 'block';
  }

  function hide(target){
    target.style.display = 'none';
  }

  return api;
});
