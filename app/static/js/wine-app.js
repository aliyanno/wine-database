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
			when('/cellars', {
				templateUrl: 'static/partials/cellar-list.html',
				controller: 'cellarCtrl'
			}).
			when('/cellars/:Cellar', {
				templateUrl: 'static/partials/wine-list.html',
				controller: 'wineCtrl',
			}).
			when('/cellars/:Cellar/add.html', {
				templateUrl: 'static/partials/add-wine.html',
				controller: 'addCtrl',
			}).
			when('/cellars/:Cellar/wines/:Id', {
				templateUrl: 'static/partials/single-wine.html',
				controller: 'singleCtrl',
			}).
			when('/cellars/:Cellar/wines/:Id/update', {
				templateUrl: 'static/partials/update-wine.html',
				controller: 'updateCtrl',
			});
	}
]);