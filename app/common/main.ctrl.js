define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.controller('MainCtrl', ['$scope', '$$neptune', '$rootScope', '$state', '$timeout', 'localStorageService', '$modal',
        function ($scope, $$neptune, $rootScope, $state, $timeout, localStorageService, $modal) {
            // 标签名字
            $rootScope.labelName = '';
            // 产品名称
            $rootScope.headProductName = '';
            // 提示框配置
            layer.config({
                path: "assets/js/layer/"
            });
            // 返回失败监听
            $rootScope.$on(constants.EVENTS.BACKEND_EXCEPTION, function (event, args) {
                layer.msg(args.message, {time: 2000});
                // $timeout(function(){
                //     $state.go('login');
                // },10);
            });
            // 返回成功监听
            $rootScope.$on(constants.EVENTS.BACKEND_SUCCESS, function (event, args) {
                layer.msg(args.message, {time: 1000});
            });
            // 没有登录
            $rootScope.$on(constants.AUTH.UNAUTHORIZED, function (event, args) {
                $timeout(function () {
                    localStorageService.set(constants.OPERATE_TYPE.LOCAL_USER, undefined);
                    $state.go('login');
                }, 10);
            });

            //返回上一个页面
            $scope.goToPage = function (labelName) {
                javascript: history.go(-1);
                // 删除标签
                if (labelName)
                    $rootScope.labelName = labelName;
            };

            //产品弹窗
            $scope.browseProduct = function (productId, categoryId, $event) {
                if ($event) {
                    $event.stopPropagation();
                }
                var productModal = $modal.open({
                    backdrop: 'static',
                    animation: true,
                    resolve: {
                        productId: function () {
                            return productId;
                        }
                    },
                    templateUrl: 'pay/template/product.modal.html',
                    controller: function ($scope, $modalInstance, $state, $timeout, productId) {

                        var init = function () {
                            var keyWords = {
                                productId: productId || '',
                                categoryId: categoryId || ''
                            };
                            //这里添加获取产品信息的方法
                            $$neptune.$product.Product(keyWords, {
                                onSuccess: function (data) {
                                    var productTest = data.additionalElements;
                                    angular.forEach(productTest, function (productTest, index) {
                                        if (productTest.eleCode == "productShortDesc") {
                                            $scope.productTextDesc = productTest
                                        }
                                    });
                                    $scope.product = data;
                                },
                                onError: function (e) {
                                    layer.msg("网络缓慢,请稍后重试", {time: 2333});
                                }
                            });
                        };

                        $scope.closeProduct = function () {
                            $modalInstance.dismiss();
                        };

                        init();
                    }
                });

                productModal.result.then(function (result) {
                }, function (reason) {
                    if (reason) {
                        // console.log(reason);

                    }
                });
                return false;
            };

            $scope.collectProducts = [
                'P0001',
                'P0003'
            ];

            var init = function () {

            };

            init();
        }]);
    app.registerFilter('isCollect', function () {
        return function (data, productInfo) {
            var type = productInfo.type || 'allProducts';

            if (type == 'collectProducts' && data && data.length > 0) {
                var _products = [];
                $.each(data, function (index, pro) {
                    if (pro.collnetStatus === 'Y') {
                        _products.push(pro);
                    }
                });
                return _products;
            }
            return data;
        }
    });
});
