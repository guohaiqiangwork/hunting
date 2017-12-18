define(
    ['angular-mocks',
        'config',
        'codes',
        'jsonDB',
        'constants'
    ], function (ngMock, config, codes, jsonDB, constants) {
        'use strict';
        /**
         * This module is used to simulate backend server for this demo application.
         */
        angular.module('backend-mocks', ['ngMockE2E'])

            .run(function ($httpBackend) {

                ////用户登录
                //$httpBackend.whenPOST(config.backend.ip + config.backend.loginIn).respond(function (method, url, data) {
                //    var _data = JSON.parse(data);
                //    return [200, jsonDB.loginIn];
                //});

                //用户登录
                $httpBackend.whenPOST(config.backend.ip + constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.login)];
                });

                //获取用户信息
                $httpBackend.whenPOST(config.backend.ip + constants.backend.REQUEST_METHOD.GETUSER).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.User)];
                });

                //获取产品列表
                $httpBackend.whenPOST(config.backend.ip + constants.backend.REQUEST_METHOD.PRODUCTS).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.products)];
                });

                //获取待操作订单列表
                $httpBackend.whenPOST(config.backend.orderIp + constants.backend.REQUEST_METHOD.WAIT_OPERATE_ORDERS).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.waitOperateOrders)];
                });

                //获取待续保订单列表
                $httpBackend.whenPOST(config.backend.orderIp + constants.backend.REQUEST_METHOD.WAIT_RENEW_ORDERS).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.waitRenewOrders)];
                });

                //获取历史订单列表
                $httpBackend.whenPOST(config.backend.orderIp + constants.backend.REQUEST_METHOD.HISTORY_ORDERS).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.historyOrders)];
                });

                // 获取排行榜
                $httpBackend.whenPOST(config.backend.ip + constants.backend.REQUEST_METHOD.GET_RANKING).respond(function (method, url, data) {
                    return [200, JSON.stringify(jsonDB.ranking)];
                });


                $httpBackend.whenGET(/.*/).passThrough();
                $httpBackend.whenPOST(/.*/).passThrough();

            });
    });
