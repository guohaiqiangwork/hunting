define([
    'config',
    'constants',
    'layer',
    'adapter'
], function (config, constants, layer) {
    angular.module('mc.user', [
        'neptune.adapter'
    ])
        .factory('$$user', ['$q', '$http', '$timeout', '$rootScope', '$$adapter', 'localStorageService', '$state','$modal',
            function ($q, $http, $timeout, $rootScope, $$adapter, localStorageService, $state, $modal) {
                //用户
                var user;
                //用户实例
                var User = function (data) {
                    if (data) {
                        this.loginState = data.loginState;
                        for (var k in data)
                            this[k] = data[k];
                    }
                    this.userRanking = {};
                };
                /**
                 * 用户注销
                 * @returns {boolean}
                 */
                User.prototype.logout = function () {
                    this.loginState = false;
                    updateUserInLocalStorage(this);
                    $state.go('login');
                };
                /**
                 * 刷新用户信息
                 * @param options
                 */
                User.prototype.refresh = function (options) {
                    config.httpPackage.method = constants.REQUEST_TARGET.USER_REFRESH.METHOD;
                    //请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.USER_REFRESH.URL;
                    //后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.USER_REFRESH.TARGET, this.agentCode);
                    //请求网络
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.USER_REFRESH.TARGET, data);
                            if (!data) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError();
                                }
                            } else {
                                // $rootScope.user = $.extend($rootScope.user, data);
                                // 循环赋值
                                for (var k in data) {
                                    if (data[k])
                                        $rootScope.user[k] = data[k];
                                }
                                // 更改登录状态
                                $rootScope.user.loginState = true;
                                updateUserInLocalStorage($rootScope.user);
                                // 获取财富信息
                                // $rootScope.user.myWealth();
                                // // 获取我的排行榜
                                // $rootScope.user.getRanking();
                                if (options && options.onSuccess) {
                                    options.onSuccess($rootScope.user);
                                }
                            }
                        },
                        function (error) {
                            // if (options && options.onError && typeof(options.onError == 'function')) {
                            //     options.onError(error);
                            // }
                        }
                    );
                };

                //完善用户信息
                User.prototype.update = function (options) {
                    config.httpPackage.method = constants.REQUEST_TARGET.UPDATE_USER.METHOD;
                    //请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.UPDATE_USER.URL;
                    //后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.UPDATE_USER.TARGET, this);
                    //请求网络
                    $http(config.httpPackage).then(
                        function (data) {
                            if (options || options.onSuccess) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.UPDATE_USER.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /**
                 * 用户财富
                 */
                User.prototype.myWealth = function () {
                    var that = this;
                    config.httpPackage.method = constants.REQUEST_TARGET.USER_WEALTH.METHOD;
                    //请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.USER_WEALTH.URL;
                    //后端入参适配
                    config.httpPackage.data = {
                        "data": {
                            "agentCode": this.agentCode || ''
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    //请求网络
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.USER_WEALTH.TARGET, data);

                            if (!data) {
                                // options.onError("适配器验证不通过");
                            } else {
                                that.wealth = data;
                                updateUserInLocalStorage(that);
                            }
                        },
                        function (error) {
                        }
                    );
                };

                //佣金提现
                User.prototype.withdraw = function (keyWords, options) {
                    keyWords.member_id = this.agentCode;
                    //请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.WITH_DRAW.URL;
                    //后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.WITH_DRAW.TARGET, keyWords);
                    $http(config.httpPackage).then(
                        function (data) {
                            if (options || options.onSuccess) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.WITH_DRAW.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /**
                 * 获取排名
                 */
                User.prototype.getRanking = function (type) {
                    var that = this;
                    config.httpPackage.method = constants.REQUEST_TARGET.GET_RANKING.METHOD;
                    //请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.GET_RANKING.URL;
                    //后端入参适配
                    config.httpPackage.data = {
                        member_id: that.agentCode || '',
                        logoCode: type
                    };
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.GET_RANKING.TARGET, data);
                            if (data) {
                                that.userRanking[type] = data;
                                updateUserInLocalStorage(that);
                            }
                        },
                        function (error) {
                        }
                    );
                };

                /**
                 * 添加银行卡
                 * @param bankCard
                 * @param options
                 */
                User.prototype.addBankCard = function (bankCard, options) {
                    config.httpPackage.method = constants.REQUEST_TARGET.ADD_BANK_CARD.METHOD;
                    // 请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.ADD_BANK_CARD.URL;
                    // 后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.ADD_BANK_CARD.TARGET, bankCard);
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.ADD_BANK_CARD.TARGET, data);
                            if (!data) {
                                // options.onError("适配器验证不通过");
                            } else {
                                if (options && options.onSuccess) {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /**
                 * 查询银行卡
                 * @param options
                 */
                User.prototype.getBankCard = function (options) {
                    var that = this;
                    config.httpPackage.method = constants.REQUEST_TARGET.FIND_BANK_CARD.METHOD;
                    // 请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.FIND_BANK_CARD.URL;
                    // 后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.FIND_BANK_CARD.TARGET, this);
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.FIND_BANK_CARD.TARGET, data);
                            if (!data) {
                                // options.onError("适配器验证不通过");
                               var openModifyBankCard = function () {
                                    $modal.open({
                                        backdrop: 'static',
                                        animation: true,
                                        templateUrl: 'userCenter/modal/bankAdd.tpl.html',
                                        resolve: {},
                                        controller: function ($scope, $modalInstance) {
                                            /**
                                             * 修改卡号显示类型
                                             */
                                            $scope.cardType = "password";
                                            $scope.cardVisbileText = "查看";
                                            $scope.displayCardNo = function () {
                                                if ($scope.cardType === 'tel') {
                                                    $scope.cardType = 'password';
                                                    $scope.cardVisbileText = "查看";
                                                } else {
                                                    $scope.cardType = 'tel';
                                                    $scope.cardVisbileText = "隐藏";
                                                }
                                            };
                                            // 银行卡信息
                                            $scope.bankCard = {
                                                isVerification: false, // 验证是否通过
                                                isComplete: false // 是否开始验证
                                            };

                                            /**
                                             * 关闭弹窗
                                             */
                                            $scope.close = function () {
                                                $modalInstance.dismiss();
                                            };
                                            $scope.successResult = function () {
                                                if ($scope.bankCard.bank_no.length > 19 || $scope.bankCard.bank_no.length < 15) {
                                                    layer.msg("银行卡号长度为15到19位", {time: 2333});
                                                    return false;
                                                }
                                                if (!(/^1[34578]\d{9}$/.test($scope.bankCard.phone))) {
                                                    layer.msg("请填写正确的手机号", {time: 2333});
                                                    return false;
                                                }
                                                // 绑定银行卡
                                                $rootScope.user.addBankCard($scope.bankCard, {
                                                    onSuccess: function (data) {
                                                        if (data)
                                                            layer.msg(data, {time: 2000});
                                                        $rootScope.user.getBankCard();
                                                        $modalInstance.close();
                                                    },
                                                    onError: function (e) {
                                                        // layer.msg("接口问题", {time: 3000});
                                                        // 银行卡信息
                                                        $scope.bankCard.isVerification = false; // 验证是否通过
                                                        // 是否开始验证
                                                        $scope.bankCard.isComplete = false;
                                                    }
                                                });
                                            };

                                            $scope.openPrompted = function () {
                                                $modal.open({
                                                    backdrop: 'static',
                                                    animation: true,
                                                    templateUrl: 'userCenter/modal/prompted.tpl.html',
                                                    resolve: {},
                                                    controller: function ($scope, $modalInstance) {
                                                        /**
                                                         * 关闭弹窗
                                                         */
                                                        $scope.close = function () {
                                                            $modalInstance.dismiss();
                                                        };
                                                        /**
                                                         * 保存并关闭弹窗
                                                         */
                                                        $scope.success = function () {
                                                            $modalInstance.close();
                                                        };

                                                    }
                                                });
                                            };
                                        }
                                    }).result.then(function () {
                                        // 查询银行卡信息
                                        $rootScope.user.getBankCard();
                                    });
                                };
                                openModifyBankCard()
                            } else {
                                that.bankCard = data;
                                // 循环添加银行卡号长度数组
                                if (that.bankCard)
                                    for (var i = 0; i < that.bankCard.bank_no.length - 3; i++) {
                                        if (!that.bankCard.bankCardLengths)
                                            that.bankCard.bankCardLengths = [];
                                        that.bankCard.bankCardLengths.push(i);
                                    }
                                if (options && options.onSuccess) {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /**
                 * 删除银行卡
                 * @param cardId
                 * @param options
                 */
                User.prototype.deleteBankCard = function (options) {
                    var that = this;
                    config.httpPackage.method = constants.REQUEST_TARGET.DELETE_BANK_CARD.METHOD;
                    // 请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.DELETE_BANK_CARD.URL;
                    // 后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DELETE_BANK_CARD.TARGET, this);
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.DELETE_BANK_CARD.TARGET, data);
                            if (!data) {
                                // options.onError("适配器验证不通过");
                            } else {
                                that.bankCard = undefined;
                                if (options && options.onSuccess) {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /**
                 * 删除身份证件照
                 * @param type
                 * @param options
                 */
                User.prototype.deletePhoto = function (type, options) {
                    var that = this;
                    this.deletePhotoType = type;
                    config.httpPackage.method = constants.REQUEST_TARGET.DELETE_PHOTO.METHOD;
                    // 请求地址
                    config.httpPackage.url = constants.REQUEST_TARGET.DELETE_PHOTO.URL;
                    // 后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DELETE_PHOTO.TARGET, this);
                    $http(config.httpPackage).then(
                        function (data) {
                            //后端回参适配
                            data = $$adapter.imports(constants.REQUEST_TARGET.DELETE_PHOTO.TARGET, data);
                            if (data) {
                                layer.msg(data, {time: 3000});
                                that.idcare_posi_photo = type === 'posi' ? "" : that.idcare_posi_photo;
                                that.idcard_nega_photo = type === 'nega' ? "" : that.idcard_nega_photo;
                                updateUserInLocalStorage($rootScope.user);
                                if (options && options.onSuccess) {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError === 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /* 劳务协议
                    * @param keyWords
                    * @param options
                    */
                User.prototype.laborAgreementSigned = function (keyWords, options) {
                    config.httpPackage.method = constants.REQUEST_TARGET.LABOR_AGREEMENT_SIGNED.METHOD;
                    config.httpPackage.url = constants.REQUEST_TARGET.LABOR_AGREEMENT_SIGNED.URL;
                    //后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.LABOR_AGREEMENT_SIGNED.TARGET, keyWords);
                    //请求网络
                    $http(config.httpPackage).then(
                        function (data) {
                            if (options || options.onSuccess) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.LABOR_AGREEMENT_SIGNED.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /* 劳务协议查询
                    * @param keyWords
                    * @param options
                    */
                User.prototype.agreementContent = function (keyWords, options) {
                    config.httpPackage.method = constants.REQUEST_TARGET.AGREEMENT_CONTENT.METHOD;
                    config.httpPackage.url = constants.REQUEST_TARGET.AGREEMENT_CONTENT.URL;
                    //后端入参适配
                    config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.AGREEMENT_CONTENT.TARGET);
                    //请求网络
                    $http(config.httpPackage).then(
                        function (data) {
                            if (options || options.onSuccess) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.AGREEMENT_CONTENT.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }
                            }
                        },
                        function (error) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError(error);
                            }
                        }
                    );
                };
                /**
                 * 更新本地用户信息
                 * @param _user
                 */
                var updateUserInLocalStorage = function (_user) {
                    // var _userInLocalStorage = {};
                    // _userInLocalStorage.userCode = _user.userCode;
                    // _userInLocalStorage.userName = _user.userName;
                    // _userInLocalStorage.comCode = _user.comCode;
                    // _userInLocalStorage.deptGroup = _user.deptGroup;
                    // _userInLocalStorage.token = _user.token;
                    // _userInLocalStorage.loginState = _user.loginState;
                    // _userInLocalStorage.isClaim = _user.isClaim;

                    localStorageService.set(constants.OPERATE_TYPE.LOCAL_USER, _user);
                };
                /**
                 * 初始化
                 */
                var init = function () {
                    user = new User();
                    //获取本地存储的用户
                    var _userInLocalStorage = localStorageService.get(constants.OPERATE_TYPE.LOCAL_USER);
                    //判断用户不为空
                    if (_userInLocalStorage) {
                        //实例化用户
                        user = new User(_userInLocalStorage);
                    }
                    // 赋值全局变量
                    $rootScope.user = user;
                };
                //启动初始化
                init();
                return {
                    /**
                     * 验证是否登录
                     * @returns {promise|{then, catch, finally}|*}
                     */
                    isAuthenticated: function () {
                        var deferred = $q.defer();
                        if ($rootScope.user.loginState) {
                            deferred.resolve(constants.AUTH.OK);
                        } else {
                            $rootScope.$broadcast(constants.AUTH.UNAUTHORIZED);
                            deferred.reject(constants.AUTH.UNAUTHORIZED);
                        }
                        return deferred.promise;
                    },
                    User: function (userId, options) {
                        //请求数据
                        //user = new User(data);
                        return user;
                    },
                    /**
                     * 外部用户登录
                     */
                    loginOutSide: function (account, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.LOGIN_OUTSIDE.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.LOGIN_OUTSIDE.URL;
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.LOGIN_OUTSIDE.TARGET, account);

                        $http(config.httpPackage).then(
                            function (data) {
                                if (options && options.onSuccess) {
                                    data = $$adapter.imports(constants.REQUEST_TARGET.LOGIN_OUTSIDE.TARGET, data);
                                    if (!data) {
                                        return
                                    }
                                    config.auth.isLogin = true;
                                    $rootScope.user = new User(data);
                                    $rootScope.user.loginState = true;
                                    updateUserInLocalStorage($rootScope.user);
                                    // 获取财富信息
                                    // $rootScope.user.myWealth();
                                    // // 获取我的排行榜
                                    // $rootScope.user.getRanking();
                                    options.onSuccess($rootScope.user);
                                }
                            },
                            function (error) {
                                // options.onError(error);
                            }
                        );
                    },
                    /**
                     * 内部员工登录
                     * @param account
                     * @param options
                     */
                    loginInSide: function (account, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.LOGIN_INSIDE.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.LOGIN_INSIDE.URL;
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.LOGIN_INSIDE.TARGET, account);

                        $http(config.httpPackage).then(
                            function (data) {
                                if (options && options.onSuccess) {
                                    data = $$adapter.imports(constants.REQUEST_TARGET.LOGIN_INSIDE.TARGET, data);
                                    if (!data) {
                                        options.onError();
                                        return
                                    }
                                    config.auth.isLogin = true;
                                    $rootScope.user = new User(data);
                                    $rootScope.user.loginState = true;
                                    updateUserInLocalStorage($rootScope.user);
                                    // 获取财富信息
                                    // $rootScope.user.myWealth();
                                    // // 获取我的排行榜
                                    // $rootScope.user.getRanking();
                                    options.onSuccess($rootScope.user);
                                }
                            },
                            function (error) {
                                options.onError(error);
                            }
                        );
                    },

                    /**
                     * 重置密码
                     * @param keyWords
                     * @param options 回调函数
                     */
                    updatePassword: function (keyWords, options) {
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.UPDATE_PASSWORD.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.UPDATE_PASSWORD.TARGET, keyWords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.UPDATE_PASSWORD.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 用户注册
                     * @param application
                     * @param options
                     */
                    register: function (application, options) {
                        config.httpPackage.url = constants.REQUEST_TARGET.REGISTER.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.REGISTER.TARGET, application);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.REGISTER.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        $rootScope.user = new User(data);
                                        options.onSuccess($rootScope.user);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 发送验证码
                     * @param tel
                     * @param options
                     */
                    sendCode: function (tel, options) {
                        config.httpPackage.url = constants.REQUEST_TARGET.SEND_CODE.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SEND_CODE.TARGET, user);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.SEND_CODE.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 查询顶级机构
                     * @param options
                     */
                    findFdcom: function (options) {
                        config.httpPackage.url = constants.REQUEST_TARGET.FIND_FDCOM.URL;
                        //后端入参适配
                        config.httpPackage.data = {
                            "data": {
                                "inComCode": "1" //内部机构编码
                            },
                            "key": "ACCOUNT_KEY",//固定值ACCOUNT_KEY
                            "source": "pc",//来源 pc app
                            "version": "1.0" //固定值版本 1.0
                        };
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.FIND_FDCOM.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 提现记录
                     * @param keyWords
                     * @param options
                     */
                    cashRecords: function (keyWords, options) {
                        config.httpPackage.url = constants.REQUEST_TARGET.CASH_RECORDS.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CASH_RECORDS.TARGET, user);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.CASH_RECORDS.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 获取排行榜
                     * @param keyWords
                     * @param options
                     */
                    getRanking: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_RANKING.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_RANKING.URL;
                        var keyWords ={
                            dateTime :keyWords
                        };
                        //后端入参适配
                        config.httpPackage.data = keyWords;
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_RANKING.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 获取考题
                     * @param options
                     */
                    getQuestions: function (options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.QUESTIONS.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.QUESTIONS.URL;
                        //后端入参适配
                        config.httpPackage.data = {"ansingCodeType":"ANSQUE1","agentCode":$rootScope.user.agentCode,"agentName":$rootScope.user.name};
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.QUESTIONS.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 提交答案
                     * @param answers
                     * @param options
                     */
                    submitAnswers: function (answers,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.SUBMIT_ANSWERS.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.SUBMIT_ANSWERS.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SUBMIT_ANSWERS.TARGET, answers);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.SUBMIT_ANSWERS.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },

                    /**
                     * 统计分析获取销售金额
                     * @param keyWords
                     * @param options
                     */
                    getRankingMoney: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_RANKING_MONEY.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_RANKING_MONEY.URL;
                        //后端入参适配
                        var keyWords ={
                            dateTime :keyWords
                        };
                        config.httpPackage.data = keyWords;
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_RANKING_MONEY.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 获取销售前十排名
                     * @param keyWords
                     * @param options
                     */
                    getRankingFirstTen: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_RANKING_FIRST_TEN.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_RANKING_FIRST_TEN.URL;
                        //后端入参适配
                        var keyWords ={
                            dateTime :keyWords
                        };
                        config.httpPackage.data = keyWords;
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_RANKING_FIRST_TEN.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 获取销售排名后十
                     * @param keyWords
                     * @param options
                     */
                    getRankingEndTen: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_RANKING_END_TEN.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_RANKING_END_TEN.URL;
                        //后端入参适配
                        var keyWords ={
                            dateTime :keyWords
                        };
                        config.httpPackage.data = keyWords;
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_RANKING_FIRST_TEN.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    }

                }
            }]);
});

