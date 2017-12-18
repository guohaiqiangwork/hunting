define([
    'app',
    'config',
    'constants',
    'codes',
    'layer',
    'jedate'
], function (app, config, constants, codes, layer, jeDate) {
    app.registerController('buyCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$modal', '$http',
        '$$neptune', '$timeout', '$$util', '$q', 'orderEntryCache', '$stateParams',
        function ($scope, $state, $rootScope, localStorageService, $modal, $http, $$neptune, $timeout, $$util, $q, orderEntryCache, $stateParams) {

            // 避免二次加载
            if ($stateParams.id === undefined || $stateParams.user === undefined) {
                return;
            }
            // 产品编号，保险公司编号,订单编号
            var productId = '', companyId = '', orderId = "", appntInfo = undefined;
            // 缓存
            var cacheDeferred = undefined;
            // 从哪里过来
            var whereForm = "";
            // 身份证
            var personalCardCode = undefined;
            // 被保人与投保人关系--本人code
            $scope.selfCode = undefined;
            // 列表展示类型
            $scope.choose = 'collectProducts';
            // 投保信息
            $scope.insureInfo = {
                endDate: '',
                startDate: '',
                ifPayInCash: false,
                ordGasDpt: {},
                productNumber: 1 //期数
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
            // 房屋信息搜索条件
            $scope.searchKeyWords = {
                totalItems: 0,//总条数
                pageIndex: 1,//页索引
                pageSize: 10,//每页数量
                maxSize: 5, //最大容量
                numPages: 5, //总页数
                previousText: config.pagination.previousText, //上一页
                nextText: config.pagination.nextText, //下一页
                firstText: config.pagination.firstText,   //首页
                lastText: config.pagination.lastText,  //最后一页
                village: '',
                building: '',
                city: '',
                unit: '',
                roomNumber: ''
            };
            // 领用人使用
            $scope.tarAgent = {
                startNo: "",  // 单证起始号码
                endNo: "",  // 单证终止号码
                isOpen: false, // 是否打开下拉框
                isFocusSelect: false, // 焦点是否在下拉框
                isMoreThan: false, // 是否超过单证数量
                isMultiPeriod: "Y" //一个单证号对应多期
            };
            /**
             * 一个单证号对应多期--复选框改变
             */
            $scope.changeMultiPeriod = function () {
                $scope.calculationDocumentNumber();
            };

            /**
             * 计算单证结束号码
             * @param index 单证数组索引
             * @param length 开始号码长度
             * @param sumCount 单证数组当前item时，所剩期数数量
             * @param startNo 开始单证号码
             * @param document 证数组当前item
             * @returns {string} 返回单证结束号码
             */
            function documentEndNo(index, length, sumCount, startNo, document) {
                // 起始号+期数在数组结束号码内
                if (sumCount <= 0) {
                    // 终止号码
                    var endNo = startNo + document.sumCount - 1 + sumCount + "";
                    // 实际长度大于计算后长度
                    if (length > endNo.length) {
                        // 长度差距
                        var lengthGap = length - endNo.length;
                        var FrontStr = "";
                        for (var i = 0; i < lengthGap; i++) {
                            FrontStr += "0";
                        }
                        endNo = FrontStr + endNo;
                        return endNo
                    }
                    return endNo
                } else if ($scope.documents.length > index + 1) { // 超过当前item结束号码-起始号码数量
                    var document = $scope.documents[index + 1];
                    return documentEndNo(index + 1, document.startNo.toString().length, sumCount - document.sumCount, parseInt(document.startNo), document);
                } else {
                    $scope.tarAgent.isMoreThan = true;
                    layer.msg("超过单证数量，请修改期数", {time: 2000});
                }
            }

            /**
             * 计算单证号
             */
            $scope.calculationDocumentNumber = function () {
                $scope.tarAgent.isMoreThan = false;
                if ($scope.tarAgent.isMultiPeriod === "Y") {
                    $scope.tarAgent.endNo = $scope.tarAgent.startNo;
                    return false;
                }
                // 期数与单证数组同时存在
                if ($scope.insureInfo.productNumber !== undefined && $scope.documents && $scope.documents.length > 0 && $scope.tarAgent.startNo) {
                    $scope.tarAgent.endNo = "";
                    var startNo, itemEndNo, itemStartNo;
                    // 循环找到包含当前起始号码的item
                    $.each($scope.documents, function (index, document) {
                        startNo = parseInt($scope.tarAgent.startNo);
                        itemEndNo = parseInt(document.endNo);
                        itemStartNo = parseInt(document.startNo);
                        // 判断起始号码位置
                        if ($scope.tarAgent.startNo.toString().length === document.startNo.toString().length && startNo >= itemStartNo && startNo <= itemEndNo) {
                            $scope.tarAgent.endNo = documentEndNo(index, document.startNo.toString().length, $scope.insureInfo.productNumber - (itemEndNo - startNo) - 1, itemStartNo, document);
                            return false;
                        }
                    });
                }
            };

            /**
             * 跳转支付界面
             * @param out_trade_no
             * @param isA
             */
            function goToPay(out_trade_no, isA) {
                $state.go('pay', {
                    productId: JSON.stringify({
                        isOrders: 'Y',
                        out_trade_no: out_trade_no,
                        paymentMethod: $scope.insureInfo.ifPayInCash ? "cash" : '',
                        total_fee: $scope.initPrem,
                        from: whereForm,
                        productName: $scope.productName ? encodeURI($scope.productName) : "",//产品名称
                        productId: productId,
                        isA: isA
                    })
                });
            }

            /**
             * 单证使用
             */
            $scope.documentUse = function (orderId) {
                var contNo = "";
                $.each(orderId, function (index, order) {
                    if (index === 0) {
                        contNo += order;
                    } else {
                        contNo += "," + order;
                    }
                });
                var keywords = {
                    productId: productId,    // 用户选择的产品编号
                    startNo: $scope.tarAgent.startNo, // 用户输入的或选择的号码
                    productNumber: $scope.insureInfo.productNumber,	// 用户选择的保险期数
                    endNo: $scope.tarAgent.endNo,
                    contNo: contNo, 	// 订单编号
                    address: $scope.insureInfo.A.address,
                    flag: $scope.tarAgent.isMultiPeriod
                };
                $$neptune.$document.documentUse(keywords, {
                    onSuccess: function (data) {
                        if (data && typeof data === 'string') {
                            layer.msg(data, {time: 3000});
                        }
                    },
                    onError: function (e) {
                    }
                });
                if (orderId.length === 1) {
                    goToPay(orderId[0], "N");
                } else {
                    var orderIds = [];
                    $.each(orderId, function (index, orderId) {
                        orderIds.push({orderId: orderId});
                    });
                    $$neptune.$order.createBatch(orderIds, {
                        onSuccess: function (data) {
                            if (data.out_trade_no) {
                                $scope.initPrem = data.total_fee;
                                goToPay(data.out_trade_no, "Y");
                            }
                        },
                        onError: function (e) {
                            layer.msg(e, {time: 2000})
                        }
                    })
                }
            };
            /**
             * 下单页面查询用户单证
             * @param productId
             */
            $scope.searchUserDocuments = function (productId) {
                $$neptune.find(constants.REQUEST_TARGET.SEARCH_USER_DOCUMENTS, productId, {
                    onSuccess: function (data) {
                        $scope.documents = data;
                        // 设置默认值
                        if (data && data.length > 0) {
                            $scope.tarAgent.startNo = data[0].startNo;
                            $scope.tarAgent.endNo = data[0].startNo;
                        }
                    },
                    onError: function (e) {

                    }
                });
            };
            /**
             * 单证起始终止code
             * @param cascadingDisplay
             */
            $scope.setTarAgentCode = function (cascadingDisplay) {
                $scope.tarAgent.isOpen = false;
                $scope.tarAgent.startNo = cascadingDisplay.startNo;
                $scope.tarAgent.endNo = cascadingDisplay.startNo;
            };
            /**
             * 焦点不在单证起始上时关闭
             * @returns {boolean}
             */
            $scope.isBlur = function () {
                if ($scope.tarAgent.isFocusSelect) {
                    return true;
                }
                $scope.tarAgent.isOpen = false;
                return false;
            };
            /**
             * 开始搜索
             * @returns {boolean}
             */
            $scope.searchHouseInfo = function () {
                if (!$scope.searchKeyWords.city.replace(/\s/g, "")) {
                    layer.msg('城市不能为空', {time: 3000});
                    return false;
                }
                if ((!$scope.searchKeyWords.village.replace(/\s/g, "")
                        || !$scope.searchKeyWords.building.replace(/\s/g, ""))
                    && !$scope.searchKeyWords.userName
                    && !$scope.searchKeyWords.houseNumber
                    && !$scope.searchKeyWords.partner
                    && !$scope.searchKeyWords.cardNo && !$scope.searchKeyWords.roomNumber) {
                    layer.msg('填写业务合作伙伴、房产号、身份证、姓名任意一项的情况下，可以不选择小区和楼栋', {time: 3000});
                    return false;
                }
                searchHouse();
            };

            /**
             * 综合筛选房产数据
             */
            function searchHouse() {
                $$neptune.$order.searchHouse($scope.searchKeyWords, {
                    onSuccess: function (data) {
                        // 确定总数
                        if (data && data.total && data.total > 0) {
                            $scope.searchKeyWords.totalItems = data.total;
                        }
                        if (data && data.houseinfos && data.houseinfos.length > 0) {
                            $scope.searchKeyWords.houseinfos = data.houseinfos;
                            if (data.houseinfos.length > 0 && !$scope.searchKeyWords.resultIsShow) {
                                $scope.searchKeyWords.resultIsShow = true;
                                // 打开窗口进行选择
                                openSearchReasult();
                            }
                        } else {
                            layer.msg("未查到相关信息", {time: 3000});
                        }
                    },
                    onError: function (e) {
                    }
                });
            }

            /**
             * 打开搜索结果弹窗
             * @param houseInfos
             */
            function openSearchReasult() {
                var that = $scope;
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'buy/template/houseResult.modal.html',
                    controller: function ($scope, $modalInstance, $timeout) {
                        $scope.searchKeyWords = that.searchKeyWords;
                        //关闭
                        $scope.closeModal = function () {
                            that.searchKeyWords.resultIsShow = false;
                            $modalInstance.dismiss();
                        };
                        $scope.changePage = function () {
                            searchHouse();
                        };
                        // 关闭综合筛选房产数据窗口
                        $scope.closeModalHouse = function (houseinfo) {
                            that.searchKeyWords.resultIsShow = false;
                            that.searchKeyWords.pageIndex = 1;
                            that.searchKeyWords.total = 1;
                            $modalInstance.dismiss();
                            if (houseinfo) {
                                // 清空赋值
                                setInsured(houseinfo, 'all', undefined);
                                // 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
                                if (that.insureInfo['A']['insuredRelationCode'] === that.selfCode) {
                                    setInsuredByChange();
                                }
                            }
                        };
                    }
                });
            }

            /**
             * 打开搜索弹窗
             * @param type
             */
            $scope.openSearchPopup = function (type) {
                var that = $scope;
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'buy/template/fuzzySearchPopup.modal.html',
                    controller: function ($scope, $modalInstance, $timeout) {
                        that.modalFuzzySearch = {
                            totalItems: 0,//总条数
                            pageIndex: 1,//页索引
                            pageSize: 10,//每页数量
                            maxSize: 5, //最大容量
                            numPages: 5, //总页数
                            previousText: config.pagination.previousText, //上一页
                            nextText: config.pagination.nextText, //下一页
                            firstText: config.pagination.firstText,   //首页
                            lastText: config.pagination.lastText,  //最后一页
                            results: ["请选择"],
                            type: type,
                            pageNumber: 1,
                            total: 1,
                            searchValue: ""
                        };
                        that.changeCity();

                        $scope.changeCity = function (isSearch) {
                            if (isSearch) {
                                // 清空还原
                                $scope.modalFuzzySearch.results = ["请选择"];
                                $scope.modalFuzzySearch.pageIndex = 1;
                                $scope.modalFuzzySearch.pageSize = 10;
                                $scope.modalFuzzySearch.isOver = false;
                                $scope.modalFuzzySearch.total = 1;
                            }
                            that.changeCity();
                        };
                        $scope.modalFuzzySearch = that.modalFuzzySearch;
                        // 模糊窗口
                        $scope.closeModalFuzzySearch = function (result) {
                            result = result === "请选择" ? "" : result;
                            // 赋值到搜索界面
                            if ($scope.modalFuzzySearch.type) {
                                that.searchKeyWords[$scope.modalFuzzySearch.type] = result;
                                // 选择楼栋则查询单元
                                if ($scope.modalFuzzySearch.type === 'building' && result) {
                                    that.searchCity('unit');
                                }
                                // 清空界面数据
                                switch ($scope.modalFuzzySearch.type) {
                                    case 'city':
                                        localStorageService.set(constants.OPERATE_TYPE.LOCAL_USER + "_city", {
                                            agentCode: $rootScope.user.agentCode,
                                            city: result
                                        });
                                        that.searchKeyWords.village = "";
                                        that.searchKeyWords.building = "";
                                        that.searchKeyWords.unit = "";
                                        that.searchKeyWords.units = [];
                                        that.searchKeyWords.roomNumber = "";
                                        break;
                                    case 'village':
                                        that.searchKeyWords.building = "";
                                        that.searchKeyWords.unit = "";
                                        that.searchKeyWords.units = [];
                                        that.searchKeyWords.roomNumber = "";
                                        break;
                                    case 'building':
                                        that.searchKeyWords.unit = "";
                                        that.searchKeyWords.units = [];
                                        that.searchKeyWords.roomNumber = "";
                                        break;
                                }
                            }
                            $modalInstance.close();
                        };
                        $scope.closeModal = function () {
                            $modalInstance.close();
                        };
                    }
                });
            };
            $scope.changeCity = function () {
                switch ($scope.modalFuzzySearch.type) {
                    case 'city':
                        keyWords = {
                            city: $scope.modalFuzzySearch.searchValue,
                            village: '',
                            building: '',
                            type: 1,
                            pageIndex: $scope.modalFuzzySearch.pageIndex,
                            pageSize: $scope.modalFuzzySearch.pageSize
                        };
                        break;
                    case 'village':
                        keyWords = {
                            city: $scope.searchKeyWords.city,
                            village: $scope.modalFuzzySearch.searchValue,
                            building: '',
                            type: 2,
                            pageIndex: $scope.modalFuzzySearch.pageIndex,
                            pageSize: $scope.modalFuzzySearch.pageSize
                        };
                        break;
                    case 'building':
                        keyWords = {
                            city: $scope.searchKeyWords.city,
                            village: $scope.searchKeyWords.village,
                            building: $scope.modalFuzzySearch.searchValue,
                            type: 3,
                            pageIndex: $scope.modalFuzzySearch.pageIndex,
                            pageSize: $scope.modalFuzzySearch.pageSize
                        };
                        break;
                    case 'roomNumber':
                        keyWords = {
                            city: $scope.searchKeyWords.city,
                            village: $scope.searchKeyWords.village,
                            building: $scope.searchKeyWords.building,
                            unit: $scope.searchKeyWords.unit,
                            roomNumber: $scope.modalFuzzySearch.searchValue,
                            type: 5,
                            pageIndex: $scope.modalFuzzySearch.pageIndex,
                            pageSize: $scope.modalFuzzySearch.pageSize
                        };
                        break;
                }
                $scope.searchCity();
            };
            /**
             * 切换下拉框  城市、小区、楼栋、单元
             * @param type
             */
            var keyWords = {
                city: '',
                village: '',
                building: '',
                roomNumber: ''
            };
            /**
             * 筛选城市、小区、楼栋、单元级联数据
             */
            $scope.searchCity = function (unitOrRoomNumber) {
                // 是否请求单元
                if (unitOrRoomNumber === 'unit') {
                    keyWords = {
                        city: $scope.searchKeyWords.city,
                        village: $scope.searchKeyWords.village,
                        building: $scope.searchKeyWords.building,
                        type: 4,
                        pageIndex: 1,
                        pageSize: 9999
                    };
                } else if (unitOrRoomNumber === 'roomNumber') {
                    keyWords = {
                        city: $scope.searchKeyWords.city,
                        village: $scope.searchKeyWords.village,
                        building: $scope.searchKeyWords.building,
                        unit: $scope.searchKeyWords.unit,
                        type: 5,
                        pageIndex: $scope.modalFuzzySearch.pageIndex,
                        pageSize: $scope.modalFuzzySearch.pageSize
                    };
                } else if (unitOrRoomNumber === 'roomNumberChange') {
                    $scope.searchKeyWords.unit = $scope.searchKeyWords.unit === "请选择" ? '' : $scope.searchKeyWords.unit;
                    $scope.searchKeyWords.roomNumber = '';
                    return false;
                }
                $$neptune.$order.searchCity(keyWords, {
                    onSuccess: function (data) {
                        if (data && data.total) {
                            $scope.modalFuzzySearch.totalItems = data.total;
                        }
                        // 设置城市、小区、楼栋、单元级联下拉框
                        if (data && data.cascadingStrs && data.cascadingStrs.length > 0) {
                            // 是否请求单元
                            if (unitOrRoomNumber === 'unit') {
                                $scope.searchKeyWords.units = data.cascadingStrs;
                            } else if (unitOrRoomNumber === 'roomNumber') {
                                $scope.searchKeyWords.roomNumbers = data.cascadingStrs;
                            } else if ($scope.modalFuzzySearch.pageIndex === 1) {
                                $scope.modalFuzzySearch.results = ["请选择"].concat(data.cascadingStrs);
                            } else {
                                $scope.modalFuzzySearch.results = data.cascadingStrs;
                            }
                        }
                    },
                    onError: function (e) {
                    }
                });
            };
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
                        // 设置地区下拉
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
                                $timeout(function () {
                                    // 省
                                    if (mould.inputCode === "areaProvinceCode" && gradeNum === "1") {
                                        areaProvinceCode = mould.defaultValue;
                                        mould.propertyInfoList = data;
                                        $scope.searchAreas('2', $scope.insureInfo.C.areaProvinceCode);
                                        return false;
                                    }
                                    // 市
                                    if (mould.inputCode === "areaCityCode" && gradeNum === "2") {
                                        mould.propertyInfoList = data;
                                        // 设置默认值
                                        if (data && data.length > 0 && !$scope.insureInfo.C.areaCityCode) {
                                            $scope.insureInfo.C.areaCityCode = data[0].codeValue;
                                        }
                                    }
                                }, 1000)
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
                        // 设置商业用户类型下拉
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
                    isOk: false,
                    minDate: minDate,
                    okfun: function (elem, val, date) {
                        if (!mouldType) {
                            $scope.insureInfo[ele] = val;
                            setStartEndDate();
                        } else {
                            // 给摸班中对应日期控件赋值
                            $scope.$apply(function () {
                                $scope.insureInfo[mouldType][mould.inputCode] = val;
                                //
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
                                // 输入框变化，进行赋值被保人、检测日期等操作
                                $scope.validType(mould.inputCode, mould.templateCorrelationVl, mouldType);
                            });
                        }
                    }
                });
                // 去掉确定
                $('.jedateok').css('display', 'none');
            };
            /**
             * 份数改变
             * @param type
             */
            $scope.numberChange = function (type) {

                if (isNaN($scope.insureInfo.productNumber)) {
                    $scope.insureInfo.productNumber = 1;
                }
                $scope.insureInfo.productNumber += "";
                if ($scope.insureInfo.productNumber.length === 1) {
                    $scope.insureInfo.productNumber = $scope.insureInfo.productNumber.replace(/[^1-9]/g, 1)
                } else {
                    $scope.insureInfo.productNumber = $scope.insureInfo.productNumber.replace(/\D/g, '')
                }
                if ($scope.insureInfo.productNumber.length === 0 || $scope.insureInfo.productNumber < 1) {
                    $scope.insureInfo.productNumber = 1;
                }
                $scope.insureInfo.productNumber = parseInt($scope.insureInfo.productNumber);
                if (type === "add") {
                    $scope.insureInfo.productNumber++;
                } else if (type === "delete" && $scope.insureInfo.productNumber > 1) {
                    $scope.insureInfo.productNumber--;
                }
                // 计算起始时间和结束时间
                setStartEndDate();
                // 计算单证号
                $scope.calculationDocumentNumber();
            };

            /**
             * 设置止期
             */
            function setStartEndDate() {
                if ($scope.initPrem) {
                    $scope.initPremSize = parseInt($scope.initPrem) * $scope.insureInfo.productNumber;
                }
                // 拷贝一份防止修改原数据
                var factorValue = angular.copy($scope.factorValue);
                // 最后一个字符
                var lastChar = factorValue.charAt($scope.factorValue.length - 1).toLowerCase();
                // 截取
                factorValue = factorValue.substring(0, $scope.factorValue.length - 1);
                var nowDate = new Date($scope.insureInfo.startDate.replace(/-/g, "/"));
                // 设置止期
                if (lastChar === 'y') {
                    $scope.insureInfo.endDate = nowDate.getTargetDate(parseInt(factorValue) * $scope.insureInfo.productNumber, 0, -1).Format("yyyy-MM-dd");
                } else if (lastChar === 'm') {
                    $scope.insureInfo.endDate = nowDate.getTargetDate(0, parseInt(factorValue) * $scope.insureInfo.productNumber, -1).Format("yyyy-MM-dd");
                } else if (lastChar === 'd') {
                    $scope.insureInfo.endDate = nowDate.getTargetDate(0, 0, parseInt(factorValue) * $scope.insureInfo.productNumber - 1).Format("yyyy-MM-dd");
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
                                        if (mould.defaultValue === info.codeValue && $scope.insureInfo.A && $scope.insureInfo.A.certificateTypeName) {
                                            $scope.insureInfo.A.certificateTypeName = info.codeName;
                                        }
                                        // 身份证时，生日默认不可点击
                                        // $.each(insure.mouldFactors, function (index1, mould) {
                                        //     if (mould.inputCode === 'birthday' && $scope.insureInfo.A && insure.mouldType === 'A') {
                                        //         mould.isEnabled = $$util.checkCardCode($scope.insureInfo.A.certificateNumber) ? 'N' : 'Y';
                                        //     }
                                        // });
                                    }, 100);
                                });
                            }
                            if (mould.inputCode === 'birthday' && $scope.insureInfo.A && insure.mouldType === 'A') {
                                setTimeout(function () {
                                    mould.isEnabled = $$util.checkCardCode($scope.insureInfo.A.certificateNumber) ? 'N' : 'Y';
                                }, 100);
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
                        // SAP跳转过来，切换产品信息不变
                        if (whereForm === "SAP" && appntInfo && !isBeginRenewal) {
                            // 可能存在模板未加载情况，so用延时
                            $timeout(function () {
                                setInsured({}, 'gasUserId', appntInfo);
                                if (appntInfo.gascode) {
                                    // 根据燃气编号查询投保人信息
                                    getAppnt(appntInfo.gascode, 'gasUserId', appntInfo);
                                    // 根据燃气用户编号查询订单信息
                                    getOrdersByGU(appntInfo.gascode);
                                }
                            }, 200);
                        }
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
            function clearInsuredByChange(mouldType, inputCode) {
                if (mouldType === 'A' && inputCode === 'insuredRelationCode' && $scope.selfCode && $scope.insureInfo['A']['insuredRelationCode'] !== $scope.selfCode) {
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
             * 验证地址是否通过
             * @param inputCode
             * @param mouldType
             * @returns {boolean}
             */
            // function verificationAddress(inputCode, mouldType) {
            //     if (inputCode === 'address' &&
            //         $scope.insureInfo[mouldType][inputCode] &&
            //         !/^([\u4e00-\u9fa5]|[A-Za-z0-9\-\(\)\（\）\s\#])+$/.test($scope.insureInfo[mouldType][inputCode])) {
            //         var isShow = false;
            //         for (var i = 0; i < $scope.insureMoulds.length; i++) {
            //             if ($scope.insureMoulds[i].mouldType === mouldType) {
            //                 isShow = true;
            //                 layer.msg($scope.insureMoulds[i].mouldTypeName + "地址错误，只允许输入字母、数字、中文、#、-、()", {time: 3000});
            //             }
            //         }
            //         if (!isShow) {
            //             layer.msg("地址错误，只允许输入字母、数字、中文、#、-、()", {time: 3000});
            //         }
            //         return false;
            //     }
            //     return true;
            // }

            /**
             * 去空格
             * @param str
             */
            function trim(str) {
                return str.replace(/\s/g, "");
            }

            /**
             * 验证姓名
             * @param inputCode
             * @param mouldType
             * @returns {boolean}
             */
            // function verificationName(inputCode, mouldType) {
            //     if (inputCode === 'name' &&
            //         $scope.insureInfo[mouldType][inputCode] &&
            //         !/^[\u4e00-\u9fa5]+$/.test($scope.insureInfo[mouldType][inputCode])) {
            //         var isShow = false;
            //         for (var i = 0; i < $scope.insureMoulds.length; i++) {
            //             if ($scope.insureMoulds[i].mouldType === mouldType) {
            //                 isShow = true;
            //                 layer.msg($scope.insureMoulds[i].mouldTypeName + "姓名错误，只允许输入汉字", {time: 3000});
            //             }
            //         }
            //         if (!isShow) {
            //             layer.msg("姓名错误，只允许输入汉字", {time: 3000});
            //         }
            //         return false;
            //     }
            //     return true;
            // }

            /**
             * 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息，
             * 进行赋值被保人、检测日期等操作
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
                clearInsuredByChange(mouldType, inputCode);
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
                if (mouldType === 'C' && inputCode === "areaProvinceCode")
                    $scope.searchAreas('2', $scope.insureInfo.C.areaProvinceCode);

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
             * 添加证件类型名称
             */
            function setCertificateTypeName(inputCode, mouldType) {
                if (inputCode === 'certificateTypeCode') {
                    $.each($scope.insureMoulds, function (index, insure) {
                        $.each(insure.mouldFactors, function (index, mould) {
                            // 找到证件类型
                            if (mould.inputCode === 'certificateTypeCode' && mould.propertyInfoList && mould.propertyInfoList instanceof Array) {
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
                } else if ((inputCode === "certificateNumber" || inputCode === "certificateTypeCode") && $scope.insureInfo[mouldType].birthday !== undefined) {
                    $scope.insureInfo[mouldType].birthday = "";
                }
            }

            /**
             * 赋值投保人信息
             */
            function setInsured(appnt, inputCode, appntInfo) {
                if (appnt) {
                    if (appntInfo) {
                        // 客户姓名
                        $scope.insureInfo['A'].name = appntInfo.name || appnt.name_last;
                        // 证件号码
                        $scope.insureInfo['A'].certificateNumber = appntInfo.idnumber || appnt.idnumber;
                        // 地址
                        $scope.insureInfo['A'].address = appntInfo.address || appnt.address;
                        // 燃气合同号
                        $scope.insureInfo['C'].gasUserCttNo = appntInfo.vkont || appnt.vkont;
                        // 家财地址
                        // $scope.insureInfo['C'].address = appntInfo.address || appnt.address;
                        if (appntInfo.tel && appntInfo.tel.substring(0, 2) === '86') {
                            // 电话号码
                            $scope.insureInfo['A'].phoneNumber = appntInfo.tel.substring(2, appntInfo.tel.length);
                        } else if (appntInfo.tel && appntInfo.tel.substring(0, 3) === '+86') {
                            // 电话号码
                            $scope.insureInfo['A'].phoneNumber = appntInfo.tel.substring(3, appntInfo.tel.length);
                        } else if (appnt.tel_number && appnt.tel_number.substring(0, 2) === '86') {
                            // 电话号码
                            $scope.insureInfo['A'].phoneNumber = appnt.tel_number.substring(2, appnt.tel_number.length);
                        } else if (appnt.tel_number && appnt.tel_number.substring(0, 3) === '+86') {
                            // 电话号码
                            $scope.insureInfo['A'].phoneNumber = appnt.tel_number.substring(3, appnt.tel_number.length);
                        } else {
                            // 电话号码
                            $scope.insureInfo['A'].phoneNumber = appntInfo.tel;
                        }
                    } else {
                        // 客户姓名
                        $scope.insureInfo['A'].name = appnt.name_last;
                        // 证件号码
                        $scope.insureInfo['A'].certificateNumber = appnt.idnumber;
                        // 地址
                        $scope.insureInfo['A'].address = appnt.address;
                        // 燃气合同号
                        $scope.insureInfo['C'].gasUserCttNo = appnt.vkont;
                        // 家财地址
                        // $scope.insureInfo['C'].address = appnt.address;
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
                    }
                    // 证件类型，暂时不设置
                    // $scope.insureInfo['A'].certificateTypeCode = appnt.idype;
                    // 合作伙伴
                    if (inputCode === 'gasUserId' || inputCode === 'all')
                        $scope.insureInfo['C']['gasPartnerCode'] = appnt.partner;
                    // 燃气编号
                    if (inputCode === 'gasPartnerCode' || inputCode === 'all')
                        $scope.insureInfo['C']['gasUserId'] = appnt.gasCode;
                    // 设置生日
                    setBirthday('certificateTypeCode', 'A');
                    // 身份证时，生日不允许编辑
                    disabledBirthday('certificateNumber', 'A');
                    disabledBirthday('certificateNumber', 'B');
                    // 燃气公司机构编码
                    $scope.insureInfo.ordGasDpt.dptCode = appnt.burks;
                } else {
                    // 清空赋值
                    setInsured({}, inputCode, appntInfo);
                }
            }

            // 定时器
            var interval = undefined;

            /**
             * 查询投保人信息
             * @param gasCode
             * @param inputCode
             */
            var mGasCode = undefined, mInputCode = undefined, mAppntInfo = undefined;

            function getAppnt(gasCode, inputCode, appntInfo) {
                if (gasCode && !interval) {
                    if (gasCode !== undefined && inputCode !== undefined) {
                        mGasCode = gasCode;
                        mInputCode = inputCode;
                    }
                    if (mAppntInfo !== undefined) {
                        mAppntInfo = appntInfo;
                    }
                    interval = setInterval(getAppnt, 50, gasCode, inputCode, appntInfo);
                }
                // 已经渲染出燃气编号输入框
                if ($scope.insureInfo['C']) {
                    // 存在定时器则删除
                    if (interval) {
                        if (mGasCode !== undefined && mInputCode !== undefined) {
                            gasCode = mGasCode;
                            inputCode = mInputCode;
                        }
                        if (mAppntInfo !== undefined) {
                            appntInfo = mAppntInfo;
                        }
                        mGasCode = undefined;
                        mInputCode = undefined;
                        mAppntInfo = undefined;
                        clearInterval(interval);
                    }
                    // 赋值燃起编号
                    if (gasCode)
                        $scope.insureInfo['C'].gasUserId = gasCode;
                    // 查询投保人信息
                    $$neptune.$product.getAppnt($scope.insureInfo['C'].gasUserId, $scope.insureInfo['C'].gasPartnerCode, {
                        onSuccess: function (data) {
                            setInsured(data.getAppnt, inputCode, appntInfo);

                            $timeout(function () {
                                if (!$scope.selfCode) {
                                    templateInterval = setInterval(setInsuredByChange, 50);
                                }
                                // 选择投保人关系为本人的时候，自动把投保人信息赋值到被保人信息
                                else if ($scope.insureInfo['A']['insuredRelationCode'] === $scope.selfCode)
                                    setInsuredByChange();
                            }, 200);
                            if (appntDeferred && isBeginOrder)
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
                        // 循环模板找到家财部分，确认是否存在省市县，若存在则加载相应字典
                        $.each($scope.insureMoulds, function (index, insure) {
                            if (insure.mouldType === 'C') {
                                $.each(insure.mouldFactors, function (index, mould) {
                                    if (mould.inputCode === 'areaProvinceCode') {
                                        // 设置地区select
                                        $scope.searchAreas('1', '0');
                                    }
                                    if (mould.inputCode === 'bizUserType') {
                                        // 设置商业用户类型select
                                        $scope.searchBusinessUserType('1', '0');
                                    }
                                });
                                return false;
                            }
                        });
                        // 更改绑定信息
                        updateInsureInfo();
                        // 字典--基本，设置所有select选项
                        getInsureInfo('INSURE_BASIC');
                        // getInsureInfo('INSURE_OCCUPATION');
                        if (cacheDeferred)
                        // 赋值缓存中的数据
                            cacheDeferred.resolve();
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
                $$neptune.$order.Order(orderId, {
                    onSuccess: function (data) {
                        setInsureInfo(data);
                        if (cacheDeferred)
                        // 赋值缓存中的数据
                            cacheDeferred.resolve();
                    },
                    onError: function (e) {
                        // layer.msg("接口问题", {time: 3000});
                    }
                });
            }

            // 等待燃气编号查询投保人信息接口，是否开始订单查询
            var appntDeferred = undefined, isBeginOrder = false;

            /**
             * 续保，初始化数据
             * @param data
             */
            function setInsureInfo(data) {
                if (data) {
                    isBeginOrder = true;
                    appntDeferred = $q.defer();
                    appntDeferred.promise.then(function () {
                        // 订单查询结束
                        isBeginOrder = false;
                        // 续保结束
                        isBeginRenewal = false;
                        var expiry_date = data.expiry_date.split(" ")[0];
                        if (expiry_date) {
                            // 设置起保日期
                            $scope.insureInfo.startDate = new Date(expiry_date.replace(/-/g, "/")).getTargetDate(0, 0, 1).Format("yyyy-MM-dd");
                        }
                        setStartEndDate();
                        // 家财赋值
                        if (data.properties.length > 0)
                            for (var k in $scope.insureInfo.C) {
                                // 燃气编号不再赋值防止再次查询覆盖
                                if (k === "gasUserId")
                                    continue;
                                $scope.insureInfo.C[k] = data.properties[0][k];
                            }
                        // 赋值投保人
                        for (var k in $scope.insureInfo.A) {
                            $scope.insureInfo.A[k] = data.policyHolder[k];
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
                        $scope.products = [];
                        // 循环产品，找出收藏的产品
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
                                // //如果没有收藏直接去掉投保模版
                                // if(productId != product.productId){
                                //     $timeout(function () {
                                //         $scope.chooseProduct(productIndex, product);
                                //     }, 200);
                                //     return false;
                                // }
                            });
                        } else if ($scope.products && $scope.products.length > 0) { // 不存在选择的产品，则默认选中第一个
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
             * @param index 产品索引
             * @param product 产品
             * @param isSelect 是否界面选择
             * @returns {boolean}
             */
            $scope.chooseProduct = function (index, product, isSelect) {
                // 保险份数
                $scope.insureInfo.productNumber = 1;
                // 拿到界面产品dom
                var contents = $('.product_content');
                if (contents && contents.length > 0 && index < contents.length && index > -1) {
                    // 循环产品dom
                    $.each(contents, function (i, once) {
                        $(once)[0].className = 'product_content product_choose_default '
                    });
                    // 设置选中的产品边框变色
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
                // 切换产品
                if (isSelect) {
                    // 清空订单号
                    orderId = undefined;
                    $scope.insureInfo.productNumber = 1;
                }
                // 获取产品详情
                getProduct(product);
                // 下单页面查询用户单证
                $scope.searchUserDocuments(product.productId);
            };

            //根据输入或带入的地址获取对应的经纬度信息
            $scope.chooseAddr = function (mouldType, inputCode) {
                // 判断是否是地址
                if (inputCode.indexOf('ddress') > -1 && $$util.myBrowser() !== "IE7")
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
             * 验证通过后进行校验
             */
            $scope.resultDo = function () {
                $scope.isComplete = false;
                var keywords = {
                    productId: productId,    // 用户选择的产品编号
                    startNo: $scope.tarAgent.startNo, // 用户输入的或选择的号码
                    productNumber: $scope.insureInfo.productNumber,	// 用户选择的保险期数
                    endNo: $scope.tarAgent.endNo,
                    address: $scope.insureInfo.A.address,
                    flag: $scope.tarAgent.isMultiPeriod
                };
                $$neptune.$document.documentMultiple(keywords, {
                    onSuccess: function (data) {
                        $scope.setKeyWords();
                    },
                    onError: function (e) {
                    }
                });
            };
            /**
             * 设置参数，未生成订单做准备
             */
            $scope.setKeyWords = function (N) {
                // for (var mouldType in $scope.insureInfo) {
                // 验证地址
                // if (!verificationAddress('address', mouldType)) {
                //     return false;
                // }
                // 验证姓名
                // if (!verificationName('name', mouldType)) {
                //     return false;
                // }
                // }

                // if ($rootScope.user.approveState === '1') {
                //     layer.msg("您还没通过审核,暂时不能购买产品", {time: 3000});
                //     return false;
                // }
                // if ($rootScope.user.approveState === '3') {
                //     layer.msg("由于您审核失败,暂时不能购买产品", {time: 3000});
                //     return false;
                // }
                if ($scope.tarAgent.isMoreThan) {
                    layer.msg("超过单证数量，请修改期数", {time: 2000});
                    return;
                }
                var keyWords = {
                    orderBaseInfo: {
                        productId: productId,
                        price: $scope.initPrem,
                        buyCopies: '1',
                        memberId: $rootScope.user.agentCode,
                        operatorId: $rootScope.user.agentCode,
                        innerOrderSource: 'PC',
                        effectiveDate: $scope.insureInfo.startDate + " 00:00:00",
                        periodCounts: $scope.insureInfo.productNumber
                        // orderId: $scope.insureInfo.orderId
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

            // 是否开始生成订单
            var beginGenerateOrder = false;

            /**
             * 生成订单
             * @param keyWords
             */
            function generateOrder(keyWords) {
                if (!beginGenerateOrder) {
                    beginGenerateOrder = true;
                } else {
                    return;
                }
                $scope.isComplete = false;
                // 是否开始验证
                // $scope.isComplete = true;
                // $timeout(function () {
                // if (!$scope.isVerification) {
                //     $scope.isComplete = false;
                //     $scope.isVerification = false;
                //     return false;
                // }
                keyWords.insureInfo = angular.copy($scope.insureInfo);
                // 已支付，改为不可点击状态
                $scope.isPay = true;
                $scope.orderBaseInfo = {orderId: ""};
                $$neptune.$order.generateOrder(keyWords, {
                    onSuccess: function (data) {
                        // 清空模板
                        $scope.insureMoulds = undefined;
                        $scope.insureInfo.orderId = data;

                        // if (!$scope.insureInfo.ifPayInCash) {
                        //     // 缓存数据
                        //     orderEntryCache.setOrderCache({insureInfo: $scope.insureInfo});
                        // }
                        if ($scope.documents && $scope.documents.length > 0) {
                            $scope.documentUse(data);
                        }
                        // 跳转支付页 （单个和批量支付跳转不同）
                        else if (data.length === 1) {
                            goToPay(data[0], "N");
                        } else {
                            var orderIds = [];
                            $.each(data, function (index, orderId) {
                                orderIds.push({orderId: orderId});
                            });
                            $$neptune.$order.createBatch(orderIds, {
                                onSuccess: function (data) {
                                    if (data.out_trade_no) {
                                        $scope.initPrem = data.total_fee;
                                        goToPay(data.out_trade_no, "Y");
                                    }
                                },
                                onError: function (e) {
                                    layer.msg(e, {time: 2000})
                                }
                            })
                        }
                        $timeout(function () {
                            beginGenerateOrder = false;
                        }, 500);
                    },
                    onError: function (e) {
                        $scope.isPay = false;
                        $timeout(function () {
                            beginGenerateOrder = false;
                        }, 500);
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
            function getProduct(product) {
                // 根据产品id获取产品详情
                $$neptune.$product.Product({productId: product.productId}, {
                    onSuccess: function (data) {
                        $scope.product = data;
                        if (data) {
                            $scope.startPerid = data.startPerid;
                            // 初始金额
                            $scope.initPrem = data.initPrem;
                            // 产品名称
                            $scope.productName = data.productName;
                            // 产品开始时间
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
                                // 计算结束时间
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
             *
             * 根据燃气用户编号查询订单信息
             * @param gasCode
             */
            function getOrdersByGU(gasCode) {
                $$neptune.$order.getOrdersByGU(gasCode, {
                    onSuccess: function (data) {
                        $scope.waitRenewOrders = data.orders;
                    },
                    onError: function (e) {
                    }
                });
            }

            // 是否开始续保
            var isBeginRenewal = false;

            /**
             * 续保
             * @param orderProductId
             * @param orderOrderId
             */
            $scope.renewal = function (orderProductId, orderOrderId) {
                productId = orderProductId;
                orderId = orderOrderId;
                isBeginRenewal = true;
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
            /**
             * 跳转产品列表
             */
            $scope.goProducts = function () {
                $state.go('products');
            };

            /**
             * 根据SAP地址进行解析
             * @param url
             * @returns {{}}
             */
            function getObjectByUrl(url) {
                if (url) {
                    var urls = url.replace("{", "").replace("}", "").replace(/''/g, "").replace(/""/g, "").split(",");
                    var appntInfo = {};
                    for (var i = 0; i < urls.length; i++) {
                        var urlKey = urls[i].split(":");
                        if (urlKey.length === 2) {
                            appntInfo[urlKey[0]] = urlKey[1];
                        } else if (urlKey.length === 1) {
                            appntInfo[urlKey[0]] = "";
                        }
                    }
                    return appntInfo;
                }
                return {};
            }

            function loginInside() {
                $$neptune.$user.loginInSide({userCode: appntInfo.agentcode, password: ''}, {
                    onSuccess: function (data) {
                        $rootScope.$broadcast('userUpdate');
                        // 查询产品列表
                        $scope.showProducts();
                        if (appntInfo.gascode) {
                            // 根据燃气编号查询投保人信息
                            getAppnt(appntInfo.gascode, 'gasUserId', appntInfo);
                            // 根据燃气用户编号查询订单信息
                            getOrdersByGU(appntInfo.gascode);
                        }
                    },
                    onError: function (e) {
                        // SAP跳转失败
                        $rootScope.$broadcast(constants.AUTH.UNAUTHORIZED);
                    }
                });
            }

            function init() {
                // 是否存在路由传值
                if ($stateParams) {
                    if ($stateParams.id) {
                        var product = JSON.parse($stateParams.id);
                        // 产品编号
                        productId = product.productId;
                        // 订单编号
                        orderId = product.orderId;
                    }
                    // 从产品界面跳转过来的
                    whereForm = "products";
                    // SAP过来的
                    if ($stateParams.user) {
                        appntInfo = JSON.parse($stateParams.user).all;
                        if (appntInfo) {
                            // 解析为正常字符串
                            appntInfo = $$util.Base64.decode(appntInfo.replace(/_/g, "/"));
                            // 转换字符串为对象
                            appntInfo = getObjectByUrl(appntInfo);
                            // 是否存在用户账号
                            if (appntInfo.agentcode) {
                                // 重新获取用户信息
                                // $rootScope.user.refresh({
                                //     onSuccess: function () {
                                //         // if ($rootScope.user.approveState === '1') {
                                //         //     layer.msg("您还没通过审核,暂时不能购买产品", {time: 3000});
                                //         // }
                                //         // if ($rootScope.user.approveState === '3') {
                                //         //     layer.msg("由于您审核失败,暂时不能购买产品", {time: 3000});
                                //         // }
                                //     },
                                //     onError: function () {
                                //         // SAP跳转失败
                                //         $rootScope.$broadcast(constants.AUTH.UNAUTHORIZED);
                                //     }
                                // });
                                // 进行内部无密码登录
                                loginInside();
                                // 从SAP跳转过来的
                                whereForm = "SAP";
                            }
                        }
                        // var lastIndex = window.location.href.length;
                        // if(window.location.href.lastIndexOf('{')>-1){
                        //     lastIndex = window.location.href.lastIndexOf('{');
                        // }else if(window.location.href.lastIndexOf('%7B')>-1){
                        //     lastIndex = window.location.href.lastIndexOf('%7B');
                        // }
                        // var state = {title:'',url:window.location.href.substring(0,lastIndex)};
                        // console.log(state)
                        // history.pushState({},'',window.location.href);
                    } else {
                        // 获取header中的iv_user----此方法尚未成功过
                        var req = new XMLHttpRequest();
                        req.open('GET', document.location, false);
                        req.send(null);
                        var headers = req.getAllResponseHeaders();
                        // 是否门户跳转过来的
                        if (headers.indexOf('iv_user') !== -1) {
                            // 分离header
                            headers = headers.split("\n");
                            // 循环找出iv_user
                            for (var i = 0; i < headers.length; i++) {
                                if (headers[i].indexOf('iv_user') !== -1) {
                                    var iv_user = headers[i].split(":");
                                    if (iv_user.length === 2) {
                                        appntInfo.agentcode = iv_user[1];
                                        loginInside();
                                    } else {
                                        // 判断是否登录
                                        $$neptune.$user.isAuthenticated();
                                    }
                                    break;
                                }
                            }
                        } else {
                            // 判断是否登录
                            $$neptune.$user.isAuthenticated();
                        }
                        // if ($rootScope.user.approveState === '1') {
                        //     layer.msg("您还没通过审核,暂时不能购买产品", {time: 3000});
                        // }
                        // if ($rootScope.user.approveState === '3') {
                        //     layer.msg("由于您审核失败,暂时不能购买产品", {time: 3000});
                        // }
                    }
                }
                // 产品列表过来，并且存在账户，查询产品列表
                if ($rootScope.user.agentCode && whereForm === "products")
                    $scope.showProducts();
            }

            //是否投保查询
            $scope.goToQuery = function () {
                if ($scope.insureInfo['C']['gasUserId'] === '' && $scope.insureInfo['A']['certificateNumber'] === '') {
                    layer.msg('燃气编号或证件号码不能为空', {time: 2000});
                    return
                }

                // 检测是否出现提示框
                $$neptune.find(constants.REQUEST_TARGET.HOUSING_INSURANCE_INQUIRIES, {
                    "gusUserId": $scope.insureInfo['C']['gasUserId'] || '#',//燃气编号
                    "cardNo": $scope.insureInfo['A']['certificateNumber'] || '#'//证件号码
                }, {
                    onSuccess: function (data) {
                        if (data.orders.length > 0) {
                            $modal.open({
                                backdrop: 'static',
                                animation: true,
                                templateUrl: 'buy/model/Insurance.modal.html',
                                resolve: {
                                    insureInfo: function () {
                                        return $scope.insureInfo
                                    }
                                },
                                controller: function ($scope, $modalInstance, insureInfo) {
                                    $scope.insureInfo = insureInfo;
                                    /**
                                     * 分页
                                     */
                                    $scope.pagination = {
                                        totalItems: $scope.noticeTices,//总条数
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
                                     * 关闭弹框
                                     */
                                    $scope.close = function () {
                                        $modalInstance.dismiss();
                                    };
                                    /**
                                     * 参数
                                     */
                                    $scope.queryKeywords = {
                                        "gusUserId": $scope.insureInfo['C']['gasUserId'] || '#',//燃气编号
                                        "cardNo": $scope.insureInfo['A']['certificateNumber'] || '#'//证件号码
                                    };
                                    /**
                                     * 查询是否投保
                                     */
                                    $scope.getQueryDetails = function () {
                                        target = constants.REQUEST_TARGET.HOUSING_INSURANCE_INQUIRIES;
                                        $$neptune.find(target, $scope.queryKeywords, {
                                            onSuccess: function (data) {
                                                $scope.insuranceList = data.orders;
                                                $scope.pagination.totalItems = data.totalCount || data.orders.length;
                                                $scope.orderTotal = data.orderTotal || 0;
                                                $scope.ordersNum = data.totalCount;
                                                $scope.pagesAltogether = $scope.pagination.totalItems / $scope.pagination.pageSize;
                                                $scope.taskPageCountNote = Math.ceil($scope.pagesAltogether);
                                            },
                                            onError: function (e) {
                                                layer.msg(e, {time: 2000})
                                            }
                                        }, $scope.pagination)

                                    };
                                    $scope.getQueryDetails()
                                },
                                size: 'sm'
                            })
                        } else {
                            layer.msg("没有符合条件的数据", {time: 3000});
                        }
                    },
                    onError: function (e) {
                        layer.msg(e, {time: 2000})
                    }
                }, {
                    totalItems: $scope.noticeTices,//总条数
                    pageIndex: 1,//页索引
                    pageSize: 10,//每页数量
                    maxSize: 9, //最大容量
                    numPages: 5, //总页数
                    previousText: config.pagination.previousText, //上一页
                    nextText: config.pagination.nextText, //下一页
                    firstText: config.pagination.firstText,   //首页
                    lastText: config.pagination.lastText,  //最后一页
                    pageSizes: [10, 20, 30, 50] // 每页数量集合
                })
            };
            init();

            /**
             * 监测路由跳转到本界面，判断是否需要加载缓存
             */
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (!$rootScope.loadBuy &&
                    $rootScope.user.agentKind === '002' &&
                    ($rootScope.user.isPassed === 'UNPASSED' ||
                        $rootScope.user.branchType2 != 1 ||
                        $rootScope.user.approveState == "1" ||
                        !$rootScope.user.approveState ||
                        !$rootScope.user.idcard_nega_photo ||
                        !$rootScope.user.idcare_posi_photo)) {
                    $rootScope.loadBuy = true;
                    setTimeout(function () {
                        $state.go('userCenter', {type: "basicInfoDefault"});
                    }, 50);
                    setTimeout(function () {
                        $rootScope.loadBuy = false;
                        alert('请确认是否已通过认证考试、已签署代理协议、已上传照片，若未通过认证考试或未签署代理协议、未上传照片，请去个人中心进行操作。');
                    }, 500);
                    return;
                }
                // 不是从支付界面跳转回来的，清除缓存
                if (fromState.name !== 'pay') {
                    // 清除缓存
                    orderEntryCache.clear();
                } else {
                    // 设置等待，达到条件后赋值缓存内容
                    cacheDeferred = $q.defer();
                    cacheDeferred.promise.then(function () {
                        $timeout(function () {
                            var insureInfo = orderEntryCache.getOrderCache("insureInfo");
                            if (insureInfo)
                                $scope.insureInfo = insureInfo;
                        }, 500);
                    });
                }
            });
        }]);
});