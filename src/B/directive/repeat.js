Air.Module('B.directive.repeat', function(require){
  var attrName = 'b-repeat';
  var nodeUtil = require('B.util.node');
  var Scope = require('B.scope.Scope');

  // TODO parentScope

  function init(target, scope) {
    var placeholder = generatePlaceholder(target);
    var template  = getTemplate(target);

    var repeatData = getRepeatData(target, scope);
    var repeatItems = generateRepeatItems(template, scope, repeatData, placeholder);

    return repeatItems;
  }

  function getRepeatData(target, scope) {
    var condition = target.getAttribute(attrName);
    var dataPath  = condition.replace(/\S+\s+in\s+(\S+)/ig, '$1');
    var itemName  = condition.match(/(\S+)\s+in\s+(\S+)/i)[1];

    var data = Air.NS(dataPath, scope);
    return {
      data: data,
      itemName: itemName
    };
  }

  function generatePlaceholder(target) {
    if (target.placeholder) {
      return target.placeholder;
    }
    var placeholder = document.createComment('repeat placeholder ' + target.getAttribute(attrName));
    target.parentNode.insertBefore(placeholder, target);
    target.placeholder = placeholder;
    return placeholder;
  }

  function generateRepeatItems(template, parentScope, repeatData, placeholder) {
    var repeatItems = [];
    var nodes = [];
    var dataAry = repeatData.data;
    var itemName = repeatData.itemName;
    var tmpParent = document.createDocumentFragment();

    if (beacon.utility.isType(dataAry, 'Array')) {
      for (var i = 0, len = dataAry.length, data; i < len; i++) {
        var data = dataAry[i];
        var node = template.cloneNode(true);
        var scope = new Scope(parentScope);

        scope[itemName] = data;

        node.removeAttribute(attrName);
        tmpParent.appendChild(node);

        repeatItems.push({
          node: node,
          $scope: scope
        });
      }
      placeholder.parentNode.insertBefore(tmpParent, placeholder);
    }
    return repeatItems;
  }

  function getTemplate(target) {
    target.parentNode && target.parentNode.removeChild(target);
    return target;
  }

  function needRepeat(target) {
    return nodeUtil(target).hasAttribute(attrName);
  }

  return {
    init: init,
    needRepeat: needRepeat
  };
});
