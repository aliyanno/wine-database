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
		$scope.modalOn = false;

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

		$scope.getWine = function(cellar, ID) {
			currentWines.getWine(cellar, ID).success(function(data) {
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
		}

		$scope.toggleModal = function() {
			$scope.modalOn = !$scope.modalOn;
		};

		// Firebase auth & login

		var dbRef = new Firebase('https://popping-fire-1713.firebaseio.com');
		var auth = FirebaseSimpleLogin(dbRef, function(error, user) {
			if (error) {
				console.log(error)
			} else if (user) {
				$scope.userName = user.displayName;
				console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
			} else {
				$scope.userName = undefined;
				// user is logged out
			}
		});
		$scope.login = function() {
			auth.login('google');
		}
		$scope.logout = function() {
			auth.logout();
		}

	}])

///////

	.controller('wineCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;

		$scope.getWinesList = function(cellar) {
			currentWines.getWineList(cellar).success(function(data) {
				$scope.wines = $scope.mapObjectToArray(data);
			})
		}
		$scope.getWinesList($scope.cellar); 

		$scope.orderProp = "producer";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		}

	}])

///////

	.controller('addCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;

		$scope.cellarRef = new Firebase('https://popping-fire-1713.firebaseio.com/' + $scope.cellar + '/wines/');

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

			/// Adds a wine to the database and sets a unique databaseId to reference the wine object
			var addedWine = $scope.cellarRef.push(newWine, onComplete);
			var addedWineId = addedWine.name();

			$scope.addWineId(addedWine, addedWineId);
		};
	}])

////////

	.controller('singleCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;

		$scope.getWine($scope.cellar, $routeParams.Id);

	}])

////////

	.controller('updateCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;

		$scope.getWine($scope.cellar, $routeParams.Id);

		$scope.updateWine = function() {
			var updatedWine = $scope.wineData;
			updatedWine.age = $scope.getDrinkYear($scope.wineData.lifespan, $scope.wineData.vintage);

			currentWines.updateWine($scope.cellar, updatedWine.databaseId, updatedWine).success(function() {
				$scope.feedback.responseText = "Wine Updated";
			})
			.error(function() {
				$scope.feedback.responseText = "Oops! Something happened during the update! Please try again."
			})
		};
	}])

})();
