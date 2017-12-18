define([
    'app',
    'config',
    'constants',
    'layer',
    'plupload'
], function (app, config, constants, layer) {
    app.registerController('signOutCtrl', ['$scope', '$state', '$$neptune', '$rootScope', '$timeout', '$modal',
        function ($scope, $state, $$neptune, $rootScope, $timeout, $modal) {
            $scope.isVerification = false;
            $scope.isComplete = false;
            $scope.signOut = {
                surrender: {
                    policyNO: '',//保单号
                    edorDetail: '',//退保原因
                    edorSubmitName: '',//收款人
                    surrenderType: "",//退保类型
                    openBank: "",//开户行
                    bankAccNo: ''//银行账号
                }
            };
            /**
             * 打开订单详情
             * @param id
             * @param type 订单或保单
             */
            $scope.getOpenOrderDetails = function (id) {
                console.log(id);
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'signOut/model/policyNo.model.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        /**
                         * 获取订单详情
                         */
                        function getOrder() {
                            $$neptune.$order.policyNoDetails(id, {
                                onSuccess: function (data) {
                                    $scope.order = data;
                                },
                                onError: function (e) {
                                    layer.msg(e, {time: 3000});
                                }
                            });
                        }

                        /**
                         * 获取单证
                         */
                        function getDocument() {
                            $$neptune.$document.getDocument(id, {
                                onSuccess: function (data) {
                                    $scope.myDocument = data;
                                },
                                onError: function (e) {
                                    // layer.msg("接口问题", {time: 3000});
                                }
                            });
                        }

                        getDocument();

                        getOrder();
                    },
                    size: 'sm'
                })
            };
            /**
             * 退保提交
             * */
            // var uploader = new plupload.Uploader({
            //     runtimes: 'gears,html5,html4,flash,silverlight,browserplus',
            //     headers: {'Access-Control-Allow-Origin': '*'},// 设置头部，干掉跨域问题
            //     browse_button: $("#pickfiles")[0], //触发文件选择对话框的按钮，为那个元素id 获取电脑文件
            //     url: constants.backend.SERVER_ORDER_IP + "ins/request/tb", //服务器端的上传页面地址
            //     flash_swf_url: 'assets/js/plupload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
            //     silverlight_xap_url: 'assets/js/plupload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
            //     filters: {
            //         mime_types: [
            //             {title: "Xls files", extensions: "xls,xlsx"},
            //             {title: "Image files", extensions: "jpg,gif,png"}
            //         ],
            //         prevent_duplicates: true //不允许选取重复文件
            //     },
            //     multipart_params: {
            //         'policyNO': $scope.signOut.surrender.policyNO,
            //         'edorDetail': $scope.signOut.surrender.edorDetail,
            //         'memberId': $rootScope.user.agentCode,
            //         'EdorSubmitName': $scope.signOut.surrender.edorSubmitName,
            //         'BankAccNo': $scope.signOut.surrender.bankAccNo,
            //         // 'Content-Type': 'text/plain; charset=utf8'
            //     },
            //     init: {
            //         FilesAdded: function (up, files) {
            //             $('#condolences1').val(files[0].name);//文件名称显示
            //             plupload.each(files, function (file) {//循环在页面中写选中文件的名字
            //                 $("#filelist").append(
            //                     '<input id="input' + file.id + '" name="thumbimg" readonly  style="border:0px;background-color:transparent;border-style:none;" class="form-control ' + file.id + '" value="'
            //                     + file.name
            //                     + '"/>');
            //                 $("#filelist").append(
            //                     '<label id="label' + file.id + '" for="none" readonly class="control-label processbar col-md-1 ' + file.id + '" ></label>');
            //                 var deleteFile = document.createElement("span");
            //                 deleteFile.innerHTML = "X";
            //                 deleteFile.style.cursor = 'pointer';
            //                 deleteFile.onclick = function () {
            //                     up.removeFile(file);
            //                     $("#filelist")[0].removeChild(deleteFile);
            //                     $("#filelist")[0].removeChild($("#input" + file.id)[0]);
            //                     $("#filelist")[0].removeChild($("#label" + file.id)[0]);
            //                 };
            //                 $("#filelist").append(deleteFile);
            //             });
            //         },
            //         FileUploaded: function (up, file, response) {//这里response为后端反参
            //             var response = JSON.parse(response.response);
            //             if (!response.success) {
            //                 layer.msg("处理失败：" + response.error.message, {time: 2000});
            //                 // 上传之后清空文件
            //                 $.each(up.files, function (i, file) {
            //                     up.removeFile(file);
            //                 });
            //                 $('#filelist').children().remove();
            //                 return
            //             }
            //             if (response.success) {
            //                 layer.msg("退保申请已接受，请稍后到全部订单查看保单状态", {time: 2000});
            //                 $scope.signOut.surrender = '';
            //                     // 上传之后清空文件
            //                     $.each(up.files, function (i, file) {
            //                         up.removeFile(file);
            //                     });
            //                 $('#filelist').children().remove();
            //                 $scope.signOut = {
            //                     surrender: {
            //                         policyNO: '',//保单号
            //                         edorDetail: '',//退保原因
            //                         edorSubmitName: '',//收款人
            //                         surrenderType: "",//退保类型
            //                         openBank: "",//开户行
            //                         bankAccNo: ''//银行账号
            //                     }
            //                 };
            //                 return
            //             }
            //
            //         },
            //         Error: function (up, err) {
            //             layer.msg('上传失败' + '[' + err.message + ']', {time: 1000});
            //             // 上传之后清空文件
            //             $.each(up.files, function (i, file) {
            //                 up.removeFile(file);
            //             });
            //             $('#condolences1').val('');
            //         }
            //     }
            // });
            // uploader.init();

            var loadingIndex = undefined;
            $scope.successResult = function () {
                $scope.isComplete = false;
                if (uploader.files.length == '0') {
                    layer.msg("请选择文件", {time: 2000});
                } else {
                    uploader.setOption({
                        multipart_params: {
                            policyNO: $scope.signOut.surrender.policyNO,//保单号
                            edorDetail: $scope.signOut.surrender.edorDetail,//退保原因
                            operator: $rootScope.user.agentCode,
                            EdorSubmitName: $scope.signOut.surrender.edorSubmitName,//指定退保人
                            BankAccNo: $scope.signOut.surrender.bankAccNo,//银行卡
                            surrenderType: $scope.signOut.surrender.surrenderType,//退保类型
                            openBank: $scope.signOut.surrender.openBank//开户行
                        }
                    });
                    loadingIndex = layer.load(1, {
                        shade: false,
                        time: 10 * 1000
                    });
                    uploader.start();//为插件中的start方法，进行上传
                }
            };

            var uploader = new plupload.Uploader({
                runtimes: 'gears,html5,flash,html4,silverlight,browserplus',
                browse_button: $("#browse")[0], //触发文件选择对话框的按钮，为那个元素id 获取电脑文件
                headers: {'Access-Control-Allow-Origin': '*'},// 设置头部，干掉跨域问题
                url: constants.backend.SERVER_ORDER_IP + "ins/request/tb", //服务器端的上传页面地址
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
                multipart_params: {
                    'policyNO': $scope.signOut.surrender.policyNO,
                    'edorDetail': $scope.signOut.surrender.edorDetail,
                    'memberId': $rootScope.user.agentCode,
                    'EdorSubmitName': $scope.signOut.surrender.edorSubmitName,
                    'BankAccNo': $scope.signOut.surrender.bankAccNo
                },
                init: {
                    // PostInit: function () {
                    //     $("#start_upload").on('click', function () {
                    //         uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
                    //         return false
                    //     })
                    // },
                    FilesAdded: function (up, files) {
                        var valStr = "";
                        $.each(files, function (index, file) {
                            valStr += file.name;
                        });
                        $('#condolences1').val(valStr);//文件名称显示
                    },

                    FileUploaded: function (up, file, response) {//这里response为后端反参
                        layer.close(loadingIndex);
                        var response = JSON.parse(response.response);
                        if (!response.success) {
                            layer.msg("处理失败：" + response.error.message, {time: 3000});
                            // 上传之后清空文件
                            up.splice(0, file.length);
                            $('#condolences1').val('');
                            return
                        }
                        if (response.success) {
                            layer.msg("退保申请已接受，请稍后到全部订单查看保单状态", {time: 3000});
                            $scope.signOut.surrender = '';
                            // 上传之后清空文件
                            up.splice(0, file.length);
                            $('#condolences1').val('');
                            $scope.signOut = {
                                surrender: {
                                    policyNO: '',//保单号
                                    edorDetail: '',//退保原因
                                    edorSubmitName: '',//收款人
                                    surrenderType: "",//退保类型
                                    openBank: "",//开户行
                                    bankAccNo: ''//银行账号
                                }
                            };
                            return
                        }
                    },
                    Error: function (up, err) {
                        layer.msg('上传失败' + '[' + err.message + ']', {time: 1000});
                        layer.close(loadingIndex);
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

            //实例化一个plupload上传对象
            $scope.getSignOut = function () {
                if ($scope.signOut.surrender.bankAccNo.length < 16 || $scope.signOut.surrender.bankAccNo.length > 21) {
                    layer.msg("请输入正确银行卡号", {time: 3000});
                    return
                }
                $scope.isComplete = true;
                return false
            };

            function init() {
            }

            init();
        }]);

});