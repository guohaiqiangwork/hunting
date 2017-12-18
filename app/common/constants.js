define(
    ['config'], function (config) {
        var backend = {
                // 服务器ip地址
                SERVER_IP: config.backend.ip,
                SERVER_LOGIN_IP: config.backend.loginIp,
                SERVER_ORDER_IP: config.backend.orderIp,
                SERVER_PAY_IP: config.backend.payIp,
                SERVER_DOCUMENT_IP: config.backend.documentIp,

                // SERVER_IP: 'http://192.168.17.2:8080/',
                // 接口
                REQUEST_METHOD: {
                    // 公司三级查询
                    COMPANIES: 'claimmanage/CompanyController/postService',
                    // 产品列表
                    PRODUCTS: 'product/base/pc/productList',
                    // 产品详情
                    PRODUCT: 'product/base/productInfo/',
                    // 外部登录
                    LOGIN_OUTSIDE: 'a1/login/outside',
                    // 内部员工登录
                    LOGIN_INSIDE: 'a1/login/inside',
                    // 注册
                    REGISTER: 'a1/register',
                    // 银行卡添加
                    ADD_BANK_CARD: 'a1/addbank',
                    // 查询银行卡
                    FIND_BANK_CARD: 'a1/findbank',
                    // 完善用户信息
                    UPDATE_USER: 'a1/approve',
                    // 发送验证码
                    SEND_CODE: '',
                    // 更改密码
                    UPDATE_PASSWORD: '',
                    // 佣金提现
                    WITH_DRAW: '',
                    // 排行榜
                    GET_RANKING: 'product/analysis/number',
                    // 删除银行卡
                    DELETE_BANK_CARD: 'a1/delbank',
                    // 更改收藏
                    UPDATE_COLLECTION: 'product/coll/pc/addcoll',
                    // 订单详情
                    ORDER: 'order/placeorder/ack',
                    // 保单详情
                    POLICY_NO_DETAILS: 'order/placeorder/selectByPolicyNo',
                    //获取考试成绩
                    GET_ACHIEVEMENT: 'answering/points?',
                    // 订单承保
                    UNDERWRITER: 'ins/request/cb?',
                    // 保单续保
                    RENEW: '',
                    // 保单详情
                    POLICY: 'order/placeorder/ack',
                    // 投保模板
                    INSURE_TEMPLATE: 'product/base/insureMoulds/',
                    // 保险公司字典 -- 基本
                    INSURE_BASIC: 'product/dictory/dic',
                    // 保险公司字典数据接口-职业类别
                    INSURE_OCCUPATION: 'product/dictory/occupation',
                    // 通过燃气编码 查询投保人信息
                    INSURE_INFORMATION: 'product/house/pc/getAppnt?',
                    //   产品列表筛选条件
                    PRODUCTS_SCREEN: 'product/prof/pc/filterList',
                    // 生成订单
                    GENERATE_ORDER: 'order/order/process',
                    //顶级机构查询
                    FIND_FDCOM: 'f1/findFdcom',
                    //待操作订单列表
                    // WAIT_OPERATE_ORDERS: 'order/queryorderinfo/unfinisheOrder',
                    WAIT_OPERATE_ORDERS: 'order/queryorderinfo/waitOperateOrder',
                    //当天订单
                    WAIT_Day_ORDERS: 'order/queryorderinfo/waitOperateOrder',
                    //待续保订单列表
                    WAIT_RENEW_ORDERS: 'order/queryorderinfo/followInsuranceOrderInfo',
                    //历史订单列表
                    // HISTORY_ORDERS: 'order/queryorderinfo/unfinisheOrder',
                    HISTORY_ORDERS: 'order/queryorderinfo/historyOrderInfo',
                    //订单查询（退保）
                    ORDER_INQUIRY: 'order/turnin/pc/orderInfo',
                    //    退保
                    SIGN_ORDERS: 'ins/request/tb',
                    // 用户财富
                    USER_WEALTH: 'a1/find/wealth',
                    // 提现记录
                    CASH_RECORDS: '',
                    // 刷新用户信息
                    USER_REFRESH: 'a1/find/agent',
                    //生成批次号
                    CREATE_BATCH: 'p1/paybatch',
                    // 根据燃气用户编号查询订单信息
                    GET_ORDERS_BY_GU: 'order/order/gasuser/orders/query?gasUserId=',
                    //生成二维码
                    CREATE_QRCODE: 'p1/dopay',
                    //批量承保
                    CREATE_UNDERWRITERS: 'ins/request/batch/cb',
                    // 我的业绩
                    USER_ACHIEVEMENT: 'order/queryorderinfo/myPerformance',
                    //上缴凭证
                    UPLOAD_SIGN: 'order/turnin/forauditing',
                    // 查询机构树
                    GROUP_TREE: 'f1/findFdcom/tree',
                    //现金批量支付（上缴之前）
                    CREATE_BATCH_UPLOAD_SIGN: 'order/turnin/batch/pay',
                    //查询保单
                    GET_POLICIES: 'ins/request/find/policy',
                    //获取地区
                    GET_AREA: 'product/dictory/area',
                    // 删除图片身份证图片
                    DELETE_PHOTO: 'a1/removePhoto',
                    //查询支付状态
                    SEARCH_PAY_STATUS: 'order/order/querypaystatus?orderId=',
                    // 导出
                    EXPORT: 'ins/export/batch/exportinfo',
                    //获取商业用户编码
                    GET_BUSINESS_USER_TYPE: 'product/dictory/bizusertype',
                    //批量作废
                    ORDERS_VOID: "order/order/batch/delete",
                    //    智能分析（未完成）
                    INTELLIGENT_ANALYSIS_ORDERS: 'order/queryorderinfo/unfinisheOrder',
                    //    智能分析（全部订单）
                    INTELLIGENT_ORDERS: 'order/queryorderinfo/unfinisheOrder',
                    //    劳务协议
                    LABOR_AGREEMENT_SIGNED: 'a1/agreement',
                    //    协议查询
                    AGREEMENT_CONTENT: 'a1/find/agent',
                    // 认证考试
                    QUESTIONS: 'answering/questions',
                    // 认证考试,获取考题
                    SUBMIT_ANSWERS: 'answering/submit',
                    //    是否投保房屋查询
                    HOUSING_INSURANCE_INQUIRIES: 'order/queryOrderByTrem/selectOrderByTrem',
                    //筛选城市、小区、楼栋、单元级联数据
                    SEARCH_CITY: 'product/house/pc/getAppnt/cascading',
                    // 综合筛选房产数据
                    SEARCH_HOUSE: 'product/house//pc/getAppnt/mx',
                    //    订单查询导出
                    TO_EXPORT: 'order/turnin/pc/exportOrderInfo',
                    //    支付状态修改
                    PAYMENT_MODIFICATION: 'order/order/status/update',
                    //    统计分析销售金额
                    GET_RANKING_MONEY: 'product/analysis/money',
                    //    获取排名前十
                    GET_RANKING_FIRST_TEN: 'product/analysis/ranking',
                    //获取排名后十
                    GET_RANKING_ENd_TEN: 'product/analysis/reciprocal',
                    //批量支付查询
                    QUERY_PAY_STATUS: 'p1/queryPayBatchResult'
                }
            }
        ;

        return {
            backend: backend,
            OPERATE_TYPE: {
                // 登录用户信息
                LOCAL_USER: "calla_user",
                // 登录账号密码
                LOCAL_ACCOUNT: "calla_account",
                // 导航
                LOCAL_NAVIGATION: "calla_navigation"
            },
            EVENTS: {
                BACKEND_EXCEPTION: "backendException",
                BACKEND_SUCCESS: "backendSuccess"
            },
            AUTH: {
                OK: 200,                //正常
                REDIRECT: 300,           //跳转
                UNAUTHORIZED: 401,      //没有登录
                FORBIDDEN: 403,         //没有权限
                SUCCESS: true,
                ERROR: false
            },
            REQUEST_TARGET: {
                //产品列表
                PRODUCTS: {
                    TARGET: 'getProducts',    //标识
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.PRODUCTS,        //请求路径
                    METHOD: 'POST'
                },
                // 产品详情
                PRODUCT: {
                    TARGET: 'Product',    //标识
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.PRODUCT,       //请求路径
                    METHOD: 'GET'
                },
                // 银行卡添加
                ADD_BANK_CARD: {
                    TARGET: 'addBankCard',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.ADD_BANK_CARD,
                    METHOD: 'POST'
                },
                // 银行卡查询
                FIND_BANK_CARD: {
                    TARGET: 'findBankCard',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.FIND_BANK_CARD,
                    METHOD: 'POST'
                },
                // 银行卡删除
                DELETE_BANK_CARD: {
                    TARGET: 'deleteBankCard',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.DELETE_BANK_CARD,
                    METHOD: 'POST'
                },
                // 注册
                REGISTER: {
                    TARGET: 'register',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.REGISTER,
                    METHOD: 'POST'
                },
                // 外部登录
                LOGIN_OUTSIDE: {
                    TARGET: 'loginOutside',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.LOGIN_OUTSIDE,
                    METHOD: 'POST'
                },
                // 内部登录
                LOGIN_INSIDE: {
                    TARGET: 'loginInside',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.LOGIN_INSIDE,
                    METHOD: 'POST'
                },
                //产品列表筛选条件
                PRODUCTS_SCREEN: {
                    TARGET: 'productsScreen',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.PRODUCTS_SCREEN,
                    METHOD: 'GET'
                },
                // 完善用户信息
                UPDATE_USER: {
                    TARGET: 'updateUser',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.UPDATE_USER,
                    METHOD: 'POST'
                },
                // 发送验证码
                SEND_CODE: {
                    TARGET: 'sendCode',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.SEND_CODE
                },
                //更改密码
                UPDATE_PASSWORD: {
                    TARGET: 'updatePassword',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.UPDATE_PASSWORD
                },
                //佣金提现
                WITH_DRAW: {
                    TARGET: 'withdraw',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.WITH_DRAW
                },
                // 更改收藏
                UPDATE_COLLECTION: {
                    TARGET: 'updateCollection',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.UPDATE_COLLECTION
                },
                // 订单详情
                ORDER: {
                    TARGET: 'Order',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.ORDER,
                    METHOD: 'GET'
                },
                // 保单详情
                POLICY_NO_DETAILS: {
                    TARGET: 'policyNoDetails',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.POLICY_NO_DETAILS,
                    METHOD: 'GET'
                },
                // 获取考试成绩
                GET_ACHIEVEMENT: {
                    TARGET: 'getAchievement',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.GET_ACHIEVEMENT,
                    METHOD: 'GET'
                },
                // 订单承保
                UNDERWRITER: {
                    TARGET: 'underwriter',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.UNDERWRITER,
                    METHOD: 'GET'
                },
                // 保单续保
                RENEW: {
                    TARGET: 'renew',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.RENEW
                },
                // 保单详情
                POLICY: {
                    TARGET: 'Policy',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.POLICY,
                    METHOD: 'GET'
                },
                // 投保模板
                INSURE_TEMPLATE: {
                    TARGET: 'InsureTemplate',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.INSURE_TEMPLATE,
                    METHOD: 'GET'
                },
                // 保险公司字典数据接口-基本
                INSURE_BASIC: {
                    TARGET: 'InsureInfo',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.INSURE_BASIC,
                    METHOD: 'POST'
                },
                // 保险公司字典数据接口-职业类别
                INSURE_OCCUPATION: {
                    TARGET: 'InsureInfo',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.INSURE_OCCUPATION,
                    METHOD: 'POST'
                },
                // 通过燃气编码 查询投保人信息
                INSURE_INFORMATION: {
                    TARGET: 'insuredInformation',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.INSURE_INFORMATION,
                    METHOD: 'GET'
                },
                //订单生成
                GENERATE_ORDER: {
                    TARGET: 'generateOrder',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.GENERATE_ORDER,
                    METHOD: 'POST'
                },
                // 顶级机构查询
                FIND_FDCOM: {
                    TARGET: 'findFdcom',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.FIND_FDCOM,
                    METHOD: 'POST'
                },
                //待操作订单
                WAIT_OPERATE_ORDERS: {
                    TARGET: 'waitOperateOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.WAIT_OPERATE_ORDERS,
                    METHOD: 'POST'
                },
                //当天订单
                WAIT_Day_ORDERS: {
                    TARGET: 'waitDayOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.WAIT_Day_ORDERS,
                    METHOD: 'POST'
                },
                // 待续保订单
                WAIT_RENEW_ORDERS: {
                    TARGET: 'waitRenewOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.WAIT_RENEW_ORDERS,
                    METHOD: 'POST'
                },
                // 智能分析（订单）
                HISTORY_ORDERS: {
                    TARGET: 'historyOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.HISTORY_ORDERS,
                    METHOD: 'POST'
                },
                // 订单查询（续保）
                ORDER_INQUIRY: {
                    TARGET: 'orderInquiry',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.ORDER_INQUIRY,
                    METHOD: 'POST'
                },
                // 退保
                SIGN_ORDERS: {
                    TARGET: 'signOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.SIGN_ORDERS,
                    METHOD: 'POST'
                },
                // 用户财富
                USER_WEALTH: {
                    TARGET: 'wealth',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.USER_WEALTH,
                    METHOD: 'POST'
                },
                // 提现记录
                CASH_RECORDS: {
                    TARGET: 'cashRecords',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.CASH_RECORDS,
                    METHOD: 'POST'
                },
                // 刷新用户信息
                USER_REFRESH: {
                    TARGET: 'refresh',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.USER_REFRESH,
                    METHOD: 'POST'
                },
                //生成批次号
                CREATE_BATCH: {
                    TARGET: 'createBatch',
                    URL: backend.SERVER_PAY_IP + backend.REQUEST_METHOD.CREATE_BATCH,
                    METHOD: 'POST'
                },
                // 根据燃气用户编号查询订单信息
                GET_ORDERS_BY_GU: {
                    TARGET: 'waitRenewOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.GET_ORDERS_BY_GU,
                    METHOD: 'GET'
                },
                //批量承保
                CREATE_UNDERWRITERS: {
                    TARGET: 'createUnderwriters',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.CREATE_UNDERWRITERS,
                    METHOD: 'POST'
                },
                // 我的业绩
                USER_ACHIEVEMENT: {
                    TARGET: 'achievement',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.USER_ACHIEVEMENT,
                    METHOD: 'POST'
                },
                // 查询机构树
                GROUP_TREE: {
                    TARGET: 'groupTree',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.GROUP_TREE,
                    METHOD: 'POST'
                },
                //现金批量支付(上缴之前)
                CREATE_BATCH_UPLOAD_SIGN: {
                    TARGET: 'createBatchUploadSign',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.CREATE_BATCH_UPLOAD_SIGN,
                    METHOD: 'POST'
                },
                //查询保单（智能分析）
                GET_POLICIES: {
                    TARGET: 'getPolicies',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.GET_POLICIES,
                    METHOD: 'POST'
                },
                // 获取地区
                GET_AREA: {
                    TARGET: 'getArea',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_AREA,
                    METHOD: 'POST'
                },
                // 删除图片身份证图片
                DELETE_PHOTO: {
                    TARGET: 'deletePhoto',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.DELETE_PHOTO,
                    METHOD: 'POST'
                },
                //查询支付状态
                SEARCH_PAY_STATUS: {
                    TARGET: 'searchPayStatus',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.SEARCH_PAY_STATUS,
                    METHOD: 'GET'
                },
                //导出
                EXPORT: {
                    TARGET: 'orderExport',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.EXPORT,
                    METHOD: 'POST'
                },
                //查询商业用户类型
                GET_BUSINESS_USER_TYPE: {
                    TARGET: 'getBusinessUserType',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_BUSINESS_USER_TYPE,
                    METHOD: 'POST'
                },
                //批量作废
                ORDERS_VOID: {
                    TARGET: 'ordersVoid',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.ORDERS_VOID,
                    METHOD: 'POST'
                },
                //智能分析（完成订单）
                INTELLIGENT_ANALYSIS_ORDERS: {
                    TARGET: 'IntelligentAnalysisOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.INTELLIGENT_ANALYSIS_ORDERS,
                    METHOD: 'POST'
                },
                //智能分析（未完成订单）
                INTELLIGENT_ORDERS: {
                    TARGET: 'IntelligentOrders',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.INTELLIGENT_ORDERS,
                    METHOD: 'POST'
                },
                // 劳务协议
                LABOR_AGREEMENT_SIGNED: {
                    TARGET: 'laborAgreementSigned',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.LABOR_AGREEMENT_SIGNED,
                    METHOD: 'POST'
                },
                // 劳务协议查询
                AGREEMENT_CONTENT: {
                    TARGET: 'agreementContent',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.AGREEMENT_CONTENT,
                    METHOD: 'POST'
                },
                // 认证考试,获取考题
                QUESTIONS: {
                    TARGET: 'questions',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.QUESTIONS,
                    METHOD: 'POST'
                },
                // 认证考试,获取考题
                SUBMIT_ANSWERS: {
                    TARGET: 'submitAnswers',
                    URL: backend.SERVER_LOGIN_IP + backend.REQUEST_METHOD.SUBMIT_ANSWERS,
                    METHOD: 'POST'
                },
                //房屋是否投保查询
                HOUSING_INSURANCE_INQUIRIES: {
                    TARGET: 'housingInsuranceInquiries',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.HOUSING_INSURANCE_INQUIRIES,
                    METHOD: 'POST'
                },
                //筛选城市、小区、楼栋、单元级联数据
                SEARCH_CITY: {
                    TARGET: 'searchCity',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.SEARCH_CITY,
                    METHOD: 'POST'
                },
                SEARCH_HOUSE: {
                    TARGET: 'searchHouse',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.SEARCH_HOUSE,
                    METHOD: 'POST'
                },
                //订单查询导出
                TO_EXPORT: {
                    TARGET: 'toExport',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.TO_EXPORT,
                    METHOD: 'POST'
                },
                //支付状态修改
                PAYMENT_MODIFICATION: {
                    TARGET: 'paymentModification',
                    URL: backend.SERVER_ORDER_IP + backend.REQUEST_METHOD.PAYMENT_MODIFICATION,
                    METHOD: 'POST'
                },
                // 图表排行榜(个人中心和智能分析)
                GET_RANKING: {
                    TARGET: 'getRanking',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_RANKING,
                    METHOD: 'POST'
                },
                // 图表排行榜获取金额(个人中心和智能分析)
                GET_RANKING_MONEY: {
                    TARGET: 'getRankingMoney',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_RANKING_MONEY,
                    METHOD: 'POST'
                },
                // 图表排行榜获取金额(个人中心和智能分析)
                GET_RANKING_FIRST_TEN: {
                    TARGET: 'getRankingFirstTen',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_RANKING_FIRST_TEN,
                    METHOD: 'POST'
                },
                // 图表排行榜获取金额(个人中心和智能分析)
                GET_RANKING_END_TEN: {
                    TARGET: 'getRankingEndTen',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_RANKING_ENd_TEN,
                    METHOD: 'POST'
                },
                //查询支付状态
                QUERY_PAY_STATUS: {
                    TARGET: 'queryPayStatus',
                    URL: backend.SERVER_PAY_IP + backend.REQUEST_METHOD.QUERY_PAY_STATUS,
                    METHOD: 'POST'
                },
                //单证入库
                PUT_IN_STORAGE: {
                    TARGET: 'putInStorage',
                    URL: backend.SERVER_DOCUMENT_IP+"storage/certifyStorage",
                    METHOD: 'POST'
                },
                //查询保险公司
                ENQUIRY_COMPANY: {
                    TARGET: 'enquiryCompany',
                    URL: backend.SERVER_DOCUMENT_IP+"storage/insuranceCompany",
                    METHOD: 'POST'
                },
                //根据保险公司code查询单证名称
                ENQUIRIES_DOCUMENT_NAME: {
                    TARGET: 'enquiriesDocumentName',
                    URL:backend.SERVER_DOCUMENT_IP+"storage/companyCode",
                    METHOD: 'POST'
                },
                //查询其所有的入库单证接口
                CHECK_ALL_OF_DOCUMENTS: {
                    TARGET: 'checkAllOfDocuments',
                    URL: backend.SERVER_DOCUMENT_IP+"storage/allDocuments",
                    METHOD: 'POST'
                },
                //单证入库撤销
                DOCUMENTS_LIBRARY_TO_CANCEL: {
                    TARGET: 'documentsLibraryToCancel',
                    URL:backend.SERVER_DOCUMENT_IP+"storage/deleteDocuments",
                    METHOD: 'POST'
                },
                //单证下发
                DOCUMENTS_ISSUED_BY: {
                    TARGET: 'documentIssuedIBy',
                    URL: backend.SERVER_DOCUMENT_IP+"provide/certifyProvide",
                    METHOD: 'POST'
                },
                //单证下发 页面初始化
                ISSUED_INITIALIZATION: {
                    TARGET: 'issuedInitialization',
                    URL: backend.SERVER_DOCUMENT_IP+"provide/certifyProvideList",
                    METHOD: 'POST'
                },
                //单证下发 接收机构下拉框初始化
                RECEIVING_DROP_BOX_INITIAL: {
                    TARGET: 'receivingDropBoxInitial',
                    URL: backend.SERVER_DOCUMENT_IP+"provide/fdCom",
                    METHOD: 'POST'
                },
                //单证下发 根据用户选择接收机构后级联显示
                CASCADING_DISPLAY: {
                    TARGET: 'cascadingDisplay',
                    URL: backend.SERVER_DOCUMENT_IP+"provide/agent",
                    METHOD: 'POST'
                },
                //单证下发 撤销
                DOCUMENTS_TO_CANCEL: {
                    TARGET: 'documentsToCancel',
                    URL: backend.SERVER_DOCUMENT_IP+"provide/certifyProvideReturn",
                    METHOD: 'POST'
                },
                //根据用户id和起始终止号查询我的单证
                SEARCH_DOCUMENTS: {
                    TARGET: 'searchDocuments',
                    URL: backend.SERVER_DOCUMENT_IP+"documents/getDocuments",
                    METHOD: 'POST'
                },
                //查询待确认的单证
                UN_DETERMINED_ORDER: {
                    TARGET: 'unDeterminedOrder',
                    URL: backend.SERVER_DOCUMENT_IP+"agree/immediatelyAgreeList",
                    METHOD: 'POST'
                },
                //查询已确认上交的单证历史记录
                DETERMINED_ORDER: {
                    TARGET: 'determinedOrder',
                    URL: backend.SERVER_DOCUMENT_IP+"agree/immediatelyAgreeTracking",
                    METHOD: 'POST'
                },
                //单证确认上交
                CONFIRMATION: {
                    TARGET: 'confirmation',
                    URL: backend.SERVER_DOCUMENT_IP+"agree/immediatelyAgree",
                    METHOD: 'POST'
                },
                //待接收单证初始化
                DOCUMENT_INITIALIZATION: {
                    TARGET: 'documentInitialization',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/receiveList",
                    METHOD: 'POST'
                },
                //查询单证接收历史
                RECEIVE_HISTORY: {
                    TARGET: 'receiveHistory',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/receiveTrackList",
                    METHOD: 'POST'
                },
                //单证接收
                DOCUMENTS_RECEIVED: {
                    TARGET: 'documentsReceived',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/receive",
                    METHOD: 'POST'
                },
                //单证拒收
                DOCUMENTS_REJECT: {
                    TARGET: 'documentsReject',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/rejectReceive",
                    METHOD: 'POST'
                },
                //我的单证  遗失
                DOCUMENTS_ARE_LOST: {
                    TARGET: 'documentsAreLost',
                    URL: backend.SERVER_DOCUMENT_IP+"documents/turninBatch",
                    METHOD: 'POST'
                },
                //下单页面查询用户单证
                SEARCH_USER_DOCUMENTS: {
                    TARGET: 'searchUserDocuments',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/userCertify",
                    METHOD: 'POST'
                },
                //单证使用
                DOCUMENT_USE: {
                    TARGET: 'documentUse',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/certifyUse",
                    METHOD: 'POST'
                },
                //单证上交
                DOCUMENT_HAND_IN: {
                    TARGET: 'documentHandIn',
                    URL: backend.SERVER_DOCUMENT_IP+"documents/upperHand",
                    METHOD: 'POST'
                },
                //获取单证
                GET_DOCUMENT: {
                    TARGET: 'getDocument',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/userCertifyByOrderId",
                    METHOD: 'POST'
                },
                //单证使用效验
                DOCUMENT_MULTIPLE: {
                    TARGET: 'documentMultiple',
                    URL: backend.SERVER_DOCUMENT_IP+"receive/checkCertify",
                    METHOD: 'POST'
                },
                //确认上交附件查看
                GET_ACCESSORU_IMG: {
                    TARGET: 'getAccessoryImg',
                    URL: backend.SERVER_DOCUMENT_IP+"agree/getAccessoryImg",
                    METHOD: 'POST'
                }
            }
        }

    });
