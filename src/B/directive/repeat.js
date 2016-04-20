Air.Module('B.directive.repeat', function(require){
  var attrName = 'b-repeat';
  var nodeUtil = require('B.util.node');
  var Scope = require('B.scope.Scope');
  var EVENTS =  require('B.event.events');
  var util =  require('B.util.util');

  function init(target, scope) {
    var placeholder = generatePlaceholder(target);

    tryDeleteCachedNodes(target.cachedNodes);

    var template = getTemplate(target);

    var repeatData = getRepeatData(template, scope);
    var repeatItems = generateRepeatItems(template, scope, repeatData, placeholder);

    return repeatItems;
  }

  function getRepeatData(template, scope) {
    var condition = template.getAttribute(attrName);
    var dataPath  = condition.replace(/\S+\s+in\s+(\S+)/ig, '$1');
    var itemName  = condition.match(/(\S+)\s+in\s+(\S+)/i)[1];
    template.repeatDataPath = dataPath;

    var data = util.getData(dataPath, scope);

    return {
      data: data,
      itemName: itemName,
      dataPath : dataPath
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

  function tryDeleteCachedNodes(cachedNodes) {
    cachedNodes = cachedNodes || [];
    for (var i = 0, len = cachedNodes.length, node; i < len; i++){
      node = cachedNodes[i];
      node.parentNode && node.parentNode.removeChild(node);
      unbind(node);
    }
  }

  function unbind(node){
    // for(var i=0; i<node.childNodes.length; i++){
    //   beacon(node.childNodes[i]).off();
    //   unbind(node.childNodes[i]);
    // }
  }

  function cacheNodes(template, node){
    template.cachedNodes = template.cachedNodes || [];
    template.cachedNodes.push(node);
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
        scope.$index = i;
        scope[itemName] = data;

        node.removeAttribute(attrName);
        tmpParent.appendChild(node);

        cacheNodes(template, node);

        repeatItems.push({
          node: node,
          $scope: scope
        });
      }
      placeholder.parentNode.insertBefore(tmpParent, placeholder);
      fixSelectElement(placeholder, template)
    }
    return repeatItems;
  }

  function getTemplate(target) {
    // fixSelectElement(target);
    target.parentNode && target.parentNode.removeChild(target);
    return target;
  }

  function fixSelectElement(placeholder, target){
    if(target.nodeName.toLowerCase()=='option'){
      setTimeout(function(){
        placeholder.parentNode.value = placeholder.parentNode.defaultValue;
      },0);
    }
  }

  function needRepeat(target, $scope) {
    var isRepeatDirective = nodeUtil(target).hasAttribute(attrName);
    var noRepeated = !target.repeatDataPath;
    target.cachedNodes = target.cachedNodes || [];
    var dataChange;
    if(target.repeatDataPath){
      dataChange = util.getData(target.repeatDataPath, $scope).length !== target.cachedNodes.length
    }
    // return isRepeatDirective;
    return (isRepeatDirective && noRepeated)  || dataChange
  }


  // TODO: 重构
  function listenDataChange(targetT, dataPath, callback){
    var isArray = targetT && beacon.utility.isType(targetT, 'Array');
    var isObject = targetT && beacon.utility.isType(targetT, 'Object');
     (isObject || isArray) && Object.observe(targetT, function(dataChanges){
      // var obj = getRepeatData(target, $scope)
      for(var i=0;i<dataChanges.length;i++){
        if(dataChanges[i].type == 'add'){
          var target = dataChanges[i];
          var attr = target.object[target.name];
          listenDataChange(attr, dataPath, callback);
        }
        dataChanges[i].name === 'length' && callback()
      }
    });
  }

  function tryListenDataChange(target, $scope, callback){
    beacon($scope).once(EVENTS.RUN_COMPLETE, function(){
      var obj = getRepeatData(target, $scope);
      callback();
      var r = obj.dataPath.split('.');
      var activeT = ""
      for(var i=0;i<r.length; i++){
        if(activeT){
           activeT = activeT + '.' + r[i];
        } else {
          activeT =  r[i]
        }

        var targetT = util.getData(activeT, $scope);
        listenDataChange(targetT, obj.dataPath, callback);
      }
    });

    Object.observe($scope, function(dataChanges){
      var obj = getRepeatData(target, $scope)
      for(var i=0;i<dataChanges.length;i++){
        if(dataChanges[i].type == 'add'){
          var target_ = dataChanges[0];
          var attr = target_.object[target_.name];
          listenDataChange(attr, obj.dataPath, callback);
        }
        dataChanges[i].name === obj.dataPath.split('.')[0] && callback()
      }
    });
  }

  return {
    init: init,
    needRepeat: needRepeat,
    listenDataChange : tryListenDataChange
  };
});
