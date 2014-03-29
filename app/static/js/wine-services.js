(function() {
	'use strict';

var cellarServices = angular.module('cellarServices', []);

cellarServices
	.factory('currentWines', ['$http', function($http) {
			return {
				getWine: function(cellar, id) {
					return $http({method: 'GET', url: 'https://popping-fire-1713.firebaseio.com/' + cellar + '/wines/' + id + '.json',	})
				},
				updateWine: function(id, wineData) {
					return $http({method: 'PUT', url: 'https://popping-fire-1713.firebaseio.com/wines/' + id + '.json', data: wineData, })
				},
				// addWine: function(wineData) {
				// 	var data = angular.toJson(wineData);
				// 	return $http({method: 'POST', dataType: 'json', url: 'https://popping-fire-1713.firebaseio.com/wines.json', data: wineData, })
				// },
				getWineList: function(cellar) {
					return $http({method: 'GET', url: 'https://popping-fire-1713.firebaseio.com/' + cellar + '/wines.json', })
				},
				deleteWine: function(id) {
					return $http({method: 'DELETE', url: 'https://popping-fire-1713.firebaseio.com/wines/' + id + '.json', })
				},
			};
	}])
	.factory('currentCellars', ['$http', function($http) {
			return {
				getCellarList: function() {
					return $http({method: 'GET', url: 'https://popping-fire-1713.firebaseio.com/.json', })
				},
				addCellar: function(cellarData) {
					return $http({method: 'PUT', url: 'https://popping-fire-1713.firebaseio.com/' + cellarData.name + '.json', data: cellarData, })
				},
			};
	}])
;

})();