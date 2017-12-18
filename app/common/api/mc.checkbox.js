define(['angular'], function (angular) {

    angular.module('mc.checkbox', [])

        .directive('mcCheckbox', ['$parse', function ($parse) {
            return {
                require: 'mcCheckbox',
                replace: true,
                restrict: 'AE',
                templateUrl: 'template/directive/checkbox.directive.html',
                controller: 'checkboxCtrl',
                controllerAs: '$checkbox',
                scope: {
                    cModel: '=',//数据
                    cTrue: "@", // 选中
                    cFalse: "@", // 未选中
                    cDisabled: "=", // 是否允许点击
                    cType: "@", // 类型
                    cId: "@", // id
                    cClick: "&"
                },
                compile: function (tElement, tAttrs) {
                    return function (scope, element, attrs, $checkbox) {
                        // 设置id防止错乱
                        scope.myId = scope.cId || new Date().valueOf() + "";
                        $checkbox.updateSelection = function ($event) {
                            var checkbox = $event.target;
                            $checkbox.isChecked = checkbox.checked;
                            scope.cModel = checkbox.checked ? scope.cTrue : scope.cFalse;
                            scope.cClick({value: scope.cModel, isChecked: checkbox.checked});
                        };
                        function init() {
                            scope.$parent.$watch(function () {
                                return scope.cModel
                            },function (v) {
                                $checkbox.isChecked = scope.cModel && scope.cModel == scope.cTrue;
                            },true);
                            // 判断是否选中
                            $checkbox.isChecked = scope.cModel && scope.cModel == scope.cTrue;
                        }

                        init();
                    }
                }
            }
        }])
        .controller('checkboxCtrl', ['$scope', function ($scope) {
            var ctrl = this;
            ctrl.isChecked = false;

        }]);
});