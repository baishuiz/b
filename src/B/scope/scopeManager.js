Air.Module('B.scope.scopeManager', function(require){
  var scopeList = [];
  var repeat = require('B.directive.repeat');
  var initModel =  require('B.directive.model');
  var EVENTS =  require('B.event.events');
  var util = require('B.util.util');
  var Scope =  require('B.scope.Scope');
  var nodeUtil = require('B.util.node');
  var eventDirective = require('B.directive.event');
  var showDirective = require('B.directive.show');
  var propertyDirective = require('B.directive.property');
  var memCache = require('B.data.memCache');
  var trim = function(str) {
    str = str || ''
    return str.trim ? str.trim() : str.replace(/^\s+|\s+^/,'');
  }

  var $rootScope = new Scope();

  function setRoot(params){
    beacon.utility.merge($rootScope, params);
  }

  function generateScopeTree(childNodes, $scope){
    for (var i = 0; i < childNodes.length; i++) {
      var activeChild = childNodes[i];
      tryParseNode(activeChild, $scope)
    }

  }

  function tryParseNode(target, $scope){
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
      var scopeKey = target.getAttribute('b-scope-key');
      var viewName = target.getAttribute('name');
      var subScopeName = scopeKey || viewName;
      if (scopeList[subScopeName]) {
        $scope = scopeList[subScopeName];
      } else {
        var $subScope = new Scope($scope);
        scopeList[subScopeName] = $subScope;
        $scope = $subScope;
      }

      if (scopeKey) {
        var controllerMap = memCache.get('controllerMap') || {};
        var controller = controllerMap[viewName];

        if (controller) {
          setTimeout(function(){
            b.run(viewName, controller);
          }, 0);
        }
      }
    }

    return $scope;
  }

  function generateRepeatScopeTree(target, $scope) {
    var repeatItems = repeat.init(target, $scope);
    for (var i = 0, len = repeatItems.length, repeatItem; i < len; i++) {
      repeatItem = repeatItems[i];
      generateScopeTree([repeatItem.node], repeatItem.$scope);
      generateScopeTree(repeatItem.node.attributes, repeatItem.$scope);
      beacon(repeatItem.$scope).on(EVENTS.DATA_CHANGE);
    }
  }

  function parseHTML(target, $scope){
    $scope = tryGenerateViewScope(target, $scope);
    initModel(target, $scope);
    eventDirective(target, $scope);
    showDirective(target, $scope);
    propertyDirective(target, $scope);


    if (repeat.needRepeat(target, $scope)) {
      // beacon($scope).on(EVENTS.DATA_CHANGE, function(){
      //
      //   var needRepeat = repeat.needRepeat(target, $scope)
      //   needRepeat && generateRepeatScopeTree(target, $scope);
      // });
      generateRepeatScopeTree(target, $scope);
      repeat.listenDataChange(target, $scope, function(){
        generateRepeatScopeTree(target, $scope);
      })
    } else {
      generateScopeTree(target.attributes, $scope);
      generateScopeTree([].concat.apply([], target.childNodes), $scope);
    }
  }

  function parseTextNode(node, $scope){
    var regMarkup = /{{.*?}}/ig;
    var text = node.nodeValue;
    if(text.match(regMarkup)){

      var txtNodeDataChange = (function(node, template){
        // 保持 template 的值，供后续替换使用
        var init = true;
        return function(){
          var ownerElement = node.ownerElement;
          if (ownerElement) {
            if (!ownerElement.parentNode) {
              return;
            }
          } else if (!node.parentNode) {
            return;
          }

          var text = template;
          var markups = text.match(regMarkup) || [];
          var isStyle = node.nodeName.toLowerCase() === 'b-style';
          for (var i = markups.length - 1; i >= 0; i--) {
            var markup   = markups[i];
            var dataPath = markup.replace(/{{|}}/ig,"");
            // TODO :  新增String.prototype.trim
            dataPath = trim(dataPath);
            // var data = util.getData(dataPath, $scope);
            var expression = getExpression(dataPath, init);
            init = false;
            var data = eval(expression) //new Function($scope, 'return ' + expression)($scope);
            data = util.isEmpty(data) ? '' : data;
            text = text.replace(markup, data);
          };
          if(node.nodeValue != text){
            if(ownerElement && ownerElement.nodeName.toLowerCase() === 'option' && ownerElement.parentNode){
              setTimeout(function(){
                if (ownerElement.parentNode) {
                  ownerElement.parentNode.value = ownerElement.parentNode.defaultValue;
                }
              },0);
            }
            node.nodeValue = text;
            if (isStyle && ownerElement) {
                ownerElement.style.cssText = text;
            }
          }
        }
      })(node, node.nodeValue);

      function getExpression(dataPath, init){
        return dataPath.replace(/(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g, function(token){
           token = trim(token);
           if(/^\d+$/.test(token) || /^['"]/.test(token) || token=='' || token==='true' || token ==='false' ){
             return token
           } else {

             init && $scope.listenDataChange(token, function(){
               txtNodeDataChange();
             })

             var ancestorScope = getAncestorScope($scope);
             ancestorScope !== $scope && init && ancestorScope.listenDataChange(token, function(){
               txtNodeDataChange();
             })
             return 'util.getData("' + token + '", $scope)'
           }
        });
      }
      txtNodeDataChange();
      // var ancestorScope = getAncestorScope($scope);
      // beacon($scope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
      //  ancestorScope !== $scope && beacon(ancestorScope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
    }

  }

  function parseScope(scopeName, dom){
    var scope = scopeList[scopeName];
    if (!scope) {
      scope = new Scope($rootScope);
      delete scope.parent;
      scopeList[scopeName] = scope;
    }
    generateScopeTree([].concat.apply([], dom.childNodes), scope);

    return scope;
  }

  function getScope(scopeName) {
    return scopeList[scopeName];
  }

  function getAncestorScope($scope) {
    if ($scope.parent) {
      return getAncestorScope($scope.parent);
    }
    return $scope;
  }

  return {
    parseScope : parseScope,
    getScope: getScope,
    setRoot: setRoot,
    getAncestorScope : getAncestorScope
  }
});