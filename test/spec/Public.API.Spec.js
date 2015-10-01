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
            userAge  : document.querySelector("#app1>.age")
        }
        expect(dom.userName.innerHTML.replace(/^\s+|\s+$/ig,'')).toEqual("Air");
        expect(dom.userAge.innerHTML.replace(/^\s+|\s+$/ig,'')).toEqual("happy");


        b.run("f2", function(require, $scope){
            $scope.name = "yet?"
        })
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
                    author :"Air"
                  },
                  {
                    name : "瓦尔登湖2",
                    author : "xmf"
                  }
                ]
            });

            var dom = {
                booklist : document.querySelector("#booklist")
            }
            expect(dom.booklist.childElementCount).toEqual(2);

        });

});
