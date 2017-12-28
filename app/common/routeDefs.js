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
                        url: "/",
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
                                templateUrl: "qualifications/qualifications.html?" + window.NEPTUNE.version,
                                controller: 'qualificationsCtrl'
                            }
                        }
                    })
                    //代办资质
                    .state('qualificationDynamics', {
                        url: "/qualificationDynamics/:id",
                        cache: false,
                        resolve: {
                            dummy: $couchPotatoProvider.resolveDependencies(['qualificationDynamics/qualificationDynamics.ctrl'])
                        },
                        views: {
                            'main': {
                                templateUrl: "qualificationDynamics/qualificationDynamics.html?" + window.NEPTUNE.version,
                                controller: 'qualificationDynamicsCtrl'
                            }
                        }
                    })


            }
        ]
    );
});
