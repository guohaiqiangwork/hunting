define([
    'app',
    'config',
    'constants',
    'jedate',
    "layer"
], function (app, config, constants, jedate,layer) {
    app.registerController('toExamineCtrl', ['$scope', '$state', '$$neptune', '$rootScope','$modal',
        function ($scope, $state, $$neptune, $rootScope,$modal) {
            $scope.historyOrders = [];  //订单列表
            $scope.searchKeywords = {
                agentGroup: $rootScope.user.agentGroup,//机构编码
                name: '', //投保人姓名
                certificate_number: '',  //投保人证件号
                address: '', //投保地址
                phone_number: '',    //投保人联系方式
                agentName: '',  //销售人姓名
                gas_user_id: '',     //燃气编码
                create_date_state: '',  //录单起期
                create_date_end: '', //录单时间止期
                product_name: '',//产品名称
                effective_date_state: '', //保单起期开始时间
                effective_date_end: '',  //保单起期结束时间
                expiry_date_state: '', //保单止期开始时间
                expiry_date_end: '' ,//保单止期结束时间
                payState:''//订单状态
            };
            /**
             * 分页
             * */
            $scope.pagination = {
                totalItems: $scope.noticeTices,//总条数
                pageIndex: 1,//页索引
                pageSize: 10,//每页数量
                maxSize: 9, //最大容量
                numPages: 5, //总页数
                previousText: config.pagination.previousText, //上一页
                nextText: config.pagination.nextText, //下一页
                firstText: config.pagination.firstText,   //首页
                lastText: config.pagination.lastText,  //最后一页
                pageSizes: [10, 20, 30, 50] // 每页数量集合
            };
            //日期
            $scope.setYearDate = function (ele) {
                jedate({
                    dateCell: '#' + ele,
                    format: "YYYY-MM-DD",
                    insTrigger: false,
                    isClear: true,                         //是否显示清空
                    isToday: false,
                    minDate: "2004-01-01",   //0代表今天，-1代表昨天，-2代表前天，以此类推
                    okfun: function (elem, val, date) {
                        $scope.searchKeywords[ele] = val;
                    },
                    choosefun: function (elem, val) {
                        $scope.searchKeywords[ele] = val;
                    },
                    clearfun: function (elem, val) {
                        $scope.searchKeywords[ele] = '';
                    }
                });
            };

            /**
             * 查询接口
             * */
            //
            $scope.getSearchOrders = function (_Searchpage) {

                $('#search1').blur();
                if(_Searchpage){
                    $scope.pagination.pageIndex = 1;
                }
                var target = angular.copy(constants.REQUEST_TARGET.ORDER_INQUIRY);
                target.URL += "/"+$rootScope.user.agentCode;
                $$neptune.find(target, $scope.searchKeywords, {
                    onSuccess: function (data) {
                        $scope.historyOrders = [];
                        $scope.operation = true;
                        if($scope.searchKeywords.payState == '4'){
                            $scope.operation = false
                        }
                        if (data.orderInfo.length) {
                            $scope.money = data.money;
                            $scope.historyOrders = data.orderInfo;
                            $scope.pagination.totalItems = data.totalCount || data.orders.length;
                            $scope.pagination.orderTotal = data.orderTotal;
                            $scope.pagesAltogether = $scope.pagination.totalItems / $scope.pagination.pageSize;
                            $scope.taskPageCountNote = Math.ceil($scope.pagesAltogether);
                        } else {
                            $scope.historyOrders = [];
                        }
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 2000});
                        $scope.historyOrders = [];
                    }
                }, $scope.pagination)
            };
            /**
             * 清空功能
             * */
            $scope.goSearchEmpty = function () {
                $('#search2').blur();
                $scope.searchKeywords = {
                    agentGroup: $rootScope.user.agentGroup,//机构编码
                    name: '', //投保人姓名
                    certificate_number: '',  //投保人证件号
                    address: '', //投保地址
                    phone_number: '',    //投保人联系方式
                    agentName: '',  //销售人姓名
                    gas_user_id: '',     //燃气编码
                    create_date_state: '',  //录单起期
                    create_date_end: '', //录单时间止期
                    product_name: '',//产品名称
                    effective_date_state: '', //保单起期开始时间
                    effective_date_end: '',  //保单起期结束时间
                    expiry_date_state: '', //保单止期开始时间
                    expiry_date_end: '' //保单止期结束时间
                };
                $scope.getSearchOrders()

            };
            /*
         *续保到产品录入页
         */
            $scope.goSearchRenewalBuy = function (productId, orderId) {
                $state.go('buy', {
                    id: JSON.stringify({
                        productId: productId,
                        orderId: orderId
                    })
                })
            };
            /**
             * 打开订单详情
             * @param id
             * @param type 订单或保单
             */
            $scope.openOrderDetails = function (id, type) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'orders/model/orderDetails.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.type = type;
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        /**
                         * 获取订单详情
                         */
                        function getOrder() {
                            $$neptune.$order.Order(id, {
                                onSuccess: function (data) {
                                    $scope.order = data;
                                },
                                onError: function (e) {
                                }
                            });
                        }

                        getOrder();
                    },
                    size: 'sm'
                })
            };

            /**
             *导出功能
             */
            $scope.toExport = function () {
                $$neptune.$order.toExport($scope.searchKeywords, {
                    onSuccess: function (data) {
                        if (data.ExportOrder) {
                            window.location.href = data.ExportOrder
                        }
                    },
                    onError: function (e) {
                        layer.msg(e+"", {time: 2000})
                    }
                })
            };

            function init() {

            }

            init();
        }]);

});