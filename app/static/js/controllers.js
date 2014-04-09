(function() {
	'use strict';

var wineControllers = angular.module('wineControllers', []);

wineControllers

// Cellar App Controller sets up object structure and initial state of
// app. It also controls the login/logout functionality through // Firebase
// -----------
	.controller('CellarAppCtrl', ['$scope', 'currentWines', 'currentCellars', function($scope, currentWines, currentCellars) {

		$scope.user = {};
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

		var dbRef = new Firebase('https://cellared.firebaseio.com');
		var auth = FirebaseSimpleLogin(dbRef, function(error, user) {
			if (error) {
				$scope.user.loggedIn = false;
				$scope.user.name = {};
				$scope.feedback.errorText = "An error occured! Please try logging in again."
				// error occurs and sets error text 
			} else if (user) {
				$scope.user.loggedIn = true;
				$scope.user.name = user.displayName;
				// user is logged in, sets user.name object to user's   // displayName
			} else {
				$scope.user.loggedIn = false;
				$scope.user.name = {};
				// user is logged out
			}
		});

		$scope.login = function() {
			auth.login('google');
		}
		$scope.logout = function() {
			auth.logout();
			$scope.user.loggedIn = false;
		}

		// Check authorization

		$scope.getUserName = function(cellar) {
			currentCellars.getCellarOwner(cellar).success(function(data) {
				return data;
			})
		}
	}])

// Wine List Control grabs active cellar and populates a list of // wines in that cellar from the Firebase database
// -----------
	.controller('WineListCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;

		$scope.getWinesList = function(cellar) {
			currentWines.getWineList(cellar).success(function(data) {
				$scope.wines = $scope.mapObjectToArray(data);
			})
		}
		$scope.getWinesList($scope.cellar); 

		$scope.cellar.owner = $scope.getUserName($scope.cellar);

		$scope.orderProp = "producer";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		}

	}])

// Wine Add Controller controls a form allowing the owner of the // cellar to add a wine to that cellar.
// -----------

	.controller('WineAddCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;
		$scope.cellarOwner = $scope.getUserName($scope.cellar);

		$scope.cellarRef = new Firebase('https://cellared.firebaseio.com/cellars/	' + $scope.cellar + '/wines/');

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

// Wine Detail Controller is a display of the current properties
// of an active wine object from the wine list display
// -----------

	.controller('WineDetailCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;
		$scope.cellarOwner = $scope.getUserName($scope.cellar);

		$scope.getWine($scope.cellar, $routeParams.Id);

	}])

// Wine Update Controller is a form filled out with current wine
// data allowing user, if owner, to edit the details of that wine
// -----------
	.controller('WineUpdateCtrl', ['$scope', '$routeParams', 'currentWines', function($scope, $routeParams, currentWines) {

		$scope.cellar = $routeParams.Cellar;
		$scope.cellarOwner = $scope.getUserName($scope.cellar);

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

// Cellar List Controll populates a list of active cellars from
// Firebase. Any user is allowed to view cellars, but can only add
// cellars and wine if they are logged in.
// -----------
	.controller('CellarListCtrl', ['$scope', 'currentCellars', function($scope, currentCellars) {

		$scope.getCellars = function(){
			currentCellars.getCellarList().success(function(data) {
				$scope.cellars = $scope.mapObjectToArray(data);

				angular.forEach($scope.cellars, function(cellar) {
					cellar.cellarSize = $scope.mapObjectToArray(cellar.wines).length;
				})
			
			});
		}();

		$scope.orderProp = "name";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		}

		$scope.addCellar = function() {
			var newCellar = new Cellar($scope.cellarName, $scope.userName);
			currentCellars.addCellar(newCellar).success(function() {
				console.log("success");
			}); 
		}
	}])

})();
