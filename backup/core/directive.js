Air.Module("core.directive", function(){
  var directive = {
        app        : "ng-app",
        controller : "ng-controller"
  };

  var api = {
    signup : function(key, value){
      directive[key] = directive[key] || value;
      return directive[key];
    },

    key : directive
  }
  return api;
})