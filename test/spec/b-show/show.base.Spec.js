describe('b-show', function () {
  var dom = {
    p : document.querySelector('view[name=page_b-show] P'),
    table : document.querySelector('#page_b-show_table'),
    li : document.querySelector('#page_b-show_list_item')
  }
  var $$scope;
  it('可见状态初始化', function (done) {
    b.views.goTo('page_b-show');
    b.run('page_b-show', function(require, $scope){
      $$scope = $scope;
      $scope.$event = {
        switchi : function(){
          // if (typeof $scope.logined !== 'boolean') {
          //   $scope.logined = false;
          // }
          $scope.logined = !$scope.logined;
        }
      }

      function testInit(){
        expect(window.getComputedStyle(dom.p)['display']).toEqual('none');
        expect(window.getComputedStyle(dom.table)['display']).toEqual('none');
        expect(window.getComputedStyle(dom.li)['display']).toEqual('none');
        Object.unobserve($scope, testInit)
        done();
      }

      Object.observe($scope, testInit);
      $scope.logined = false;
    });
  });

  it('切换可见状态', function(done){

    function toShow(){
        expect(window.getComputedStyle(dom.p)['display']).toEqual('block');
        expect(window.getComputedStyle(dom.table)['display']).toEqual('table');
        expect(window.getComputedStyle(dom.li)['display']).toEqual('list-item');
        Object.unobserve($$scope, toShow);
        done();
    }

    Object.observe($$scope, toShow);
    beacon(dom.p).on('click');
  })



  it('切换隐藏状态', function(done){


    function toHide(){
      expect(window.getComputedStyle(dom.p)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.table)['display']).toEqual('none');
      expect(window.getComputedStyle(dom.li)['display']).toEqual('none');
      Object.unobserve($$scope, toHide)
      done();
    }

    Object.observe($$scope, toHide);

    beacon(dom.p).on('click');
  })

});
