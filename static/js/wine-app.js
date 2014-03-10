var wineApp = angular.module('wineApp', [
	'ngRoute',
	'wineControllers',
	'wineServices',
]);

wineApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: PARTIALS_BASE_URL + 'wine-list.html',
				controller: 'wineCtrl',
			}).
			when('/add.html', {
				templateUrl: PARTIALS_BASE_URL + 'add-wine.html',
				controller: 'addCtrl',
			});
	}
]);