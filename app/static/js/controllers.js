(function () {
  'use strict';

var cellarControllers = angular.module('cellarControllers', ['cellarServices']);

cellarControllers

// Cellar App Controller sets up object structure and initial state of
// app. It also controls the login/logout functionality through // Firebase
// -----------
  .controller('CellarAppCtrl', ['$scope', function ($scope) {

    $scope.data = {
      'wines' : [],
      'wine' : {},
      'feedback' : {},
      'modalOn' : false,
      'user' : {
        'name' : null,
        'error' : null,
        'loggedIn' : false,
      }
    };

    var dbRef = new Firebase('https://cellared.firebaseio.com');
    var auth = FirebaseSimpleLogin(dbRef, function (error, user) {
      $scope.$apply(function () {
        if (error) {
          return $scope.data.user = {
            'name' : null,
            'error' : error,
            'loggedIn' : false,
          };
        } else if (user) {
          return $scope.data.user = {
            'name' : user.displayName,
            'error' : null,
            'loggedIn' : true,
          };
        } else {
          return $scope.data.user = {
            'name' : null,
            'error' : null,
            'loggedIn' : false,
          };
        }
      });
    });


    $scope.login = function () {
      auth.login('google');
    };

    $scope.logout = function () {
      auth.logout();
    };

  }])

// Cellar List Controll populates a list of active cellars 
// from Firebase. Any user is allowed to view cellars, but    
// can only add cellars and wine if they are logged in.
// -----------
  .controller('CellarListCtrl', ['$scope', 'Cellars', function ($scope, Cellars) {

    // resets data.cellar so that there is no data
    // carry-over when selecting another cellar
    $scope.data.cellar = null;
    $scope.data.feedback.responseText = "";

    $scope.toggleModal = function () {
      $scope.data.modalOn = !$scope.data.modalOn;
    };

    $scope.getCellars = function (){
      Cellars.getCellarList().then(function (data) {
        $scope.data.cellars = data;

        // once .cellars is defined, get number of wines
        angular.forEach($scope.data.cellars, function (cellar) {
          var wineArray = [];
          angular.forEach(cellar.wines, function (wine) {
            wineArray.push(wine);
          })
          cellar.cellarSize = wineArray.length;
        });
      });
    };

    $scope.getCellars();

    // Create an object to control the order of the cellars in ng-repeat
    $scope.data.orderProp = "name";

    $scope.setOrderProp = function (prop) {
      $scope.data.orderProp = prop;
    };

    // Constructor for new cellars
    function Cellar (name, owner) {
      this.name = name;
      this.owner = owner;
      this.date = new Date();
      this.dateMade = ((this.date.getMonth() + 1) + '/' + (this.date.getDate()) + '/' + (this.date.getFullYear()));
    };

    $scope.addCellar = function () {
      var newCellar = new Cellar($scope.data.cellar, $scope.data.user.name);
      Cellars.addCellar(newCellar); 
    };
  }])

// Wine List Control grabs active cellar and populates a list 
// of wines in that cellar from the Firebase database
// -----------
  .controller('WineListCtrl', ['$scope', '$routeParams', 'Wines', 'Cellars', function ($scope, $routeParams, Wines, Cellars) {

    // sets the active cellar from the url created in adding or selecting a cellar
    $scope.data.cellar = $routeParams.Cellar;

    // Reset app data
    $scope.data.wines = [];
    $scope.data.wine = {
      "available": true,
      "quantity": 1,
    };

    $scope.getWinesList = function (cellar) {
      Wines.getWineList(cellar).then(function (response) {
        $scope.data.wines = response;
      });
    }; 
    $scope.getWinesList($scope.data.cellar); 

    $scope.data.orderProp = "producer";

    $scope.setOrderProp = function (prop) {
      $scope.data.orderProp = prop;
    };

    Cellars.getCellar($scope.data.cellar, 'owner')
      .then(function (response) {
        $scope.data.cellarOwner = response.data.owner;
    });

    
  }])

// Wine Detail Controller is a display of the current 
// properties of an active wine object from the wine list 
// display
// -----------

  .controller('WineDetailCtrl', ['$scope', '$routeParams', 'Wines', function ($scope, $routeParams, Wines) {

    // checks to see if data.wine is current for the active
    // wine by comparing to the route URL. If not, gets new
    // wine data 
    $scope.data.cellar = $routeParams.Cellar;

    if ($routeParams.Id !== $scope.data.wine.databaseId) {
      Wines.getWine($scope.data.cellar, $routeParams.Id).then(function (data) {
        $scope.data.wine = data.data;
      });
    }
  }])

// Wine Add Controller controls a form allowing the owner of 
// the cellar to add a wine to that cellar.
// -----------

  .controller('WineAddCtrl', ['$scope', '$routeParams', 'Wines', function ($scope, $routeParams, Wines) {

    $scope.data.wine = {
      "available": true,
      "quantity": 1,
    };

    $scope.data.cellar = $routeParams.Cellar;
    var newWine = $scope.data.wine;

    $scope.addWine = function () {
      var drinkYear = parseInt(newWine.lifespan, 10) + parseInt(newWine.vintage, 10);
      if (!isNaN(drinkYear)) {
        newWine.drinkYear = drinkYear;
      }

      /// Removes clutter of empty properties from form
      function removeEmptyProperties (wine) {
        for (var prop in wine) {
          if (wine.prop === "") {
            delete wine.prop;
          }
        }
      }(newWine);

      // Adds a wine to the database and sets a unique databaseId to reference the wine object
      Wines.addWine($scope.data.cellar, newWine)
        .success(function (response) {
          var wineId = response.name;

          // Updates the new wine with a unique Id
          Wines.updateWine($scope.data.cellar, wineId, { databaseId: wineId });

          // Updates the cellar wine list
          Wines.getWineList($scope.data.cellar).then(function (response) {
            $scope.data.wines = response;
          });
          $scope.data.feedback.responseText = "Wine Added!";
      });
    };
  }])

// Wine Update Controller is a form filled out with current 
// wine data allowing user, if owner, to edit the details of 
// that wine
// -----------
  .controller('WineUpdateCtrl', ['$scope', '$routeParams', 'Wines', function ($scope, $routeParams, Wines) {

    var updatedWine = $scope.data.wine;
    $scope.data.cellar = $routeParams.Cellar;

    $scope.updateWine = function () {
      var drinkYear = parseInt(updatedWine.lifespan, 10) + parseInt(updatedWine.vintage, 10);
      if (!isNaN(drinkYear)) {
        updatedWine.drinkYear = drinkYear;
      }

      Wines.updateWine($scope.data.cellar, updatedWine.databaseId, updatedWine).success(function () {
          $scope.data.feedback.responseText = "Wine Updated";
        })
        .error(function () {
          $scope.data.feedback.responseText = "Oops! Something happened during the update! Please try again."
        })
    };
  }])

})();
