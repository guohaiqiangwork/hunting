define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('qualificationProcessCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id;
            var init = function () {

            };

            init();
        }]);

});