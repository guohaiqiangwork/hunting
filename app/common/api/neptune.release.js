define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.util'
], function (config, constants, adapter) {
    angular.module('neptune.release', [
        'neptune.adapter',
        'mc.util'
    ])
        .factory('$$release', ['$q', '$http', '$timeout', '$$adapter', '$rootScope',
            function ($q, $http, $timeout, $$adapter, $rootScope) {
                var Document = function (data) {
                    if (data && typeof data === 'object')
                        $.extend(this, data);
                };


                Document.prototype.share = function (options) {

                };
                return {

                    releaseInfo:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.RELEASE_INFO_LIST.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.RELEASE_INFO_LIST.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.RELEASE_INFO_LIST.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.RELEASE_INFO_LIST.TARGET, data);
                                    if (!data) {
                                        // options.onError("保险公司字典,适配器验证不通过,没数据");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    }
                };
            }]);
});

