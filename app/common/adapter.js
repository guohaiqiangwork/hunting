define([
    'config',
    'constants',
    'layer',
    'angular'
], function (config, constants, layer) {
    angular.module('neptune.adapter', [])
        .factory('$$adapter', ['$rootScope', '$$util', function ($rootScope, $$util) {

            //异常判断
            var hasException = function (data) {
                if (!data) {
                    $rootScope.$broadcast(constants.EVENTS.BACKEND_EXCEPTION, {message: '网络缓慢,请稍后重试'});
                    return true;
                }
                if (data.data && !data.data.success && data.data.error && typeof data.data.error !== 'Array') {
                    var message = '服务器没有返回详细的出错信息,错误原因不明';
                    message = data.data.error.message || message;
                    $rootScope.$broadcast(constants.EVENTS.BACKEND_EXCEPTION, {message: message});

                    return true;
                }

                return false;

            };

            // 数据入参转为后端格式
            var exportRules = {

                //登陆
                loginOutside: function (data) {
                    var sign = hex_md5(data.password).toUpperCase();
                    var _request = {
                        data: {
                            mobile: data.userCode || '',
                            password: sign
                        },
                        key: "ACCOUNT_KEY",
                        source: "pc",
                        version: "1.0"
                    };

                    return _request;
                },

                // 内部登陆
                loginInside: function (data) {
                    var _request = {
                        data: {
                            "agentCode": data.userCode || '', // 员工编码
                            "password": data.password || ""
                        },
                        key: "ACCOUNT_KEY",
                        source: "pc",
                        version: "1.0"
                    };

                    return _request;
                },

                //获取产品列表
                getProducts: function (data) {
                    var _request = {
                        supplierCode: data.keyWords.supplierCode || '',//保险公司编码
                        organizationCode: data.keyWords.organizationCode || '',//机构编码
                        categoryId: data.keyWords.categoryId || '',//栏目编码
                        riskName: data.keyWords.riskName || '',//产品名称用于模糊查询
                        salespersonCode: data.keyWords.salespersonCode || '',//营业员编码
                        pageNo: data.keyWords.pageIndex || '',//分页页数
                        pageSize: data.keyWords.pageSize || ''//分页条数
                    };
                    return _request;
                },
                //获取产品数据筛选条件
                getProductsScreen: function (data) {
                    var _request = {
                        version: '1.0'
                    }
                },
                Product: function (data) {
                    var _request = {
                        version: '1.0'
                    };
                    return _request;
                },
                register: function (data) {
                    var sign = hex_md5('ACCOUNT_KEY' + data.register.name + hex_md5(data.register.password).toUpperCase() + data.register.iDCardNo + data.register.phone).toUpperCase();
                    var _request = {
                        "data": {
                            "agentCom": data.fdcom.inComCode, //内部机构编码
                            "agentGroup": data.fdcom.comCode,//外部机构编码
                            "contract_start": data.register.contractPeriod,//合同起期
                            "contract_end": data.register.contractEnd,//合同止期
                            "homeAddress": data.register.homeAddress,//地址
                            "IDNo": data.register.iDCardNo,//身份证
                            "IDNoType": "01",//证件类型
                            "manage_range": "全国",//经验范围
                            "mobile": data.register.phone,//手机
                            "name": data.register.name,//姓名
                            "password": hex_md5(data.register.password).toUpperCase(), //密码 需md5加密一次 大写
                            "sex": data.register.sex,//性别 1:男 2:女
                            "sign": sign //签名
                        },
                        "key": "ACCOUNT_KEY",//固定值ACCOUNT_KEY
                        "source": "pc",//来源 pc app
                        "version": '1.0' //公司邮编
                    };
                    return _request;
                },
                updateUser: function (data) {
                    var _request = {
                        "data": {
                            "agentCode": data.agentCode, // 代理人编码
                            "EMail": data.email, // 邮箱
                            "QQ": data.qq,//QQ
                            "wechat_no": data.wechatNo, // 微信
                            "mobile": data.mobile // 手机号
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    return _request;
                },
                sendCode: function (data) {
                    var _request = {};
                    return _request;
                },
                updatePassword: function (data) {
                    var _request = {};
                    return _request;
                },
                withdraw: function (data) {
                    var _request = {
                        member_id: data.member_id,		//操作员编号
                        type: data.type,    //提现类型 commission 佣金； bonus 奖励金
                        amount: data.amount,
                        password: data.password
                    };
                    return _request;
                },
                //统计分析获取销售人员数量
                getRanking: function (data) {
                    var _request = {};
                    return _request;
                },
                //统计分析获取金钱
                getRankingMoney: function (data) {
                    var _request = {};
                    return _request;
                },
                getRankingFirstTen: function (data) {
                    var _request = {};
                    return _request;
                },
                getRankingEndTen: function (data) {
                    var _request = {};
                    return _request;
                },
                addBankCard: function (data) {
                    var sign = hex_md5("ACCOUNT_KEY" + data.bank_no + hex_md5(data.bank_pwd).toUpperCase() + data.cardCode + data.name);
                    var _request = {
                        "data": {
                            "user_id": $rootScope.user.agentCode,//用户id
                            "bank_no": data.bank_no,//银行卡
                            "bank_pwd": hex_md5(data.bank_pwd).toUpperCase(),//密码md5加密一次
                            "bank_type": "1",//卡类型 1储蓄卡 暂时固定值
                            "user_idcard_name": data.name,//持卡人姓名
                            "user_idcard_no": data.cardCode,//持卡人身份证
                            "user_mobile_phone": data.phone,//手机号
                            "bank_address": data.address,//开户行
                            "bank_name": data.bankName,//开户行地址
                            "sign": sign//签名ACCOUNT_KEY+银行卡号+提现密码+持卡人身份证+持卡人名称

                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    return _request;
                },
                findBankCard: function (data) {
                    var _request = {
                        "data": {
                            "user_id": $rootScope.user.agentCode
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    return _request;
                },
                deleteBankCard: function (data) {
                    var _request = {
                        "data": {
                            "user_id": $rootScope.user.agentCode
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    return _request;
                },
                updateCollection: function (data) {
                    var _request = {
                        product_id: data.product_id,
                        member_id: data.member_id
                    };
                    return _request;
                },
                Order: function (data) {
                    var _request = {
                        orderId: data.orderId
                    };
                    return _request;
                },
                policyNoDetails: function (data) {
                    var _request = {
                        policyNo: data.policyNo
                    };
                    return _request;
                },
                underwriter: function (data) {
                    var _request = {};
                    return _request;
                },
                renew: function (data) {
                    var _request = {};
                    return _request;
                },
                Policy: function (data) {
                    var _request = {};
                    return _request;
                },
                orderInquiry: function (data) {
                    var pagination = data.pagination;
                    var _request = {
                        "name": data.keyWords.name,
                        "agentGroup": data.keyWords.agentGroup,
                        "certificate_number": data.keyWords.certificate_number,
                        "address": data.keyWords.address,
                        "phone_number": data.keyWords.phone_number,
                        "agentName": data.keyWords.agentName,
                        "gas_user_id": data.keyWords.gas_user_id,
                        "create_date_state": data.keyWords.create_date_state,
                        "create_date_end": data.keyWords.create_date_end,
                        "product_name": data.keyWords.product_name,
                        "effective_date_state": data.keyWords.effective_date_state,
                        "effective_date_end": data.keyWords.effective_date_end,
                        "expiry_date_state": data.keyWords.expiry_date_state,
                        "expiry_date_end": data.keyWords.expiry_date_end,
                        "pageNo": pagination.pageIndex || 1, //分页信息页数,
                        "pageSize": pagination.pageSize || 10, //分页信息每页信息数
                        "isPage": "0",
                        "payState": data.keyWords.payState //订单状态
                    };
                    return _request;
                },
                /**
                 * 保险公司字典数据接口
                 * @param data
                 * @returns {{productId: (*|string|string|productModal.resolve.productId|string|string), companyId: *}}
                 * @constructor
                 */
                InsureInfo: function (data) {
                    var _request = {
                        productId: data.productId,
                        companyId: data.companyId
                    };
                    return _request;
                },
                /**
                 * 生成订单
                 * @param data
                 * @returns {{}}
                 */
                generateOrder: function (data) {
                    data.Order.orderBaseInfo.orderId = "";
                    // 基本信息
                    var orderBaseInfo = $.extend(data.Order.orderBaseInfo, data.orderBaseInfo);
                    // 订单要素
                    var insElements = $.extend(data.Order.insElements, data.insElements);
                    var _request = {
                        orderBaseInfo: orderBaseInfo,
                        insElements: insElements,
                        insureds: [],
                        properties: [],
                        beneficiarys: [],
                        ordGasDpt: null,
                        invoiceInfo: null
                    };
                    for (var k in data.insureInfo) {
                        // 投保人
                        if (k === 'A') {
                            _request.policyHolder = $.extend(data.Order.policyHolder, data.insureInfo[k]);
                            // 设置出生日期
                            // if (_request.policyHolder.certificateTypeCode === '1')
                            //     _request.policyHolder.birthday = $$util.getBirthdayByCardCode(_request.policyHolder.certificateNumber);
                        }
                        if (k.indexOf('B') > -1 && k !== 'ifPayInCash') {
                            // 是否本人
                            data.insureInfo[k].isSelf = data.insureInfo.A.insuredRelationCode === '1' ? 'Y' : 'N';
                            // 是否本人,赋值编码
                            data.insureInfo[k].holderRelationCode = data.insureInfo.A.insuredRelationCode === '1' ? '1' : data.insureInfo[k].holderRelationCode;
                            // 设置出生日期
                            // if (data.insureInfo[k].certificateTypeCode === '1')
                            //     data.insureInfo[k].birthday = $$util.getBirthdayByCardCode(data.insureInfo[k].certificateNumber);
                            // 添加被保人
                            _request.insureds.push($.extend(data.Order.insureds[0], data.insureInfo[k]));
                        }
                        if (k.indexOf('B') > -1 && (k === 'B0' || k === 'B') && k !== 'ifPayInCash') {
                            var beneficiary = {
                                name: data.insureInfo[k].name,
                                certificateTypeCode: data.insureInfo[k].certificateTypeCode,
                                certificateNumber: data.insureInfo[k].certificateNumber,
                                contractNumber: data.insureInfo[k].contractNumber,
                                certificateTypeName: data.insureInfo[k].certificateTypeName
                            };
                            // 添加被保人
                            _request.beneficiarys.push(beneficiary);
                        }
                        if (k.indexOf('C') > -1 && k !== 'ifPayInCash') {
                            // 添加家财
                            _request.properties.push($.extend(data.Order.properties[0], data.insureInfo[k]));
                        }
                        // 发票信息
                        if (k === 'D' && (data.insureInfo[k].invoiceTitle || data.insureInfo[k].dutySign || data.insureInfo[k].sendAddress)) {
                            _request.invoiceInfo = {
                                invoiceTitle: "",
                                dutySign: "",
                                sendAddress: ""
                            };
                            if (data.insureInfo[k].invoiceTitle) {
                                _request.invoiceInfo.invoiceTitle = angular.copy(data.insureInfo[k]).invoiceTitle;
                            }
                            if (data.insureInfo[k].dutySign) {
                                _request.invoiceInfo.dutySign = angular.copy(data.insureInfo[k]).dutySign;
                            }
                            if (data.insureInfo[k].sendAddress) {
                                _request.invoiceInfo.sendAddress = angular.copy(data.insureInfo[k]).sendAddress;
                            }
                        }
                    }
                    // 是否现金
                    _request.ifPayInCash = data.insureInfo.ifPayInCash;
                    // 订单
                    _request.orderId = data.insureInfo.orderId;
                    // 燃气公司机构信息，从用户信息中获取

                    if (data.insureInfo.ordGasDpt && (data.insureInfo.ordGasDpt.dptCode || orderBaseInfo.memberId)) {
                        _request.ordGasDpt = {
                            dptCode: "",
                            dptName: "",
                            vkont: "",
                            operaterId: "",
                            operaterBranchId: ""
                        };
                        if (data.insureInfo.ordGasDpt.dptCode) {
                            _request.ordGasDpt.dptCode = data.insureInfo.ordGasDpt.dptCode //燃气公司机构编码
                        }
                        if (orderBaseInfo.memberId) {
                            _request.ordGasDpt.dptCode = orderBaseInfo.memberId //燃气公司机构编码
                        }
                    }

                    return _request;
                },
                //待操作订单
                waitOperateOrders: function (data) {
                    data = data.keyWords;
                    var _request = {
                        applicantAddress: "",
                        applicantName: "",
                        batchNumber: "",
                        memberId: data.memberId || $rootScope.user.agentCode,
                        orderSource: "",
                        orderStatus: "",
                        orderTotal: "",
                        pageNo: "",
                        pageSize: "",
                        productName: "",
                        queryDate: data.searchDate || ""
                    };
                    return _request;
                },
                //当天订单
                waitDayOrders: function (data) {
                    data = data.keyWords;
                    var _request = {
                        applicantAddress: "",
                        applicantName: "",
                        batchNumber: "",
                        memberId: data.memberId || $rootScope.user.agentCode,
                        orderSource: "",
                        orderStatus: "",
                        orderTotal: "",
                        pageNo: "",
                        pageSize: "",
                        productName: "",
                        queryDate: data.searchDate || ""
                    };
                    return _request;
                },
                //个人订单（全部订单）
                IntelligentOrders: function (data) {
                    var pagination = data.pagination;
                    data = data.keyWords;
                    var _request = {
                        "applicantName": data.applicantName || "", //投保人姓名
                        "productName": data.productName || "", //保险产品
                        "applicantAddress": data.applicantAddress || "", //投保人地址
                        "orderTotal": data.orderTotal || "",  //额度
                        "memberId": data.memberId || $rootScope.user.agentCode,  //用户ID
                        "effective_date_start": data.effectiveDateStart || "", //生效起期
                        "effective_date_end": data.effectiveDateEnd || "",//生效止期
                        "expiry_date_start": data.expiryDateStart || "",//失效起期
                        "expiry_date_end": data.expiryDateEnd || "",//失效止期
                        "payMethod": data.payMethod || "",//支付方式
                        "queryDate": data.queryDate || "", //周期
                        "pageNo": pagination.pageIndex || 1, //分页信息页数,
                        "pageSize": pagination.pageSize || 10, //分页信息每页信息数
                        // "createDateStart": data.createDateStart || "",  //购买日期起期
                        // "createDateEnd": data.createDateEnd || "",//购买日期止期
                        "isPage": "2", //--2需要分页;1不需要分页
                        "payStatus": data.payStatus || "", // 支付状态
                        "appStatus": data.appStatus || "", // 承保状态
                        "orderId": data.orderId,// 订单号
                        "insured_date_end": data.insured_date_end,
                        "insured_date_start": data.insured_date_start,
                        "create_date": data.createDate,
                        "create_date_start": data.create_date_start, //下单时间起期
                        "create_date_end": data.create_date_end, //下单时间止期
                        "procesee": data.procesee //支付中
                    };
                    return _request;
                },
                //待续保订单
                waitRenewOrders: function (data) {
                    var pagination = data.pagination;
                    data = data.keyWords;
                    var _request = {
                        "applicantName": data.applicantName || "", //投保人姓名
                        "productName": data.productName || "", //保险产品
                        "applicantAddress": data.applicantAddress || "", //投保人地址
                        "orderTotal": data.orderTotal || "",  //额度
                        "memberId": data.memberId || $rootScope.user.agentCode,  //用户ID
                        "effectiveDateStart": data.effectiveDateStart || "", //失效起期
                        "expiryDateEnd": data.expiryDateEnd || "",  //失效止期
                        "payMethod": data.payMethod || "",//支付方式
                        "cycle": data.cycle || "", //周期
                        "pageNo": pagination.pageIndex || 1, //分页信息页数,
                        "pageSize": pagination.pageSize || 10 //分页信息每页信息数
                    };
                    return _request;
                },
                //历史订单
                historyOrders: function (data) {
                    var pagination = data.pagination;
                    data = data.keyWords;
                    var _request = {
                        "applicantName": data.applicantName || "", //投保人姓名
                        "productName": data.productName || "", //保险产品
                        "applicantAddress": data.applicantAddress || "", //投保人地址
                        "orderTotal": data.orderTotal || "",  //额度
                        "memberId": data.memberId || $rootScope.user.agentCode,  //用户ID
                        "effective_date_start": data.effectiveDateStart || "", //生效起期
                        "effective_date_end": data.effectiveDateEnd || "",//生效止期
                        "expiry_date_start": data.expiryDateStart || "",//失效起期
                        "expiry_date_end": data.expiryDateEnd || "",//失效止期
                        "payMethod": data.payMethod || "",//支付方式
                        "queryDate": data.queryDate || "", //周期
                        "pageNo": pagination.pageIndex || 1, //分页信息页数,
                        "pageSize": pagination.pageSize || 10, //分页信息每页信息数
                        // "createDateStart": data.createDateStart || "",  //购买日期起期
                        // "createDateEnd": data.createDateEnd || "",//购买日期止期
                        "isPage": "2", //--2需要分页;1不需要分页
                        "payStatus": data.payStatus || "", // 支付状态
                        "appStatus": data.appStatus || "", // 承保状态
                        "orderId": data.orderId,// 订单号
                        "insured_date_end": data.insured_date_end,
                        "insured_date_start": data.insured_date_start
                    };
                    return _request;
                },
                /**
                 * 提现记录
                 * @param data
                 */
                cashRecords: function (data) {
                    var _request = {
                        member_id: $rootScope.user.agentCode,
                        bank_card_id: data.bank_card_id,	 //银行卡号
                        start_date: data.start_date,  //起始时间
                        end_date: data.end_date,  //终止时间
                        pageNo: data.pageIndex,
                        pageSize: data.pageSize
                    };
                    return _request;
                },
                /**
                 * 退保
                 * @param data
                 */
                signOrders: function (data) {
                    var _request = {
                        policyNO: data.policyNO,//保单号
                        edorDetail: data.edorDetail,//退保原因
                        memberId: $rootScope.user.agentCode//用户id
                        // edorSubmitName: data.edorSubmitName,//指定退保人
                        // bankAccNo: data.bankAccNo//银行卡
                    };
                    return _request;
                },
                /**
                 * 刷新用户信息
                 * @param data
                 * @returns {{data: {agentCode: *}, key: string, source: string, version: string}}
                 */
                refresh: function (data) {
                    var _request = {
                        "data": {
                            "agentCode": data
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    return _request;
                },
                //智能分析-排名(GET)
                getStatisticsRank: function (data) {
                    return data;
                },
                //生成批次号
                createBatch: function (data) {
                    var _request = {
                        data: {}
                    };
                    var _orderIds = [];
                    $.each(data, function (index, _order) {
                        if (_order.orderId) {
                            _orderIds.push(_order.orderId);
                        }
                    });
                    _request.data.orderIds = _orderIds;
                    return _request;
                },
                //批量承保
                createUnderwriters: function (data) {
                    var _orderIds = [];
                    $.each(data, function (index, _order) {
                        if (_order.orderId) {
                            _orderIds.push(_order.orderId);
                        }
                    });
                    return _orderIds;
                },
                /**
                 * 我的业绩
                 * @param data
                 * @returns {{}}
                 */
                achievement: function (data) {
                    var _request = {
                        "memberId": $rootScope.user.agentCode,
                        "productCode": data
                    };
                    return _request;
                },
                //批量支付（上缴之前）
                createBatchUploadSign: function (data) {
                    var _request = {
                        operatorId: data.operatorId || '',
                        orderIds: data.orderIds || ''
                    };
                    return _request;
                },
                //批量作废（上缴之前）
                ordersVoid: function (data) {
                    var _orderIds = [];
                    $.each(data, function (index, _order) {
                        if (_order.orderId) {
                            _orderIds.push(_order.orderId);
                        }
                    });
                    // _request.data.orderIds = _orderIds;
                    var _request = {
                        memberId: $rootScope.user.agentCode,
                        orderIds: _orderIds
                    };

                    return _request;
                },
                //查询保单（智能分析）
                getPolicies: function (data) {
                    var pagination = data.pagination;
                    var data = data.keyWords;
                    var _request = {
                        "member_id": data.memberId || '',
                        "effective_date_start": data.effectiveDateStart || '',
                        "effective_date_end": "",
                        "expiry_date_start": "",
                        "expiry_date_end": data.expiryDateEnd || '',
                        "pageNo": pagination.pageIndex || 1, //分页信息页数,
                        "pageSize": pagination.pageSize || 10, //分页信息每页信息数
                        "createDateStart": data.createDateStart || "",  //购买日期起期
                        "createDateEnd": data.createDateEnd || "",//购买日期止期
                        "insured_date_end": data.insured_date_end,
                        "insured_date_start": data.insured_date_start
                    };
                    return _request;
                },
                //获取地区
                getArea: function (data) {
                    var _request = {
                        "companyId": data.companyId || "",
                        "productId": data.productId || "",
                        "gradeNum": data.gradeNum || "1",
                        "parentId": data.parentId || "0"
                    };
                    return _request;
                },
                // 删除图片身份证图片
                deletePhoto: function (data) {
                    var _request = {
                        "data": {
                            "agentCode": data.agentCode,
                            "idcare_posi_photo": data.deletePhotoType === 'posi' ? "" : null,  // 身份证正面链接 空串
                            "idcard_nega_photo": data.deletePhotoType === 'nega' ? "" : null // 身份证背面链接 空串
                        },
                        "key": "ACCOUNT_KEY",
                        "source": "pc",
                        "version": "1.0"
                    };
                    return _request;
                },
                //查询支付状态
                searchPayStatus: function (data) {
                    var _request = {};
                    return _request;
                },
                //导出
                orderExport: function (data) {
                    var _request = {
                        "applicantName": data.applicantName || "", //投保人姓名
                        "productName": data.productName || "", //保险产品
                        "applicantAddress": data.applicantAddress || "", //投保人地址
                        "orderTotal": data.orderTotal || "",  //额度
                        "memberId": data.memberId || $rootScope.user.agentCode,  //用户ID
                        "effective_date_start": data.effectiveDateStart || "", //生效起期
                        "effective_date_end": data.effectiveDateEnd || "",//生效止期
                        create_date_end: data.create_date_end || "",
                        create_date_start: data.create_date_start || "",
                        "payMethod": data.payMethod || "",//支付方式
                        "queryDate": data.queryDate || "", //周期
                        "pageNo": '1', //分页信息页数,
                        "pageSize": '60000', //分页信息每页信息数
                        // "createDateStart": data.createDateStart || "",  //购买日期起期
                        // "createDateEnd": data.createDateEnd || "",//购买日期止期
                        "isPage": "2", //--2需要分页;1不需要分页
                        "payStatus": data.payStatus || "", // 支付状态
                        "appStatus": data.appStatus || "", // 承保状态
                        "orderId": data.orderId,// 订单号
                        "insured_date_end": data.insured_date_end,
                        "insured_date_start": data.insured_date_start,
                        "create_date": data.createDate
                    };
                    return _request;
                },
                //劳务协议
                laborAgreementSigned: function (data) {
                    var _request = {
                        data: {
                            agentCode: $rootScope.user.agentCode,
                            name: data.secondParty,
                            homeAddress: data.homeAddress,
                            IDNo: data.iDCardNo,
                            zipCode: data.secondZipCode,

                        },
                        key: "ACCOUNT_KEY",
                        source: "pc",
                        version: "1.0"
                    }
                    return _request;
                },
                //劳务协议内容查询
                agreementContent: function (data) {
                    var _request = {
                        data: {
                            agentCode: $rootScope.user.agentCode
                        },
                        key: "ACCOUNT_KEY",
                        source: "pc",
                        version: "1.0"
                    };
                    return _request;
                },
                //获取商业用户编码
                getBusinessUserType: function (data) {
                    var _request = {
                        "companyId": data.companyId || "1007", //保险公司编码
                        "productId": data.productId || "100701001",//产品编码
                        "gradeNum": data.gradeNum || "1",  //查询级别（123）
                        "parentId": data.parentId || "110000" //父级编码
                    };
                    return _request;
                },
                //个人订单（全部订单）
                IntelligentAnalysisOrders: function (data) {
                    data = data.keyWords;
                    var _request = {
                        "doType": data.orderStatus === 'underwriting' ? "2" : data.orderStatus === 'update' ? "3" : "1", //待操作类型-- 1:作废;1:支付;2:承保;3:修改(暂时隐藏)
                        // "orderStatus": data.orderStatus || "",   //订单状态
                        "applicantName": data.applicantName || "", //投保人姓名
                        "productName": data.productName || "", //保险产品
                        // "applicantAddress": data.applicantAddress || "", //投保人地址
                        "orderSource": data.orderSource === "OFFLINE" ? "2" : "1",  //订单来源--1:录单;2:批导
                        "operatorId": data.orderSource === "OFFLINE" ? $rootScope.user.agentCode : "",
                        // "orderTotal": data.orderTotal || "",  //额度
                        "memberId": data.memberId || $rootScope.user.agentCode,  //用户ID
                        "pageNo": '', //分页信息页数,
                        "pageSize": '', //分页信息每页信息数
                        // "batchNumber": data.batchNo || "", //批次号
                        "create_date": data.searchDate || "", //日期
                        "isPage": "1", // 2需要分页;1不需要分页
                        "orderId": data.orderId,// 订单号
                        "create_date_start": data.create_date_start, //下单时间起期
                        "create_date_end": data.create_date_end, //下单时间止期
                        "procesee": data.procesee//支付中
                    };
                    return _request;
                },
                submitAnswers: function (data) {

                    var _request = {
                        "ansingCodeType": "ANSQUE1",    //题库类型 默认
                        "agentCode": $rootScope.user.agentCode,
                        "agentName": $rootScope.user.name,
                        "timeSpent": 7200 - data.remainingTime,    //答题花费时间
                        "answersSubmitDetails": []
                    };
                    if (data && data.answers instanceof Array) {
                        $.each(data.answers, function (index, item) {
                            _request.answersSubmitDetails.push({
                                questionId: item.queId,
                                answerValue: item.userAnswer || ""
                            });
                        });
                    }
                    return _request;
                },
                /**
                 * 是否投保查询
                 */
                housingInsuranceInquiries: function (data) {
                    var _request = {
                        "gusUserId": data.keyWords.gusUserId,//燃气编号
                        "address": data.keyWords.address,//地址
                        "cardNo": data.keyWords.cardNo,//证件号码
                        "pageNo": data.pagination.pageIndex || 1, //分页信息页数,
                        "pageSize": data.pagination.pageSize || 10 //分页信息每页信息数
                    };
                    return _request;
                },
                /**
                 * 筛选城市、小区、楼栋、单元级联数据
                 * @param data
                 * @returns {{}}
                 */
                searchCity: function (data) {
                    var _request = {
                        "city1": data.city || "",    //城市
                        "str_suppl1": data.village || "",   //小区
                        "str_suppl3": data.building || "",    //楼栋
                        "str_erg2": data.unit || "",  //单元
                        "roomnumber": data.roomNumber || "",
                        "name_last": "",
                        "vstelle": "",
                        "partner": "",
                        "idnumber": "",
                        "pageNo": data.pageIndex,
                        "pageSize": data.pageSize,
                        "searchingType": data.type   // 搜索类型 1：城市 2：小区 3：楼栋 4：单元 5：房间号
                    };
                    return _request;
                },
                /**
                 * 综合筛选房产数据
                 * @param data
                 * @returns {{city1: (*|string), str_suppl1: (string|*), str_suppl3: (*|string), str_erg2: (*|karma.unit|{configFile, background, browsers}|string|Array), roomnumber: (*|string), name_last: (*|string), vstelle: (*|string), partner: string, idnumber: string}}
                 */
                searchHouse: function (data) {
                    var _request = {
                        "city1": data.city || "",
                        "str_suppl1": data.village || "",
                        "str_suppl3": data.building || "",
                        "str_erg2": data.unit || "",
                        "roomnumber": data.roomNumber || "",
                        "name_last": data.userName || "",
                        "vstelle": data.houseNumber || "",
                        "partner": data.partner || "",
                        "idnumber": data.cardNo || "",
                        "pageNo": data.pageIndex,   //第几页
                        "pageSize": data.pageSize  //每页条数
                    };
                    return _request;
                },
                /**
                 * 订单查询导出
                 * */
                toExport: function (data) {
                    var pagination = data.pagination;
                    var _request = {
                        "name": data.name,
                        "agentGroup": data.agentGroup,
                        "certificate_number": data.certificate_number,
                        "address": data.address,
                        "phone_number": data.phone_number,
                        "agentName": data.agentName,
                        "gas_user_id": data.gas_user_id,
                        "create_date_state": data.create_date_state,
                        "create_date_end": data.create_date_end,
                        "product_name": data.product_name,
                        "effective_date_state": data.effective_date_state,
                        "effective_date_end": data.effective_date_end,
                        "expiry_date_state": data.expiry_date_state,
                        "expiry_date_end": data.expiry_date_end,
                        "pageNo": 1, //分页信息页数,
                        "pageSize": 10, //分页信息每页信息数
                        "isPage": "2",
                        "payState": data.payState //订单状态
                    };
                    return _request;
                },
                /**
                 * 支付中状态改变
                 */
                paymentModification: function (data) {
                    var _orderIds = [];
                    $.each(data, function (index, _order) {
                        if (_order.orderId) {
                            _orderIds.push(_order.orderId);
                        }
                    });
                    var _request = {
                        data: {
                            orderIds: _orderIds,
                            "key": "TOKEN_KEY",
                            "source": "pc",
                            "version": "1.0"
                        }
                    };
                    return _request;
                },
                /**
                 * 单证入库
                 */
                putInStorage: function (data) {
                    var _request = {
                        // data: {
                        "certifyCode": data.certifyCode,// 单证编码
                        "certifyName": data.certifyName, // 单证名称
                        "supplierCode": data.supplierCode,  //所属保险公司
                        "startNo": data.startNo, //起始号
                        "endNo": data.endNo,  //终止号
                        "sumCount": data.sumCount,  //数量单证数量
                        "curAgentCode": data.curAgentCode, // 当前持有人(登录人员编号)
                        "operator": data.operator//操作员(登录人员编号)
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "061"//接口编码
                    };
                    return _request;
                },
                /**
                 * 查询保险公司
                 */
                enquiryCompany: function (data) {
                    var _request = {
                        // data: {},
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "062"//接口编码
                    };
                    return _request;
                },
                /**
                 * 根据保险公司code查询单证名称
                 */
                enquiriesDocumentName: function (data) {
                    var _request = {
                        // data: {
                        "supplierCode": data.supplierCode
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "063"//接口编码
                    };
                    return _request;
                },
                /**
                 * 查询其所有的入库单证接口
                 */
                checkAllOfDocuments: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": data.curAgentCode,
                        "pageNo": data.pagination.pageIndex, //当前页
                        "pageSize": data.pagination.pageSize //每页显示
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "064"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证入库撤销
                 */
                documentsLibraryToCancel: function (data) {
                    var _request = {
                        // data: {
                        "serialNo": data.serialNo,// ——流水号
                        "state": data.state  //——入库状态
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "065"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证下发
                 */
                documentIssuedIBy: function (data) {
                    var _request = {
                        // data: {
                        "certifyCode": data.certifyCode || "",//单证编码
                        "startNo": data.startNo || "",  //起始号
                        "endNo": data.endNo || "",  //终止号
                        "sumCount": data.sumCount || '',  //数量单证数量
                        "curAgentCode": data.curAgentCode || "",  //当前持有人(登录人员编号)
                        "operator": data.operator || '',  //操作员(登录人员编号)
                        "TarAgentCode": data.TarAgentCode || "", //分发目标人(用户选择的)
                        "supplierCode": data.supplierCode || "" // 公司编码
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "049"//接口编码

                    };
                    return _request;
                },
                /**
                 * 单证下发页面初始化
                 */
                issuedInitialization: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode,  //(登录人员编号)
                        "pageNo": data.pagination.pageIndex, //当前页
                        "pageSize": data.pagination.pageSize //每页显示

                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "050"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证下发接收机构下拉框初始化
                 */
                receivingDropBoxInitial: function (data) {
                    var _request = {
                        // data: {
                        "comCode": $rootScope.user.agentCom || "",//登录人员的机构编码字段名称(incomCode)
                        "certifyCode": data || "",  // 用户选择的单证类型编号
                        "curAgentCode": $rootScope.user.agentCode  // 当前登录的用户id
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "051"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证下发根据用户选择接收机构后级联显示
                 */
                cascadingDisplay: function (data) {
                    var _request = {
                        // data: {
                        "comGrade": data.comGrade || "",  // 用户选择的机构的,级别
                        "inComCode": data.comCode || "",// 根据用户选择的接收机构的 comCode值
                        "agentCodeOrName": data.agentCodeOrName || "",
                        "curAgentCode": $rootScope.user.agentCode,//代理人id
                        "certifyCode": data.CertifyCode || "",  // 用户选择的单证类型编号
                        "curComCode": $rootScope.user.agentGroup,  // 当前登录的用户的Comcode
                        "curName": $rootScope.user.name
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "052"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证下发撤销
                 */
                documentsToCancel: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode,  //(登录人员编号)
                        "serialNo": data //单证流水号
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "053"//接口编码
                    };
                    return _request;
                },
                /**
                 * 我的单证
                 */
                searchDocuments: function (data) {
                    if (data && data.state.length > 0) {
                        switch (data.state) {
                            case "1":
                                data.state = "";
                                break;
                            case "3":
                                data.state = "00";
                                break;
                            case "2":
                                data.state = "01";
                                break;
                            case "5":
                                data.state = "02";
                                break;
                            case "6":
                                data.state = "05";
                                break;
                            case "4":
                                data.state = "06";
                                break;
                            case "7":
                                data.state = "03";
                                break;
                            case "8":
                                data.state = "04";
                                break;
                        }
                    }
                    var _request = {
                        // data: {
                        "startNo": data.myDocument.startNo || 0,//——起始号(Integer类型)
                        "endNo": data.myDocument.endNo || 0,  //——终止号(Integer类型)
                        "curAgentCode": $rootScope.user.agentCode,  //——用户的ID(String类型)
                        "pageNo": data.pagination.pageIndex, //当前页
                        "pageSize": data.pagination.pageSize, //每页显示
                        "supplierCode": data.supplierCode,
                        "state": data.state
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "066"//接口编码
                    };
                    return _request;
                },
                /**
                 * 查询待确认的单证
                 */
                unDeterminedOrder: function (data) {
                    var _request = {
                        // data: {
                        "agentCode": $rootScope.user.agentCode,  //当前登录的用户编号
                        "pageSize": data.pagination.pageSize,
                        "pageNo": data.pagination.pageIndex

                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "058"//接口编码
                    };
                    return _request;
                },
                /**
                 * 查询已确认上交的单证历史记录
                 */
                determinedOrder: function (data) {
                    var _request = {
                        // data: {
                        "agentCode": $rootScope.user.agentCode,  //当前登录的用户编号
                        "pageSize": data.pagination.pageSize,
                        "pageNo": data.pagination.pageIndex

                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "059"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证确认上交
                 */
                confirmation: function (data) {
                    var _request = {
                        // data: {
                        "serialNo": data  //单证下发流水号
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "060"//接口编码
                    };
                    return _request;
                },
                /**
                 * 待接收单证初始化
                 */
                documentInitialization: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "054"//接口编码
                    };
                    return _request;
                },
                /**
                 * 查询单证接收历史
                 */
                receiveHistory: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode,
                        "pageSize": data.pageSize,
                        "pageNo": data.pageIndex
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "055"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证接收
                 */
                documentsReceived: function (data) {
                    var _request = {
                        // data: {
                        seriaNo: data.serialNo
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "056"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证拒收
                 */
                documentsReject: function (data) {
                    var _request = {
                        // data: {
                        seriaNo: data.serialNo
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "057"//接口编码
                    };
                    return _request;
                },
                /**
                 * 我的单证 上交
                 */
                documentHandIn: function (data) {
                    var _request = {
                        // data: {
                        "serialNo": data.serialNo,   // -- 产品的流水号
                        "operator": $rootScope.user.agentCode,  // 当前用户
                        "tarAgentCode": data.TarAgentCode // 领用人
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "069"//接口编码
                    };
                    return _request;
                },
                /**
                 * 下单页面查询用户单证
                 */
                searchUserDocuments: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode, //当前用户登录的id
                        "riskCode": data.keyWords   // 用户选择的产品编号

                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "067"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证使用
                 */
                documentUse: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode, // 当前用户登录的id
                        "riskCode": data.productId,    // 用户选择的产品编号
                        "startNo": data.startNo, 		// 用户输入的或选择的号码
                        "endNo": data.endNo,
                        "sumCount": data.productNumber,				// 用户选择的保险期数
                        "contNo": data.contNo, 			// 订单编号
                        address: data.address,
                        flag: data.flag
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "070"//接口编码
                    };
                    return _request;
                },
                /**
                 * 获取单证
                 */
                getDocument: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode, // 当前用户登录的id
                        "orderId": data 			// 订单编号
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "072"//接口编码
                    };
                    return _request;
                },
                /**
                 * 单证校验
                 */
                documentMultiple: function (data) {
                    var _request = {
                        // data: {
                        "curAgentCode": $rootScope.user.agentCode, // 当前用户登录的id
                        "riskCode": data.productId || "",    // 用户选择的产品编号
                        "startNo": data.startNo || "", 		// 用户输入的或选择的号码
                        "endNo": data.endNo || "", 		// 用户输入的或选择的号码
                        "sumCount": data.productNumber || "",				// 用户选择的保险期数
                        address: data.address,
                        flag: data.flag

                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "071"//接口编码
                    };
                    return _request;
                },
                /**
                 * 确认上交附件查看
                 */
                getAccessoryImg: function (data) {
                    var _request = {
                        // data: {
                        "seriaNo": data  //单证下发流水号
                        // },
                        // "key": $rootScope.user.session,//session值 登陆后会返回
                        // "source": "pc",//请求来源
                        // "version": "1.0",//版本
                        // "userId": $rootScope.user.agentCode,//代理人id
                        // "apino": "060"//接口编码
                    };
                    return _request;
                }
            };
            //数据出参转为前端格式
            var importRules = {

                // 外部登陆
                loginOutside: function (data) {
                    return data.data;
                },
                //订单查询daochu
                toExport: function (data) {
                    return data.data
                },
                // 内部登陆
                loginInside: function (data) {
                    return data.data;
                },

                //获取产品列表
                getProducts: function (data) {
                    var _result = {
                        _products: []
                    };

                    if (data.data && data.data.productListInfos) {
                        for (var i = 0; i < data.data.productListInfos.length; i++) {
                            var _product = {
                                productId: data.data.productListInfos[i].productId || '',
                                productName: data.data.productListInfos[i].productName || '',
                                crowd: data.data.productListInfos[i].crowd || '',  //适应人群
                                insuranceCompany: data.data.productListInfos[i].supplierShortName || '',//保险公司名称
                                insuranceType: data.data.productListInfos[i].insuranceType || '',
                                insuranceCode: data.data.productListInfos[i].insuranceCode || '',
                                premium: data.data.productListInfos[i].initPrem || '',
                                insuranceDuration: data.data.productListInfos[i].insuranceDuration || '',
                                productImgUrl: data.data.productListInfos[i].productImgUrl || '', //产品图片
                                productShortName: data.data.productListInfos[i].productShortName || '',//产品简称
                                collnetStatus: data.data.productListInfos[i].collnetStatus || '', //是否收藏
                                productShortDesc: data.data.productListInfos[i].productShortDesc || '', //产品详情
                                supplierShortName: data.data.productListInfos[i].supplierShortName || ''//归宿保险公司

                            };

                            _result._products.push(_product);
                        }
                        _result.totalCount = data.data.totalCount || _result._products.length
                    }
                    return _result;
                },
                // 产品详情
                Product: function (data) {
                    var product = undefined;
                    if (data && data.Product) {
                        product = data.Product;
                    }
                    return product;
                },
                //获取产品筛选条件
                productsScreen: function (data) {
                    var _result = {
                        _fproTypes: [],
                        _finsComs: []
                    };
                    if (data.data && data.data.Filters) {
                        $.each(data.data.Filters, function (index, item) {
                            if (index == "fproTypes") {
                                _result._fproTypes = item;
                                _result._fproTypes.unshift({ptCode: '', ptName: '请选择险种'});
                            } else if (index == "finsComs") {
                                _result._finsComs = item;
                                _result._finsComs.unshift({insCode: '', insName: '请选择保险公司'});
                            }
                        });
                    }
                    return _result;
                },
                register: function (data) {
                    return data.data;
                },
                updateUser: function (data) {
                    return data.data;
                },
                sendCode: function (data) {
                    return data;
                },
                updatePassword: function (data) {
                    return data;
                },
                withdraw: function (data) {
                    return data.data;
                },
                getRanking: function (data) {
                    return data
                },
                getRankingFirstTen: function (data) {
                    return data.data
                },
                getRankingEndTen: function (data) {
                    return data.data
                },
                getRankingMoney: function (data) {
                    return data.data
                },
                addBankCard: function (data) {
                    return data.data;
                },
                findBankCard: function (data) {
                    return data.data;
                },
                deleteBankCard: function (data) {
                    return data.data;
                },
                updateCollection: function (data) {
                    return data;
                },
                Order: function (data) {
                    return data.data;
                },
                underwriter: function (data) {
                    return data.data;
                },
                policyNoDetails: function (data) {
                    return data.data
                },
                renew: function (data) {
                    return data;
                },
                Policy: function (data) {
                    return data;
                },
                orderInquiry: function (data) {
                    data = data.data.orderInfo;
                    var _result = {
                        orderInfo: [],
                        totalCount: 1
                    };
                    var _orderTotal = 0;
                    if (data.rspOrderEnquiries && data.rspOrderEnquiries.length) {
                        $.each(data.rspOrderEnquiries, function (index, order) {
                            var _orderInfo = {
                                order_id: order.order_id,
                                name: order.name,
                                product_name: order.product_name,
                                create_date: order.create_date,
                                effective_date: order.effective_date,
                                expiry_date: order.expiry_date,
                                address: order.address,
                                agentName: order.agentName,
                                app_status: order.app_status === 'ACPTINSD_SUCCESS' ? '已承保' : '未承保',
                                pay_status: order.pay_status === 'PAY_SUCCESS' ? '已支付' : '未支付',
                                Isrefund: order.isrefund == 'REFUNT_SUCCESS' ? '已退款' : order.isrefund == 'NOT_REFUNDABLE' ? '未退款' : order.isrefund == ' ' ? "" : '',
                                product_id: order.product_id
                            };
                            if (order.app_status === 'SURRENDER_SUCCESS' || order.app_status === 'SURRENDER_FAILURE') {
                                _orderInfo.app_status = order.app_status === 'SURRENDER_SUCCESS' ? '退保成功' : '退保失败';
                                Isrefund:order.isrefund == 'REFUNT_SUCCESS' ? '退款成功' : order.isrefund == 'NOT_REFUNDABLE' ? '未退款' : order.isrefund == ' ' ? "" : "",
                                    _orderInfo.pay_status = '';
                            }
                            _result.orderInfo.push(_orderInfo);
                        });
                        _result.totalCount = data.ordersCount;
                        _result.money = data.money;
                    }
                    return _result;
                },
                InsureTemplate: function (data) {
                    if (data.data && data.data.InsureMoulds && data.data.InsureMoulds.length > 0) {
                        $.each(data.data.InsureMoulds, function (index, insure) {
                            if (insure.mouldFactors && insure.mouldFactors.length > 0) {
                                $.each(insure.mouldFactors, function (index, mould) {
                                    if (mould.sortNumber) {
                                        mould.sortNumber = parseInt(mould.sortNumber);
                                    }
                                });
                            }
                            // 家财第一个
                            if (insure.mouldType === "C")
                                insure.insureMouldIndex = 0;
                            // 家财第二个
                            if (insure.mouldType === "A")
                                insure.insureMouldIndex = 1;
                            // 添加被保人索引，第三个
                            if (insure.mouldType === 'B') {
                                insure.insuredIndex = 0;
                                insure.insureMouldIndex = 2;
                            }
                            // 家财第四个
                            if (insure.mouldType === "D")
                                insure.insureMouldIndex = 3;

                        });
                    }
                    return data.data.InsureMoulds;
                },
                // 保险公司字典数据接口-职业类别
                InsureInfo: function (data) {
                    return data.data;
                },
                // 通过燃气编码 查询投保人信息
                insuredInformation: function (data) {
                    return data.data;
                },
                /**
                 * 生成订单
                 * @param data
                 * @returns {*}
                 */
                generateOrder: function (data) {
                    if (data.data && data.data.orderIds) {
                        return data.data.orderIds;
                    }
                    return data;
                },
                /**
                 * 查询顶级机构
                 * @param data
                 * @returns {{}}
                 */
                findFdcom: function (data) {
                    return data.data;
                },
                //待操作订单
                waitOperateOrders: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: 1
                    };
                    var _orderTotal = 0;
                    if (data.waitOperateOrderInfos && data.waitOperateOrderInfos.length) {
                        $.each(data.waitOperateOrderInfos, function (index, order) {
                            var _order = {
                                applicantAddress: order.applicantAddress || '', //地址
                                applicantName: order.applicantName || '',  //投保人姓名
                                createDate: order.createDate || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiryDate || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                orderTotal: order.orderTotal || '', //金额
                                phoneNumber: order.phoneNumber || '', //手机号
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                statusCode: order.statusCode || '', //状态编码
                                statusDesc: order.statusDesc || '', //状态描述
                                paymentMethod: order.paymentMethod === 'WECHAT' ? '微信' : order.paymentMethod === 'ALIPAY' ? '支付宝' : order.paymentMethod === 'CASH' ? '现金' : "",//支付状态
                                appStatus: order.appStatus === 'ACPTINSD_SUCCESS' ? '已承保' : '未承保',
                                premStatus: order.premStatus === 'TURNIN_ED' ? '已上缴' : '未上缴',
                                payStatus: order.payStatus === 'PAY_SUCCESS' ? '已支付' : '未支付'
                            };
                            if (order.appStatus === 'SURRENDER_SUCCESS' || order.appStatus === 'SURRENDER_FAILURE') {
                                _order.appStatus = order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : '退保失败';
                                _order.premStatus = '';
                                _order.payStatus = '';
                            }
                            if (order.orderTotal) {
                                _orderTotal = _orderTotal + parseFloat(order.orderTotal);
                            }
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.ordersCount;
                        _result.orderTotal = parseFloat(_orderTotal).toFixed(2);
                    }
                    return _result;
                },
                //当天订单
                waitDayOrders: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: data.ordersCount
                    };
                    var _orderTotal = 0;
                    if (data.waitOperateOrderInfos && data.waitOperateOrderInfos.length) {
                        $.each(data.waitOperateOrderInfos, function (index, order) {
                            var _order = {
                                applicantAddress: order.applicantAddress || '', //地址
                                applicantName: order.applicantName || '',  //投保人姓名
                                createDate: order.createDate || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiryDate || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                orderTotal: order.orderTotal || '', //金额
                                phoneNumber: order.phoneNumber || '', //手机号
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                statusCode: order.statusCode || '', //状态编码
                                statusDesc: order.statusDesc || '', //状态描述
                                paymentMethod: order.paymentMethod === 'WECHAT' ? '微信' : order.paymentMethod === 'ALIPAY' ? '支付宝' : order.paymentMethod === 'CASH' ? '现金' : "",//支付状态
                                appStatus: order.appStatus === 'ACPTINSD_SUCCESS' ? '已承保' : '未承保',
                                premStatus: order.premStatus === 'TURNIN_ED' ? '已上缴' : '未上缴',
                                payStatus: order.payStatus === 'PAY_SUCCESS' ? '已支付' : '未支付'
                            };
                            if (order.appStatus === 'SURRENDER_SUCCESS' || order.appStatus === 'SURRENDER_FAILURE') {
                                _order.appStatus = order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : '退保失败';
                                _order.premStatus = '';
                                _order.payStatus = '';
                            }
                            if (order.orderTotal) {
                                _orderTotal = _orderTotal + parseFloat(order.orderTotal);
                            }
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.ordersCount;
                        _result.orderTotal = parseFloat(_orderTotal).toFixed(2);
                    }
                    return _result;
                },

                //个人订单（全部订单）
                IntelligentOrders: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: 1
                    };
                    var _orderTotal = 0;
                    if (data.waitOperateOrderInfos && data.waitOperateOrderInfos.length) {
                        $.each(data.waitOperateOrderInfos, function (index, order) {
                            var _order = {
                                // appStatus: order.appStatus === 'ACPTINSD_SUCCESS' ? '已承保' : '未承保' || '',//承保状态
                                appStatus: order.appStatus === 'UNINSURED' ? '未承保' : order.appStatus === 'ACPTINSD_FAILURE' ? '未承保' : order.appStatus === 'ACPTINSD_SUCCESS' ? '已承保' : order.appStatus === 'SURRENDER_FAILURE' ? '退保失败' : order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : "",
                                payStatus: order.payStatus === 'PAY_SUCCESS' ? '已支付' : '未支付' || '',//支付状态
                                premStatus: order.premStatus === 'TURNIN_NY' ? '未上缴' : '已上缴' || '',//上缴状态
                                applicantAddress: order.applicantAddress || '', //地址
                                applicantName: order.applicantName || '',  //投保人姓名
                                createDate: order.createDate || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiryDate || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                orderTotal: order.orderTotal || '', //金额
                                phoneNumber: order.phoneNumber || '', //手机号
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                statusCode: order.statusCode || '', //状态编码
                                statusDesc: order.statusDesc || '', //状态描述
                                paymentMethod: order.paymentMethod === 'WECHAT' ? '微信' : order.paymentMethod === 'ALIPAY' ? '支付宝' : order.paymentMethod === 'CASH' ? '现金' : "",//支付状态
                                Isrefund: order.isrefund == 'REFUNT_SUCCESS' ? '已退款' : order.isrefund == 'NOT_REFUNDABLE' ? '未退款' : order.isrefund == ' ' ? "" : "",
                            };
                            if (order.orderTotal) {
                                _orderTotal = _orderTotal + parseFloat(order.orderTotal);
                            }
                            if (order.appStatus === 'SURRENDER_SUCCESS' || order.appStatus === 'SURRENDER_FAILURE') {
                                _order.appStatus = order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : '退保失败';
                                // _order.Isrefund = order.isrefund == 'REFUNT_SUCCESS' ? '已退款' : order.isrefund == 'NOT_REFUNDABLE' ? '未退款' : order.isrefund == ' ' ? "" : "",
                                _order.premStatus = '';
                                _order.payStatus = '';
                            }
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.ordersCount;
                        _result.orderTotal = parseFloat(_orderTotal).toFixed(2);
                    }
                    return _result;
                },
                //待续保订单
                waitRenewOrders: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: 1
                    };
                    if (data.waitOperateOrderInfos && data.waitOperateOrderInfos.length) {
                        $.each(data.waitOperateOrderInfos, function (index, order) {
                            var _order = {
                                applicantAddress: order.applicantAddress || '', //地址
                                applicantName: order.applicantName || '',  //投保人姓名
                                createDate: order.createDate || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiryDate || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                orderTotal: order.orderTotal || '', //金额
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                cycle: order.cycle || '' //周期
                            };
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.ordersCount;
                    } else if (data.orders && data.orders.length) { // 投保界面使用
                        $.each(data.orders, function (index, order) {
                            var _order = {
                                applicantAddress: order.policyHolder.address || '', //地址
                                applicantName: order.policyHolder.name || '',  //投保人姓名
                                createDate: order.create_date || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiry_date || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                orderTotal: order.totalOrder || '', //金额
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                cycle: order.cycle || '' //周期
                            };
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.ordersCount;
                    }
                    return _result;
                },
                //历史订单
                historyOrders: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: 1
                    };
                    var _orderTotal = 0;
                    if (data.waitOperateOrderInfos && data.waitOperateOrderInfos.length) {
                        $.each(data.waitOperateOrderInfos, function (index, order) {
                            var _order = {
                                applicantAddress: order.applicantAddress || '', //地址
                                applicantName: order.applicantName || '',  //投保人姓名
                                createDate: order.createDate || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiryDate || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderTotal: order.orderTotal || '', //金额
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                cycle: order.cycle || '',//周期
                                insured_data: order.insured_date || ''//投保日期
                            };
                            if (order.orderTotal) {
                                _orderTotal = _orderTotal + parseFloat(order.orderTotal);
                            }
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.ordersCount;
                        _result.orderTotal = parseFloat(_orderTotal).toFixed(2);
                    }
                    return _result;
                },
                /**
                 * 我的财富
                 * @param data
                 */
                wealth: function (data) {
                    return data.data
                },
                /**
                 * 提现记录
                 * @param data
                 */
                cashRecords: function (data) {
                    return data.data
                },
                /**
                 * 退保
                 * @param data
                 */
                signOrders: function (data) {
                    return data.data
                },
                /**
                 * 刷新用户信息
                 * @param data
                 */
                refresh: function (data) {
                    return data.data;
                },
                //智能分析-排名
                getStatisticsRank: function (data) {
                    var _result = {};
                    return _result;
                },
                //生成批次号
                createBatch: function (data) {
                    var data = data.data;
                    var _result = {
                        out_trade_no: data.payBatch || '',
                        total_fee: data.total || ''
                    };

                    return _result;
                },
                //批量承保
                createUnderwriters: function (data) {
                    return data;
                },
                /**
                 * 我的业绩
                 * @param data
                 * @returns {{}}
                 */
                achievement: function (data) {
                    return data.data;
                },
                /**
                 * 查询机构树
                 * @param data
                 */
                groupTree: function (data) {
                    return data.data;
                },
                //批量支付（上缴之前）
                createBatchUploadSign: function (data) {
                    var _response = {
                        totalPrice: data.data.totalPrice || 0
                    };
                    return _response;
                },
                //批量作废
                ordersVoid: function (data) {
                    return data;
                },
                //查询保单（智能分析）
                getPolicies: function (data) {
                    var _response = {};
                    if (data && data.data && data.data.ordPlolicys.length) {
                        _response.ordPlolicys = data.data.ordPlolicys;
                        _response.totalCount = data.data.totalCount || 0;
                        _response.orderTotal = 0;
                        $.each(data.data.ordPlolicys, function (index, item) {
                            _response.orderTotal += parseFloat(item.premium);
                        });
                        _response.orderTotal = parseFloat(_response.orderTotal).toFixed(2)
                    }
                    return _response;
                },
                //获取地区
                getArea: function (data) {
                    if (data && data.data.length) {
                        var _data = [];
                        $.each(data.data, function (index, area) {
                            area.codeValue = area.areaCode;
                            area.codeName = area.areaName;
                        });
                        return data.data;
                    } else {
                        return [];
                    }
                },
                // 删除图片身份证图片
                deletePhoto: function (data) {
                    return data.data;
                },
                //查询支付状态
                searchPayStatus: function (data) {
                    var _response = "PREPAY";
                    if (data && data.data) {
                        _response = data.data;
                    }
                    return _response;
                },
                //导出
                orderExport: function (data) {
                    return data.data;
                },
                //劳务协议
                laborAgreementSigned: function (data) {
                    return data.data;
                },
                //劳务协议内容查询
                agreementContent: function (data) {
                    return data.data;
                },
                //获取商业用户编码
                getBusinessUserType: function (data) {
                    var _response = [];
                    if (data && data.data) {
                        $.each(data.data, function (index, area) {
                            area.codeValue = area.bizTypeCode;
                            area.codeName = area.bizTypeName;
                        });
                        _response = data.data;
                    }
                    return _response;
                },
                //个人订单（全部订单）
                IntelligentAnalysisOrders: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: 1
                    };
                    var _orderTotal = 0;
                    if (data.waitOperateOrderInfos && data.waitOperateOrderInfos.length) {
                        $.each(data.waitOperateOrderInfos, function (index, order) {
                            var _order = {
                                // appStatus: order.appStatus === 'ACPTINSD_SUCCESS' ? '已承保' : '未承保' || '',//承保状态
                                appStatus: order.appStatus === 'UNINSURED' ? '未承保' : order.appStatus === 'ACPTINSD_FAILURE' ? '未承保' : order.appStatus === 'ACPTINSD_SUCCESS' ? '已承保' : order.appStatus === 'SURRENDER_FAILURE' ? '退保失败' : order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : "",
                                payStatus: order.payStatus === 'PAY_SUCCESS' ? '已支付' : order.payStatus === 'PAY_PROCESSE' ? '支付中' : order.payStatus === 'PREPAY' ? '未支付' : '',//支付状态
                                premStatus: order.premStatus === 'TURNIN_NY' ? '未上缴' : '已上缴' || '',//上缴状态
                                applicantAddress: order.applicantAddress || '', //地址
                                applicantName: order.applicantName || '',  //投保人姓名
                                createDate: order.createDate || '',  //下单时间
                                effectiveDate: order.effectiveDate || '', //起保日期
                                expiryDate: order.expiryDate || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.orderId || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                orderTotal: order.orderTotal || '', //金额
                                phoneNumber: order.phoneNumber || '', //手机号
                                policyNo: order.policyNo || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.productName || '',  //保险产品名称
                                statusCode: order.statusCode || '', //状态编码
                                statusDesc: order.statusDesc || '', //状态描述
                                paymentMethod: order.paymentMethod === 'WECHAT' ? '微信' : order.paymentMethod === 'ALIPAY' ? '支付宝' : order.paymentMethod === 'CASH' ? '现金' : "",//支付状态
                                Isrefund: order.isrefund == 'REFUNT_SUCCESS' ? '已退款' : order.isrefund == 'NOT_REFUNDABLE' ? '未退款' : order.isrefund == ' ' ? "" : ''
                            };

                            if (order.appStatus === 'SURRENDER_SUCCESS' || order.appStatus === 'SURRENDER_FAILURE') {
                                _order.appStatus = order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : '退保失败';
                                _order.Isrefund = order.isrefund == 'REFUNT_SUCCESS' ? '已退款' : order.isrefund == 'NOT_REFUNDABLE' ? '未退款' : order.isrefund == ' ' ? "" : '';
                                _order.premStatus = '';
                                _order.payStatus = '';
                            }
                            if (_order.Isrefund != '已退款') {
                                _result.orders.push(_order);
                            }
                            if (_order.orderTotal) {
                                _orderTotal = _orderTotal + parseFloat(_order.orderTotal);
                            }
                        });
                        _result.totalCount = data.ordersCount;
                        _result.orderTotal = parseFloat(_orderTotal).toFixed(2);
                    }
                    return _result;
                },
                questions: function (data) {
                    data = data.data;
                    if (data && data.questions && data.questions instanceof Array) {
                        var questions = [];
                        // 将题型和分数放到每道题中
                        $.each(data.questions, function (index, questionAll) {
                            $.each(questionAll.questions, function (index, question) {
                                // 题型
                                question.queTypeName = questionAll.queTypeName;
                                // 分数
                                question.quetypeDesc = questionAll.quetypeDesc;
                                questions.push(question);
                            });
                        });
                        return questions;
                    }
                    return null;
                },
                submitAnswers: function (data) {
                    data = data.data;
                    if (data && data.result) {
                        return data.result;
                    }
                    return null;
                },
                /**
                 * 是否投保查询
                 */
                housingInsuranceInquiries: function (data) {
                    data = data.data;
                    var _result = {
                        orders: [],
                        totalCount: 0
                    };
                    var _orderTotal = 0;
                    if (data.QueryOrder.orderByTremList && data.QueryOrder.orderByTremList.length) {
                        $.each(data.QueryOrder.orderByTremList, function (index, order) {
                            var _order = {
                                appStatus: order.app_status,
                                payStatus: order.payStatus === 'PAY_SUCCESS' ? '已支付' : '未支付' || '',//支付状态
                                premStatus: order.premStatus === 'TURNIN_NY' ? '未上缴' : '已上缴' || '',//上缴状态
                                applicantAddress: order.address || '', //地址
                                applicantName: order.name || '',  //投保人姓名
                                createDate: order.create_date || '',  //下单时间
                                effectiveDate: order.effective_date || '', //起保日期
                                expiryDate: order.expiry_date || '', //终保日期
                                memberId: order.memberId || "",  //操作人ID
                                orderId: order.order_id || '',  //订单编码
                                orderSource: order.orderSource == 'OFFLINE' ? 'OFFLINE' : 'ONLINE' || '', //订单来源
                                orderSourceName: order.orderSource == 'OFFLINE' ? '线下' : '线上' || '', //订单来源名称
                                premium: order.premium || '', //金额
                                phoneNumber: order.phoneNumber || '', //手机号
                                policyNo: order.policy_no || '', //保单号
                                productId: order.productId || '',  //保险产品编码
                                productName: order.product_name || '',  //保险产品名称
                                statusCode: order.statusCode || '', //状态编码
                                statusDesc: order.statusDesc || '', //状态描述
                                paymentMethod: order.paymentMethod === 'WECHAT' ? '微信' : order.paymentMethod === 'ALIPAY' ? '支付宝' : order.paymentMethod === 'CASH' ? '现金' : ""//支付状态
                            };

                            if (order.orderTotal) {
                                _orderTotal = _orderTotal + parseFloat(order.orderTotal);
                            }
                            if (order.appStatus === 'SURRENDER_SUCCESS' || order.appStatus === 'SURRENDER_FAILURE') {
                                _order.appStatus = order.appStatus === 'SURRENDER_SUCCESS' ? '退保成功' : '退保失败';
                                _order.premStatus = '';
                                _order.payStatus = '';
                            }
                            _result.orders.push(_order);
                        });
                        _result.totalCount = data.QueryOrder.countTotal;
                        _result.orderTotal = parseFloat(_orderTotal).toFixed(2);
                    }
                    return _result;
                },
                /**
                 * 筛选城市、小区、楼栋、单元级联数据
                 * @param data
                 * @returns {{}}
                 */
                searchCity: function (data) {
                    var _response = [];
                    if (data && data.data) {
                        _response = data.data;
                    }
                    return _response;
                },
                /**
                 * 综合筛选房产数据
                 * @param data
                 * @returns {{}}
                 */
                searchHouse: function (data) {
                    if (data && data.data && data.data.getAppnt) {
                        var _response = data.data.getAppnt;
                        if (_response.tel_number && (_response.tel_number.indexOf('86') == 0 || _response.tel_number.indexOf('+86') == 0)) {
                            if (_response.tel_number.indexOf('86') == 0) {
                                _response.tel_number = _response.tel_number.substring(2, _response.tel_number.length);
                            } else {
                                _response.tel_number = _response.tel_number.substring(3, _response.tel_number.length);
                            }
                        } else if (_response.houseinfos && _response.houseinfos instanceof Array) {
                            for (var i = 0; i < _response.houseinfos.length; i++) {
                                if (_response.houseinfos[i].tel_number) {
                                    if (_response.houseinfos[i].tel_number.indexOf('86') === 0) {
                                        _response.houseinfos[i].tel_number = _response.houseinfos[i].tel_number.substring(2, _response.houseinfos[i].tel_number.length);
                                    } else if (_response.houseinfos[i].tel_number.indexOf('+86') === 0) {
                                        _response.houseinfos[i].tel_number = _response.houseinfos[i].tel_number.substring(3, _response.houseinfos[i].tel_number.length);
                                    }
                                }
                            }
                        }
                        return _response;
                    } else {
                        return {};
                    }
                },
                /**
                 * 支付中状态改变
                 */
                paymentModification: function (data) {
                    return data;
                },
                /**
                 * 单证入库
                 */
                putInStorage: function (data) {
                    return data.data;
                },
                /**
                 * 查询保险公司
                 */
                enquiryCompany: function (data) {
                    return data.data;
                },
                /**
                 * 根据保险公司code查询单证名称
                 */
                enquiriesDocumentName: function (data) {
                    return data.data;
                },
                /**
                 * 查询其所有的入库单证接口
                 */
                checkAllOfDocuments: function (data) {
                    return data.data;
                },
                /**
                 * 单证入库撤销
                 */
                documentsLibraryToCancel: function (data) {
                    return data.data;
                },
                /**
                 * 单证下发
                 */
                documentIssuedIBy: function (data) {
                    return data.data;
                },
                /**
                 * 单证下发页面初始化
                 */
                issuedInitialization: function (data) {
                    if (data.data && data.data.certifyProvideReturns.length > 0) {
                        $.each(data.data.certifyProvideReturns, function (index, item) {
                            switch (item.state) {
                                case "-1":
                                    data.data.certifyProvideReturns[index].state = "无效";
                                    break;
                                case "00":
                                    data.data.certifyProvideReturns[index].state = "未使用";
                                    break;
                                case "01":
                                    data.data.certifyProvideReturns[index].state = "已使用";
                                    break;
                                case "02":
                                    data.data.certifyProvideReturns[index].state = "待接收确认";
                                    break;
                                case "03":
                                    data.data.certifyProvideReturns[index].state = "已作废";
                                    break;
                                case "04":
                                    data.data.certifyProvideReturns[index].state = "已遗失";
                                    break;
                                case "05":
                                    data.data.certifyProvideReturns[index].state = "待上交确认";
                                    break;
                                case "06":
                                    data.data.certifyProvideReturns[index].state = "已上交";
                                    break;
                                case "07":
                                    data.data.certifyProvideReturns[index].state = "已回销";
                                    break;
                            }
                            if (item.modifyDateTime) {
                                item.modifyDateTime = new Date(item.modifyDateTime).dateConversionTime();
                            }
                        });
                    }
                    return data.data;
                },
                /**
                 * 单证下发接收机构下拉框初始化
                 */
                receivingDropBoxInitial: function (data) {
                    return data.data;
                },
                /**
                 * 单证下发 根据用户选择接收机构后级联显示
                 */
                cascadingDisplay: function (data) {
                    return data.data;
                },
                /**
                 * 单证下发 撤销
                 */
                documentsToCancel: function (data) {
                    return data.data;
                },
                /**
                 * 我的单证
                 */
                searchDocuments: function (data) {
                    if (data.data.evenTables && data.data.evenTables.length > 0) {
                        $.each(data.data.evenTables, function (index, item) {
                            switch (item.state) {
                                case "-1":
                                    data.data.evenTables[index].state = "无效";
                                    break;
                                case "00":
                                    data.data.evenTables[index].state = "未使用";
                                    break;
                                case "01":
                                    data.data.evenTables[index].state = "已使用";
                                    break;
                                case "02":
                                    data.data.evenTables[index].state = "待接收确认";
                                    break;
                                case "03":
                                    data.data.evenTables[index].state = "已作废";
                                    break;
                                case "04":
                                    data.data.evenTables[index].state = "已遗失";
                                    break;
                                case "05":
                                    data.data.evenTables[index].state = "待上交确认";
                                    break;
                                case "06":
                                    data.data.evenTables[index].state = "已上交";
                                    break;
                                case "07":
                                    data.data.evenTables[index].state = "已回销";
                                    break;
                            }
                            if (item.modifyDateTime) {
                                item.modifyDateTime = new Date(item.modifyDateTime).dateConversionTime();
                            }
                        });
                    }
                    return data.data;
                },
                /**
                 * 查询待确认的单证
                 */
                unDeterminedOrder: function (data) {
                    if (data.data && data.data.certifyProvideReturns.length > 0) {
                        $.each(data.data.certifyProvideReturns, function (index, item) {
                            switch (item.state) {
                                case "-1":
                                    data.data.certifyProvideReturns[index].state = "无效";
                                    break;
                                case "00":
                                    data.data.certifyProvideReturns[index].state = "未使用";
                                    break;
                                case "01":
                                    data.data.certifyProvideReturns[index].state = "已使用";
                                    break;
                                case "02":
                                    data.data.certifyProvideReturns[index].state = "待接收确认";
                                    break;
                                case "03":
                                    data.data.certifyProvideReturns[index].state = "已作废";
                                    break;
                                case "04":
                                    data.data.certifyProvideReturns[index].state = "已遗失";
                                    break;
                                case "05":
                                    data.data.certifyProvideReturns[index].state = "待上交确认";
                                    break;
                                case "06":
                                    data.data.certifyProvideReturns[index].state = "已上交";
                                    break;
                                case "07":
                                    data.data.certifyProvideReturns[index].state = "已回销";
                                    break;
                            }
                            if (item.modifyDateTime) {
                                item.modifyDateTime = new Date(item.modifyDateTime).dateConversionTime();
                            }
                        });
                    }
                    return data.data;
                },
                /**
                 * 查询已确认上交的单证历史记录
                 */
                determinedOrder: function (data) {
                    if (data.data && data.data.certifyProvideReturns.length > 0) {
                        $.each(data.data.certifyProvideReturns, function (index, item) {
                            switch (item.state) {
                                case "-1":
                                    data.data.certifyProvideReturns[index].state = "无效";
                                    break;
                                case "00":
                                    data.data.certifyProvideReturns[index].state = "未使用";
                                    break;
                                case "01":
                                    data.data.certifyProvideReturns[index].state = "已使用";
                                    break;
                                case "02":
                                    data.data.certifyProvideReturns[index].state = "待接收确认";
                                    break;
                                case "03":
                                    data.data.certifyProvideReturns[index].state = "已作废";
                                    break;
                                case "04":
                                    data.data.certifyProvideReturns[index].state = "已遗失";
                                    break;
                                case "05":
                                    data.data.certifyProvideReturns[index].state = "待上交确认";
                                    break;
                                case "06":
                                    data.data.certifyProvideReturns[index].state = "已上交";
                                    break;
                                case "07":
                                    data.data.certifyProvideReturns[index].state = "已回销";
                                    break;
                            }
                            if (item.modifyDateTime) {
                                item.modifyDateTime = new Date(item.modifyDateTime).dateConversionTime();
                            }
                        });
                    }
                    return data.data;
                },
                /**
                 * 单证确认上交
                 */
                confirmation: function (data) {
                    return data.data;
                },
                /**
                 * 待接收单证初始化
                 */
                documentInitialization: function (data) {
                    return data.data;
                },
                /**
                 * 查询单证接收历史
                 */
                receiveHistory: function (data) {
                    return data.data;
                },
                /**
                 * 单证接收
                 */
                documentsReceived: function (data) {
                    return data.data;
                },
                /**
                 * 单证拒收
                 */
                documentsReject: function (data) {
                    return data.data;
                },
                /**
                 * 我的单证 遗失
                 */
                documentHandIn: function (data) {
                    return data.data;
                },
                /**
                 * 下单页面查询用户单证
                 */
                searchUserDocuments: function (data) {
                    return data.data;
                },
                /**
                 * 单证使用
                 */
                documentUse: function (data) {
                    return data.data;
                },
                /**
                 * 获取单证
                 */
                getDocument: function (data) {
                    return data.data;
                },
                /**
                 * 获取单证
                 */
                documentMultiple: function (data) {
                    return data.data;
                },
                /**
                 * 确认上交附件查看
                 */
                getAccessoryImg: function (data) {
                    return data.data;
                }
            };
            //加载层
            var loadingIndex = undefined, isError = undefined;
            return {
                imports: function (type, data) {
                    if (type == 'questions') {
                        if (data.data == '') {
                            return
                        }
                    }
                    if (loadingIndex) {
                        isError = false;
                        layer.close(loadingIndex);
                        loadingIndex = undefined;
                    }
                    if (hasException(data))
                        return "";
                    else {
                        if (!importRules[type])
                            return data;
                        else
                            return importRules[type](data.data);
                    }
                },
                exports: function (type, data) {
                    isError = true;
                    if (!loadingIndex)
                        loadingIndex = layer.load(1, {
                            shade: false,
                            time: 10 * 1000
                            // end: function () {
                            //     if (isError)
                            //         layer.msg('加载失败', {time: 3000, icon: 5});
                            // }
                        });
                    return exportRules[type](data);
                }
            }
        }])
})
;
