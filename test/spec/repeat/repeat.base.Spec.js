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

        done();

      }, 50);
    });
  });

  it('多层repeat 清空', function (done) {
    b.run('page_repeat_clear', function(require, $scope){
      $scope.notice = ", welcome";
      $scope.list = [
        {
          innerList: [{name: 'Name 1'}]
        },
        {
          innerList: [{name: 'Name 2'}]
        },
        {
          innerList: [{name: 'Name 3'}]
        }
      ];

      var dom;
      setTimeout(function () {

        $scope.list = [];
        $scope.list = [
          {
            innerList: [{name: 'Name 1'}]
          },
          {
            innerList: [{name: 'Name 2'}]
          },
          {
            innerList: [{name: 'Name 3'}]
          }
        ];
        dom = {
          list : document.querySelector('view[name=page_repeat_clear]>ul')
        }
      }, 100);



      setTimeout(function(){
        expect(dom.list.querySelectorAll('li').length).toEqual(3);
        done();

      }, 500);
    });
  });

  it('多层repeat 改变属性值', function (done) {
    b.run('page_repeat_changeData', function(require, $scope){
      $scope.notice = ", welcome";
      $scope.list = [
        {
          attr: 'attr name1',
          obj: {name: 'obj name1'},
          innerList: [{a:{b:{name: 'Name 1'}}}]
        },
        {
          attr: 'attr name2',
          obj: {name: 'obj name2'},
          innerList: [{a:{b:{name: 'Name 2'}}}]
        },
        {
          attr: 'attr name3',
          obj: {name: 'obj name3'},
          innerList: [{a:{b:{name: 'Name 3'}}}]
        }
      ];

      var dom;
      setTimeout(function () {

        $scope.list = [
          {
            attr: 'attr name11',
            obj: {name: 'obj name11'},
            innerList: [{a:{b:{name: 'Name 11'}}}]
          },
          {
            attr: 'attr name22',
            obj: {name: 'obj name22'},
            innerList: [{a:{b:{name: 'Name 22'}}}]
          },
          {
              attr: 'attr name33',
              obj: {name: 'obj name33'},
              innerList: [{a:{b:{name: 'Name 33'}}}]
          },
          {
            attr: 'attr name44',
            obj: {name: 'obj name44'},
            innerList: [{a:{b:{name: 'Name 44'}}}]
          }
        ];

      }, 100);



      setTimeout(function(){
        dom = {
          list : document.querySelector('view[name=page_repeat_changeData]>ul')
        }
        expect(dom.list.querySelectorAll('li')[2].querySelectorAll('button')[0].innerText).toEqual('attr name33, welcome,attr name33');
        expect(dom.list.querySelectorAll('li')[2].querySelectorAll('button')[1].innerText).toEqual('obj name33, welcome,obj name33');
        expect(dom.list.querySelectorAll('li')[2].querySelectorAll('button')[2].innerText).toEqual('Name 33, welcome,Name 33');

        expect(dom.list.querySelectorAll('li')[3].querySelectorAll('button')[0].innerText).toEqual('attr name44, welcome,attr name44');
        expect(dom.list.querySelectorAll('li')[3].querySelectorAll('button')[1].innerText).toEqual('obj name44, welcome,obj name44');
        expect(dom.list.querySelectorAll('li')[3].querySelectorAll('button')[2].innerText).toEqual('Name 44, welcome,Name 44');
        done();

      }, 500);
    });
  });

  it('多层repeat 两次改变属性值', function (done) {
    b.run('page_repeat_twiceChangeData', function(require, $scope){
      $scope.notice = ", welcome";
      $scope.list = [];
      $scope.list = [
        {
          attr: 'attr name1',
          obj: {name: 'obj name1'},
          innerList: [{a:{b:{name: 'Name 1'}}}]
        },
        {
          attr: 'attr name2',
          obj: {name: 'obj name2'},
          innerList: [{a:{b:{name: 'Name 2'}}}]
        },
        {
          attr: 'attr name3',
          obj: {name: 'obj name3'},
          innerList: [{a:{b:{name: 'Name 3'}}}]
        }
      ];

      var dom;
      setTimeout(function () {
        $scope.list = [];
        $scope.list = [
          {
            attr: 'attr name11',
            obj: {name: 'obj name11'},
            innerList: [{a:{b:{name: 'Name 11'}}}]
          },
          {
            attr: 'attr name22',
            obj: {name: 'obj name22'},
            innerList: [{a:{b:{name: 'Name 22'}}}]
          },
          {
            attr: 'attr name33',
            obj: {name: 'obj name33'},
            innerList: [{a:{b:{name: 'Name 33'}}}]
          },
          {
            attr: 'attr name44',
            obj: {name: 'obj name44'},
            innerList: [{a:{b:{name: 'Name 44'}}}]
          }
        ];

        $scope.list = [];
        $scope.list = [];
        $scope.list = [
          {
            attr: 'attr name111',
            obj: {name: 'obj name111'},
            innerList: [{a:{b:{name: 'Name 111'}}}]
          },
          {
            attr: 'attr name222',
            obj: {name: 'obj name222'},
            innerList: [{a:{b:{name: 'Name 222'}}}]
          },
          {
            attr: 'attr name333',
            obj: {name: 'obj name333'},
            innerList: [{a:{b:{name: 'Name 333'}}}]
          },
          {
            attr: 'attr name444',
            obj: {name: 'obj name444'},
            innerList: [{a:{b:{name: 'Name 444'}}}]
          }
        ];


      }, 300);



      setTimeout(function(){
        dom = {
          list : document.querySelector('view[name=page_repeat_twiceChangeData]>ul')
        }
        expect(dom.list.querySelectorAll('li')[0].querySelectorAll('button')[0].innerText).toEqual('attr name111, welcome,attr name111');
        expect(dom.list.querySelectorAll('li')[0].querySelectorAll('button')[1].innerText).toEqual('obj name111, welcome,obj name111');
        expect(dom.list.querySelectorAll('li')[0].querySelectorAll('button')[2].innerText).toEqual('Name 111, welcome,Name 111');

        expect(dom.list.querySelectorAll('li')[1].querySelectorAll('button')[0].innerText).toEqual('attr name222, welcome,attr name222');
        expect(dom.list.querySelectorAll('li')[1].querySelectorAll('button')[1].innerText).toEqual('obj name222, welcome,obj name222');
        expect(dom.list.querySelectorAll('li')[1].querySelectorAll('button')[2].innerText).toEqual('Name 222, welcome,Name 222');

        expect(dom.list.querySelectorAll('li')[2].querySelectorAll('button')[0].innerText).toEqual('attr name333, welcome,attr name333');
        expect(dom.list.querySelectorAll('li')[2].querySelectorAll('button')[1].innerText).toEqual('obj name333, welcome,obj name333');
        expect(dom.list.querySelectorAll('li')[2].querySelectorAll('button')[2].innerText).toEqual('Name 333, welcome,Name 333');

        expect(dom.list.querySelectorAll('li')[3].querySelectorAll('button')[0].innerText).toEqual('attr name444, welcome,attr name444');
        expect(dom.list.querySelectorAll('li')[3].querySelectorAll('button')[1].innerText).toEqual('obj name444, welcome,obj name444');
        expect(dom.list.querySelectorAll('li')[3].querySelectorAll('button')[2].innerText).toEqual('Name 444, welcome,Name 444');
        done();

      }, 500);
    });
  });

  it('多层repeat 减少数目', function (done) {
    b.run('page_repeat_cutData', function(require, $scope){
      $scope.notice = ", welcome";
      $scope.list = [
        {
          attr: 'attr name1',
          obj: {name: 'obj name1'},
          innerList: [{a:{b:{name: 'Name 1'}}}]
        },
        {
          attr: 'attr name2',
          obj: {name: 'obj name2'},
          innerList: [{a:{b:{name: 'Name 2'}}}]
        },
        {
          attr: 'attr name3',
          obj: {name: 'obj name3'},
          innerList: [{a:{b:{name: 'Name 3'}}}]
        }
      ];

      var dom;
      setTimeout(function () {
        $scope.list = [];
        $scope.list = [
          {
            attr: 'attr name11',
            obj: {name: 'obj name11'},
            innerList: [{a:{b:{name: 'Name 11'}}}]
          },
          {
            attr: 'attr name22',
            obj: {name: 'obj name22'},
            innerList: [{a:{b:{name: 'Name 22'}}}]
          }
        ];

      }, 100);



      setTimeout(function(){
        dom = {
          list : document.querySelector('view[name=page_repeat_cutData]>ul')
        }
        expect(dom.list.querySelectorAll('li')[0].querySelectorAll('button')[0].innerText).toEqual('attr name11, welcome,attr name11');
        expect(dom.list.querySelectorAll('li')[0].querySelectorAll('button')[1].innerText).toEqual('obj name11, welcome,obj name11');
        expect(dom.list.querySelectorAll('li')[0].querySelectorAll('button')[2].innerText).toEqual('Name 11, welcome,Name 11');
        expect(dom.list.querySelectorAll('li')[1].querySelectorAll('button')[0].innerText).toEqual('attr name22, welcome,attr name22');
        expect(dom.list.querySelectorAll('li')[1].querySelectorAll('button')[1].innerText).toEqual('obj name22, welcome,obj name22');
        expect(dom.list.querySelectorAll('li')[1].querySelectorAll('button')[2].innerText).toEqual('Name 22, welcome,Name 22');
        expect(dom.list.querySelectorAll('li').length).toEqual(2);
        done();

      }, 500);
    });
  });

  it('一个list, 多个repeat使用', function (done) {
        b.run('page_repeat_multiple_call', function(require, $scope){
            $scope.notice = ", welcome";
            $scope.list = [
                {
                    attr: 'attr name1',
                    obj: {name: 'obj name1'},
                    innerList: [{a:{b:{name: 'Name 1'}}}]
                },
                {
                    attr: 'attr name2',
                    obj: {name: 'obj name2'},
                    innerList: [{a:{b:{name: 'Name 2'}}}]
                },
                {
                    attr: 'attr name3',
                    obj: {name: 'obj name3'},
                    innerList: [{a:{b:{name: 'Name 3'}}}]
                }
            ];

            setTimeout(function(){
                var dom = {
                    list : document.querySelectorAll('view[name=page_repeat_multiple_call]>ul'),
                    ul1  : document.querySelectorAll('view[name=page_repeat_multiple_call]>ul')[0],
                    ul2  : document.querySelectorAll('view[name=page_repeat_multiple_call]>ul')[1]
                }
                console.log(dom.ul1);
                expect(dom.list.length).toEqual(2);

                expect(dom.ul1.querySelectorAll("li").length).toEqual(3);
                expect(dom.ul1.querySelectorAll('li')[0].querySelectorAll('button')[0].innerText).toEqual('attr name1, welcome,attr name1');
                expect(dom.ul1.querySelectorAll('li')[0].querySelectorAll('button')[1].innerText).toEqual('obj name1, welcome,obj name1');
                expect(dom.ul1.querySelectorAll('li')[0].querySelectorAll('button')[2].innerText).toEqual('Name 1, welcome,Name 1');
                expect(dom.ul1.querySelectorAll('li')[1].querySelectorAll('button')[0].innerText).toEqual('attr name2, welcome,attr name2');
                expect(dom.ul1.querySelectorAll('li')[1].querySelectorAll('button')[1].innerText).toEqual('obj name2, welcome,obj name2');
                expect(dom.ul1.querySelectorAll('li')[1].querySelectorAll('button')[2].innerText).toEqual('Name 2, welcome,Name 2');
                expect(dom.ul1.querySelectorAll('li')[2].querySelectorAll('button')[0].innerText).toEqual('attr name3, welcome,attr name3');
                expect(dom.ul1.querySelectorAll('li')[2].querySelectorAll('button')[1].innerText).toEqual('obj name3, welcome,obj name3');
                expect(dom.ul1.querySelectorAll('li')[2].querySelectorAll('button')[2].innerText).toEqual('Name 3, welcome,Name 3');


                expect(dom.ul2.querySelectorAll("li").length).toEqual(3);
                expect(dom.ul2.querySelectorAll('li')[0].querySelectorAll('button')[0].innerText).toEqual('attr name1, welcome,attr name1');
                expect(dom.ul2.querySelectorAll('li')[0].querySelectorAll('button')[1].innerText).toEqual('obj name1, welcome,obj name1');
                expect(dom.ul2.querySelectorAll('li')[0].querySelectorAll('button')[2].innerText).toEqual('Name 1, welcome,Name 1');
                expect(dom.ul2.querySelectorAll('li')[1].querySelectorAll('button')[0].innerText).toEqual('attr name2, welcome,attr name2');
                expect(dom.ul2.querySelectorAll('li')[1].querySelectorAll('button')[1].innerText).toEqual('obj name2, welcome,obj name2');
                expect(dom.ul2.querySelectorAll('li')[1].querySelectorAll('button')[2].innerText).toEqual('Name 2, welcome,Name 2');
                expect(dom.ul2.querySelectorAll('li')[2].querySelectorAll('button')[0].innerText).toEqual('attr name3, welcome,attr name3');
                expect(dom.ul2.querySelectorAll('li')[2].querySelectorAll('button')[1].innerText).toEqual('obj name3, welcome,obj name3');
                expect(dom.ul2.querySelectorAll('li')[2].querySelectorAll('button')[2].innerText).toEqual('Name 3, welcome,Name 3');

                done();

            }, 500);
        });
    });

  it('repeat unshift', function (done) {
    b.run('page_repeat_change_by_unshift', function(require, $scope){
      $scope.notice = ", welcome";
      var list = [
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

      $scope.list = list;
      $scope.list.unshift({
        name: 'Name 0'
      });

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
        list : document.querySelector('view[name=page_repeat_change_by_unshift]>ul'),
        listB: document.querySelector('view[name=page_repeat_change_by_unshift]>.listB')
      }

      setTimeout(function(){
        expect(dom.list.querySelectorAll('li').length).toEqual(4);
        expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 0');
        expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 1');
        expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 2');
        expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 3');
        expect(dom.list.querySelector('li:nth-child(4)').getAttribute('name')).toEqual('Name 3, welcome');


        expect(dom.listB.querySelectorAll('span').length).toEqual(3);
        expect(dom.listB.querySelector('span:nth-child(1)').innerText.trim()).toEqual('T1');
        expect(dom.listB.querySelector('span:nth-child(2)').innerText.trim()).toEqual('T2');
        expect(dom.listB.querySelector('span:nth-child(3)').innerText.trim()).toEqual('T3');

        done();

      }, 50);
    });
  });


  it('repeat with b-model', function (done) {
    b.run('page_repeat_with_b-model', function(require, $scope){
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
        listB: document.querySelector('view[name=page_repeat_with_b-model]>.listB')
      }


      setTimeout(function(){
        expect(dom.listB.querySelectorAll('input').length).toEqual(3);
        expect(dom.listB.querySelector('input:nth-child(1)').value.trim()).toEqual('T1');
        expect(dom.listB.querySelector('input:nth-child(2)').value.trim()).toEqual('T2');
        expect(dom.listB.querySelector('input:nth-child(3)').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });


  it('repeat 多list嵌套', function (done) {
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
      }, 0);
    });
  });

  it('repeat 子list嵌套', function (done) {
    b.run('page_repeat_in_own_repeat', function(require, $scope){
      $scope.list = [
        {
          name: 'Name 1-1',
          subList: [
            {
              name: 'Name 1-1-1'
            },
            {
              name: 'Name 1-1-2'
            }
          ]
        },
        {
          name: 'Name 1-2',
          subList: [
            {
              name: 'Name 1-2-1'
            },
            {
              name: 'Name 1-2-2'
            }
          ]
        },
        {
          name: 'Name 1-3',
          subList: [
            {
              name: 'Name 1-3-1'
            },
            {
              name: 'Name 1-3-2'
            }
          ]
        }
      ];

      var view = document.querySelector('view[name=page_repeat_in_own_repeat]');

      setTimeout(function(){
        expect(view.querySelectorAll('.list').length).toEqual(3);
        expect(view.querySelectorAll('.sub-list').length).toEqual(6);
        expect(view.querySelector('.list:nth-child(2) .sub-list:nth-child(2)').innerText.trim()).toEqual('Name 1-2 Name 1-2-2');

        $scope.list.push({
          name: 'Name 1-4',
          subList: [
            {
              name: 'Name 1-4-1'
            },
            {
              name: 'Name 1-4-2'
            }
          ]
        });

        setTimeout(function() {
          expect(view.querySelectorAll('.list').length).toEqual(4);
          expect(view.querySelectorAll('.sub-list').length).toEqual(8);
          expect(view.querySelector('.list:nth-child(4) .sub-list:nth-child(2)').innerText.trim()).toEqual('Name 1-4 Name 1-4-2');

          done();
        }, 0);

      }, 0);
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
      $scope.list1.length = 2;

      var view = document.querySelector('view[name="page_repeat_nearby_repeat"]');

      setTimeout(function(){
        expect(view.querySelectorAll('.list1 li').length).toEqual(2);
        expect(view.querySelectorAll('.list2 li').length).toEqual(3);
        expect(view.querySelector('.list1 li:nth-child(2)').innerText.trim()).toEqual('Name 1-2');
        expect(view.querySelector('.list2 li:nth-child(2)').innerText.trim()).toEqual('Name 2-2');
        done();
      }, 0);
    });
  });

  it('repeat table元素', function (done) {
    b.run('page_repeat_table', function(require, $scope){
      $scope.headers = [{
        text: 'header_1'
      }, {
        text: 'header_2'
      }]
      $scope.items = [{
        text: 'item_1',
        list: [{
          text: 'td_1'
        }, {
          text: 'td_2'
        }]
      }, {
        text: 'item_2',
        list: [{
          text: 'td_1'
        }, {
          text: 'td_2'
        }]
      }]

      var view = document.querySelector('view[name="page_repeat_table"]');

      setTimeout(function(){
        expect(view.querySelectorAll('th').length).toEqual(2);
        expect(view.querySelectorAll('td').length).toEqual(4);
        expect(view.querySelector('th:nth-child(2)').innerText.trim()).toEqual('header_2');
        expect(view.querySelector('.tr_item_1 td:nth-child(2)').innerText.trim()).toEqual('item_1td_2');
        expect(view.querySelector('.tr_item_2 td:nth-child(2)').innerText.trim()).toEqual('item_2td_2');
        done();
      }, 0);
    });
  });

  it('repeat 内的表达式', function (done) {
    b.run('page_repeat_expression_in_repeat', function(require, $scope){
      $scope.list = [{
        count: 0
      }, {
        count: 1
      }, {
        count: 2
      }];
      $scope.pager = {
        index: 2
      }

      var view = document.querySelector('view[name="page_repeat_expression_in_repeat"]');

      setTimeout(function(){
        expect(view.querySelector('ul li:nth-child(1)').innerText.trim()).toEqual('1');
        expect(view.querySelector('ul li:nth-child(2)').innerText.trim()).toEqual('1');
        expect(view.querySelector('ul li:nth-child(3)').innerText.trim()).toEqual('2');
        done();
      }, 0);
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

          // a[this.$index] = { name: msg };
          a[3] = { name: 'Name 44'};
          // $scope.list = a;
          $scope.list = a;
          $scope.list[3] = { name: 'Name 44'};

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
        // expect(dom.list.querySelectorAll('li').length).toEqual(3);
        // expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
        // expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
        // expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');

        // Object.observe($scope, function(x){
          expect(dom.list.querySelectorAll('li').length).toEqual(4);
          expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
          expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
          // expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('good');
          expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 44');

          expect(dom.listB.querySelectorAll('span').length).toEqual(3);
          expect(dom.listB.querySelector('span:nth-child(1)').innerText.trim()).toEqual('T1');
          expect(dom.listB.querySelector('span:nth-child(2)').innerText.trim()).toEqual('T2');
          expect(dom.listB.querySelector('span:nth-child(3)').innerText.trim()).toEqual('T3');
          done();
      },0);
      // });
      var target = dom.list.querySelector('li:nth-child(3)');
      beacon(target).on('click');


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
        'clickHandle' : function(e, index, index2, index3){
          expect(index2).toEqual(index);
          expect(index3).toEqual(index);

          $scope.lista[1].name = 'hello';
          $scope.lista[index] = { name: 'good' };
          $scope.lista[3] = { name: 'Name 44'};
          $scope.lista.push({ name: 'Name 55'});
          setTimeout(function(){
            expect(dom.list.querySelectorAll('li').length).toEqual(5);
            expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
            expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('hello');
            expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('good');
            expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 44');
            expect(dom.list.querySelector('li:nth-child(5)').innerText.trim()).toEqual('Name 55');
            done();
          }, 0);
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
          name: 'Name 111'
        },
        {
          name: 'Name 222'
        },
        {
          name: 'Name 333'
        }
      ];

      $scope.$event = {
        'titleClickHandle' : function(e) {
          $scope.list[3] = { name: 'Name 444'};

          setTimeout(function(){
            expect(dom.list.querySelectorAll('li').length).toEqual(4);
            expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 111');
            expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 222');
            expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 333');
            expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 444');

            beacon(dom.list.querySelector('li:nth-child(4)>a')).on('click');
          }, 0);
        },
        'itemClickHandle' : function(e, index){
          $scope.notice = 'Hello ' + index;

          setTimeout(function(){
            expect(dom.list.querySelectorAll('li').length).toEqual(4);
            expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 111');
            expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 222');
            expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 333');
            expect(dom.list.querySelector('li:nth-child(4)').innerText.trim()).toEqual('Name 444');
            expect(dom.title.innerText).toEqual('Hello 3');
            done();
          }, 0);
        }
      }

      setTimeout(function(){
        // expect(dom.title.innerText).toEqual('Hello World');
        // expect(dom.list.querySelector('li:nth-child(1)').innerText.trim()).toEqual('Name 11');
        // expect(dom.list.querySelector('li:nth-child(2)').innerText.trim()).toEqual('Name 22');
        // expect(dom.list.querySelector('li:nth-child(3)').innerText.trim()).toEqual('Name 33');

        beacon(dom.title).on('click');
      }, 0);

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
        clickHandle: function(e, index){
          $scope.notice = 'Hello1';
          $scope.list1[3] = { name: 'Name 1-4'};
          $scope.list2[index] = { name: ' Name 2-333'};

          setTimeout(function(){
            expect(view.querySelector('.title').innerText.trim()).toEqual('Hello1');
            expect(view.querySelector('.list1:nth-child(4) .list2:nth-child(1)').innerText.trim()).toEqual('Name 1-4 Name 2-1');
            expect(view.querySelector('.list1:nth-child(2) .list2:nth-child(3)').innerText.trim()).toEqual('Name 1-2 Name 2-333');
            done();
          }, 0);
        }
      };

      setTimeout(function(){
        beacon(view.querySelector('.list1:nth-child(2) .list2:nth-child(3) a')).on('click');
      }, 0);
    });
  });

});
