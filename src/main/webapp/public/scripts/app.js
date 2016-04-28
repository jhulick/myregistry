(function() {
    'use strict';
    'use strict';

    angular.module('registry', [
            'ngResource',
            'ui.router',
            'ui.bootstrap',
            'registry.services'
        ])
        .run(function ($rootScope, $state, $stateParams, $log) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        });
})();
