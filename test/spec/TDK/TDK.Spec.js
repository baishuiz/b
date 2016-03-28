describe('TDK', function () {
  it('设置 title', function () {
    b.TDK.setTitle('title test done');
    expect(document.title).toEqual('title test done');
  });

  it('设置 keywords', function () {
    b.TDK.setKeywords('b, test, hello');
    var keywords = document.head.querySelector('meta[name=keywords]').content;
    expect(keywords).toEqual('b, test, hello');
  });

  it('设置 description', function () {
    b.TDK.setDescription('this is description test');
    var description = document.head.querySelector('meta[name=description]').content;
    expect(description).toEqual('this is description test');
  });

});
