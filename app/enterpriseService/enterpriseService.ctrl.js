define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('enterpriseServiceCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id || '资质流程';
            $rootScope.active = $scope.leftTitle;
            var init = function () {
                console.log('企业办事')
            };


            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info) {
                $rootScope.active = info;
            };
            init();
        }]);

});