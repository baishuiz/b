Air.Module("directive.repeat", function(require){
	var node      = require("utility.node"),
      directive = require("core.directive"),
      Scope     = require("core.scope"),
      scopeList = require("core.scopeList"),
      EVENTS    = require("core.event");

  var key       = directive.signup('repeat', 'ng-repeat');
  var  removeEvent = beacon.createEvent("cloneNodeRemove");


  function init(target, $scope){
   var placeholder   = document.createComment("repeat placeholder ");
   cloneNode         = clone(target, $scope);
   container         = document.createDocumentFragment();
   target.parentNode.insertBefore(placeholder, target);
   placeholder.parentNode.removeChild(target);
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
         // dataChange = scopeList.dirtyCheck(group, $scope);
         dataChange = Air.NS(group, $scope).length !== target.cloneNodes.length;

      if((needRepeat && dataChange) || (needRepeat && !target.repeaded)){
       repeat(target, $scope);
      }
    };
    beacon($scope).on(EVENTS.DATA_CHANGE, dateChangeHandle);
  }

  function repeat(target, $scope){
    // remove old clone node
    beacon(target.cloneNodes).on(removeEvent, {$scope:$scope});
    target.cloneNodes = [];
    parseScope(target, $scope);

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

      target.cloneNodes = target.cloneNodes || [];
      for(var item=0; item< repeatScope.length; item++) {
        var newNode = target.cloneNode(true);
        target.cloneNodes.push(newNode);
        beacon(newNode).once(removeEvent, function(e, data){
          // if(data.$scope !== this.scope) return;
          this.parentNode.removeChild(this);
        });

        newNode.removeAttribute(key);
        var activeScope = new Scope($scope);
        beacon.on('clear::scopeEvnet', function(){
          beacon(activeScope).off();
        });
        activeScope[itemName] = repeatScope[item];
        activeScope.$index = item;
        activeScope.$parentScope = $scope;
        activeScope.$update = (function(item){

          return function(){
            var repeatScope = Air.NS(group, $scope);
            this[itemName] = repeatScope[item];
            return repeatScope[item]
          }
        }(item))
        nodes.push({
          node : newNode.childNodes,
          $scope : activeScope
        });
        container.appendChild(newNode);
      }

      placeholder.parentNode.insertBefore(container,placeholder);
      beacon(target).on(EVENTS.REPEAT_DONE, nodes)
      target.repeaded = true;
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
