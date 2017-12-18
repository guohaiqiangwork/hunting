define([], function () {

    angular.module('mc.sample', [])
        .controller('mcMultiEditorCtrl', ['mcMultiEditorCacheService', '$scope', '$rootScope', '$state', '$timeout', 'localStorageService',
            function (mcMultiEditorCacheService, $scope, $rootScope, $state, $timeout, localStorageService) {

                var ctrl = this;
                // 缓存若没有则在本地数据库中获取
                ctrl.documents = mcMultiEditorCacheService.getCache().length > 0 ? mcMultiEditorCacheService.getCache() : localStorageService.get('mc_documents') ? localStorageService.get('mc_documents') : [];
                ctrl.layout = undefined;
                ctrl.activeIndex = undefined;
                // 总宽度
                ctrl.totalWidth = 0;
                // li样式宽度
                ctrl.width = {
                    'width': '150px'
                };
                // 要关闭的标签名称
                ctrl.closeName = undefined;

                //判断是否已经打开

                var _isOpen = function (document) {

                    if (!ctrl.documents)
                        return false;

                    var _found = false;

                    $.each(ctrl.documents, function (index, _document) {
                        if (_document.state === document.state && !document.multiple || _document.id === document.id) {
                            ctrl.activeIndex = index;
                            _found = true;
                            return false
                        }
                    });

                    return _found;
                };

                ctrl.openDocument = function (document) {

                    if (_isOpen(document))
                        return false;

                    document.id = Date.now();

                    if (document.params && !document.params.option)
                        document.params.option = {};

                    document.params.option.cache = document.id;
                    document.params.option = JSON.stringify(document.params.option);

                    //呈报发起
                    if(document.params.reportingItemId && JSON.parse(document.params.reportingItemId).taskId === '00002'){
                        return false
                    }

                    ctrl.documents.push(document);
                    // 设置当前索引
                    ctrl.activeIndex = ctrl.documents.length - 1;
                    localStorageService.set('mc_documents', ctrl.documents);
                };

                ctrl.switchDocument = function (index) {
                    if (ctrl.documents.length <= index - 1 || ctrl.activeIndex === index)
                        return;

                    ctrl.activeIndex = index;
                    $state.go(ctrl.documents[index].state.replace("核损排班", "").replace("核价排班", "").replace("核赔排班", "").replace("待办事项处理", ""), ctrl.documents[index].params, {reload: true});
                };

                ctrl.closeDocument = function (index) {
                    ctrl.calculatedWidth();
                    if (ctrl.documents.length === 0 || ctrl.documents.length < index)
                        return;

                    if (ctrl.documents[index].onCloseCallback && !ctrl.documents[index].onCloseCallback()) {
                        return;
                    }

                    $timeout(function () {
                        ctrl.documents.splice(index, 1);
                        localStorageService.set('mc_documents', ctrl.documents);
                    },100);

                    if (ctrl.documents.length === 0) {
                        // $state.go('dashboard');
                    } else {
                        if (index == ctrl.activeIndex) {
                            ctrl.switchDocument(index > 0 ? index - 1 : 0);
                        } else if (index < ctrl.activeIndex) {
                            ctrl.activeIndex = ctrl.activeIndex - 1;
                        }
                    }
                    return false;
                };

                // 监测当前路由名称
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    ctrl.calculatedWidth();
                    // 去除登录,去除理赔首页
                    if (toState.name === "login") {
                        return
                    }

                    var document = {
                        id: undefined,
                        label: toState.name
                    };

                    if (toParams.option) {
                        if (typeof(toParams.option) === 'string')
                            toState.option = JSON.parse(toParams.option);
                        document.id = toState.option.cache;
                    }
                    document.state = toState.name;
                    document.params = toParams;

                    if (toState.multiEditor) {
                        document.label = toState.multiEditor.label;
                        document.multiple = toState.multiEditor.multiple;
                        if (toState.name === "scheduling") {
                            switch (toParams.type) {
                                case "104":
                                    document.state = toState.name + "核损排班";
                                    document.label = "核损排班";
                                    document.multiple.label = "核损排班";
                                    break;
                                case "105":
                                    document.state = toState.name + "核价排班";
                                    document.label = "核价排班";
                                    document.multiple.label = "核价排班";
                                    break;
                                case "116":
                                    document.state = toState.name + "核赔排班";
                                    document.label = "核赔排班";
                                    document.multiple.label = "核赔排班";
                                    break;
                            }
                        }
                        if(toState.name === "reportingItem"){
                            if(JSON.parse(toParams.reportingItemId).taskId == '00001'
                                ||JSON.parse(toParams.reportingItemId).taskId == '00003'){
                                document.state = toState.name + "待办事项处理";
                                document.label = "待办事项处理";
                            }
                            if(JSON.parse(toParams.reportingItemId).taskId == '00002'){
                                document.state = toState.name + "待办事项发起";
                                document.label = "待办事项发起";
                            }
                        }
                    }

                    ctrl.openDocument(document);

                });
                /**
                 * 计算li宽度
                 */
                ctrl.calculatedWidth = function () {
                    if (ctrl.documents.length > 0) {
                        var width = ctrl.totalWidth / ctrl.documents.length;
                        if (width > 150) {
                            ctrl.width.width = 150 + "px";
                        } else {
                            ctrl.width.width = width + "px";
                        }
                    }
                };

            }])
        .directive('mcMultiEditor', ['$compile', '$parse', '$timeout', '$document',
            function ($compile, $parse, $timeout, $document) {
                return {
                    require: 'mcMultiEditor',
                    restrict: 'EA',
                    scope: true,
                    replace: true,
                    templateUrl: 'template/mc/multiEditor/multi.editor.tpl.html',
                    controller: 'mcMultiEditorCtrl',
                    controllerAs: '$editor',
                    compile: function (tElement, tAttrs) {


                        return function (scope, element, attrs, $editor) {

                            $editor.totalWidth = element[0].offsetWidth * 0.8;

                            attrs.$observe('layout', function (layout) {
                                if ($editor.layout !== layout) {
                                    $editor.layout = layout || 'scrollspy';
                                    $editor.switchDocument($editor.activeIndex || 0);
                                }

                            });
                            // 关闭标签
                            attrs.$observe('label', function (closeName) {
                                if ($editor.closeName !== closeName) {
                                    $editor.closeName = closeName;
                                    // 循环确定删除
                                    $.each($editor.documents, function (index, document) {
                                        if (document.multiple.label === closeName || document.label === closeName) {
                                            $editor.closeDocument(index);
                                            return false;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            }])
        .factory('mcMultiEditorCacheService', [
            function () {

                var cache = [];
                return {
                    getCache: function () {
                        return cache;
                    },
                    getDocument: function (id) {
                        var found = undefined;

                        $.each(cache, function (index, document) {
                            if (document.id == id) {
                                found = document;
                                return false;
                            }
                        });

                        return found;
                    }
                }

            }]);
});

