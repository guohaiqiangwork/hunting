/**
 * Created by 若水一涵 on 2017/6/23.
 */
define([
    'app',
    'config',
    'constants'
], function (app, config, constants) {
    app.registerController('forgetPasswordCtrl', ['$scope', '$state', '$rootScope','$modal',
        function ($scope, $state, $rootScope,$modal) {
            $scope.isComplete = false;
            $scope.isVerification = false;

            var openUpdateSuccess = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'forgetPassword/updatePasswordSuccess.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.goToLogin = function () {
                            $scope.close();
                            $state.go('login');
                        };
                    },
                    size: 'sm'
                })
            };
            /**
             * 更改密码
             */
            $scope.updatePassword = function () {
                openUpdateSuccess();
            };
        }]);
});