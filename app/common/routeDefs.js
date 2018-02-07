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
                        url: "/login",
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
                    //首页
                    .state('home', {
                        url: "/home",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['home/home.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "home/home.html?" + window.NEPTUNE.version,
                                controller: 'homeCtrl'
                            }
                        }
                    })
                    //资质动态
                    .state('qualifications', {
                        url: "/qualifications/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['qualifications/qualifications.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "qualifications/qualificationsList.html?" + window.NEPTUNE.version,
                                controller: 'qualificationsCtrl'
                            }
                        }
                    })
                    //代办资质
                    .state('dynamicsList', {
                        url: "/dynamicsList/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['qualificationDynamics/dynamicsList.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "qualificationDynamics/dynamicsList.html?" + window.NEPTUNE.version,
                                controller: 'dynamicsListCtrl'
                            }
                        }
                    })
                    // //资质流程  此页面有待确认
                    // .state('qualificationProcess', {
                    //     url: "/qualificationProcess/:id",
                    //     cache: false,
                    //     resolve: {
                    //         dummy: $couchPotatoProvider.resolveDependencies(['qualificationProcess/qualificationProcess.ctrl'])
                    //     },
                    //     views: {
                    //         'main': {
                    //             templateUrl: "qualificationProcess/qualificationProcess.html?" + window.NEPTUNE.version,
                    //             controller: 'qualificationProcessCtrl'
                    //         }
                    //     }
                    // })
                    //资质流程
                    .state('enterpriseService', {
                        url: "/enterpriseService/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['enterpriseService/enterpriseService.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "enterpriseService/enterpriseServiceList.html?" + window.NEPTUNE.version,
                                controller: 'enterpriseServiceCtrl'
                            }
                        }
                    })
                    //证书培训
                    .state('certificateTraining', {
                        url: "/certificateTraining/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['certificateTraining/certificateTraining.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "certificateTraining/certificateTrainingList.html?" + window.NEPTUNE.version,
                                controller: 'certificateTrainingCtrl'
                            }
                        }
                    })

                    //关于我们
                    .state('aboutUs', {
                        url: "/aboutUs/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['aboutUs/aboutUs.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "aboutUs/aboutUs.html?" + window.NEPTUNE.version,
                                controller: 'aboutUsCtrl'
                            }
                        }
                    })
                    //企业寻证
                    .state('companiesFind', {
                        url: "/companiesFind",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['companiesFind/companiesFind.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "companiesFind/companiesFind.html",
                                controller: 'companiesFindCtrl'
                            }
                        }
                    })
                    //证书服务
                    .state('individualCallings', {
                        url: "/individualCallings/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['individualCallings/individualCallings.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "individualCallings/individualCallings.html",
                                controller: 'individualCallingsCtrl'
                            }
                        }
                    })
                    //查询中心
                    .state('queryCenter', {
                        url: "/queryCenter",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['queryCenter/queryCenter.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "queryCenter/queryCenter.html",
                                controller: 'queryCenterCtrl'
                            }
                        }
                    })
                    //查询中心
                    .state('management', {
                        url: "/management",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['management/management.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "management/management.html",
                                controller: 'managementCtrl'
                            }
                        }
                    })


            }
        ]
    );
});
