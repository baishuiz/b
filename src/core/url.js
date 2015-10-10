Air.Module('core.url', function(require){
	var router = require('core.router');
	var EVENTS = require('core.event');

	//window.onpopstate = function(event) {

	var api = {
		change : function(viewName, options){
			options = options || {};
            var params = options.params;
            var query  = options.query || "";
            // detail/:id/:name/:price
            var routerRule = router.getParams(viewName);

            if(routerRule){
                var urlPath
                if(params){
		            urlPath = routerRule.replace(/:(\w+)/ig, function(param, key){
		                      return params[key]
		            });
	            } else {
	            	urlPath = "/" + viewName;
	            }
	            
	            urlPath = location.origin + urlPath + query;
	            var fromURL  = location.href;
	            var stateObj = {viewName: viewName};
	            history.pushState(stateObj, "viewName", urlPath);
	            beacon.on(EVENTS.URL_CHANGE, {
	            	from : fromURL,
	            	to   : urlPath
	            });


			}
		}
	};

	return api;
})