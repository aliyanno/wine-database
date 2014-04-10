var wineApp = angular.module('wineApp', [
	'ngRoute',
	'cellarControllers',
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
				templateUrl: 'static/partials/wine-add.html',
				controller: 'WineAddCtrl',
			}).
			when('/cellars/:Cellar/wines/:Id', {
				templateUrl: 'static/partials/wine-detail.html',
				controller: 'WineDetailCtrl',
			}).
			when('/cellars/:Cellar/wines/:Id/update', {
				templateUrl: 'static/partials/wine-update.html',
				controller: 'WineUpdateCtrl',
			});
	}
]);