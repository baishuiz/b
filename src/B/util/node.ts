Air.Module("B.util.node", function(){
  let node:any = function(node:Element){
      let api = {
        hasAttribute : function(attributeName:string){
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
