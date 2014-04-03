(function() {
	'use strict';

var cellarControllers = angular.module('cellarControllers', []);

cellarControllers
	.controller('cellarCtrl', ['$scope', 'currentCellars', function($scope, currentCellars) {

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

	function Cellar(name, owner) {
		this.name = name;
		this.owner = owner
		this.date = new Date();
		this.dateMade = ((this.date.getMonth() + 1) + '/' + (this.date.getDate()) + '/' + (this.date.getFullYear()));
	}

})();