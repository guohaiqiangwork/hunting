define([
    'app',
    'config',
    'constants',
    'jedate',
    'docuStatistics/documentsRK.ctrl',
    'docuStatistics/confirm.ctrl',
    'docuStatistics/documentsJS.ctrl',
    'docuStatistics/documentsXF.ctrl',
    'docuStatistics/mDocuments.ctrl'
], function (app, config, constants, jedate) {
    app.registerController('documentStatisticsCtrl', ['$scope', '$state', '$$neptune', '$rootScope',
        function ($scope, $state, $$neptune, $rootScope) {
            $scope.texts = [
                {text: '单证入库', isAdvanced: true,isShow:$rootScope.user.auth_id.indexOf('5')!=-1},
                {text: '单证下发', isAdvanced: true},
                {text: '单证接收', isAdvanced: true},
                {text: '我的单证', isAdvanced: true},
                {text: '上交确认', isAdvanced: true,isShow:$rootScope.user.auth_id.indexOf('6')!=-1}
            ];
            $scope.isSwitchOrder = 0;
            /**
             * 个人订单页面切换
             * @type {boolean}
             */
            $scope.switchOrder = function (target) {
                $scope.isSwitchOrder = target.index;
                $scope.pagination.pageIndex = 1; //切换tab重置索引
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
             *页面切换
             */
            $scope.switchView = function (info) {
                $scope.active = info;
            };

            function init() {
                //默认展示单证入库
                $scope.active = 'documentsRK'
            }

            init();
        }]);

});