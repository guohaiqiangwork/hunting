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
             * 证书培训
             */
            $scope.getCertificateTraining = function () {
                $$neptune.find(constants.REQUEST_TARGET.GET_CERTIFICATE_TRAINING_FIND, $scope.trainingData, {
                    onSuccess: function (data) {
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