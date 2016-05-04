Air.Module("B.util.node", function(){
  var node = function(node){
      var api = {
        hasAttribute : function(attributeName){
          return node.attributes.getNamedItem(attributeName);
        }
      };
      return api;
  };

  node.type = {
      TEXT : 3,
      HTML : 1,
      ATTR : 2
  }
  return node;
});
