(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('PropertiesController', PropertiesController);

    PropertiesController.$inject = [
        '$scope',
        '$rootScope',
        'InstanceDetails'
    ];

    function PropertiesController($scope, $rootScope, InstanceDetails) {
        var instance = $rootScope.instance;
        InstanceDetails.getEnv(instance).success(function (env) {
            $scope.props = [];
            for (var attr in env) {
                if (attr.indexOf('[') != -1 && attr.indexOf('.properties]') != -1) {
                    $scope.props.push({key: attr, value: env[attr]});
                }
            }
        }).error(function (error) {
            $scope.error = error;
        });
    }

})();
