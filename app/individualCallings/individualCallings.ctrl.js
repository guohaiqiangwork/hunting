define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('individualCallingsCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout','$stateParams',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout,$stateParams) {
            $scope.infoList={
                "idClassification1":"",
                "idClassification2":"",
                "idArea1":"",
                "idArea2":""
            };
            $scope.Initialize= function () {
                $scope.infoList={
                    "idClassification1":"",
                    "idClassification2":"",
                    "idArea1":"",
                    "idArea2":""
                };
            };
            $scope.a= function () {
                $(".test li").click(function() {
                    $(this).siblings('li').removeClass('colorSelected');  // 删除其他兄弟元素的样式
                    $(this).addClass('colorSelected');                            // 添加当前元素的样式
                });
            };
            $scope.b= function () {
                $(".test li").removeClass('colorSelected');
            };

            /**
             * 获取地区信息
             */
            $scope.getRegional = function () {
                $$neptune.find(constants.REQUEST_TARGET.GET_REGIONAL_FIND, "", {
                    onSuccess: function (data) {
                        console.log(data);
                        $scope.regionalList = data.area;
                        $scope.classificationList = data.classification;
                        $scope.regionalLists = [];
                        $scope.classificationLists = [];
                        angular.forEach($scope.regionalList, function (data, index) {
                            if ($scope.regionalList[index].areaType == 1) {
                                $scope.regionalLists.push(data)
                            }
                        });
                        angular.forEach($scope.classificationList, function (data, index) {
                            if ($scope.classificationList[index].classType == 1) {
                                $scope.classificationLists.push(data)
                            }
                        });

                    },
                    onError: function (e) {
                        layer.msg("网络缓慢请稍后重试", {time: 1000});
                    }
                });
            };

            /**
             * 所有分类数据
             */
            $scope.classificationBigList = [
                {name: '一级建造师', findName: ''},
                {name: '二级建造师', findName: ''},
                {name: '土木工程师', findName: ''},
                {name: '结构师', findName: ''},
                {name: '公用设备工程师', findName: ''},
                {name: '电气工程师', findName: ''},
                {name: '监理师', findName: ''},
                {name: '造价师', findName: ''},
                {name: '电气工程师', findName: ''},
                {name: '注册咨询师', findName: ''},
                {name: '资质办理与升级', findName: ''},
                {name: '职称证书', findName: ''},
                {name: '建筑师', findName: ''},
                {name: '其他执业证书', findName: ''},
                {name: '一级防护工程师', findName: ''},
                {name: '二级防护工程师', findName: ''},
                {name: '注册消防工程师', findName: ''},
                {name: '八大员', findName: ''}
            ];
            /**
             * 所有小类数据
             * @type {[null,null,null,null,null]}
             */
            $scope.classificationSmallList = [
                {name: '城市规划师', findName: ''},
                {name: '化工工程师', findName: ''},
                {name: '环评工程师', findName: ''},
                {name: '房地产估价师', findName: ''},
                {name: '注册税务师', findName: ''}
            ];
            /**
             * 地区
             * @type {[null,null,null,null,null]}
             */
            $scope.allAreasList = [
                {name: '北京', findName: ''},
                {name: '四川', findName: ''},
                {name: '江苏', findName: ''},
                {name: '上海', findName: ''},
                {name: '广东', findName: ''},
                {name: '山东', findName: ''},
                {name: '河北', findName: ''},
                {name: '浙江', findName: ''},
                {name: '陕西', findName: ''},
                {name: '安徽', findName: ''},
                {name: '重庆', findName: ''},
                {name: '湖北', findName: ''},
                {name: '河南', findName: ''},
                {name: '福建', findName: ''}
            ];
            $scope.allAreasList1 = [
                {name: '丰台区', findName: ''},
                {name: '海淀区', findName: ''},
                {name: '门头沟', findName: ''},
                {name: '朝阳区', findName: ''},
                {name: '通州区', findName: ''},
                {name: '东城区', findName: ''},
                {name: '顺义区', findName: ''},
                {name: '延庆县', findName: ''}
            ];
            $scope.updateInfoList= function (key,item,idArea) {
                switch (key) {
                    case 1: // 所有大分类
                        $scope.infoList.idClassification1=item;
                        $scope.zYList = [];
                        $scope.infoList.idClassification2="";
                        angular.forEach($scope.classificationList, function (data, index) {
                            if ($scope.classificationList[index].relation == idArea) {
                                $scope.zYList.push(data);
                            }

                            console.log($scope.classificationList);
                            console.log($scope.zYList);
                        });
                        break;
                    case 2: // 所有晓分类
                        $scope.infoList.idClassification2=item;
                        break;
                    case 3: // 所有大区
                        $scope.infoList.idArea1=item;
                            $scope.quYuList = [];
                            $scope.infoList.idArea2="";
                            angular.forEach($scope.regionalList, function (data, index) {
                                if ($scope.regionalList[index].relation == idArea) {
                                    $scope.quYuList.push(data)
                                }
                            });
                        break;
                    case 4: // 所有小地区
                        $scope.infoList.idArea2=item;
                        break;
                }
                $scope.getInfoList();
            };
            $scope.getInfoList= function () {
                var keyword={
                    "type":$scope.active,
                    "idClassification":$scope.infoList.idClassification2?$scope.infoList.idClassification2:$scope.infoList.idClassification1,
                    "idArea":$scope.infoList.idArea2?$scope.infoList.idArea2:$scope.infoList.idArea1
                };
                $$neptune.find(constants.REQUEST_TARGET.GET_INFORMATION_LIST, keyword, {
                    onSuccess: function (data) {
                        $scope.informationLists=data
                    },
                    onError: function (e) {
                        alert("网络缓慢请稍后重试");
                    }
                });
            };
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info) {
                $scope.active = info;
                $scope.getInfoList();
                $scope.Initialize();
                $scope.b()
            };

            if($stateParams.id){
                $scope.active = $stateParams.id;
                $scope.getInfoList();
            }else{
                $scope.active="个人挂证";
                $scope.getInfoList();
            }
            var init = function () {
                $scope.getRegional()
            };
            init();
        }]);

});
