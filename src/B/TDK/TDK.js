Air.Module("B.TDK.TDK", function() {
  var docHead = document.head || document.getElementsByTagName('head')[0];
  function setTitle(title) {
    document.title = title || document.title;
    return document.title;
  }

  function setDescription(description) {
    var descElement = getMetaElement('description')
    descElement.content = description || descElement.content;
    return descElement.content;
  }

  function setKeywords(keywords) {
    var keywordElement = getMetaElement('keywords')
    keywordElement.content = keywords || keywordElement.content;
    return keywordElement.content;
  }

  function getMetaElement(metaName) {
    var element = docHead.querySelector('meta[name=' + metaName + ']');
    element = element || createMetaElement(metaName);
    return element;
  }

  function createMetaElement(metaName) {
    var element = document.createElement('meta');
    element.setAttribute('name', metaName);
    docHead.appendChild(element);
    return element;
  }

  var api = {
    setTitle: setTitle,
    setDescription: setDescription,
    setKeywords: setKeywords
  }
  return api;
});
