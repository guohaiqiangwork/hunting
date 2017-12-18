'use strict';
define([
    'app',
    'constants',
    'routeDefs'
], function (app, constants) {

    app.run(['$rootScope', '$couchPotato', '$state', '$stateParams',
        function ($rootScope, $couchPotato, $state, $stateParams) {

            //couchPotato加载配置
            app.lazy = $couchPotato;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);

    app.config(['$httpProvider', '$locationProvider', 'localStorageServiceProvider',
        function ($httpProvider, $locationProvider, localStorageServiceProvider) {

            //解决跨域问题
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            // Initialize get if not there
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }

            // Disable IE ajax request caching
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

            //本地存储缺省前缀
            localStorageServiceProvider.setPrefix('neptune');
            // $locationProvider.html5Mode(true);

            //拦截器
            $httpProvider.interceptors.push(function ($rootScope) {
                return {
                    'request': function (config) {
                        if (config && config.dataType === "json") {
                            if (config.method === "POST") {
                                config.url = config.url + "?" + new Date().getTime();
                            } else if (config.method === "GET") {
                                if (config.url && config.url.indexOf("?") === -1) {
                                    config.url = config.url + "?" + new Date().getTime();
                                } else {
                                    config.url = config.url + "&" + new Date().getTime();
                                }
                            }
                        }
                        return config;
                    },
                    'requestError': function (rejection) {
                        return rejection;
                    },
                    'response': function (response) {
                        return response;
                    },
                    'responseError': function (rejection) {
                        return rejection;
                    }
                };
            });

        }]);
});
