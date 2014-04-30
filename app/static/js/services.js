(function () {
	'use strict';

var cellarServices = angular.module('cellarServices', []);
var dataUrl = 'https://cellared.firebaseio.com/cellars/';

cellarServices
	.factory('Wines', ['$http', function ($http) {
			return {
				getWine: function (cellar, id, output) {
					return $http({method: 'GET', url: dataUrl + cellar + '/wines/' + id + '.json', });
				},
				addWine: function (cellar) {
					return $http({method: 'POST', url: dataUrl + cellar + '/wines.json', });
				},
				updateWine: function (cellar, id, wineData) {
					return $http({method: 'PUT', url: dataUrl + cellar + '/wines/' + id + '.json', data: wineData, })
				},
				getWineList: function (cellar) {
					return $http({method: 'GET', url: dataUrl + cellar + '/wines.json', }).
						then(function (data) {
							var dataArray = [];
							angular.forEach(data.data, function (datum) {
								dataArray.push(datum);
							});
							return dataArray;
						});
				},
			};
	}])
 
	.factory('Cellars', ['$http', function ($http) {
			return {
				getCellarList: function () {
					return $http({method: 'GET', url: dataUrl + '.json',}).
						then(function (data) {
							var dataArray = [];
							angular.forEach(data.data, function (datum) {
								dataArray.push(datum);
							});
							return dataArray;
						});
				},
				addCellar: function (cellarData) {
					return $http({method: 'PUT', url: dataUrl + cellarData.name + '.json', data: cellarData, });
				},
				getCellarOwner: function (cellar) {
					return $http({method: 'GET', url: dataUrl + cellar + '/owner.json', });
				},
			};
	}])

})();
