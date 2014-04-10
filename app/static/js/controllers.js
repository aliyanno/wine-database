(function() {
	'use strict';

var cellarControllers = angular.module('cellarControllers', []);

cellarControllers

// Cellar App Controller sets up object structure and initial state of
// app. It also controls the login/logout functionality through // Firebase
// -----------
	.controller('CellarAppCtrl', ['$scope', 'currentWines', 'currentCellars', 'utility', function($scope, currentWines, currentCellars, utility) {

		$scope.user = {};
		$scope.wines = [];
		$scope.feedback = {};
		$scope.wineData = {
			"available": true,
			"quantity": 1,
		};
		$scope.modalOn = false;

		$scope.toggleModal = function() {
			$scope.modalOn = !$scope.modalOn;
		};

// this should be changed in the service
		$scope.getWine = function(cellar, ID) {
			currentWines.getWine(cellar, ID)
			.success(function(data) {
				$scope.wineData = data;
			});
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

		// put this into service as well

		$scope.getUserName = function(cellar) {
			currentCellars.getCellarOwner(cellar).success(function(data) {
				$scope.user.name = data;
			})
		}
	}])

// Cellar List Controll populates a list of active cellars 
// from Firebase. Any user is allowed to view cellars, but    // can only add cellars and wine if they are logged in.
// -----------
	.controller('CellarListCtrl', ['$scope', 'currentCellars', 'utility', function($scope, currentCellars, utility) {

		$scope.getCellars = function(){
			currentCellars.getCellarList($scope);
			console.log($scope.cellars);
			// is it bad practice to pass $scope, how can I pass a throw-away variable then set it to scope.cellars--having trouble figuring out timing

			angular.forEach($scope.cellars, function (cellar) {
				cellar.cellarSize = utility.listObjectProperties(cellar.wines).length;
			});
		}();

		$scope.orderProp = "name";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		};

		$scope.addCellar = function() {
			var newCellar = new utility.Cellar($scope.cellarName, $scope.user.name);
			currentCellars.addCellar(newCellar); 
		};
	}])

// Wine List Control grabs active cellar and populates a list // of wines in that cellar from the Firebase database
// -----------
	.controller('WineListCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function($scope, $routeParams, currentWines, utility) {

		$scope.cellar = $routeParams.Cellar;

		$scope.getWinesList = function(cellar) {
			$scope.wines = currentWines.getWineList(cellar);
		}
		$scope.getWinesList($scope.cellar); 

		$scope.cellar.owner = $scope.getUserName($scope.cellar);

		$scope.orderProp = "producer";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		}

	}])

// Wine Add Controller controls a form allowing the owner of // the cellar to add a wine to that cellar.
// -----------

	.controller('WineAddCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function($scope, $routeParams, currentWines, utility) {

		$scope.cellar = $routeParams.Cellar;
		$scope.cellarOwner = $scope.getUserName($scope.cellar);

		$scope.cellarRef = new Firebase('https://cellared.firebaseio.com/cellars/' + $scope.cellar + '/wines/');

		utility.resetWineData();

		var newWine = $scope.wineData;
		var onComplete = function(error) {
			if (error) {
				$scope.feedback.responseText = "Failed";
			} else {
				$scope.feedback.responseText = "Added!";
			}
		};
// include this function as part of addWine
		// $scope.addWineId = function(wine, id) {
		// 	wine.update({databaseId: id});
		// }

		$scope.addWine = function() {
			// gets 
			var drinkYear = utility.getDrinkYear($scope.wineData.lifespan, $scope.wineData.vintage);
			if (!isNaN(age)) {
				newWine.drinkYear = drinkYear;
			}
			/// Removes clutter of empty properties from angular form
			utility.removeEmptyProperties(newWine);

			/// Adds a wine to the database and sets a unique databaseId to reference the wine object
			var addedWine = $scope.cellarRef.push(newWine, onComplete);
			// gets unique database id = "name"
			var addedWineId = addedWine.name();
			
			// updates wine on database to include it's unique id as another property
			function addWineId (wine, wineId) {
				wine.update({databaseId: id});
			};
			addWineId(addedWine, addedWineId);
			
			// updates wine on database to include it's unique id as another property
			// $scope.addWineId(addedWine, addedWineId);
		};
	}])

// Wine Detail Controller is a display of the current 
// properties of an active wine object from the wine list 
// display
// -----------

	.controller('WineDetailCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function($scope, $routeParams, currentWines, utility) {

		$scope.cellar = $routeParams.Cellar;
		$scope.cellarOwner = $scope.getUserName($scope.cellar);

		// $scope.getWine($scope.cellar, $routeParams.Id);
		currentWines.getWine($scope.cellar, $routeParams.Id, $scope);

	}])

// Wine Update Controller is a form filled out with current 
// wine data allowing user, if owner, to edit the details of 
// that wine
// -----------
	.controller('WineUpdateCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function($scope, $routeParams, currentWines, utility) {

		$scope.cellar = $routeParams.Cellar;
		$scope.cellarOwner = $scope.getUserName($scope.cellar);

		$scope.getWine($scope.cellar, $routeParams.Id);

		$scope.updateWine = function() {
			var updatedWine = $scope.wineData;
			updatedWine.age = utility.getDrinkYear($scope.wineData.lifespan, $scope.wineData.vintage);

			currentWines.updateWine($scope.cellar, updatedWine.databaseId, updatedWine).success(function() {
				$scope.feedback.responseText = "Wine Updated";
			})
			.error(function() {
				$scope.feedback.responseText = "Oops! Something happened during the update! Please try again."
			})
		};
	}])

})();
