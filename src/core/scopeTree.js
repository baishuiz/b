Air.Module("core.scopeTree", function(require){
  var Scope          = require("core.scope"),
      node           = require("utility.node"),
      util           = require("utility.util"),
      directive      = require("core.directive"),
      EVENTS         = require("core.event"),
      repeatFilter   = require("directive.repeat"),
      eventDirective = require("direcitve.event"),
      initModule     = require("direcitve.model");

  var nodeType = node.type,
      key      = directive.key




function bindRepeatDone(target){
 beacon(target).on(EVENTS.REPEAT_DONE, function(e, nodes){

    for (var i = 0; i < nodes.length; i++) {
      var repeatNode = nodes[i];
      generateScopeTree(repeatNode.node, repeatNode.$scope);
      beacon(repeatNode.$scope).on(EVENTS.REPEAT_DATA_CHANGE, repeatNode.$scope);
    }
  })
}

  var regMarkup = /{{.*?}}/ig;
  function generateScopeTree(childNodes , $scope){
      var scopeList = require('core.scopeList');

      //var childNodes = rootDom.childNodes;
      var childCount = childNodes.length;
      for(var childIndex = 0; childIndex < childCount; childIndex++ ) {
           var child = childNodes[childIndex];
           if(child.nodeType == nodeType.TEXT || child.nodeType == nodeType.ATTR){
              var tag = child.nodeValue;


              var text = child.nodeValue;
              var txtNodeDataChange = (function(child, template){

                return function(e, $scope){
                  var textNode = child;
                  var text     = template;
                  var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签
                  $scope = $scope || this;
                  for (var i = markups.length - 1; i >= 0; i--) {
                      var markup   = markups[i];
                      var dataPath = markup.replace(/{{|}}/ig,"");
                      var data = Air.NS(dataPath, $scope);
                      data = util.isEmpty(data) ? '' : data;
                      text = text.replace(markup, data);
                  };


                  if( textNode.nodeValue != text){
                     textNode.nodeValue = text
                  }
                }
              })(child, child.nodeValue);

              if(text.match(regMarkup)){
                // $scope.$parentScope && beacon($scope.$parentScope).on(b.EVENTS.DATA_CHANGE, txtNodeDataChange)
                if($scope.$parentScope){
                  beacon($scope.$parentScope).on(EVENTS.DATA_CHANGE, function(){
                    $scope.$update();
                    beacon($scope).on(EVENTS.DATA_CHANGE)
                  })
                }
                beacon($scope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
                beacon($scope).on(EVENTS.REPEAT_DATA_CHANGE, txtNodeDataChange);
              }
           } else if (child.nodeType == nodeType.HTML) {

              // generateScopeTree(child.attributes, $scope);
               var needRepeat = node(child).hasAttribute(key.repeat);
               if(needRepeat) {
                   bindRepeatDone(child)
                   var  result = repeatFilter(child, $scope);
                   // bindRepeatDone($scope)

               } else {

                     var isController = child.attributes.getNamedItem(key.controller);
                     if(isController){
                         var controllerName = child.getAttribute(key.controller)

                         $scope = scopeList.set(controllerName, $scope);
                     }
                     generateScopeTree(child.attributes, $scope);
                     initModule(child, $scope);
                     eventDirective(child, $scope);
                     generateScopeTree(child.childNodes, $scope);
               }
           }
      }
  }

return generateScopeTree;

})
