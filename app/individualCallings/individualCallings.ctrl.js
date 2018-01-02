define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('individualCallingsCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {

            var init = function () {
                console.log("企业寻证");
            };

            init();
        }]);

});
