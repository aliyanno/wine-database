(function() {
	'use strict';

var cellarServices = angular.module('cellarServices', []);

cellarServices
	.factory('currentWines', ['$http', function($http) {
			return {
				getWine: function (cellar, id) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines/' + id + '.json', })
				},		
				updateWine: function (cellar, id, wineData) {
					return $http({method: 'PUT', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines/' + id + '.json', data: wineData, })
				},
				getWineList: function (cellar) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines.json', })
				},
				deleteWine: function (id) {
					return $http({method: 'DELETE', url: 'https://cellared.firebaseio.com/wines/' + id + '.json', })
				},
			};
	}])

	.factory('currentCellars', ['$http', function($http) {
			return {
				getCellarList: function (output) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars.json',}).
						success(function (data) {
							console.log(data);
							output = data;
						}); // use an object to compartmentalize
				},
				addCellar: function (cellarData) {
					return $http({method: 'PUT', url: 'https://cellared.firebaseio.com/cellars/' + cellarData.name + '.json', data: cellarData, });
				},
				getCellarOwner: function (cellar) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/owner.json', });
				},
			};
	}])

	.service('utility', function() {
		this.listObjectProperties = function (objects) {
			var array = [];
			angular.forEach(objects, function (object) {
				array.push(object);
			});
			return array;
		};
		this.resetWineData = function () {
			var wineData = {
				"available": true,
				"quantity": 1,
			};
			return wineData;
		};
		this.getDrinkYear = function (lifespan, vintage) {
			return parseInt(lifespan, 10) + parseInt(vintage, 10);
		};
		this.removeEmptyProperties = function(wineData) {
			for (var prop in wineData) {
				if (wineData.prop === "") {
					delete wineData.prop;
				}
			}
		};
	})


// not sure where to put this function, utility belt doesn't work since 
// it can't be called then in the factory function

function listObjectProperties (wines) {
	var array = [];
	angular.forEach(wines, function (wine) {
		array.push(wine);
	});
	return array;
};

})();