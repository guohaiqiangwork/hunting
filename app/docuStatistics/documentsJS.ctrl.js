define([
    'app',
    'config',
    'constants',
    'jedate',
    'layer'
], function (app, config, constants, jedate, layer) {
    app.registerController('documentsJSCtrl', ['$scope', '$state', '$$neptune', '$rootScope',
        function ($scope, $state, $$neptune, $rootScope) {

            /**
             * 分页*/
            $scope.pagination = {
                totalItems: 0,//总条数
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
            //根待接收单证初始化
            $scope.awaitingDocumentInitialization = function () {
                $$neptune.$document.documentInitialization({
                    onSuccess: function (data) {
                        $scope.receptionOfList=data.certifyProvideReturns;
                        for (i = 0; i < $scope.receptionOfList.length; i++) {
                            switch($scope.receptionOfList[i].state){
                                case "-1":$scope.receptionOfList[i].state="无效";break;
                                case "00":$scope.receptionOfList[i].state="未使用";break;
                                case "01":$scope.receptionOfList[i].state="已使用";break;
                                case "02":$scope.receptionOfList[i].state="待接收确认";break;
                                case "03":$scope.receptionOfList[i].state="已作废";break;
                                case "04":$scope.receptionOfList[i].state="已遗失";break;
                                case "05":$scope.receptionOfList[i].state="待上交确认";break;
                                case "06":$scope.receptionOfList[i].state="已上交";break;
                                case "07":$scope.receptionOfList[i].state="已回销";break;
                            }
                        }
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //查询单证接收历史
            $scope.enquiriesReceiveHistory = function () {
                $$neptune.$document.receiveHistory($scope.pagination,{
                    onSuccess: function (data) {
                        $scope.receiveHistoryOfList = data.certifyProvideReturns;
                        $scope.pagination.totalItems = data.total;
                        for (i = 0; i < $scope.receiveHistoryOfList.length; i++) {
                            switch($scope.receiveHistoryOfList[i].state){
                                case "-1":$scope.receiveHistoryOfList[i].state="无效";break;
                                case "00":$scope.receiveHistoryOfList[i].state="未使用";break;
                                case "01":$scope.receiveHistoryOfList[i].state="已使用";break;
                                case "02":$scope.receiveHistoryOfList[i].state="待接收确认";break;
                                case "03":$scope.receiveHistoryOfList[i].state="已作废";break;
                                case "04":$scope.receiveHistoryOfList[i].state="已遗失";break;
                                case "05":$scope.receiveHistoryOfList[i].state="待上交确认";break;
                                case "06":$scope.receiveHistoryOfList[i].state="已上交";break;
                                case "07":$scope.receiveHistoryOfList[i].state="已回销";break;
                            }
                        }
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //单证接收
            $scope.documentReceived = function (serialNo) {
                var keywords = {
                    serialNo: serialNo
                };
                $$neptune.$document.documentsReceived(keywords, {
                    onSuccess: function (data) {
                        layer.msg(data, {time: 3000});
                        if (typeof data === "string") {
                            layer.msg(data, {time: 3000});
                        }
                        $scope.awaitingDocumentInitialization();
                        $scope.enquiriesReceiveHistory()
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //单证拒收
            $scope.documentReject = function (serialNo) {
                var keywords = {
                    serialNo: serialNo
                };
                $$neptune.$document.documentsReject(keywords,{
                    onSuccess: function (data) {
                        layer.msg(data, {time: 3000});
                        if (typeof data === "string") {
                            layer.msg(data, {time: 3000});
                        }
                        $scope.awaitingDocumentInitialization();
                        $scope.enquiriesReceiveHistory()
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };

            function init() {
                $scope.awaitingDocumentInitialization();
                $scope.enquiriesReceiveHistory()
            }

            init();
        }]);

});