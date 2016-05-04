Air.Module('core.network.request', function(){

    var state = {
      unInit    : 0,
      opend     : 1,
      sended    : 2,
      receiving : 3,
      complete  : 4
    }

    var events = {
      REQUEST_COMPLETE : beacon.createEvent("request complete")
    };

    function XHR(){
        var xhr = new XMLHttpRequest();
        var request = this;
        xhr.onreadystatechange = function(){
          if(xhr.readyState === state.complete) {
            if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
                beacon(request).on(events.REQUEST_COMPLETE, {data:xhr.responseText, xhr:xhr});
            } else {
                beacon(request).on(events.REQUEST_COMPLETE, {err:xhr.status, xhr:xhr});
            }
          }
        };
        this.xhr = xhr;
    }

     XHR.prototype = {

         request : function(options){
            this.xhr.open(options.method, options.url, true);
            for (var key in options.header){
              this.xhr.setRequestHeader(key, options.header[key]);
            }
            this.xhr.send(options.data);
         },

         get  : function(url,data){
              this.request({
                    method: 'GET',
                    url   : url,
                    data  : data
              });
         }
     }
    XHR.EVENTS  = events
    return XHR;
});
