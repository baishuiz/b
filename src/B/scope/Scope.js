Air.Module('B.data.Scope', function() {
    var Scope = function(){
      var parentScope;
      this.getParent = function(){
        return parentScope;
      };

      this.setParent = function(parent){
          parentScope = parent;
      }
    }
    return Scope;
});
