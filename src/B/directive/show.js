Air.Module('B.directive.show', function(require){
  var node      = require('B.util.node'),
      EVENTS    = require('B.event.events');

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
      displayStatus ? show(target) : hide(target);
    }
  }

  function show(target){
    target.style.display = 'block';
  }

  function hide(target){
    target.style.display = 'none';
  }

  return api;
});
