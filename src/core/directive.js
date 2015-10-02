Air.Module("core.directive", function(){
  var directive = {
        module     : "cjia-module",
        app        : "ng-app",
        controller : "ng-controller"
  };
  var api = {
    signup : function(key, value){
      if(directive[key]) {
        return directive[key];
      } else {
        directive[key] = value;
        return directive[key]
      }
    },

    key : directive
  }
  return api;
})
