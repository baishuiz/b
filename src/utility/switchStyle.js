Air.Module('utility.switchStyle', function(require) {
    var config = require('core.config');
    var switchStyle = (function(){
        var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        style.type = 'text/css';
        var appendStyle = function() {
          var css = config.get('switchStyle') || '[ng-app] { text-indent: -10000%; background-color: #eee; }';
          if (style.styleSheet){
            style.styleSheet.cssText = css;
          } else {
            if (style.styleSheet) {
              style.styleSheet.cssText = '';
            } else {
              style.innerText = '';
            }
            style.appendChild(document.createTextNode(css));
          }
        }

        head.appendChild(style);
        return  {
            show : function(){
              appendStyle();
              style.disabled = false;
            },

            hide : function() {
              style.disabled = true;
              if (style.styleSheet) {
                style.styleSheet.cssText = '';
              } else {
                style.innerText = '';
              }
            }
        }
   }());

    return switchStyle;
});
