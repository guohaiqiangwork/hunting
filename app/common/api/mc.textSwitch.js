/**
 * Created by 若水一涵 on 2017/7/7.
 */
define(['angular'], function (angular) {

    angular.module('mc.textSwitch', [])

        .directive('mcTextSwitch', ['$parse', function ($parse) {
            return {
                require: 'mcTextSwitch',
                replace: true,
                restrict: 'AE',
                controller: 'textSwitchCtrl',
                controllerAs: '$textSwitch',
                templateUrl: 'template/textSwitch/textSwitch.directive.html',
                scope: {
                    cColorClass: "@", // 结束时间
                    cTexts: '=', // 列表文字
                    cOnSwitch: '&'
                },
                link: function (scope, element, attrs, $textSwitch) {
                    $textSwitch.initTexts(scope.cTexts);
                    /**
                     * 切换
                     * @param text
                     */
                    $textSwitch.onSwitch = function (text) {
                        $textSwitch.switchActive = text.index;
                        // 回调
                        scope.cOnSwitch({text: text});
                    };
                }
            }
        }])
        .controller('textSwitchCtrl', ['$scope', function ($scope) {
            var ctrl = this;
            ctrl.texts = [];
            ctrl.switchActive = undefined;
            /**
             * 初始化文字数组
             * @param texts
             */
            ctrl.initTexts = function (texts) {
                // 数组则循环后赋值
                if (texts instanceof Array && texts.length > 0) {
                    $.each(texts, function (index, text) {
                        // 数组item是字符串
                        if (typeof text === 'string') {
                            ctrl.texts.push({text: text, index: index});
                        } else if (typeof text === 'object') { // 数组item是对象,直接赋值
                            var myText = angular.copy(text);
                            myText.index = index;
                            ctrl.texts.push(myText);
                        }
                    });
                } else if (typeof texts === 'string') { // 文字则解析后添加
                    // 拆分字符串为数组
                    $.each(texts.split(';'), function (index, text) {
                        ctrl.texts.push({text: text, index: index});
                    });
                }
                // 默认选中第一个
                if (ctrl.texts.length > 0) {
                    ctrl.switchActive = ctrl.texts[0].index;
                }
            };
        }]);
});