Air.Module("utility.node", function(){
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
      HTML : 1
  }
  return node;
});
