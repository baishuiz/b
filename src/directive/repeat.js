Air.Module("directive.repeat", function(require){
	var node      = require("utility.node"),
      directive = require("core.directive"),
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
           beacon({target:target, oldNode:cloneNode})
           .on(EVENTS.DATA_CHANGE, function(){
             var node       = require("utility.node"),
                 needRepeat = node(this.oldNode).hasAttribute(key);
             needRepeat && repeat(this);
						 function repeat(target){
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
              for(var item in $scope[group]) {
                var newNode = cloneNode.cloneNode(true);
                newNode.removeAttribute(key);
                beacon.on(EVENTS.REPEAT_DONE, {
                  dom : [newNode],
                  $scope : {book:$scope[group][item]}
                })
                container.appendChild(newNode);
              }
              placeholder.end.parentElement.insertBefore(container,placeholder.end);
         }
         return needRepeat;
	}
	return api;
})
