Air.Module("core.scope", function(){
	var Scope = function(parent){
    
	}

	var api = function(parent){
        Scope.prototype = parent || {};
        return new Scope(parent);    
	}
	return api;
})