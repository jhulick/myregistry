(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = [
        '$scope',
        'InstancesHistory'
    ];

    //'$scope', 'InstancesHistory', function ($scope, InstancesHistory)

    function HistoryController($scope, InstancesHistory) {

        activate();

        ////////////////

        function activate() {
            InstancesHistory.query(function (history) {
                $scope.registered = history.lastRegistered;
                $scope.cancelled = history.lastCancelled;
            });
        }
    }
})();
