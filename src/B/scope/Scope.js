Air.Module('B.scope.Scope', function(require) {
  var EVENTS =  require('B.event.events');
  var util =  require('B.util.util');
  var Scope = function(parent){
    this.parent = parent
  }

  var proto = {};

  // TODO: 重构
  proto.listenDataChange =  function (dataPath, callback){
      var self = this;
      beacon(self).once(EVENTS.RUN_COMPLETE, function(){
        callback();

        //===
        var r = dataPath.split('.');
        var activeT = ""
        for(var i = 0; i < r.length-1; i++){
          if(activeT){
             activeT = activeT + '.' + r[i];
          } else {
            activeT =  r[i]
          }

          var targetT = util.getData(activeT, self);
          targetT && Object.observe(targetT, function(dataChanges){
            // var obj = getRepeatData(target, $scope)
            for(var i = 0; i < dataChanges.length; i++){
              // (dataChanges[i].name === dataPath|| dataChanges[i].object === targetT)  && callback()
              beacon.utility.arrayIndexOf(dataPath.split('.'), dataChanges[i].name) >= 0 && callback()
            }
          });
        }
      });

      Object.observe(self, function(dataChanges){
        for(var i=0;i<dataChanges.length;i++){
          dataChanges[i].name === dataPath.split('.')[0] && callback()
        }
      });
    }

  var api = function(parent){
        Scope.prototype = parent || proto;
        return new Scope(parent);
  }
  return api;
});
