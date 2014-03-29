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

		$scope.cellarName = "Default2";

		$scope.orderProp = "name";

		$scope.setOrderProp = function(prop) {
			$scope.orderProp = prop;
		}

		$scope.addCellar = function() {
			var newCellar = new Cellar($scope.cellarName);
			currentCellars.addCellar(newCellar).success(function() {
				console.log("success");
			}) 
		}
	}])

	function Cellar(name) {
		this.name = name;
		this.owner = "Aliya";
		this.wines = {};
		this.size = Object.keys(this.wines).length;
	}

})();