Air.Module("B.TDK.TDK", function() {
  let docHead = document.head || document.getElementsByTagName('head')[0];
  function setTitle(title:string) {
    document.title = title || document.title;
    return document.title;
  }

  function setDescription(description:string) {
    let descElement:any = getMetaElement('description')
    descElement.content = description || descElement.content;
    return descElement.content;
  }

  function setKeywords(keywords:string) {
    let keywordElement:any = getMetaElement('keywords')
    keywordElement.content = keywords || keywordElement.content;
    return keywordElement.content;
  }

  function getMetaElement(metaName:string) {
    let element = docHead.querySelector('meta[name=' + metaName + ']');
    element = element || createMetaElement(metaName);
    return element;
  }

  function createMetaElement(metaName:string) {
    let element = document.createElement('meta');
    element.setAttribute('name', metaName);
    docHead.appendChild(element);
    return element;
  }

  let api = {
    setTitle: setTitle,
    setDescription: setDescription,
    setKeywords: setKeywords
  }
  return api;
});
