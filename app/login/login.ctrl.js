define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('loginCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            $scope.imgBg = {
                'height': $(window).height() + 'px'
            };

            var init = function () {
                $scope.loginTarge = true;
            };

            init();
        }]);

});