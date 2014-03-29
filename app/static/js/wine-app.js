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
			when('/:Cellar', {
				templateUrl: 'static/partials/wine-list.html',
				controller: 'wineCtrl',
			}).
			when('/:Cellar/add.html', {
				templateUrl: 'static/partials/add-wine.html',
				controller: 'addCtrl',
			}).
			when('/:Cellar/wines/:Id', {
				templateUrl: 'static/partials/single-wine.html',
				controller: 'singleCtrl',
			}).
			when('/:Cellar/wines/:Id/update', {
				templateUrl: 'static/partials/update-wine.html',
				controller: 'updateCtrl',
			});
	}
]);