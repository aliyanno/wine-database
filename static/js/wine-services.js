(function() {
	'use strict';

var wineServices = angular.module('wineServices', []);

wineServices.factory('currentWines', ['$http', function($http) {
		return {
			getWine: function(id) {
				return $http({method: 'GET', url: '/api/wine/' + id + '.json', })
			},
			updateWine: function(id, wineData) {
				return $http({method: 'POST', url: '/api/wine/' + id + '.json', data: wineData, })
			},
			addWineToServer: function(wineData) {
				var data = angular.toJson(wineData);
				return $http({method: 'PUT', dataType: 'json', url: '/api/wine', data: wineData, })
			},
			getWineList: function() {
				return $http({method: 'GET', url: '/api/wine/list', })
			},
			deleteWine: function(id) {
				return $http({method: 'DELETE', url: '/api/wine/' + id, })
			},
		};
}]);

})();