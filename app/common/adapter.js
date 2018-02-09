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
                /**
                 * 获取信息列表
                 */
                getInformationList: function (data) {
                    var _request = {
                        "data":{
                            "type":data.keyWords.type=="个人挂证"?1:data.keyWords.type=="企业聘证"?2:3,
                            "idClassification":data.keyWords.idClassification,
                            "idArea":data.keyWords.idArea
                        },
                        "pagination":{
                            "pageIndex":1,
                            "pageSize":5
                        }
                    };
                    return _request;
                },
                /**
                 * 资质动态首页
                 */
                dynamicHomepage: function (data) {
                    var _request = {
                        "data": {},
                        "pagination": {
                            "pageIndex": 1,
                            "pageSize": 5
                        }
                    };
                    return _request;
                },
                /**
                 * 资质动态首页更多
                 */
                dynamicHomepageMore: function (data) {
                    var _request = {
                        "data": {
                            "dynamicAddress": data.keyWords.dynamicAddress
                        },
                        "pagination": {
                            "pageIndex": 1,
                            "pageSize": 5
                        }
                    };
                    return _request;
                },
                /**
                 * 资质动态详情
                 */
                dynamicHomepageDetails: function (data) {
                    var _request = {
                        "idDynamic": data.keyWords.idDynamic
                    };
                    return _request;
                },

                /**
                 * 代办资质
                 * @param data
                 * @returns {{data: {}, pagination: {pageIndex: number, pageSize: number}}}
                 */
                getDynamicsFind: function (data) {
                    var _request = {
                        "data": {
                            type: data.keyWords.type
                        },
                        "pagination": {
                            "pageIndex": data.pagination.pageIndex,
                            "pageSize": data.pagination.pageSize
                        }
                    };
                    return _request;
                },
                /**
                 * 证书培训
                 * @param data
                 * @returns {{data: {type}, pagination: {pageIndex: number|*, pageSize: number|*}}}
                 */
                getCertificateTrainingFind: function (data) {
                    var _request = {
                        "data": {
                            type: data.keyWords.type
                        },
                        "pagination": {
                            "pageIndex": data.pagination.pageIndex,
                            "pageSize": data.pagination.pageSize
                        }
                    };
                    return _request;
                },
                /**
                 * 获取地区信息
                 * @param data
                 * @returns {{}}
                 */
                getRegionalFind: function (data) {
                    var _request = {};
                    return _request;
                },
                /**
                 * 信息发布
                 * @param data
                 * @returns {{}}
                 */
                releaseInfoList: function (data) {
                    var _request = {
                        "title": data.title,
                        "type": data.type,// 类型：1个人挂靠，2企业寻证，3全球招聘
                        "QQ": data.QQ, // QQ
                        "WX": data.WX, // 微信
                        "name": data.name, // 名字
                        "address": data.address, // 地址
                        "sex": data.sex, // 性别
                        "phone": data.phone,
                        "mailbox": data.mailbox,
                        "registrationType": data.registrationType, // 注册类型
                        "company": data.company, // 公司名称
                        "certificateCode": data.certificateCode, // 证书类型编码
                        "idClassification": data.idClassification, // 职业分类:选择小类就传小类code，若没选择小类就传大类code
                        "idArea": data.idArea // 地区分类：选择市就传市code，若没选择市就传省code
                    };
                    return _request;
                }


            };
            //数据出参转为前端格式
            var importRules = {
                /**
                 * 资质动态首页
                 */
                dynamicHomepage: function (data) {
                    var dynamics = {};
                    $.each(data.data, function (index, item) {
                        if (!dynamics[item.dynamicAddress]) {
                            dynamics[item.dynamicAddress] = [];
                        }
                        dynamics[item.dynamicAddress].push(item);
                    });
                    return dynamics;
                },
                /**
                 * 获取信息列表
                 */
                getInformationList: function (data) {
                    return data.data;
                },
                /**
                 * 资质动态首页更多
                 */
                dynamicHomepageMore: function (data) {
                    return data.data;
                },
                /**
                 * 资质动态详情
                 */
                dynamicHomepageDetails: function (data) {
                    return data.data;
                },
                /**
                 * 代办资质
                 * @param data
                 */
                getDynamicsFind: function (data) {
                    var dataList = data.data;
                    var _result = {
                        ordersZC: [],
                        ordersZY: [],
                        ordersLW: [],
                        ordersAQ: [],
                        ordersFD: [],
                        ordersYL: [],
                        ordersSJ: [],
                        ordersQT: []
                    };
                    angular.forEach(dataList, function (data, index, array) {
                        if (dataList[index].type == '1') {
                            _result.ordersZC.push(data)
                        }
                        if (dataList[index].type == '2') {
                            _result.ordersZY.push(data)
                        }
                        if (dataList[index].type == '3') {
                            _result.ordersLW.push(data)
                        }
                        if (dataList[index].type == '4') {
                            _result.ordersAQ.push(data)
                        }
                        if (dataList[index].type == '5') {
                            _result.ordersFD.push(data)
                        }
                        if (dataList[index].type == '6') {
                            _result.ordersYL.push(data)
                        }
                        if (dataList[index].type == '7') {
                            _result.ordersSJ.push(data)
                        }
                        if (dataList[index].type == '8') {
                            _result.ordersQT.push(data)
                        }
                    });
                    console.log(_result);
                    return _result;

                },

                /**
                 * 证书培训
                 * @param data
                 * @returns {{qualificationsBS: Array, qualificationsBJ: Array, qualificationsZR: Array, qualificationsCX: Array}}
                 */
                getCertificateTrainingFind: function (data) {
                    var qualificationsList = data.data;
                    var _result = {
                        qualificationsBS: [],
                        qualificationsBJ: [],
                        qualificationsZR: [],
                        qualificationsCX: []
                    };
                    angular.forEach(qualificationsList, function (data, index) {
                        if (qualificationsList[index].type == '1') {
                            _result.qualificationsBS.push(data)
                        }
                        if (qualificationsList[index].type == '2') {
                            _result.qualificationsBJ.push(data)
                        }
                        if (qualificationsList[index].type == '3') {
                            _result.qualificationsZR.push(data)
                        }
                        if (qualificationsList[index].type == '4') {
                            _result.qualificationsCX.push(data)
                        }

                    });
                    return _result;

                },
                /**
                 * 获取地区信息
                 * @param data
                 */
                getRegionalFind: function (data) {
                    return data.data;
                },
                /**
                 * 信息发布
                 * @param data
                 */
                releaseInfoList: function (data) {
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
