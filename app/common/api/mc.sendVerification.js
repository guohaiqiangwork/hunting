define(['angular'], function (angular) {

    angular.module('mc.sendVerification', [])

        .directive('mcSendVerification', ['$parse', function ($parse) {
            return {
                require: 'mcSendVerification',
                replace: true,
                restrict: 'A',
                controller: 'sendVerificationCtrl',
                controllerAs: '$verification',
                scope: {
                    cTime: "@", // 结束时间
                    cOverText: '@' // 结束后文字
                },
                compile: function (tElement, tAttrs) {
                    return function (scope, element, attrs, $verification) {
                        /**
                         * 倒计时结束
                         */
                        $verification.timeOverCallback = function (time) {
                            if (time >= 0) {
                                element[0].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;"+time+"&nbsp;&nbsp;&nbsp;&nbsp;";
                            } else {
                                element[0].innerHTML = scope.cOverText;
                            }
                            // 去掉点击事件
                            if (!$verification.isDisabled)
                                element[0].removeAttribute('disabled');

                        };
                        // 添加点击事件
                        element[0].onclick = function () {
                            // 设置结束时间
                            if (scope.cTime && !isNaN(parseInt(scope.cTime))) {
                                $verification.time = angular.copy(parseInt(scope.cTime));
                            }
                            // 开始倒计时
                            $verification.computingTime();
                            // 禁止点击
                            element[0].setAttribute('disabled', $verification.isDisabled);
                        };
                    }
                }
            }
        }])
        .controller('sendVerificationCtrl', ['$scope', function ($scope) {
            var ctrl = this;
            var timer = undefined;
            ctrl.time = 0;
            // 时间结束回调函数
            ctrl.timeOverCallback = undefined;
            ctrl.isDisabled = true;
            /**
             * 计算时间
             */
            ctrl.computingTime = function () {
                if (ctrl.time === 0) {
                    if (timer)
                        clearInterval(timer);
                    timer = undefined;
                    ctrl.isDisabled = false;
                } else if (!timer) {
                    // 每秒循环一次
                    timer = setInterval(ctrl.computingTime, 1000);
                }
                ctrl.time--;
                if (ctrl.timeOverCallback)
                    ctrl.timeOverCallback(ctrl.time);

            };
        }]);
});