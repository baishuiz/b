Air.Module("directive.repeat", function(require){
	var node      = require("utility.node"),
      directive = require("core.directive"),

      Scope     = require("core.scope"),
      EVENTS    = require("core.event");

  var key       = directive.signup('repeat', 'ng-repeat');

  var api = function(target, $scope){
		     var placeholder = {start : null, end : null},
             needRepeat  = node(target).hasAttribute(key),
						 cloneNode,
						 container;

				 needRepeat && init();

         function init(){
					 placeholder.start = document.createComment("repeat");
					 placeholder.end   = document.createComment(" end repeat ");
           cloneNode         = clone();
           container         = document.createDocumentFragment();
           target.parentElement.insertBefore(placeholder.start, target);
           target.parentElement.insertBefore(placeholder.end, target);
           placeholder.end.parentElement.removeChild(target);
         }

         function bind(cloneNode){

           beacon({target:target, oldNode:cloneNode, scope:$scope})
           .on(EVENTS.DATA_CHANGE, function(e, $scope){
							 if(this.scope !== $scope){
								return ;
							}
						 var node       = require("utility.node"),
                 needRepeat = node(this.oldNode).hasAttribute(key);
             needRepeat && repeat(this);
						 function repeat(target){
							   //beacon.on('cloneNodeRemove', $scope)
                 var node = target.oldNode;
                 var dom = target.target;
                 parseScope(dom.getAttribute(key));
						 }
           })
         }

         function clone($scope){
           var cloneNode = target.cloneNode(true);
           bind(cloneNode);
           return cloneNode;
         }

         function parseScope(condition){
              var container = document.createDocumentFragment();
              var group = condition.replace(/\w+\s+in\s+(\w+)/ig, "$1");
							var itemName = condition.match(/(\w+)\s+in\s+(\w+)/i)[1];
              //var repeatScope = new Function("$scope", "group","return $scope[group]")($scope, group);
              //var newScope = new Scope($scope);
							var repeatScope = Air.NS(group, $scope);
              //beacon.utility.blend(newScope,repeatScope);
							var nodes = [];
							for(var item=0; item< repeatScope.length; item++) {
                var newNode = cloneNode.cloneNode(true);

								beacon({target:newNode, scope:$scope}).once("cloneNodeRemove", function(e, $scope){
									if($scope !== this.scope) return;
                  this.target.parentElement.removeChild(this.target);
								});

                newNode.removeAttribute(key);
								var activeScope = new Scope($scope);
								activeScope[itemName] = repeatScope[item]
								nodes.push({
									node : newNode.childNodes,
									$scope : activeScope
								});
                container.appendChild(newNode);
              }
              placeholder.end.parentElement.insertBefore(container,placeholder.end);

							beacon.on(EVENTS.REPEAT_DONE, nodes)

							return {
								    scope : repeatScope,
										nodes : nodes
							};
         }
         return parseScope(target.getAttribute(key));
	}
	return api;
})
