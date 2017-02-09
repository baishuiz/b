describe('b-show', function () {
  var dom = {
    p : document.querySelector('view[name=page_b-show] .p1'),
    table : document.querySelector('#page_b-show_table'),
    li : document.querySelector('#page_b-show_list_item'),
    p2 : document.querySelector('view[name=page_b-show] .p2'),
    p3 : document.querySelector('view[name=page_b-show] .p3'),
    p4 : document.querySelector('view[name=page_b-show] .p4')
  }
  it('可见状态初始化', function (done) {
    b.views.goTo('page_b-show');
    b.run('page_b-show', function(require, $scope){
      $scope.count = 0;
      $scope.node={num:1}
      $scope.$event = {
        switchi : function(){
          // if (typeof $scope.logined !== 'boolean') {
          //   $scope.logined = false;
          // }
          $scope.logined = !$scope.logined;
        }
      }


      expect(window.getComputedStyle(dom.p2)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.p3)['display']).toEqual('block');
      expect(window.getComputedStyle(dom.p4)['display']).toEqual('none');

      setTimeout(function(){
        $scope.count = 2;
        $scope.node={num:2}

        expect(window.getComputedStyle(dom.p)['display']).toEqual('none');
        expect(window.getComputedStyle(dom.table)['display']).toEqual('none');
        expect(window.getComputedStyle(dom.li)['display']).toEqual('none');

        setTimeout(function(){
          expect(window.getComputedStyle(dom.p2)['display']).toEqual('block');
          expect(window.getComputedStyle(dom.p3)['display']).toEqual('none');
          done();
        }, 0);
      }, 0);

      $scope.logined = false;
    });
  });

  it('切换可见状态', function(done){

    setTimeout(function(){
        expect(window.getComputedStyle(dom.p)['display']).toEqual('block');
        expect(window.getComputedStyle(dom.table)['display']).toEqual('table');
        expect(window.getComputedStyle(dom.li)['display']).toEqual('list-item');
        done();
    }, 1000);

    beacon(dom.p).on('click');
  })



  it('切换隐藏状态', function(done){

    setTimeout(function(){
      expect(window.getComputedStyle(dom.p)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.table)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.li)['display']).toEqual('none');
      done();
    }, 1000);

    beacon(dom.p).on('click');
  })

});
