define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.user',
    'common/api/neptune.finder',
    'common/api/neptune.product',
    'common/api/neptune.policy',
    'common/api/neptune.order',
    'common/api/neptune.document',
    'common/api/mc.multiple',
    'common/api/mc.util',
    'common/api/mc.sendVerification',
    'common/api/mc.textSwitch',
    'mc-bakery',
    'jquery-qrcode',
    'layer',
    'MD5',
    'md5'
], function (config, constants, adapter) {
    angular.module('neptune.api', [
        'neptune.adapter',
        'mc.user',
        'neptune.finder',
        'neptune.product',
        'neptune.policy',
        'neptune.order',
        'neptune.document',
        'mc.multiple',
        'mc.util',
        'mc.sendVerification',
        'mc.textSwitch',
        'mc.bakery'
    ])
        .factory('$$neptune', ['$q', '$http', '$timeout', '$$adapter', '$rootScope', '$$user', '$$finder', '$$product',
            '$$policy', '$$order', '$$document',
            function ($q, $http, $timeout, $$adapter, $rootScope, $$user, $$finder, $$product, $$policy, $$order, $$document) {
                return {
                    $user: $$user,
                    $product: $$product,
                    $policy: $$policy,
                    $order: $$order,
                    $document: $$document,
                    /**
                     * 列表查询
                     * @param target
                     * @param keyWords
                     * @param pagination
                     * @param options
                     */
                    find: function (target, keyWords, options, pagination) {
                        $$finder.find(target, keyWords, options, pagination);
                    },
                    /**
                     * 支付
                     * @param method 支付方式
                     * @param order 订单
                     * @param options
                     */
                    pay: function (method, order, options) {

                        config.httpPackage.url = config.backend.ip + constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE;
                        config.httpPackage.data = $$adapter.exports(constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE, order);

                        $http(config.httpPackage).then(
                            function (data) {
                                if (options && options.onSuccess) {
                                    data = $$adapter.imports(constants.backend.REQUEST_METHOD.LOGIN_OUTSIDE, data);
                                    config.auth.isLogin = true;
                                    options.onSuccess(data);
                                }
                            },
                            function (error) {
                                // options.onError(error);
                            }
                        );
                    },
                    /**
                     * 查询机构树
                     * @param options
                     */
                    groupTree: function (options) {
                        config.httpPackage.method = constants.REQUEST_TARGET.GROUP_TREE.METHOD;
                        config.httpPackage.url = constants.REQUEST_TARGET.GROUP_TREE.URL;

                        $http(config.httpPackage).then(
                            function (data) {
                                data = $$adapter.imports(constants.REQUEST_TARGET.GROUP_TREE.TARGET, data);
                                if (options && options.onSuccess) {
                                    options.onSuccess(data);
                                }
                            },
                            function (error) {
                                // options.onError(error);
                            }
                        );
                    }
                };
            }])
        .directive('header', ['$$adapter', function ($$adapter, $location) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'common/template/header.directive.html',
                //template: '<h1>lidless , wreathed in flame, 1 times</h1>'
                scope: {
                    cmsData: '='
                },
                controller: function ($scope, $rootScope, $attrs, $element, $timeout, $$user, $location, $state) {

                    var init = function () {
                        var urlName = $state.current.name;
                        if (urlName == 'buy' || urlName == 'pay' || urlName == 'product') {
                            urlName = 'products';
                        }
                        if ($('.' + urlName)[0])
                            $('.' + urlName)[0].style['borderBottom'] = '3px solid #E8B25B';
                    };


                    $scope.goHtml = function (state, $event) {
                        if ($event) {
                            // 跳转产品列表
                            var keycode = window.event ? $event.keyCode : $event.which;
                            if (keycode !== 13) {
                                return false;
                            }
                        }
                        switch (state) {
                            case "orders":
                                $state.go('orders');
                                break;
                            case "products":
                                $state.go('products');
                                break;
                            case "signOut":
                                $state.go('signOut');
                                break;
                            case "toExamine":
                                $state.go('toExamine');
                                break;
                            case "userCenter":
                                $state.go('userCenter', {type: "basicInfoDefault"});
                                break;
                            case "statistics":
                                $state.go('statistics');
                                break;
                            case "documentStatistics":
                                $state.go('documentStatistics');
                                break;
                            default:
                                $state.go('/');
                        }

                    };
                    $rootScope.$on('userUpdate', function () {
                        $scope.basicInformation = $rootScope.user;
                    });
                    $scope.identityInformation = $rootScope.user.auth_id;//获取用户岗位
                    /*
                     * 注销
                     * */
                    $scope.logout = function () {
                        $rootScope.user.logout();
                    };
                    /*
                    *获取用户信息
                     */
                    $scope.basicInformation = $rootScope.user;
                    init();
                }
            }
        }])
        .directive('testEle', ['', function () {
            return 1;
        }])
        /**
         * 订单录入缓存
         */
        .service("orderEntryCache", function () {
            // 订单缓存
            var orderCache = {};
            // 清除缓存
            this.clear = function () {
                orderCache = {};
            };
            /**
             * 设置缓存
             * @param data
             */
            this.setOrderCache = function (data) {
                if (data) {
                    // 循环赋值进行缓存
                    for (var k in data) {
                        orderCache[k] = data[k];
                    }
                }
            };
            /**
             * 获取缓存
             * @param key
             * @returns {*}
             */
            this.getOrderCache = function (key) {
                return orderCache[key];
            };
        })
        .directive('pluploadFile', ['$timeout', function ($timeout) {
            return {
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function (scope, iElm, iAttrs, controller) {

                    var orderNames = scope.orderNames;
                    var uploader = new plupload.Uploader({
                        runtimes: 'html5,flash,silverlight,html4',
                        browse_button: iElm[0],
                        url: constants.backend.SERVER_ORDER_IP + constants.backend.REQUEST_METHOD.UPLOAD_SIGN,
                        multi_selection: false,
                        multipart_params: {
                            operatorId: scope.memberId,
                            ordersIdStr: JSON.stringify(orderNames),
                            paymentName: scope.signData.paymentName, //付款人姓名
                            paymentAmount: scope.signData.paymentAmount,//付款金额
                            paymentAccount: scope.signData.paymentAccount //付款账号
                        },
                        filters: {
                            max_file_size: '10mb',
                            mime_types: [{
                                title: "Image files",
                                extensions: "jpg,gif,png"
                            }]
                        },
                        flash_swf_url: '/plupload/Moxie.swf',
                        silverlight_xap_url: '/plupload/Moxie.xap',
                        init: {
                            PostInit: function () {
                                $("#" + iAttrs.pluploadFile).on('click', function () {
                                    uploader.settings.multipart_params.paymentName = scope.signData.paymentName;
                                    uploader.settings.multipart_params.paymentAmount = scope.signData.paymentAmount;
                                    uploader.settings.multipart_params.paymentAccount = scope.signData.paymentAccount;

                                    if (uploader.files.length) {
                                        uploader.start();//为插件中的start方法，进行上传
                                        return false;
                                    } else {
                                        alert("请选择上缴的凭证")
                                    }

                                });
                                $("#" + iAttrs.fileimg).on('click', function () {
                                    // 删除第一个图片
                                    uploader.splice(0, 1);
                                });
                            },
                            FilesAdded: function (up, addFiles) {
                                scope.previewImage(iAttrs.fileshowlist, addFiles[0], function (imgsrc) {
                                    $("#" + iAttrs.fileimg)[0].src = imgsrc;
                                    $("#" + iAttrs.fileimg)[0].style.width = $("#" + iAttrs.pickfiles).width() + "px";
                                    $("#" + iAttrs.fileimg)[0].style.height = $("#" + iAttrs.pickfiles).height() + "px";
                                    $("#" + iAttrs.filetext).css('display', "none");
                                })
                            },
                            FileUploaded: function (up, file, response) {
                                if (JSON.parse(response.response).success) {
                                    uploader.destroy();
                                    layer.msg("上传成功", {time: 1000});
                                    // 上传之后清空文件
                                    $.each(up.files, function (i, file) {
                                        up.removeFile(file);
                                    });
                                    scope.closeUploadSign()
                                } else {
                                    layer.msg("上传失败", {time: 1000});
                                }
                            },
                            Error: function (up, err) {
                                layer.msg('上传失败' + '[' + err.message + ']', {time: 1000});
                                // 上传之后清空文件
                                $.each(up.files, function (i, file) {
                                    up.removeFile(file);
                                });
                            }
                        }
                    });
                    uploader.init();
                }
            };
        }])
});

