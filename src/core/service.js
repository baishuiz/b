Air.Module('core.service', function(require){
  var request = require('core.network.request');

  var service = function(configKey){
      return {
        set : function(){
          
          return {
            query : function(params){
              request({
                    method: 'GET',
                    url   : url,
                    data  : data
              });

            }
          }
        }
      }
  };
  return service;
})
