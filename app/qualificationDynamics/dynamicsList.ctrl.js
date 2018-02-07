define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('dynamicsListCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id || '代办资质';
            $rootScope.active = $scope.leftTitle;
            $scope.moreList = false;//更多初始化
            //点击更多
            $scope.goToMore = function (id) {
                $scope.moreList = true;
            };
            /**
             * 初始化数据
             * @type {{type: string}}
             */
            $scope.findGetDynamics = {
                type: ""
            };
            /**
             * 分页*/
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
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info, type) {
                $rootScope.active = info;
                $scope.findGetDynamics.type = type;
                $scope.getDynamics()
            };

            //代办资质首页
            $scope.getDynamics = function () {
                var target = angular.copy(constants.REQUEST_TARGET.GET_DYNAMICS_FIND);
                $$neptune.find(target, $scope.findGetDynamics, {
                    onSuccess: function (data) {
                        $scope.ordersZCList = data.ordersZC;
                        $scope.ordersZYList = data.ordersZY;
                        $scope.ordersLWList = data.ordersLW;
                        $scope.ordersAQList = data.ordersAQ;
                        $scope.ordersFDList = data.ordersFD;
                        $scope.ordersYLList = data.ordersYL;
                        $scope.ordersSJList = data.ordersSJ;
                        $scope.ordersQTList = data.ordersQT;
                    },
                    onError: function (e) {
                        layer.msg('网络缓慢请联系管理员', {time: 1000})
                    }
                }, $scope.pagination);
            };
            /**
             *查看详情
             * @param id
             */
            $scope.goToDetails = function (id) {
                console.log(id)
            };
            var init = function () {
                $scope.getDynamics()
            };


            init();
        }]);

});