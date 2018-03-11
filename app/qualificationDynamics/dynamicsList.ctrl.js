define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('dynamicsListCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.active='代办资质';
            //点击更多
            $scope.goToMore = function (id) {
                //    透过id不同调取不同接口
                $scope.active="单个地区";
                $scope.qualificationsTitles=id;
                if(id){
                    switch(id)
                    {
                        case '总承包资质标准':$scope.qualificationsTitle=1;
                            break;
                        case '专业承包资质标准':$scope.qualificationsTitle=2;
                            break;
                        case '劳务分包资质标准':$scope.qualificationsTitle=3;
                            break;
                        case '安全生产许可证':$scope.qualificationsTitle=4;
                            break;
                        case '房地产开发资质':$scope.qualificationsTitle=5;
                            break;
                        case '园林绿化资质':$scope.qualificationsTitle=6;
                            break;
                        case '设计资质标准':$scope.qualificationsTitle=7;
                            break;
                        case '其他资质标准':$scope.qualificationsTitle=8;
                            break;
                    }
                }
                var keyword = {
                    type:$scope.qualificationsTitle
                };
                $$neptune.find(constants.REQUEST_TARGET.GET_DYNAMICS_FIND, keyword, {
                    onSuccess: function (data) {
                        if($scope.qualificationsTitle){
                            angular.forEach(data, function (data, index) {
                                if (data[0]) {
                                    $scope.singles=data;
                                }
                            });
                        }
                    },
                    onError: function (e) {
                        alert("网络缓慢请稍后重试");
                    }
                });
            };
            $scope.dynamicQualifications=[];
            if($stateParams.id){
                $scope.qualificationsTitle=$stateParams.id;
                $scope.goToMore()
            }else{
                $rootScope.active ="资质动态"
            }
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info,infoName) {
                $rootScope.active = info;
                $scope.qualificationsTitle = infoName
            };
            /**
             * 代办资质动态首页接口
             */
            $scope.toObtainDynamic = function () {
                var keyword = {
                };
                $$neptune.find(constants.REQUEST_TARGET.GET_DYNAMICS_FIND, keyword, {
                    onSuccess: function (data) {
                        $scope.dynamicQualifications=data;
                    },
                    onError: function (e) {
                        alert("网络缓慢请稍后重试");
                    }
                });
            };
            $scope.goToDynamicDetails= function (key) {
                var keyword = {
                    "idStandard":key
                };
                $scope.active = "详情";
                $$neptune.find(constants.REQUEST_TARGET.GET_DYNAMICS_FINDS, keyword, {
                    onSuccess: function (data) {
                        $scope.details=data;
                    },
                    onError: function (e) {
                        alert("网络缓慢请稍后重试");
                    }
                });
            };
            var init = function () {
                $scope.toObtainDynamic();
            };
            init();
        }]);

});