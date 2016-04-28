(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('SelectController', SelectController);

    SelectController.$inject = [
        '$scope',
        '$stateParams'
    ];

    function SelectController($scope, $stateParams) {
        $scope.selectApp($stateParams.id);
    }

})();
