define([
    'app',
    'config',
    'constants',
    'layer',
    'plupload'
], function (app, config, constants, layer) {
    app.registerController('managementCtrl', ['$scope', '$state', '$rootScope', '$$neptune', '$timeout', '$stateParams',
        function ($scope, $state, $rootScope, $$neptune, $timeout, $stateParams) {
            $scope.organization = {
                surrender: {
                    "type": '1',//：1政策，2公告，3行业新闻 
                    "title": '',//"标题",
                    "source": '',// "来源未知",
                    "browsingNumber": ''
                }
            };
            $scope.successResult = function () {
                $scope.isComplete = false;
                if (uploader.files.length == '0') {
                    layer.msg("请选择文件", {time: 2000});
                } else {
                    uploader.setOption({
                        multipart_params: {
                            type: $scope.organization.surrender.type,//：1政策，2公告，3行业新闻 
                            title: $scope.organization.surrender.title,//"标题",
                            source: $scope.organization.surrender.source,// "来源未知",
                            browsingNumber: $scope.organization.surrender.browsingNumber
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
                url: 'http://192.168.0.105:8081/hunting/' + "dynamic/addDynamic", //服务器端的上传页面地址
                flash_swf_url: 'assets/js/plupload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
                silverlight_xap_url: 'assets/js/plupload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                filters: {
                    mime_types: [ //只允许上传jWORD,PPT,PDF,EXCEL 格式文件
                        {title: "", extensions: "doc,docx"}
                    ],
                    prevent_duplicates: true //不允许选取重复文件
                },
                multipart_params: {
                    "type": $scope.organization.surrender.type,//：1政策，2公告，3行业新闻 
                    "title": $scope.organization.surrender.title,//"标题",
                    "source": $scope.organization.surrender.source,// "来源未知",
                    "browsingNumber": $scope.organization.surrender.browsingNumber
                },
                init: {
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
                            layer.msg("上传失败请稍后再试：", {time: 3000});
                            // 上传之后清空文件
                            up.splice(0, file.length);
                            $('#condolences1').val('');
                            return
                        }
                        if (response.success) {
                            layer.msg("更新成功", {time: 3000});
                            $scope.organization.surrender = '';
                            // 上传之后清空文件
                            up.splice(0, file.length);
                            $('#condolences1').val('');
                            $scope.organization = {
                                surrender: {
                                    "type": '1',//：1政策，2公告，3行业新闻 
                                    "title": '',//"标题",
                                    "source": '',// "来源未知",
                                    "browsingNumber": ''
                                }
                            };
                            return
                        }
                    },
                    Error: function (up, err) {
                        layer.msg('上传失败,请联系管理员', {time: 1000});
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
                $scope.isComplete = true;
                return false
            };

            var init = function () {


            };
            init();
        }]);

});