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
                //单证使用效验
                DOCUMENT_MULTIPLE: {
                    TARGET: 'documentMultiple',
                    URL: backend.SERVER_DOCUMENT_IP + "receive/checkCertify",
                    METHOD: 'POST'
                },
                //资质动态首页
                DYNAMIC_HOMEPAGE: {
                    TARGET: 'dynamicHomepage',
                    URL: '10.2.66.249:8181/hunting/dynamic/getDynamics',
                    METHOD: 'POST'
                },
                //资质动态首页更多
                DYNAMIC_HOMEPAGE_MORE: {
                    TARGET: 'dynamicHomepageMore',
                    URL: '10.2.66.249:8181/hunting/dynamic/getDynamics',
                    METHOD: 'POST'
                },
                //资质动态某个更多
                DYNAMIC_HOMEPAGE_A_MORE: {
                    TARGET: 'dynamicHomepageAMore',
                    URL: '10.2.66.249:8181/hunting/dynamic/getDynamics',
                    METHOD: 'POST'
                },
                //资质动态详情
                DYNAMIC_HOMEPAGE_DETAILS: {
                    TARGET: 'dynamicHomepageDetails',
                    URL: '10.2.66.249:8181/hunting/dynamic/getDynamic',
                    METHOD: 'POST'
                }
            }
        }

    });
