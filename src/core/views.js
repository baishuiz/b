Air.Module('core.views', function(require){
  var Request = require('core.network.request'),
      router  = require('core.router'),
      scopeList = require('core.scopeList'),
      url       = require('core.url'),
      util      = require('utility.util'),
      generateScopeTree = require("core.scopeTree"),
      config  = require('core.config');
  var api = {
    EVENTS : {
      SHOWED : beacon.createEvent("view showed")
    },
    router : router,
    count:0,
    init : function(urlPath){
      urlPath = urlPath || window.location.pathname;
      var params = util.enums(urlPath.replace(/^\/|\/$/,'').split("/"))
      var viewport = document.querySelector("viewport[main='true']");
      if (!viewport) {
          viewport = document.createElement("viewport");
          viewport.setAttribute('main', 'true');
          document.body.appendChild(viewport);
      }
      var target = viewport.querySelector("view[active='true']");
      if(!target){
        api.count = 0
        var viewInfo = router.match(urlPath);
        if(viewInfo){
          api.goto(viewInfo.viewName, {params:viewInfo.params, replace:true});
        }
      }
    },
    goto : function(viewName, options){

          options = options || {};
          var target = document.querySelector("viewport[main='true'] view[name='"+ viewName + "']");
          var scrollTop = function () {
            setTimeout(function(){
              window.scrollTo(0, 0);
            }, 0);
          };

          if(target){
            setActive();
          } else {
            var request = new Request();
            beacon(request).once(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
              if(data.data){
                // replace resource
                data.data = data.data.replace(/(href|src)=([\"])([^'"]+)\2/ig, function(src){
                    var result = src.replace("{{resourceUrl}}", config.get("resourceUrl") || "");
                    return result
                });

                api.active && api.active.removeAttribute('active');
                var viewport = document.querySelector("viewport[main='true']");
                var view = document.createElement("view");
                view.setAttribute("active", "true");
                view.setAttribute("name", viewName);
                view.innerHTML = data.data;


                viewport.appendChild(view);
                api.count += 1;
                api.active = view;

                // generateScopeTree(view, $scope)
                scopeList.init(view, generateScopeTree);

                // load controller
                var scripts = view.querySelectorAll('script');
                scripts = [].slice.call(scripts);
                for (var scriptIndex = scripts.length - 1; scriptIndex >= 0; scriptIndex--) {
                  var activeScript = scripts[scriptIndex];

                  if (activeScript.src) {
                    Air.loadJS(activeScript.src);
                  } else {
                    var tmpScript = document.createElement('script');
                    tmpScript.text = activeScript.text;
                    document.getElementsByTagName('head')[0].appendChild(tmpScript);
                  }

                  activeScript.parentNode.removeChild(activeScript);
                };
                options.popstate || url.change(viewName, options);
                scrollTop();
                beacon.on(api.EVENTS.SHOWED, {viewName : viewName});
              }
            });

            var sign = router.getSign(viewName);
            sign = sign && "_" + sign;
            request.get(config.get("templatePath") + viewName + sign + ".html");

          }
          //target ? setActive : request.get("http://m.ctrip.com/webapp/hotel/");
          function setActive(){
            api.active && api.active.removeAttribute('active');
            target.setAttribute('active','true');

            api.active = target;
            options.popstate || url.change(viewName, options);
            scrollTop();
            beacon.on(api.EVENTS.SHOWED, {viewName : viewName});
          }
    },
    active : null
  }

  Air.domReady(function(){

      var views = document.querySelectorAll("viewport[main='true'] view");
      api.count = views.length;
      api.active = document.querySelector("viewport[main='true'] view[active='true']");
  });

  return api;
});
