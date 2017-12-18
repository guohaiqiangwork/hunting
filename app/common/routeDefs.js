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


            }
        ]
    );
});
