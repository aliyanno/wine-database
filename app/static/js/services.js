(function () {
	'use strict';

var cellarServices = angular.module('cellarServices', []);

cellarServices
	.factory('currentWines', ['$http', function ($http) {
			return {
				getWine: function (cellar, id, output) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines/' + id + '.json', });
				},		
				updateWine: function (cellar, id, wineData) {
					return $http({method: 'PUT', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines/' + id + '.json', data: wineData, })
				},
				getWineList: function (cellar) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/wines.json', }).
						then(function (response) {
							return listObjectProperties(response.data);
					});
				},
				deleteWine: function (id) {
					return $http({method: 'DELETE', url: 'https://cellared.firebaseio.com/wines/' + id + '.json', })
				},
			};
	}])
 
	.factory('currentCellars', ['$http', function ($http) {
			return {
				getCellarList: function () {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars.json',}).
						then(function (response) {
							return listObjectProperties(response.data);
						});
				},
				addCellar: function (cellarData) {
					return $http({method: 'PUT', url: 'https://cellared.firebaseio.com/cellars/' + cellarData.name + '.json', data: cellarData, });
				},
				getCellarOwner: function (cellar) {
					return $http({method: 'GET', url: 'https://cellared.firebaseio.com/cellars/' + cellar + '/owner.json', }).
						then(function (response) {
							return response.data.toString();
						});
				},
			};
	}])

	.service('utility', ['currentCellars', function (currentCellars) {
		this.listObjectProperties = function (objects) {
			var array = [];
			angular.forEach(objects, function (object) {
				array.push(object);
			});
			return array;
		};

		// Clears the $scope's wineData
		this.resetWine = function () {
			var wine = {
				"available": true,
				"quantity": 1,
			};
			return wine;
		};

		this.getDrinkYear = function (lifespan, vintage) {
			return parseInt(lifespan, 10) + parseInt(vintage, 10);
		};

		this.removeEmptyProperties = function (wineData) {
			for (var prop in wineData) {
				if (wineData.prop === "") {
					delete wineData.prop;
				}
			}
		};

		this.getOwnerName = function (cellar) {
			currentCellars.getCellarOwner(cellar).then(function (response) {
				console.log(response.data);
				return response.data;
			});
		};

		// A constructor for cellars to maintain consistency
		this.Cellar = function (name, owner) {
			this.name = name;
			this.owner = owner;
			this.date = new Date();
			this.dateMade = ((this.date.getMonth() + 1) + '/' + (this.date.getDate()) + '/' + (this.date.getFullYear()));
		};

	}])

/// not sure where to put this function since it is needed in the factories

function listObjectProperties (objects) {
	var array = [];
	angular.forEach(objects, function (object) {
		array.push(object);
	});
	return array;
};

})();
