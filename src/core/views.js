Air.Module('core.views', function(require){
  var Request = require('core.network.request'),
      router  = require('core.router'),
      config  = require('core.config');
  var api = {
    EVENTS : {
      SHOWED : beacon.createEvent("view showed")
    },
    router : router,
    count:0,
    init : function(urlPath){
      urlPath = urlPath || window.location.pathname;
      var target = document.querySelector("viewport[main='true'] view[active='true']");
      if(!target){
        api.count = 0
        var viewInfo = router.match(urlPath);
        if(viewInfo){
          var viewport = document.createElement("viewport");
          viewport.setAttribute('main', 'true');
          document.body.appendChild(viewport);
          api.goto(viewInfo.viewName);
        }  
      }
    },
    goto : function(viewName){


          var target = document.querySelector("viewport[main='true'] view[name='"+ viewName + "']");

          if(target){
            setActive();
          } else {
            var request = new Request();
            beacon(request).once(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
              if(data.data){
                api.active && api.active.removeAttribute('active');
                var viewport = document.querySelector("viewport[main='true']");
                var view = document.createElement("view");
                view.setAttribute("active", "true");
                view.setAttribute("name", viewName);
                view.innerHTML = data.data;


                viewport.appendChild(view);
                api.count += 1;
                api.active = view;
                beacon.on(api.EVENTS.SHOWED);
              }
            });

            var sign = router.getSign(viewName);
            sign = sign && "." + sign;
            request.get(config.get("templatePath") + viewName + sign);

          }
          //target ? setActive : request.get("http://m.ctrip.com/webapp/hotel/");
          function setActive(){
            api.active && api.active.removeAttribute('active');
            target.setAttribute('active','true');

            api.active = target;
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
