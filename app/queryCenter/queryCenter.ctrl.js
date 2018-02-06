define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('queryCenterCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            $scope.temp = {};
            $scope.temp['1']=true;
            $scope.Switch = function (number) {
                for (var k in $scope.temp) {
                    if (number !== k) {
                        $scope.temp[k] = false;
                    }
                }
                $scope.temp[number] = true;
            };

            var init = function () {

            };

            init();
        }]);
});