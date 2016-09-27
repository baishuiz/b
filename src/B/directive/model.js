Air.Module('B.directive.model', function(require) {
  var nodeUtil = require('B.util.node'),
    util = require('B.util.util'),
    EVENTS = require("B.event.events");

  var attrName = 'b-model';

  function getTargetIndex(checkedList, target, selector, context) {
    context = context || document;
    var targetGroup = context.querySelectorAll(selector);
    for (var i = 0; i < targetGroup.length; i++) {
      var activeTarget = targetGroup[i];
      if (beacon.utility.arrayIndexOf(checkedList, activeTarget.value) >= 0) {
        activeTarget.checked = true;
      } else {
        activeTarget.checked = false;
      }
    }
  }

  function setScopeData(dataPath, value, scope) {
    var nodeList = dataPath.split('.');
    var lastNode = nodeList.pop();
    var prefixPath = nodeList.join('.');

    if (prefixPath) {
      util.getData(prefixPath, scope)[lastNode] = value;
    } else {
      scope[lastNode] = value;
    }
    var result = {
      prefixPath: prefixPath,
      lastNode: lastNode
    }　　　
    return result;

  }



  var api = function(target, scopeStructure, watchData) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.name;
    var activeModel = null;
    if (!nodeUtil(target).hasAttribute(attrName)) {
      return;
    }
    var attrNode = target.getAttributeNode(attrName);
    var dataPath = target.getAttribute(attrName)
      .replace(/{{|}}/ig, '');

    var value = util.getData(dataPath, $scope);
    value && modelChangeHandle();


    function onInput(e) {
      var target = this;
      var value;

      if (target.type === 'checkbox') {
        var _dataPath = target.getAttribute('b-model');
        value = util.getData(_dataPath, $scope);
        if (beacon.utility.isType(value, 'Array')) {

          var itemIndex = beacon.utility.arrayIndexOf(value, target.value);
          if (target.checked) {
            value.push(target.value);
          } else {
            itemIndex >= 0 && value.splice(itemIndex, 1);
          }

          var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') + ']';
          var context = b.views.getActive().getDom();
        } else {
          value = target.checked
        }
      } else {
        value = target.value
      }

      var dataPathInfo = setScopeData(dataPath, value, $scope);

      var removedEvent = e.type === 'input' ? 'change' : 'input';
      beacon(target).off(removedEvent, onInput);
    }

    beacon(target).on('input', onInput);
    beacon(target).on('change', onInput);

    watchData('{{' + dataPath + '}}', attrNode, scopeIndex, modelChangeHandle);

    function modelChangeHandle() {
      var value = util.getData(dataPath, $scope);
      if (target.value === value && target.type !== "radio") {
        return
      };
      var result = !util.isEmpty(value) ? value : "";

      if (beacon.utility.isType(value, 'Array')) {
        var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') + ']';
        var context = b.views.getActive().getDom();
        var targetIndex = getTargetIndex(result, target, selector, context);
        return;
      }

      if (target.value !== value || target.type == "radio") {
        target.initValue = result;
        if (target.type !== 'file') {
          if (target.type == "radio") {
            target.checked = target.value == result;
          } else {
            target.checked = result;
            target.value = result;
          }

        }
      }
    }
  }
  api.key = attrName;
  return api;
})
