Air.Module('core.views', function(require){
  var Request           = require('core.network.request'),
      router            = require('core.router'),
      scopeList         = require('core.scopeList'),
      url               = require('core.url'),
      util              = require('utility.util'),
      generateScopeTree = require("core.scopeTree"),
      config            = require('core.config'),
      viewManage        = require('core.viewManager');


  function getTemplate (viewName, options){
    var request = new Request();
    beacon(request).once(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
      var viewTemplate = data.data
      viewTemplate && viewManage.append(viewName, viewTemplate, options);
      beacon.on(api.EVENTS.SHOWED, {viewName : viewName});
      style.show();
      options.popstate || url.change(viewName, options);
    });

    var sign = router.getSign(viewName);
    sign = sign && "_" + sign;
    request.get(config.get("templatePath") + viewName + sign + ".html");
  }


  function scrollTop () {
    setTimeout(function(){
      window.scrollTo(0, 0);
    }, 0);
  };


   var  style = (function(){
        var css = '[ng-app] { text-indent: -100%; background-color: #eee; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);   
        return  {
            show : function(){
              style.disabled = false;
            },

            hidden : function() {
              style.disabled = true;
            }
        } 
   }());


  var api = {
    EVENTS : {
      SHOWED : beacon.createEvent(""),
      SHOWEBEFOR : beacon.createEvent("")
    },

    router : router,
    
    init : function(urlPath){
      urlPath = urlPath || window.location.pathname;
      var params = util.enums(urlPath.replace(/^\/|\/$/,'').split("/"))
      var query = router.getQueryString();
      var viewport = document.querySelector("viewport[main='true']");
      if (!viewport) {
          viewport = document.createElement("viewport");
          viewport.setAttribute('main', 'true');
          document.body.appendChild(viewport);
      }
      var target = viewport.querySelector("view[active='true']");
      if(!target){
        api.getCount(0);
        var viewInfo = router.match(urlPath);
        if(viewInfo){
          api.goto(viewInfo.viewName, {
            params:viewInfo.params,
            query:query,
            replace:true
          });
        }
      }
    },

    goto : function(viewName, options){
          options = options || {};
          beacon.on(api.EVENTS.SHOWEBEFOR, {viewName : viewName});
          style.hidden();
          // var urlPath = url.getURLPath(viewName, options);
          var targetView = viewManage.show(viewName, options)
          if(targetView){
            options.popstate || url.change(viewName, options);
            scrollTop();
            beacon.on(api.EVENTS.SHOWED, {viewName : viewName});
            style.show();
          } else {
            getTemplate(viewName, options);
          }
    },

    remove   : viewManage.remove,    
    getCount : viewManage.getCount,
    getActive: viewManage.getActive
  }

  return api;
});
