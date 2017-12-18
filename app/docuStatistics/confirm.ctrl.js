define([
    'app',
    'config',
    'constants',
    'jedate',
    'layer'
], function (app, config, constants, jedate,layer) {
    app.registerController('confirmCtrl', ['$scope', '$state', '$$neptune', '$rootScope',
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

            /**
             * 查询待确认的单证
             */
            $scope.unDeterminedOrder = function () {
                $$neptune.find(constants.REQUEST_TARGET.UN_DETERMINED_ORDER, '', {
                    onSuccess: function (data) {
                        $scope.unDeterminedDocuments = data.certifyProvideReturns;
                        $scope.pagination.totalItems = data.total;
                    },
                    onError: function (e) {

                    }
                }, $scope.pagination);
            };
            /**
             * 查询已确认上交的单证历史记录
             */
            $scope.determinedOrder = function () {
                $$neptune.find(constants.REQUEST_TARGET.DETERMINED_ORDER, '', {
                    onSuccess: function (data) {
                        $scope.determinedDocuments = data.certifyProvideReturns;
                        $scope.pagination.totalItems = data.total;
                    },
                    onError: function (e) {

                    }
                }, $scope.pagination);
            };
            /**
             * 单证确认上交
             * @param serialNo
             */
            $scope.confirmation = function (serialNo) {
                $$neptune.$document.confirmation(serialNo, {
                    onSuccess: function (data) {
                        if(data){
                            layer.msg(data,{time:3000});
                        }
                        $scope.unDeterminedOrder();
                        $scope.determinedOrder();
                    },
                    onError: function (e) {
                    }
                });
            };
            /**
             * 附件下载
             * @param fileUrl
             */
            $scope.downloadEnclosure = function (fileUrl) {
                window.open(fileUrl);
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'docuStatistics/modal/displayPicture.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.fileUrl = fileUrl;
                        /**
                         * 关闭弹窗
                         */
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.successResult = function () {
                        };
                    }
                }).result.then(function () {

                });
            };

            function init() {
                $scope.unDeterminedOrder();
                $scope.determinedOrder();
            }

            init();
        }]);

});
