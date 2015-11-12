Air.Module('utility.switchStyle', function(require) {
    var switchStyle = (function(){
        var css = '[ng-app] { text-indent: -10000%; background-color: #eee; }',
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

            hide : function() {
              style.disabled = true;
            }
        }
   }());

    return switchStyle;
});
