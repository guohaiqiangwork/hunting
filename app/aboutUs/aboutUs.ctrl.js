define([
    'app',
    'config',
    'constants',
    'layer',
    'wow'
], function (app, config, constants, layer) {
    app.registerController('aboutUsCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id;
            var init = function () {
                console.log('关于我们');
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