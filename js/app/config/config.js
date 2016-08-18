app.config(function($routeProvider, $locationProvider) {
	 $routeProvider
	 .when('/list',{
		templateUrl:'./tmp/playinglist/playinglist.html',
		replace:true
	})
	.when('/favorite',{
		templateUrl:'./tmp/favorite/favorite.html',
		replace:true
	})
	.when('/analysis',{
		templateUrl:'./tmp/analysis/analysis.html',
		replace:true
	});
});