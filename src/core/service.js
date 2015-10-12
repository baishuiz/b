Air.Module('core.service', function(){


  var service = function(configKey){
      return {
        set : function(){
          return {
            query : function(){}
          }
        }
      }
  };
  return service;
})
