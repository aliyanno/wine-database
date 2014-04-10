(function() {
	'use strict';

var cellarServices = angular.module('cellarServices', []);

cellarServices
	.factory('currentWines', ['$http', function($http) {
			return {
				getWine: function (cellar, id, output) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines/' + id + '.json', }).
					success(function (data) {
						output.wineData = data;
					});
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
							output.cellars = listObjectProperties(data);
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

		// Clears the $scope's wineData
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

		// A constructor for cellars to maintain consistency
		this.Cellar = function (name, owner) {
			this.name = name;
			this.owner = owner;
			this.date = new Date();
			this.dateMade = ((this.date.getMonth() + 1) + '/' + (this.date.getDate()) + '/' + (this.date.getFullYear()));
		};
	})


// not sure where to put these function, utility belt doesn't work since 
// it can't be called then in the factory function

function listObjectProperties (wines) {
	var array = [];
	angular.forEach(wines, function (wine) {
		array.push(wine);
	});
	return array;
};


})();