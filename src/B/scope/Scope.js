Air.Module('B.scope.Scope', function(require) {
  var EVENTS =  require('B.event.events');
  var util =  require('B.util.util');
  var Scope = function(parent){
    this.parent = parent
  }

  var proto = {};

  function listenDataChange (targetT, dataPath, callback) {
    targetT && beacon.utility.isType(targetT, 'Object') && Object.observe(targetT, function(dataChanges){
      // TODO 重构
      for(var i = 0; i < dataChanges.length; i++){
        if(dataChanges[i].type == 'add'){
          var target = dataChanges[0];
          var attr = target.object[target.name];
          listenDataChange (attr, dataPath, callback);
        }
        beacon.utility.arrayIndexOf(dataPath.split('.'), dataChanges[i].name) >= 0 && callback()
      }
    });
  }

  // TODO: 重构
  proto.listenDataChange =  function (dataPath, callback){
      var self = this;
      var fn = function(){
        callback();

        var r = dataPath.split('.');
        var activeT = ""
        for(var i = 0; i < r.length-1; i++){
          if(activeT){
             activeT = activeT + '.' + r[i];
          } else {
            activeT = r[i]
          }

          var targetT = util.getData(activeT, self);
          listenDataChange(targetT, dataPath, callback);
        }
      }
      if (typeof self.$index === 'number') {
        setTimeout(fn, 0); // 否则会死循环
      } else {
        beacon(self).once(EVENTS.RUN_COMPLETE, fn);
      }

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
