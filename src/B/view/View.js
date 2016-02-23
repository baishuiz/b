Air.Module("B.view.View", function(){

  function View(dom){
    // var dom = null,
    var templete = null,
        router = null,
        initQueue = [],
        showBeforeQueue = [],
        showAfterQueue = [],
        hideQueue =[]

        this.show = function (){
          dom.setAttribute('active','true');
        },

        this.hide = function(){
          dom.removeAttribute('active');
        },

        this.init = function (){},

        this.onInit = function (){},

        this.onShowBefore = function (){},

        this.onShowAfter = function (){},

        this.onHide = function (){},

        this.getTemplete = function (){},

        this.runcontroller = function (){}

        this.getDom = function (){
          return dom;
        }

  }

  return View;

});
