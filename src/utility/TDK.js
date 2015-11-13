Air.Module('utility.TDK', function(require){
  function setTDK(tdk) {
    if (!tdk) {
      return;
    }
    document.title = tdk.title || '';
    var head = document.getElementsByTagName('head')[0];
    var descriptionTag = head.querySelector('meta[name="description"]');
    var keywordsTag = head.querySelector('meta[name="keywords"]');
    descriptionTag && descriptionTag.setAttribute('content', tdk.description || '');
    keywordsTag && keywordsTag.setAttribute('content', tdk.keywords || '');
  }

  return {
    set: setTDK
  }
});
