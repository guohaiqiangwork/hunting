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
        .directive('buttonBorder', ['$$adapter', function ($$adapter, $location) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'common/template/button_border.html',
                scope: {
                    cmsData: '='
                },
                controller: function ($scope, $rootScope, $attrs, $element, $timeout, $$user, $location, $state) {

                    var init = function () {

                    };
                    init();
                }
            }
        }])


});

