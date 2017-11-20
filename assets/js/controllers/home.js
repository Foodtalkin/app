'use strict';

/* Controllers */

angular.module('app')
    .controller('HomeCtrl', ['$scope','HomeFact','$state','$rootScope','$location',
     function($scope,HomeFact,$state,$rootScope,$location) {

        $rootScope.app.name = "Food Talk Privilege";
        $rootScope.app.description = "Loremipsum";
        $rootScope.app.image = "assets/img/logo.png";
        $rootScope.app.pageurl = $location.absUrl();


    	$scope.mainUrl = "http://stg-api.foodtalk.in/experiences";
    	HomeFact.getList($scope.mainUrl,function(response){
    		$scope.eventList = response.data.result.data;
    		console.log(response);
    		$scope.next_Page = response.data.result.next_page_url;
    		if(response.data.result.current_page == response.data.result.last_page){
    			$scope.showLoadMore = false;
    		}else{
    			$scope.showLoadMore = true;
    		}
    	})
    	$scope.openDetails = function(id){
    		$state.go('app.details',{id:id});
    	}

        $scope.nextPage = function(url){
            HomeFact.getList(url,function(response){
                console.log(response.data.result);
                $scope.eventList = $scope.eventList.concat(response.data.result.data);
                $scope.next_Page = response.data.result.next_page_url;
            })
        }

    }])
    .factory('HomeFact', ['$http', function($http){
    	var HomeFact = {};

    	HomeFact.getList = function(url, callback){
    		$http({
				method: 'GET',
				url: url
			}).then(function(response) {
	            callback(response);
	        });
    	}
    	return HomeFact;
    }]);


