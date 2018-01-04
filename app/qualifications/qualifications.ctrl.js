define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('qualificationsCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id || '资质';
            $rootScope.active = $scope.leftTitle;
            $scope.moreList = false;//更多初始化
            //点击更多
            $scope.goToMore = function (id) {
                $scope.moreList = true;
                //    透过id不同调取不同接口
            };
            var init = function () {

            };
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info, infoName) {
                $rootScope.active = info;
                $scope.qualificationsTitle = infoName
            };

            init();
        }]);

});