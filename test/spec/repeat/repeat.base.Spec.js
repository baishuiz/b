describe('repeat', function () {

  it('repeat 基础', function (done) {
    b.run('page_repeat', function(require, $scope){
      $scope.notice = ", welcome";
      $scope.list = [
        {
          name: 'Name 1'
        },
        {
          name: 'Name 2'
        },
        {
          name: 'Name 3'
        }
      ];

      $scope.a = {
        b: {
          list :[
            {name: 'T1'},
            {name: 'T2'},
            {name: 'T3'}
          ]
        }
      }

      var dom = {
        list : document.querySelector('view[name=page_repeat]>ul'),
        listB: document.querySelector('view[name=page_repeat]>.listB')
      }

      setTimeout(function(){
        expect(dom.list.querySelectorAll('li').length).toEqual(3);
        expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 1');
        expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 2');
        expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 3');
        expect(dom.list.querySelector('li:nth-child(3)').getAttribute('name')).toEqual('Name 3, welcome');


        expect(dom.listB.querySelectorAll('span').length).toEqual(3);
        expect(dom.listB.querySelector('span:nth-child(1)').innerText.trim()).toEqual('T1');
        expect(dom.listB.querySelector('span:nth-child(2)').innerText.trim()).toEqual('T2');
        expect(dom.listB.querySelector('span:nth-child(3)').innerText.trim()).toEqual('T3');
        // expect(dom.listB.querySelector('li:nth-child(3)').getAttribute('name')).toEqual('Name 3, welcome');
        done();
      }, 1000);
    });
  });


  it('repeat 嵌套', function (done) {
    b.run('page_repeat_in_repeat', function(require, $scope){
      $scope.list1 = [
        {
          name: 'Name 1-1'
        },
        {
          name: 'Name 1-2'
        },
        {
          name: 'Name 1-3'
        }
      ];
      $scope.list2 = [
        {
          name: ' Name 2-1'
        },
        {
          name: ' Name 2-2'
        },
        {
          name: ' Name 2-3'
        }
      ];

      var view = document.querySelector('view[name=page_repeat_in_repeat]');

      setTimeout(function(){
        expect(view.querySelectorAll('.list1').length).toEqual(3);
        expect(view.querySelectorAll('.list2').length).toEqual(9);
        expect(view.querySelector('.list1:nth-child(2) .list2:nth-child(2)').innerText.trim()).toEqual('Name 1-2 Name 2-2');
        done();
      }, 1000);
    });
  });


  it('repeat 相邻', function (done) {
    b.run('page_repeat_nearby_repeat', function(require, $scope){
      $scope.list1 = [
        {
          name: 'Name 1-1'
        },
        {
          name: 'Name 1-2'
        },
        {
          name: 'Name 1-3'
        }
      ];
      $scope.list2 = [
        {
          name: ' Name 2-1'
        },
        {
          name: ' Name 2-2'
        },
        {
          name: ' Name 2-3'
        }
      ];

      var view = document.querySelector('view[name="page_repeat_nearby_repeat"]');

      setTimeout(function(){
        expect(view.querySelectorAll('.list1 li').length).toEqual(3);
        expect(view.querySelectorAll('.list2 li').length).toEqual(3);
        expect(view.querySelector('.list1 li:nth-child(2)').innerText.trim()).toEqual('Name 1-2');
        expect(view.querySelector('.list2 li:nth-child(2)').innerText.trim()).toEqual('Name 2-2');
        done();
      }, 1000);
    });
  });

  it('repeat 元素上绑定事件', function(done){
    b.run('page_repeat_with_event_outer', function(require, $scope){
      var dom = {
        list : document.querySelector('view[name=page_repeat_with_event_outer]>ul'),
        listB: document.querySelector('view[name=page_repeat]>.listB')
      }
      $scope.list = [
        {
          name: 'Name 11'
        },
        {
          name: 'Name 22'
        },
        {
          name: 'Name 33'
        }
      ];

      $scope.a = {
        b: {
          list :[
            {name: 'D1'},
            {name: 'D2'},
            {name: 'D3'}
          ]
        }
      }


      $scope.$event = {
        'clickHandle' : function(e, msg){
          // $scope.list[this.$index] = { name: msg };
          // $scope.list[3] = { name: 'Name 44'};

          a = [
            {
              name: 'Name 11'
            },
            {
              name: 'Name 22'
            },
            {
              name: 'Name 33'
            }
          ];

          a[this.$index] = { name: msg };
          a[3] = { name: 'Name 44'};
          $scope.list = a;

          $scope.a.b = {
              list :[
                {name: 'T1'},
                {name: 'T2'},
                {name: 'T3'}
              ]
          }

        }
      }
      //
      setTimeout(function(){
        expect(dom.list.querySelectorAll('li').length).toEqual(3);
        expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
        expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
        expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');

        Object.observe($scope, function(x){
          expect(dom.list.querySelectorAll('li').length).toEqual(4);
          expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
          expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
          expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('good');
          expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 44');

          expect(dom.listB.querySelectorAll('span').length).toEqual(3);
          expect(dom.listB.querySelector('span:nth-child(1)').innerText.trim()).toEqual('T1');
          expect(dom.listB.querySelector('span:nth-child(2)').innerText.trim()).toEqual('T2');
          expect(dom.listB.querySelector('span:nth-child(3)').innerText.trim()).toEqual('T3');
          done();
        });
        var target = dom.list.querySelector('li:nth-child(3)');
        beacon(target).on('click');

      }, 0);

    })

  });

  it('repeat 元素内的其他元素绑定事件', function(done){
    b.run('page_repeat_with_event_inner', function(require, $scope){
      var dom = {
        list : document.querySelector('view[name=page_repeat_with_event_inner]>ul')
      }
      $scope.lista = [
        {
          name: 'Name 11'
        },
        {
          name: 'Name 22'
        },
        {
          name: 'Name 33'
        }
      ];


      $scope.$event = {
        'clickHandle' : function(e){
          $scope.lista[this.$index] = { name: 'good' };
          $scope.lista[3] = { name: 'Name 44'};
          setTimeout(function(){
            expect(dom.list.querySelectorAll('li').length).toEqual(4);
            expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
            expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
            expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('good');
            expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 44');
            done();
          }, 1000);
        }
      }

      setTimeout(function(){
        expect(dom.list.querySelectorAll('li').length).toEqual(3);
        expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
        expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
        expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');

        var target = dom.list.querySelector('li:nth-child(3)>a');
        beacon(target).on('click');
      }, 0);

    })

  });

  it('repeat 内外互相修改数据', function(done){
    b.run('page_repeat_with_data', function(require, $scope){
      $scope.notice = 'Hello World';
      var dom = {
        title : document.querySelector('view[name=page_repeat_with_data]>.title'),
        list : document.querySelector('view[name=page_repeat_with_data]>ul')
      }
      $scope.list = [
        {
          name: 'Name 11'
        },
        {
          name: 'Name 22'
        },
        {
          name: 'Name 33'
        }
      ];


      $scope.$event = {
        'titleClickHandle' : function(e) {
          $scope.list[3] = { name: 'Name 44'};

          setTimeout(function(){
            expect(dom.list.querySelectorAll('li').length).toEqual(4);
            expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
            expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
            expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');
            expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 44');

            beacon(dom.list.querySelector('li:nth-child(4)>a')).on('click');
          }, 1000);
        },
        'itemClickHandle' : function(e){
          $scope.notice = 'Hello ' + this.$index;

          setTimeout(function(){
            expect(dom.list.querySelectorAll('li').length).toEqual(4);
            expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
            expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
            expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');
            expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 44');
            expect(dom.title.innerText).toEqual('Hello 3');
            done();
          }, 1000);
        }
      }

      setTimeout(function(){
        // expect(dom.title.innerText).toEqual('Hello World');
        // expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
        // expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
        // expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');

        beacon(dom.title).on('click');
      }, 1000);

    })

  });


  it('repeat 嵌套内绑定的事件', function (done) {
    b.run('page_repeat_in_repeat_event', function(require, $scope){
      $scope.notice = 'Hello';
      $scope.list1 = [
        {
          name: 'Name 1-1'
        },
        {
          name: 'Name 1-2'
        },
        {
          name: 'Name 1-3'
        }
      ];
      $scope.list2 = [
        {
          name: ' Name 2-1'
        },
        {
          name: ' Name 2-2'
        },
        {
          name: ' Name 2-3'
        }
      ];

      var view = document.querySelector('view[name=page_repeat_in_repeat_event]');

      $scope.$event = {
        clickHandle: function(){
          $scope.notice = 'Hello1';
          $scope.list1[3] = { name: 'Name 1-4'};
          $scope.list2[this.$index] = { name: ' Name 2-333'};

          setTimeout(function(){
            expect(view.querySelector('.title').innerText.trim()).toEqual('Hello1');
            expect(view.querySelector('.list1:nth-child(4) .list2:nth-child(1)').innerText.trim()).toEqual('Name 1-4 Name 2-1');
            expect(view.querySelector('.list1:nth-child(2) .list2:nth-child(3)').innerText.trim()).toEqual('Name 1-2 Name 2-333');
            done();
          }, 1000);
        }
      };

      setTimeout(function(){
        beacon(view.querySelector('.list1:nth-child(2) .list2:nth-child(3) a')).on('click');
      }, 1000);
    });
  });

});