Air.Module('B.directive.model', function(require){
  var nodeUtil  = require('B.util.node'),
      util      = require('B.util.util'),
      EVENTS    = require("B.event.events");

  var attrName = 'b-model';
  var api = function(target, scopeStructure, watchData){
      var $scope = scopeStructure.scope;
      var scopeIndex = scopeStructure.name;
      var activeModel = null;
      if(!nodeUtil(target).hasAttribute(attrName)){
        return;
      }
      var attrNode = target.getAttributeNode(attrName);
      var dataPath = target.getAttribute(attrName)
                     .replace(/{{|}}/ig,'');

      function onInput(e){
        var target = this;
        var value = target.type==='checkbox' ?  target.checked : target.value;
        // new Function('$scope','target','$scope.' + dataPath + '= target.value')($scope, target)
        new Function('$scope','value','$scope.' + dataPath + '= value')($scope, value)

        var removedEvent = e.type === 'input' ? 'change' : 'input';
        beacon(target).off(removedEvent, onInput);
      }

      beacon(target).on('input', onInput);
      beacon(target).on('change', onInput);

      watchData('{{' + dataPath + '}}', attrNode, scopeIndex, modelChangeHandle);

      function modelChangeHandle(){
        var value = util.getData(dataPath, $scope);
        if(target.value === value){return};
        var result = !util.isEmpty(value) ? value : "";

        if(target.value !== value) {
         target.defaultValue = result;
         if (target.type !== 'file') {
          //  if(beacon.utility.isType(target.checked, 'Boolean')){
             target.checked = result;
          //  } else {
             target.value = result;
          //  }

         }
        }
      }
  }
  api.key = attrName;
  return api;
})
