define(
    ['config'], function (config) {
        var backend = {
                // 服务器ip地址
                SERVER_IP: config.backend.ip,

                // SERVER_IP: 'http://192.168.17.2:8080/',
                // 接口
                REQUEST_METHOD: {
                    //批量支付查询
                    QUERY_PAY_STATUS: 'p1/queryPayBatchResult',
                    /**
                     * 代办资质首页
                     */
                    GET_DYNAMICS: 'standard/getStandards',
                    /**
                     * 证书培训
                     */
                    GET_CERTIFICATE_TRAINING_FIND: '/train/getTrains',
                    /**
                     * 证书培训详情
                     */
                    GET_CERTIFICATE_TRAINING: '/train/getTrain',
                    /**
                     *
                     * 获取地区信息
                     */
                    GET_REGIONAL_FIND:'areaAndClassification/getAreaAndClassifications',
                    /**
                     * 信息发布
                     */
                    RELEASE_INFO_LIST:'information/addInformation',
                    //资质动态首页
                    DYNAMIC_HOMEPAGE:'dynamic/getDynamics',
                    //获取信息列表
                    GET_INFORMATION_LIST:'information/getInformations',
                    //资质动态首页更多
                    DYNAMIC_HOMEPAGE_MORE:'dynamic/getDynamics',
                    //资质动态详情
                    DYNAMIC_HOMEPAGE_DETAILS:'dynamic/getDynamic'
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
                //获取信息列表
                GET_INFORMATION_LIST: {
                    TARGET: 'getInformationList',
                    URL: backend.SERVER_IP+ backend.REQUEST_METHOD.GET_INFORMATION_LIST,
                    METHOD: 'POST'
                },
                //资质动态首页
                DYNAMIC_HOMEPAGE: {
                    TARGET: 'dynamicHomepage',
                    URL: backend.SERVER_IP+ backend.REQUEST_METHOD.DYNAMIC_HOMEPAGE,
                    METHOD: 'POST'
                },
                //资质动态首页更多
                DYNAMIC_HOMEPAGE_MORE: {
                    TARGET: 'dynamicHomepageMore',
                    URL:backend.SERVER_IP+ backend.REQUEST_METHOD.DYNAMIC_HOMEPAGE_MORE,
                    METHOD: 'POST'
                },
                //资质动态详情
                DYNAMIC_HOMEPAGE_DETAILS: {
                    TARGET: 'dynamicHomepageDetails',
                    URL: backend.SERVER_IP+ backend.REQUEST_METHOD.DYNAMIC_HOMEPAGE_DETAILS,
                    METHOD: 'POST'
                },
                /**
                 * 代办资质
                 */
                GET_DYNAMICS_FIND: {
                    TARGET: 'getDynamicsFind',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_DYNAMICS,
                    METHOD: 'POST'
                },
                /**
                 * 证书培训
                 */
                GET_CERTIFICATE_TRAINING_FIND: {
                    TARGET: 'getCertificateTrainingFind',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_CERTIFICATE_TRAINING_FIND,
                    METHOD: 'POST'
                },
                /**
                 * 证书培训详情
                 */
                GET_CERTIFICATE_TRAINING: {
                    TARGET: 'getCertificateTraining',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_CERTIFICATE_TRAINING,
                    METHOD: 'POST'
                },
                /**
                 * 获取地区信息
                 */
                GET_REGIONAL_FIND: {
                    TARGET: 'getRegionalFind',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.GET_REGIONAL_FIND,
                    METHOD: 'POST'
                },
                /**
                 * 发布信息
                 */
                RELEASE_INFO_LIST:{
                    TARGET: 'releaseInfoList',
                    URL: backend.SERVER_IP + backend.REQUEST_METHOD.RELEASE_INFO_LIST,
                    METHOD: 'POST'
                }
            }
        }

    });
