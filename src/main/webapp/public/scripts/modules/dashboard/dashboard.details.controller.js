(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DetailsController', DetailsController);

    DetailsController.$inject = [
        '$scope',
        '$rootScope',
        '$interval',
        'Instance',
        'InstanceDetails',
        'Abbreviator',
        'MetricsHelper',
        '$q'
    ];

    function DetailsController($scope, $rootScope, $interval, instance, InstanceDetails, Abbreviator, MetricsHelper, $q) {
        var instance = $rootScope.selectedApp.instances[0];
        $scope.memoryData = [];
        $scope.heapMemoryData = [];
        $scope.counterData = [];
        $scope.gaugeData = [];

        activate();

        function activate() {
            var promises = [
                getInfo(),
                getHealth(),
                getEnvironment(),
                getMetrics(),
                getMetricsDetails(),
                getCircuitBreakerInfo()
            ];
            return $q.all(promises).then(function() {
                console.log("DetailsController loaded")
            })
        }

        function getInfo() {
            InstanceDetails.getInfo(instance).success(function (info) {
                $scope.info = info;
            }).error(function (error) {
                $scope.error = error;
            });
        }

        function getHealth() {
            InstanceDetails.getHealth(instance).success(function (health) {
                $scope.health = health;
            }).error(function (health) {
                $scope.health = health;
            });
        }

        function getEnvironment() {
            // get properties and environment
            InstanceDetails.getEnv(instance).success(function (env) {
                $scope.env = env;
                $scope.props = [];
                for (var attr in env) {
                    if (env.hasOwnProperty(attr)) {
                        if (attr.indexOf('[') != -1 && (attr.indexOf('.yml]') || attr.indexOf('.properties]')) != -1) {
                            $scope.props.push({key: attr, value: env[attr]});
                        }
                    }
                }
                // classpath properties
                var separator = env['systemProperties']['path.separator'];
                $scope.classpath = env['systemProperties']['java.class.path'].split(separator);
            }).error(function (error) {
                $scope.error = error;
            });
        }

        function getMetrics() {
            InstanceDetails.getMetrics(instance).success(function (metrics) {
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
                    [
                        function (metric, match, value) {
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
                        }]
                );
            }).error(function (error) {
                $scope.error = error;
            });
        }

        function getMetricsDetails() {
            InstanceDetails.getMetrics(instance).success(function (metrics) {
                //*** Extract data for Counter-Chart and Gauge-Chart
                $scope.counterData = [{key: "value", values: []}];


                $scope.gaugeData2 = [
                    {
                        "key": "Series1",
                        "color": "#d62728",
                        "values": [
                            {
                                "label" : "Group A" ,
                                "value" : -1.8746444827653
                            } ,
                            {
                                "label" : "Group B" ,
                                "value" : -8.0961543492239
                            } ,
                            {
                                "label" : "Group C" ,
                                "value" : -0.57072943117674
                            } ,
                            {
                                "label" : "Group D" ,
                                "value" : -2.4174010336624
                            } ,
                            {
                                "label" : "Group E" ,
                                "value" : -0.72009071426284
                            } ,
                            {
                                "label" : "Group F" ,
                                "value" : -0.77154485523777
                            } ,
                            {
                                "label" : "Group G" ,
                                "value" : -0.90152097798131
                            } ,
                            {
                                "label" : "Group H" ,
                                "value" : -0.91445417330854
                            } ,
                            {
                                "label" : "Group I" ,
                                "value" : -0.055746319141851
                            }
                        ]
                    },
                    {
                        "key": "Series2",
                        "color": "#1f77b4",
                        "values": [
                            {
                                "label" : "Group A" ,
                                "value" : 25.307646510375
                            } ,
                            {
                                "label" : "Group B" ,
                                "value" : 16.756779544553
                            } ,
                            {
                                "label" : "Group C" ,
                                "value" : 18.451534877007
                            } ,
                            {
                                "label" : "Group D" ,
                                "value" : 8.6142352811805
                            } ,
                            {
                                "label" : "Group E" ,
                                "value" : 7.8082472075876
                            } ,
                            {
                                "label" : "Group F" ,
                                "value" : 5.259101026956
                            } ,
                            {
                                "label" : "Group G" ,
                                "value" : 0.30947953487127
                            } ,
                            {
                                "label" : "Group H" ,
                                "value" : 0
                            } ,
                            {
                                "label" : "Group I" ,
                                "value" : 0
                            }
                        ]
                    }
                ];



                $scope.gaugeData = [
                    {key: "value", color: '#6db33f', values: []},
                    {key: "average", color: '#a5b2b9', values: []},
                    {key: "min", color: '#34302d', values: []},
                    {key: "max", color: '#fec600', values: []},
                    {key: "count", color: '#4e681e', values: []}
                ];

                MetricsHelper.find(metrics,
                    [/counter\.(.+)/, /gauge\.(.+)\.val/, /gauge\.(.+)\.avg/, /gauge\.(.+)\.min/, /gauge\.(.+)\.max/, /gauge\.(.+)\.count/, /gauge\.(.+)\.alpha/, /gauge\.(.+)/],
                    [
                        function (metric, match, value) {
                            $scope.counterData[0].values.push([match[1], value]);
                        },

                        function (metric, match, value) {
                            $scope.gaugeData[0].values.push({label: match[1], value: value});
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[1].values.push({label: match[1], value: value});
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[2].values.push({label: match[1], value: value});
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[3].values.push({label: match[1], value: value});
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[4].values.push({label: match[1], value: value});
                        },
                        function (metric, match, value) { /*NOP*/
                        },
                        function (metric, match, value) {
                            $scope.gaugeData[0].values.push({label: match[1], value: value});
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

            $scope.gaugeOptions = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height: 450,
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
                    showControls: true,
                    showValues: true,
                    duration: 500,
                    xAxis: {
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Values',
                        tickFormat: function(d){
                            return d3.format(',.2f')(d);
                        }
                    },
                    // general chart and tooltip events
                    dispatch: {
                        stateChange: function(e){ console.log('chart - stateChange') },
                        changeState: function(e){ console.log('chart - changeState') },
                        tooltipShow: function(e){ console.log('chart - tooltipShow') },
                        tooltipHide: function(e){ console.log('chart - tooltipHide') },
                        renderEnd: function(e){ console.log('chart - renderEnd') }
                    }

                }
            };

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
        }

        function getCircuitBreakerInfo() {
            InstanceDetails.getCircuitBreakerInfo(instance).success(function () {
                instance.circuitBreaker = true;
            }).error(function () {
                instance.circuitBreaker = false;
            });
        }

        var start = Date.now();
        var tick = $interval(function () {
            $scope.ticks = Date.now() - start;
        }, 1000);
    }

})();
