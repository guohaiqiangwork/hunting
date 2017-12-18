define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.util'
], function (config, constants, adapter) {
    angular.module('neptune.product', [
        'neptune.adapter',
        'mc.util'
    ])
        .factory('$$product', ['$q', '$http', '$timeout', '$$adapter', '$rootScope',
            function ($q, $http, $timeout, $$adapter, $rootScope) {
                var Product = function (data) {
                    if (data && typeof data === 'object')
                        $.extend(this, data);
                };

                var _product = {};
                // 燃气编号请求缓存
                var appntCache = [];
                /**
                 * 产品分享
                 * @param options
                 */
                Product.prototype.share = function (options) {

                };
                return {

                    Product: function (keyWords, options) {
                        if (!keyWords.productId) {
                            if (options && options.onError && typeof(options.onError == 'function')) {
                                options.onError('不符合API规范');
                            }
                            return false;
                        }
                        keyWords.categoryId = keyWords.categoryId ? keyWords.categoryId : 'default';
                        if (keyWords.productId != _product.id) {

                            // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.PRODUCT.TARGET, {id: productId});
                            config.httpPackage.url = constants.REQUEST_TARGET.PRODUCT.URL + keyWords.productId + '/' + keyWords.categoryId + '?version=1.0';
                            config.httpPackage.method = constants.REQUEST_TARGET.PRODUCT.METHOD;
                            var success = function (data) {
                                data = $$adapter.imports(constants.REQUEST_TARGET.PRODUCT.TARGET, data);
                                _product = new Product(data);

                                if (options && options.onSuccess && typeof(options.onSuccess == 'function')) {
                                    options.onSuccess(_product)
                                }
                            };
                            var error = function () {
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError();
                                }
                            };
                            if (config.method == 'local') {
                                $http(config.httpPackage)
                                    .success(function (data) {
                                        success(data);
                                    })
                                    .error(function () {
                                        error();
                                    });
                            } else {
                                $http(config.httpPackage)
                                    .success(function (data) {
                                        success(data);
                                    })
                                    .error(function () {
                                        error();
                                    });
                            }

                        } else {
                            if (options && options.onSuccess && typeof(options.onSuccess == 'function')) {
                                options.onSuccess(_product)
                            }
                        }
                    },
                    /**
                     * 投保模板
                     * @constructor
                     */
                    InsureTemplate: function (productId, memberId, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.INSURE_TEMPLATE.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.INSURE_TEMPLATE.URL + productId + "/" + memberId + '?version=1.0';
                        // 后端入参适配
                        // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.UPDATE_COLLECTION.TARGET, this);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.INSURE_TEMPLATE.TARGET, data);
                                    if (!data) {
                                        // options.onError("投保模板,适配器验证不通过");
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
                     * 保险公司模板字典
                     * @param keyWords
                     * @param options
                     * @constructor
                     */
                    InsureInfo: function (keyWords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET[keyWords.type].METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET[keyWords.type].URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET[keyWords.type].TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET[keyWords.type].TARGET, data);
                                    if (!data) {
                                        // options.onError("保险公司字典,适配器验证不通过,没数据");
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
                     * 更改收藏
                     * @param keyWords
                     * @param options
                     */

                    updateCollection: function (keyWords, options) {
                        config.httpPackage.method = 'POST';
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.UPDATE_COLLECTION.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.UPDATE_COLLECTION.TARGET, keyWords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.UPDATE_COLLECTION.TARGET, data);
                                    if (!data) {
                                        // options.onError("更改收藏,适配器验证不通过");
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
                     * 获取投保人信息
                     * @param gasId 燃气编号
                     * @param partner 业务合作伙伴
                     * @param options
                     */
                    getAppnt: function (gasId, partner, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.INSURE_INFORMATION.METHOD;
                        gasId = gasId || "";
                        partner = partner || "";
                        // 请求地址
                        config.httpPackage.url = constants.REQUEST_TARGET.INSURE_INFORMATION.URL + 'gasCode=' + gasId + '&partner=' + partner + '&version=1.0';
                        // 后端入参适配
                        // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.UPDATE_COLLECTION.TARGET, keyWords);
                        // 将接口添加到缓存中
                        appntCache.push({url: config.httpPackage.url});
                        $http(config.httpPackage).then(
                            function (data) {
                                // 循环添加数据
                                for (var i = 0; i < appntCache.length; i++) {
                                    if (data.config.url && data.config.url.indexOf(appntCache[i].url)!=-1) {
                                        appntCache[i].data = data;
                                        break;
                                    }
                                }
                                // 循环向控制器放数据
                                for (var i = 0, isDelete = false; i < appntCache.length; isDelete ? i : i++) {
                                    isDelete = false;
                                    // 不存在则终止循环
                                    if (!appntCache[i].data) {
                                        break;
                                    }
                                    // 是否第一个
                                    if (appntCache[i].data && i === 0) {
                                        isDelete = true;
                                        if (options || options.onSuccess) {
                                            //后端回参适配
                                            appntCache[i].data = $$adapter.imports(constants.REQUEST_TARGET.INSURE_INFORMATION.TARGET, appntCache[i].data);
                                            if (!data) {
                                                options.onError();
                                            } else {
                                                options.onSuccess(appntCache[i].data);
                                            }
                                        }
                                        appntCache.splice(i, 1);
                                    }
                                }
                            },
                            function (error) {
                                // 删除对应缓存
                                for (var i = 0; i < appntCache.length; i++) {
                                    if (appntCache[i].url === error.config.url) {
                                        appntCache.splice(i, 1);
                                        break;
                                    }
                                }
                                if (options && options.onError && typeof(options.onError == 'function')) {
                                    options.onError(error);
                                }
                            }
                        );
                    },
                    /**
                     * 产品列表筛选条件
                     * @constructor
                     */
                    productsScreen: function (options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.PRODUCTS_SCREEN.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.PRODUCTS_SCREEN.URL;
                        // 后端入参适配
                        // config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.PRODUCTS_SCREEN.TARGET, this);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.PRODUCTS_SCREEN.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
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
                     * 获取地区
                     * @constructor
                     */
                    getArae: function (keywords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_AREA.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_AREA.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.GET_AREA.TARGET, keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_AREA.TARGET, data);
                                    if (!data) {
                                        // options.onError("适配器验证不通过");
                                    } else {
                                        options.onSuccess(data);
                                    }
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
                     * 获取商业用户编码
                     * @constructor
                     */
                    getBusinessUserType: function (keywords, options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GET_BUSINESS_USER_TYPE.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GET_BUSINESS_USER_TYPE.URL;
                        // 后端入参适配
                        config.httpPackage.data = $$adapter.exports(constants.REQUEST_TARGET.GET_BUSINESS_USER_TYPE.TARGET, keywords);
                        $http(config.httpPackage).then(
                            function (data) {
                                if (options || options.onSuccess) {
                                    //后端回参适配
                                    data = $$adapter.imports(constants.REQUEST_TARGET.GET_BUSINESS_USER_TYPE.TARGET, data);
                                    if (!data) {
                                        options.onError("适配器验证不通过");
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

