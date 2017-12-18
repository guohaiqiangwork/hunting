define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('productCtrl', ['$scope', '$state', '$rootScope', '$$neptune',
        function ($scope, $state, $rootScope, $$neptune) {

            $scope.buyProduct = function (id) {
                $state.go('buy', {id: JSON.stringify({productId: $scope.product.productId})});
            };
            /**
             * 获取产品详情
             */
            function getProduct() {
                if ($state.params && $state.params.id) {
                    var keyWords = {
                        productId: JSON.parse($state.params.id).productId,
                        categoryId: JSON.parse($state.params.id).categoryId
                    };
                    $$neptune.$product.Product(keyWords, {
                        onSuccess: function (data) {
                            $scope.product = data;
                        },
                        onError: function (e) {
                            layer.msg("网络缓慢,请稍后重试", {time: 3000});
                        }
                    });
                }

            }

            function init() {
                getProduct();
            }

            init();
        }]);

});