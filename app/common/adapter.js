define([
    'config',
    'constants',
    'layer',
    'angular'
], function (config, constants, layer) {
    angular.module('neptune.adapter', [])
        .factory('$$adapter', ['$rootScope', '$$util', function ($rootScope, $$util) {

            //异常判断
            var hasException = function (data) {
                if (!data) {
                    $rootScope.$broadcast(constants.EVENTS.BACKEND_EXCEPTION, {message: '网络缓慢,请稍后重试'});
                    return true;
                }
                if (data.data && !data.data.success && data.data.error && typeof data.data.error !== 'Array') {
                    var message = '服务器没有返回详细的出错信息,错误原因不明';
                    message = data.data.error.message || message;
                    $rootScope.$broadcast(constants.EVENTS.BACKEND_EXCEPTION, {message: message});

                    return true;
                }

                return false;

            };

            // 数据入参转为后端格式
            var exportRules = {
                /**
                 * 资质动态首页
                 */
                dynamicHomepage: function (data) {
                    var _request = {
                        "data":{},
                        "pagination":{
                            "pageIndex":1,
                            "pageSize":5  }
                    };
                    return _request;
                },
                /**
                 * 资质动态首页更多
                 */
                dynamicHomepageMore: function (data) {
                    var _request = {
                        "data":{},
                        "pagination":{
                            "pageIndex":1,
                            "pageSize":5  }
                    };
                    return _request;
                },
                /**
                 * 资质动态某个更多
                 */
                dynamicHomepageAMore: function (data) {
                    var _request = {
                        "data":{},
                        "pagination":{
                            "pageIndex":1,
                            "pageSize":5  }
                    };
                    return _request;
                },
                /**
                 * 资质动态详情
                 */
                dynamicHomepageDetails: function (data) {
                    var _request = {
                        "data":{},
                        "pagination":{
                            "pageIndex":1,
                            "pageSize":5  }
                    };
                    return _request;
                }

            };
            //数据出参转为前端格式
            var importRules = {
                /**
                 * 资质动态首页
                 */
                dynamicHomepage: function (data) {
                    var _request = {};
                    return _request;
                },
                /**
                 * 资质动态首页更多
                 */
                dynamicHomepageMore: function (data) {
                    var _request = {};
                    return _request;
                },
                /**
                 * 资质动态某个更多
                 */
                dynamicHomepageAMore: function (data) {
                    var _request = {};
                    return _request;
                },
                /**
                 * 资质动态详情
                 */
                dynamicHomepageDetails: function (data) {
                    var _request = {};
                    return _request;
                }

            };
            //加载层
            var loadingIndex = undefined, isError = undefined;
            return {
                imports: function (type, data) {
                    if (type == 'questions') {
                        if (data.data == '') {
                            return
                        }
                    }
                    if (loadingIndex) {
                        isError = false;
                        layer.close(loadingIndex);
                        loadingIndex = undefined;
                    }
                    if (hasException(data))
                        return "";
                    else {
                        if (!importRules[type])
                            return data;
                        else
                            return importRules[type](data.data);
                    }
                },
                exports: function (type, data) {
                    isError = true;
                    if (!loadingIndex)
                        loadingIndex = layer.load(1, {
                            shade: false,
                            time: 10 * 1000
                            // end: function () {
                            //     if (isError)
                            //         layer.msg('加载失败', {time: 3000, icon: 5});
                            // }
                        });
                    return exportRules[type](data);
                }
            }
        }])
})
;
