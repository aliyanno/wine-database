var wineApp = angular.module('wineApp', []);

wineApp.controller('wineCtrl', ['$scope', function($scope) {

}]);


wineApp.factory('availableWines', ['$http', function($http) {
		return {
			getWine: function(id) {
				return $http({method: 'GET', url('/api/wine/' + id)})
			};
			updateWine: function(id) {
				return $http({method: })
			}
		}
}])