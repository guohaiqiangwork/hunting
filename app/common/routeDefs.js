define([
    'app'
], function (app) {

    app.registerProvider(
        'routeDefs',
        [
            '$stateProvider',
            '$urlRouterProvider',
            '$couchPotatoProvider',
            '$locationProvider',
            '$provide',
            function ($stateProvider,
                      $urlRouterProvider,
                      $couchPotatoProvider) {

                this.$get = function () {
                    return {};
                };

                $urlRouterProvider.otherwise('/');

                $stateProvider

                //登录界面
                    .state('login', {
                        url: "/",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['login/login.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "login/login.tpl.html?" + window.NEPTUNE.version,
                                controller: 'loginCtrl'
                            }
                        }
                    })
                    // 忘记密码
                    .state('forgetPassword', {
                        url: "/forgetPassword",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['forgetPassword/forgetPassword.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "forgetPassword/forgetPassword.tpl.html?" + window.NEPTUNE.version,
                                controller: 'forgetPasswordCtrl'
                            }
                        }
                    })

                    //注册页面
                    .state('register', {
                        url: "/register",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['register/register.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "register/register.tpl.html?" + window.NEPTUNE.version,
                                controller: 'registerCtrl'
                            }
                        }
                    })

                    //个人中心页面
                    .state('userCenter', {
                        url: "/userCenter/:type",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['userCenter/userCenter.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "userCenter/userCenter.tpl.html?" + window.NEPTUNE.version,
                                controller: 'userCenterCtrl'
                            }
                        }
                    })

                    //个人订单
                    .state('orders', {
                        url: "/orders",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['orders/orders.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "orders/orders.tpl.html?" + window.NEPTUNE.version,
                                controller: 'ordersCtrl'
                            }
                        }
                    })

                    //订单录入页面
                    .state('buy', {
                        url: "/buy/:id/:user",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['buy/buy.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "buy/buy.tpl.html?" + window.NEPTUNE.version,
                                controller: 'buyCtrl'
                            }
                        }
                    })

                    //产品列表页面
                    .state('products', {
                        url: "/products",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['products/products.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "products/products.tpl.html?" + window.NEPTUNE.version,
                                controller: 'productsCtrl'
                            }
                        }
                    })

                    //产品详情页面
                    .state('product', {
                        url: "/product/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['product/product.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "product/product.tpl.html?" + window.NEPTUNE.version,
                                controller: 'productCtrl'
                            }
                        }
                    })

                    //智能分析
                    .state('statistics', {
                        url: "/statistics",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['statistics/statistics.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "statistics/statistics.tpl.html?" + window.NEPTUNE.version,
                                controller: 'statisticsCtrl'
                            }
                        }
                    })
                    //支付
                    .state('pay', {
                        url: "/pay/:productId",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['pay/pay.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "pay/pay.tpl.html?" + window.NEPTUNE.version,
                                controller: 'payCtrl'
                            }
                        }
                    })
                    //退保
                    .state('signOut', {
                        url: "/signOut",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['signOut/signOut.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "signOut/signOut.tpl.html?" + window.NEPTUNE.version,
                                controller: 'signOutCtrl'
                            }
                        }
                    })
                    //退保
                    .state('toExamine', {
                        url: "/toExamine",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['toExamine/toExamine.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "toExamine/toExamine.tpl.html?" + window.NEPTUNE.version,
                                controller: 'toExamineCtrl'
                            }
                        }
                    })
                    //订单修改页面
                    .state('updateOrder', {
                        url: "/updateOrder/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['updateOrder/updateOrder.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "updateOrder/updateOrder.tpl.html?" + window.NEPTUNE.version,
                                controller: 'updateOrderCtrl'
                            }
                        }
                    })


                    //单证管理
                    .state('documentStatistics', {
                        url: "/documentStatistics",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['docuStatistics/documentStatistics.ctrl']),
                            access: ["$$user", function ($$user) {
                                return $$user.isAuthenticated()
                            }]
                        },
                        views: {
                            'main': {
                                templateUrl: "docuStatistics/documentStatistics.html?" + window.NEPTUNE.version,
                                controller: 'documentStatisticsCtrl'
                            }
                        }
                    })


            }
        ]
    );
});
