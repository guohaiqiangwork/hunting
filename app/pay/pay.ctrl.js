define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('payCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$modal', '$http',
        '$stateParams', '$$neptune', 'orderEntryCache', '$timeout', '$sce', '$compile',
        function ($scope, $state, $rootScope, localStorageService, $modal, $http, $stateParams, $$neptune, orderEntryCache, $timeout, $sce, $compile) {
            if ($stateParams.productId) {
                var params = JSON.parse($stateParams.productId);
                // 产品编号
                var productId = params.productId;
                // 支付方式
                var paymentMethod = params.paymentMethod;
                //批量支付订单id
                var out_trade_no = params.out_trade_no;
                $scope.out_trade_no = out_trade_no;
                //金额
                $scope.total_fee = params.total_fee;
                //产品名称
                var productName = decodeURI(params.productName);
                //现金展示
                $scope.isOrders = params.isOrders;
                // 返回位置（ISP或产品列表）
                $scope.backLocation = params.from === "SAP" ? "SAP" : "产品列表";
                $scope.isA = params.isA;
            }

            /**
             * 打开订单详情modal
             * @param id
             */
            $scope.openOrderDetails = function (id) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'orders/model/orderDetails.modal.tpl.html',
                    resolve: {
                        payOrderId: function () {
                            return $scope.out_trade_no
                        }
                    },
                    controller: function ($scope, $modalInstance, payOrderId) {
                        $scope.payOrderId = payOrderId;
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        /**
                         * 获取订单详情
                         */
                        function getOrder() {
                            $$neptune.$order.Order($scope.payOrderId, {
                                onSuccess: function (data) {
                                    $scope.order = data;
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        }

                        getOrder();
                    },
                    size: 'sm'
                })
            };
            $scope.step = '2';
            $scope.editDate = false;
            $scope.payPrice = '500';

            //生成签名
            var getSign = function (productId) {
                var stringA = {
                    appid: 'wx32ef6ab4597d5b5d',
                    mch_id: '1310013901',//商户号
                    //nonce_str:md5(Math.floor(Math.random()*10000)+'').toUpperCase(),
                    nonce_str: 'E9FD7C2C6623306DB59B6AEF5C0D5CAC',
                    product_id: productId,
                    time_stamp: '1498534185'      //时间戳
                };

                var nDate = new Date().getTime() + '';
                stringA.time_stamp = nDate.length == '10' ? nDate : nDate.substring(0, 10);
                stringA.nonce_str = hex_md5(Math.floor(Math.random() * 10000) + '').toUpperCase();
                var arrayA = [];
                for (one in stringA) {
                    arrayA.push(one + '=' + stringA[one]);
                }

                var strB = arrayA.sort().join('&') + '&key=fhs86gu3sdg9n3m2gsdg09js76bgs754';
                // console.log(strB);
                var sign = hex_md5(strB).toUpperCase();
                // console.log('签名：' + sign);
                var payLink = 'weixin://wxpay/bizpayurl?sign=' + sign + '&appid=' + stringA.appid + '&mch_id=' + stringA.mch_id + '&product_id=' + stringA.product_id + '&time_stamp=' + stringA.time_stamp + '&nonce_str=' + stringA.nonce_str;
                // console.log(payLink);
                return payLink;
            };

            //var payLink = getSign('B00001');
            //console.log('支付链接:'+payLink);

            //查询支付状态
            $scope.payStatus = "PREPAY";

            $scope._requestStartTime = "";
            $scope._requestStopTime = "";
            var queryPayStatus = function () {
                if (out_trade_no) {
                    $$neptune.$order.searchPayStatus(out_trade_no, {
                        onSuccess: function (data) {
                            $scope._requestStopTime = new Date().getTime();
                            if (data && data === "PAY_PROCESSE" || data === "PREPAY") {
                                if ($scope._requestStopTime - $scope._requestStartTime >= 600000) {
                                    $scope.payStatus = "PAY_FAILURE";
                                    clearInterval($scope.timeStart);
                                }
                            } else {
                                $scope.payStatus = data;
                                clearInterval($scope.timeStart);
                                $scope.payFinish();
                            }
                        },
                        onError: function (e) {
                            clearInterval($scope.timeStart);
                        }
                    })
                }
            };

            var makeQrcode = function (way, context) {
                $("#qrCodeDiv" + way).qrcode({
                    render: "table", // 渲染方式有table方式（IE兼容）和canvas方式
                    width: 120, //宽度
                    height: 120, //高度
                    text: context, //内容
                    typeNumber: -1,//计算模式
                    correctLevel: 0,//二维码纠错级别
                    background: "#ffffff",//背景颜色
                    foreground: "#000000"  //二维码颜色
                });

                $("#qrCodeDiv" + way)[0].children[0].style.width = 120 + "px";
                $("#qrCodeDiv" + way)[0].children[0].style.height = 120 + "px";
                if ($scope.isA != "Y") {
                    $scope._requestStartTime = new Date().getTime();
                    queryPayStatus();
                    $scope.timeStart = setInterval(queryPayStatus, 3000);
                } else {
                    $scope.payStatus = "PAY_SUCCESS";
                }
            };

            //生成二维码
            var createQrcode = function (way, productId) {
                var productNameFixed = "新奥保险-";
                // makeQrcode(way, 'qrcode');
                // return;
                $http({
                    method: 'post',
                    dataType: 'jsonp',
                    url: constants.backend.SERVER_PAY_IP + constants.backend.REQUEST_METHOD.CREATE_QRCODE,
                    async: true,
                    // contentType: 'application/json; charset=UTF-8',
                    withCredentials: true,
                    useDefaultXhrHeader: false,
                    header: {},
                    data: JSON.stringify(
                        {
                            data: {
                                "body": productNameFixed + productName, //--产品名称 规则:新奥保险-产品名称
                                "out_trade_no": out_trade_no,  //--订单id
                                "payChoo": "scancode",//--支付类型 扫码 固定值
                                "payType": "wechatpay",//--支付类型 微信
                                "product_id": productId,//--产品编码

                                "isA": $scope.isA
                            },
                            "key": "PAY_KEY",//--固定值
                            "source": "pc",//--来源 pc app
                            "version": "1.0"//--固定值
                        }
                        // "total_fee": $scope.total_fee,//--金额元 格式 0.00方式
                    )
                })
                    .success(function (data) {
                        // 清除缓存
                        orderEntryCache.clear();
                        if (data && data.data.code_url) {
                            makeQrcode(way, data.data.code_url);
                        } else {
                            alert(data.err.name);
                        }

                    })
                    .error(function (e) {
                        alert('error');
                    });
            };

            var qrcodes = [];

            //判断是否生成二维码
            var isCreateQrcode = function (way, productId) {
                if (qrcodes.length) {
                    if (qrcodes.indexOf(way) <= -1) {
                        qrcodes.push(way);
                        if (way == 'weixin')
                            createQrcode(way, productId);
                        else
                            makeQrcode(way, 'alipayQrcode');
                    }
                } else {
                    qrcodes.push(way);
                    if (way == 'weixin')
                        createQrcode(way, productId);
                    else
                        makeQrcode(way, 'alipayQrcode');
                }
            };

            $scope.clickPayWay = function (way) {
                if (way == 'weixin') {
                    $('#' + way)[0].checked = true;
                    $scope.checkPayWay = way;
                    isCreateQrcode(way, productId);
                } else if (way == 'alipay') {
                    var productNameFixed = "新奥保险-";
                    var newParams = angular.copy(params);
                    newParams.paymentMethod = "alipaySuccess";
                    var paySuccessUrl = location.href.substring(0, location.href.indexOf("pay") + 4) + JSON.stringify(newParams);
                    $http({
                        method: 'post',
                        dataType: 'jsonp',
                        url: constants.backend.SERVER_PAY_IP + constants.backend.REQUEST_METHOD.CREATE_QRCODE,
                        async: true,
                        // contentType: 'application/json; charset=UTF-8',
                        withCredentials: true,
                        useDefaultXhrHeader: false,
                        header: {},
                        data: JSON.stringify(
                            {
                                data: {
                                    "body": productNameFixed + productName, //--产品名称 规则:新奥保险-产品名称
                                    // "subject": productName,
                                    "out_trade_no": out_trade_no,  //--订单id
                                    "payChoo": "pc",//--支付类型 扫码 固定值
                                    "payType": "alipay",//--支付类型 支付宝
                                    "product_id": 'FAST_INSTANT_TRADE_PAY',//--产品编码
                                    "isA": $scope.isA,
                                    "paySuccessUrl": paySuccessUrl
                                },
                                "key": "PAY_KEY",//--固定值
                                "source": "pc",//--来源 pc app
                                "version": "1.0"//--固定值
                            }
                            // "total_fee": $scope.total_fee,//--金额元 格式 0.00方式
                        )
                    })
                        .success(function (data) {
                            // 清除缓存
                            orderEntryCache.clear();
                            if (data && data.data && data.data.alipay_response) {
                                var paymentPackage = $compile(data.data.alipay_response.replace(/\"/g, "\'") + "")($scope);
                                $('#paymentPackage').append(paymentPackage);
                            } else {
                                layer.msg(data.error.message, {time: 200});
                            }

                        })
                        .error(function (e) {
                            // layer.msg(error, {time: 200});
                        });

                }
            };

            $scope.editEffectiveDate = function () {
                if ($scope.checkPayWay == undefined) {
                    layer.msg("请选择支付方式", {time: 1000})
                } else {
                    var keyWords = {
                        "data": {
                            "payBatchId": out_trade_no
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    $$neptune.$order.queryPayStatus(keyWords, {
                        onSuccess: function (data) {
                            if (data.data.data == null) {
                                layer.msg('请支付当前订单', {time: 2000})
                            } else if (data.data.data == 'PAY_SUCCESS') {
                                $scope.step = '3';
                            }
                        },
                        onError: function (e) {
                        }
                    })
                }


                // var flag = false;
                // $.each($('input[name="payWay"]'), function (index, once) {
                //     if ($(once)[0].checked) {
                //         flag = true;
                //     }
                // });
                // if (flag) {
                //     //$scope.editDate = true;
                //     $scope.step = '3';
                // } else {
                //     layer.msg('请选择支付方式', {time: 1000});
                // }
            };

            $scope.payFinish = function () {
                //if ($('#effectiveDate').val()) {
                $scope.step = '3';
                // 清除缓存
                orderEntryCache.clear();
                //} else {
                //    layer.msg('生效日期不允许为空', {time: 1000});
                //}
            };

            //返回个人订单
            $scope.goOrders = function () {
                $state.go('orders');
            };

            /**
             * 返回
             */
            $scope.goBack = function () {
                clearInterval($scope.timeStart);
                if ($scope.backLocation === "ISP") {
                    // 退出本系统
                    javascript: history.go(-2);
                } else {
                    // 返回产品列表
                    // $state.go("products");
                    $state.go('buy', {id: ""});
                }
            };

            function init() {
                // 支付方式为现金，直接跳转第三步
                if (paymentMethod === "cash" || paymentMethod === "alipaySuccess") {
                    $scope.step = '3';
                    $scope.payStatus = "PAY_SUCCESS";
                }
            }

            init();
        }]);

});