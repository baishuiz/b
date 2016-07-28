describe('b-style', function () {
  var dom = {
    p : document.querySelector('view[name=page_b-style] P'),
    table : document.querySelector('#page_b-style_table'),
    li : document.querySelector('#page_b-style_list_item')
  }
  var $$scope;
  it('可见状态初始化', function (done) {
    b.views.goTo('page_b-style');
    b.run('page_b-style', function(require, $scope){
      $$scope = $scope;
      $scope.$event = {
        switchi : function(){
          // if (typeof $scope.logined !== 'boolean') {
          //   $scope.logined = false;
          // }
          $scope.logined = ($scope.logined === 'none') ? 'block' : 'none';
        }
      }

      setTimeout(function(){
        expect(window.getComputedStyle(dom.p)['display']).toEqual('none');

        done();
      }, 1000);

      $scope.logined = 'none';
    });
  });

  it('切换可见状态', function(done){

    setTimeout(function(){
        expect(window.getComputedStyle(dom.p)['display']).toEqual('block');
        done();
    }, 1000);

    beacon(dom.p).on('click');
  })



  it('切换隐藏状态', function(done){

    setTimeout(function(){
      expect(window.getComputedStyle(dom.p)['display']).toEqual('none');

      done();
    }, 1000);

    beacon(dom.p).on('click');
  })

});
