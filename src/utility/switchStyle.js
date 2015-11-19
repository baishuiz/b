Air.Module('utility.switchStyle', function(require) {
    var switchStyle = (function(){
        var css = '[ng-app] { text-indent: -10000%; background-color: #eee; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        style.type = 'text/css';
        var appendStyle = function() {
          if (style.styleSheet){
            style.styleSheet.cssText = css;
          } else {
            style.innerText = '';
            style.appendChild(document.createTextNode(css));
          }
        }

        head.appendChild(style);
        return  {
            show : function(){
              style.disabled = false;
              appendStyle();
            },

            hide : function() {
              style.disabled = true;
              style.innerText = '';
            }
        }
   }());

    return switchStyle;
});
