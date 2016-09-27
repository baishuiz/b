describe('select-option', function () {
  var dom = {
    select : document.querySelector('view[name=page_select-option] select')
  }
  it('异步修改 option 数据', function (done) {
    b.views.goTo('page_select-option');
    b.run('page_select-option', function(require, $scope){
      $scope.initNum = '100';
      setTimeout(function(){
          $scope.nums = [600,100,200];
          setTimeout(function(){
            expect(dom.select.value).toEqual('100');
            done();
          },0);

      }, 1000);
    });
  });


});
