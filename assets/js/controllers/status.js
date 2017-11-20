'use strict';

angular.module('app')
.controller('statusCtrl', ['$scope','$cookies','statusFact', function($scope, $cookies,statusFact){

	if($cookies["session"] != "" || $cookies["order_id"] != ""){
		statusFact.orderStatus($cookies["order_id"], $cookies["session"], function(response){
			console.log(response);
			$scope.checking_done = true;
			$scope.oderdetails = response.data.result.metadata;
			if(response.data.result.payment_status == "TXN_SUCCESS"){
				$scope.call_success = true;
				$scope.call_fail = false;
			}else if(response.data.result.payment_status == "TXN_FAILURE"){
				$scope.call_fail = true;
				$scope.call_success = false;
			}else{
				console.log("panding");
			}
		})
	}

		
}])
.factory('statusFact', ['$http', function($http){
	var statusFact = {};
	statusFact.orderStatus = function(orderId, sessionId, callback){
		$http({
			method: 'GET',
			url: "http://stg-api.foodtalk.in/experiences/orderstatus/"+orderId+"?sessionid="+sessionId
		}).then(function(response) {
            callback(response);
        });
	}
	return statusFact;
}])