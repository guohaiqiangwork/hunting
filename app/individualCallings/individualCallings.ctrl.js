define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('individualCallingsCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            $scope.active = '个人挂证';
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info) {
                $scope.active = info;
            };

            var init = function () {
                console.log("企业寻证");
            };

            init();
        }]);

});
