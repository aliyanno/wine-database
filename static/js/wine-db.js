var wineApp = angular.module('wineApp', []);

wineApp.controller('wineCtrl', ['$scope', 'currentWines', function($scope, currentWines) {
	$scope.responseText = "Testing...";
	$scope.wineData = {"name": "Aliya", "variety": "Pinot"};


	$scope.addWine = function() {
		currentWines.addWineToServer($scope.wineData).success(function() {
			$scope.responseText = "Added!";
			$scope.showWines();
		})
		.error(function() {
			$scope.responseText = "Failed";
		})
	};

	// $scope.updateWine = function() {
	// 	currentWines.updateWine($scope.wineId, $scope.wineChanges).success(function() {
			
	// 	}
	// }

	$scope.showWines = function() {
		currentWines.getWineList().success(function(data) {
			$scope.wines = data.wines;
		})
	};
	$scope.showWines();
}]);


wineApp.factory('currentWines', ['$http', function($http) {
		return {
			getWine: function(id) {
				return $http({method: 'GET', url: '/api/wine/' + id + '.json',})
			},
			updateWine: function(id, wineData) {
				return $http({method: 'POST', url: '/api/wine/' + id + '.json', data: wineData,})
			},
			addWineToServer: function(wineData) {
				var data = angular.toJson(wineData);
				return $http({method: 'PUT', dataType: 'json', url: '/api/wine', data: wineData,})
			},
			getWineList: function() {
				return $http({method: 'GET', url: '/api/wine/list',})
			},
		};
}])