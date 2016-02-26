Air.Module('B.scope.scopeManager', function(require){
  var scopeList = [];
  var repeat = require('B.directive.repeat');
  var model =  require('B.directive.model');
  var Event =  require('B.directive.event');

  var nodeType = {
      TEXT : 3,
      HTML : 1,
      ATTR : 2
  }


  function getApps(dom){
    return {}
  }

  function generateScopeTree(childNodes, parentScope){
    for (var i = 0; i < childNodes.length; i++) {
      var activeChild = childNodes[i];
      TryParseNode(activeChild, parentScope)
    }

  }

  function TryParseNode(target, parentScope){
    switch (target.nodeType) {
      case nodeType.HTML:
        parseHTML(target, parentScope);
        break;
      case nodeType.TEXT:
        parseTextNode(target, parentScope);
        break;
      default:

    }
  }

  function parseHTML(target, parentScope){
    generateScopeTree(target.childNodes, $scope);
  }

  function parseAttribute(node, parentScope){}

  function parseTextNode(node, $scope){
    var regMarkup = /{{.*?}}/ig;
    var text = child.nodeValue;
    if(text.match(regMarkup)){
      if($scope.$parentScope){
        // beacon($scope.$parentScope).on(EVENTS.DATA_CHANGE, function(){
        //   $scope.$update();
        //   beacon($scope).on(EVENTS.DATA_CHANGE)
        // })
      }
      beacon($scope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);

      function txtNodeDataChange(){
         var text = node.nodeValue;
          var markups  = text.match(regMarkup) || [];
          for (var i = markups.length - 1; i >= 0; i--) {
              var markup   = markups[i];
              var dataPath = markup.replace(/{{|}}/ig,"");
              var data = Air.NS(dataPath, $scope);
              data = util.isEmpty(data) ? '' : data;
              text = text.replace(markup, data);
          };
          if( node.nodeValue != text){
              node.nodeValue = text;
          }
      }
    }

  }

  function parseScope(scopeName,dom){
    var scope = new Scope(scopeName, dom)
    scopeList[scopeName] = scope;
    generateScopeTree(dom, scope);
  }

  function init(){}

  return {
    parseScope : parseScope,
    init : init
  }
});
