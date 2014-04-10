(function () {
	'use strict';

var cellarControllers = angular.module('cellarControllers', []);

cellarControllers

// Cellar App Controller sets up object structure and initial state of
// app. It also controls the login/logout functionality through // Firebase
// -----------
	.controller('CellarAppCtrl', ['$scope', 'currentWines', 'currentCellars', 'utility', function ($scope, currentWines, currentCellars, utility) {

		$scope.data = {
			'user' : {},
			'wines' : [],
			'wine' : {},
			'feedback' : {},
			'modalOn' : false,
		};

		// Firebase auth & login

		var dbRef = new Firebase('https://cellared.firebaseio.com');
		var auth = FirebaseSimpleLogin(dbRef, function (error, user) {
			if (error) {
				$scope.data.user.loggedIn = false;
				$scope.data.user.name = {};
				$scope.data.feedback.errorText = "An error occured! Please try logging in again."
				// error occurs and sets error text 
			} else if (user) {
				$scope.data.user.loggedIn = true;
				$scope.data.user.name = user.displayName;
				// user is logged in, sets user.name object to user's   // displayName
			} else {
				$scope.data.user.loggedIn = false;
				$scope.data.user.name = {};
				// user is logged out
			}
		});

		$scope.login = function () {
			auth.login('google');
		};

		$scope.logout = function () {
			auth.logout();
			$scope.data.user.loggedIn = false;
		};

	}])

// Cellar List Controll populates a list of active cellars 
// from Firebase. Any user is allowed to view cellars, but    
// can only add cellars and wine if they are logged in.
// -----------
	.controller('CellarListCtrl', ['$scope', 'currentCellars', 'utility', function ($scope, currentCellars, utility) {

		// resets data.cellar so that there is no data
		// carry-over when selecting another cellar
		$scope.data.cellar = null;

		$scope.toggleModal = function () {
			$scope.data.modalOn = !$scope.data.modalOn;
		};

		$scope.getCellars = function (){
			currentCellars.getCellarList().then(function (data) {
				$scope.data.cellars = data;

				// once .cellars is defined, get number of wines
				angular.forEach($scope.data.cellars, function (cellar) {
					cellar.cellarSize = utility.listObjectProperties(cellar.wines).length;
				});
			});
		}();

		// Create an object to control the order of the cellars in ng-repeat
		$scope.data.orderProp = "name";

		$scope.setOrderProp = function (prop) {
			$scope.data.orderProp = prop;
		};

		$scope.addCellar = function () {
			var newCellar = new utility.Cellar($scope.data.cellar, $scope.data.user.name);
			currentCellars.addCellar(newCellar); 
		};
	}])

// Wine List Control grabs active cellar and populates a list 
// of wines in that cellar from the Firebase database
// -----------
	.controller('WineListCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function ($scope, $routeParams, currentWines, utility) {

		// sets the active cellar from the url created in adding or selecting a 
		// cellar
		$scope.data.cellar = $routeParams.Cellar;

		// makes sure there is no data carry-over when
		// viewing another wine
		utility.resetWine();

		$scope.getWinesList = function (cellar) {
			currentWines.getWineList(cellar).then(function (data) {
				$scope.data.wines = data;
			});
		}; 
		$scope.getWinesList($scope.data.cellar); 

		$scope.data.orderProp = "producer";

		$scope.setOrderProp = function (prop) {
			$scope.data.orderProp = prop;
		};
		
	}])

// Wine Detail Controller is a display of the current 
// properties of an active wine object from the wine list 
// display
// -----------

	.controller('WineDetailCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function ($scope, $routeParams, currentWines, utility) {

		// checks to see if data.wine has active wine data
		// since wine.producer only exists after data is retrieved
		// if not, pulls wine data from Firebase

		if ($routeParams.Id !== $scope.data.wine.databaseId) {
			currentWines.getWine($scope.data.cellar, $routeParams.Id).then(function (data) {
				$scope.data.wine = data.data;
			});
		}
	}])

// Wine Add Controller controls a form allowing the owner of 
// the cellar to add a wine to that cellar.
// -----------

	.controller('WineAddCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function ($scope, $routeParams, currentWines, utility) {

		$scope.data.cellarRef = new Firebase('https://cellared.firebaseio.com/cellars/' + $scope.data.cellar + '/wines/');

		utility.resetWine();

		var newWine = $scope.data.wine;
		var onComplete = function (error) {
			if (error) {
				$scope.data.feedback.responseText = "Failed";
			} else {
				$scope.data.feedback.responseText = "Added!";
			}
		};

		$scope.addWine = function () {
			var drinkYear = utility.getDrinkYear($scope.data.wine.lifespan, $scope.data.wine.vintage);
			if (!isNaN(drinkYear)) {
				newWine.drinkYear = drinkYear;
			}
			/// Removes clutter of empty properties from angular form
			utility.removeEmptyProperties(newWine);

			/// Adds a wine to the database and sets a unique databaseId to reference the wine object
			var addedWine = $scope.data.cellarRef.push(newWine, onComplete);
			// gets unique database id = "name"
			var wineId = addedWine.name();
			
			// updates wine on database to include it's unique id as another property
			function addWineId (wine, wineId) {
				wine.update({databaseId: wineId});
			};
			addWineId(addedWine, wineId);
		};
	}])

// Wine Update Controller is a form filled out with current 
// wine data allowing user, if owner, to edit the details of 
// that wine
// -----------
	.controller('WineUpdateCtrl', ['$scope', '$routeParams', 'currentWines', 'utility', function ($scope, $routeParams, currentWines, utility) {

		$scope.updateWine = function () {
			var updatedWine = $scope.data.wine;
			updatedWine.drinkYear = utility.getDrinkYear($scope.data.wine.lifespan, $scope.data.wine.vintage);

			currentWines.updateWine($scope.data.cellar, updatedWine.databaseId, updatedWine).success(function () {
					$scope.data.feedback.responseText = "Wine Updated";
				})
				.error(function () {
					$scope.data.feedback.responseText = "Oops! Something happened during the update! Please try again."
				})
		};
	}])

})();
