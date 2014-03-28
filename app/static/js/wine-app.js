var wineApp = angular.module('wineApp', [
	'ngRoute',
	'cellarControllers',
	'wineControllers',
	'cellarServices',
]);

wineApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'static/partials/cellar-list.html',
				controller: 'cellarCtrl'
			}).
			when('/wines', {
				templateUrl: 'static/partials/wine-list.html',
				controller: 'wineCtrl',
			}).
			when('/add.html', {
				templateUrl: 'static/partials/add-wine.html',
				controller: 'addCtrl',
			}).
			when('/:Id', {
				templateUrl: 'static/partials/single-wine.html',
				controller: 'singleCtrl',
			}).
			when('/update/:Id', {
				templateUrl: 'static/partials/update-wine.html',
				controller: 'updateCtrl',
			});
	}
]);