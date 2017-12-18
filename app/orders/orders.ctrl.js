define([
    'app',
    'config',
    'constants',
    'layer',
    'jedate',
    'plupload'
], function (app, config, constants, layer, jeDate) {
    app.registerController('ordersCtrl', ['$scope', '$modal', '$state', '$$neptune', '$timeout', '$rootScope',
        'orderEntryCache', '$q',
        function ($scope, $modal, $state, $$neptune, $timeout, $rootScope, orderEntryCache, $q) {
            // 选中总额
            $scope.orderTotalCount = 0.00;
            // 缓存
            var cacheDeferred = undefined;
            //排序
            $scope.sorts = true;
            $scope.texts = [
                {text: '未完成订单', isAdvanced: true},
                // {text: '已完成', isAdvanced: true},
                {text: '全部订单', isAdvanced: true},
            ];

            $scope.orderTypes = [
                {
                    code: '1',
                    value: '未承保未支付未上缴'
                },
                {
                    code: '2',
                    value: '已承保未支付未上缴'
                },
                {
                    code: '3',
                    value: '未承保已支付已上缴'
                },
                {
                    code: '4',
                    value: '已承保已支付未上缴'
                }
            ];
            $scope.isSwitchOrder = 0;

            //查询对象
            $scope.searchOrderKeywords = {
                "orderStatus": "pay", //订单状态
                "orderSource": "ONLINE", //订单来源
                "applicantName": "", //投保人姓名
                "productName": "", //保险产品
                "applicantAddress": "", //投保人地址
                "orderTotal": "",  //保费
                "memberId": $rootScope.user.agentCode,  //用户ID
                "effectiveDateStart": "", //生效起期
                "effectiveDateEnd": "",//生效止期
                "expiryDateStart": "",//失效起期
                "expiryDateEnd": "",//失效止期
                "payMethod ": "", //支付方式
                "queryDate": "4", //周期
                "batchNo": "",  //批次号
                "searchDate": "",//查询日期
                "payStatus": "", // 支付状态
                "appStatus": "",// 承保状态
                "orderId": "",// 订单号
                "create_date_start": "",//购买日期起期
                "create_date_end": "",//购买日期止期
                "procesee": ""//支付中
            };
            //初始化查询对象
            var searchInit = function () {
                $scope.searchOrderKeywords = {
                    "orderStatus": "pay", //订单状态
                    "orderSource": "ONLINE", //订单来源
                    "applicantName": "", //投保人姓名
                    "productName": "", //保险产品
                    "applicantAddress": "", //投保人地址
                    "orderTotal": "",  //保费
                    "memberId": $rootScope.user.agentCode,  //用户ID
                    "effectiveDateStart": "", //生效起期
                    "effectiveDateEnd": "",//生效止期
                    "expiryDateStart": "",//失效起期
                    "expiryDateEnd": "",//失效止期
                    "payMethod ": "", //支付方式
                    "queryDate": "4", //周期
                    "batchNo": "",  //批次号
                    "searchDate": "",//查询日期
                    "payStatus": "", // 支付状态
                    "appStatus": "",// 承保状态
                    "orderId": "",// 订单号
                    "create_date_start": "",//购买日期起期
                    "create_date_end": "",//购买日期止期
                    "procesee": ""//支付中
                };
            };
            /**
             * 置空查询条件
             */
            $scope.goEmpty = function () {
                $timeout(function () {
                    searchInit();
                    $('#empty').blur();
                    $scope.searchOrders();
                }, 500);

            };
            //遍历的数组 待操作 待续保 历史订单
            $scope.waitOperateOrders = [];
            $scope.waitRenewOrders = [];
            $scope.historyOrders = [];
            $scope.noticeTices = 1;
            /**
             * 分页*/
            $scope.pagination = {
                totalItems: $scope.noticeTices,//总条数
                pageIndex: 1,//页索引
                pageSize: 10,//每页数量
                maxSize: 9, //最大容量
                numPages: 5, //总页数
                previousText: config.pagination.previousText, //上一页
                nextText: config.pagination.nextText, //下一页
                firstText: config.pagination.firstText,   //首页
                lastText: config.pagination.lastText,  //最后一页
                pageSizes: [10, 20, 30, 50] // 每页数量集合
            };

            $scope.orderTotal = 0;

            $scope.changeItemInit = function () {
                // $scope.waitOperateOrders = [];
                // $scope.waitRenewOrders = [];
                // $scope.historyOrders = [];
            };

            /**
             * 状态更改
             */
            function updateStatus() {
                // 待操作订单--合计单数、合计金额
                $scope.orderStatus.orderNumber = $scope.waitOperateOrders.length > 0;
                // 待操作订单--支付
                $scope.orderStatus.orderPay = $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === 'pay';
                // 待操作订单--承保
                $scope.orderStatus.orderUnderwriter = $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === 'underwriting';
                // 待操作订单--作废
                $scope.orderStatus.orderDelete = $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === 'delete';
                // 待操作订单--修改
                $scope.orderStatus.orderUpdate = $scope.searchOrderKeywords.orderStatus === 'update';
                // // 待操作订单--现金
                // $scope.orderStatus.orderCash = $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === '1' && $scope.searchOrderKeywords.orderSource === 'ONLINE' || $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === '2';
                // // 待操作订单--现金支付
                // $scope.orderStatus.cashPay = $scope.searchOrderKeywords.orderStatus === '1';
                // // 待操作订单--现金确认
                // $scope.orderStatus.cashSure = $scope.searchOrderKeywords.orderStatus === '2';
                // // 待操作订单--非现金支付
                // $scope.orderStatus.notCashPay = $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === '1' || $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === '2';
                // // 待操作订单--上缴
                // $scope.orderStatus.uploadOrderSign = $scope.waitOperateOrders.length > 0 && $scope.searchOrderKeywords.orderStatus === '4';
                // 待操作订单--上传保单
                $scope.orderStatus.uploadOrder = $scope.searchOrderKeywords.orderSource === 'OFFLINE';
                // 待操作订单--下载模版
                $scope.orderStatus.downloadOrder = $scope.searchOrderKeywords.orderSource === 'OFFLINE';
                if ($scope.orderStatus.downloadOrder) {
                    if (uploader){
                        uploader.disableBrowse(false);
                    }else{
                        $scope.uploaderInit();
                    }
                } else if (uploader) {
                    uploader.disableBrowse(true);
                }
            }

            /**
             * 查询订单
             * */
            $scope.searchOrders = function (_search) {
                $scope._policyNo = '';
                $scope.checkStatus = {
                    checkedAll: false
                };
                setTimeout(function () {
                    if (_search) {
                        $scope.pagination.pageIndex = 1;
                    }
                    var type = $scope.isSwitchOrder;
                    var target;
                    if (type == 0) {
                        $('#search0').blur();
                        target = angular.copy(constants.REQUEST_TARGET.INTELLIGENT_ANALYSIS_ORDERS);
                        target.URL += "/" + $rootScope.user.agentCode;
                        // } else if (type == 1) {
                        //     target = constants.REQUEST_TARGET.WAIT_RENEW_ORDERS
                    } else if (type == 1) {
                        $('#search1').blur();
                        target = angular.copy(constants.REQUEST_TARGET.INTELLIGENT_ORDERS);//全部订单
                        target.URL += "/" + $rootScope.user.agentCode;
                    }
                    $$neptune.find(target, $scope.searchOrderKeywords, {
                        onSuccess: function (data) {
                            $scope.isSearch = false;
                            $scope.waitOperateOrders = [];
                            $scope.waitRenewOrders = [];
                            $scope.historyOrders = [];
                            if (data.orders.length) {
                                if (type == 0) {
                                    $scope.waitOperateOrders = data.orders;
                                    $scope.pagination.totalItems = data.totalCount || data.orders.length;
                                    $scope.orderTotal = data.orderTotal || 0;
                                    $scope.ordersNum = data.totalCount;
                                    $scope.pagesAltogether = $scope.pagination.totalItems / $scope.pagination.pageSize;
                                    $scope.taskPageCountNote = Math.ceil($scope.pagesAltogether);
                                } else if (type == 1) {
                                    $scope.historyOrders = data.orders;
                                    $scope.pagination.totalItems = data.totalCount || data.orders.length;
                                    $scope.pagesAltogether = $scope.pagination.totalItems / $scope.pagination.pageSize;
                                    $scope.taskPageCountNote = Math.ceil($scope.pagesAltogether);
                                    $scope.ordersNum = data.totalCount;
                                }
                            } else {
                                $scope.orderTotal = 0;
                                $scope.ordersNum = 0;
                            }
                            updateStatus();
                        },
                        onError: function (e) {
                            $scope.orderTotal = 0;
                            $scope.ordersNum = 0;
                            $scope.waitOperateOrders = [];
                            // $scope.waitRenewOrders = [];
                            $scope.historyOrders = [];
                            updateStatus();
                        }
                    }, $scope.pagination)
                }, 100);
            };

            /**
             * 个人订单页面切换
             * @type {boolean}
             */
            $scope.switchOrder = function (target) {
                $timeout(function () {
                    searchInit();
                }, 100);
                $scope.searchOrderKeywords.applicantName = '';
                $scope.isSwitchOrder = target.index;
                $scope.pagination.pageIndex = 1; //切换tab重置索引
                $scope.searchOrders();
                // 切换到代操作订单的时候更改状态
                if ($scope.isSwitchOrder === 0)
                    updateStatus();

            };
            /**
             * 切换高级查询状态　  暂时取消
             */
            // $scope.switchAdvanced = function () {
            //     $scope.texts[$scope.isSwitchOrder].isAdvanced = !$scope.texts[$scope.isSwitchOrder].isAdvanced;
            //     updateStatus();
            // };


            /**
             * 打开订单详情
             * @param id
             * @param type 订单或保单
             */
            $scope.openOrderDetails = function (id, type) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'orders/model/orderDetails.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.type = type;
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        /**
                         * 获取订单详情
                         */
                        function getOrder() {
                            $$neptune.$order.Order(id, {
                                onSuccess: function (data) {
                                    $scope.order = data;
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        }

                        /**
                         * 获取单证
                         */
                        function getDocument() {
                            $$neptune.$document.getDocument(id, {
                                onSuccess: function (data) {
                                    $scope.myDocument = data;
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        }

                        getDocument();

                        getOrder();
                    },
                    size: 'sm'
                })
            };
            /**
             * 打开承保modal
             * @param id
             */
            var openAcceptance = function (id) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'orders/model/acceptance.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };
                    },
                    size: 'sm'
                })
            };

            /**
             * 承保
             */
            $scope.acceptance = function (orderId) {
                $$neptune.$order.underwriting(orderId, {
                    onSuccess: function (data) {
                        layer.msg("承保成功", {time: 3000});
                    },
                    onError: function (e) {
                        // layer.msg("接口问题", {time: 3000});
                    }
                });
            };
            /**
             * 打开凭证上传modal
             * @param id
             */
            $scope.openVoucherUpload = function (id) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'orders/model/openVoucherUpload.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        }
                    },
                    size: 'sm'
                })
            };
            /**
             * 是否承保小弹框
             */
            $scope.confirm = function (id) {
                layer.confirm('是否承保？', {
                    btn: ['取消', '确定'] //按钮
                }, function () {
                    layer.msg('已取消', {icon: 1});
                }, function () {
                    //打开承保modal
                    openAcceptance(id);
                });
            };
            /**
             * 年份
             * @param ele
             */
            $scope.setYearDate = function (ele) {
                jeDate({
                    dateCell: '#' + ele,
                    format: "YYYY-MM-DD",
                    insTrigger: false,
                    isClear: true,                         //是否显示清空
                    isToday: false,
                    minDate: "2004-01-01",   //0代表今天，-1代表昨天，-2代表前天，以此类推
                    okfun: function (elem, val, date) {
                        if (ele === 'create_date_starts' || ele === 'create_date_ends') {
                            ele = ele.substring(0, ele.length - 1);
                        }
                        $scope.searchOrderKeywords[ele] = val;
                    },
                    choosefun: function (elem, val) {
                        if (ele === 'create_date_starts' || ele === 'create_date_ends') {
                            ele = ele.substring(0, ele.length - 1);
                        }
                        $scope.searchOrderKeywords[ele] = val;
                    },
                    clearfun: function (elem, val) {
                        if (ele === 'create_date_starts' || ele === 'create_date_ends') {
                            ele = ele.substring(0, ele.length - 1);
                        }
                        $scope.searchOrderKeywords[ele] = '';
                    }
                });
            };

            /**
             *修改到产品录入页
             */
            $scope.goToRenewal = function (productId, orderId) {
                // 修改状态记录搜索条件
                if ($scope.orderStatus.orderUpdate) {
                    // 缓存数据
                    orderEntryCache.setOrderCache({searchInfo: $scope.searchOrderKeywords});
                }
                //alert('去产品录入页');
                $state.go('updateOrder', {
                    id: JSON.stringify({
                        productId: productId,
                        orderId: orderId
                    })
                })
            };
            /**
             *续保到产品录入页
             */
            $scope.goToRenewalBuy = function (productId, orderId) {
                // 修改状态记录搜索条件
                if ($scope.orderStatus.orderUpdate) {
                    // 缓存数据
                    orderEntryCache.setOrderCache({searchInfo: $scope.searchOrderKeywords});
                }
                //alert('去产品录入页');
                $state.go('buy', {
                    id: JSON.stringify({
                        productId: productId,
                        orderId: orderId
                    })
                })
            };

            //上传
            var uploader = undefined;
            $scope.uploaderInit = function () {
                var loadingIndex = undefined;
                //实例化一个plupload上传对象
                uploader = new plupload.Uploader({
                    runtimes: 'gears,html5,html4,flash,silverlight,browserplus',
                    browse_button: $("#pickfiles")[0], //触发文件选择对话框的按钮，为那个元素id 获取电脑文件
                    url: constants.backend.SERVER_ORDER_IP + "order/order/ordersfile/upload", //服务器端的上传页面地址
                    flash_swf_url: 'assets/js/plupload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
                    silverlight_xap_url: 'assets/js/plupload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                    multipart_params: {
                        operatorId: $rootScope.user.agentCode
                    },
                    filters: {
                        mime_types: [ //只允许上传jWORD,PPT,PDF,EXCEL 格式文件
                            {title: "", extensions: "xls,xlsx"}
                        ],
                        prevent_duplicates: true //不允许选取重复文件
                    },
                    init: {
                        PostInit: function () {
                            //$("#uploadfiles").on('click', function () {
                            //    uploader.start();//为插件中的start方法，进行上传
                            //    if (uploader.files.length == '0') {
                            //        alert('请选择文件')
                            //    }
                            //    return false;
                            //});
                        },

                        FilesAdded: function (uploader, addFiles) {
                            loadingIndex = layer.load(1, {
                                shade: false,
                                time: 10 * 1000
                            });
                            uploader.start();//为插件中的start方法，进行上传
                            if (uploader.files.length == '0') {
                                alert('请选择文件')
                            }
                            return false;
                        },
                        FileUploaded: function (up, file, response) {//这里response为后端反参
                            var response = JSON.parse(response.response);
                            if (response.data) {
                                layer.msg("上传成功", {time: 1000});
                                //上传成功后刷新列表
                                $scope.searchOrders();
                            } else {
                                layer.open({
                                    type: 1,
                                    area: ['420px', '240px'], //宽高
                                    content: response.error.message
                                });
                            }
                            layer.close(loadingIndex);
                            // 上传之后清空文件
                            $.each(up.files, function (i, file) {
                                up.removeFile(file);
                            });
                        },
                        Error: function (up, err) {
                            layer.msg('上传失败' + '[' + err.message + ']', {time: 1000});
                            layer.close(loadingIndex);
                            // 上传之后清空文件
                            $.each(up.files, function (i, file) {
                                up.removeFile(file);
                            });
                        }
                    }
                });
                uploader.init();
            };

            //日期插件
            // $scope.chooseOperateDate = function (ele) {
            //     var now = new Date().getTargetDate(0, 0, 0).Format("yyyy-MM-dd");
            //     jeDate({
            //         dateCell: '#' + ele,
            //         format: "YYYY-MM-DD",
            //         insTrigger: false,
            //         isClear: true,                         //是否显示清空
            //         isToday: true,
            //         maxDate: now,
            //         minDate: "2004-01-01",   //0代表今天，-1代表昨天，-2代表前天，以此类推
            //         okfun: function (elem, val, date) {
            //             $scope.searchOrderKeywords.searchDate = val;
            //             //$scope.changeItemInit();
            //             if ($scope.texts[$scope.isSwitchOrder].isAdvanced) {
            //                 // $scope.searchOrders();
            //             }
            //         },
            //         choosefun: function (elem, val, date) {
            //             $scope.searchOrderKeywords.searchDate = val;
            //             //$scope.changeItemInit();
            //             if ($scope.texts[$scope.isSwitchOrder].isAdvanced) {
            //                 // $scope.searchOrders();
            //             }
            //         },
            //         clearfun: function (elem, val) {
            //             $scope.searchOrderKeywords.searchDate = '';
            //             //$scope.changeItemInit();
            //             if ($scope.texts[$scope.isSwitchOrder].isAdvanced) {
            //                 // $scope.searchOrders();
            //             }
            //         }
            //     });
            // };
            /**
             * 批量承保
             * */
            $scope.orderUnderwriters = function () {
                if ($scope._policyNo.length === 0) {
                    layer.msg("请选择需要承保的订单", {time: 2000});
                    return
                }
                $$neptune.$order.createUnderwriters($scope._policyNo, {
                    onSuccess: function (data) {
                        layer.msg("正在处理中，稍后请到全部订单中查看是否承保", {time: 3000});
                        $scope.searchOrders();
                        $scope._policyNo = [];
                    },
                    onError: function (e) {
                    }
                })
            };
            /**
             * 批量支付
             * */
            $scope.orderPays = function () {
                if ($scope._policyNo == undefined) {
                    layer.msg("请选择需要支付的订单", {time: 2000});
                    return
                }
                if ($scope.searchOrderKeywords.procesee == '1') {
                    layer.confirm('请确认是否继续支付!', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        $$neptune.$order.paymentModification($scope._policyNo, {
                            onSuccess: function (data) {
                                if (data.success) {
                                    layer.msg("修改成功", {time: 2000});
                                    $scope.searchOrders()
                                }
                            },
                            onError: function (e) {
                                // layer.msg(e, {time: 2000})
                            }
                        })
                    }, function () {
                        layer.msg('取消成功', {icon: 1});
                    });
                } else {
                    $$neptune.$order.createBatch($scope._policyNo, {
                        onSuccess: function (data) {
                            if (data.out_trade_no) {
                                $state.go('pay', {
                                    productId: JSON.stringify({
                                        isOrders: 'Y',
                                        out_trade_no: data.out_trade_no,
                                        total_fee: data.total_fee,
                                        productName: '批量支付',
                                        productId: '000000000',
                                        isA: 'Y'
                                    })
                                });
                            }
                        },
                        onError: function (e) {
                            layer.msg(e, {time: 2000})
                        }
                    })
                }
            };


            /**
             * 上缴
             * */
            $scope.uploadOrderSign = function () {
                var orderNames = [];
                $.each($scope.waitOperateOrders, function (index, _waitOperateOrder) {
                    orderNames.push(_waitOperateOrder.orderId);
                });

                var uploadOrderSignModal = $modal.open({
                    backdrop: 'static',
                    animation: true,
                    resolve: {
                        memberId: function () {
                            return $rootScope.user.agentCode;
                        },
                        config: function () {
                            return config;
                        },
                        constants: function () {
                            return constants;
                        },
                        orderNames: function () {
                            return orderNames;
                        }
                    },
                    templateUrl: 'orders/template/upload_sign.tpl.html',
                    controller: function ($scope, $modalInstance, $state, $timeout, config, constants, memberId, orderNames) {

                        $scope.orderNames = orderNames;
                        $scope.imgSrc = '';
                        $scope.memberId = memberId;

                        $scope.signData = {
                            paymentName: "", //付款人姓名
                            paymentAmount: "", //付款金额
                            paymentAccount: "" //付款账号
                        };

                        /**
                         * 添加图片
                         * @param type
                         * @param file
                         * @param callback
                         */
                        $scope.previewImage = function (type, file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
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
                                    preloader.downsize($('#' + type).width(), $('#' + type).height());//先压缩一下要预览的图片,宽300，高300
                                    var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                                    callback && callback(imgsrc); //callback传入的参数为预览图片的url
                                    preloader.destroy();
                                    preloader = null;
                                };
                                preloader.load(file.getSource());
                            }
                        };

                        $scope.closeUploadSign = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });

                uploadOrderSignModal.result.then(function (result) {
                }, function (reason) {
                    if (reason) {
                        // console.log(reason);
                        layer.msg(reason, {time: 2000})
                    }
                });
            };

            /**
             * 生成批次号（现金批量支付，在上缴之前）
             * */
            $scope.cteateBetch = function () {
                var _ordersBatch = {
                    operatorId: $rootScope.user.agentCode,
                    orderIds: ''
                };
                if ($scope.searchOrderKeywords.orderStatus == '1') {
                    $$neptune.$order.createUnderwriters($scope.waitOperateOrders, {
                        onSuccess: function (data) {
                            //支付成功跳转到展示页面
                            $state.go('pay', {
                                productId: JSON.stringify({
                                    paymentMethod: 'cash'
                                })
                            });
                        },
                        onError: function (e) {
                            layer.msg(e, {time: 2000})
                        }
                    })
                } else {
                    var orderNames = [];
                    $.each($scope.waitOperateOrders, function (index, _waitOperateOrder) {
                        orderNames.push(_waitOperateOrder.orderId);
                    });
                    _ordersBatch.orderIds = orderNames;

                    $$neptune.$order.createBatchUploadSign(_ordersBatch, {
                        onSuccess: function (data) {
                            //支付成功跳转到展示页面
                            $state.go('pay', {
                                productId: JSON.stringify({
                                    paymentMethod: 'cash',
                                    total_fee: data.totalPrice
                                })
                            });
                        },
                        onError: function (e) {
                            layer.msg(e, {time: 2000})
                        }
                    })
                }
            };

            //表单方式直接下载文件
            //url表示要下载的文件路径,如:htpp://127.0.0.1/test.rar
            function downloadFile(url) {
                var form = $("<form>");//定义form表单,通过表单发送请求
                form.attr("style", "display:none");//设置为不显示
                form.attr("target", "");
                form.attr("method", "get");//设置请求类型
                form.attr("action", url);//设置请求路径
                $("body").append(form);//添加表单到页面(body)中
                form.submit();//表单提交
            }

            /**
             *导出功能
             */
            $scope.orderExport = function () {
                $$neptune.$order.orderExport($scope.searchOrderKeywords, {
                    onSuccess: function (data) {
                        if (data.DataSync) {
                            window.location.href = data.DataSync
                        }
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 2000})
                    }
                })
            };

            /**
             * 默认全选状态为fasle
             * */
            $scope.checkStatus = {
                checkedAll: false
            };
            $scope.changeOrderStatus = function () {
                $scope.checkStatus.checkedAll = false;
                $scope.searchOrderKeywords.procesee = '';
                $scope.selectedAll();
            };

            /**
             * 全选
             * */
            $scope.selectedAll = function () {
                var orderTotalCount = 0;
                $scope._policyNo = [];
                angular.forEach($scope.waitOperateOrders, function (target, index) {
                    target.checked = $scope.checkStatus.checkedAll;
                    if (target.checked) {
                        $scope._policyNo.push(target);
                    }
                    orderTotalCount += parseInt(target.orderTotal);
                });
                // 选中总额
                $scope.orderTotalCount = orderTotalCount.toFixed(2);
            };
            /**
             * 单选
             * */
            $scope.selectedOne = function () {
                $scope.checkStatus.checkedAll = $scope.waitOperateOrders.every(function (item, index, array) {
                    item.checked;
                });
                $scope._policyNo = [];
                var orderTotalCount = 0;
                angular.forEach($scope.waitOperateOrders, function (data) {
                    if (data.checked) {
                        $scope._policyNo.push(data);
                        orderTotalCount += parseInt(data.orderTotal);
                    }
                });
                // 选中总额
                $scope.orderTotalCount = orderTotalCount.toFixed(2);

                if ($scope._policyNo.length == $scope.waitOperateOrders.length) {
                    $scope.checkStatus = {
                        checkedAll: true
                    };
                }
            };

            /**
             * 作废
             * */
            $scope.ordersToVoid = function () {
                if ($scope._policyNo.length == 0) {
                    layer.msg("请选择需要作废的订单", {time: 2000})
                } else {
                    layer.confirm('确认作废订单', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        $$neptune.$order.ordersVoid($scope._policyNo, {
                            onSuccess: function (data) {
                                if (data.success) {
                                    layer.msg("作废成功", {time: 2000});
                                    $scope.searchOrders()
                                }
                            },
                            onError: function (e) {
                                // layer.msg(e, {time: 2000})
                            }
                        })
                    }, function () {
                        layer.msg('取消成功', {icon: 1});
                    });
                }
            };

            var init = function () {
                $scope.orderStatus = {
                    orderSource: 'ONLINE',
                    disabled:false
                };
                $scope.searchOrders();
            };
            init();
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (fromState.name !== 'updateOrder') {
                    // 清除缓存
                    orderEntryCache.clear();
                } else {
                    var searchOrderKeywords = orderEntryCache.getOrderCache("searchInfo");
                    if (searchOrderKeywords)
                        $scope.searchOrderKeywords = searchOrderKeywords;
                }
            });
        }]);
});