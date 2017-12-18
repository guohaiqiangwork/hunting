define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('productsCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune',
        function ($scope, $state, $rootScope, localStorageService, $$neptune) {
            // 分页
            $scope.pagination = {
                totalItems: 1,//总条数
                pageIndex: 1,//页索引
                pageSize: 1000,//每页数量
                maxSize: 9, //最大容量
                numPages: 5, //总页数
                previousText: config.pagination.previousText, //上一页
                nextText: config.pagination.nextText, //下一页
                firstText: config.pagination.firstText,   //首页
                lastText: config.pagination.lastText,  //最后一页
                pageSizes: [10, 20, 30, 50] // 每页数量集合
            };
            //界面绑定元素
            $scope.queryAguments = {
                productName: '',
                productId: '',
                insuranceCompany: '',
                crowd: '',
                insuranceDuration: '',
                supplierCode: '',//保险公司编码
                categoryId: '',//栏目编码
                riskName: ''//产品名称用于模糊查询
            };
            //去保单填写页面
            $scope.buyProduct = function (product) {
                if ($rootScope.user.agentKind === '002'
                    && ($rootScope.user.isPassed === 'UNPASSED' ||
                        $rootScope.user.branchType2 != 1 ||
                        $rootScope.user.approveState == "1" ||
                        !$rootScope.user.approveState ||
                        !$rootScope.user.idcard_nega_photo ||
                        !$rootScope.user.idcare_posi_photo)) {
                    alert('请确认是否已通过认证考试、已签署代理协议、已上传照片，若未通过认证考试或未签署代理协议、未上传照片，请去个人中心进行操作。');
                } else {
                    $state.go('buy', {id: ''});
                }
                // JSON.stringify({productId: product.productId})
            };
            //产品列表接口获取
            $scope.getProducts = function () {
                var keywords = {
                    supplierCode: $scope.queryAguments.supplierCode,//保险公司编码
                    categoryId: $scope.queryAguments.categoryId,//栏目编码
                    organizationCode: $scope.queryAguments.organizationCode,//机构编码
                    riskName: $scope.queryAguments.riskName,//产品名称用于模糊查询
                    // salespersonCode: $scope.queryAguments.salespersonCode,//营业员编码
                    salespersonCode: $rootScope.user.agentCode,//营业员编码
                    pageNo: $scope.pagination.pageIndex,
                    pageSize: $scope.pagination.pageSize,
                    version: '1.0'
                };

                $$neptune.find(constants.REQUEST_TARGET.PRODUCTS, keywords, {
                    onSuccess: function (data) {
                        // $scope.products = data._products;
                        getProductsObject(data._products);
                        $scope.pagination.totalItems = data.totalCount;
                        $scope.isProduct = false;
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢请稍后重试", {time: 3000});
                        $scope.isProduct = false;
                    }
                }, $scope.pagination)
            };

            function getProductsObject(data) {
                $scope.productObject = {};
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (!$scope.productObject[data[i].supplierShortName]) {
                            $scope.productObject[data[i].supplierShortName] = [];
                        }
                        $scope.productObject[data[i].supplierShortName].push(data[i]);
                    }
                }
            }

            //产品列表筛选条件接口
            $scope.getProductsScreen = function () {
                $$neptune.$product.productsScreen({
                    onSuccess: function (data) {
                        $scope.finsComs = data._finsComs;
                        $scope.fproTypes = data._fproTypes
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                }, $scope.pagination)
            };
            $scope.isProduct = false;
            //收藏图标
            $scope.collectProduct = function (productId) {
                $scope.isProduct = true;
                var keywords = {
                    product_id: productId,//产品编号
                    member_id: $rootScope.user.agentCode//操作员编号
                };
                $$neptune.$product.updateCollection(keywords, {
                    onSuccess: function (data) {
                        $scope.getProducts();
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };

            function init() {
                // 产品名称
                $scope.queryAguments.riskName = $rootScope.headProductName;
                $scope.getProducts();//获取产品列表接口
                $scope.getProductsScreen();//获取产品列表筛选条件
            }

            init();
        }]);

});