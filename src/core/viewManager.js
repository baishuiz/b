Air.Module('core.viewManager', function(require){
    var config            = require('core.config'),
        scopeList         = require('core.scopeList'),
        generateScopeTree = require("core.scopeTree"),
        url               = require('core.url'),
        switchStyle       = require('utility.switchStyle');
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

    function loadStyle(template) {
        // IE 8 不支持直接innerHTML加载样式
        if (document.createStyleSheet) {
            var matched = template.match(/(<link[^>]+=["'])(\S+.css)(["'][^>]*>)/g) || [];
            for (var i = 0, len = matched.length, link; i < len; i++) {
                link = matched[i];
                var path = link.match(/(<link[^>]+=["'])(\S+.css)(["'][^>]*>)/) || [];
                var filePath = path[2];
                if (filePath) {
                    document.createStyleSheet(filePath);
                }
            }
        }
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
        loadStyle(template);
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
        viewStatus.viewName = viewName;
        // return targetView;
        if (targetView && targetView.url === urlPath){
            setActive(targetView.view);
            return targetView;
        } else if(targetView && targetView.url !== urlPath){
            if (!options.noRender) {
                removeSingle(viewName);
                switchStyle.show();
                append(viewName, targetView.template, options);
            }
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
        unbind(view);
        view.parentNode.removeChild(view);
        delete viewList[viewName];
        viewStatus.count -= 1;
        if(    view.getAttribute("active")==="true"){
            viewStatus.active = null;
        }
    }

    function unbind(view){
        for(var i=0; i<view.childNodes.length; i++){
            beacon(view.childNodes[i]).off();
            unbind(view.childNodes[i]);
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

        getViewName : function () {
          return viewStatus.viewName
        },

        remove : function(viewName){
            var view = viewList[viewName];
            viewName ? removeSingle(viewName) : removeAll()
        }


    }


    return api;
});
