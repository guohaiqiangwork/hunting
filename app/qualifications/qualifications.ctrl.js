define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('qualificationsCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.dynamicQualifications=[];
            if($stateParams.id){
                $rootScope.active = "资质";
                $scope.qualificationsTitle=$stateParams.id;
            }else{
                $rootScope.active ="资质动态"
            }
            $scope.moreList = false;//更多初始化
            //点击更多
            $scope.goToMore = function (id) {
                $scope.moreList = true;
                //    透过id不同调取不同接口
                $rootScope.active="单个地区";
                $scope.qualificationsTitle=id;
                var keyword = {
                    "dynamicAddress":id
                };
                $$neptune.find(constants.REQUEST_TARGET.DYNAMIC_HOMEPAGE_MORE, keyword, {
                    onSuccess: function (data) {
                        $scope.singles=data;
                    },
                    onError: function (e) {
                        alert("网络缓慢请稍后重试");
                    }
                });
            };
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info,infoName) {
                $rootScope.active = info;
                $scope.qualificationsTitle = infoName
            };
            /**
             * 资质动态首页接口
             */
            $scope.toObtainDynamic = function () {
                    var keyword = {};
                    $$neptune.find(constants.REQUEST_TARGET.DYNAMIC_HOMEPAGE, keyword, {
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
                    "idDynamic":key
                };
                $rootScope.active = "详情";
                $$neptune.find(constants.REQUEST_TARGET.DYNAMIC_HOMEPAGE_DETAILS, keyword, {
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