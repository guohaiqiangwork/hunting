/*
 * mc.bakery
 * Version: 0.0.2 - 2017-06-06
 * License: MIT
 */
angular.module("mc.bakery", ["mc.bakery.tpls","mc.bakery.actionButton","mc.bakery.buttonGroup","mc.bakery.dropdown","mc.bakery.stepGuide","mc.bakery.toggle","mc.bakery.selectAll"]);
angular.module("mc.bakery.tpls", ["template/mc/dropdown/dropdown.tpl.html","template/mc/toggle/toggle.tpl.html","template/mc/stepGuide/step.guide.tpl.html","template/mc/stepGuide/step.tpl.html","template/mc/toggle/toggle.tpl.html"]);
angular.module('mc.bakery.actionButton', [])

    .controller('mcActionButtonCtrl', [function() {
        var ctrl = this;

        ctrl.callback = angular.noop();
        ctrl.confirmBeforeAction = false;   //是否要在执行action前再次确认
        ctrl.confirmDelay = undefined;           //延时几秒后取消确认
        ctrl.confirmTimeout = undefined;
        ctrl.confirmed = false;
        ctrl.confirmText = undefined;

        ctrl.originalText = '';
        ctrl.originalClasses = [];

    }])

    .directive('mcActionButton', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
        return {
            restrict: 'A',
            require: 'mcActionButton',
            scope: true,
            controller: 'mcActionButtonCtrl',
            link: function(scope, element, attrs, ctrl) {

                var cfg = {
                    spinnerTpl: '<span class="glyphicon"></span>',
                    priority: 0,
                    disableBtn: true,
                    confirmDelay: 3000,
                    confirmText: '确定',
                    btnLoadingClass: 'is-loading',
                    addClassToCurrentBtnOnly: false,
                    disableCurrentBtnOnly: false,
                    minDuration: false,
                    CLICK_EVENT: 'click',
                    CLICK_ATTR: 'ngClick',
                    SUBMIT_EVENT: 'submit',
                    SUBMIT_ATTR: 'ngSubmit',
                    BTN_SELECTOR: 'button'
                };

                var promiseWatcher;
                var minDurationTimeout;
                var minDurationTimeoutDone;
                var promiseDone;

                function initLoadingState(btnEl) {
                    if (cfg.btnLoadingClass && !cfg.addClassToCurrentBtnOnly) {
                        btnEl.addClass(cfg.btnLoadingClass);
                    }
                    if (cfg.disableBtn && !cfg.disableCurrentBtnOnly) {
                        btnEl.attr('disabled', 'disabled');
                    }
                }

                function appendSpinnerTpl(btnEl) {
                    btnEl.append($compile(cfg.spinnerTpl)(scope));
                }

                function handleLoadingFinished(btnEl) {
                    if ((!cfg.minDuration || minDurationTimeoutDone) && promiseDone) {
                        if (cfg.btnLoadingClass) {
                            btnEl.removeClass(cfg.btnLoadingClass);
                        }
                        if (cfg.disableBtn) {
                            btnEl.removeAttr('disabled');
                        }
                    }

                    if(ctrl.confirmBeforeAction) {
                        restoreOriginalButton(btnEl);
                    }

                }

                function initHandlingOfViewFunctionsReturningAPromise(eventToHandle, attrToParse, btnEl) {
                    // we need to use evalAsync here, as
                    // otherwise the click or submit event
                    // won't be ready to be replaced
                    scope.$evalAsync(function() {
                        ctrl.callback = $parse(attrs[attrToParse]);

                        // unbind original click event
                        element.unbind(eventToHandle);

                        // rebind, but this time watching it's return value
                        element.bind(eventToHandle, function(event) {
                            // Make sure we run the $digest cycle
                            scope.$apply(function() {
                                // execute function on parent scope
                                // as we're in an isolate scope here

                                var promise = ctrl.callback(scope.$parent, {$event: event});

                                // only init watcher if not done before
                                if (!promiseWatcher) {
                                    promiseWatcher = initPromiseWatcher(function() {
                                        return promise;
                                    }, btnEl);
                                }
                            });
                        });
                    });
                }

                function initPromiseWatcher(watchExpressionForPromise, btnEl) {
                    // watch promise to resolve or fail
                    scope.$watch(watchExpressionForPromise, function(mVal) {
                        minDurationTimeoutDone = false;
                        promiseDone = false;

                        // create timeout if option is set
                        if (cfg.minDuration) {
                            minDurationTimeout = $timeout(function() {
                                minDurationTimeoutDone = true;
                                handleLoadingFinished(btnEl);
                            }, cfg.minDuration);
                        }

                        // for regular promises
                        if (mVal && mVal.then) {

                            if(ctrl.confirmBeforeAction && !ctrl.confirmed) {
                                mVal.cancel();
                                setConfirmButton(btnEl);
                            } else {
                                initLoadingState(btnEl);
                                mVal.then(function() {
                                        promiseDone = true;
                                        handleLoadingFinished(btnEl);
                                    },
                                    function() {
                                        promiseDone = true;
                                        handleLoadingFinished(btnEl);
                                    }
                                );
                            }
                        }
                    });
                }

                function addHandlersForCurrentBtnOnly(btnEl) {
                    // handle current button only options via click
                    if (cfg.addClassToCurrentBtnOnly) {
                        btnEl.on(cfg.CLICK_EVENT, function() {
                            btnEl.addClass(cfg.btnLoadingClass);
                        });
                    }

                    if (cfg.disableCurrentBtnOnly) {
                        btnEl.on(cfg.CLICK_EVENT, function() {
                            btnEl.attr('disabled', 'disabled');
                        });
                    }
                }

                function restoreOriginalButton(btnEl) {
                    ctrl.confirmed = false;
                    btnEl[0].innerText = ctrl.originalText;
                    btnEl.attr('class', ctrl.originalClasses);
                    addHandlersForCurrentBtnOnly(btnEl);
                    initHandlingOfViewFunctionsReturningAPromise(cfg.CLICK_EVENT, cfg.CLICK_ATTR, element)
                }

                function startConfirmTimeout(btnEl) {
                    ctrl.confirmTimeout = $timeout(function() {
                        restoreOriginalButton(btnEl);
                    }, ctrl.confirmDelay);
                }

                function setConfirmButton(btnEl) {
                    btnEl.addClass('btn-danger');
                    btnEl[0].innerText = ctrl.confirmText;
                    startConfirmTimeout(btnEl);
                    btnEl.bind(cfg.CLICK_EVENT, function() {
                        scope.$apply(function() {

                            ctrl.confirmed = true;
                            initLoadingState(btnEl);
                            $timeout.cancel(ctrl.confirmTimeout);

                            var promise = ctrl.callback(scope.$parent, {$event: event});

                            // only init watcher if not done before
                            if (!promiseWatcher) {
                                promiseWatcher = initPromiseWatcher(function() {
                                    return promise;
                                }, btnEl);
                            }
                        })
                    })
                }

                ctrl.confirmBeforeAction = scope.$eval(attrs.confirm) || false;
                ctrl.confirmDelay = scope.$eval(attrs.confirmDelay) || cfg.confirmDelay;

                ctrl.originalClasses = attrs['class'];
                ctrl.confirmText = attrs.confirmText || cfg.confirmText;

                ctrl.originalText = element[0].innerText;

                if(attrs.hasOwnProperty('ngClick')) {
                    appendSpinnerTpl(element);
                    addHandlersForCurrentBtnOnly(element);
                    initHandlingOfViewFunctionsReturningAPromise(cfg.CLICK_EVENT, cfg.CLICK_ATTR, element);
                }

                scope.$on('$destroy', function() {
                    $timeout.cancel(minDurationTimeout);
                });
            }
        }
    }]);
angular.module('mc.bakery.buttonGroup', [])
/**
 * <mc-ok-button b-value="{{myValue}}" b-selected-color="#4E3121" b-on-click="okOnClick(index,data)"></mc-ok-button>
 * value：内容
 * isCilck：是否选中，默认不选中
 * b-selected-color: 选中时颜色，默认#53AB6E
 * b-on-click：选择按钮是进行回调
 * 例子：
 * $scope.myValue = [{value:"1111",isCilck:true},"222222","33333333"];
 * $scope.myValue = {value:"1111",isCilck:true};
 * $scope.myValue = "222222";
 */
    .directive('mcButtonGroup', ['$parse', function ($parse) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'template/mc/buttonGroup/button.group.tpl.html',
            scope: {
                bValue: "@", // 内容
                bSelectedColor: "@", // 选中颜色
                bOnClick: "&" // 点击回调
            },
            link: function (scope, element, attrs) {
                // 界面使用的数组
                scope.myData = [];
                // 解析bValue所得数据
                var data = undefined;
                // 按钮样式
                var btnStyle = undefined;
                // 对勾样式
                var okStyle = undefined;
                // 最后一次的选择
                var lastIndex = undefined;
                // 是否为数组
                var isArray = false;

                /**
                 * 按钮样式
                 * @param isCilck
                 * @returns {{position: string, padding-top: string, padding-bottom: string, padding-left: string, padding-right: string, background: string, border: string}}
                 */
                function getBStyle(isCilck) {
                    var color = scope.bSelectedColor || "#53AB6E";
                    return {
                        "position": "relative",
                        // "padding-top": "10px",
                        // "padding-bottom": "10px",
                        "padding": "6px 30px",
                        // "padding-right": "30px",
                        "margin":"0 0 0 30px",
                        "background": "white",
                        "border": isCilck ? "3px solid " + color : "3px rgb(183, 183, 183) solid"
                    }
                }

                /**
                 * 获取对勾样式
                 * @returns {{position: string, padding: string, top: string, left: string, color: string, background-color: (string|string)}}
                 */
                function getOKStyle() {
                    return {
                        "position": "absolute",
                        "padding": "2px",
                        "top": "0px",
                        "left": "0px",
                        "color": "white",
                        "background-color": scope.bSelectedColor || "#53AB6E"
                    }
                }

                /**
                 * 鼠标点击事件
                 * @param index
                 */
                scope.onMousedown = function (index) {
                    var item = undefined;
                    var selectedColor = "#53AB6E";
                    // 不是数组或不是选择自己的情况下
                    if (!isArray || index !== lastIndex) {
                        item = scope.myData[index];
                        scope.myData[index].isCilck = !item.isCilck;
                        selectedColor = scope.bSelectedColor || "#53AB6E";
                        // 更改颜色
                        scope.myData[index].btnStyle.border = item.isCilck ? "3px solid " + selectedColor : "3px rgb(183, 183, 183) solid";
                        // 方法回调
                        scope.bOnClick({index: index, data: scope.myData[index].data});
                    }
                    // 数组并且存在选择
                    if (isArray && lastIndex !== undefined && index !== lastIndex) {
                        item = scope.myData[lastIndex];
                        scope.myData[lastIndex].isCilck = !item.isCilck;
                        selectedColor = scope.bSelectedColor || "#53AB6E";
                        // 更改颜色
                        scope.myData[lastIndex].btnStyle.border = item.isCilck ? "3px solid " + selectedColor : "3px rgb(183, 183, 183) solid";
                    }
                    lastIndex = index;
                };
                // 数据为数组
                if (scope.bValue.indexOf("[") >= 0 && scope.bValue.indexOf("]") >= 0) {
                    isArray = true;
                    data = JSON.parse(scope.bValue);
                    // 循环添加数据
                    for (var i = 0; i < data.length; i++) {
                        // 初始化索引
                        if (data[i].isCilck) {
                            lastIndex = i;
                        }
                        // 得到样式
                        btnStyle = getBStyle(data[i].isCilck);
                        okStyle = getOKStyle();
                        // 放入数组
                        scope.myData.push({
                            value: data[i].value || data[i], // 内容,不是对象就是字符串
                            isCilck: data[i].isCilck, // 是否点击
                            btnStyle: btnStyle,// 按钮样式
                            okStyle: okStyle,// 对勾样式
                            data: data[i]
                        });
                    }
                } else if (scope.bValue.indexOf("{") >= 0 && scope.bValue.indexOf("}") >= 0) { // 传入对象
                    lastIndex = 0;
                    data = JSON.parse(scope.bValue);
                    // 得到样式
                    btnStyle = getBStyle(data.isCilck);
                    okStyle = getOKStyle();
                    // 放入数组
                    scope.myData.push({
                        value: data.value, // 内容
                        isCilck: data.isCilck, // 是否点击
                        btnStyle: btnStyle, // 按钮样式
                        okStyle: okStyle,// 对勾样式
                        data: data
                    });
                } else {// 数据为字符串
                    lastIndex = 0;
                    // 得到样式
                    btnStyle = getBStyle(false);
                    scope.myData.push({
                        value: scope.bValue, // 内容
                        isCilck: false, // 是否点击
                        btnStyle: btnStyle,
                        data: scope.bValue
                    });
                }
            }
        }
    }]);
angular.module('mc.bakery.dropdown', [])

    .controller('mcDropdownCtrl', [function() {
        var ctrl = this;

        ctrl.open = false;
        ctrl.toggle = function() {
            ctrl.open = !ctrl.open;

        };
    }])

    .directive('mcDropdown', ['$document', function($document) {
        return {
            restrict: 'A',
            require: 'mcDropdown',
            templateUrl: 'template/mc/dropdown/dropdown.tpl.html',
            scope: true,
            replace: true,
            transclude: true,
            controller: 'mcDropdownCtrl',
            controllerAs: '$dropdown',
            link: function(scope, element, attrs, $dropdown, transcludeFn) {

                    transcludeFn(scope, function(clone) {
                        clone.addClass('dropdown-menu');
                        element.append(clone);
                    });

                    function onDocumentClick(e) {
                        if (!$dropdown.open) return; //Skip it if dropdown is close

                        var contains = false;

                        if (window.jQuery) {
                            // Firefox 3.6 does not support element.contains()
                            // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
                            contains = window.jQuery.contains(element[0], e.target);
                        } else {
                            contains = element[0].contains(e.target);
                        }

                        if(!contains) {
                            close(e);
                        }
                    }

                    function close(e) {
                        $dropdown.open = false;
                        scope.$digest();
                    }

                    element.querySelectorAll('li').bind('click', close);

                    // See Click everywhere but here event http://stackoverflow.com/questions/12931369
                    $document.on('click', onDocumentClick);

                    scope.$on('$destroy', function() {
                        $document.off('click', onDocumentClick);
                        element.querySelectorAll('li').off('click', close)
                    });

                }
            }
    }]);
angular.module('mc.bakery.stepGuide', [])

    .directive('mcStep', [function() {
        return {
            restrict: 'A',
            require: '^mcStepGuide',
            scope: {
                'stepIndex':'@',
                'stepLabel':'@'
            },
            templateUrl: 'template/mc/stepGuide/step.tpl.html',
            compile: function(tElement) {

                return function(scope, element, attrs, ctrl) {
                    scope.$steps = ctrl;
                }
            }
        }
    }])

    .directive('mcStepGuide', ['$compile', function($compile) {
        return {
            restrict: 'A',
            templateUrl: 'template/mc/stepGuide/step.guide.tpl.html',
            require: 'mcStepGuide',
            transclude: true,
            controller: function(){
                var ctrl = this;
                this.step = 0;
            },
            controllerAs: '$steps',
            replace: true,
            compile: function(tElement) {
                tElement.append('<div class="mc-step-line"></div>');

                return function(scope, element, attrs, ctrl, transcludeFn) {

                    var $steps = ctrl;

                    transcludeFn(scope, function(clone) {
                        var transcluded = angular.element('<div>').append(clone);

                        var steps = transcluded.querySelectorAll('li');

                        for(var i=0; i<steps.length; i++) {
                            var step = angular.element(steps[i]);
                            step.attr('step-index', i+1);
                            step.attr('step-label', step[0].innerText);
                            step.attr('mc-step','');
                        }

                        element.append($compile(transcluded)(scope));
                    });

                    attrs.$observe('step', function(step) {
                        $steps.step = step;
                    });
                }
            }
        }
    }]);

angular.module('mc.bakery.toggle', [])

    .controller('toggleCtrl', [function() {

            var ctrl = this;

            ctrl.isOn = undefined;

            ctrl.toggle = function() {
                ctrl.isOn = !ctrl.isOn;
            }

    }])
    .directive('mToggle', [function () {
            return {
                require: ['mToggle', 'ngModel'],
                restrict: 'EA',
                templateUrl: 'template/mc/toggle/toggle.tpl.html',
                controller: 'toggleCtrl',
                controllerAs: '$toggle',
                link:function(scope, element, attrs, ctrls) {

                    var $toggle = ctrls[0];
                    var ngModel = ctrls[1];

                    ngModel.$render = function() {
                        $toggle.isOn = ngModel.$viewValue;
                    };

                    //Update viewValue if model change
                    scope.$watch('$toggle.isOn', function(newValue) {
                        if (ngModel.$viewValue !== newValue && angular.isDefined(newValue))
                            ngModel.$setViewValue(newValue);
                    });
                }
            }
    }])
    .directive('mcToggle', [function () {
            return {
                require: 'ngModel',
                restrict: 'EA',
                compile:function(tElement, tAttrs) {

                    tElement.after('<div m-toggle ng-model="' + tElement.attr("ng-model") + '"></div>');

                    return function(scope, element) {
                        element.remove();
                    }
                }
            }
    }]);

angular.module('mc.bakery.selectAll',[])
    .directive('mcCheckboxOne', ['$parse', function ($parse) {
        return {
            require: 'ngModel',
            restrict:'AC',
            link: function (scope, element, attrs) {

                scope.$on('checkAllInputsChanged',function(){
                    $parse(attrs['ngModel']).assign(scope, element[0].checked);
                    scope.$apply();
                });

            }
        };
    }])
    .directive('mcCheckboxAll', ['$parse', function ($parse) {
        return {
            require: 'ngModel',
            restrict:'AC',
            compile:function(tElement, tAttrs){

                return function(scope, element, attrs){

                    scope.$watch($parse(attrs['ngModel'].split('.')[0]),function(newValue,oldValue){
                        scope.$broadcast('checkInputsDataChanged');
                    });

                    scope.$on('checkInputsChanged',function(){
                        $parse(attrs['ngModel']).assign(scope, element[0].checked);
                    });
                }
            }
        };
    }])
    .directive('mcSelectAll',['$parse','$timeout',function($parse,$timeout){
        return {
            restrict:"A",
            compile:function(tElement, tAttrs) {

                return function(scope, element,attr) {

                    scope.$on('checkInputsDataChanged',function(){
                        init();
                    });

                    function init(){
                        $timeout(function(){
                            var root = element[0];
                            var checkOneInputs=[];
                            var checkAllInput={};

                            //递归遍历所有dom节点
                            function traverseNodes(node){

                                //判断是否是元素节点
                                if(node.nodeType == 1){
                                    //判断复选框
                                    if(node.className.indexOf('mc-checkbox-one')>-1){
                                        checkOneInputs.push(node);
                                    }
                                    //判断全选框
                                    if(node.className.indexOf('mc-checkbox-all')>-1){
                                        checkAllInput=node;
                                        //全选框添加change事件
                                        checkAllInput.onchange=function(){
                                            angular.forEach(checkOneInputs,function(item){
                                                item.checked=checkAllInput.checked;
                                            });
                                            scope.$broadcast('checkAllInputsChanged');
                                        }
                                    }

                                    //判断该元素节点是否有子节点
                                    if(node.hasChildNodes){
                                        if(node.children.length>0){
                                            //得到所有的子节点
                                            var sonnodes = node.children;
                                            if(sonnodes.length>0)
                                            //遍历所哟的子节点
                                                for (var i = 0; i < sonnodes.length; i++) {
                                                    //得到具体的某个子节点
                                                    var sonnode = sonnodes.item(i);
                                                    //递归遍历
                                                    traverseNodes(sonnode);
                                                }
                                        }

                                    }
                                }
                            }
                            //遍历所有的dom节点
                            traverseNodes(root);

                            //为所有复选框添加change事件
                            angular.forEach(checkOneInputs,function(target){
                                target.onchange=function(){
                                    checkAllInput.checked=checkOneInputs.every(function(item){return item.checked});
                                    $timeout(function(){
                                        scope.$broadcast('checkInputsChanged');
                                    });
                                };
                            });
                        },100);
                    }

                    init()

                }
            }
        }
    }]);

angular.module("template/mc/dropdown/dropdown.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/mc/dropdown/dropdown.tpl.html",
        "<div class=\"dropdown\" ng-class=\"{open: $dropdown.open}\">\n"+
        "<button id=\"dLabel\" type=\"button\" ng-click=\"$dropdown.toggle()\" class=\"btn btn-link\" aria-haspopup=\"true\" aria-expanded=\"false\">\n"+
        "<span class=\"glyphicon glyphicon-option-horizontal\"></span>\n"+
        "</button>\n"+
        "</div>\n"+
        "");
}]);
angular.module("template/mc/toggle/toggle.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/mc/toggle/toggle.tpl.html",
        "<div class=\"toggle toggle-sm toggle-off\" ng-class=\"{'toggle-on': $toggle.isOn, 'toggle-off': !$toggle.isOn}\" ng-click=\"$toggle.toggle()\">\n"+
        "<label class=\"toggle-radio\">\n"+
        "<div class=\"toggle-handle\"></div>\n"+
        "</label>\n"+
        "<label class=\"toggle-radio\"></label>\n"+
        "</div>\n"+
        "");
}]);
angular.module("template/mc/stepGuide/step.guide.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/mc/stepGuide/step.guide.tpl.html",
        "<div class=\"mc-step-wrapper\"></div>\n"+
        "");
}]);
angular.module("template/mc/stepGuide/step.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/mc/stepGuide/step.tpl.html",
        "<div class=\"mc-step\" ng-class=\"{'active':$steps.step>=stepIndex}\">{{stepIndex}}</div>\n"+
        "<div class=\"mc-step-label\">{{stepLabel}}</div>\n"+
        "");
}]);