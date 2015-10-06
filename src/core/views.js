Air.Module('core.views', function(require){
  var Request = require('core.network.request');
  var api = {
    EVENTS : {
      SHOWED : beacon.createEvent("view showed")
    },
    count:0,
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
                api.count +=1;
                api.active = view;
                beacon.on(api.EVENTS.SHOWED);
              }
            });

            request.get("http://m.ctrip.com/webapp/hotel/");

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
