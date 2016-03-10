describe('b-show', function () {
  var dom = {
    p : document.querySelector('view[name=page_b-show] P')
  }
  it('可见状态初始化', function (done) {
    b.run('page_b-show', function(require, $scope){
      $scope.logined = false;
      $scope.$event = {
        switchi : function(){
          $scope.logined = !$scope.logined;
        }
      }


      setTimeout(function(){
        expect(dom.p.style.display).toEqual('none');
        done();
      }, 0);
    });
  });

  it('切换可见状态', function(done){
    beacon(dom.p).once('click', function(){
      expect(dom.p.style.display).toEqual('block');
      done();
    });

    beacon(dom.p).on('click');
  })
});
