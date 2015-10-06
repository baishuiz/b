Air.Module("core.scopeTree", function(require){
  var Scope          = require("core.scope"),
      node           = require("utility.node"),
      util           = require("utility.util"),
      directive      = require("core.directive"),
      EVENTS         = require("core.event"),
      repeatFilter   = require("directive.repeat"),
      eventDirective = require("direcitve.event"),
      initModule     = require("direcitve.module");

  var nodeType = node.type,
      key      = directive.key


beacon.on(EVENTS.REPEAT_DONE, function(e, nodes){
  // generateScopeTree(data.dom , data.$scope)
  // beacon.on(EVENTS.REPEAT_DATA_CHANGE);


  for (var i = 0; i < nodes.length; i++) {
    var repeatNode = nodes[i];
    generateScopeTree(repeatNode.node, repeatNode.$scope);
    beacon.on(EVENTS.REPEAT_DATA_CHANGE, repeatNode.$scope);
  }
})

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

              if(text.match(regMarkup)){


                beacon({target:child, oldvalue:child.nodeValue, scope:$scope})
                .on(EVENTS.DATA_CHANGE, txtNodeDataChange);

                beacon({target:child, oldvalue:child.nodeValue, scope:$scope})
                .on(EVENTS.REPEAT_DATA_CHANGE, txtNodeDataChange);
              }
                function txtNodeDataChange(e, $scope){
                    if(this.scope !== $scope){
                      return ;
                    }
                    // console.log(this.target.nodeValue,this.oldvalue)
                    var textNode = this.target;
                    var text     = this.oldvalue;
                    var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签
                    for (var i = markups.length - 1; i >= 0; i--) {
                        var markup   = markups[i];
                        var dataPath = markup.replace(/{{|}}/ig,"");
                        var data = Air.NS(dataPath, $scope);
                        data = util.isEmpty(data) ? '' : data;
                        text = text.replace(markup, data)


                    };
                    //text.replace(/{{.*?}}/ig, '');
                     textNode.nodeValue = text

                }
           } else if (child.nodeType == nodeType.HTML) {

              generateScopeTree(child.attributes, $scope);
              //initModule(child, $scope);
              //  for (var attrIndex = 0; attrIndex < child.attributes.length; attrIndex++) {
              //    var activeAttribute = child.attributes[attrIndex];
              //    generateScopeTree(activeAttribute, $scope);
              //  }
               var needRepeat = node(child).hasAttribute(key.repeat);
               if(needRepeat) {
                   var  result = repeatFilter(child, $scope);

               } else {

                     var isController = child.attributes.getNamedItem(key.controller);
                     if(isController){
                         var controllerName = child.getAttribute(key.controller)
                         $scope = new Scope($scope);
                         scopeList[controllerName] = $scope;
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
