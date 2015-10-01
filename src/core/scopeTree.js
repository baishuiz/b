Air.Module("core.scopeTree", function(require){
  var Scope = require("core.scope");
  var node = require("utility.node");
  var EVENTS    = require("core.event");
  var repeatFilter = require("directive.repeat");
  var nodeType = node.type;

  var key = {
    module : "cjia-module",
      app    : "ng-app",
      controller : "ng-controller"
  }

  function isEmpty(obj) {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }

      return true;
  }

beacon.on("hi", function(e, data){
  generateScopeTree(data.dom , data.$scope)
  beacon.on(EVENTS.REPEAT_DATA_CHANGE);

})

  function generateScopeTree(childNodes , $scope){
      var scopeList = require('core.scopeList');

      //var childNodes = rootDom.childNodes;
      var childCount = childNodes.length;
      for(var childIndex = 0; childIndex < childCount; childIndex++ ) {
           var child = childNodes[childIndex];
           if(child.nodeType == nodeType.TEXT){
              var tag = child.nodeValue;
              beacon({target:child, oldvalue:child.nodeValue})
              .on(EVENTS.DATA_CHANGE, txtNodeDataChange);

              beacon({target:child, oldvalue:child.nodeValue})
              .on(EVENTS.REPEAT_DATA_CHANGE, txtNodeDataChange);

                function txtNodeDataChange(e, data){
                    var textNode = this.target;
                    var text     = this.oldvalue;
                    var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签
                    for (var i = markups.length - 1; i >= 0; i--) {
                        var markup   = markups[i];
                        var dataPath = markup.replace(/{{|}}/ig,"");
                        // var data = JSON.stringify(Air.NS(dataPath, $scope)).replace(/{}/ig,'')
                        var data = Air.NS(dataPath, $scope);
                        data = isEmpty(data) ? '' : data;
                        text = text.replace(markup, data)


                    };
                    text.replace(/{{.*?}}/ig, '');
                     textNode.nodeValue = text

                }
           } else if (child.nodeType == nodeType.HTML) {

               var needRepeat = node(child).hasAttribute("ng-repeat");
               if(needRepeat) {
                   var newNodes = repeatFilter(child, $scope);
                   for (var i = 0; i < newNodes.length; i++) {
                     var repeadNode = newNodes[i];
                     generateScopeTree(repeatNode.node, repeatNode.$scope);
                   }
               } else {

                     var isController = child.attributes.getNamedItem('ng-controller');
                     if(isController){
                         var controllerName = child.getAttribute(key.controller)
                         $scope = new Scope($scope);
                         scopeList[controllerName] = $scope;
                     }

                     //var repeatFilter = require("directive.repeat");


                     generateScopeTree(child.childNodes, $scope);
               }




           }
      }
  }

return generateScopeTree;

})
