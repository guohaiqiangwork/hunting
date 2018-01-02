define([
    'app',
    'config',
    'constants',
    'layer' ,
    'wow'
], function (app, config, constants, layer) {
    app.registerController('companiesFindCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {

            var init = function () {
               console.log("企业寻证");
            };

            init();
        }]);

});
