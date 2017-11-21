/* ============================================================
 * File: main.js
 * Main Controller to set global scope variables. 
 * ============================================================ */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$state', 'mainFact','$cookies','$cookieStore',
     function($scope, $rootScope, $state, mainFact, $cookies,$cookieStore) {

        // $cookieStore.remove('session');
        // $cookieStore.remove('username');
        // remove orderid check and use other api to test session
        if($cookies["session"] != ""){
            mainFact.checksess($cookies["session"], function(response){
                if(response.data.code == "401"){
                    $cookieStore.remove('session');
                    $cookieStore.remove('username');
                    $cookieStore.remove('order_id');
                }else{
                    $scope.getUser();
                }
            })
        }
        // App globals
        $rootScope.app = {
            name: 'Food Talk Privilege',
            description: 'lorem ipsum',
            layout: {
                menuPin: false,
                menuBehind: true,
                theme: 'pages/css/pages.css'
            },
            author: 'FoodTalk'
        }
        
        
        // Checks if the given state is the current state
        $scope.is = function(name) {
            return $state.is(name);
        }

        // Checks if the given state/child states are present
        $scope.includes = function(name) {
            return $state.includes(name);
        }

        
        // Broadcasts a message to pgSearch directive to toggle search overlay
        $scope.showSearchOverlay = function() {
            $scope.$broadcast('toggleSearchOverlay', {
                show: true
            })
        }

        $rootScope.userLoggedIn = false;
        

        $scope.dologut = function(){
        	mainFact.logout($cookies['session'], function(response){
        		console.log(response);
        		$cookieStore.remove('session');
        		$cookieStore.remove('username');
        		$rootScope.userLoggedIn = false;
        	})
        }

        $scope.getUser = function(){
            $rootScope.myUser = $cookies["username"];
            $rootScope.userLoggedIn = true;
        }
    }]);

angular.module('app').factory('mainFact', ['$http','urlFact', function($http, urlFact){
    var mainFact = {};

    mainFact.checkPhone = function(phone, callback){
        $http({
            method: 'GET',
            url: urlFact.checkuser + phone
        }).then(function(response) {
            callback(response);
        });
    }

    mainFact.logout = function(session, callback){
        $http({
            method: 'DELETE',
            url: urlFact.userLogout + session
        }).then(function(response) {
            callback(response);
        });
    }

    mainFact.getOtp = function(phone, callback){
        $http({
            method: 'POST',
            url: urlFact.getOtp,
            data: {
                phone : phone
            }
        }).then(function(response) {
            callback(response);
        });
    }

    mainFact.signup = function(name, email, phone, callback){
        $http({
            method: 'POST',
            url: urlFact.getOtp,
            data: {
                name : name,
                phone : phone,
                email : email,
                signup : true
            }
        }).then(function(response) {
            callback(response);
        });
    }

    mainFact.login = function(phone, otp, callback){
        $http({
            method: 'POST',
            url: urlFact.userlogin,
            data: {
                phone : phone,
                otp : otp
            }
        }).then(function(response) {
            callback(response);
        });
    }
    mainFact.checksess = function(sessionId, callback){
        $http({
            method: 'GET',
            url: urlFact.userprofile+sessionId
        }).then(function(response) {
            callback(response);
        });
    }
    return mainFact;
}])


angular.module('app')
    /*
        Use this directive together with ng-include to include a 
        template file by replacing the placeholder element
    */
    
    .directive('includeReplace', function() {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function(scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    })



    