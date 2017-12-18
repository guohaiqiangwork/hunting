

define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('loginCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            // 账号密码
            //$scope.account = localStorageService.get(constants.OPERATE_TYPE.LOCAL_ACCOUNT);

            $scope.isComplete = false;
            $scope.isVerification = false;
            // 三角形
            $scope.triangleUp = {
                'margin-left': '22%'
            };
            $scope.imgBg = {
                'height': $(window).height() + 'px'
            };
            /**
             * 切换登录
             */
            $scope.switchLogin = function (isOut) {
                $scope.account.isOut = isOut;
                if ($scope.account.isOut) {
                    $scope.triangleUp['margin-left'] = '70%';
                    // 已存在"default"密码,则清除
                    if ($scope.account.password === "default") {
                        $scope.account.password = "";
                    }
                } else {
                    $scope.triangleUp['margin-left'] = '22%';
                    // 不存在密码设置密码，避免验证问题
                    if (!$scope.account.password) {
                        $scope.account.password = "default";
                    }
                }
            };

            /**
             * 登录
             */
            $scope.login = function (type) {
                // 是否开始验证
                // $scope.isComplete = true;
                // if (!$scope.isVerification) {
                //     layer.msg("账号或密码未填写", {time: 2333});
                //     return false;
                // }
                if (!$scope.account[type ? 'outSide' : 'inSide'].userCode) {
                    layer.msg("请输入账号!", {time: 3000});
                    return false;
                }
                if (!$scope.account[type ? 'outSide' : 'inSide'].password) {
                    layer.msg("请输入密码!", {time: 3000});
                    return false;
                }
                // if (type) {
                //     if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test($scope.account[type ? 'outSide' : 'inSide'].password))) {
                //         layer.msg("密码必须为8-16位,数字字母组合而成!", {time: 3000});
                //         return false;
                //     }
                //
                // }


                if (type) {
                    if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test($scope.account[type ? 'outSide' : 'inSide'].password))) {
                        layer.msg("密码必须为8-16位,数字字母组合而成!", {time: 3000});
                        return false;
                    }
                    $$neptune.$user.loginOutSide($scope.account.outSide, {
                        onSuccess: function (data) {
                            // 刷新用户信息
                            $rootScope.user.refresh({
                                onSuccess: function (data) {
                                    if (data.isPassed == 'UNPASSED' || data.branchType2 != 1 || data.approveState == "1" || !data.approveState || !data.idcard_nega_photo || !data.idcare_posi_photo) {
                                        $state.go('userCenter', {type: "basicInfoDefault"});
                                    } else {
                                        //去产品列表页
                                        $state.go('buy', {id: ""});
                                    }
                                    $timeout(function () {
                                        if (data.isPassed == 'UNPASSED' || data.branchType2 != 1 || data.approveState == "1" || !data.approveState || !data.idcard_nega_photo || !data.idcare_posi_photo) {
                                            alert('请确认是否已通过认证考试、已签署代理协议、已上传照片，若未通过认证考试或未签署代理协议、未上传照片，请去个人中心进行操作。');
                                        }
                                        if (data.approveState == '3') {
                                            alert('证件照审核失败，请到个人中心重新上传');
                                        }

                                    }, 500);
                                }
                            });
                            //不同身份到不同页面
                            // $state.go("userCenter", {type: $scope.isOut ? "basicInfo" : "basicInfoDefault"});
                        },
                        onError: function (e) {
                            // layer.msg(e,{time: 1000});
                        }
                    });
                } else {
                    $$neptune.$user.loginInSide($scope.account.inSide, {
                        onSuccess: function (data) {
                            if (config.auth.isSave == true) {
                                localStorageService.set('account', $scope.account);
                            }
                            $state.go('buy', {id: ""});
                            $timeout(function () {
                                // if(data.isPassed  == 'UNPASSED' && data.branchType2 != 1){
                                //     $state.go('buy', {id: ""});
                                //     alert('请确认是否已通过认证考试、已签署代理协议，若未通过认证考试、未签署代理协议，请去个人中心进行操作。');
                                //     return
                                // }
                                // if(data.branchType2 != 1){
                                //     alert('请确认是否已通过认证考试、已签署代理协议，若未通过认证考试、未签署代理协议，请去个人中心进行操作。');
                                // }
                                if (data.approveState == '3') {
                                    alert('证件照审核失败，请到个人中心重新上传');
                                }
                            }, 500);
                            // $state.go("products");
                            //去产品列表页

                        },
                        onError: function (e) {
                            // layer.msg(e,{time: 1000});
                        }
                    });
                }
            };
            /**
             * 忘记密码
             */
            $scope.forgetPassword = function () {
                $state.go("forgetPassword");
            };
            /**
             * 注册
             */
            $scope.register = function () {
                $state.go("register");
            };

            $scope.remember = function (val) {
                if (!val) {
                    localStorageService.remove('account')
                }
                config.auth.isSave = val;
            };

            var init = function () {
                $scope.isSave = config.auth.isSave;
                if (config.auth.isSave == true) {
                    $scope.account = localStorageService.get('account') ? localStorageService.get('account') : {
                        outSide: {
                            userCode: '',
                            password: ''
                        },
                        inSide: {
                            userCode: '',
                            password: ''
                        },
                        isOut: false
                    }
                } else {
                    $scope.account = {
                        outSide: {
                            userCode: '',
                            password: ''
                        },
                        inSide: {
                            userCode: '',
                            password: ''
                        },
                        isOut: false
                    };
                }
                // 初始化内部外部
                $scope.switchLogin($scope.account.isOut);
            };

            init();
        }]);

});