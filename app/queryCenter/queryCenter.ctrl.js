define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('queryCenterCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            $scope.temp = {};
            $scope.goto = function (number) {
                for (var k in $scope.temp) {
                    if (number !== k) {
                        $scope.temp[k] = false;
                    }
                }
                console.log("aaa");
                $scope.temp[number] = !$scope.temp[number];
            };

            var init = function () {

            };

            init();
        }]);
});