Air.Module('B.scope.scopeManager', function(require){
  var scopeList = [];
  var repeat = require('B.directive.repeat');
  // var model =  require('B.directive.model');
  var EVENTS =  require('B.event.events');
  var util = require('B.util.util');
  var Scope =  require('B.scope.Scope');
  var nodeUtil = require('B.util.node');
  var eventDirective = require('B.directive.event');


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
      case nodeUtil.type.HTML:
        parseHTML(target, $scope);
        break;
      case nodeUtil.type.TEXT:
      case nodeUtil.type.ATTR:
        parseTextNode(target, $scope);
        break;
      default:

    }
  }

  function tryGenerateViewScope(target, $scope) {
    if (target.tagName.toLowerCase() === 'view') {
      var $subScope = new Scope($scope);
      var subScopeName = target.getAttribute('name');
      scopeList[subScopeName] = $subScope;
      $scope = $subScope;
    }

    return $scope;
  }

  function generateRepeatScopeTree(target, $scope) {
    var repeatItems = repeat.init(target, $scope);
    for (var i = 0, len = repeatItems.length, repeatItem; i < len; i++) {
      repeatItem = repeatItems[i];
      generateScopeTree([repeatItem.node], repeatItem.$scope);
      beacon(repeatItem.$scope).on(EVENTS.DATA_CHANGE);
    }
  }

  function parseHTML(target, $scope){
    $scope = tryGenerateViewScope(target, $scope);

    eventDirective(target, $scope);

    if (repeat.needRepeat(target)) {
      beacon($scope).on(EVENTS.DATA_CHANGE, function(){
        // TODO 检查repeat需要的data有无变化
        generateRepeatScopeTree(target, $scope);

      });
      generateRepeatScopeTree(target, $scope);
    } else {
      generateScopeTree(target.attributes, $scope);
      generateScopeTree(target.childNodes, $scope);
    }
  }

  function parseTextNode(node, $scope){
    var regMarkup = /{{.*?}}/ig;
    var text = node.nodeValue;
    if(text.match(regMarkup)){
      if($scope.$parentScope){
        // TODO
        // beacon($scope.$parentScope).on(EVENTS.DATA_CHANGE, function(){
        //   $scope.$update();
        //   beacon($scope).on(EVENTS.DATA_CHANGE)
        // })
      }

      var txtNodeDataChange = (function(node, template){
        // 保持 template 的值，供后续替换使用
        return function(){
          var text = template;
          var markups = text.match(regMarkup) || [];
          for (var i = markups.length - 1; i >= 0; i--) {
            var markup   = markups[i];
            var dataPath = markup.replace(/{{|}}/ig,"");
            dataPath = dataPath.trim();
            var data = Air.NS(dataPath, $scope);
            data = util.isEmpty(data) ? '' : data;
            text = text.replace(markup, data);
          };
          if(node.nodeValue != text){
            node.nodeValue = text;
          }
        }
      })(node, node.nodeValue);

      beacon($scope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
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
