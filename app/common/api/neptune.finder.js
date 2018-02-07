define([
    'config',
    'constants',
    'adapter'
], function (config, constants) {
    angular.module('neptune.finder', ['neptune.adapter'])

        .factory('$$finder', ['$http', '$$adapter',
            function ($http, $$adapter) {
                return {
                    find: function (target, keyWords, options, pagination) {
                        var data = {
                            keyWords: keyWords,
                            pagination: pagination
                        };
                        if (target.METHOD) {
                            config.httpPackage.method = target.METHOD;
                        }
                        // 请求地址
                        config.httpPackage.url = target.URL;

                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(target.TARGET, data);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(target.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                            }
                        );
                    }
                };
            }]);
});

