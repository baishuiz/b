Air.Module('B.scope.Scope', function() {
  var Scope = function(parent){
    this.parent = parent
  }

  var api = function(parent){
        Scope.prototype = parent || {};
        return new Scope(parent);
  }
  return api;
});
