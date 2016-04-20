'use strict';

angular.module('registry', [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'registry.services'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .when('/', '/overview')
            .otherwise('/');
        $stateProvider
            .state('overview', {
                url: '/overview',
                templateUrl: 'views/overview.html',
                controller: 'overviewCtrl'
            })
            .state('overview.select', {
                url: '/:id',
                templateUrl: 'views/overview.selected.html',
                controller: 'overviewSelectedCtrl'
            })
            .state('apps', {
                abstract: true,
                url: '/apps/:id',
                controller: 'appsCtrl',
                templateUrl: 'views/apps.html',
                resolve: {
                    instance: ['$stateParams', 'Instance', function ($stateParams, Instance) {
                        return Instance.query({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('history', {
                url: '/history',
                templateUrl: 'views/apps/history.html',
                controller: 'appsHistoryCtrl'
            })
            .state('circuit-breaker', {
                url: '/circuit-breaker/:type/:id',
                templateUrl: 'views/circuit-breaker/index.html',
                controller: 'circuitBreakerCtrl'
            })
            .state('apps.details', {
                url: '/details',
                templateUrl: 'views/apps/details.html',
                controller: 'detailsCtrl'
            })
            .state('apps.details.metrics', {
                url: '/metrics',
                templateUrl: 'views/apps/details/metrics.html',
                controller: 'detailsMetricsCtrl'
            })
            .state('apps.details.env', {
                url: '/env',
                templateUrl: 'views/apps/details/env.html',
                controller: 'detailsEnvCtrl'
            })
            .state('apps.details.props', {
                url: '/props',
                templateUrl: 'views/apps/details/props.html',
                controller: 'detailsPropsCtrl'
            })
            .state('apps.details.classpath', {
                url: '/classpath',
                templateUrl: 'views/apps/details/classpath.html',
                controller: 'detailsClasspathCtrl'
            })
            .state('apps.logging', {
                url: '/logging',
                templateUrl: 'views/apps/logging.html',
                controller: 'loggingCtrl'
            })
            .state('apps.jmx', {
                url: '/jmx',
                templateUrl: 'views/apps/jmx.html',
                controller: 'jmxCtrl'
            })
            .state('apps.threads', {
                url: '/threads',
                templateUrl: 'views/apps/threads.html',
                controller: 'threadsCtrl'
            });
    })
    .run(function ($rootScope, $state, $stateParams, $log) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });
