define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.util'
], function (config, constants, adapter) {
    angular.module('neptune.policy', [
        'neptune.adapter',
        'mc.util'
    ])
        .factory('$$policy', ['$q', '$http', '$timeout', '$$adapter', '$rootScope',
            function ($q, $http, $timeout, $$adapter, $rootScope) {

                var Policy = function(data){

                };

                var _policy = {};
                /**
                 * 保单续保
                 * @param options
                 */
                Policy.prototype.renew = function(options){
                    //请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.RENEW.URL;
                    //后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.RENEW.TARGET, this);
                    //请求网络
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.RENEW.TARGET, data);
                            if (!data) {
                                // options.onError("适配器验证不通过");
                            } else {
                                options.onSuccess(new Order(data));
                            }

                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                return {
                    /**
                     * 保单详情
                     * @param productId
                     * @param options
                     * @returns {boolean}
                     * @constructor
                     */
                    Policy: function(productId, options){
                        if(!productId) {
                            if (options && options.onError && typeof(options.onError=='function')) {
                                options.onError('不符合API规范');
                            }
                            return false;
                        }

                        if(productId != _policy.id){
                            config.httpPackage.method = constants.REQUEST_TARGET.POLICY.METHOD;
                            //请求地址
                            config.httpPackage.url = constants.REQUEST_TARGET.POLICY.URL+"?"+productId;
                            //后端入参适配
                            // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.POLICY.TARGET, productId);
                            var success = function (data) {
                                data = $$adapter.imports(constants.REQUEST_TARGET.POLICY.TARGET, data);
                                _policy = new Policy(data);

                                if (options && options.onSuccess && typeof(options.onSuccess=='function')) {
                                    options.onSuccess(_policy)
                                }
                            };
                            var error = function () {
                                if (options && options.onError && typeof(options.onError=='function')) {
                                    options.onError();
                                }
                            };
                            if(config.method=='local'){
                                $http(config.httpPackage)
                                    .success(function (data) {
                                        success(data);
                                    })
                                    .error(function () {
                                        error();
                                    });
                            }else{
                                $.ajax(config.httpPackage)
                                    .success(function (data) {
                                        success(data);
                                    })
                                    .error(function () {
                                        error();
                                    });
                            }

                        }else{
                            if (options && options.onSuccess && typeof(options.onSuccess=='function')) {
                                options.onSuccess(_policy)
                            }
                        }
                    },
                    /**
                     * 退保接口
                     * @param keyWords
                     * @param options
                     */
                    implementSignOut: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.SIGN_ORDERS.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.SIGN_ORDERS.URL;

                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SIGN_ORDERS.TARGET, keyWords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                $$adapter.imports(constants.REQUEST_TARGET.SIGN_ORDERS.TARGET, data);
                                options.onSuccess(data);
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    }
                };
            }]);
});

