/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
            $urlRouterProvider
                .otherwise('/app/home');

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: "/app",
                    templateUrl: "tpl/app.html"
                })
                .state('app.dashboard', {
                    url: "/home",
                    templateUrl: "tpl/home.html",
                    controller: 'HomeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/home.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.details', {
                    url: "/home/:id",
                    templateUrl: "tpl/details.html",
                    controller: 'detailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'isotope',
                                    'codropsDialogFx',
                                    'metrojs',
                                    'owlCarousel',
                                    'noUiSlider',
                                    'autonumeric'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/details.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('payment', {
                    url: '/payment',
                    template: '<div class="full-height" ui-view></div>'
                })
                .state('payment.status', {
                    url: "/status",
                    templateUrl: "tpl/status.html",
                    controller: 'statusCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/status.js'
                                    ]);
                                });
                        }]
                    }
                })
        }
    ]);




    // experience directive
    angular.module('app').directive('experienceData', function() {
        return {
            restrict: 'EA',
            scope: {
                item : "="
            },
            replace: true,
            link: function(scope, element, attrs) {
                   scope.contentUrl = 'assets/js/directiveTemplates/' + attrs.type + '.html';
                   attrs.$observe("type",function(v){
                       scope.contentUrl = 'assets/js/directiveTemplates/' + v + '.html';
                   });
               },
            template: '<div ng-include="contentUrl"></div>'
        };
    });



    angular.module('app').directive('dateSorter', function() {
        return {
            restrict: 'EA',
            link: function(scope, el, attr) {
                    
                    var start = attr.start.split(" ");
                    
                    var H = +start[1].substr(0, 2);
                    var h = H % 12 || 12;
                    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
                    start[1] = h + start[1].substr(2, 3) + ampm;

                    var end = attr.end.split(" ");

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
                        el.replaceWith(date[2] + " " +date[1]+", "+date[0] +" at "+ start[1] +" - "+end[1]);
                    }else{

                    }
                }
            //template: '<div ng-include="contentUrl"></div>'
        };
    });
