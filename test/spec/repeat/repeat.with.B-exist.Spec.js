describe('repeat', function () {

  it('repeat with b-exist', function (done) {
    b.run('page_repeat_with_b-exist', function(require, $scope){
      $scope.a = {
        b: {
          list :[
            {name: 'T1', status:true},
            {name: 'T2', status:0},
            {name: 'T3', status:2}
          ]
        }
      }

      var dom = {
        listB: document.querySelector('view[name=page_repeat_with_b-exist]>.listB')
      }


      setTimeout(function(){
        expect(dom.listB.querySelectorAll('input').length).toEqual(1);

        // expect(dom.listB.querySelector('input:nth-child(1)').value.trim()).toEqual('T1');
        expect(dom.listB.querySelector('input').value.trim()).toEqual('T2');
        // expect(dom.listB.querySelector('input:nth-child(3)').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });

  it('repeat sub element with b-exist', function (done) {
    b.run('page_repeat_subElement_with_b-exist', function(require, $scope){
      $scope.a = {
        b: {
          list :[
            {name: 'T1', status:true},
            {name: 'T2', status:0, div1: [{status: false, name: 'div1_name1'}, {status: true, name: 'div1_name2'}]},
            {name: 'T3', status:2}
          ]
        }
      }



      setTimeout(function(){
        var dom = {
          listB: document.querySelectorAll('view[name=page_repeat_subElement_with_b-exist]>.listB')
        }


        // expect(dom.listB.length).toEqual(1);


        // expect(dom.listB[0].querySelector('input').value.trim()).toEqual('T1');
        expect(dom.listB[1].querySelector('input').value.trim()).toEqual('T2');
        // expect(dom.listB[1].querySelector('input').value.trim()).toEqual('T3');

        done();

      }, 500);
    });
  });

  it('repeat sub element with repeat', function (done) {
    b.run('page_repeat_subElement_with_b-repeat', function(require, $scope){
      var list = [
        {name: 'T1', status: 1, div1: [{status: false, name: 'div1_name1'}]},
        {name: 'T2', status: 0, div1: [{status: false, name: 'div1_name2'}]},
        {name: 'T2', status: 0, div1: [{status: true, name: 'div1_name2'}]},
        {name: 'T3', status: 2, div1: [{status: false, name: 'div1_name3'}]}
      ]

      list.forEach(function (item) {
        item.showStatus_1 = !(item.status === 1 && !item.div1[0].status);
        item.showStatus_2 = !(item.status === 0 && item.div1[0].status);
      });

      $scope.list = list;

      setTimeout(function(){
        var dom = {
          listC: document.querySelectorAll('view[name=page_repeat_subElement_with_b-repeat]>.listC'),
          spanParent: document.querySelectorAll('view[name=page_repeat_subElement_with_b-repeat] .spanParent'),
          btnsParent: document.querySelectorAll('view[name=page_repeat_subElement_with_b-repeat] .btnsParent')
        }


        // expect(dom.listB.length).toEqual(1);
        expect(dom.spanParent.length).toEqual(2);
        expect(dom.spanParent[0].querySelector('.span').innerText.trim()).toEqual('T1');
        // expect(dom.btnsParent.length).toEqual(4);
        // expect(dom.btnsParent[1].querySelectorAll('.btns').length).toEqual(2);
        // expect(dom.btnsParent[1].querySelectorAll('.btns button').length).toEqual(1);
        // expect(dom.btnsParent[1].querySelectorAll('.btns button')[0].innerText.trim()).toEqual('div1_name2');

        done();

      }, 500);
    });
  });


});
