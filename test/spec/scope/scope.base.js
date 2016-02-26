describe('数据绑定', function () {

    it('本地模板渲染', function (done) {
      b.run('page_default', function($scope, require){
        $scope.flower = 'sun';
        var dom = {
          flower : document.querySelector('view[name=page_default] .flower');
        }
        expect(dom.flower.innerText).toEqual('sun');
        done();
      })
    });

    it('远程模板渲染', function (done) {
      b.run('remote_page_map', function($scope, require){
        $scope.city = '铁岭';
        var dom = {
          city : document.querySelector('view[name=remote_page_map] .city');
        }
        expect(dom.city.innerText).toEqual('铁岭');
        done();
      })
    });

}
