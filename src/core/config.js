Air.Module('core.config', function(){
  var configs = {};
  var api = {
    get : function(key){
      return configs[key] ;
    },

    set : function(key, value){
      configs[key] = value;
      return configs[key];
    }
  };
  return api;
});
