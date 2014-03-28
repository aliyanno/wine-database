(function() {
	'use strict';

var cellarControllers = angular.module('cellarControllers', []);

cellarControllers
	.controller('cellarCtrl', ['$scope', 'currentCellars', function($scope, currentCellars) {

		$scope.getCellars = function(){
			currentCellars.getCellarList().success(function(data) {
				$scope.cellars = $scope.mapObjectToArray(data);
			})
		}();

		$scope.orderProp = "name";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		}
	}])

})();