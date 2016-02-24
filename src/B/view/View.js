Air.Module("B.view.View", function(){

  function createDomByString(templeteString){
    var div = document.createElement('div');
    div.innerHTML = templeteString;
    var dom = div.childNodes[0];
    return dom;
  }

  function loadScript(dom, fn) {
    var jsList = splitJS(dom);
    runJS(jsList);
    fn && fn();
  }

  function runJS(JSList){
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

  function splitJS(dom){
      var scripts = dom.querySelectorAll('script');
      scripts = [].slice.call(scripts);
      return scripts
  }

  function View(dom, options){
    options = options || {};
    if (beacon.isType(dom, 'String')) {
      dom = createDomByString(dom);
      loadScript(dom, options.initCallback);
    }
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
