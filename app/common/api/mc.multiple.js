define([
    'constants',
    'layer',
    'angular',
    'common/api/mc.checkbox',
    'common/api/mc.sample'
], function (constants, layer) {
    /**
     * @description
     * ui 指令
     *
     */
    angular.module('mc.multiple', [
        'mc.checkbox',
        'mc.sample'
    ])
        .controller("direCtrl", function ($scope) {
        })
        .directive("inputDire", function () {
            return {
                restrict: "AE",
                require: "ngModel",
                link: function (scope, elem, attr, ngModelCtr) {
                    ngModelCtr.$formatters.push(function (modelValue) {
                        if (typeof modelValue != "undefined") {
                            //返回字符串给view,不改变模型值
                            return modelValue;
                        }
                    })
                }
            }
        })
        /**
         * ng-repeat刷新完毕后调用
         */
        .directive('onFinishRenderFilters', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        scope.$emit('ngRepeatFinished');
                    }
                }
            };
        })
        //表单验证
        .directive('multipleForm', ['$timeout', '$compile', '$rootScope', function ($timeout, $compile, $rootScope) {
            return {
                restrict: 'AE',
                scope: {
                    isVerification: '=', // 是否验证通过
                    isComplete: '=', // 是否完成
                    cueWay: '@', // 错误文字提示方式
                    result: "&" // 校验完成返回
                    // checkIndex: "=" // 要检测的部分
                },
                compile: function () {
                    return function (scope, element, attrs) {

                        //是否修改输入框
                        var isChange = {
                            checkIndexAll: []
                        };
                        // 必填项节点
                        var requireNodes = {
                            checkIndexAll: []
                        };

                        // 是否开始校验
                        scope.isBeginWatch = false;

                        scope.$watch(function () {
                            return scope.isComplete
                        }, function (v) {
                            // 未开始校验
                            if (!scope.isBeginWatch) {
                                scope.isBeginWatch = true;
                            } else {
                                return;
                            }
                            // 500毫秒后可进行下次校验
                            setTimeout(function () {
                                scope.isBeginWatch = false;
                            }, 500);
                            // 确认完成
                            if (v) {
                                isComplete();
                            }
                        });

                        /**
                         * 是否完成
                         */
                        function isComplete() {
                            scope.checkIndex = typeof scope.checkIndex === "number" ? scope.checkIndex + "" : scope.checkIndex ? scope.checkIndex : "checkIndexAll";
                            // 不知道为什么isChange[scope.checkIndex]有时候有值长度却是0,
                            if (isChange[scope.checkIndex] && isChange[scope.checkIndex].length === 0) {
                                // 清空
                                //是否修改输入框
                                isChange = {
                                    checkIndexAll: []
                                };
                                // 必填项节点
                                requireNodes = {
                                    checkIndexAll: []
                                };
                                chackNode(element[0]);
                                isRun = false;
                            }
                            var isPass = true;
                            //循环必填项判断是否填写完毕
                            $.each(isChange[scope.checkIndex], function (index, item) {
                                if (!rulesIsVerification(requireNodes[scope.checkIndex][index], scope.checkIndex)) {
                                    // 定位到未填写的node
                                    requireNodes[scope.checkIndex][index].scrollIntoView();
                                    if(scope.isComplete!==undefined){
                                        scope.isComplete = false;
                                    }
                                    isPass = false;
                                    layerAlter(requireNodes[scope.checkIndex][index]);
                                    return false;
                                }
                            });
                            // 通过
                            if (isPass) {
                                if (scope.isVerification !== undefined) {
                                    scope.isVerification = true;
                                    // 验证通过，回调方法
                                    scope.result();
                                    // try {
                                    //     scope.$apply(function () {
                                    //         scope.isVerification = true;
                                    //     });
                                    // } catch (e) {
                                    //     scope.isVerification = true;
                                    // }
                                } else {
                                    // 验证通过，回调方法
                                    scope.result();
                                }
                            } else if (scope.isVerification !== undefined) {
                                scope.isVerification = false;
                            }
                        }

                        // 弹框提示错误信息
                        function layerAlter(node) {
                            if (scope.cueWay === "layer") {
                                //循环节点属性
                                $.each(node.attributes, function (index, attribute) {
                                    //添加错误提示文字
                                    if (attribute.name === 'err-text') {
                                        if (attribute.value) {
                                            layer.msg(attribute.value, {time: 3000});
                                        }
                                        return false;
                                    }
                                });
                            }
                        }

                        /**
                         * 规则是否验证通过
                         * @param node
                         * @param checkIndex
                         * @returns {boolean}
                         */
                        function rulesIsVerification(node, checkIndex) {
                            var isVerification = true, myRules;
                            //判断属性rule是否存在
                            if (node.getAttribute('rule')) {
                                myRules = splitText(node.getAttribute('rule'));
                                if (myRules && myRules.length > 0) {
                                    var value = "";
                                    //循环判断是否复核规则
                                    $.each(myRules, function (index, rule) {
                                        if (!value) {
                                            if (node.nodeName === "DIV") {
                                                value = getDataDiv(node);
                                            } else if (node.nodeName === "SELECT") {
                                                value = node.getAttribute('value');
                                            } else {
                                                value = node.value;
                                            }
                                            if (rule.title === "number" && rule.content === "int") {
                                                value = value.replace(/\D/g, '');
                                            }
                                        }
                                        //有一个条件不满足就停止执行
                                        if (!ruleJudge(node, rule, value, checkIndex)) {
                                            isVerification = false;
                                            return false;
                                        }
                                    });
                                }
                            }
                            return isVerification;
                        }

                        /**
                         * 对象是否 存在
                         * @param str
                         * @returns {boolean}
                         */
                        function isObj(str) {
                            if (str == null || typeof(str) == 'undefined')
                                return false;
                            return true;
                        }

                        /**
                         * 去除字符串中的空格
                         * @param str
                         * @returns {*}
                         */
                        function strTrim(str) {
                            if (!isObj(str))
                                return 'undefined';
                            str = str + "";
                            str = str.replace(/^\s+|\s+$/g, '');
                            return str;
                        }

                        /**
                         * 必需是整数
                         * @param str
                         * @returns {boolean}
                         */
                        function isInt(str) {
                            var reg = /^(-|\+)?\d+$/;
                            return str.match(reg);
                        }

                        /**
                         * 分离规则
                         * @param _rules
                         * @returns {Array}
                         */
                        function splitText(_rules) {
                            var myRules = [];
                            if (_rules) {
                                // 转换为小写后根据“;”区分多个条件
                                var rules = _rules.toLowerCase().split(';');
                                if (rules.length > 0) {
                                    //循环规则
                                    $.each(rules, function (index, rule) {
                                        //根据“:”区分规则头和内容
                                        var ruleContent = rule.split(':');
                                        //判断是否存在内容
                                        if (ruleContent.length > 1) {
                                            myRules.push({title: ruleContent[0], content: ruleContent[1]})
                                        } else if (ruleContent.length = 1 && "" !== ruleContent[0]) {
                                            myRules.push({title: ruleContent[0], content: ""})
                                        }
                                    });
                                }
                            }
                            return myRules;
                        }

                        /**
                         * 存储输入框是否通过验证
                         * @param myRules
                         * @param node
                         * @param checkIndex
                         */
                        function getIsChange(myRules, node, checkIndex) {
                            //初始化判断是否有不能为空的
                            $.each(myRules, function (index, rule) {
                                if (rule.title === 'require') {//不能为空
                                    //给当前节点target赋值
                                    $timeout(function () {
                                        var value = "";
                                        if (node.nodeName === "DIV") {
                                            value = getDataDiv(node);
                                        } else {
                                            value = node.value;
                                        }
                                        // 存在索引则存储
                                        if (checkIndex) {

                                            if (!requireNodes[checkIndex]) requireNodes[checkIndex] = [];
                                            // 对应索引数组存储节点
                                            requireNodes[checkIndex].push(node);

                                            if (!isChange[checkIndex]) isChange[checkIndex] = [];
                                            // 存储两个
                                            node.target = isChange.checkIndexAll.length + "-" + isChange[checkIndex].length;
                                            if (value.length > 0) {
                                                //存储是否修改书输入框
                                                isChange[checkIndex].push(true);
                                            } else {
                                                //存储是否修改书输入框
                                                isChange[checkIndex].push(false);
                                            }
                                        } else {
                                            node.target = isChange.checkIndexAll.length;
                                        }
                                        if (value.length > 0) {
                                            //存储是否修改书输入框
                                            isChange.checkIndexAll.push(true);
                                        } else {
                                            //存储是否修改书输入框
                                            isChange.checkIndexAll.push(false);
                                        }
                                        // 全部索引数组存储节点
                                        requireNodes.checkIndexAll.push(node);
                                    }, 100);
                                    return false;
                                }
                            });
                        }

                        /**
                         * 值发生改变
                         * @param thatNode
                         * @param myRules
                         * @param errText
                         * @param checkIndex
                         */
                        function valueChange(thatNode, myRules, errText, checkIndex) {
                            var isVerification = true;
                            if (myRules.length > 0) {
                                var value = "";
                                //循环判断是否复核规则
                                $.each(myRules, function (index, rule) {
                                    if (thatNode.nodeName === "DIV") {
                                        value = getDataDiv(thatNode);
                                    } else {
                                        value = thatNode.value;
                                    }
                                    if (rule.title === "number" && rule.content === "int") {
                                        value = value.replace(/\D/g, '');
                                    }
                                    //有一个条件不满足就停止执行
                                    if (!ruleJudge(thatNode, rule, value, checkIndex)) {
                                        isVerification = false;
                                        //添加错误提示文字
                                        if (errText && scope.cueWay !== "layer") {
                                            errText.appendTo(thatNode.parentElement);
                                        }
                                        return false;
                                    }
                                    //删除节点
                                    if (errText && scope.cueWay !== "layer") {
                                        errText.remove();
                                    }
                                });
                                if (scope.isVerification !== undefined) {
                                    scope.isVerification = isVerification;
                                    // try {
                                    //     scope.$apply(function () {
                                    //         scope.isVerification = isVerification;
                                    //     });
                                    // } catch (e) {
                                    //     scope.isVerification = isVerification;
                                    // }
                                }
                            }
                        }

                        /**
                         * 返回node中data-div
                         * @param node
                         */
                        function getDataDiv(node) {
                            for (var i = 0; i < node.attributes.length; i++) {
                                if (node.attributes[i].name === 'data-div') {
                                    return node.attributes[i].value;
                                }
                            }
                        }

                        /**
                         * 循环节点添加事件
                         * @param node
                         */
                        function chackNode(node) {
                            //节点是输入框，防止IE8因为ng-if引起的报错
                            if (node.nodeName !== '#comment' && ((node.nodeName === 'INPUT' && node.type !== 'radio')
                                    || node.nodeName === 'SELECT'
                                    || node.nodeName === 'TEXTAREA'
                                    || node.nodeName === 'DIV')) {
                                if (node.attributes.length > 0) {
                                    //错误文字信息,检查索引
                                    var errText, checkIndex;
                                    //循环节点属性
                                    $.each(node.attributes, function (index, attribute) {
                                        //判断属性为rule
                                        if (attribute.name === 'rule') {
                                            // 找到规则属性后，查询其余属性
                                            //添加错误提示文字
                                            if (node.getAttribute('err-text')) {
                                                errText = $('<span style="color: red">' + node.getAttribute('err-text') + '</span>');
                                            }
                                            // 检查索引赋值
                                            if (node.getAttribute('check-index')) {
                                                checkIndex = node.getAttribute('check-index');
                                            }
                                            //分离规则
                                            var myRules = splitText(attribute.value);
                                            //存储输入框是否通过验证
                                            getIsChange(myRules, node, checkIndex);
                                            // 是否第一次执行
                                            var frist = true;
                                            // 正在执行
                                            var isExecuting = false;

                                            scope.$watch(function () {
                                                if (node.nodeName === "DIV") {
                                                    return getDataDiv(node);
                                                } else if (node.nodeName === "SELECT") {
                                                    return node.getAttribute('value');
                                                } else {
                                                    return node.value;
                                                }
                                            }, function (newValue) {
                                                if (!frist || newValue) {
                                                    // 判断是否有程序已经在执行
                                                    if (!isExecuting) {
                                                        // 开始进行规则核对
                                                        isExecuting = true;
                                                        valueChange(node, myRules, errText, checkIndex);
                                                        // 执行完毕
                                                        isExecuting = false;
                                                    }
                                                }
                                                frist = false;
                                            }, true);

                                            node.onkeyup = function (ev) {
                                                // 判断是否有程序已经在执行
                                                if (!isExecuting) {
                                                    // 开始进行规则核对
                                                    isExecuting = true;
                                                    valueChange(this, myRules, errText, checkIndex);
                                                    // 执行完毕
                                                    isExecuting = false;
                                                }
                                            };
                                            //监听DOM事件，变化时修改变量值
                                            node.onblur = function (ev) {
                                                var value = "";
                                                var isVerification = true;
                                                if (node.nodeName === "DIV") {
                                                    value = getDataDiv(node);
                                                } else if (node.nodeName === "SELECT") {
                                                    return node.getAttribute('value');
                                                } else {
                                                    value = node.value;
                                                }
                                                //输入框值发生改变需要判断是否通过验证
                                                //循环判断是否复核规则
                                                $.each(myRules, function (index, rule) {
                                                    //有一个条件不满足就停止执行
                                                    if (!ruleJudge(node, rule, value, checkIndex)) {
                                                        isVerification = false;
                                                        return false;
                                                    }
                                                });
                                                //不是必填项可以不填
                                                if (node.target === undefined && strTrim(value) === "") {
                                                    node.style.border = node.data;
                                                    isVerification = true;
                                                    //删除节点
                                                    if (errText) {
                                                        errText.remove();
                                                    }
                                                }
                                                //循环必填项判断是否填写完毕
                                                $.each(isChange[checkIndex || 'checkIndexAll'], function (index, item) {
                                                    //仍旧存在未修改的输入框
                                                    if (!item) {
                                                        isVerification = false;
                                                        return false;
                                                    }
                                                });
                                                if (scope.isVerification) {
                                                    scope.$apply(function () {
                                                        scope.isVerification = isVerification;
                                                    });
                                                }
                                            };
                                            return false;
                                        }
                                    });
                                }
                                if (node.nodeName === 'DIV' && node.children.length > 0) {//存在子节点
                                    //循环子节点
                                    $.each(node.children, function (index, childrenNode) {
                                        chackNode(childrenNode);
                                    });
                                }
                            } else if (node.nodeName !== '#comment' && node.children.length > 0) {//存在子节点
                                //循环子节点
                                $.each(node.children, function (index, childrenNode) {
                                    chackNode(childrenNode);
                                });
                            }
                            // 防止IE8因为ng-if引起的报错
                            if (node.nodeName !== '#comment') {
                                if (node.getAttribute("iscomplete") === "") {
                                    // 添加点击方法
                                    node.onclick = function () {
                                        isComplete();
                                    };
                                    return false;
                                }
                            }
                        }

                        /**
                         * 判断浏览器
                         * @returns {*}
                         */
                        function myBrowser() {
                            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
                            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
                            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
                            var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
                            if (isIE) {
                                var IE5 = IE55 = IE6 = IE7 = IE8 = false;
                                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                                reIE.test(userAgent);
                                var fIEVersion = parseFloat(RegExp["$1"]);
                                IE55 = fIEVersion == 5.5;
                                IE6 = fIEVersion == 6.0;
                                IE7 = fIEVersion == 7.0;
                                IE8 = fIEVersion == 8.0;
                                if (IE55) {
                                    return "IE55";
                                }
                                if (IE6) {
                                    return "IE6";
                                }
                                if (IE7) {
                                    return "IE7";
                                }
                                if (IE8) {
                                    return "IE8";
                                }
                            }//isIE end
                            if (isFF) {
                                return "FF";
                            }
                            if (isOpera) {
                                return "Opera";
                            }
                        }

                        /**
                         判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期
                         */
                        function IsDate(mystring) {
                            var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
                            // var arr = reg.exec(mystring);
                            if (mystring == "") return true;
                            if (!reg.test(mystring) && RegExp.$2 <= 12 && RegExp.$3 <= 31) {
                                return false;
                            }
                            return true;
                        }

                        /**
                         * 验证固定电话
                         * @param tel
                         * @returns {boolean}
                         */
                        function checkTel(tel) {
                            if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(tel)) {
                                return false;
                            }
                            return true;
                        }

                        /**
                         * 验证手机号
                         * @param phone
                         * @returns {boolean}
                         */
                        function checkPhone(phone) {
                            if (!(/^1[34578]\d{9}$/.test(phone))) {
                                return false;
                            }
                            return true;
                        }

                        /**
                         * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                         * @param cardCode
                         * @returns {boolean}
                         */
                        // if(!(/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(cardCode))){
                        //     return false;
                        // }
                        // return true;
                        function checkCardCode(cardCode) {
                            cardCode = cardCode.toUpperCase();           //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
                            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(cardCode))) {
                                //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
                                return false;
                            }
                            //验证前2位，城市符合
                            var aCity = {
                                11: "北京",
                                12: "天津",
                                13: "河北",
                                14: "山西",
                                15: "内蒙古",
                                21: "辽宁",
                                22: "吉林",
                                23: "黑龙江 ",
                                31: "上海",
                                32: "江苏",
                                33: "浙江",
                                34: "安徽",
                                35: "福建",
                                36: "江西",
                                37: "山东",
                                41: "河南",
                                42: "湖北",
                                43: "湖南",
                                44: "广东",
                                45: "广西",
                                46: "海南",
                                50: "重庆",
                                51: "四川",
                                52: "贵州",
                                53: "云南",
                                54: "西藏",
                                61: "陕西",
                                62: "甘肃",
                                63: "青海",
                                64: "宁夏",
                                65: "新疆",
                                71: "台湾",
                                81: "香港",
                                82: "澳门",
                                91: "国外"
                            };
                            if (aCity[parseInt(cardCode.substr(0, 2))] == null) {
                                return false;
                            }
                            //alert('城市:'+aCity[parseInt(num.substr(0,2))]);

                            //下面分别分析出生日期和校验位
                            var len, re;
                            len = cardCode.length;
                            if (len == 15) {
                                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                                var arrSplit = cardCode.match(re);  //检查生日日期是否正确
                                var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                                var bGoodDay;
                                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                                if (!bGoodDay) {
                                    return false;
                                } else { //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                                    var nTemp = 0, i;
                                    cardCode = cardCode.substr(0, 6) + '19' + cardCode.substr(6, cardCode.length - 6);
                                    for (i = 0; i < 17; i++) {
                                        nTemp += cardCode.substr(i, 1) * arrInt[i];
                                    }
                                    cardCode += arrCh[nTemp % 11];
                                    return true;
                                }
                            }
                            if (len == 18) {
                                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                                var arrSplit = cardCode.match(re);  //检查生日日期是否正确
                                var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                                var bGoodDay;
                                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                                if (!bGoodDay) {
                                    //alert(dtmBirth.getYear());
                                    //alert(arrSplit[2]);
                                    return false;
                                }
                                else { //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                                    var valnum;
                                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                                    var nTemp = 0, i;
                                    for (i = 0; i < 17; i++) {
                                        nTemp += cardCode.substr(i, 1) * arrInt[i];
                                    }
                                    valnum = arrCh[nTemp % 11];
                                    if (valnum != cardCode.substr(17, 1)) {
                                        //alert('18位身份证的校验码不正确！应该为：' + valnum);
                                        return false;
                                    }
                                    return true;
                                }
                            }
                            return false;
                        }

                        /**
                         * 检查Email邮箱
                         * @param str
                         * @returns {boolean}
                         */
                        function isEmail(str) {
                            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                            return reg.test(str);
                        }

                        /**
                         * 检查邮编
                         * @param str
                         * @returns {boolean}
                         */
                        function isPostcode(str) {
                            // 邮政编码的验证（开头不能为0，共6位）
                            var postcode = /^[1-9][0-9]{5}$/;
                            return postcode.test(str);
                        }

                        /**
                         * 改变isChange保存的状态
                         * @param target
                         * @param isTrue
                         * @param checkIndex
                         */
                        function changeIsChange(target, isTrue, checkIndex) {
                            if (typeof target === "string") {
                                var targets = target.split("-");
                                isChange[checkIndex][parseInt(targets[1])] = isTrue;
                                isChange.checkIndexAll[parseInt(targets[0])] = isTrue;
                            } else {
                                isChange.checkIndexAll[target] = isTrue;
                            }
                        }

                        /**
                         * 设置正确或错误边框
                         * @param isTrue
                         * @param node
                         * @param checkIndex
                         * @returns {*}
                         */
                        function setBorder(isTrue, node, checkIndex) {
                            if (!isTrue) {
                                if (node.target) {
                                    changeIsChange(node.target, isTrue, checkIndex);
                                }
                                node.style.border = '1px red solid';
                            } else {
                                if (node.target) {
                                    changeIsChange(node.target, isTrue, checkIndex);
                                }
                                node.style.border = node.data;
                            }
                            return isTrue;
                        }

                        /**
                         * 判断规则
                         * @param node
                         * @param rule
                         * @param value
                         * @param checkIndex
                         * @returns {*}
                         */
                        function ruleJudge(node, rule, value, checkIndex) {
                            //去除空格
                            value = strTrim(value);
                            //是否通过
                            var isPass;
                            //正整数
                            var numberIntStr = /^[0-9]*$/;
                            //浮点数
                            var numberFloatStr = /^[0-9]+.?[0-9]*$/;
                            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                            var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;

                            // 解决IE8成功后没有边框问题
                            if (node.data === undefined) {
                                node.data = node.style.border;
                                if ((myBrowser() === "IE7" || myBrowser() === "IE8") && !node.data) {
                                    node.data = '1px gray solid';
                                }
                            }

                            switch (rule.title) {
                                case 'require'://不能为空
                                    isPass = setBorder(value.length > 0, node, checkIndex);
                                    return isPass;
                                case 'maxlength'://最大长度
                                    isPass = setBorder(value.length <= parseInt(rule.content), node, checkIndex);
                                    return isPass;
                                case 'minlength'://最小长度
                                    isPass = setBorder(value.length >= parseInt(rule.content), node, checkIndex);
                                    return isPass;
                                case 'date'://日期格式
                                    isPass = setBorder(IsDate(value), node, checkIndex);
                                    return isPass;
                                case 'number'://数字
                                    var numberStr;
                                    if (rule.content != "") {
                                        if ("int" == rule.content) {//整形
                                            numberStr = numberIntStr;
                                        } else if ("float" == rule.content) {//浮点类型
                                            numberStr = numberFloatStr;
                                        }
                                    } else {
                                        //为空时默认浮点类型
                                        numberStr = numberFloatStr;
                                    }
                                    isPass = setBorder(value.match(numberStr), node, checkIndex);
                                    return isPass;
                                case 'bill'://账单期类型
                                    isPass = setBorder(value == "月度" || value == "季度", node, checkIndex);
                                    return isPass;
                                case 'cardcode'://身份证号验证
                                    isPass = setBorder(checkCardCode(value), node, checkIndex);
                                    return isPass;
                                case 'tel':// 固定电话
                                    isPass = setBorder(checkTel(value), node, checkIndex);
                                    return isPass;
                                case 'phone':// 手机号
                                    isPass = setBorder(checkPhone(value), node, checkIndex);
                                    return isPass;
                                case 'email':// 邮箱
                                    isPass = setBorder(isEmail(value), node, checkIndex);
                                    return isPass;
                                case 'postcode': // 邮编
                                    isPass = setBorder(isPostcode(value), node, checkIndex);
                                    return isPass;
                                default :
                                    node.style.border = node.data;
                                    return true;
                            }
                        }

                        // 是否正在执行
                        var isRun = false;

                        //存在节点
                        if (element[0] && !isRun) {
                            isRun = true;
                            $timeout(function () {
                                //是否修改输入框
                                isChange = {
                                    checkIndexAll: []
                                };
                                // 必填项节点
                                requireNodes = {
                                    checkIndexAll: []
                                };
                                chackNode(element[0]);
                                isRun = false;
                            }, 1000);
                        }

                        // ng-repeat刷新完毕
                        $rootScope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                            if (!isRun) {
                                isRun = true;
                                $timeout(function () {
                                    // 清空
                                    //是否修改输入框
                                    isChange = {
                                        checkIndexAll: []
                                    };
                                    // 必填项节点
                                    requireNodes = {
                                        checkIndexAll: []
                                    };
                                    chackNode(element[0]);
                                    isRun = false;
                                }, 200);
                            }
                        });
                    };
                }
            }
        }]);
});
