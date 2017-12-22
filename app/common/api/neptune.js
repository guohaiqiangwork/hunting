define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.user',
    'common/api/neptune.finder',
    'common/api/mc.multiple',
    'common/api/mc.util',
    'common/api/mc.sendVerification',
    'common/api/mc.textSwitch',
    'mc-bakery',
    'jquery-qrcode',
    'layer',
    'MD5',
    'md5'
], function (config, constants, adapter) {
    angular.module('neptune.api', [
        'neptune.adapter',
        'mc.user',
        'neptune.finder',
        'mc.multiple',
        'mc.util',
        'mc.sendVerification',
        'mc.textSwitch',
        'mc.bakery'
    ])
        .factory('$$neptune', ['$q', '$http', '$timeout', '$$adapter', '$rootScope', '$$user', '$$finder',
            function ($q, $http, $timeout, $$adapter, $rootScope, $$user, $$finder) {
                return {
                    $user: $$user,
                    /**
                     * 列表查询
                     * @param target
                     * @param keyWords
                     * @param pagination
                     * @param options
                     */
                    find: function (target, keyWords, options, pagination) {
                        $$finder.find(target, keyWords, options, pagination);
                    },
                    /**
                     * 支付
                     * @param method 支付方式
                     * @param order 订单
                     * @param options
                     */
                    pay: function (method, order, options) {

                        config.httpPackage.url = config.backend.ip + constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE;
                        config.httpPackage.data = $$adapter.exports(constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE, order);

                        $http(config.httpPackage).then(
                            function (data) {
                                if (options && options.onSuccess) {
                                    data = $$adapter.imports(constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE, data);
                                    config.auth.isLogin = true;
                                    options.onSuccess(data);
                                }
                            },
                            function (error) {
                                // options.onError(error);
                            }
                        );
                    }
                };
            }])
        .directive('header', ['$$adapter', function ($$adapter, $location) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'common/template/header.directive.html',
                //template: '<h1>lidless , wreathed in flame, 1 times</h1>'
                scope: {
                    cmsData: '='
                },
                controller: function ($scope, $rootScope, $attrs, $element, $timeout, $$user, $location, $state) {

                    var init = function () {
                        var urlName = $state.current.name;
                        if (urlName == 'buy' || urlName == 'pay' || urlName == 'product') {
                            urlName = 'products';
                        }
                        if ($('.' + urlName)[0])
                            $('.' + urlName)[0].style['borderBottom'] = '3px solid #E8B25B';
                    };


                    $scope.goHtml = function (state, $event) {
                        if ($event) {
                            // 跳转产品列表
                            var keycode = window.event ? $event.keyCode : $event.which;
                            if (keycode !== 13) {
                                return false;
                            }
                        }
                        switch (state) {
                            case "orders":
                                $state.go('orders');
                                break;
                            case "products":
                                $state.go('products');
                                break;
                            case "signOut":
                                $state.go('signOut');
                                break;
                            case "toExamine":
                                $state.go('toExamine');
                                break;
                            case "userCenter":
                                $state.go('userCenter', {type: "basicInfoDefault"});
                                break;
                            case "statistics":
                                $state.go('statistics');
                                break;
                            case "documentStatistics":
                                $state.go('documentStatistics');
                                break;
                            default:
                                $state.go('/');
                        }

                    };
                    $rootScope.$on('userUpdate', function () {
                        $scope.basicInformation = $rootScope.user;
                    });
                    $scope.identityInformation = $rootScope.user.auth_id;//获取用户岗位
                    /*
                     * 注销
                     * */
                    $scope.logout = function () {
                        $rootScope.user.logout();
                    };
                    /*
                    *获取用户信息
                     */
                    $scope.basicInformation = $rootScope.user;
                    init();
                }
            }
        }])
        .directive('testEle', ['', function () {
            return 1;
        }])
    
});

