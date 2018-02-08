define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('homeCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            //轮播图
            var carouselFigure = function () {
                $("#lazyload_3").slide({trigger: "click", effect: "fade", auto: true, duration: 5, lazyload: true});
                $("pre.jsCode").snippet("javascript", {style: "custom_js", showNum: false});
                $("pre.jsCodeNum").snippet("javascript", {style: "custom_js"});
            };
            /**
             * 初始化数据
             */
            $scope.areaHome = {
                "title": "标题",
                "type": "1",// 类型：1个人挂靠，2企业寻证，3全球招聘
                "QQ": "", // QQ
                "WX": "", // 微信
                "name": "", // 名字
                "address": "", // 地址
                "sex": "男", // 性别
                "phone": "",
                "mailbox": "",
                "registrationType": "1", // 注册类型
                "company": "", // 公司名称
                "certificateCode": "", // 证书类型编码
                "idClassification": "", //类型下拉框
                "idClassifications": "", // 输入框
                "idArea": "" // 地区分类：选择市就传市code，若没选择市就传省code
            };
            /**
             * 发布信息
             */
            // $scope.areaHomeList = {
            //     "title":"标题",
            //     "type":"1",// 类型：1个人挂靠，2企业寻证，3全球招聘
            //     "QQ":$scope.areaHome.QQ, // QQ
            //     "WX":$scope.areaHome.WX, // 微信
            //     "name":$scope.areaHome.name, // 名字
            //     "address":$scope.areaHome.address, // 地址
            //     "sex":$scope.areaHome.sex, // 性别
            //     "phone":$scope.areaHome.phone,
            //     "mailbox":$scope.areaHome.mailbox,
            //     "registrationType":"1", // 注册类型
            //     "company":$scope.areaHome.company, // 公司名称
            //     "certificateCode":$scope.areaHome.certificateCode, // 证书类型编码
            //     "idClassification":$scope.areaHome.idClassification, // 职业分类:选择小类就传小类code，若没选择小类就传大类code
            //     "idArea":$scope.areaHome.idArea // 地区分类：选择市就传市code，若没选择市就传省code
            // };
            /**
             * 获取地区信息
             */
            $scope.getRegional = function () {
                $$neptune.find(constants.REQUEST_TARGET.GET_REGIONAL_FIND, "", {
                    onSuccess: function (data) {
                        $scope.regionalList = data.area;
                        $scope.classificationList = data.classification
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢请稍后重试", {time: 1000});
                    }
                });
            };
            /**
             * 发布信息
             */
            $scope.releaseInfo = function (id) {
                $scope.areaHome.type = id;
                $$neptune.$release.releaseInfo($scope.areaHome, {
                    onSuccess: function (data) {
                        console.log(data)
                    },
                    onError: function (e) {
                        layer.msg("网络缓慢，请联系管理员", {time: 1000})
                    }
                })

            };
            var init = function () {
                carouselFigure();//初始化加载轮播图
                $scope.getRegional()//获取地区信息
                $scope.releaseInfo()
            };

            init();
        }]);

});