'use strict';

/* Controllers */

angular.module('app')
    .controller('detailsCtrl', ['$scope','detailsFact','$state','$stateParams','$sce','mainFact','$cookies','$rootScope','$location','$pixel',
     function($scope,detailsFact,$state,$stateParams,$sce,mainFact,$cookies,$rootScope,$location,$pixel) {

    	detailsFact.getDetails($stateParams.id,function(response){
    		$scope.event = response.data.result;
    		console.log($scope.event);

                    // change date formate start
    				changeDateFormate();
                    // end

                $scope.available_s = [];
                if(parseInt($scope.event.avilable_seats) < 10){
                    for (var i=1; i<= parseInt($scope.event.avilable_seats); i++) {
                      $scope.available_s.push(i);
                    }
                }else{
                    for (var i=1; i<= 10; i++) {
                      $scope.available_s.push(i);
                    }
                }

                if($scope.event.avilable_seats == 0){
                    $scope.soldout = true;
                }

                if($scope.event.nonveg_preference == '1'){
                    $scope.asknv = true;
                }else{
                    $scope.asknv = false;
                }

            // meta tags for social media data

            angular.forEach($scope.event.data, function(value, key){
                if(value.type == "Text"){
                    $rootScope.app.description = value.content;
                    return false;
                }
            });

            $rootScope.app.name = $scope.event.title;
            $rootScope.app.image = $scope.event.cover_image;
            $rootScope.app.pageurl = $location.absUrl();
            // end


            $pixel.track('ViewContent', {
              content_name: $scope.event.title,
              content_category : 'experiences'
            })
    	});

        
        function changeDateFormate(){
            var start = $scope.event.start_time.split(" ");
                    
                    var H = +start[1].substr(0, 2);
                    var h = H % 12 || 12;
                    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
                    start[1] = h + start[1].substr(2, 3) + ampm;

                    var end = $scope.event.end_time.split(" ");

                    var H = +end[1].substr(0, 2);
                    var h = H % 12 || 12;
                    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
                    end[1] = h + end[1].substr(2, 3) + ampm;


                    var months = [{
                        id: '1',
                        name: 'Jan'
                    },
                    {
                        id: '2',
                        name: 'Feb'
                    },
                    {
                        id: '3',
                        name: 'Mar'
                    },
                    {
                        id: '4',
                        name: 'Apr'
                    },
                    {
                        id: '5',
                        name: 'May'
                    },
                    {
                        id: '6',
                        name: 'June'
                    },
                    {
                        id: '7',
                        name: 'July'
                    },
                    {
                        id: '8',
                        name: 'Aug'
                    },
                    {
                        id: '9',
                        name: 'Sept'
                    },
                    {
                        id: '10',
                        name: 'Oct'
                    },
                    {
                        id: '11',
                        name: 'Nov'
                    },
                    {
                        id: '12',
                        name: 'Dec'
                    }];
                    if(start[0] == end[0]){
                        var date = start[0].split("-");
                        angular.forEach(months, function(value, key){
                            if(value.id == date[1]){
                                date[1] = value.name;
                            }
                        })
                        $scope.event.time = date[2] + " " +date[1]+", "+date[0] +" at "+ start[1] +" - "+end[1];
                    }else{

                    }

        }
        $scope.changeCount = function(){
            $scope.seatcount = [];
            for (var i=0; i<= parseInt($scope.user.seats); i++) {
              $scope.seatcount.push(i);
            }
        }

        $scope.step2back = function(){
            $scope.step1 = true;
            $scope.step2 = false;
            $scope.step3 = false;
            $scope.step4 = false;
            $scope.step5 = false;
        }

        $scope.gotostep4 = function(){
            $scope.step1 = false;
            $scope.step2 = false;
            $scope.step3 = false;
            $scope.step4 = true;
            $scope.step5 = false;
        }


        $scope.modalSlideLeft = function() {
            setTimeout(function() {
                $('#modalSlideLeft2').modal('show');
            }, 300);
        };


        $scope.user = {};
        if($cookies['username'] && $cookies['username'] != ""){
            $scope.step4 = true;
            $scope.step1 = false;
            $scope.step2 = false;
            $scope.step3 = false;
        }else{
            $scope.step1 = true;
            $scope.step4 = false;
            $scope.step2 = false;
            $scope.step3 = false;
            console.log("No user");
        }
        
        $scope.checkPhone = function(){
            $rootScope.phone = $scope.user.phone;
            mainFact.checkPhone($scope.user.phone, function(response){
                console.log(response);
                if(response.data.code == "200"){
                    // number exist
                    $scope.step1 = false;
                    $scope.step3 = true;
                    $scope.getOtp();
                }else if(response.data.code == "404"){
                    // number not exist
                    $scope.step1 = false;
                    $scope.step2 = true;
                }else{
                    // error msg
                }
            })
        }

        $scope.getOtp = function(){
            mainFact.getOtp($scope.user.phone, function(response){
                console.log(response);
            })
        }

        $scope.dosignup = function(){
            console.log($scope.user);
            mainFact.signup($scope.user.username, $scope.user.email, $scope.user.phone, function(response){
                console.log(response);
                if(response.data.code == "200"){
                    $scope.step1 = false;
                    $scope.step2 = false;
                    $scope.step3 = true;
                    $pixel.track('CompleteRegistration');
                }
            })
        }

        $scope.dologin = function(){
            //console.log($scope.user.phone +"-"+ $scope.user.otp)
            mainFact.login($scope.user.phone, $scope.user.otp, function(response){
                console.log(response);
                if(response.data.code == "200"){
                    $cookies['session'] = response.data.result.session.session_id;
                    $cookies['username'] = response.data.result.name;
                    $scope.step1 = false;
                    $scope.step2 = false;
                    $scope.step3 = false;
                    $scope.step4 = true;
                    $scope.getUser();
                }
            })
        }

        $scope.sendTicketsCount = function(){
            console.log($scope.user);
                if($scope.event.nonveg_preference == '1'){
                    var data = {
                        "total_tickets" : $scope.user.seats,
                        "non_veg" : $scope.user.nonveg
                    }
                }else{
                    var data = {
                        "total_tickets" : $scope.user.seats
                    }
                }
                
            detailsFact.getEstimate($stateParams.id, data, $cookies["session"], function(response){
                console.log(response);
                if(response.data.code == "200"){

                    $scope.estimate = response.data.result;
                    $scope.getOrder();
                }
            })
        }

        $scope.getOrder = function(){
            //console.log($scope.user);
                if($scope.event.nonveg_preference == '1'){
                    var data = {
                        "total_tickets" : $scope.user.seats,
                        "non_veg" : $scope.user.nonveg,
                        "source":"web",
                        "callback_url":"http://app.foodtalk.in/#/payment/status"
                    }
                }else{
                    var data = {
                        "total_tickets" : $scope.user.seats,
                        "source":"web",
                        "callback_url": "http://app.foodtalk.in/#/payment/status"
                    }
                }
                
            detailsFact.getOrder($stateParams.id, data, $cookies["session"], function(response){
                console.log(response);
                $scope.paymentInfo = response.data.result;
                $cookies["order_id"] = $scope.paymentInfo.ORDER_ID;
                console.log($cookies["order_id"]);
                $scope.step4 = false;
                $scope.step5 = true;
            })
        }

        $scope.resetallForm = function(){
            if($rootScope.userLoggedIn){
                $scope.step4 = true;
                $scope.step1 = false;
                $scope.step2 = false;
                $scope.step3 = false;
                $scope.step5 = false;
            }else{
                $scope.step1 = true;
                $scope.step2 = false;
                $scope.step3 = false;
                $scope.step4 = false;
                $scope.step5 = false;
            }
        }

        $scope.getUser = function(){
            $rootScope.myUser = $cookies["username"];
            $rootScope.userLoggedIn = true;
        }
    }])
    .factory('detailsFact', ['$http','$location','urlFact', function($http,$location,urlFact){
    	var detailsFact = {};

    	detailsFact.getDetails = function(id, callback){
    		$http({
				method: 'GET',
				url: urlFact.experiences+"/"+id
			}).then(function(response) {
	            callback(response);
	        });
    	}

        detailsFact.getEstimate = function(id, data, session_id,callback){
            $http({
                method: 'POST',
                url: urlFact.experiences+"/"+id+"/order/estimate?sessionid="+session_id,
                data : data
            }).then(function(response) {
                callback(response);
            });
        }

        detailsFact.getOrder = function(id, data, session_id,callback){
            $http({
                method: 'POST',
                url: urlFact.experiences+"/"+id+"/order?sessionid="+session_id,
                data : data
            }).then(function(response) {
                callback(response);
            });
        }

        
        
    	return detailsFact;
    }]);


angular.module('app').controller('galleryCtrl', ['$scope', function($scope){
    // gallary code
        $scope.init = function() {
            $('.item-slideshow > div').each(function() {
                var img = $(this).data('image');
                $(this).css({
                    'background-image': 'url(' + img + ')',
                    'background-size': 'cover'
                })
            });
        }
        $scope.showItemDetails = function() {
            var dlg = new DialogFx($('#itemDetails').get(0));
            dlg.toggle();
        }
        $scope.showFilters = function() {
            $('#filters').toggleClass('open');
        }
        // end
}])