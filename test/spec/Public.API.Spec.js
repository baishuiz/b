describe("模版数据绑定", function () {

    it("模版存在", function () {
        var app1 = document.getElementById("app1");
        expect(app1).toBeDefined();
    });

    it("app根作用域数据绑定", function(){
        b.run("f1", function(require, $scope){
            $scope.user = {
                name : "Air",
                feeling  : 'happy'
            }
            $scope.name = "friday"
        });


        var dom = {
            userName : document.querySelector("#app1>.name"),
            userAge  : document.querySelector("#app1>.age"),
            app2       : document.querySelector('#app2')
        }
        expect(dom.userName.innerHTML.replace(/^\s+|\s+$/ig,'')).toEqual("Air");
        expect(dom.userAge.innerHTML.replace(/^\s+|\s+$/ig,'')).toEqual("happy");


        b.run("f2", function(require, $scope){
            $scope.name = "yet?";
            $scope.result = "Yes!"
        })

        expect(dom.app2.innerText.replace(/^\s+|\s+$/ig,'')).toEqual('Hello, yet? Yes!');
    });


    it("controller作用域数据绑定", function(){
        b.run("userInfo", function(require, $scope){
            $scope.userInfo = {
                age  : 'so very happy'
            }
        });
        var dom = {
            userName : document.querySelector("#userName"),
            userAge  : document.querySelector("#userAge")
        }
        expect(dom.userName.innerHTML.replace(/^\s+|\s+$/ig,'')).toEqual("name: Air");
        expect(dom.userAge.innerHTML.replace(/^\s+|\s+$/ig,'')).toEqual("age: so very happy");
    });



        it("repeat 指令", function(){
            b.run("booklist", function(require, $scope){
                $scope.books = [
                  {
                    name : "瓦尔登湖",
                    author :["Air","me"]
                  },
                  {
                    name : "瓦尔登湖2",
                    author : ["xmf"]
                  },
                  {
                    name : "瓦尔登湖3",
                    author : ["xmf"]
                  }
                ];

                $scope.books.type = "story";

            });

            var dom = {
                booklist : document.querySelector("#booklist")
            }
            expect(dom.booklist.childElementCount).toEqual(3);
            expect(dom.booklist.children[0].innerText).toEqual("瓦尔登湖Airme");
            expect(dom.booklist.children[1].innerText).toEqual("瓦尔登湖2xmf");
            expect(dom.booklist.children[2].innerText).toEqual("瓦尔登湖3xmf");
            expect(dom.booklist.getAttribute("type")).toEqual("story");

        });

        it("module 绑定输入控件", function(){
          b.run("f3", function(require, $scope){
            $scope.name = "baby";
            $scope.result = "123";

          })
          var dom = {
            input : document.querySelector('#ipt'),
            h1    : document.querySelector('#hh')

          }
          expect(dom.input.value).toEqual('baby');
          dom.input.value += ". How are you?"
          beacon(dom.input).on('input');
          expect(dom.h1.innerText).toEqual('Hello, baby. How are you? 123');
        });

});


describe('事件绑定', function(){
  it('dom 原生事件', function(){
    b.run("f4", function(require, $scope){
      $scope.$event = {
        addResult : function(num, msg){
          $scope.result = $scope.result + num;
          $scope.msg = msg;
        }
      }

      $scope.result = 1;
    });

    var dom = {
      result : document.querySelector('#eventResult')
    }
    expect(dom.result.innerText).toEqual("1");
    beacon(dom.result).on('click');
    expect(dom.result.innerText).toEqual("2ok");
  })
});

describe('view切换', function(){
  beforeEach(function() {
      jasmine.Ajax.install();
      jasmine.Ajax.stubRequest('http://www.cjia-img.com/template/name5').andReturn({
        "status": 200,
        "contentType": 'text/plain',
        "Access-Control-Allow-Origin" : "*",
        "responseText": 'Hello from the world'
      });
  });
  it('viewport 初始化', function(done){
    //b.goto()



    var dom = {
      view1 : document.querySelector('#view1'),
      view2 : document.querySelector('#view2'),
      view3 : document.querySelector('#view3'),
      view4 : document.querySelector('#view4')
    }
    expect(b.views.count).toEqual(4);
    expect(b.views.active).toEqual(dom.view1);
    b.views.goto("name2")
    expect(b.views.count).toEqual(4);
    expect(b.views.active).toEqual(dom.view2);
    b.views.goto("name4")
    expect(b.views.count).toEqual(4);
    expect(b.views.active).toEqual(dom.view4);
    b.views.goto("name1")
    expect(b.views.count).toEqual(4);
    expect(b.views.active).toEqual(dom.view1);

    beacon.on(b.views.EVENTS.SHOWED, function(){
      dom.view5 = document.querySelector('view[name="name5"]')
      expect(b.views.count).toEqual(5);
      expect(b.views.active).toEqual(dom.view5);
      done();
    })

    b.config.set("templatePath", "http://www.cjia-img.com/template/");
    b.views.goto("name5")

    // expect(b.views.count).toEqual(5);
    // expect(b.views.active).toEqual(dom.view5);
  })
})
