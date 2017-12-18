define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.util'
], function (config, constants, adapter) {
    angular.module('neptune.document', [
        'neptune.adapter',
        'mc.util'
    ])
        .factory('$$document', ['$q', '$http', '$timeout', '$$adapter', '$rootScope',
            function ($q, $http, $timeout, $$adapter, $rootScope) {
                var Document = function (data) {
                    if (data && typeof data === 'object')
                        $.extend(this, data);
                };


                Document.prototype.share = function (options) {

                };
                return {
                    //单证入库
                    putInStorage:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.PUT_IN_STORAGE.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.PUT_IN_STORAGE.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.PUT_IN_STORAGE.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.PUT_IN_STORAGE.TARGET, data);
                                    if (!data) {

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
                    //查询保险公司
                    enquiryCompany:function (options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.ENQUIRY_COMPANY.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.ENQUIRY_COMPANY.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.ENQUIRY_COMPANY.TARGET);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.ENQUIRY_COMPANY.TARGET, data);
                                    if (!data) {

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
                    //根据保险公司code查询单证名称
                    enquiriesDocumentName:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.ENQUIRIES_DOCUMENT_NAME.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.ENQUIRIES_DOCUMENT_NAME.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.ENQUIRIES_DOCUMENT_NAME.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.ENQUIRIES_DOCUMENT_NAME.TARGET, data);
                                    if (!data) {

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
                    //查询其所有的入库单证接口
                    checkAllOfDocuments:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.CHECK_ALL_OF_DOCUMENTS.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.CHECK_ALL_OF_DOCUMENTS.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CHECK_ALL_OF_DOCUMENTS.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.CHECK_ALL_OF_DOCUMENTS.TARGET, data);
                                    if (!data) {

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
                    //单证撤销
                    documentsLibraryToCancel:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENTS_LIBRARY_TO_CANCEL.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENTS_LIBRARY_TO_CANCEL.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENTS_LIBRARY_TO_CANCEL.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENTS_LIBRARY_TO_CANCEL.TARGET, data);
                                    if (!data) {

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
                    //单证下发
                    documentIssuedIBy:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENTS_ISSUED_BY.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENTS_ISSUED_BY.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENTS_ISSUED_BY.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENTS_ISSUED_BY.TARGET, data);
                                    if (!data) {

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
                    //单证下发 接收机构下拉框初始化
                    receivingDropBoxInitial:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.RECEIVING_DROP_BOX_INITIAL.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.RECEIVING_DROP_BOX_INITIAL.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.RECEIVING_DROP_BOX_INITIAL.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.RECEIVING_DROP_BOX_INITIAL.TARGET, data);
                                    if (!data) {

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
                    //单证下发 根据用户选择接收机构后级联显示
                    cascadingDisplay:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.CASCADING_DISPLAY.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.CASCADING_DISPLAY.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CASCADING_DISPLAY.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.CASCADING_DISPLAY.TARGET, data);
                                    if (!data) {

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
                    //单证下发 撤销、遗失
                    documentsToCancel:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENTS_TO_CANCEL.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENTS_TO_CANCEL.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENTS_TO_CANCEL.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENTS_TO_CANCEL.TARGET, data);
                                    if (!data) {

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
                    //我的单证
                    searchDocuments:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.SEARCH_DOCUMENTS.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.SEARCH_DOCUMENTS.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.SEARCH_DOCUMENTS.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.SEARCH_DOCUMENTS.TARGET, data);
                                    if (!data) {

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
                    //单证确认上交
                    confirmation:function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.CONFIRMATION.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.CONFIRMATION.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.CONFIRMATION.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.CONFIRMATION.TARGET, data);
                                    if (!data) {

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
                    //待接收单证初始化
                    documentInitialization:function (options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENT_INITIALIZATION.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENT_INITIALIZATION.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENT_INITIALIZATION.TARGET);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENT_INITIALIZATION.TARGET, data);
                                    if (!data) {

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
                    //查询单证接收历史
                    receiveHistory:function (keyWords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.RECEIVE_HISTORY.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.RECEIVE_HISTORY.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.RECEIVE_HISTORY.TARGET,keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.RECEIVE_HISTORY.TARGET, data);
                                    if (!data) {

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
                    //单证接收
                    documentsReceived:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENTS_RECEIVED.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENTS_RECEIVED.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENTS_RECEIVED.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENTS_RECEIVED.TARGET, data);
                                    if (!data) {

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
                    //单证拒收
                    documentsReject:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENTS_REJECT.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENTS_REJECT.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENTS_REJECT.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENTS_REJECT.TARGET, data);
                                    if (!data) {

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
                    //我的单证 上交
                    documentHandIn:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENT_HAND_IN.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENT_HAND_IN.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENT_HAND_IN.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENT_HAND_IN.TARGET, data);
                                    if (!data) {

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
                     * 单证使用
                     * @param keywords
                     * @param options
                     */
                    documentUse:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENT_USE.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENT_USE.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENT_USE.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENT_USE.TARGET, data);
                                    if (!data) {

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
                     * 获取单证
                     * @param keywords
                     * @param options
                     */
                    getDocument:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_DOCUMENT.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_DOCUMENT.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.GET_DOCUMENT.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_DOCUMENT.TARGET, data);
                                    if (!data) {

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
                     * 单证使用效验
                     * @param keywords
                     * @param options
                     */
                    documentMultiple:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.DOCUMENT_MULTIPLE.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.DOCUMENT_MULTIPLE.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.DOCUMENT_MULTIPLE.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.DOCUMENT_MULTIPLE.TARGET, data);
                                    if (!data) {

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
                     * 确认上交附件查看
                     * @param keywords
                     * @param options
                     */
                    getAccessoryImg:function (keywords,options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_ACCESSORU_IMG.METHOD;
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_ACCESSORU_IMG.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.GET_ACCESSORU_IMG.TARGET,keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_ACCESSORU_IMG.TARGET, data);
                                    if (!data) {

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
                };
            }]);
});

