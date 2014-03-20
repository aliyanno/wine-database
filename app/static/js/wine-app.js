var wineApp = angular.module('wineApp', [
	'ngRoute',
	'wineControllers',
	'wineServices',
]);

wineApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'static/partials/wine-list.html',
				controller: 'wineCtrl',
			}).
			when('/add.html', {
				templateUrl: 'static/partials/add-wine.html',
				controller: 'addCtrl',
			}).
			when('/:wineId', {
				templateUrl: 'static/partials/single-wine.html',
				controller: 'singleCtrl',
			}).
			when('/update/:wineId', {
				templateUrl: 'static/partials/update-wine.html',
				controller: 'updateCtrl',
			});
	}
]);