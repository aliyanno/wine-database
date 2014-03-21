(function() {
	'use strict';

var wineControllers = angular.module('wineControllers', []);

wineControllers

	.controller('appCtrl', ['$scope', 'currentWines', function($scope, currentWines) {

		$scope.wines = [];
		$scope.feedback = {};
		$scope.wineData = {
			"available": true,
			"quantity": 1,
		};

		$scope.wineRef = new Firebase('https://popping-fire-1713.firebaseio.com/wines');

		$scope.mapObjectToArray = function(wines) {
			var array = [];
			angular.forEach(wines, function(wine) {
				array.push(wine);
			});
			return array;
		}

		$scope.resetWineData = function() {
			$scope.wineData = {
				"available": true,
				"quantity": 1,
			};
		}

		$scope.getDrinkYear = function(lifespan, vintage) {
			return parseInt(lifespan) + parseInt(vintage);
		}

		$scope.getWine = function(ID) {
			currentWines.getWine(ID).success(function(data) {
				$scope.wineData = data;
			})
			.error(function() {
				$scope.feedback.updateText = "That wine doesn't exist in the database! Buy more wine!"
			})
		}

		$scope.removeEmptyProperties = function(wineData) {
			for (var prop in wineData) {
				if (wineData.prop === "") {
					delete wineData.prop;
				}
			}
		}

		$scope.addWineId = function(wine, id) {
			wine.update({databaseId: id});
		};
	}])

///////

	.controller('wineCtrl', ['$scope', 'currentWines', function($scope, currentWines) {

		$scope.getWinesList = function() {
			currentWines.getWineList().success(function(data) {
				$scope.wines = $scope.mapObjectToArray(data);
			})
		}(); 

		$scope.orderProp = "producer";

		$scope.setOrderProp = function(prop) {
			return $scope.orderProp = prop;
		}
	}])

///////

	.controller('addCtrl', ['$scope', 'currentWines', function($scope, currentWines) {

		$scope.resetWineData();

		var newWine = $scope.wineData;
		var onComplete = function(error) {
			if (error) {
				$scope.feedback.responseText = "Failed";
			} else {
				$scope.feedback.responseText = "Added!";
			}
		};

		$scope.addWine = function() {
			var age = $scope.getDrinkYear($scope.wineData.lifespan, $scope.wineData.vintage);
			if (!isNaN(age)) {
				newWine.age = age;
			}
			/// Removes clutter of empty properties from angular form
			$scope.removeEmptyProperties(newWine);

			/// Adds a wine to the database and sets a unique name to reference the wine object
			var addedWine = $scope.wineRef.push(newWine, onComplete);
			var addedWineId = addedWine.name();

			$scope.addWineId(addedWine, addedWineId);
		};
	}])

////////

	.controller('singleCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.getWine($routeParams.Id);

	}])

////////

	.controller('updateCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.getWine($routeParams.Id);

		$scope.updateWine = function() {
			var updatedWine = $scope.wineData;
			updatedWine.age = $scope.getDrinkYear($scope.wineData.lifespan, $scope.wineData.vintage);

			currentWines.updateWine(updatedWine.databaseId, updatedWine).success(function() {
				$scope.feedback.responseText = "Wine Updated";
			})
			.error(function() {
				$scope.feedback.responseText = "Oops! Something happened during the update! Please try again."
			})
		};
	}])

})();