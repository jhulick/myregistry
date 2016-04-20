/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/dashboard');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Applications',
                controller: 'DashboardController',
                templateUrl: helper.basepath('dashboard.html'),
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'vector-map', 'vector-map-maps')
            }).state('app.registry', {
                url: '/registry',
                title: 'Registry',
                controller: 'HistoryController',
                templateUrl: helper.basepath('apps/history.html')
            })
            .state('app.details', {
                url: '/details',
                controller: 'DetailsController',
                templateUrl: helper.basepath('apps/details.html')
            })


            .state('app.navtree', {
                url: '/navtree',
                title: 'Nav Tree',
                templateUrl: helper.basepath('nav-tree.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.nestable', {
                url: '/nestable',
                title: 'Nestable',
                templateUrl: helper.basepath('nestable.html'),
                resolve: helper.resolveFor('ng-nestable')
            })

            .state('app.profile', {
                url: '/profile',
                title: 'Profile',
                templateUrl: helper.basepath('profile.html'),
                resolve: helper.resolveFor('loadGoogleMapsJS', function () {
                    return loadGoogleMaps();
                }, 'ui.map')
            })
            .state('app.chart-nvd3', {
                url: '/chart-nvd3',
                title: 'Chart NVD3',
                templateUrl: helper.basepath('chart-nvd3.html')
                //resolve: helper.resolveFor('angular-nvd3')
            })
            .state('app.documentation', {
                url: '/documentation',
                title: 'Documentation',
                templateUrl: helper.basepath('documentation.html'),
                resolve: helper.resolveFor('flatdoc')
            })



            .state('app.history', {
                url: '/history',
                templateUrl: 'views/apps/history.html',
                controller: 'appsHistoryCtrl'
            })
            .state('app.circuit-breaker', {
                url: '/circuit-breaker/:type/:id',
                templateUrl: 'views/circuit-breaker/index.html',
                controller: 'circuitBreakerCtrl'
            })
            //.state('app.details', {
            //    url: '/details',
            //    templateUrl: 'views/apps/details.html',
            //    controller: 'detailsCtrl'
            //})

            .state('app.details.env', {
                url: '/env',
                templateUrl: 'views/apps/details/env.html',
                controller: 'detailsEnvCtrl'
            })
            .state('app.details.props', {
                url: '/props',
                templateUrl: 'views/apps/details/props.html',
                controller: 'detailsPropsCtrl'
            })
            .state('app.details.classpath', {
                url: '/classpath',
                templateUrl: 'views/apps/details/classpath.html',
                controller: 'detailsClasspathCtrl'
            })
            .state('app.logging', {
                url: '/logging',
                templateUrl: 'views/apps/logging.html',
                controller: 'loggingCtrl'
            })
            .state('app.jmx', {
                url: '/jmx',
                templateUrl: 'views/apps/jmx.html',
                controller: 'jmxCtrl'
            })
            .state('app.threads', {
                url: '/threads',
                templateUrl: 'views/apps/threads.html',
                controller: 'threadsCtrl'
            })


            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ['$rootScope', function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.404', {
                url: '/404',
                title: 'Not Found',
                templateUrl: 'pages/404.html'
            })
            //
            // Horizontal layout
            // -----------------------------------
            .state('app-h', {
                url: '/app-h',
                abstract: true,
                templateUrl: helper.basepath('app-h.html'),
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
            })
            .state('app-h.dashboard_v2', {
                url: '/dashboard_v2',
                title: 'Dashboard v2',
                templateUrl: helper.basepath('dashboard_v2.html'),
                controller: 'DashboardV2Controller',
                controllerAs: 'dash2',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins')
            });

    } // routesConfig

})();

