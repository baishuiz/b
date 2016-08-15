Air.Module('B.directive.model', function(require){
  var nodeUtil  = require('B.util.node'),
      util      = require('B.util.util'),
      EVENTS    = require("B.event.events");

  var attrName = 'b-model';

  function getTargetIndex(checkedList, target, selector, context){
     context = context || document;
     var targetGroup = context.querySelectorAll(selector);
     for (var i = 0; i < targetGroup.length; i++) {
       var activeTarget = targetGroup[i];
       if( beacon.utility.arrayIndexOf(checkedList, activeTarget.value) >= 0 ){
         activeTarget.checked = true;
       }else {
         activeTarget.checked = false;
       }
     }
  }



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
        var value;
        // var value = target.type==='checkbox' ?  target.checked : target.value;
        if(target.type==='checkbox'){
          var _dataPath = target.getAttribute('b-model');
          value = util.getData(_dataPath, $scope);
           if(beacon.utility.isType(value, 'Array')){

               var itemIndex = beacon.utility.arrayIndexOf(value, target.value);
               if( target.checked){
                //  value.splice(itemIndex,1);
                 value.push(target.value)
                //  value = [].concat(value);
               }else {
                //  target.checked = false;
                 itemIndex >=0  && value.splice(itemIndex,1);
                //  value = [].concat(value);
               }

             var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') +']';
             var context = b.views.getActive().getDom();
            //  getTargetIndex(value, target, selector, context);
           }else{
             value = target.checked
           }
        }else{
          value = target.value
        }


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

        if(beacon.utility.isType(result, 'Array')){
          var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') +']';
          var context = b.views.getActive().getDom();
          var targetIndex = getTargetIndex(result, target, selector, context);
          return;
        }

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
