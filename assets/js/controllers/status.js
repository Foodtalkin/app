'use strict';

angular.module('app')
.controller('statusCtrl', ['$scope','$cookies','statusFact', '$interval',
 function($scope, $cookies,statusFact,$interval){

	if($cookies["session"] != "" || $cookies["order_id"] != ""){
		statusFact.orderStatus($cookies["order_id"], $cookies["session"], function(response){
			console.log(response);
			$scope.checking_done = true;
			$scope.oderdetails = response.data.result.metadata;
			if(response.data.result.payment_status == "TXN_SUCCESS"){
				$scope.call_success = true;
				$scope.call_fail = false;
				$scope.mainhead = "Booking Successful";
				$scope.mymsg = "We have sent your tickets on sms and email.";
				$interval.cancel($scope.mypromis);
			}else if(response.data.result.payment_status == "TXN_FAILURE"){
				$scope.call_fail = true;
				$scope.call_success = false;
				$interval.cancel($scope.mypromis);
			}else if(response.data.result.payment_status == "PENDING"){
				$scope.mypromis = $interval($scope.checkstatus, 10000);
				$scope.call_success = true;
				$scope.call_fail = false;
				$scope.mainhead = "Varifying";
				$scope.mymsg = "We are varifying this transaction with Paytm.</br> Please wait a few moments."
			}else{
				console.log("error");
			}
		})
		
	}else{
		console.log('error');
	}
	$scope.checkstatus = function(){
		statusFact.orderStatus($cookies["order_id"], $cookies["session"], function(response){
			console.log(response);
			$scope.checking_done = true;
			$scope.oderdetails = response.data.result.metadata;
			if(response.data.result.payment_status == "TXN_SUCCESS"){
				$scope.call_success = true;
				$scope.call_fail = false;
				$scope.mainhead = "Booking Successful";
				$scope.mymsg = "We have sent your tickets on sms and email.";
				$interval.cancel($scope.mypromis);
			}else if(response.data.result.payment_status == "TXN_FAILURE"){
				$scope.call_fail = true;
				$scope.call_success = false;
				$interval.cancel($scope.mypromis);
			}else if(response.data.result.payment_status == "PENDING"){
				$scope.call_success = true;
				$scope.call_fail = false;
				$scope.mainhead = "Varifying";
				$scope.mymsg = "We are varifying this transaction with Paytm.</br> Please wait a few moments."
			}else{
				console.log("error");
			}
		})
	}
		
}])
.factory('statusFact', ['$http','urlFact', function($http, urlFact){
	var statusFact = {};
	statusFact.orderStatus = function(orderId, sessionId, callback){
		$http({
			method: 'GET',
			url: urlFact.orderstatus+orderId+"?sessionid="+sessionId
		}).then(function(response) {
            callback(response);
        });
	}
	return statusFact;
}])