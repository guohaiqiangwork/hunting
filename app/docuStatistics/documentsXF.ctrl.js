define([
    'app',
    'config',
    'constants',
    'jedate',
    'layer'
], function (app, config, constants, jedate, layer) {
    app.registerController('documentsXFCtrl', ['$scope', '$state', '$$neptune', '$rootScope',
        function ($scope, $state, $$neptune, $rootScope) {
            // 单证下发实例
            $scope.documentXF = {
                "certifyCode": "", //单证编码
                "startNo": "", //起始号
                "endNo": "",   //终止号
                "sumCount": undefined,  //数量单证数量
                "curAgentCode": $rootScope.user.agentCode,  //当前持有人(登录人员编号)
                "operator": $rootScope.user.agentCode,  //操作员(登录人员编号)
                "TarAgentCode": "",  // 分发目标人(用户选择的)
                fdCom: {}, // 接收机构
                supplierCode: "", // 公司编码
                certifyLength: undefined // 单证号码长度
            };
            // 领用人使用
            $scope.tarAgent = {
                agentCodeOrName: "",  // 领用人姓名或code
                isOpen: false, // 是否打开下拉框
                isFocusSelect: false // 焦点是否在下拉框
            };

            /**
             * 分页*/
            $scope.pagination = {
                totalItems: 0,//总条数
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
             * 单证下发
             */
            $scope.issued = function () {
                if (parseInt($scope.documentXF.endNo) < parseInt($scope.documentXF.startNo)) {
                    layer.msg("单证起始号码不能大于单证终止号码", {time: 1500});
                    return false
                }
                $$neptune.$document.documentIssuedIBy($scope.documentXF, {
                    onSuccess: function (data) {
                        if (typeof data === 'string') {
                            layer.msg(data, {time: 3000});
                        }
                        $scope.getCertifyProvides();
                    },
                    onError: function (e) {

                    }
                });
            };

            /**
             * 单证下发页面初始化
             */
            $scope.getCertifyProvides = function () {
                $$neptune.find(constants.REQUEST_TARGET.ISSUED_INITIALIZATION, '', {
                    onSuccess: function (data) {
                        $scope.documents = data.certifyProvideReturns;
                        $scope.pagination.totalItems = data.total;
                    },
                    onError: function (e) {

                    }
                }, $scope.pagination);
            };
            /**
             * 单证下发 接收机构下拉框初始化
             */
            $scope.fdCom = function () {
                $$neptune.$document.receivingDropBoxInitial($scope.documentXF.certifyCode, {
                    onSuccess: function (data) {
                        $scope.fdComs = data;
                    },
                    onError: function (e) {

                    }
                });
            };
            /**
             * 接收目标人下是根据用户选择接收机构后级联显示
             */
            $scope.cascadingDisplay = function () {
                if($scope.documentXF.fdCom!==null){
                    $$neptune.$document.cascadingDisplay({
                        comCode: $scope.documentXF.fdCom.inComCode,
                        comGrade: $scope.documentXF.fdCom.comGrade,
                        agentCodeOrName: $scope.tarAgent.agentCodeOrName,
                        CertifyCode: $scope.documentXF.certifyCode
                    }, {
                        onSuccess: function (data) {
                            $scope.cascadingDisplays = data;
                        },
                        onError: function (e) {

                        }
                    });
                }
            };
            /**
             * 赋值领用人code
             * @param cascadingDisplay
             */
            $scope.setTarAgentCode = function (cascadingDisplay) {
                $scope.tarAgent.isOpen = false;
                $scope.tarAgent.agentCodeOrName = cascadingDisplay.name;
                $scope.documentXF.TarAgentCode = cascadingDisplay.agentCode;
            };
            // 焦点不在领用人上时关闭
            $scope.isBlur = function () {
                if ($scope.tarAgent.isFocusSelect) {
                    return true;
                }
                $scope.tarAgent.isOpen = false;
                return false;
            };
            /**
             * 单证下发 撤销
             * @param SerialNo 单证流水号
             */
            $scope.documentsToCancel = function (SerialNo) {
                $$neptune.$document.documentsToCancel(SerialNo, {
                    onSuccess: function (data) {
                        if (data && typeof data === 'string') {
                            layer.msg(data, {time: 3000});
                        }
                        $scope.getCertifyProvides();
                    },
                    onError: function (e) {

                    }
                });
            };
            /**
             * 计算数量
             */
            $scope.calculatedQuantity = function () {
                if ($scope.documentXF.endNo && !/^[0-9]\d*$/.test($scope.documentXF.endNo)) {
                    $scope.documentXF.endNo = "";
                }
                console.log($scope.documentXF.endNo);
                if ($scope.documentXF.startNo && !/^[0-9]\d*$/.test($scope.documentXF.startNo)) {
                    $scope.documentXF.startNo = "";
                }
                if ($scope.documentXF.endNo && $scope.documentXF.startNo) {
                    var result = parseInt($scope.documentXF.endNo) - parseInt($scope.documentXF.startNo);
                    if (result >= 0) {
                        $scope.documentXF.sumCount = result + 1;
                    } else {
                        $scope.documentXF.sumCount = 0;
                    }
                }
            };

            //查询保险公司接口
            $scope.documentEnquiryCompany = function () {
                $$neptune.$document.enquiryCompany({
                    onSuccess: function (data) {
                        $scope.ListOfInsurers = data;
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //根据保险公司code查询单证名称接口
            $scope.queryDocumentName = function () {
                var keywords = {
                    "supplierCode": $scope.documentXF.supplierCode || ""
                };
                // 清空单位名称编号
                $scope.documentXF.certifyCode = "";
                $scope.documentXF.startNo = "";
                $scope.documentXF.endNo = "";
                $$neptune.$document.enquiriesDocumentName(keywords, {
                    onSuccess: function (data) {
                        $scope.ListOfQueryDocumentName = data;
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };

            /**
             * 计算单证号码最大长度
             * @param item
             */
            $scope.certifyLength = function (item) {
                $scope.documentXF.certifyLength = item.certifyLength;
                $scope.documentXF.certifyCode = item.certifyCode;
                if ($scope.documentXF.certifyLength < $scope.documentXF.startNo.length) {
                    $scope.documentXF.startNo = "";
                }
                if ($scope.documentXF.certifyLength < $scope.documentXF.endNo.length) {
                    $scope.documentXF.endNo = "";
                }
                $scope.fdCom();
            };

            function init() {
                var date = new Date();
                // 下发时间--默认当前时间
                $scope.nowTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

                $scope.getCertifyProvides();

                $scope.documentEnquiryCompany();

            }

            init();
        }]);

});