define([
    'app',
    'config',
    'constants',
    'jedate',
    'layer'
], function (app, config, constants, jedate,layer) {
    app.registerController('documentsRKCtrl', ['$scope', '$state', '$$neptune', '$rootScope', '$filter',
        function ($scope, $state, $$neptune, $rootScope, $filter) {
            //绑定页面元素
            $scope.docuStatistics = {
                "certifyCode": "",// 单证编码
                "certifyName": "", // 单证名称
                "insuranceCompanyName": "",//所属保险公司名称
                "supplierCode": "",  //所属保险公司编码
                "startNo": "", //起始号
                "endNo": "",  //终止号
                "sumCount": '',  //数量单证数量
                "curAgentCode": "", // 当前持有人(登录人员编号)
                "state": "",  //-1-无效00-未使用01-已使用02-待接收确认03-已作废04-已遗失05-待上交确认06-已上交07-已回销
                "operator": $rootScope.user.agentCode, //操作员(登录人员编号)
                "supplier": {},
                "certify": {},
                "certifyLength":""  //单证类型长度
            };
            //当前时间
            $scope.formatDate = $filter('date')(new Date(), 'yyyy-MM-dd');
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
            //单证入库接口
            $scope.documentPutInStorage = function () {
                if (parseInt($scope.docuStatistics.endNo) < parseInt($scope.docuStatistics.startNo)) {
                    layer.msg("单证起始号码不能大于单证终止号码", {time: 1500});
                    return false
                }
                var keywords = {
                    "certifyCode": $scope.docuStatistics.certify.certifyCode,// 单证编码
                    "certifyName": $scope.docuStatistics.certify.certifyName, // 单证名称
                    "supplierCode": $scope.docuStatistics.supplier.supplierCode,  //所属保险公司编码
                    "startNo": $scope.docuStatistics.startNo, //起始号
                    "endNo": $scope.docuStatistics.endNo,  //终止号
                    "sumCount": $scope.docuStatistics.endNo - $scope.docuStatistics.startNo + 1,  //数量单证数量
                    "curAgentCode": $rootScope.user.agentCode, // 当前持有人(登录人员编号)
                    "operator": $rootScope.user.agentCode //操作员(登录人员编号)
                };
                $$neptune.$document.putInStorage(keywords, {
                    onSuccess: function (data) {
                        layer.msg(data.resultSuccess, {time: 3000});
                        $scope.checkAllDocuments();
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
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
                    "supplierCode": $scope.docuStatistics.supplier ? $scope.docuStatistics.supplier.supplierCode : ""
                };
                $scope.docuStatistics.certify="";//单证类型长度初始化
                $scope.acquiringLength();

                $$neptune.$document.enquiriesDocumentName(keywords, {
                    onSuccess: function (data) {
                        $scope.ListOfQueryDocumentName = data;
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //查询其所有的入库单证接口
            $scope.checkAllDocuments = function () {
                var keywords = {
                    "curAgentCode": $rootScope.user.agentCode,
                    "pagination": $scope.pagination
                };
                $$neptune.$document.checkAllOfDocuments(keywords, {
                    onSuccess: function (data) {
                        $scope.pagination.totalItems = data.total; //分页
                        $scope.singleCardList = data.evenTables;
                        //显示状态
                        for (i = 0; i < $scope.singleCardList.length; i++) {
                           switch($scope.singleCardList[i].state){
                               case "-1":$scope.singleCardList[i].state="无效";break;
                               case "00":$scope.singleCardList[i].state="未使用";break;
                               case "01":$scope.singleCardList[i].state="已使用";break;
                               case "02":$scope.singleCardList[i].state="待接收确认";break;
                               case "03":$scope.singleCardList[i].state="已作废";break;
                               case "04":$scope.singleCardList[i].state="已遗失";break;
                               case "05":$scope.singleCardList[i].state="待上交确认";break;
                               case "06":$scope.singleCardList[i].state="已上交";break;
                               case "07":$scope.singleCardList[i].state="已回销";break;
                           }
                        }
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //入库撤销
            $scope.goToRevocation = function (serialNo, state) {
                switch(state){
                    case "无效"      :     state="-1";break;
                    case "未使用"    :     state="00";break;
                    case "已使用"    :     state="01";break;
                    case "待接收确认":     state="02";break;
                    case "已作废"    :     state="03";break;
                    case "已遗失"    :     state="04";break;
                    case "待上交确认":     state="05";break;
                    case "已上交"    :     state="06";break;
                    case "已回销"    :     state="07";break;
                 }
                var keywords = {
                    "serialNo": serialNo,
                    "state": state
                };
                $$neptune.$document.documentsLibraryToCancel(keywords, {
                    onSuccess: function (data) {
                        layer.msg(data.resultSuccess, {time: 3000});
                        $scope.checkAllDocuments()
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };
            //获取份数
            $scope.getCopies = function () {
                if ($scope.docuStatistics.endNo && !/^[0-9]\d*$/.test($scope.docuStatistics.endNo)) {
                    $scope.docuStatistics.endNo = "";
                }
                console.log($scope.docuStatistics.endNo);
                if ($scope.docuStatistics.startNo && !/^[0-9]\d*$/.test($scope.docuStatistics.startNo)) {
                    $scope.docuStatistics.startNo = "";
                }
                if ($scope.docuStatistics.endNo && $scope.docuStatistics.startNo){
                    var counts =  parseInt($scope.docuStatistics.endNo) -  parseInt($scope.docuStatistics.startNo);
                }
                if (counts >= 0) {
                    $scope.docuStatistics.sumCount = counts + 1
                } else {
                    $scope.docuStatistics.sumCount = ""
                }
            };
            //获取单证类型长度
            $scope.acquiringLength= function () {
                $scope.docuStatistics.certifyLength=$scope.docuStatistics.certify?$scope.docuStatistics.certify.certifyLength :"";
                //当更换单证类型时判断是否初始化输入框的数据
                if($scope.docuStatistics.certifyLength<$scope.docuStatistics.endNo.length||$scope.docuStatistics.certifyLength<$scope.docuStatistics.startNo.length){
                    $scope.docuStatistics.endNo="";
                    $scope.docuStatistics.startNo="";
                    $scope.docuStatistics.sumCount="";
                }
            };

            function init() {
                $scope.documentEnquiryCompany();
                $scope.checkAllDocuments();
            }
            init();
        }]);

});