describe('select-option', function () {
  var dom = {
    select : document.querySelector('view[name=page_select-option] select')
  }
  it('异步修改 option 数据', function (done) {
    b.views.goTo('page_select-option');

    b.service.set('service.cityList', {
      path: 'cityList.json',
      expiredSecond: 1,
      extend : 'default'
    });

    b.run('page_select-option', function(require, $scope){
      setTimeout(function(){
        $scope.data = {
          cityId: ''
        };

        var cityListSevice = b.service.get('service.cityList', $scope);

        cityListSevice.query(null, {
          successCallBack: function (data) {
            var result = data.result || {};
            $scope.cityList = result.cityList || [];

            setTimeout(function(){
              expect(dom.select.value).toEqual('');
              expect(dom.select.firstElementChild.selected).toEqual(true);

              var options = dom.select.querySelectorAll('option');
              expect(options.length).toEqual(15);

              for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.selected) {
                  expect(option.innerText).toEqual('请选择');
                  done();
                }
              }
            }, 50);
          }
        })
      }, 100);

    });
  });


});
