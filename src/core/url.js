Air.Module('core.url', function(require){
	var router = require('core.router');
	var EVENTS = require('core.event');

	//window.onpopstate = function(event) {

	var api = {
		change : function(viewName, options){
			options    = options || {};
            var params = options.params || {};
            var query  = options.query || "";
            // detail/:id/:name/:price
            var routerRule = router.getRule(viewName);

            if(routerRule){
		        var urlPath = routerRule.replace(/:(\w+)/ig, function(param, key){
		                      return params[key] || ""
		            });

	            urlPath = urlPath.replace(/\/\/+/g,"/");
	            urlPath = location.origin + urlPath + query;
	            var fromURL  = location.href;
	            var stateObj = {viewName: viewName};
	            if(options.replace==true){
                    history.replaceState(stateObj, "viewName", urlPath);
	            }else{
	                history.pushState(stateObj, "viewName", urlPath);
	            }

	            beacon.on(EVENTS.URL_CHANGE, {
	            	from : fromURL,
	            	to   : urlPath
	            });


			}
		}
	};

	return api;
})
