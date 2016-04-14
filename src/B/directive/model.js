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

      function onInput(e){
        var target = this;
        new Function('$scope','target','$scope.' + dataPath + '= target.value')($scope, target)
        // activeModel = true;
        // beacon($scope).on(EVENTS.DATA_CHANGE, {fromBModel:true});
        // activeModel = false;

        var removedEvent = e.type === 'input' ? 'change' : 'input';
        beacon(target).off(removedEvent, onInput);
      }

      beacon(target).on('input', onInput);
      beacon(target).on('change', onInput);

      // beacon($scope).on(EVENTS.DATA_CHANGE, modelChangeHandle);
      $scope.listenDataChange(dataPath, modelChangeHandle)
      function modelChangeHandle(){
        var value = util.getData(dataPath, $scope);
        if(target.value === value){return};
        var result = !util.isEmpty(value) ? value : "";

        if(target.value !== value) {
         target.defaultValue = result;
         target.value = result;
        }
      }
  }
  return api;
})
