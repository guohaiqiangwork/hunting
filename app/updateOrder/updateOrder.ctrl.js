/**
 * Created by 若水一涵 on 2017/8/12.
 */
define([
    'app',
    'config',
    'constants',
    'codes',
    'layer',
    'jedate'
], function (app, config, constants, codes, layer, jeDate) {
    app.registerController('updateOrderCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$modal', '$http',
        '$$neptune', '$timeout', '$$util', '$q', 'orderEntryCache',
        function ($scope, $state, $rootScope, localStorageService, $modal, $http, $$neptune, $timeout, $$util, $q, orderEntryCache) {

            // 产品编号，保险公司编号,订单编号,订单来源
            var productId = '', companyId = '', orderId = "", innerOrderSource = "PC";
            // 从哪里过来
            var whereForm = "";
            // 身份证
            var personalCardCode = undefined;
            // 等待燃气编号查询投保人信息接口
            var appntDeferred = undefined;
            // 等待订单查询信息接口
            var orderDeferred = undefined;
            // 地区是否完成,商业用户类型
            var areaIsPass = true, businessIsPass = true;
            // 被保人与投保人关系--本人code
            $scope.selfCode = undefined;
            // 列表展示类型
            $scope.choose = 'collectProducts';
            // 投保信息
            $scope.insureInfo = {
                endDate: '',
                startDate: '',
                ifPayInCash: false,
                ordGasDpt: {}
            };
            // 被保人模板索引
            $scope.insuredIndex = 0;
            // 验证是否通过
            $scope.isVerification = false;
            // 是否开始验证
            $scope.isComplete = false;
            // 起跳日期
            $scope.startPerid = 0;
            // 获得投保年限
            $scope.factorValue = '';
            // 支付按钮点击状态
            $scope.isPay = false;
            /**
             * 选择地区
             * @param gradeNum
             * @param parentId
             */
            $scope.searchAreas = function (gradeNum, parentId) {
                var keyWords = {
                    companyId: companyId,
                    productId: productId,
                    gradeNum: gradeNum,
                    parentId: parentId
                };

                $$neptune.$product.getArae(keyWords, {
                    onSuccess: function (data) {
                        setAreaSelect(gradeNum, data);
                    },
                    onError: function (e) {
                    }
                })
            };

            /**
             * 设置地区下拉
             * @param gradeNum
             * @param data
             */
            function setAreaSelect(gradeNum, data) {
                if ($scope.insureMoulds) {
                    $.each($scope.insureMoulds, function (index, insure) {
                        if (insure.mouldType === 'C') {
                            var areaProvinceCode;
                            $.each(insure.mouldFactors, function (index, mould) {
                                // 省
                                if (mould.inputCode === "areaProvinceCode" && gradeNum === "1") {
                                    // areaProvinceCode = mould.defaultValue;
                                    mould.propertyInfoList = data;
                                    // $scope.searchAreas('2', $scope.insureInfo.C.areaProvinceCode);
                                    areaIsPass = true;
                                    if (orderDeferred && businessIsPass) {
                                        orderDeferred.resolve();
                                    }
                                    return false;
                                }
                                // 市
                                if (mould.inputCode === "areaCityCode" && gradeNum === "2") {
                                    mould.propertyInfoList = data;
                                    // 设置默认值
                                    if (data && data.length > 0 && !$scope.insureInfo.C.areaCityCode) {
                                        $scope.insureInfo.C.areaCityCode = data[0].codeValue;
                                    }
                                    areaIsPass = true;
                                    if (orderDeferred && businessIsPass) {
                                        orderDeferred.resolve();
                                    }
                                }
                            });
                            return false;
                        }
                    });
                }
            }

            /**
             * 查询商业用户类型
             */
            $scope.searchBusinessUserType = function (gradeNum, parentId) {
                var keyWords = {
                    companyId: companyId,
                    productId: productId,
                    gradeNum: gradeNum,
                    parentId: parentId
                };

                $$neptune.$product.getBusinessUserType(keyWords, {
                    onSuccess: function (data) {
                        setBusinessUserTypeSelect(gradeNum, data);
                    },
                    onError: function (e) {
                    }
                })
            };

            /**
             * 设置商业用户类型下拉
             */
            function setBusinessUserTypeSelect(gradeNum, data) {
                if ($scope.insureMoulds) {
                    $.each($scope.insureMoulds, function (index, insure) {
                        if (insure.mouldType === 'C') {
                            var areaProvinceCode;
                            $.each(insure.mouldFactors, function (index, mould) {
                                // 省
                                if (mould.inputCode === "bizUserType" && gradeNum === "1") {
                                    areaProvinceCode = mould.defaultValue;
                                    mould.propertyInfoList = data;
                                    $scope.searchBusinessUserType('2', mould.defaultValue);
                                    return false;
                                }
                                // 市
                                if (mould.inputCode === "bizUserTypeSpec" && gradeNum === "2") {
                                    mould.propertyInfoList = data;
                                    businessIsPass = true;
                                    if (orderDeferred && areaIsPass) {
                                        orderDeferred.resolve();
                                    }
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                }
            }

            /**
             * 添加被保人
             * @param insuredIndex 被保人模块索引
             */
            $scope.addInsured = function (insuredIndex) {
                // 循环拷贝“被保人”
                $.each($scope.insureMoulds, function (index, insure) {
                    if (insure.mouldType === 'B') {
                        var insured = angular.copy(insure);
                        // 赋值被保人索引
                        insured.insuredIndex = insuredIndex + 1;
                        // 赋值被保人类型
                        insured.mouldType = insure.mouldType + insured.insuredIndex;
                        $scope.insureMoulds.push(insured);
                        // 赋值在哪儿显示“+”
                        $scope.insuredIndex = insured.insuredIndex;
                        return false;
                    }
                });
            };
            /**
             * 选择时间
             * @param ele
             * @param mouldType
             * @param mould
             */
            $scope.selectDate = function (ele, mouldType, mould) {
                var minDate = "";
                if (!mouldType && ele === 'startDate') {
                    minDate = jeDate.now($scope.startPerid);
                }
                jeDate({
                    dateCell: '#' + ele,
                    format: "YYYY-MM-DD",
                    insTrigger: false,
                    isClear: false,                         //是否显示清空
                    isToday: false,
                    minDate: minDate,
                    okfun: function (elem, val, date) {
                        if (!mouldType) {
                            $scope.insureInfo[ele] = val;
                            setStartEndDate();
                        } else {
                            $scope.$apply(function () {
                                $scope.insureInfo[mouldType][mould.inputCode] = val;
                                $scope.validType(mould.inputCode, mould.templateCorrelationVl, mouldType);
                            });
                        }
                    },
                    choosefun: function (elem, val) {
                        if (!mouldType) {
                            $scope.insureInfo[ele] = val;
                            setStartEndDate();
                        } else {
                            $scope.$apply(function () {
                                $scope.insureInfo[mouldType][mould.inputCode] = val;
                                $scope.validType(mould.inputCode, mould.templateCorrelationVl, mouldType);
                            });
                        }
                    }
                });
            };
            /**
             * 份数改变
             * @param type
             */
            $scope.numberChange = function (type) {
                if ($scope.productNumber.length === 0 || $scope.productNumber < 1) {
                    $scope.productNumber = 1;
                }
                $scope.productNumber = parseInt($scope.productNumber);
                if (type === "add") {
                    $scope.productNumber++;
                    setStartEndDate();
                } else if (type === "delete" && $scope.productNumber > 1) {
                    $scope.productNumber--;
                    setStartEndDate();
                } else {
                    setStartEndDate();
                }
            };

            /**
             * 设置止期
             */
            function setStartEndDate() {
                // if ($scope.initPrem) {
                //     $scope.initPrem = parseInt($scope.initPrem) * $scope.productNumber;
                // }
                // 拷贝一份防止修改原数据
                var factorValue = angular.copy($scope.factorValue);
                // 最后一个字符
                var lastChar = factorValue.charAt($scope.factorValue.length - 1).toLowerCase();
                // 截取
                factorValue = factorValue.substring(0, $scope.factorValue.length - 1);
                var nowDate = new Date($scope.insureInfo.startDate.replace(/-/g, "/"));
                // 设置止期
                if (lastChar === 'y') {
                    $scope.insureInfo.endDate = nowDate.getTargetDate(parseInt(factorValue), 0, -1).Format("yyyy-MM-dd");
                } else if (lastChar === 'm') {
                    $scope.insureInfo.endDate = nowDate.getTargetDate(0, parseInt(factorValue), -1).Format("yyyy-MM-dd");
                } else if (lastChar === 'd') {
                    $scope.insureInfo.endDate = nowDate.getTargetDate(0, 0, parseInt(factorValue) - 1).Format("yyyy-MM-dd");
                }
                if ($("#endDate")[0])
                    $("#endDate")[0].value = $scope.insureInfo.endDate;
            }

            /**
             * 模板select添加数据
             * @param dictorys
             */
            var templateInterval = undefined;

            function insureTemplateAddDictorys(dictorys) {
                $.each($scope.insureMoulds, function (index, insure) {
                    $.each(insure.mouldFactors, function (index, mould) {
                        // 循环select所需数据
                        $.each(dictorys, function (index, dictory) {
                            // 名称相同则赋值
                            // 被保人与投保人关系
                            if ((mould.inputCode === 'insuredRelationCode' || mould.inputCode === 'holderRelationCode') && (dictory.codeType === 'Relationship' || dictory.codeType === 'AntiRelationship')) {
                                mould.propertyInfoList = dictory.propertyInfoList;
                                // 赋值本人code和身份证
                                $.each(mould.propertyInfoList, function (index, info) {
                                    if (info.codeName === "本人") {
                                        $scope.selfCode = info.codeValue;
                                        return false;
                                    }
                                });
                            }
                            // 性别
                            if (mould.inputCode === 'sexCode' && dictory.codeType === 'Sex')
                                mould.propertyInfoList = dictory.propertyInfoList;
                            // 房屋类型
                            if (mould.inputCode === 'housingType' && dictory.codeType === 'housingType')
                                mould.propertyInfoList = dictory.propertyInfoList;
                            // 证件类型
                            if (mould.inputCode === 'certificateTypeCode' && (dictory.codeType === 'certificate' || dictory.codeType === 'Certificate')) {
                                mould.propertyInfoList = dictory.propertyInfoList;
                                // 赋值身份证code
                                $.each(mould.propertyInfoList, function (index, info) {
                                    if (info.codeName === "身份证") {
                                        personalCardCode = info.codeValue;
                                    }
                                    setTimeout(function () {
                                        // 赋值证件类型名称
                                        if (mould.defaultValue === info.codeValue && $scope.insureInfo.A.certificateTypeName) {
                                            $scope.insureInfo.A.certificateTypeName = info.codeName;
                                        }
                                    }, 50);
                                });
                            }
                        });
                        //如果模板有商业用户类型就初始化
                        if (mould.inputCode == 'bizUserType') {
                            $scope.searchBusinessUserType("1", "0");
                        }

                    });
                });
            }

            /**
             * 获得保险公司字典
             */
            function getInsureInfo(type) {
                var keyWords = {
                    type: type,
                    productId: productId, // 产品编码
                    companyId: companyId // 保险公司编码 companyId
                };
                $$neptune.$product.InsureInfo(keyWords, {
                    onSuccess: function (data) {
                        if (type === 'INSURE_BASIC')
                            insureTemplateAddDictorys(data.dictorys);
                    },
                    onError: function (e) {
                        if (typeof e === 'string') {
                            layer.msg(e, {time: 2333});
                        }
                    }
                });
            }

            /**
             * 清空被保险人信息
             */
            function clearInsuredByChange() {
                if ($scope.insureMoulds && $scope.insureMoulds.length > 0) {
                    $.each($scope.insureMoulds, function (index, insure) {
                        if (insure.mouldType === 'A') {
                            $.each(insure.mouldFactors, function (index1, mould) {
                                if (mould.templateCorrelationVl) {
                                    // 修改被保人值
                                    $scope.insureInfo['B'][mould.templateCorrelationVl] = "";
                                    // 添加证件类型名称
                                    setCertificateTypeName(mould.templateCorrelationVl, 'B');
                                }
                            });
                            return false;
                        }
                    });
                }
            }

            /**
             * 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息，循环赋值
             */
            function setInsuredByChange() {
                // 判断页面是否渲染完毕
                if (!$scope.selfCode) return;
                // 存在定时器则删除
                if (templateInterval) clearInterval(templateInterval);
                if ($scope.insureInfo['A']['insuredRelationCode'] === $scope.selfCode)
                    if ($scope.insureMoulds && $scope.insureMoulds.length > 0) {
                        $.each($scope.insureMoulds, function (index, insure) {
                            if (insure.mouldType === 'A') {
                                $.each(insure.mouldFactors, function (index1, mould) {
                                    if (mould.templateCorrelationVl) {
                                        // 修改被保人值
                                        $scope.insureInfo['B'][mould.templateCorrelationVl] = $scope.insureInfo['A'][mould.templateCorrelationVl];
                                        // 添加证件类型名称
                                        setCertificateTypeName(mould.templateCorrelationVl, 'B');
                                    }
                                });
                                return false;
                            }
                        });
                    }
            }

            /**
             * 更改燃气编号改变查询投保人信息
             * @param inputCode
             * @param value
             */
            function changeVlaue(inputCode, value) {
                if (value) {
                    if (parseInt(value)) {
                        $scope.insureInfo['C'][inputCode] = parseInt(value) + "";
                    } else {
                        changeVlaue(inputCode, value.substring(0, value.length - 1));
                    }
                } else {
                    $scope.insureInfo['C'][inputCode] = '';
                }
            }

            /**
             * 去空格
             * @param str
             */
            function trim(str) {
                return str.replace(/\s/g, "");
            }

            /**
             * PC-证件号正确出生日期会自动带出，需要在页面限制为证件类型是身份证是，出生日期不可编辑
             * @param inputCode
             * @param mouldType
             */
            function disabledBirthday(inputCode, mouldType) {
                if (inputCode === "certificateNumber") {
                    // 循环确定生日
                    $.each($scope.insureMoulds, function (index, insure) {
                        if (insure.mouldType === 'A' && mouldType === 'A') {
                            $.each(insure.mouldFactors, function (index1, mould) {
                                if (mould.inputCode === 'birthday') {
                                    mould.isEnabled = $$util.checkCardCode($scope.insureInfo[mouldType][inputCode]) ? 'N' : 'Y';
                                    return false;
                                }
                            });
                            return false;
                        }
                        if (insure.mouldType === 'B' && mouldType === 'B') {
                            $.each(insure.mouldFactors, function (index1, mould) {
                                if (mould.inputCode === 'birthday') {
                                    mould.isEnabled = $$util.checkCardCode($scope.insureInfo[mouldType][inputCode]) ? 'N' : 'Y';
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                }
            }

            /**
             * 1、选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
             * @param inputCode
             * @param templateCorrelationVl
             * @param mouldType
             */
            $scope.validType = function (inputCode, templateCorrelationVl, mouldType) {

                // 添加证件类型名称
                setCertificateTypeName(inputCode, mouldType);
                // 自动添加生日
                setBirthday(inputCode, mouldType);
                // 不是身份证清空证件号
                // clearCertificateNumber(inputCode, mouldType);
                // 身份证时，生日不允许编辑
                disabledBirthday(inputCode, mouldType);
                // 验证地址
                // verificationAddress(inputCode, mouldType);
                // 验证姓名
                // verificationName(inputCode, mouldType);

                // 清空被保人信息
                if (mouldType === 'A' && inputCode === 'insuredRelationCode' && $scope.selfCode && $scope.insureInfo['A']['insuredRelationCode'] !== $scope.selfCode)
                    clearInsuredByChange();
                // 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
                if (mouldType === 'A' && $scope.selfCode && $scope.insureInfo['A']['insuredRelationCode'] === $scope.selfCode)
                    setInsuredByChange();

                // 燃气编号或合作伙伴号改变查询投保人信息
                if (inputCode === 'gasUserId' || inputCode === 'gasPartnerCode') {
                    $scope.insureInfo['C'][inputCode] = trim($scope.insureInfo['C'][inputCode]);
                    changeVlaue(inputCode, $scope.insureInfo['C'][inputCode]);
                    if ($scope.insureInfo['C'][inputCode].length > 10) {
                        $scope.insureInfo['C'][inputCode] = $scope.insureInfo['C'][inputCode].substring(0, 10);
                    } else {
                        getAppnt('', inputCode);
                    }
                }

                // 根据地址获取经纬度
                $scope.chooseAddr(mouldType, inputCode);

                // 设置市
                if (mouldType === 'C' && inputCode === "areaProvinceCode") {
                    $scope.insureInfo.C.areaCityCode = "";
                    $scope.searchAreas('2', $scope.insureInfo.C.areaProvinceCode);
                }

                //如果模板有商业用户类型就初始化
                if (mouldType === 'C' && inputCode === "bizUserType")
                    $scope.searchBusinessUserType('2', $scope.insureInfo.C.bizUserType);

            };

            /**
             * 不是身份证清空证件号和生日日期
             */
            function clearCertificateNumber(inputCode, mouldType) {
                if (inputCode === "certificateTypeCode" && $scope.insureInfo[mouldType].certificateTypeCode !== personalCardCode) {
                    $scope.insureInfo[mouldType].certificateNumber = "";
                    $scope.insureInfo[mouldType].birthday = "";
                }
            }

            /**
             * 添加证件类型名称
             */
            function setCertificateTypeName(inputCode, mouldType) {
                if (inputCode === 'certificateTypeCode') {
                    $.each($scope.insureMoulds, function (index, insure) {
                        $.each(insure.mouldFactors, function (index, mould) {
                            // 找到证件类型
                            if (mould.inputCode === 'certificateTypeCode') {
                                $.each(mould.propertyInfoList, function (index, propertyInfo) {
                                    if ($scope.insureInfo[mouldType].certificateTypeCode === propertyInfo.codeValue) {
                                        $scope.insureInfo[mouldType].certificateTypeName = propertyInfo.codeName;
                                        return false;
                                    }
                                });
                                return false;
                            }
                        });
                    });
                }
            }

            /**
             * 设置出生日期
             * @param inputCode
             * @param mouldType
             */
            function setBirthday(inputCode, mouldType) {
                if ((inputCode === "certificateNumber" || inputCode === "certificateTypeCode")
                    && $scope.insureInfo[mouldType].birthday !== undefined
                    && $$util.checkCardCode($scope.insureInfo[mouldType].certificateNumber)) {
                    $scope.insureInfo[mouldType].birthday = $$util.getBirthdayByCardCode($scope.insureInfo[mouldType].certificateNumber);
                    // 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
                    if (mouldType === 'A' && $scope.selfCode && $scope.insureInfo['A']['insuredRelationCode'] === $scope.selfCode)
                        setInsuredByChange();
                } else if ((inputCode === "certificateNumber"  || inputCode === "certificateTypeCode") && $scope.insureInfo[mouldType].birthday !== undefined) {
                    $scope.insureInfo[mouldType].birthday = "";
                }
            }

            /**
             * 赋值投保人信息
             */
            function setInsured(appnt, inputCode) {
                if (appnt) {
                    // 证件类型，暂时不设置
                    // $scope.insureInfo['A'].certificateTypeCode = appnt.idype;
                    // 客户姓名
                    $scope.insureInfo['A'].name = appnt.name_last;
                    // 证件号码
                    $scope.insureInfo['A'].certificateNumber = appnt.idnumber;
                    // $scope.insureInfo['D'].invoiceTitle = appnt.invoiceTitle;
                    // $scope.insureInfo['D'].dutySign = appnt.invoiceTitle;
                    // $scope.insureInfo['D'].invoiceTitle = appnt.invoiceTitle;
                    // 合作伙伴
                    if (inputCode === 'gasUserId')
                        $scope.insureInfo['C']['gasPartnerCode'] = appnt.partner;
                    // 燃气编号
                    if (inputCode === 'gasPartnerCode')
                        $scope.insureInfo['C']['gasUserId'] = appnt.gasCode;
                    // 设置生日
                    setBirthday('certificateTypeCode', 'A');
                    if (appnt.tel_number && appnt.tel_number.substring(0, 2) === '86') {
                        // 电话号码
                        $scope.insureInfo['A'].phoneNumber = appnt.tel_number.substring(2, appnt.tel_number.length);
                    } else if (appnt.tel_number && appnt.tel_number.substring(0, 3) === '+86') {
                        // 电话号码
                        $scope.insureInfo['A'].phoneNumber = appnt.tel_number.substring(3, appnt.tel_number.length);
                    } else {
                        // 电话号码
                        $scope.insureInfo['A'].phoneNumber = appnt.tel_number;
                    }
                    // 地址
                    $scope.insureInfo['A'].address = appnt.address;
                    // 家财地址
                    $scope.insureInfo['C'].address = appnt.address;
                    // 燃气合同号
                    $scope.insureInfo['C'].gasUserCttNo = appnt.vkont;
                    // 燃气公司机构编码
                    $scope.insureInfo.ordGasDpt.dptCode = appnt.burks;
                } else {
                    // 清空赋值
                    setInsured({}, inputCode);
                }
            }

            // 定时器
            var interval = undefined;

            /**
             * 查询投保人信息
             * @param gasCode
             * @param inputCode
             */
            var mGasCode = undefined, mInputCode = undefined;

            function getAppnt(gasCode, inputCode) {
                if (gasCode && !interval) {
                    if (gasCode !== undefined && inputCode !== undefined) {
                        mGasCode = gasCode;
                        mInputCode = inputCode;
                    }
                    interval = setInterval(getAppnt, 50, gasCode, inputCode);
                }
                // 已经渲染出燃气编号输入框
                if ($scope.insureInfo['C']) {
                    // 存在定时器则删除
                    if (interval) {
                        if (mGasCode !== undefined && mInputCode !== undefined) {
                            gasCode = mGasCode;
                            inputCode = mInputCode;
                        }
                        mGasCode = undefined;
                        mInputCode = undefined;
                        clearInterval(interval);
                    }
                    // 赋值燃起编号
                    if (gasCode)
                        $scope.insureInfo['C'].gasUserId = gasCode;
                    // 查询投保人信息
                    $$neptune.$product.getAppnt($scope.insureInfo['C'].gasUserId, $scope.insureInfo['C'].gasPartnerCode, {
                        onSuccess: function (data) {
                            setInsured(data.getAppnt, inputCode);

                            $timeout(function () {
                                if (!$scope.selfCode) {
                                    templateInterval = setInterval(setInsuredByChange, 50);
                                }
                                // 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
                                else if ($scope.insureInfo['A']['insuredRelationCode'] === $scope.selfCode)
                                    setInsuredByChange();
                            }, 200);
                            if (appntDeferred)
                            // 开始进行续保赋值
                                appntDeferred.resolve();
                        },
                        onError: function (e) {
                            // layer.msg(e, {time: 2333});
                        }
                    });
                }
            }

            /**
             * 更改绑定信息
             */
            function updateInsureInfo() {
                // 循环界面绑定数据
                for (var k in $scope.insureInfo) {
                    // 存在相应模板，循环模板
                    if ($scope.insureMoulds[k] && $scope.insureMoulds[k].mouldFactors) {
                        // 中间值
                        var mould = {};
                        // 循环模板剔除多余绑定值
                        for (var mouldKey in $scope.insureMoulds[k].mouldFactors) {
                            mould[mouldKey] = $scope.insureInfo[k][mouldKey]
                        }
                        // 重新赋值
                        $scope.insureInfo[k] = mould;
                    }
                }
            }

            /**
             * 获取投保模板
             */
            function getInsureTemplate() {
                // 清空模板
                $scope.insureMoulds = undefined;
                $$neptune.$product.InsureTemplate(productId, $rootScope.user.agentCode, {
                    onSuccess: function (data) {
                        $scope.insureMoulds = data;
                        $.each($scope.insureMoulds, function (index, insure) {
                            if (insure.mouldType === 'C') {
                                $.each(insure.mouldFactors, function (index, mould) {
                                    if (mould.inputCode === 'areaProvinceCode') {
                                        areaIsPass = false;
                                        // 设置地区select
                                        $scope.searchAreas('1', '0');
                                    }
                                    if (mould.inputCode === 'bizUserType') {
                                        businessIsPass = false;
                                        // 设置商业用户类型select
                                        $scope.searchBusinessUserType('1', '0');
                                    }
                                });
                            }
                        });
                        // 更改绑定信息
                        updateInsureInfo();
                        // 字典--基本
                        getInsureInfo('INSURE_BASIC');
                        // 获取订单详情
                        getOrder();
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 2333});
                    }
                });
            }

            /**
             * 获取订单详情
             */
            function getOrder() {
                if (!orderId) {
                    return
                }
                orderDeferred = $q.defer();
                orderDeferred.promise.then(function () {
                    orderDeferred = undefined;
                    $$neptune.$order.Order(orderId, {
                        onSuccess: function (data) {
                            setInsureInfo(data);
                        },
                        onError: function (e) {
                            // layer.msg("接口问题", {time: 3000});
                        }
                    });
                });
                if (areaIsPass && businessIsPass) {
                    orderDeferred.resolve();
                }
            }

            /**
             * 续保，初始化数据
             * @param data
             */
            function setInsureInfo(data) {
                if (data) {
                    appntDeferred = $q.defer();
                    appntDeferred.promise.then(function () {
                        innerOrderSource = data.innerOrderSource;
                        var expiry_date = data.effectiveDate.split(" ")[0];
                        if (expiry_date) {
                            // 设置起保日期
                            $scope.insureInfo.startDate = new Date(expiry_date.replace(/-/g, "/")).getTargetDate(0, 0, 0).Format("yyyy-MM-dd");
                        }
                        setStartEndDate();
                        // 家财赋值
                        if (data.properties.length > 0)
                            for (var k in $scope.insureInfo.C) {
                                // 燃气编号不再赋值防止再次查询覆盖
                                if (k === "gasUserId")
                                    continue;
                                $scope.insureInfo.C[k] = data.properties[0][k];
                                if (k === 'areaProvinceCode') {
                                    $scope.insureInfo.C.areaCityCode = "";
                                    $scope.searchAreas('2', $scope.insureInfo.C.areaProvinceCode);
                                }
                            }
                        // 赋值投保人
                        for (var k in $scope.insureInfo.A) {
                            $scope.insureInfo.A[k] = data.policyHolder[k];
                            if(k==='birthday'){
                                disabledBirthday('certificateNumber','A');
                            }
                        }
                        if (data.invoiceinfo) {
                            //赋值发票
                            for (var k in $scope.insureInfo.D) {
                                $scope.insureInfo.D[k] = data.invoiceinfo[k];
                            }
                        }
                        // 赋值被保险人
                        if (data.policyInsureds.length > 0)
                            for (var k in $scope.insureInfo.B) {
                                $scope.insureInfo.B[k] = data.policyInsureds[0][k];
                                if(k==='birthday'){
                                    disabledBirthday('certificateNumber','B');
                                }
                            }
                    });
                    if (data.properties.length > 0 && data.properties[0].gasUserId) {
                        // 查询投保人信息
                        getAppnt(data.properties[0].gasUserId, 'gasUserId');
                    } else {
                        // 开始进行续保赋值
                        appntDeferred.resolve();
                    }
                    return
                }
            }


            /**
             * 展示产品列表
             */
            $scope.showProducts = function () {
                var keywords = {
                    supplierCode: '',//保险公司编码
                    categoryId: '',//栏目编码
                    organizationCode: '',//机构编码
                    riskName: '',//产品名称用于模糊查询
                    // salespersonCode: $scope.queryAguments.salespersonCode,//营业员编码
                    salespersonCode: $rootScope.user.agentCode,//营业员编码
                    pageIndex: '1',
                    pageSize: '1000',
                    version: '1.0'
                };
                $$neptune.find(constants.REQUEST_TARGET.PRODUCTS, keywords, {
                    onSuccess: function (data) {
                        // 产品选中索引
                        var productIndex = -1;
                        $scope.products = data._products;
                        $.each(data._products, function (index, pro) {
                            if (pro.collnetStatus === 'Y') {
                                $scope.products.push(pro);
                                // 选中产品index
                                if (productId === pro.productId)
                                    productIndex = $scope.products.length - 1;
                            }
                        });

                        if (productId) {
                            // 初始化产品选中状态
                            $.each(data._products, function (index, product) {
                                if (productId === product.productId) {
                                    $timeout(function () {
                                        $scope.chooseProduct(productIndex, product);
                                    }, 200);
                                    return false;
                                }
                            });
                        } else if ($scope.products && $scope.products.length > 0) {
                            productId = $scope.products[0].productId;
                            $timeout(function () {
                                $scope.chooseProduct(0, $scope.products[0]);
                            }, 200);
                        }
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 2333});
                    }
                }, {})
            };
            /**
             * 选择产品
             * @param index
             * @param product
             * @param isSelect
             * @returns {boolean}
             */
            $scope.chooseProduct = function (index, product, isSelect) {
                var contents = $('.product_content');
                if (contents && contents.length > 0 && index < contents.length && index > -1) {
                    $.each(contents, function (i, once) {
                        $(once)[0].className = 'product_content product_choose_default '
                    });
                    contents[index].className = contents[index].className.indexOf('product_choose_default') !== -1 ? contents[index].className.replace('product_choose_default', 'product_choose') : $('.product_count')[index].className.replace('product_choose', 'product_choose_default')
                    // 清空投保对象
                    // $scope.insureInfo = {
                    //     endDate: '',
                    //     startDate: '',
                    //     ifPayInCash: true
                    // };
                }

                if (product.productId === productId && isSelect)
                    return false;
                if (isSelect) {
                    // 清空订单号
                    orderId = undefined;
                }

                getProduct(product);
            };

            //根据输入或带入的地址获取对应的经纬度信息
            $scope.chooseAddr = function (mouldType, inputCode) {
                // 判断是否是地址
                if (inputCode.indexOf('ddress') > -1)
                    AMap.plugin('AMap.Geocoder', function () {
                        var geocoder = new AMap.Geocoder({});
                        geocoder.getLocation($scope.insureInfo[mouldType][inputCode], function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                $scope.insureInfo['A'].longitudeLatitude = result.geocodes[0].location.lng + "," + result.geocodes[0].location.lat;
                            } else {
                                //获取经纬度失败
                            }
                        });
                    });
            };
            /**
             * 设置参数，未生成订单做准备
             */
            $scope.setKeyWords = function (N) {
                // if ($rootScope.user.approveState === '1') {
                //     layer.msg("您还没通过审核,暂时不能购买产品", {time: 3000});
                //     return false;
                // }
                // if ($rootScope.user.approveState === '3') {
                //     layer.msg("由于您审核失败,暂时不能购买产品", {time: 3000});
                //     return false;
                // }
                var keyWords = {
                    orderBaseInfo: {
                        productId: productId,
                        price: $scope.initPrem,
                        buyCopies: '1',
                        memberId: $rootScope.user.agentCode,
                        operatorId: $rootScope.user.agentCode,
                        innerOrderSource: innerOrderSource,
                        effectiveDate: $scope.insureInfo.startDate + " 00:00:00",
                        orderId: orderId,
                        periodCounts: 1 // 默认期数为1，不许修改
                    },
                    insElements: {}
                };
                getProductFactors(keyWords);
            };

            /**
             * 获取产品详情并得到产品要素
             */
            function getProductFactors(keyWords) {
                if ($scope.product && $scope.product.productFactors) {
                    // 循环赋值投保要素
                    $.each($scope.product.productFactors, function (index, item) {
                        keyWords.insElements[item.factorType] = item.productFactorValues[0].factorValue;
                    });
                }
                generateOrder(keyWords);
            }

            /**
             * 生成订单
             * @param keyWords
             */
            function generateOrder(keyWords) {
                // 是否开始验证
                // $scope.isComplete = true;
                // $timeout(function () {
                // if (!$scope.isVerification) return false;
                keyWords.insureInfo = angular.copy($scope.insureInfo);
                // 已支付，改为不可点击状态
                $scope.isPay = true;
                $$neptune.$order.generateOrder(keyWords, {
                    onSuccess: function (data) {
                        layer.msg('修改成功', {time: 2000});
                        // 返回上一页
                        $state.go("orders");
                    },
                    onError: function (e) {
                        $scope.isPay = false;
                        $scope.isComplete = false;
                    }
                });
                // }, 100);
            }

            $scope.complete = function () {
                // 是否开始验证
                $scope.isComplete = true;
            };

            /**
             * 获取产品详情
             */
            function getProduct(productId) {
                $$neptune.$product.Product({productId: productId}, {
                    onSuccess: function (data) {
                        $scope.product = data;
                        if (data) {
                            $scope.startPerid = data.startPerid;
                            // 初始金额
                            $scope.initPrem = data.initPrem;
                            $scope.productName = data.productName;
                            if (data.startPerid !== undefined) {
                                $scope.insureInfo.startDate = new Date().getTargetDate(0, 0, $scope.startPerid).Format("yyyy-MM-dd");
                            }
                            // 更改查询条件
                            productId = data.productId;
                            companyId = data.insCompanyCode;
                            // 查询模板
                            getInsureTemplate();
                        }
                        if (data && data.productFactors) {
                            // 循环赋值投保要素
                            $.each(data.productFactors, function (index, item) {
                                // 获得投保年限
                                $scope.factorValue = item.productFactorValues[0].factorValue;
                                setStartEndDate();
                                return false;
                            });
                        }
                    },
                    onError: function (e) {
                        layer.msg("获取产品详情接口问题", {time: 3000});
                    }
                });
            }

            /**
             * 续保
             * @param orderProductId
             * @param orderOrderId
             */
            $scope.renewal = function (orderProductId, orderOrderId) {
                productId = orderProductId;
                orderId = orderOrderId;
                $scope.showProducts();
            };

            /**
             * 打开订单详情
             * @param id
             * @param type 订单或保单
             */
            $scope.openOrderDetails = function (id, type) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'orders/model/orderDetails.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.type = type;
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        /**
                         * 获取订单详情
                         */
                        function getOrder() {
                            $$neptune.$order.Order(id, {
                                onSuccess: function (data) {
                                    $scope.order = data;
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        }

                        getOrder();
                    },
                    size: 'sm'
                })
            };
            // 缓存邮箱
            var mail = undefined;
            /**
             * 选择业务员邮箱
             */
            $scope.selectSalesman = function (value) {
                if ($scope.insureInfo.A) {
                    $scope.insureInfo.A.bizMailType = value;
                    if ($scope.insureInfo.A.bizMailType === "SM") {
                        // 缓存已填写过的邮箱地址
                        mail = angular.copy($scope.insureInfo.A.mail);
                        $scope.insureInfo.A.mail = $rootScope.user.email;
                    } else {
                        $scope.insureInfo.A.mail = mail;
                    }
                    // 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
                    if ($scope.selfCode && $scope.insureInfo['A']['insuredRelationCode'] === $scope.selfCode)
                        setInsuredByChange();
                }
            };

            function init() {
                if ($state.params) {
                    if ($state.params.id) {
                        var product = JSON.parse($state.params.id);
                        // 产品编号
                        productId = product.productId;
                        // 订单编号
                        $scope.orderId = orderId = product.orderId;
                    }
                    whereForm = "products";
                }
                // 查询产品列表
                if ($rootScope.user.agentCode && whereForm === "products" && productId)
                    getProduct(productId);
            }

            init();

        }]);
});