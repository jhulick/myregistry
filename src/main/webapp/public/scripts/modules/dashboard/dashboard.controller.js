(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        '$scope',
        '$rootScope',
        '$interval',
        '$timeout',
        'Applications',
        'ApplicationOverview',
        'InstanceOverview',
        'InstanceDetails',
        'MetricsHelper'
    ];

    function DashboardController($scope, $rootScope, $interval, $timeout, Applications, ApplicationOverview, InstanceOverview, InstanceDetails, MetricsHelper) {
        var vm = this;
        $scope.memoryData = [];
        $scope.heapMemoryData = [];
        $scope.counterData = [];
        $scope.gaugeData = [];

        $scope.findApp = function (name) {
            for (var j = 0; $scope.applications != null && j < $scope.applications.length; j++) {
                if (name === $scope.applications[j].name) {
                    return $scope.applications[j];
                }
            }
        };

        $scope.selectApp = function (name) {
            $scope.selectedAppName = name;
            $scope.selectedApp = $scope.findApp(name);
            if (angular.isDefined($scope.selectedApp)) {
                ApplicationOverview.getCircuitBreakerInfo($scope.selectedApp);
                $scope.selectedApp.active = true;
                $scope.selectedApp.instances.forEach(function (instance) {
                    InstanceOverview.getInfo(instance)
                });
                activateDetails(); // setup details
                activateMetrics();
            }
        };

        $scope.updateApStatus = function (app) {
            var instanceUp = 0, instanceCount = 0;
            app.instances.forEach(function (instance) {
                instanceCount++;
                if (instance.health == 'UP') {
                    instanceUp++;
                }
            });

            var appState = instanceUp / instanceCount;
            if (appState > 0.8) {
                app.badge = 'success';
            } else if (app.instanceUp == 0) {
                app.badge = 'danger';
            } else {
                app.badge = 'warning';
            }

            app.instanceUp = instanceUp;
            app.instanceCount = instanceCount;
        };

        $scope.loadData = function () {

            return Applications.query(function (applications) {
                applications.forEach(function (app) {
                    app.instances.forEach(function (instance) {
                        InstanceOverview.getHealth(instance).finally(function () {
                            $scope.updateApStatus(app);
                        });
                    });
                });

                $scope.applications = applications;

                //Refresh current selected App
                if ($scope.selectedAppName) {
                    $scope.selectApp($scope.selectedAppName);
                } else {
                    $timeout(function () {
                        if (applications.length > 0) $scope.selectApp(applications[0].name); //$state.go('overview.select', {id: applications[0].name});
                    }, 10);
                }
            });
        };

        ////// metrics functions

        var colorArray = ['#6db33f', '#a5b2b9', '#34302d', '#fec600', '#4e681e'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i % colorArray.length];
            };
        };

        $scope.abbreviateFunction = function (targetLength, preserveLast, shortenThreshold) {
            return function (s) {
                return Abbreviator.abbreviate(s, '.', targetLength, preserveLast, shortenThreshold)
            };
        };

        $scope.intFormatFunction = function () {
            return function (d) {
                return d3.format('d')(d);
            };
        };

        $scope.toolTipContentFunction = function () {
            return function (key, x, y, e, graph) {
                return '<b>' + key + '</b> ' + e.point[0] + ': ' + e.point[1];
            }
        }

        //////// end metrics functions ////////////

        activate();

        ////////////////

        function activate() {

            $scope.loadData();

            // reload site every 30 seconds
            var task = $interval(function () {
                $scope.loadData();
            }, 30000);

            // PANEL REFRESH EVENTS
            // -----------------------------------
            $scope.$on('panel-refresh', function (event, id) {
                console.log('Simulating chart refresh during 3s on #' + id);
                // Instead of timeout you can request a chart data
                $timeout(function () {
                    // directive listen for to remove the spinner
                    // after we end up to perform own operations
                    $scope.$broadcast('removeSpinner', id);
                    console.log('Refreshed #' + id);
                }, 3000);
            });

            // PANEL DISMISS EVENTS
            // -----------------------------------

            // Before remove panel
            $scope.$on('panel-remove', function (event, id, deferred) {
                console.log('Panel #' + id + ' removing');
                // Here is obligatory to call the resolve() if we pretend to remove the panel finally
                // Not calling resolve() will NOT remove the panel
                // It's up to your app to decide if panel should be removed or not
                deferred.resolve();

            });

            // Panel removed ( only if above was resolved() )
            $scope.$on('panel-removed', function (event, id) {
                console.log('Panel #' + id + ' removed');
            });
        }

        function activateDetails() {
            $rootScope.instance = $scope.selectedApp.instances[0]; // debug this to check setting
            InstanceDetails.getInfo($scope.instance).success(function (info) {
                $scope.info = info;
            }).error(function (error) {
                $scope.error = error;
            });

            InstanceDetails.getHealth($rootScope.instance).success(function (health) {
                $scope.health = health;
            }).error(function (health) {
                $scope.health = health;
            });

            InstanceDetails.getMetrics($rootScope.instance).success(function (metrics) {
                $scope.metrics = metrics;
                $scope.metrics["mem.used"] = $scope.metrics["mem"] - $scope.metrics["mem.free"];

                $scope.metrics["systemload.averagepercent"] = $scope.metrics["systemload.average"] / $scope.metrics["processors"] * 100;

                $scope.gcInfos = {};
                $scope.datasources = {};

                function createOrGet(map, key, factory) {
                    return map[key] || (map[key] = factory());
                }

                MetricsHelper.find(metrics,
                    [/gc\.(.+)\.time/, /gc\.(.+)\.count/, /datasource\.(.+)\.active/, /datasource\.(.+)\.usage/],
                    [function (metric, match, value) {
                        createOrGet($scope.gcInfos, match[1], function () {
                            return {time: 0, count: 0};
                        }).time = value;
                    },
                        function (metric, match, value) {
                            createOrGet($scope.gcInfos, match[1], function () {
                                return {time: 0, count: 0};
                            }).count = value;
                        },
                        function (metric, match, value) {
                            $scope.hasDatasources = true;
                            createOrGet($scope.datasources, match[1], function () {
                                return {min: 0, max: 0, active: 0, usage: 0};
                            }).active = value;
                        },
                        function (metric, match, value) {
                            $scope.hasDatasources = true;
                            createOrGet($scope.datasources, match[1], function () {
                                return {min: 0, max: 0, active: 0, usage: 0};
                            }).usage = value;
                        }]);
            }).error(function (error) {
                $scope.error = error;
            });

            InstanceDetails.getCircuitBreakerInfo($rootScope.instance).success(function () {
                $rootScope.instance.circuitBreaker = true;
            }).error(function () {
                $rootScope.instance.circuitBreaker = false;
            });

            var start = Date.now();
            var tick = $interval(function () {
                $scope.ticks = Date.now() - start;
            }, 1000);
        }

        function activateMetrics() {
            InstanceDetails.getMetrics($rootScope.instance).success(function (metrics) {
                //*** Extract data for Counter-Chart and Gauge-Chart
                $scope.counterData = [{key: "value", values: []}];
                $scope.gaugeData = [{key: "value", values: []},
                    {key: "average", values: []},
                    {key: "min", values: []},
                    {key: "max", values: []},
                    {key: "count", values: []}];

                MetricsHelper.find(metrics,
                    [/counter\.(.+)/, /gauge\.(.+)\.val/, /gauge\.(.+)\.avg/, /gauge\.(.+)\.min/, /gauge\.(.+)\.max/, /gauge\.(.+)\.count/, /gauge\.(.+)\.alpha/, /gauge\.(.+)/],
                    [function (metric, match, value) {
                        $scope.counterData[0].values.push([match[1], value]);
                    },
                        function (metric, match, value) {
                            $scope.gaugeData[0].values.push([match[1], value]);
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[1].values.push([match[1], value]);
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[2].values.push([match[1], value]);
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[3].values.push([match[1], value]);
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[4].values.push([match[1], value]);
                        },
                        function (metric, match, value) { /*NOP*/
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[0].values.push([match[1], value]);
                        }]);

                //in case no richGauges are present remove empty groups
                var i = $scope.gaugeData.length;
                while (--i) {
                    if ($scope.gaugeData[i].values.length === 0) {
                        $scope.gaugeData.splice(i, 1);
                    }
                }
            }).error(function (error) {
                $scope.error = error;
            });


        }
    }
})();
