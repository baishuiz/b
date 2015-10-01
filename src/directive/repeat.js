Air.Module("directive.repeat", function(require){
	var node      = require("utility.node");
  var EVENTS    = require("core.event");

  var directive = "ng-repeat";

  var api = function(target, $scope){
    var mstart = document.createComment("repeat");
    var mend = document.createComment(" end repeat ");

         var needRepeat = node(target).hasAttribute(directive);
         needRepeat && init();
         var cloneNode = needRepeat && clone();
        // needRepeat && parseScope(target.getAttribute(directive));
         var container = needRepeat && document.createDocumentFragment();


         function init(){
           target.parentElement.insertBefore(mstart, target);
           target.parentElement.insertBefore(mend, target);
           mend.parentElement.removeChild(target);
         }

         function bind(cloneNode){
           beacon({target:target, oldNode:cloneNode})
           .on(EVENTS.DATA_CHANGE, function(){
             var node      = require("utility.node");
             var needRepeat = node(this.oldNode).hasAttribute(directive);
             if(!needRepeat) return;
             var node = this.oldNode;
             var target = this.target;
             parseScope(target.getAttribute(directive));
           })
         }


         function repeat ($scope){
             // var newNode = cloneNode.cloneNode(true);
             // container.
         }

         function clone($scope){
           // var container = document.createDocumentFragment();
           var cloneNode = target.cloneNode(true);
            bind(cloneNode);
           return cloneNode;
         }




         function parseScope(condition){
              var container = document.createDocumentFragment();
              var group = condition.replace(/\w+\s+in\s+(\w+)/ig, "$1");
              for(var item in $scope[group]) {
                //repeat(item);
                var newNode = cloneNode.cloneNode(true);
                newNode.removeAttribute(directive);

                //parentElement.remove(a)


                beacon.on('hi', {
                  dom : [newNode],
                  $scope : {book:$scope[group][item]}
                })

                container.appendChild(newNode);

              }


               mend.parentElement.insertBefore(container,mend);

              //generateScopeTree(container, {book:$scope[group][item]})



         }
         return needRepeat;
	}
	return api;
})
