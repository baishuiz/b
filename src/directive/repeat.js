Air.Module("directive.repeat", function(require){
	var node      = require("utility.node"),
      directive = require("core.directive"),
      Scope     = require("core.scope"),
      scopeList = require("core.scopeList"),
      EVENTS    = require("core.event");

  var key       = directive.signup('repeat', 'ng-repeat');
  var  removeEvent = beacon.createEvent("cloneNodeRemove");


  function init(target, $scope){
   var placeholder   = {start : null, end : null};
   placeholder.start = document.createComment("repeat");
   placeholder.end   = document.createComment(" end repeat ");
   cloneNode         = clone(target, $scope);
   container         = document.createDocumentFragment();
   target.parentNode.insertBefore(placeholder.start, target);
   target.parentNode.insertBefore(placeholder.end, target);
   placeholder.end.parentNode.removeChild(target);
   return placeholder;
  }


  function clone(target, $scope){
   var cloneNode = target.cloneNode(true);
   bind(target, $scope);
   return cloneNode;
  }

  function bind(target, $scope){
    var dateChangeHandle = function(){
      var $scope     = this;
      var node       = require("utility.node"), // TODO : remove
         condition  = target.getAttribute(key);
         needRepeat = !!condition,
         group      = condition.replace(/\S+\s+in\s+(\S+)/ig, "$1"),
         dataChange = scopeList.dirtyCheck(group, $scope);

      if((needRepeat && dataChange) || (needRepeat && !target.repeaded)){
       repeat(target, $scope);
      }
    };
    beacon($scope).on(EVENTS.DATA_CHANGE, dateChangeHandle);
  }

  function repeat(target, $scope){
    // remove old clone node
    beacon(target).on(removeEvent, {$scope:$scope});
    parseScope(target, $scope);
    target.repeaded = true;
  }


  function parseScope(target, $scope, placeholder){
      var condition   = target.getAttribute(key),
          needRepeat  = node(target).hasAttribute(key); 
      placeholder = target.placeholder;
      var container   = document.createDocumentFragment();
      var group       = condition.replace(/\S+\s+in\s+(\S+)/ig, "$1");
      var itemName    = condition.match(/(\S+)\s+in\s+(\S+)/i)[1];
      var repeatScope = Air.NS(group, $scope);
      var nodes = [];

      for(var item=0; item< repeatScope.length; item++) {
        var newNode = target.cloneNode(true);

        beacon({target:newNode, scope:$scope}).once(removeEvent, function(e, data){
          if(data.$scope !== this.scope) return;
          this.target.parentNode.removeChild(this.target);
        });

        newNode.removeAttribute(key);
        var activeScope = new Scope($scope);
        activeScope[itemName] = repeatScope[item];
        activeScope.$index = item;
        activeScope.$parentScope = $scope;
        nodes.push({
          node : newNode.childNodes,
          $scope : activeScope
        });
        container.appendChild(newNode);
      }

      placeholder.end.parentNode.insertBefore(container,placeholder.end);
      beacon($scope).on(EVENTS.REPEAT_DONE, nodes)

      return {
            scope : repeatScope,
            nodes : nodes
      };
  }     

  
  var api = function(target, $scope){
      var needRepeat  = node(target).hasAttribute(key); 
          target.placeholder = needRepeat && init(target, $scope);
          parseScope(target, $scope)
  }
	return api;
})
