/**
 * Created by 若水一涵 on 2017/6/23.
 */
define([
    'app',
    'config',
    'constants',
    'layer',
    'jedate',
    'plupload'
], function (app, config, constants, layer, jeDate) {
    app.registerController('userCenterCtrl', ['$scope', '$state', '$rootScope', '$modal', '$stateParams', '$timeout', '$$neptune', '$$util',
        function ($scope, $state, $rootScope, $modal, $stateParams, $timeout, $$neptune, $$util) {
            // 左侧标签选中
            $scope.active = $stateParams.type;
            // 排行榜选择，默认全国
            $scope.rankingActive = "national";
            $scope.dropdownIsopen = false;
            $scope.basicInfo = {
                // 验证是否通过
                isVerification: false,
                // 是否开始验证
                isComplete: false,
                // 银行卡号是否展示
                bankCardNoShow: false
            };
            // 当天订单单数
            $scope.orderTotalCount = 0;
            /**
             *课件列表
             */
            $scope.learningList = [
                {name: '保险概述.ppt', docs_url: 'bxgs.ppt', docs_pdf: 'bxgs.pdf'},
                {name: '保险的基本原则.ppt', docs_url: 'bxjbyz.ppt', docs_pdf: 'bxjbyz.pdf'},
                {name: '保险合同.ppt', docs_url: 'bxht.ppt', docs_pdf: 'bxht.pdf'},
                {name: '财产保险.ppt', docs_url: 'ccbx.ppt', docs_pdf: 'ccbx.pdf'},
                {name: '人身保险.ppt', docs_url: 'rsbx.ppt', docs_pdf: 'rsbx.pdf'},
                {name: '保险经纪人概述.ppt', docs_url: 'bxjjrgs.ppt', docs_pdf: 'bxjjrgs.pdf'},
                {name: '保险经纪从业人员职业道德.ppt', docs_url: 'cyryzydd.ppt', docs_pdf: 'cyryzydd.pdf'},
                {name: '保险法.ppt', docs_url: 'bxf.ppt', docs_pdf: 'bxf.pdf'}
            ];
            // $scope.saveSuccessfully = true;
            //分页信息
            $scope.pagination = {
                totalItems: 10,//总条数
                pageIndex: 1,//页索引
                pageSize: 30,//每页数量
                maxSize: 9, //最大容量
                numPages: 5, //总页数
                previousText: config.pagination.previousText, //上一页
                nextText: config.pagination.nextText, //下一页
                firstText: config.pagination.firstText,   //首页
                lastText: config.pagination.lastText,  //最后一页
                pageSizes: [10, 20, 30, 50] // 每页数量集合
            };
            //提现记录
            $scope.cashRecordsKeyWords = {
                bank_card_id: '',	 //银行卡号
                start_date: '',  //起始时间
                end_date: ''  //终止时间
            };
            //初始化劳务协议
            $scope.register = {
                firstParty: '新奥保险经纪有限公司',//甲方
                companyAddress: '天津自贸试验区（空港经济区）环河北路80号空港商务园东区9号楼403-05房间',//公司地址
                firstZipCode: '300308',//甲方邮编
                secondParty: '',//乙方
                homeAddress: '',//家庭住址
                iDCardNo: '',//身份证号
                secondZipCode: '',//乙方邮编
                contractPeriod: '2017-03-15',//合同起期
                contractEnd: '2020-03-14',//合同止期
                sex: 1,
                isPass: 'true'
            };

            function init() {
                $scope.agreementInfoContent();
                $scope.saveSuccessfully = true; //是否签约
                // $scope.examPass = true; //考试是否通过
                $timeout(function () {
                    // 左侧菜单高度
                    $scope.menuHeight = {
                        'height': $scope.active === 'basicInfoDefault' ? $('#basicInfoDefault').height() + 'px' : $('#basicInfo').height() + 'px'
                    };
                    if ($scope.active == 'basicInfo') {
                        // 刷新下用户信息，因为图片需要
                        $rootScope.user.refresh();
                    }
                }, 100);

                // 刷新用户信息
                $rootScope.user.refresh();

                //搜索条件切换
                $scope.isSenior = true;
                // 切换排行榜
                // $scope.switchRanking('national');
                // 当天订单
                nowOrders();
                // 我的业绩
                achievement();
                // 查询我的财富
                if ('basicInfoDefault' === $scope.active)
                    $rootScope.user.myWealth();
                //是否签约
                if ($rootScope.user.branchType2 == 1) {
                    $scope.saveSuccessfully = false
                }
                //考试是否通过 判断不通过
                // if ($rootScope.user.isPassed == 'UNPASSED') {
                //     $scope.examPass = false;
                // }
                $scope.getExaminationResults()
            }

            /**
             * 我的业绩
             */
            function achievement() {
                var target = angular.copy(constants.REQUEST_TARGET.USER_ACHIEVEMENT);
                target.URL += "/" + $rootScope.user.agentCode;
                $$neptune.find(target, '', {
                    onSuccess: function (data) {
                        $scope.achievements = data;
                    },
                    onError: function (e) {
                    }
                });
            }

            /**
             * 换换左侧菜单
             */
            $scope.switchIsSenior = function () {
                $scope.isSenior = !$scope.isSenior
            };
            /**
             * 选择时间
             * @param ele
             */
            $scope.selectDate = function (ele) {
                jeDate({
                    dateCell: '#' + ele,
                    format: "YYYY-MM-DD",
                    insTrigger: false,
                    isClear: false,                         //是否显示清空
                    isToday: false,
                    okfun: function (elem, val, date) {

                    },
                    choosefun: function (val) {

                    }
                });
            };

            /**
             * 当天订单
             */
            function nowOrders() {
                var keyWords = {
                    searchDate: jeDate.now().split(" ")[0]
                };
                var target = angular.copy(constants.REQUEST_TARGET.WAIT_Day_ORDERS);
                target.URL += "/" + $rootScope.user.agentCode;
                $$neptune.find(target, keyWords, {
                    onSuccess: function (data) {
                        $scope.waitRenewOrders = data.orders;
                        $scope.ordersCount = data.totalCount;
                    },
                    onError: function (e) {
                    }
                }, {})
            }

            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info) {
                $scope.active = info;
                // 查询我的财富
                if ('basicInfoDefault' === info && !$rootScope.user.wealth)
                    $rootScope.user.myWealth();
                // 查询银行卡信息
                if ('bankCard' === info && !$rootScope.user.bankCard) {
                    $rootScope.user.getBankCard();
                }
            };
            $scope.imgSrc = '';

            function clearImg(type) {
                $('#pickfilesImg' + type)[0].src = "";
                $('#pickfilesImg' + type)[0].style.width = "0px";
                $('#pickfilesImg' + type)[0].style.height = "0px";
                $('#pickfilesText' + type).css('display', "block");
            }

            $scope.uploaderInit = function (type) {
                //实例化一个plupload上传对象
                var uploader = new plupload.Uploader({
                    runtimes: 'gears,html5,flash,html4,silverlight,browserplus',
                    headers: {'Access-Control-Allow-Origin': '*'},// 设置头部，干掉跨域问题
                    browse_button: $("#pickfiles" + type)[0], //触发文件选择对话框的按钮，为那个元素id 获取电脑文件
                    url: constants.backend.SERVER_LOGIN_IP + "up1/idcacrd/photo", //服务器端的上传页面地址
                    flash_swf_url: 'assets/js/plupload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
                    silverlight_xap_url: 'assets/js/plupload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                    multipart_params: {
                        agentCode: $rootScope.user.agentCode,
                        direc: type == 0 ? 'p' : 'b' //p为正面，b为反面
                    },
                    // resize: {
                    //     width: $('#filelist' + type).width(),
                    //     height: $('#filelist' + type).height(),
                    //     crop: true,
                    //     quality: 10,
                    //     preserve_headers: false
                    // },
                    filters: {
                        mime_types: [ //只允许上传png,jpg,jpeg 格式文件
                            {title: "图片文件", extensions: "png,jpg,jpeg"}
                        ],
                        // max_file_size : '24kb',
                        prevent_duplicates: true //不允许选取重复文件
                    },
                    init: {
                        PostInit: function () {
                            $("#uploadfiles" + type).on('click', function () {
                                if ($scope.user.approveState === '4') {
                                    layer.msg("审核成功不可修改证件照", {time: 3000});
                                    return false;
                                }
                                if (uploader.files.length == 0) {
                                    layer.msg("请选择文件", {time: 3000});
                                    return false;
                                }
                                uploader.start();//为插件中的start方法，进行上传
                                return false;
                            });
                        },
                        FilesAdded: function (uploader, addFiles) {
                            // 删除第一张图片
                            if (uploader.files.length === 2) {
                                // 删除第一个图片
                                uploader.splice(0, 1);
                            }
                            previewImage(type, addFiles[0], function (imgsrc) {
                                $('#pickfilesImg' + type)[0].src = imgsrc;
                                $('#pickfilesImg' + type)[0].style.width = $('#filelist' + type).width() + "px";
                                $('#pickfilesImg' + type)[0].style.height = $('#filelist' + type).height() + "px";
                                $('#pickfilesText' + type).css('display', "none");
                            })
                        },
                        FileUploaded: function (up, file, response) {//这里response为后端反参
                            // var response = JSON.parse(response.response);
                            if (JSON.parse(response.response).success) {
                                layer.msg("上传成功", {time: 3000});
                                clearImg(type);
                                // 刷新用户信息
                                $rootScope.user.refresh();
                                // 上传之后清空文件
                                $.each(up.files, function (i, file) {
                                    file.isDelete = true;
                                    up.removeFile(file);
                                });
                                // 销毁实例
                                uploader.destroy();
                                $("#uploadfiles" + type).unbind();
                            } else {
                                layer.msg("上传失败", {time: 3000});
                            }
                        },
                        Error: function (up, err) {
                            if (-600 === err.code) {
                                layer.msg("图片最大允许24kb", {time: 3000});
                                return;
                            }
                            if (-602 === err.code) {
                                return;
                            }
                            layer.msg('上传失败' + '[' + err.message + ']', {time: 3000});
                            // 上传之后清空文件
                            $.each(up.files, function (i, file) {
                                up.removeFile(file);
                            });
                            clearImg(type);
                        }
                    }
                });
                uploader.init();
            };

            /**
             * 添加图片
             * @param type
             * @param file
             * @param callback
             */
            function previewImage(type, file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                if (!file || !/image\//.test(file.type)) return; //确保文件是图片
                if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                    var fr = new mOxie.FileReader();
                    fr.onload = function () {
                        callback(fr.result);
                        fr.destroy();
                        fr = null;
                    };
                    fr.readAsDataURL(file.getSource());
                } else {
                    var preloader = new mOxie.Image();
                    preloader.onload = function () {
                        preloader.onresize = {
                            width: $('#filelist' + type).width(),
                            height: $('#filelist' + type).height(),
                            crop: true,
                            quality: 60,
                            preserve_headers: false
                        };
                        preloader.downsize($('#filelist' + type).width(), $('#filelist' + type).height());//先压缩一下要预览的图片,宽300，高300
                        console.log(preloader.size / 1024)
                        var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        console.log(imgsrc.length / 1024)
                        callback && callback(imgsrc); //callback传入的参数为预览图片的url
                        preloader.destroy();
                        preloader = null;
                    };
                    preloader.load(file.getSource());
                }
            }

            /**
             * 打开绑定银行卡弹窗
             * @param isAdd
             */
            $scope.openModifyBankCard = function (isAdd) {
                if (!isAdd) return false;
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
                            $scope.bankCard.isComplete = false;
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
                        /**
                         * 保存并关闭弹窗
                         */
                        $scope.success = function () {
                            if ($scope.bankCard.bank_no.length > 19 || $scope.bankCard.bank_no.length < 15) {
                                layer.msg("银行卡号长度为15到19位", {time: 2333});
                                return false;
                            }
                            if (!(/^1[34578]\d{9}$/.test($scope.bankCard.phone))) {
                                layer.msg("请填写正确的手机号", {time: 2333});
                                return false;
                            }
                            // 是否开始验证
                            $scope.bankCard.isComplete = true;
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
            /**
             * 打开奖金提现弹窗
             */
            $scope.openWithdrawal = function () {
                $modal.open({
                    backdrop: 'static',
                    size: 'sm',
                    animation: true,
                    templateUrl: 'userCenter/modal/withdrawal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $timeout(function () {
                            $('.modal-dialog').css('width', '23%');
                        }, 100);
                        // 提现对象
                        $scope.withdrawal = {
                            type: 'bonus'
                        };
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
                            if (!$scope.withdrawal.amount) {
                                layer.msg('请输入提现金额', {time: 2000});
                                return false;
                            }
                            if (!$scope.withdrawal.password) {
                                layer.msg('请输入提现密码', {time: 2000});
                                return false;
                            }
                            $rootScope.user.withdraw($scope.withdrawal, {
                                onSuccess: function (data) {
                                    $modalInstance.close();
                                    layer.msg('提现成功请到，提现记录查看', {time: 2000});
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        };
                    }
                });
            };
            /**
             * 打开佣金提现弹窗
             */
            $scope.openCommission = function () {
                $modal.open({
                    backdrop: 'static',
                    size: 'sm',
                    animation: true,
                    templateUrl: 'userCenter/modal/commission.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $timeout(function () {
                            $('.modal-dialog').css('width', '23%');
                        }, 100);
                        // 提取对象
                        $scope.commission = {
                            type: 'commission'
                        };
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
                            if (!$scope.commission.amount) {
                                layer.msg('请输入提现金额', {time: 2000});
                                return false;
                            }
                            if (!$scope.commission.password) {
                                layer.msg('请输入提现密码', {time: 2000});
                                return false;
                            }
                            $rootScope.user.withdraw($scope.withdrawal, {
                                onSuccess: function (data) {
                                    $modalInstance.close();
                                    layer.msg('提现成功请到，提现记录查看', {time: 2000});
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        };
                    }
                });
            };
            /**
             * 忘记提现密码
             */
            $scope.forgotWithdrawals = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'userCenter/modal/forgotPassword.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        /**
                         * 关闭弹窗
                         */
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });
            };
            /**
             * 切换排行榜
             * @param scope
             */
            // $scope.switchRanking = function (scope) {
            //     $scope.rankingActive = scope;
            //     if (!$rootScope.user.userRanking[scope])
            //         $rootScope.user.getRanking(scope);
            // };
            /**
             * 是否解绑
             */
            $scope.confirmBack = function ($event) {
                if ($event) $event.stopPropagation();
                layer.confirm('确认解绑银行卡？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    // 解绑银行卡
                    $rootScope.user.deleteBankCard({
                        onSuccess: function (data) {
                            layer.msg(data, {time: 3000});
                        },
                        onError: function (e) {
                            // layer.msg(e, {time: 3000});
                        }
                    });
                }, function () {
                    layer.msg('取消成功', {icon: 1});
                });
            };
            /**
             * 保存基本信息
             */
            $scope.saveBasicInfo = function () {
                // 是否开始验证
                $scope.basicInfo.isComplete = true;
                $timeout(function () {
                    if (!$scope.basicInfo.isVerification) {
                        layer.msg("验证不通过", {time: 2333});
                        return false;
                    }
                    $rootScope.user.update({
                        onSuccess: function (data) {
                            layer.msg(data, {time: 3000});
                            $rootScope.user.refresh();
                        },
                        onError: function (e) {
                            layer.msg(e + "", {time: 3000});
                        }
                    });
                }, 200);
            };
            /**
             * 查询提现记录
             */
            $scope.getCashRecords = function () {
                $$neptune.find(constants.REQUEST_TARGET.CASH_RECORDS, $scope.cashRecordsKeyWords, {
                    onSuccess: function (data) {
                        $scope.cashRecords = data;
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 3000});
                    }
                }, $scope.pagination);
            };
            /**
             * 删除省份证件照
             * @param type
             */
            $scope.deletePhoto = function (type) {
                if ($rootScope.user.approveState == 2 || $rootScope.user.approveState == 4) {
                    layer.msg('审核中，请勿操作')
                    return
                }
                if ($scope.user.approveState === '4') {
                    layer.msg("照片不允许修改", {time: 3000});
                    return false;
                }

                $rootScope.user.deletePhoto(type, {
                    onSuccess: function (data) {
                        $rootScope.user.refresh();
                    }
                });
            };

            /**
             * 打开劳动协议modal
             */
            $scope.openWorkAgreement = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'userCenter/modal/serviceAgreement.modal.tpl.html',
                    resolve: {
                        register: function () {
                            return $scope.register
                        }
                    },
                    controller: function ($scope, $modalInstance, register) {
                        $scope.register = register;
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        }
                    },
                    size: 'sm'
                })
            };
            /**
             * 劳务协议保存
             */
            $scope.saveAgreementInfo = function () {
                if ($scope.register.isPass == "false") {
                    layer.msg("请勾选劳务协议", {time: 2333});
                    return
                }
                if ($scope.register.secondZipCode&&$scope.register.secondZipCode.length < 6) {
                    layer.msg("请填写6位邮政编码", {time: 2000});
                    return
                }
                if (!$$util.checkCardCode($scope.register.iDCardNo)) {
                    layer.msg("身份证号码填写错误", {time: 2000});
                    return
                }
                // 是否开始验证
                $scope.basicInfo.isComplete = true;
                $timeout(function () {
                    if (!$scope.basicInfo.isVerification) {
                        // layer.msg("验证不通过", {time: 2333});
                        return false;
                    }
                    $rootScope.user.laborAgreementSigned($scope.register, {
                        onSuccess: function (data) {
                            if (data == "劳务协议保存成功！") {
                                $scope.saveSuccessfully = false
                            }
                            layer.msg(data, {time: 3000});
                            $rootScope.user.refresh();
                        },
                        onError: function (e) {
                            layer.msg(e, {time: 3000});
                        }
                    });
                }, 200);
            };
            /**
             * 查询协议数据
             */
            $scope.agreementInfoContent = function () {
                $rootScope.user.agreementContent($rootScope.user.agentCode, {
                    onSuccess: function (data) {
                        // 乙方
                        $scope.register.secondParty = data.name;
                        // 家庭住址
                        $scope.register.homeAddress = data.homeAddress;
                        // 邮政编码
                        $scope.register.secondZipCode = data.zipCode;
                        // 身份证号码
                        $scope.register.iDCardNo = data.idno;
                        if (data.branchType2 == 1) {
                            $scope.saveSuccessfully = false
                        }
                    },
                    onError: function (e) {
                        layer.msg("" + e, {time: 3000});
                    }
                });
            };
            // 剩余时间2小时
            var remainingTime = 7200;
            $scope.GetRTimeInterval = undefined;
            $scope.submitButton = "开始";
            $scope.examination = {
                time: "02:00:00",// 考试时间
                index: 0, // 显示哪道题
                isAllow: false
            };
            // 题
            $scope.questions = [];

            // 倒计时
            function GetRTime() {
                remainingTime--;
                $scope.$apply(function () {
                    $scope.examination.time = parseInt(remainingTime / 3600) + ":" + (parseInt(remainingTime % 3600 / 60) > 9 ? parseInt(remainingTime % 3600 / 60) : ("0" + parseInt(remainingTime % 3600 / 60))) + ":" + (parseInt(remainingTime % 3600 % 60) > 9 ? parseInt(remainingTime % 3600 % 60) : ("0" + parseInt(remainingTime % 3600 % 60)));
                    if ($scope.examination.time === "0:00:00" && $scope.GetRTimeInterval) {
                        clearInterval($scope.GetRTimeInterval);
                        // 清空防止再答题
                        $scope.GetRTimeInterval = undefined;
                    }
                    if ($scope.examination.time === "0:00:00") {
                        // $scope.submitExamination()
                        submitQuestions()//时间到自动提交
                    }
                });

            }

            function submitQuestions() {
                if ($scope.GetRTimeInterval) {
                    clearInterval($scope.GetRTimeInterval);
                    // 清空防止再答题
                    $scope.GetRTimeInterval = undefined;
                }
                $scope.examination.isAllow = true;
                $$neptune.$user.submitAnswers({answers: $scope.questions, remainingTime: remainingTime}, {
                    onSuccess: function (data) {
                        answerShow(data);
                        // 考试通过清空题目
                        $scope.questions = [];
                        $scope.examination = {
                            time: "2:00:00",// 考试时间
                            index: 0, // 显示哪道题
                            isAllow: false
                        };
                        // 刷新用户信息
                        $rootScope.user.refresh();
                        $scope.getExaminationResults()
                    },
                    onError: function (e) {
                    }
                });
            }

            // 开始答题，提交按钮
            $scope.submitExamination = function () {
                // 判断是否存在答案
                for (var i = 0; i < $scope.questions.length; i++) {
                    if (!$scope.questions[i].userAnswer) {
                        isShowSubtim();
                        return false;
                    }
                }
                submitQuestions();
            };
            var answerShow = function (result, isOver) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    resolve: {},
                    templateUrl: 'userCenter/modal/answer.html',
                    controller: function ($scope, $modalInstance, $state, $timeout) {

                        $scope.result = result;

                        $scope.closeAnswer = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });
            };
            var isShowSubtim = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    resolve: {},
                    templateUrl: 'userCenter/modal/isShowSubmit.html',
                    controller: function ($scope, $modalInstance, $state, $timeout) {

                        $scope.closeAnswer = function () {
                            $modalInstance.close();
                        };
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };
                    }
                }).result.then(function (result) {
                    submitQuestions();
                }, function (reason) {
                    if (reason) {
                        // console.log(reason);

                    }
                });

                return false;
            };
            /**
             * 获得考题
             */
            $scope.getQuestions = function () {
                $$neptune.$user.getQuestions({
                    onSuccess: function (data) {
                        $scope.questions = data;
                        if (!$scope.questions || $scope.questions.length === 0) {
                            $scope.examination.isAllow = true;
                        } else if (!$scope.GetRTimeInterval) {
                            $scope.GetRTimeInterval = setInterval(GetRTime, 1000);
                        }
                    },
                    onError: function (e) {
                    }
                });
            };
            /**
             * 上一题下一题
             * @param type
             */
            $scope.nextOrUpQuestions = function (type) {
                if (type === 'next') {
                    $scope.examination.index++;
                    $('#nextQuestion').blur();
                } else {
                    $scope.examination.index--;
                    $('#upQuestion').blur();
                }
            };

            /**
             * 考试成绩
             */
            $scope.getExaminationResults = function () {
                $$neptune.$order.getAchievement({
                    onSuccess: function (data) {
                        if (data.data.data.record) {
                            $scope.getResults = data.data.data.record.getPoints
                        }
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 3000});
                    }
                });
            };
            $scope.downloadLearn = function (name) {
                window.open("assets/docs/" + name)
            };
            $scope.downloadLearn1 = function (name) {
                window.location.href = "assets/docs/" + name
            };


            init();

        }]);
});