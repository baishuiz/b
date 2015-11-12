Air.Module('core.viewManager', function(require){
	var config     = require('core.config'),
	    scopeList  = require('core.scopeList'),
	    generateScopeTree = require("core.scopeTree"),
	    url        = require('core.url');
	var viewList   = {};
	var viewStatus = {
		active : null,
		count  : 0
	}

	function parseResource (template){
		var content = template.replace(/(href|src)=([\"])([^'"]+)\2/ig, function(src){
		    var result = src.replace("{{resourceUrl}}", config.get("resourceUrl") || "");
		    return result
		});
		return content;
	}

	function loadController(view){
        // load controller
        var scripts = view.querySelectorAll('script');
        scripts = [].slice.call(scripts);
        for (var scriptIndex = scripts.length - 1; scriptIndex >= 0; scriptIndex--) {
          var activeScript = scripts[scriptIndex];

          var tmpScript = document.createElement('script');
          if (activeScript.src) {
            tmpScript.src = activeScript.src;
          } else {
            tmpScript.text = activeScript.text;
          }
          view.appendChild(tmpScript);

          activeScript.parentNode.removeChild(activeScript);
        };
	}

	function append(viewName, template, options){
        var viewport = document.querySelector("viewport[main='true']");
        var view     = document.createElement("view");
        var template = parseResource(template);

        regist(viewName, view, template, options)

        viewStatus.active && viewStatus.active.removeAttribute('active');
        view.setAttribute("active", "true");
        view.setAttribute("name", viewName);
        view.innerHTML = template;
        viewport.appendChild(view);
        viewStatus.count += 1;
        viewStatus.active = view;
		scopeList.init(view, generateScopeTree);
        loadController(view);

	}

	function regist(viewName, view, template, options){
        options = options || {};
        viewList[viewName] = {
        	template : template,
        	view     : view,
        	url      : url.getURLPath(viewName, options)
        }
	}

	function init(){
		var views  = document.querySelectorAll("viewport[main='true'] view");
		for (var viewIndex = 0; viewIndex < views.length; viewIndex++) {
			var view = views[viewIndex];
			var viewName = view.getAttribute('name') || 'view' + viewIndex;
			var template = view.innerHTML;
			regist(viewName, view, template);
		};

      	viewStatus.count  = views.length;
      	viewStatus.active = document.querySelector("viewport[main='true'] view[active='true']");
	}

	function setActive(target){
		viewStatus.active && viewStatus.active.removeAttribute('active');
		target.setAttribute('active','true');
		viewStatus.active = target;
	}

	function show(viewName, options){
        var urlPath = url.getURLPath(viewName, options);
        var targetView = viewList[viewName];
        // return targetView;
        if (targetView && targetView.url === urlPath){
        	setActive(targetView.view);
            return targetView;
        } else if(targetView && targetView.url !== urlPath){
            removeSingle(viewName);
            append(viewName, targetView.template, options);
            return targetView;
        }

	}



    function removeAll(){
        for(var viewName in viewList){
        	removeSingle(viewName)
        }
        viewStatus.active = null;
        viewStatus.count  = 0;
    }

    function removeSingle(viewName){
    	var view =  viewList[viewName].view;
    	view.parentNode.removeChild(view);
    	delete viewList[viewName];
    	viewStatus.count -= 1;
        if(	view.getAttribute("active")==="true"){
        	viewStatus.active = null;
        }
    }



    Air.domReady(function(){
    	init();
    });

	var api = {
		append : append,
		show   : show,
		getCount : function(num){
			viewStatus.count = num || viewStatus.count;
			return viewStatus.count
		},

		getActive : function(){
			return viewStatus.active
		},

		remove : function(viewName){
			var view = viewList[viewName];
            viewName ? removeSingle(viewName) : removeAll()
		}


	}


	return api;
});
