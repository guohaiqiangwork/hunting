define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('homeCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            //打开qq聊天
            $scope.qqChat = function (qq) {
                var url='http://wpa.qq.com/msgrd?v=3&uin='+qq+'&site=qq&menu=yes';
                window.open(url, '_brank');
            };
            //轮播图
            var carouselFigure = function () {
                $("#lazyload_3").slide({trigger: "click", effect: "fade", auto: true, duration: 5, lazyload: true});
                $("pre.jsCode").snippet("javascript", {style: "custom_js", showNum: false});
                $("pre.jsCodeNum").snippet("javascript", {style: "custom_js"});
            };
            var init = function () {
                carouselFigure();//初始化加载轮播图
            };

            init();
        }]);

});