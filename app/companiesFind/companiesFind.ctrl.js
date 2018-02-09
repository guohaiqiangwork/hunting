define([
    'app',
    'config',
    'constants',
    'layer',
    'wow'
], function (app, config, constants, layer) {
    app.registerController('companiesFindCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {

            /**
             * 获取地区信息
             */
            $scope.getRegional = function () {
                $$neptune.find(constants.REQUEST_TARGET.GET_REGIONAL_FIND, "", {
                    onSuccess: function (data) {
                        $scope.regionalList = data.area;
                        $scope.classificationList = data.classification;
                        $scope.regionalLists = [];
                        $scope.classificationLists = [];
                        angular.forEach($scope.regionalList, function (data, index) {
                            if ($scope.regionalList[index].areaType == 1) {
                                $scope.regionalLists.push(data)
                            }
                        });
                        angular.forEach($scope.classificationList, function (data, index) {
                            if ($scope.classificationList[index].classType == 1) {
                                $scope.classificationLists.push(data)
                            }
                        });

                    },
                    onError: function (e) {
                        layer.msg("网络缓慢请稍后重试", {time: 1000});
                    }
                });
            };
            /**
             * 获取二级地区
             * @param id
             */
            $scope.getQuYu = function (id) {
                $scope.quYuList = [];
                angular.forEach($scope.regionalList, function (data, index) {
                    if ($scope.regionalList[index].relation == id) {
                        $scope.quYuList.push(data)
                    }
                });
            };
            /**
             * 获取二级
             * @param id
             */
            $scope.getZY = function (id) {
                $scope.zYList = [];
                angular.forEach($scope.classificationList, function (data, index) {
                    if ($scope.classificationList[index].relation == id) {
                        $scope.zYList.push(data)
                    }
                });
            };
            var init = function () {
                $scope.getRegional()
            };

            init();
        }]);

});
