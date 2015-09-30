



b.run(function(require, $scope){
	var serviceConfig = require("service.serviceConfig");
    var booksService  = serviceConfig.books,
        userService   = serviceConfig.users,
		orderService  = serviceConfig.order;

    bookService.query(function(bookData){
    	bookData = booksService.filter(bookData);
    	$scope.books = bookData;
        userService.query({bookCount: bookData.count});	
    });
    orderService.query({orderID:123});


    
});


b.run(function(require, $scope){
    var booksService  = require("service.books"),
        userService   = require("service.users"),
		orderService  = require("service.orders");

    bookService.query(function(bookData){
    	bookData = booksService.filter(bookData);
    	$scope.books = bookData;
        userService.query({bookCount: bookData.count});	
    });
    orderService.query({orderID:123});

    var popWindow = require("UI.popWindow");
    var calendar = require("UI.calendar");

    $scope.ui = {
    	pop : popWindow({

    	}),

    	calendar : calendar({

    	})
    }


    var alerts = require("UI.alert");
    alerts("Hello !");

    
    $scope.eventHandle = {
    	fn  : function(){
                 beacon      
    	      }
    }



    $scope.events = {
    	'click .aaa': function(){

    	},
    	'click .btn': 'eventHandle.fn'
    }

    beacon('.aaa')


});