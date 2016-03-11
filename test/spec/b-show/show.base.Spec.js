describe('b-show', function () {
  var dom = {
    p : document.querySelector('view[name=page_b-show] P'),
    table : document.querySelector('#page_b-show_table'),
    li : document.querySelector('#page_b-show_list_item')
  }
  it('可见状态初始化', function (done) {
    b.views.goTo('page_b-show');
    b.run('page_b-show', function(require, $scope){
      $scope.$event = {
        switchi : function(){
          if (typeof $scope.logined !== 'boolean') {
            $scope.logined = false;
          }
          $scope.logined = !$scope.logined;
        }
      }

      setTimeout(function(){
        expect(window.getComputedStyle(dom.p)['display']).toEqual('none');
        expect(window.getComputedStyle(dom.table)['display']).toEqual('none');
        expect(window.getComputedStyle(dom.li)['display']).toEqual('none');
        done();
      }, 0);
    });
  });

  it('切换可见状态', function(done){
    beacon(dom.p).once('click', function(){
      expect(window.getComputedStyle(dom.p)['display']).toEqual('block');
      expect(window.getComputedStyle(dom.table)['display']).toEqual('table');
        expect(window.getComputedStyle(dom.li)['display']).toEqual('list-item');
      done();
    });

    beacon(dom.p).on('click');
  })

  it('再次切换隐藏和可见状态', function(done){
    beacon(dom.p).once('click', function(){
      expect(window.getComputedStyle(dom.p)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.table)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.li)['display']).toEqual('none');

      setTimeout(function(){
        beacon(dom.p).once('click', function(){
          expect(window.getComputedStyle(dom.p)['display']).toEqual('block');
          expect(window.getComputedStyle(dom.table)['display']).toEqual('table');
          expect(window.getComputedStyle(dom.li)['display']).toEqual('list-item');

          done();
        });

        beacon(dom.p).on('click');
      }, 0);
    });

    beacon(dom.p).on('click');
  })
});
