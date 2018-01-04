define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('certificateTrainingCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id || '证书培训';
            $rootScope.active = $scope.leftTitle;
            var init = function () {

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