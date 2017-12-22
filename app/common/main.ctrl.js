define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.controller('MainCtrl', ['$scope', '$$neptune', '$rootScope', '$state', '$timeout', 'localStorageService', '$modal',
        function ($scope, $$neptune, $rootScope, $state, $timeout, localStorageService, $modal) {
            // 标签名字
            $rootScope.labelName = '';
            // 产品名称
            $rootScope.headProductName = '';
            // 提示框配置
            layer.config({
                path: "assets/js/layer/"
            });
            // 返回失败监听
            $rootScope.$on(constants.EVENTS.BACKEND_EXCEPTION, function (event, args) {
                layer.msg(args.message, {time: 2000});
                // $timeout(function(){
                //     $state.go('login');
                // },10);
            });
            // 返回成功监听
            $rootScope.$on(constants.EVENTS.BACKEND_SUCCESS, function (event, args) {
                layer.msg(args.message, {time: 1000});
            });
            // 没有登录
            $rootScope.$on(constants.AUTH.UNAUTHORIZED, function (event, args) {
                $timeout(function () {
                    localStorageService.set(constants.OPERATE_TYPE.LOCAL_USER, undefined);
                    $state.go('login');
                }, 10);
            });

            //返回上一个页面
            $scope.goToPage = function (labelName) {
                javascript: history.go(-1);
                // 删除标签
                if (labelName)
                    $rootScope.labelName = labelName;
            };


            var init = function () {

            };

            init();
        }]);
    app.registerFilter('isCollect', function () {
        return function (data, productInfo) {
            var type = productInfo.type || 'allProducts';

            if (type == 'collectProducts' && data && data.length > 0) {
                var _products = [];
                $.each(data, function (index, pro) {
                    if (pro.collnetStatus === 'Y') {
                        _products.push(pro);
                    }
                });
                return _products;
            }
            return data;
        }
    });
});
