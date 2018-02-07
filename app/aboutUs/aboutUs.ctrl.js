define([
    'app',
    'config',
    'constants',
    'layer',
    'wow'
], function (app, config, constants, layer) {
    app.registerController('aboutUsCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id||"公司简介";
            $scope.active = $scope.leftTitle;
            $scope.newDay=new Date();
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info) {
                $scope.active = info;
            };
            var init = function () {
                new WOW({
                    boxClass: 'wow',
                    animateClass: 'animated',
                    offset: 0,
                    mobile: true,
                    live: true
                }).init();
            };

            init();
        }]);

});