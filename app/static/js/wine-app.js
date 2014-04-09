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
				controller: 'CellarListCtrl'
			}).
			when('/cellars', {
				templateUrl: 'static/partials/cellar-list.html',
				controller: 'CellarListCtrl'
			}).
			when('/cellars/:Cellar', {
				templateUrl: 'static/partials/wine-list.html',
				controller: 'WineListCtrl',
			}).
			when('/cellars/:Cellar/add.html', {
				templateUrl: 'static/partials/add-wine.html',
				controller: 'WineAddCtrl',
			}).
			when('/cellars/:Cellar/wines/:Id', {
				templateUrl: 'static/partials/single-wine.html',
				controller: 'WineDetailCtrl',
			}).
			when('/cellars/:Cellar/wines/:Id/update', {
				templateUrl: 'static/partials/update-wine.html',
				controller: 'WineUpdateCtrl',
			});
	}
]);