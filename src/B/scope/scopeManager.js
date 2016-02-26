Air.Module('B.scope.scopeManager', function(require){
  var scopeList = [];
  // var repeat = require('B.directive.repeat');
  // var model =  require('B.directive.model');
  var EVENTS =  require('B.event.events');
  var util = require('B.util.util');
  var Scope =  require('B.scope.Scope');

  var nodeType = {
      TEXT : 3,
      HTML : 1,
      ATTR : 2
  }


  function getApps(dom){
    return {}
  }

  function generateScopeTree(childNodes, $scope){
    for (var i = 0; i < childNodes.length; i++) {
      var activeChild = childNodes[i];
      TryParseNode(activeChild, $scope)
    }

  }

  function TryParseNode(target, $scope){
    switch (target.nodeType) {
      case nodeType.HTML:
        parseHTML(target, $scope);
        break;
      case nodeType.TEXT:
      case nodeType.ATTR:
        parseTextNode(target, $scope);
        break;
      default:

    }
  }

  function parseHTML(target, $scope){
    if (target.tagName.toLowerCase() === 'view') {
      var $subScope = new Scope($scope);
      var subScopeName = target.getAttribute('name');
      scopeList[subScopeName] = $subScope;
      $scope = $subScope;
    }
    generateScopeTree(target.attributes, $scope);
    generateScopeTree(target.childNodes, $scope);
  }

  function parseTextNode(node, $scope){
    var regMarkup = /{{.*?}}/ig;
    var text = node.nodeValue;
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
    var scope = new Scope()
    scopeList[scopeName] = scope;
    generateScopeTree(dom.childNodes, scope);
  }

  function init(){}

  function getScope(scopeName) {
    return scopeList[scopeName];
  }

  return {
    parseScope : parseScope,
    init : init,
    getScope: getScope
  }
});
