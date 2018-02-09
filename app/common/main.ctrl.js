define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.controller('MainCtrl', ['$scope', '$$neptune', '$rootScope', '$state', '$timeout', 'localStorageService', '$modal',
        function ($scope, $$neptune, $rootScope, $state, $timeout, localStorageService, $modal) {
            // 标签名字
            $rootScope.labelName = '';
            // 产品名称
            $rootScope.headProductName = '';
            // 导航栏选中索引
            $scope.activeIndex = localStorageService.get("activeIndex") || 0;
            // 导航栏原始选中索引
            var oldActiveIndex = 0;

            // 提示框配置
            layer.config({
                path: "assets/js/layer/"
            });
            // 返回失败监听
            $rootScope.$on(constants.EVENTS.BACKEND_EXCEPTION, function (event, args) {
                layer.msg(args.message, {time: 2000});
                // $timeout(function(){
                //     $state.go('login');
                // },10);
            });
            // 返回成功监听
            $rootScope.$on(constants.EVENTS.BACKEND_SUCCESS, function (event, args) {
                layer.msg(args.message, {time: 1000});
            });
            // 没有登录
            $rootScope.$on(constants.AUTH.UNAUTHORIZED, function (event, args) {
                $timeout(function () {
                    localStorageService.set(constants.OPERATE_TYPE.LOCAL_USER, undefined);
                    $state.go('login');
                }, 10);
            });
            //打开qq聊天
            $scope.qqChat = function (qq) {
                var url = 'http://wpa.qq.com/msgrd?v=3&uin=' + qq + '&site=qq&menu=yes';
                window.open(url, '_brank');
            };
            /**
             * 鼠标滑过事件
             * @param activeIndex
             */
            $scope.mouseChange = function (activeIndex) {
                // 滑出
                if (activeIndex === undefined) {
                    $scope.activeIndex = oldActiveIndex;
                } else {
                    // 滑入
                    // 保留原来选择
                    oldActiveIndex = angular.copy($scope.activeIndex);
                    $scope.activeIndex = activeIndex;
                }
            };

            /**
             * 导航条点击事件
             * @param activeIndex
             * @param navLeftIndex
             */
            $scope.navClick = function (activeIndex, navLeftIndex) {
                $scope.activeIndex = activeIndex;
                localStorageService.set("activeIndex", activeIndex);
                switch (activeIndex) {
                    case 0: // 首页
                        $state.go('home');
                        break;
                    case 1: // 资质动态
                        $state.go('qualifications', {id: navLeftIndex});
                        break;
                    case 2: // 代办资质
                        $state.go('dynamicsList', {id: navLeftIndex});
                        break;
                    case 4: // 证书培训
                        $state.go('certificateTraining', {id: navLeftIndex});
                        break;
                    case 5: // 全职招聘
                        $state.go('companiesFind', {id: navLeftIndex});
                        break;
                    case 6: // 证书服务
                        $state.go('individualCallings', {id: navLeftIndex});
                        break;
                    case 7: // 查询中心
                        $state.go('queryCenter', {id: navLeftIndex});
                        break;
                    case 8: // 关于我们
                        $state.go('aboutUs', {id: navLeftIndex});
                        break;
                    case 9: // 网站管理
                        $state.go('management', {id: navLeftIndex});
                        break;
                }
                if (navLeftIndex) {
                    $rootScope.active = navLeftIndex;
                }
                return false;
            };
            // 登陆
            $scope.goToLogin = function () {
                $scope.loginTarge = false;
                $state.go('login')
            };
            //返回上一个页面
            $scope.goToPage = function (labelName) {
                javascript: history.go(-1);
                // 删除标签
                if (labelName)
                    $rootScope.labelName = labelName;
            };

            var init = function () {
                $scope.loginTarge = true;
                $state.go('home');
            };
            init();
        }]);
    app.registerFilter('isCollect', function () {
        return function (data, productInfo) {
            var type = productInfo.type || 'allProducts';

            if (type == 'collectProducts' && data && data.length > 0) {
                var _products = [];
                $.each(data, function (index, pro) {
                    if (pro.collnetStatus === 'Y') {
                        _products.push(pro);
                    }
                });
                return _products;
            }
            return data;
        }
    });
});
