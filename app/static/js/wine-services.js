(function() {
	'use strict';

var wineServices = angular.module('wineServices', []);

wineServices
	.factory('currentWines', ['$http', function($http) {
			return {
				getWine: function(id) {
					return $http({method: 'GET', url: 'https://popping-fire-1713.firebaseio.com/wines/' + id + '.json',	})
				},
				updateWine: function(id, wineData) {
					return $http({method: 'PUT', url: 'https://popping-fire-1713.firebaseio.com/wines/' + id + '.json', data: wineData, })
				},
				addWine: function(wineData) {
					var data = angular.toJson(wineData);
					return $http({method: 'POST', dataType: 'json', url: 'https://popping-fire-1713.firebaseio.com/wines.json', data: wineData, })
				},
				getWineList: function() {
					return $http({method: 'GET', url: 'https://popping-fire-1713.firebaseio.com/wines.json', })
				},
				deleteWine: function(id) {
					return $http({method: 'DELETE', url: 'https://popping-fire-1713.firebaseio.com/wines/' + id + '.json', })
				},
			};
	}])

;

})();