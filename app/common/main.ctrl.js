define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.controller('MainCtrl', ['$scope', '$$neptune', '$rootScope', '$state', '$timeout', 'localStorageService', '$modal',
        function ($scope, $$neptune, $rootScope, $state, $timeout, localStorageService, $modal) {
            //登录信息
            $rootScope.userZZ = {
                userRanking: ""
            };
            $rootScope.userZZ = localStorageService.get('userZZ');
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
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    resolve: {},
                    templateUrl: 'template/modal/login.tpl.html',
                    controller: function ($scope, $modalInstance, $state, $timeout) {
                        $scope.login = {
                            phone: "",
                            password: ""
                        };
                        $scope.prompt = {
                            prompts: ""
                        };
                        $scope.detection = function () {
                            if ($scope.login.phone && $scope.login.password) {
                                $scope.prompt.prompts = ""
                            }
                        };
                        $scope.goLogin = function () {
                            if(!$scope.login.phone){
                                $scope.prompt.prompts = "请输入账号"
                            }else if(!$scope.login.password){
                                $scope.prompt.prompts = "请输入密码"
                            } else{
                                $$neptune.find(constants.REQUEST_TARGET.LOGINED, $scope.login, {
                                    onSuccess: function (data) {
                                        if (data.message == 'success!') {
                                            $scope.close();
                                            $rootScope.user.userRanking = data.data;
                                            localStorageService.set('userZZ', $rootScope.user.userRanking);
                                            $rootScope.userZZ = localStorageService.get('userZZ');
                                        } else {
                                            $scope.prompt.prompts = "账号密码错误"
                                        }
                                    },
                                    onError: function (e) {
                                        alert("网络缓慢请稍后重试");
                                    }
                                });
                            }
                        }
                        var init = function () {

                        };

                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        init();
                    }
                });
            };
            //返回上一个页面
            $scope.goToPage = function (labelName) {
                javascript: history.go(-1);
                // 删除标签
                if (labelName)
                    $rootScope.labelName = labelName;
            };
            // 注册
            $scope.goToRegistered = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    resolve: {},
                    templateUrl: 'template/modal/registered.tpl.html',
                    controller: function ($scope, $modalInstance, $state, $timeout) {
                        $scope.registeredList = {
                            phone: "",
                            password: "",
                            passwords: "",
                            mailbox: "",
                            name: ""
                        };
                        $scope.passwordverify = {
                            trues: "",
                            phones:"",
                            name:"",
                            mailbox:""
                        };
                        $scope.prompt = {
                            promp:""
                        };
                        $scope.verifyPassword = function () {
                            if ($scope.registeredList.password) {
                                if ($scope.registeredList.password !== $scope.registeredList.passwords) {
                                    $scope.passwordverify.trues = '密码错误'
                                } else {
                                    $scope.passwordverify.trues = ''
                                }
                            }
                        };
                        $scope.registered = function () {
                            if(!$scope.registeredList.name){
                                $scope.prompt.promp = '请输入姓名'
                            }else if(!$scope.registeredList.phone||$scope.passwordverify.phones=='手机号无效'){
                                $scope.prompt.promp = '请输入手机号'
                            }
                            else if(!$scope.registeredList.mailbox||$scope.passwordverify.mailbox=='格式不正确'){
                                $scope.prompt.promp = '请输入邮箱/qq'
                            }
                            else if(!$scope.registeredList.password){
                                $scope.prompt.promp = '请输入密码'
                            }
                            else if(!$scope.registeredList.passwords|| $scope.passwordverify.trues == '密码错误'){
                                $scope.prompt.promp = '请验证密码'
                            }else{
                                $scope.prompt.promp = '';
                                $$neptune.find(constants.REQUEST_TARGET.REGISTERED, $scope.registeredList, {
                                    onSuccess: function (data) {
                                        if (data.message == 'success!') {
                                            $scope.close();
                                            $rootScope.user.userRanking = data.data;
                                            localStorageService.set('userZZ', $rootScope.user.userRanking);
                                            $rootScope.userZZ = localStorageService.get('userZZ');
                                            alert("已登陆");
                                        } else {
                                            $scope.prompt.promp = data.data
                                        }
                                    },
                                    onError: function (e) {
                                        alert("网络缓慢请稍后重试");
                                    }
                                });
                            }
                        };
                        $scope.verifyPhone= function () {
                            if($scope.registeredList.phone.length==0)
                            {
                                $scope.passwordverify.phones='请输入手机号';
                                return false;
                            }
                            if( $scope.registeredList.phone.length!=11)
                            {
                                $scope.passwordverify.phones='手机号无效';
                                return false;
                            }
                            var myreg = /^1[3|5][0-9]\d{4,8}$/;
                            if(!myreg.test($scope.registeredList.phone))
                            {
                                $scope.passwordverify.phones='手机号无效';
                                return false;
                            }else{
                                $scope.passwordverify.phones='';
                            }
                        };
                        /*验证姓名*/
                        $scope.verifyName= function () {
                            if($scope.registeredList.name.length==0)
                            {
                                $scope.passwordverify.name='姓名不能为空';
                                return false;
                            }
                            if( $scope.registeredList.name.length==8)
                            {
                                $scope.passwordverify.name='姓名不超过8位';
                                return false;
                            }
                        };
                        /*验证邮箱或者QQ*/
                        $scope.verifyMailbox= function () {
                            var myreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                            var myregs = /[1-9][0-9]{4,}/;
                            if(!myreg.test($scope.registeredList.mailbox)&&!myregs.test($scope.registeredList.mailbox))
                            {
                                $scope.passwordverify.mailbox='格式不正确';
                                return false;
                            }else{
                                $scope.passwordverify.mailbox='';
                            }
                        };
                        var init = function () {

                        };

                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        init();
                    }
                });
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
    })
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }]);
});
