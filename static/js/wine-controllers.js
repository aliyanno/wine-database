(function() {
	'use strict';

var wineControllers = angular.module('wineControllers', []);

wineControllers
	.controller('wineCtrl', ['$scope', 'currentWines', function($scope, currentWines) {
		$scope.responseText = "Testing...";

		$scope.showWines = function() {
			currentWines.getWineList().success(function(data) {
				$scope.wines = data.wines;
			})
		};
		$scope.showWines();
	}])

	.controller('addCtrl', ['$scope', 'currentWines', function($scope, currentWines) {
		$scope.wineData = {
			"name": $scope.wineName,
			"producer": $scope.producer,
			"variety": $scope.variety,
			"vintage": $scope.vintage,
			"vineyard": $scope.vineyard,
			"region": {
				"subregion1": $scope.subregion1,
				"subregion2": $scope.subregion2,
				"subregion3": $scope.subregion3,
			},
			"country": $scope.country,
			"age": $scope.age,
			"available": true,
		}

		$scope.addWine = function() {
			
			$scope.wineData = {
				"name": $scope.wineName,
				"producer": $scope.producer,
				"variety": $scope.variety,
				"vintage": $scope.vintage,
				"vineyard": $scope.vineyard,
				"region": {
					"subregion1": $scope.subregion1,
					"subregion2": $scope.subregion2,
					"subregion3": $scope.subregion3,
				},
				"country": $scope.country,
				"age": $scope.age,
				"available": true,
			}
			console.log($scope.wineData);
			
			currentWines.addWineToServer($scope.wineData).success(function() {
				$scope.responseText = "Added!";
			})
			.error(function() {
				$scope.responseText = "Failed";
			})
		};
	}])

})();