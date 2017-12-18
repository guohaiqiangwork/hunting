define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.util'
], function (config, constants, adapter) {
    angular.module('neptune.order', [
        'neptune.adapter',
        'mc.util'
    ])
        .factory('$$order', ['$q', '$http', '$timeout', '$$adapter', '$rootScope',
            function ($q, $http, $timeout, $$adapter, $rootScope) {
                // 生成订单所需参数
                var generateOrder = {
                    orderBaseInfo: {   //订单基本信息
                        "productId": "",  //产品编码
                        "price": "", //保费
                        "buyCopies": "", //购买份数（总份数）
                        "effectiveDate": "",  //保单生效起期
                        "orderId": "", //订单编号，修改订单时候不能为空
                        "memberId": "", //用户ID
                        operatorId: "",//操作人员ID（线上默认为memberId）
                        "innerOrderSource": ""  //订单来源   PC/HTML5/ANDROID/IOS
                    },
                    insElements: {   //用户确认的订单投保要素
                        "Period": "",
                        "Plan": ""
                    },
                    policyHolder: {   //投保人
                        "name": "",   //姓名
                        "insuredRelationCode": "",  //与被保险人关系代码
                        "birthday": "",  //出生日期
                        "sexCode": "",  //性别代码
                        "phoneNumber": "", //手机号
                        "telephoneNumber": "",  //座机号
                        "mail": "",  //电子邮箱
                        "bizMailType": "",  //邮箱类型(投保人邮箱:PH，业务员邮箱:SM)
                        "certificateTypeName": "", //证件类型名称
                        "certificateTypeCode": "",  //证件类型代码
                        "certificateNumber": "",  //证件号码
                        "certificateValidityStart": "", //证件有效期起期
                        "certificateValidityEnd": "",  //证件有效期止期
                        "areaProvinceCode": "",  //省代码
                        "areaCityCode": "",   //市代码
                        "areaDistrictCode": "",  //区代码
                        "address": "",  //详细地址
                        "zipCode": "",  //邮编
                        "occupationCategoryCode_1": "",  //一级职业类别代码
                        "occupationCategoryCode_2": "",  //二级职业类别代码
                        "occupationCategoryCode_3": "",  //三级职业类别代码
                        "cardNo": "", //卡号
                        "longitudeLatitude": ""  //经纬度
                    },
                    insureds: [  //被保险人
                        {
                            "holderRelationCode": "",  //与投保人关系代码
                            "isSelf": "",  //是否本人（Y/N）
                            "buyCopies": "1",  //购买份数 （单被保险人的购买份数）
                            "name": "",  //姓名
                            "birthday": "", //出生日期
                            "sexCode": "", //性别代码
                            "height": "", //身高
                            "weight": "",  //体重
                            "phoneNumber": "",  //手机号码
                            "telephoneNumber": "",  //座机号码
                            "mail": "",  //电子邮箱
                            "certificateTypeName": "", //证件类型名称
                            "certificateTypeCode": "",  //证件类型代码
                            "certificateNumber": "",  //证件号码
                            "certificateValidityStart": "",  //证件有效期起期
                            "certificateValidityEnd": "",  //证件有效期止期
                            "areaProvinceCode": "",  //省代码
                            "areaCityCode": "",  //市代码
                            "areaDistrictCode": "", //区代码
                            "address": "",  //详细地址
                            "zipCode": "",  //邮编
                            "occupationCategoryCode_1": "",  //一级职业类别代码
                            "occupationCategoryCode_2": "",  //二级职业类别代码
                            "occupationCategoryCode_3": "",  //三级职业类别代码
                            "cardNo": ""  //卡号
                        }
                    ],
                    properties: [  //家财信息
                        {
                            "insuredRelationCode": "",  //与被保险人关系代码
                            "housingType": "",  //房屋类型
                            "housingAge": "",   //房龄
                            "propertyCertificateNumber": "",  //房产证号
                            "areaProvinceCode": "",  //财产所在省代码
                            "areaCityCode": "",  //财产所在市代码
                            "areaDistrictCode": "",  //财产所在区代码
                            "address": "",  //财产所在详细地址
                            "zipCode": "",  //邮编
                            "bizUserType": "",  //商业用户类型
                            "bizUserTypeSpec": "",  //商业用户类型明细
                            "buildArea": "",  //营业建筑面积
                            "gasUserId": "",  //燃气用户编号
                            "gasUserCttNo": ""  //燃气用户合同号
                        }
                    ],
                    beneficiarys: [  //受益人信息
                        {
                            "name": "",  //姓名
                            "certificateTypeCode": "",  //证件类型代码
                            "certificateNumber": "",  //证件号码
                            "contractNumber": ""  //合同号
                        }
                    ],
                    healthInfo: [],

                    ordGasDpt: {  //燃气公司机构信息
                        "dptCode": "",  //燃气公司机构编码
                        "dptName": "",  //燃气公司机构名称
                        "operaterId": "",  //燃气公司操作人员工号
                        "operaterBranchId": ""  //燃气公司操作人员所在营业部
                    },
                    invoiceInfo: { // 发票信息
                        "invoiceTitle": "",  //发票抬头
                        "dutySign": "",  //税号
                        "sendAddress": ""  //收寄地址
                    },
                    ifPayInCash: false //是否现金支付
                };

                var Order = function (data) {
                    if (data) {
                        for (var k in data) {
                            this[k] = data[k];
                        }
                    }
                };
                return {
                    /**
                     * 订单详情
                     * @param orderId
                     * @param options
                     * @returns {Order}
                     * @constructor
                     */
                    Order: function (orderId, options) {
                        if (!orderId) {
                            return new Order();
                        }
                        config.httpPackage.method = constants.REQUEST_TARGET.ORDER.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.ORDER.URL + "?orderId=" + orderId+"&memberId="+$rootScope.user.agentCode;
                        // //后端入参适配
                        // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.ORDER.TARGET, orderId);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.ORDER.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(new Order(data));
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
                     * 保单详情
                     * @param orderId
                     * @param options
                     * @returns {Order}
                     * @constructor
                     */
                    policyNoDetails: function (policyNo, options) {
                        if (!policyNo) {
                            return new Order();
                        }
                        config.httpPackage.method = constants.REQUEST_TARGET.POLICY_NO_DETAILS.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.POLICY_NO_DETAILS.URL + "?policyNo=" + policyNo;
                        // //后端入参适配
                        // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.POLICY_NO_DETAILS.TARGET,data);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.POLICY_NO_DETAILS.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(new Order(data));
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
                     * 获取考试成绩
                     * @param orderId
                     * @param options
                     * @returns {Order}
                     * @constructor
                     */
                    getAchievement: function (options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_ACHIEVEMENT.METHOD;
                        config.httpPackage.data = {"ansingCodeType": "ANSQUE1", "memberId": $rootScope.user.agentCode};
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_ACHIEVEMENT.URL + "memberId=" + config.httpPackage.data.memberId + "&ansingCodeType=" + config.httpPackage.data.ansingCodeType;
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(new Order(data));
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
                     * 承保订单
                     * @param orderId
                     * @param options
                     */
                    underwriting: function (orderId, options) {
                        if (!orderId) {
                            options.onError("缺少订单号");
                            return
                        }
                        config.httpPackage.method = constants.REQUEST_TARGET.UNDERWRITER.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.UNDERWRITER.URL + "orderId=" + orderId+"&memberId="+$rootScope.user.agentCode;
                        // //后端入参适配
                        // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.ORDER.TARGET, orderId);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.UNDERWRITER.TARGET, data);
                                options.onSuccess(data);
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 生成订单
                     * @param keyWords
                     * @param options
                     */
                    generateOrder: function (keyWords, options) {
                        keyWords.Order = generateOrder;
                        config.httpPackage.method = constants.REQUEST_TARGET.GENERATE_ORDER.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.GENERATE_ORDER.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.GENERATE_ORDER.TARGET, keyWords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.GENERATE_ORDER.TARGET, data);
                                if (!data) {
                                    options.onError();
                                } else if (!data instanceof Array) {
                                    options.onError(data.error.message);
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 根据燃气用户编号查询订单信息
                     * @param gasCode
                     * @param options
                     */
                    getOrdersByGU: function (gasCode, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_ORDERS_BY_GU.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_ORDERS_BY_GU.URL + gasCode+"&memberId="+$rootScope.user.agentCode;
                        //后端入参适配
                        config.httpPackage.data = {
                            gasUserId: gasCode
                        };
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.GET_ORDERS_BY_GU.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },

                    /**
                     * 生成批次号（批量支付）
                     * @param keyWords
                     * @param options
                     */
                    createBatch: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.CREATE_BATCH.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.CREATE_BATCH.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CREATE_BATCH.TARGET, keyWords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.CREATE_BATCH.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 批量承保
                     * @param _orders
                     * @param options
                     */
                    createUnderwriters: function (_orders, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.CREATE_UNDERWRITERS.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.CREATE_UNDERWRITERS.URL+"/"+$rootScope.user.agentCode;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CREATE_UNDERWRITERS.TARGET, _orders);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.CREATE_UNDERWRITERS.TARGET, data);
                                if (!data.success) {
                                    options.onError(data);
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 批量作废
                     */
                    ordersVoid: function (_orders, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.ORDERS_VOID.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.ORDERS_VOID.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.ORDERS_VOID.TARGET, _orders);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.ORDERS_VOID.TARGET, data);
                                if (!data.success) {
                                    options.onError(data);
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 支付状态修改
                     * @param _orders
                     * @param options
                     */
                    paymentModification: function (_orders, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.PAYMENT_MODIFICATION.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.PAYMENT_MODIFICATION.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.PAYMENT_MODIFICATION.TARGET, _orders);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.PAYMENT_MODIFICATION.TARGET, data);
                                if (!data.success) {
                                    options.onError(data);
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    //现金批量支付（上缴之前）
                    createBatchUploadSign: function (_ordersBatch, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.CREATE_BATCH_UPLOAD_SIGN.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.CREATE_BATCH_UPLOAD_SIGN.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CREATE_BATCH_UPLOAD_SIGN.TARGET, _ordersBatch);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.CREATE_BATCH_UPLOAD_SIGN.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    //循环查询订单状态
                    searchPayStatus: function (_orderId, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.SEARCH_PAY_STATUS.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.SEARCH_PAY_STATUS.URL + _orderId;
                        //后端入参适配
                        //config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SEARCH_PAY_STATUS.TARGET, _ordersBatch);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.SEARCH_PAY_STATUS.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 历史订单导出
                     * @param searchOrderKeywords
                     * @param options
                     */
                    orderExport: function (searchOrderKeywords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.EXPORT.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.EXPORT.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.EXPORT.TARGET, searchOrderKeywords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.EXPORT.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 筛选城市、小区、楼栋、单元级联数据
                     * @param keyWords
                     * @param options
                     */
                    searchCity: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.SEARCH_CITY.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.SEARCH_CITY.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SEARCH_CITY.TARGET, keyWords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.SEARCH_CITY.TARGET, data);
                                if (!data) {
                                    options.onError();
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 综合筛选房产数据
                     * @param keyWords
                     * @param options
                     */
                    searchHouse: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.SEARCH_HOUSE.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.SEARCH_HOUSE.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SEARCH_HOUSE.TARGET, keyWords);
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.SEARCH_HOUSE.TARGET, data);
                                if (!data) {
                                    options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },

                    /**
                     * 订单查询导出
                     * @param searchOrderKeywords
                     * @param options
                     */
                    toExport: function (searchOrderKeywords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.TO_EXPORT.METHOD;
                        //请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.TO_EXPORT.URL;
                        //后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.TO_EXPORT.TARGET, searchOrderKeywords);
                        // config.httpPackage.headers= {"Accept":"*/*",'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};
                        config.httpPackage.responseType= 'arraybuffer';
                        //请求网络
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                data = $$adapter.imports(constants.REQUEST_TARGET.EXPORT.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }
                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 批量支付结果查询
                     * @param _orderId
                     * @param options
                     */
                    //循环查询订单状态
                    queryPayStatus: function (_orderId, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.QUERY_PAY_STATUS.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.QUERY_PAY_STATUS.URL;
                        config.httpPackage.data = _orderId;
                        //请求地址
                        $http(config.httpPackage).then(
                            function (data) {
                                //后端回参适配
                                // data = $$adapter.imports(constants.REQUEST_TARGET.QUERY_PAY_STATUS.TARGET, data);
                                if (!data) {
                                    // options.onError("适配器验证不通过");
                                } else {
                                    options.onSuccess(data);
                                }

                            },
                            function (error) {
                                if (options && options.onError && typeof(options.onError === 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    }

                };
            }]);
});

