define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('qualificationsCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.dynamicQualifications=[];
            $scope.leftTitle = $stateParams.id || '资质动态';
            $rootScope.active = $scope.leftTitle;
            $scope.moreList = false;//更多初始化
            //点击更多
            $scope.goToMore = function (id) {
                $scope.moreList = true;
                //    透过id不同调取不同接口
            };
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info, infoName) {
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
                          console.log(data);
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