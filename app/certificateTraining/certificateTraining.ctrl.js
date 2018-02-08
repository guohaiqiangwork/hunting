define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('certificateTrainingCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.leftTitle = $stateParams.id || '证书培训';
            $rootScope.active = $scope.leftTitle;

            $scope.trainingData = {
                type: ''
            };

            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info, type) {
                $rootScope.active = info;
                $scope.trainingData.type = type;
                $scope.getCertificateTraining()
            };
            /**
             * 分页*/
            $scope.pagination = {
                totalItems: '',//总条数
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
             * 证书培训
             */
            $scope.getCertificateTraining = function () {
                $$neptune.find(constants.REQUEST_TARGET.GET_CERTIFICATE_TRAINING_FIND, $scope.trainingData, {
                    onSuccess: function (data) {
                        console.log(data);
                        $scope.qualificationsBSList = data.qualificationsBS;
                        $scope.qualificationsBJList = data.qualificationsBJ;
                        $scope.qualificationsZRList = data.qualificationsZR;
                        $scope.qualificationsCXList = data.qualificationsCX;
                    },
                    onError: function (e) {
                        layer.msg('网络缓慢请联系管理员', {time: 1000})
                    }
                }, $scope.pagination);
            };
            var init = function () {
                $scope.getCertificateTraining();//获取首页信息
            };

            init();

        }]);

});