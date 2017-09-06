describe('b-exist', function () {
  it('可见状态初始化', function () {
    b.views.goTo('page_b-exist');
    b.run('page_b-exist', function(require, $scope){


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

      var dom = {
        p : document.querySelector('view[name=page_b-exist] .p1'),
        table : document.querySelector('#page_b-exist_table'),
        li : document.querySelector('#page_b-exist_list_item'),
        p2 : document.querySelector('view[name=page_b-exist] .p2'),
        p3 : document.querySelector('view[name=page_b-exist] .p3'),
        p4 : document.querySelector('view[name=page_b-exist] .p4')
      }


      expect(dom.p2).not.toBeNull();
      expect(dom.p3).toBeNull();
      expect(dom.p4).not.toBeNull();

      // setTimeout(function(){
      //   $scope.count = 2;
      //   $scope.node={num:2}
      //
      //   expect(dom.p).toBeNull();
      //   expect(dom.table).toBeNull();
      //   expect(dom.li).toBeNull();
      //
      //   setTimeout(function(){
      //     expect(dom.p2).not.toBeNull();
      //     expect(dom.p3).toBeNull();
      //     done();
      //   }, 0);
      // }, 0);

      $scope.logined = false;
    });
  });

  // it('切换可见状态', function(done){
  //
  //   setTimeout(function(){
  //       expect(dom.p).not.toBeNull();
  //       expect(dom.table).toEqual('table');
  //       expect(dom.li).toEqual('list-item');
  //       done();
  //   }, 1000);
  //
  //   beacon(dom.p).on('click');
  // })
  //
  //
  //
  // it('切换隐藏状态', function(done){
  //
  //   setTimeout(function(){
  //     expect(dom.p).toBeNull();
  //     expect(dom.table).toBeNull();
  //     expect(dom.li).toBeNull();
  //     done();
  //   }, 1000);
  //
  //   beacon(dom.p).on('click');
  // })

});
