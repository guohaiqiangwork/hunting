define([
    'app',
    'config',
    'constants',
    'layer',
    'wow'
], function (app, config, constants, layer) {
    app.registerController('companiesFindCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            $scope.infoList={
                "idClassification1":"",
                "idClassification2":"",
                "idArea1":"",
                "idArea2":""
            };
            $scope.Initialize= function () {
                $scope.infoList={
                    "idClassification1":"",
                    "idClassification2":"",
                    "idArea1":"",
                    "idArea2":""
                };
            };
            $scope.a= function () {
                $(".test li").click(function() {
                    $(this).siblings('li').removeClass('colorSelected');  // 删除其他兄弟元素的样式
                    $(this).addClass('colorSelected');                            // 添加当前元素的样式
                });
            };
            /**
             * 获取地区信息
             */
            $scope.getRegional = function () {
                $$neptune.find(constants.REQUEST_TARGET.GET_REGIONAL_FIND, "", {
                    onSuccess: function (data) {
                        $scope.regionalLists = [];
                        $scope.classificationLists = [];
                        $scope.regionalList = data.area;
                        $scope.classificationList = data.classification;
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
            $scope.getQuYu = function (id,className) {
                $scope.quYuList = [];
                $scope.infoList.idArea1=className;
                $scope.infoList.idArea2="";
                angular.forEach($scope.regionalList, function (data, index) {
                    if ($scope.regionalList[index].relation == id) {
                        $scope.quYuList.push(data)
                    }
                });
                $scope.updateInfoList();
            };
            //点击二级分类
            $scope.getQuYu1 = function (id) {
                $scope.infoList.idArea2=id;
                $scope.updateInfoList();
            };
            /**
             * 获取二级
             * @param id
             */
            $scope.getZY = function (id,className) {
                $scope.zYList = [];
                $scope.infoList.idClassification1=className;
                $scope.infoList.idClassification2="";
                angular.forEach($scope.classificationList, function (data, index) {
                    if ($scope.classificationList[index].relation == id) {
                        console.log($scope.classificationList[index]);
                        $scope.zYList.push(data);
                    }
                });
                $scope.updateInfoList();
            };
            //点击二级分类
            $scope.getZY1 = function (id) {
                $scope.infoList.idClassification1=id;
                $scope.updateInfoList();
            };
            $scope.updateInfoList= function () {
                var keyword={
                    "type":3,
                    "idClassification":$scope.infoList.idClassification2?$scope.infoList.idClassification2:$scope.infoList.idClassification1,
                    "idArea":$scope.infoList.idArea2?$scope.infoList.idArea2:$scope.infoList.idArea1
                };
                $$neptune.find(constants.REQUEST_TARGET.GET_INFORMATION_LIST, keyword, {
                    onSuccess: function (data) {
                        console.log(data);
                        $scope.informationLists=data
                    },
                    onError: function (e) {
                        alert("网络缓慢请稍后重试");
                    }
                });
            };

            var init = function () {
                $scope.getRegional()
            };

            init();
        }]);

});
