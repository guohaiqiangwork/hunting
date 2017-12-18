define([
    'app',
    'config',
    'constants',
    'layer',
    'plupload'
], function (app, config, constants, layer) {
    app.registerController('mDocumentsCtrl', ['$scope', '$state', '$$neptune', '$rootScope', '$modal',
        function ($scope, $state, $$neptune, $rootScope, $modal) {
            //绑定页面元素
            $scope.myDocument = {};
            $scope.docuStatistics = {
                "supplier": {
                    supplierCode: ""
                }
            };
            $scope.enquiries = {
                "state": "1"
            };
            /**
             * 分页
             */
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
             * 所搜重置索引
             */
            $scope.searchDocuments = function () {
                $scope.pagination.pageIndex = 1;
                $scope.checkMyDocuments();
            };
            /**
             * 根据用户id和起始终止号查询我的单证
             */
            $scope.checkMyDocuments = function () {
                var keywords = {
                    "myDocument": $scope.myDocument,
                    "pagination": $scope.pagination,
                    "supplierCode": $scope.docuStatistics.supplier ? $scope.docuStatistics.supplier.supplierCode : "",
                    "state": $scope.enquiries.state
                };
                $$neptune.$document.searchDocuments(keywords, {
                    onSuccess: function (data) {
                        $scope.pagination.totalItems = data.total; //分页
                        $scope.documents = data.evenTables;
                    },
                    onError: function (e) {

                    }
                });
            };
            /**
             * 遗失、作废弹窗
             * @param type
             * @param item
             */
            $scope.openModal = function (type, item) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'docuStatistics/modal/mDocuments.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.titleText = type;
                        $scope.myDocument = {
                            "startNo": item.startNo,    //-- 用户选择的号段
                            "endNo": item.endNo   //-- 用户选择的号段
                        };

                        var uploader = undefined;

                        setTimeout(function () {
                            uploader = new plupload.Uploader({
                                runtimes: 'gears,html5,flash,html4,silverlight,browserplus',
                                browse_button: $("#browse")[0], //触发文件选择对话框的按钮，为那个元素id 获取电脑文件
                                headers: {'Access-Control-Allow-Origin': '*'},// 设置头部，干掉跨域问题
                                // url: constants.backend.SERVER_DOCUMENT_IP + "/turninBatch", //服务器端的上传页面地址---统一接口
                                url: constants.backend.SERVER_DOCUMENT_IP + "documents/turninBatch", //服务器端的上传页面地址----直连
                                flash_swf_url: 'assets/js/plupload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
                                silverlight_xap_url: 'assets/js/plupload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                                filters: {
                                    mime_types: [ //只允许上传jWORD,PPT,PDF,EXCEL 格式文件
                                        {title: "文件", extensions: "doc,docx,pdf,xls,xlsx,ppt,pptx,txt"},
                                        {title: "", extensions: "jpg,gif,png"},
                                        {title: "", extensions: "zip,rar,7z,gz,BZ,ACE,UHA,UDA,ZPAQ"}
                                    ],
                                    prevent_duplicates: true //不允许选取重复文件
                                },
                                multipart_params: {},
                                init: {
                                    FilesAdded: function (up, files) {
                                        if (files.length > 0) {
                                            var valStr = "";
                                            $.each(files, function (index, file) {
                                                valStr += file.name;
                                            });
                                            $('#condolences1').val(valStr);//文件名称显示
                                        }
                                    },

                                    FileUploaded: function (up, file, response) {//这里response为后端反参
                                        var response = JSON.parse(response.response);
                                        if (!response.success) {
                                            layer.msg("处理失败：" + response.error.message, {time: 3000});
                                            // 上传之后清空文件
                                            up.splice(0, file.length);
                                            return
                                        }
                                        if (response.success) {
                                            layer.msg($scope.titleText + "成功", {time: 3000});
                                            $modalInstance.close();
                                            return
                                        }
                                    },
                                    Error: function (up, err) {
                                        layer.msg('上传失败' + '[' + err.message + ']', {time: 1000});
                                        // 上传之后清空文件
                                        $.each(up.files, function (i, file) {
                                            up.removeFile(file);
                                        });
                                        $('#condolences1').val('');
                                    }
                                }
                            });

                            // 在实例对象上调用init()方法进行初始化
                            uploader.init();
                        }, 50);
                        /**
                         * 关闭弹窗
                         */
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.successResult = function () {
                            if (uploader.files.length === '0') {
                                layer.msg("请选择文件", {time: 2000});
                            } else {
                                uploader.setOption({
                                    multipart_params: {
                                        "serialNo": item.serialNo,   // -- 产品的流水号
                                        "startNo": $scope.myDocument.startNo,    //-- 用户选择的号段
                                        "endNo": $scope.myDocument.endNo,   //-- 用户选择的号段
                                        type: type==='作废' ? 0 : 1
                                    }
                                });
                                uploader.start();//为插件中的start方法，进行上传
                            }
                        };
                    }
                }).result.then(function () {
                    $scope.checkMyDocuments();
                });
            };
            /**
             * 上交弹窗
             * @param document
             */
            $scope.openHandInModal = function (document) {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'docuStatistics/modal/handin.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {

                        $scope.myDocument = {
                            fdCom: {},
                            serialNo: document.serialNo,
                            TarAgentCode: "", //领用人code
                            agentCodeOrName: "",  // 领用人姓名或code
                            isOpen: false, // 是否打开下拉框
                            isFocusSelect: false // 焦点是否在下拉框
                        };
                        // 焦点不在领用人上时关闭
                        $scope.isBlur = function () {
                            if ($scope.myDocument.isFocusSelect) {
                                return true;
                            }
                            $scope.myDocument.isOpen = false;
                            return false;
                        };
                        // 接收机构下拉框初始化
                        $$neptune.$document.receivingDropBoxInitial(document.certifyCode, {
                            onSuccess: function (data) {
                                $scope.fdComs = [];
                                if (data instanceof Array && data.length > 0) {
                                    $.each(data, function (index, item) {
                                        if (item.comGrade && document.comGrade && parseInt(item.comGrade)<= parseInt(document.comGrade)) {
                                            $scope.fdComs.push(item);
                                        }
                                    });
                                }
                            },
                            onError: function (e) {

                            }
                        });
                        /**
                         * 接收目标人下是根据用户选择接收机构后级联显示
                         */
                        $scope.cascadingDisplay = function () {
                            $$neptune.$document.cascadingDisplay({
                                comCode: $scope.myDocument.fdCom.inComCode,
                                agentCodeOrName: $scope.myDocument.agentCodeOrName,
                                comGrade: $scope.myDocument.fdCom.comGrade,
                                CertifyCode: $scope.myDocument.fdCom.certifyCode
                            }, {
                                onSuccess: function (data) {
                                    $scope.cascadingDisplays = data;
                                },
                                onError: function (e) {

                                }
                            });
                        };
                        /**
                         * 赋值领用人code
                         * @param cascadingDisplay
                         */
                        $scope.setTarAgentCode = function (cascadingDisplay) {
                            $scope.myDocument.isOpen = false;
                            $scope.myDocument.agentCodeOrName = cascadingDisplay.name;
                            $scope.myDocument.TarAgentCode = cascadingDisplay.agentCode;
                        };
                        /**
                         * 关闭弹窗
                         */
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.successResult = function () {
                            $$neptune.$document.documentHandIn($scope.myDocument, {
                                onSuccess: function (data) {
                                    if (data && data.resultSuccess && typeof data.resultSuccess === 'string') {
                                        layer.msg(data.resultSuccess, {time: 3000});
                                    }
                                    $modalInstance.close();
                                },
                                onError: function (e) {

                                }
                            });
                        };
                    }
                }).result.then(function () {
                    $scope.checkMyDocuments();
                });
            };
            //重置
            $scope.mDocumentsResetting = function () {
                $scope.myDocument = {
                    "startNo": "",
                    "endNo": ""
                };
                $scope.docuStatistics.supplier = "";
                $scope.enquiries.state = "1";
                $scope.checkMyDocuments();
            };
            //查询保险公司接口
            $scope.documentCompany = function () {
                $$neptune.$document.enquiryCompany({
                    onSuccess: function (data) {
                        $scope.ListOfCompany = data;
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢,请稍后重试", {time: 3000});
                    }
                });
            };

            function init() {
                $scope.checkMyDocuments();
                $scope.documentCompany();
            }

            init();
        }]);

});